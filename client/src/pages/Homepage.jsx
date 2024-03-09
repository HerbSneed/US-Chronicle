import { useEffect, useRef, useState } from "react";
import { useWindowSize } from "../utils/windowSize";
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
import HeadlineCard from "../components/headline-card";
import MoreHeadlinesCard from "../components/more-headlines-card";


const Homepage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const fetchNewsCalled = useRef(false);
  const { currentUser, isLoggedIn } = useCurrentUserContext();
  const [saveNewsMutation] = useMutation(SAVE_NEWS);
  const [selectedCategory, setSelectedCategory] = useState("Top News");
  const navigate = useNavigate();
  const { searchQuery } = useParams();
  const { width } = useWindowSize(); // Get window width
  const sliceEnd =
    width >= 1536 ? 3 : width >= 1280 ? 3 : width >= 1024 ? 2 : 1;
  const moreNewsSliceEnd =
    width >= 1536 ? 31 : width >= 1280 ? 30 : width >= 1024 ? 15 : 15;

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

        if (!userData || userData.userDefaultNews === "Top News") {
          response = await getUsHeadlines();
        } else if (searchQuery) {
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
          .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
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
    const alreadySaved = userData.savedNews.some((savedNews) => {
      return savedNews.newsId === news.newsId;
    });

    if (alreadySaved) {
      alert("News already saved");
      return;
    }

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
      case "Top News":
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
      <div id="homepage-container">
        <section
          id="category-links"
          className="bg-white h-10 sm:h-12 py-1.5 sm:py-2 overflow-hidden"
        >
          <CategoryHeader
            onCategoryChange={handleCategoryChange}
            categories={categories}
          />
        </section>

        <div className="flex pt-0 sm:pt-2 border-t-[1px] w-screeen border-gray-400"></div>

        <section
          id="top-news"
          className="grid grid-cols-1 2xl:w-7/12 xl:w-8/12 lg:w-8/12 lg:float-right 2xl:float-right gap-x-2 xl:gap-y-4  gap-y-0 pb-1 mx-3 2xl:mx-5 bg-white"
        >
          <h2 className="text-5xl sm:text-5xl  xl:-mb-5 sm:text-6xl 2xl:text-6xl font-[Newsreader] ml-0 mt-3 2xl:ml-0 font-semibold drop-shadow-lg">
            {selectedCategory}
          </h2>

          {newsItems.slice(0, sliceEnd).map((news) => (
            <HeadlineCard
              key={news.newsId}
              news={news}
              handleSaveArticle={handleSaveArticle}
              currentUser={currentUser}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </section>

        <section
          id="more-news-hl"
          className="grid grid-cols-1  mx-3 mt-0 2xl:mt-[0px] mb-2"
        >
          <h2 className="text-2xl md:text-center xl:text-center 2xl:text-4xl text-white px-2 py-1 lg:py-1 2xl:pt-2 sm:text-3xl 2xl:text-3xl bg-blue-600 font-[Newsreader] ml-0 mt-0 2xl:ml-0 font-semibold drop-shadow-lg">
            More {selectedCategory} Headlines
          </h2>

          {newsItems.slice(sliceEnd, moreNewsSliceEnd).map((news) => (
            <MoreHeadlinesCard
              key={news.newsId}
              news={news}
              handleSaveArticle={handleSaveArticle}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Homepage;
