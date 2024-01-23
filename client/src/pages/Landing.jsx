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
} from "../utils/news-api";
import CategoryHeader from "../components/Category-Header";
import { useCurrentUserContext } from "../context/CurrentUser";
import { QUERY_CURRENT_USER } from "../utils/queries";
import { SAVE_NEWS } from "../utils/mutations";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";

const Landing = () => {
  const [newsItems, setNewsItems] = useState([]);
  const fetchNewsCalled = useRef(false);
  const { currentUser } = useCurrentUserContext();
  const [saveNewsMutation] = useMutation(SAVE_NEWS);
  const [selectedCategory, setSelectedCategory] = useState("Top Headlines");

  const categories = [
    "Top News",
    "Business",
    "Entertainment",
    "Health",
    "Science",
    "Sports",
    "Technology",
  ];

  // QUERY_CURRENT_USER
  const { data } = useQuery(QUERY_CURRENT_USER, {
    variables: { email: currentUser.email },
  });
  const userData = data?.currentUser || null;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        if (!userData || !userData.userDefaultNews) {
          console.log("No user data or default news. Returning...");
          return;
        }

        const userCategory = userData.userDefaultNews.trim();
        const response = userCategory
          ? await getUserHeadlines(userCategory)
          : await getUsHeadlines();

        console.log("Response from API:", response);

        if (!response || !response.ok) {
          console.error("Error in response:", response);
          return;
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
  }, [userData]);

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
      .then((response) => {
        // Handle the response, update UI, etc.
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
      });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleCategoryClick = async (category) => {
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
      headlines = await response.json();
      // Process the API response and update state
      console.log("API Response:", response);
      // Update state based on the response
      // ...
    } catch (error) {
      console.error("Error in API call:", error);
    }

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
        className="bg-white h-10 w-full border-b-[1px] border-gray-200 overflow-hidden sm:grid-cols-3 py-2"
      >
        <CategoryHeader
          onCategoryChange={handleCategoryChange}
          categories={categories} // Make sure to pass the categories prop
          onCategoryClick={handleCategoryClick}
        />
      </section>

      <div className="mx-3 flex pt-2">
        <h2 className="text-3xl font-semibold">{selectedCategory}</h2>
      </div>

      <section
        id="top-news"
        className="grid grid-cols-1 sm:grid-cols-3 gap-x-2 gap-y-2 py-2 mx-3 bg-white border-b-[1px] border-newsBlue "
      >
        {newsItems.slice(0, 1).map((news, index) => (
          <div key={news.newsId} className="bg-white rounded-xl">
            <div className={`${index === 5 ? "" : ""}`}>
              {news.image && (
                <img
                  className="w-full rounded-t-md"
                  src={news.image}
                  alt={`Image for ${news.title}`}
                />
              )}

              <div className="mt-0">
                <h4 className="text-xs text-gray-900">
                  Updated {news.latest_publish_date}
                </h4>

                {/* Wrap the title in an anchor tag */}
                <h3 className="font-bold my-1 text-gray-900 text-sm">
                  <a href={news.url} target="_blank" rel="noopener noreferrer">
                    {news.title}
                  </a>
                </h3>

              </div>
            </div>
          </div>
        ))}

        {newsItems.length === 0 && (
          <p className="text-gray-500">
            There is no available news for this country.
          </p>
        )}
      </section>

      <section
        id="more-news-hl"
        className="grid grid-cols-1 gap-y-2 py-1 mt-1 mx-3"
      >
        {newsItems.slice(1, 20).map((news, index) => (
          <div key={news.newsId}>
            <div
              className={`${
                index === newsItems.length - 2
                  ? ""
                  : "border-b-[1px] border-newsBlue"
              }`}
            >
              {/* Wrap the title in an anchor tag */}
              <h3 className="flex justify-right font-bold p-0">
                <a
                  className=""
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {news.title}
                </a>
              </h3>
              <h4 className="text-sm -mt-1">
                Updated {news.latest_publish_date}
              </h4>
              <h4>
              </h4>
            </div>
          </div>
        ))}

        {newsItems.length === 0 && (
          <p className="text-gray-500">
            There is no available news for this country.
          </p>
        )}
      </section>
      <Footer />
    </>
  );
};

export default Landing;
