// SearchResults.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/search-bar.jsx";
import SearchResultsCard from "../components/search-results-card.jsx";
import { getSearchedHeadlines } from "../utils/news-api.js";

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

const Search = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("latest");
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    // Read query parameters when the location changes
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");

    console.log("Query:", query)

    // Set the search query
    setSearchQuery(query);
  }, [location.search]);

  useEffect(() => {
    const fetchSearchedNews = async () => {
      try {
        const response = await getSearchedHeadlines(searchQuery);

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

  if (searchQuery !== "latest") {
    fetchSearchedNews();
  }

  }, [searchQuery]);

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
      <div className="mt-3">
        <SearchBar/>
      </div>

      <section className="min-h-screen relative flex flex-col py-5 w-full bg-bgGray bg-cover">
        <div className="z-20 bg-compBlue pb-10 w-full drop-shadow-lg rounded-md max-h-[80vh]">
          <h1 className="z-20 text-4xl font-semibold text-center text-blue-500">
            Search Results
          </h1>
        <div>
          {newsItems.map((news) => (
          <SearchResultsCard
            key={news.newsId}
            newsId={news.newsId}
            title={news.title}
            summary={news.summary}
            image={news.image}
            latest_publish_date={news.latest_publish_date}
            />
          ))}
        </div>
        </div>
      </section>
    </>
  );
};

export default Search;
