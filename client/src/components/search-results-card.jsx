import { memo } from "react";
import { useCurrentUserContext } from "../context/CurrentUser";

// Memoized SearchResultsCard component
const SearchResultsCard = memo(({ news, handleSaveArticle }) => {
  // Access isLoggedIn function from CurrentUserContext
  const { isLoggedIn } = useCurrentUserContext();

  // If news is null, return null
  if (!news) {
    return null;
  }

  return (
    <>
      <div className="mb-2 bg-gray-300 mx-4 px-2 pt-2 rounded">
        <div key={news.newsId} className="w-full items-center">
          <div className="">
            <h1 className="font-bold text-gray-900 text-lg leading-[20px] truncate">
              {news.title}
            </h1>
          </div>
        </div>

        <h2 className="text-xs mt-0.5 text-gray-900">
          Updated {news.latest_publish_date}
        </h2>

        {isLoggedIn() && (
          <div className="flex font-normal">
            <a
              href={news.url}
              target="_blank"
              className="text-blue-700"
              rel="noopener noreferrer"
              role="button"
              tabIndex="0"
            >
              Source
            </a>
            <a
              target="_blank"
              className="text-red-700 ml-3"
              onClick={() => handleSaveArticle(news)}
              rel="noopener noreferrer"
              role="button"
              tabIndex="0"
            >
              Save Article
            </a>
          </div>
        )}
      </div>
    </>
  );
});

SearchResultsCard.displayName = "SearchResultsCard";

export default SearchResultsCard;
