import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { getUsHeadlines, getBusinessHeadlines, getEntertainmentHeadlines, getHealthHeadlines, getScienceHeadlines, getSportsHeadlines, getTechnologyHeadlines, getUserHeadlines, getSearchedHeadlines } from "../utils/news-api";
import CategoryHeader from "../components/Category-Header";
import { useCurrentUserContext } from "../context/CurrentUser";
import { QUERY_CURRENT_USER } from "../utils/queries";
import { SAVE_NEWS } from "../utils/mutations";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";

const Homepage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const fetchNewsCalled = useRef(false);
  const { currentUser, isLoggedIn } = useCurrentUserContext();
  const [saveNewsMutation] = useMutation(SAVE_NEWS);
  const [selectedCategory, setSelectedCategory] = useState("Top Headlines");
  const [sidebarCatagory, setSidebarCategory] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");
    setSidebarCategory(query);
    console.log("sidebarCatagory:", sidebarCatagory);
  }, [location.search, sidebarCatagory]);

  useEffect(() => {
    const fetchSearchedNews = async () => {
      try {
        const response = await getSearchedHeadlines(sidebarCatagory);

        if (!response.ok) {
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
      }
    };

    if (sidebarCatagory !== "") {
      fetchSearchedNews();
    }
  }, [sidebarCatagory]);


  useEffect(() => {
    const fetchNews = async () => {
      try {
        let response;

        if (!userData) {
          response = await getUsHeadlines();
        } else {
          const userCategory = userData.userDefaultNews.trim();
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
        className="bg-white h-10 w-full border-b-[1px] border-gray-200 overflow-hidden sm:grid-cols-3 py-2"
      >
        <CategoryHeader
          onCategoryChange={handleCategoryChange}
          categories={categories}
        />
      </section>

      <div className="mx-3 flex pt-4">
        <h2 className="text-4xl font-[Newsreader] font-semibold drop-shadow-lg">
          {selectedCategory}
        </h2>
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
                  className="w-full rounded-t-md shadow-md"
                  src={news.image}
                  alt={`Image for ${news.title}`}
                />
              )}

              <div className="mt-1">
                <h4 className="text-xs text-gray-900">
                  Updated {news.latest_publish_date}
                </h4>

                {/* Wrap the title in an anchor tag */}
                <h3 className="font-bold text-gray-900 text-[30px]">
                  {news.title}
                </h3>

                {isLoggedIn() && (
                  <div className="flex justify-between">
                    <a
                      href={news.url}
                      target="_blank"
                      className="text-blue-600"
                      rel="noopener noreferrer"
                    >
                      Source
                    </a>
                    <a
                      target="_blank"
                      className="text-red-600"
                      onClick={() => handleSaveArticle(news)}
                      rel="noopener noreferrer"
                    >
                      Save Article
                    </a>
                  </div>
                )}
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
              <h4 className="text-sm">Updated {news.latest_publish_date}</h4>
              <h4>
                {isLoggedIn() && (
                  <div className="flex justify-between mb-2">
                    <a
                      href={news.url}
                      target="_blank"
                      className="text-blue-600"
                      rel="noopener noreferrer"
                    >
                      Source
                    </a>
                    <a
                      target="_blank"
                      className="text-red-600"
                      onClick={() => handleSaveArticle(news)}
                      rel="noopener noreferrer"
                    >
                      Save Article
                    </a>
                  </div>
                )}
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

export default Homepage;