import React from "react";
import { useCurrentUserContext } from "../context/CurrentUser";

const SearchResultsCard = React.memo(({ news, handleSaveArticle }) => {
  const { isLoggedIn } = useCurrentUserContext();

    if (!news) {
      return null; 
    }

  return (
    <>
      <div className="mb-2 bg-gray-300 mx-4 p-2 rounded">
      <div
        key={news.newsId}
        className="w-full items-center"
      >
        <div className="">
          <h3 className="font-bold text-gray-900 text-lg leading-[20px] truncate">
            {news.title}
          </h3>
        </div>
        
      </div>

      <h4 className="text-xs mt-0.5 text-gray-900">
        Updated {news.latest_publish_date}
      </h4>

      {isLoggedIn() && (
        <div className="flex font-normal">
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
            className="text-red-600 ml-3"
            onClick={() => handleSaveArticle(news)}
            rel="noopener noreferrer"
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
