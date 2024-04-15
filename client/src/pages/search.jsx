// SearchResults.jsx
import { useState, useEffect } from "react";
import { useWindowSize } from "../utils/windowSize";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/search-bar.jsx";
import SearchResultsCard from "../components/search-results-card.jsx";
import { useMutation, useQuery } from "@apollo/client";
import { SAVE_NEWS } from "../utils/mutations";
import { QUERY_CURRENT_USER } from "../utils/queries";
import { useCurrentUserContext } from "../context/CurrentUser";
import axios from "axios";

const Search = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("latest");
  const [newsItems, setNewsItems] = useState([]);
  const [saveNewsMutation] = useMutation(SAVE_NEWS);
  const { currentUser } = useCurrentUserContext();
  const { width } = useWindowSize();
  const sliceEnd =
    width >= 1536 ? 42 : width >= 1280 ? 28 : width >= 1024 ? 28 : width >= 768 ? 20 : 20;

  const { data } = useQuery(QUERY_CURRENT_USER, {
    variables: { email: currentUser.email },
  });
  const userData = data?.currentUser || null;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");
    setSearchQuery(query);
  }, [location.search]);

useEffect(() => {
  const fetchSearchedNews = async () => {
    try {
      let response;
      response = await axios.get(`api/search?searchQuery=${searchQuery}`);

      if (response.status !== 200) {
        console.error("Error in response:", response);
        return;
      }

      const headlines = response.data;

      const uniqueNewsItems = new Set(); // Use a set to keep track of unique news items

      headlines.articles.forEach((news) => {
        if (
          news.urlToImage !== null &&
          news.title !== "[Removed]" &&
          news.title !== "null" &&
          news.status !== "410" &&
          news.status !== "404"
        ) {
          const newsId = news.publishedAt + news.title + news.source.name;

          
          if (!uniqueNewsItems.has(newsId)) {
            uniqueNewsItems.add(newsId);

            const formattedNews = {
              newsId: newsId,
              title: news.title,
              image: news.urlToImage,
              url: news.url,
              summary: news.description || "Summary not available.",
              source_country: news.source.name,
              latest_publish_date: formatDateTime(news.publishedAt),
            };

            setNewsItems((prevNewsItems) => [...prevNewsItems, formattedNews]);
          }
        }
      });
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
      <div id="searchPage-container" className="flex flex-col min-h-screen">
      <div className="mt-3">
        <SearchBar />
      </div>

      <section className="min-h-screen relative pt-2 mx-auto pb-5 w-full bg-cover">
        <div className="z-20 bg-compBlue pb-10 w-full drop-shadow-lg max-h-[80vh]">
          <h1 className="z-20 text-5xl drop-shadow-md font-semibold font-[Newsreader] text-center text-blue-500">
            Search Results
          </h1>

          <div className="grid grid-cols-1  sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
            {newsItems.slice(0, sliceEnd).map((news) => (
              <SearchResultsCard
                key={news.newsId}
                news={news}
                handleSaveArticle={handleSaveArticle}
              />
            ))}
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Search;
