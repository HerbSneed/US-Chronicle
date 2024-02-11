import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  getUsHeadlines,
  getBusinessHeadlines,
  getEntertainmentHeadlines,
  getHealthHeadlines,
  getScienceHeadlines,
  getSportsHeadlines,
  getTechnologyHeadlines,
  getUserHeadlines,
  getSearchedHeadlines,
} from "../utils/news-api";
import CategoryHeader from "../components/Category-Header";
import { useCurrentUserContext } from "../context/CurrentUser";
import { QUERY_CURRENT_USER } from "../utils/queries";
import { SAVE_NEWS } from "../utils/mutations";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import HomepageCard from "../components/homepage-card";
import MoreHeadlinesCard from "../components/more-headlines-card";

const Homepage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const fetchNewsCalled = useRef(false);
  const { currentUser, isLoggedIn } = useCurrentUserContext();
  const [saveNewsMutation] = useMutation(SAVE_NEWS);
  const [selectedCategory, setSelectedCategory] = useState("Top Headlines");
  const navigate = useNavigate();
  const { searchQuery } = useParams();

  const categories = [
    "Top News",
    "Business",
    "Entertainment",
    "Health",
    "Science",
    "Sports",
    "Technology",
  ];

  const { data } = useQuery(QUERY_CURRENT_USER, {
    variables: { email: currentUser.email },
  });
  const userData = data?.currentUser || null;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        let response;

        if (!userData) {
          response = await getUsHeadlines();
        } else if (searchQuery) {
          console.log(searchQuery);
          setSelectedCategory([searchQuery]);
          response = await getSearchedHeadlines(searchQuery);
        } else {
          const userCategory = userData.userDefaultNews.trim();
          setSelectedCategory(userCategory);
          response = await getUserHeadlines(userCategory);
          console.log("Response from API:", response);
        }

        if (!response || !response.ok) {
          console.error("Error in response:", response);
          return;
        }

        if (typeof isLoggedIn === "function" && !isLoggedIn()) {
          console.log("User not logged in. Navigating to default homepage");
          navigate("/");
        }

        const headlines = await response.json();

        const newsData = headlines.articles
          .filter((news) => {
            return (
              news.urlToImage !== null &&
              news.title !== "[Removed]" &&
              news.status !== "410" &&
              news.status !== "404"
            );
          })
          .map((news) => ({
            newsId: news.publishedAt + news.title,
            title: news.title,
            image: news.urlToImage,
            url: news.url,
            summary: news.description || "Summary not available.",
            source_country: news.source.name,
            latest_publish_date: formatDateTime(news.publishedAt),
          }));

        setNewsItems(newsData);
      } catch (err) {
        console.error("Error in fetchNews:", err);
      } finally {
        fetchNewsCalled.current = true;
      }
    };

    fetchNews();
  }, [searchQuery, userData, isLoggedIn, navigate]);

  const handleSaveArticle = (news) => {
    // Call the mutation to save the news
    saveNewsMutation({
      variables: {
        saveNews: {
          newsId: news.newsId,
          title: news.title,
          summary: news.summary,
          source_country: news.source_country,
          url: news.url,
          image: news.image,
          language: news.language,
          latest_publish_date: news.latest_publish_date,
        },
      },
    })
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCategoryChange = async (category) => {
    console.log("Category changed:", category);
    setSelectedCategory(category);

    let apiFunction;
    let headlines;

    switch (category) {
      case "Top Headlines":
        apiFunction = getUsHeadlines;
        break;
      case "Business":
        apiFunction = getBusinessHeadlines;
        break;
      case "Entertainment":
        apiFunction = getEntertainmentHeadlines;
        break;
      case "Health":
        apiFunction = getHealthHeadlines;
        break;
      case "Science":
        apiFunction = getScienceHeadlines;
        break;
      case "Sports":
        apiFunction = getSportsHeadlines;
        break;
      case "Technology":
        apiFunction = getTechnologyHeadlines;
        break;
      default:
        apiFunction = getUsHeadlines;
    }

    try {
      const response = await apiFunction();
      console.log("API Response:", response);

      if (!response.ok) {
        console.error("Error in API response:", response.statusText);
        return;
      }

      headlines = await response.json();
      console.log("Parsed API Response:", headlines);

      if (!headlines || headlines.loading) {
        console.log("Loading headlines...");
        return;
      }

      const newsData = headlines.articles
        .filter((news) => {
          return (
            news.urlToImage !== null &&
            news.title !== "[Removed]" &&
            news.status !== "410" &&
            news.status !== "404"
          );
        })
        .map((news) => ({
          newsId: news.publishedAt + news.title,
          title: news.title,
          image: news.urlToImage,
          url: news.url,
          summary: news.description || "Summary not available.",
          source_country: news.source.name,
          latest_publish_date: formatDateTime(news.publishedAt),
        }));

      setNewsItems(newsData);
    } catch (error) {
      console.error("Error in handleCategoryClick:", error);
    }
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    date.setDate(date.getDate() + 1);

    const options = {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZoneName: "short",
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return formattedDate;
  };

  return (
    <>
      <section
        id="category-links"
        className="bg-white h-10 sm:h-12 mr-5 py-1.5 sm:py-2 overflow-hidden"
      >
        <CategoryHeader
          onCategoryChange={handleCategoryChange}
          categories={categories}
        />
      </section>

      <div className="flex pt-2 border-t-[1px] w-screeen border-gray-400">
        <h2 className="text-4xl font-[Newsreader] ml-3 font-semibold drop-shadow-lg">
          {selectedCategory}
        </h2>
      </div>

      <section
        id="top-news"
        className="grid grid-cols-1 gap-x-2 gap-y-2 pb-1 mx-3 bg-white border-b-[1px] border-newsBlue "
      >
        {newsItems.slice(0, 1).map((news) => (
          <HomepageCard
            key={news.newsId}
            news={news}
            handleSaveArticle={handleSaveArticle}
          />
        ))}
      </section>

      <section
        id="more-news-hl"
        className="grid grid-cols-1 mx-3"
      >
        {newsItems.slice(1, 20).map((news) => (
          <MoreHeadlinesCard
            key={news.newsId}
            news={news}
            handleSaveArticle={handleSaveArticle}
          />
        ))}
      </section>

      <Footer />
    </>
  );
};

export default Homepage;
