// SearchResults.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/search-bar.jsx";
import SearchResultsCard from "../components/search-results-card.jsx";
import { getSearchedHeadlines } from "../utils/news-api.js";
import { useMutation } from "@apollo/client";
import { SAVE_NEWS } from "../utils/mutations";

const Search = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("latest");
  const [newsItems, setNewsItems] = useState([]);
  const [saveNewsMutation] = useMutation(SAVE_NEWS);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");
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
        <SearchBar />
      </div>

      <section className="min-h-screen relative pt-2 pb-5 w-full bg-cover">
        <div className="z-20 bg-compBlue pb-10 w-full drop-shadow-lg max-h-[80vh]">
          <h1 className="z-20 text-5xl drop-shadow-md font-semibold font-[Newsreader] text-center text-blue-500">
            Search Results
          </h1>

          <div className="grid lg:grid-cols-2 2xl:grid-cols-3">
            {newsItems.map((news) => (
              <SearchResultsCard
                key={news.newsId}
                news={news}
                handleSaveArticle={handleSaveArticle}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Search;
