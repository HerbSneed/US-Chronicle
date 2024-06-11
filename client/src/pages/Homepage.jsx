import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useWindowSize } from "../utils/windowSize";
import { useCurrentUserContext } from "../context/CurrentUser";
import { QUERY_CURRENT_USER } from "../utils/queries";
import Footer from "../components/Footer";
import HeadlineCard from "../components/headline-card";
import MoreHeadlinesCard from "../components/more-headlines-card";
import CategoryHeader from "../components/Category-Header";

const Homepage = () => {
  const { get } = axios;
  const { currentUser, isLoggedIn } = useCurrentUserContext();
  const [newsItems, setNewsItems] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const [selectedCategory, setSelectedCategory] = useState("Top News");

  const sliceEnd =
    width >= 1536 ? 4 : width >= 1280 ? 4 : width >= 1024 ? 2 : 1;
  const moreNewsSliceEnd =
    width >= 1536 ? 38 : width >= 1280 ? 35 : width >= 1024 ? 15 : 15;

  const { data } = useQuery(QUERY_CURRENT_USER, {
    variables: { email: currentUser.email },
  });

  const userData = data?.currentUser || null;  const categories = [
    "Top News",
    "Business",
    "Entertainment",
    "Health",
    "Science",
    "Sports",
    "Technology",
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    navigate(`/category=${encodeURIComponent(category)}`);
  };

  const fetchNewsByLink = async (link) => {
    try {
      const response = await get(`/api/search?searchQuery=${link}`);
      return response;
    } catch (error) {
      console.error("Error fetching news by link:", error);
      return null;
    }
  };

  const fetchUsHeadlines = async () => {
    try {
      const response = await get("/api/usheadlines");
      return response;
    } catch (error) {
      console.error("Error fetching US headlines:", error);
      return null;
    }
  };

  const fetchUserHeadlines = async (category) => {
    try {
      const response = await get(`/api/userheadlines?category=${category}`);
      return response;
    } catch (error) {
      console.error("Error fetching user headlines:", error);
      return null;
    }
  };

  const fetchCategoryHeadlines = async (category) => {
    try {
      const response = await get(`/api/categoryheadlines?category=${category}`);
      return response;
    } catch (error) {
      console.error("Error fetching category headlines:", error);
      return null;
    }
  };

  const handleResponse = (response) => {
    if (response && response.status === 200) {
      const headlines = response.data;

      if (!headlines || !headlines.articles) {
        console.error("Invalid response format:", headlines);
        return;
      }

      if (!isLoggedIn()) {
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
          const newsId =
            currentNews.publishedAt +
            currentNews.title +
            currentNews.source_country;
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
    } else {
      console.error("Invalid response:", response);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;

        if (queryParams.has("link")) {
          const link = queryParams.get("link");
          setSelectedCategory(link)
          response = await fetchNewsByLink(link);
        } else if (!isLoggedIn()) {
          response = await fetchUsHeadlines();
          console.log(response)
        } else if (userData?.userDefaultNews && !queryParams.has("category")) {
          const userCategory = userData.userDefaultNews;
          setSelectedCategory(userCategory);
          response = await fetchUserHeadlines(userData.userDefaultNews);
        } else if (userData?.userDefaultNews && queryParams.has("category")) {
          const category = queryParams.get("category");
          if (category === "Top News") {
            response = await fetchUsHeadlines();
          } else {
          setSelectedCategory(category);
          response = await fetchCategoryHeadlines(selectedCategory);
          }
        } else {
          return;
        }

        if (response) {
          handleResponse(response);
        } else {
          console.error("Fetch function returned null");
        }
      } catch (err) {
        console.error("Error in fetchData:", err);
      }
    };

    fetchData();
  }, [userData, isLoggedIn, selectedCategory, get, navigate ]);

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
      <CategoryHeader
        categories={categories}
        onCategoryChange={handleCategoryChange}
      />
      <div id="homepage-container">
        <div className="flex pt-1 mt-2 sm:pt-2 border-t-[1px] w-full border-gray-500"></div>

        <section
          id="top-news"
          className="grid grid-cols-1 2xl:w-7/12 xl:w-8/12 lg:w-8/12 lg:float-right 2xl:float-right gap-x-2 xl:gap-y-4  gap-y-0 pb-1 mx-3 2xl:mx-3 bg-white"
        >
          <h1
            id="mainHeadlineHeader"
            className="text-4xl sm:text-5xl 2xl:text-[55px] text-blue-600 font-[Newsreader] ml-0 mt-2 lg:mt-2 xl:mt-2 mb-1 lg:-mb-0 xl:-mb-4 2xl:ml-0 font-semibold drop-shadow-lg"
          >
            {selectedCategory}
          </h1>

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
          <h2 className="text-2xl 
          md:text-center 
          xl:text-center
          lg:text-[30px] 
          text-white 
          px-2 pt-1 
          lg:pt-2.5 
          lg:py-2 
          2xl:pt-3 
          sm:text-3xl 
          2xl:text-4xl 
          bg-blue-600 
          font-[Newsreader] 
          ml-0 mb-1  2xl:ml-0 font-semibold drop-shadow-lg">
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
      </div>

      <Footer />
    </>
  );
};

export default Homepage;
