import { useEffect, useState } from "react";
import { useWindowSize } from "../utils/windowSize";
import { useQuery, useMutation } from "@apollo/client";
import CategoryHeader from "../components/Category-Header";
import { useCurrentUserContext } from "../context/CurrentUser";
import axios from "axios";
import { QUERY_CURRENT_USER } from "../utils/queries";
import { SAVE_NEWS } from "../utils/mutations";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import HeadlineCard from "../components/headline-card";
import MoreHeadlinesCard from "../components/more-headlines-card";

const Homepage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const { currentUser, isLoggedIn } = useCurrentUserContext();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [saveNewsMutation] = useMutation(SAVE_NEWS);
  const [selectedCategory, setSelectedCategory] = useState("Top News");
  const [userDefaultCategory, setUserDefaultCategory] = useState("");
  const navigate = useNavigate();
  const link = queryParams.get("link");
  const { width } = useWindowSize();
  const sliceEnd =
    width >= 1536 ? 4 : width >= 1280 ? 4 : width >= 1024 ? 2 : 1;
  const moreNewsSliceEnd =
    width >= 1536 ? 38 : width >= 1280 ? 35 : width >= 1024 ? 15 : 15;

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
    const fetchData = async () => {
      try {
        let response;

        if (link) {
          response = await axios.get(`api/search?searchQuery=${link}`);
        } else if (userData && userData.userDefaultNews !== "Top News") {
          const userCategory = userData.userDefaultNews;
          response = await axios.get(
            `api/userheadlines?category=${userCategory}`
          );
          setUserDefaultCategory(userCategory);
          setSelectedCategory(userCategory);
        } else {
          response = await axios.get("/api/usheadlines");
        }

        if (response && response.status === 200) {
          const headlines = response.data;

          if (typeof isLoggedIn === "function" && !isLoggedIn()) {
            navigate("/");
          }

          const filteredNewsData = headlines.articles
            .filter(
              (news) =>
                news.urlToImage !== null &&
                news.url !== null &&
                news.title !== "[Removed]" &&
                news.status !== "410" &&
                news.status !== "404"
            )
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .reduce((accumulator, currentNews) => {
              const newsId = currentNews.publishedAt + currentNews.title;
              if (!accumulator.some((news) => news.newsId === newsId)) {
                accumulator.push({
                  newsId: newsId,
                  title: currentNews.title,
                  image: currentNews.urlToImage,
                  url: currentNews.url,
                  summary: currentNews.description || "Summary not available.",
                  source_country: currentNews.source.name,
                  latest_publish_date: formatDateTime(currentNews.publishedAt),
                });
              }
              return accumulator;
            }, []);

          setNewsItems(filteredNewsData);
          if (link) {
            setSelectedCategory(link);
          }
        } else {
          console.error("Invalid response:", response);
        }
      } catch (err) {
        console.error("Error in fetchData:", err);
      }
    };

    fetchData();
  }, [link, userData]);

  const fetchNewsByCategory = async (category) => {
    try {
      let response;

      if (category === "Top News") {
        response = await axios.get("/api/usheadlines");
      } else {
        response = await axios.get(
          `/api/categoryheadlines?category=${category}`
        );
        console.log(category);
      }

      if (response.status === 200) {
        const headlines = response.data;

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
        setSelectedCategory(category);
      } else {
        console.error("Invalid response:", response);
      }
    } catch (err) {
      console.error("Error in fetchNewsByCategory:", err);
    }
  };

  const handleCategoryChange = async (category) => {
    if (category === selectedCategory) return;
    setSelectedCategory(category);
    fetchNewsByCategory(category);
  };

  const handleLogoClick = () => {
    setSelectedCategory(userDefaultCategory);
    fetchNewsByCategory(userDefaultCategory);
  };

  const handleSaveArticle = (news) => {
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
            defaultCategory={userDefaultCategory}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            onLogoClick={handleLogoClick}
            categories={categories}
          />
        </section>

        <div className="flex pt-0 sm:pt-2 border-t-[1px] w-screeen border-gray-400"></div>

        <section
          id="top-news"
          className="grid grid-cols-1 2xl:w-7/12 xl:w-8/12 lg:w-8/12 lg:float-right 2xl:float-right gap-x-2 xl:gap-y-4  gap-y-0 pb-1 mx-3 2xl:mx-5 bg-white"
        >
          <h2
            id="mainHeadlineHeader"
            className="text-4xl sm:text-5xl 2xl:text-6xl text-blue-600 font-[Newsreader] ml-0 mt-3 xl:-mb-5 2xl:ml-0 font-semibold drop-shadow-lg"
          >
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

        <section id="more-news-hl" className="grid grid-cols-1 mx-3 mb-2">
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
