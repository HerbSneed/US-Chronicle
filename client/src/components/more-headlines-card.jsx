import React from "react";
import { useCurrentUserContext } from "../context/CurrentUser";

const MoreHeadlinesCard = React.memo(({ news, handleSaveArticle, isLastItem}) => {
  const { isLoggedIn } = useCurrentUserContext();
  
  return (
    <>
      <div
        key={news.newsId}
        className={`bg-gray-200 mt-1 px-2 py-1 ${isLastItem ? "border-none" : "bg-gray-200"}`}
      >
        <div className={`${news.index === 5 ? "" : ""}`}>
          <div className="mt-0">
            <h3 className="font-bold text-gray-900 text-[17px] sm:text-[20px] md:text-[23px]  truncate">
              {news.title}
            </h3>
            <h4 className="text-xs md:text-sm -mt-1 text-gray-900">
              {news.latest_publish_date}
            </h4>

            {isLoggedIn() && (
              <div className="flex -mt-1 sm:-mt-0.5 lg:-mt-1 2xl:-mt-1">
                <a
                  href={news.url}
                  target="_blank"
                  className="text-sm sm:text-md md:text-lg text-blue-600"
                  rel="noopener noreferrer"
                >
                  Source
                </a>
                <a
                  target="_blank"
                  className="text-sm sm:text-md md:text-lg text-red-600 ml-5"
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
    </>
  );
});

MoreHeadlinesCard.displayName = "MoreHeadlinesCard";

export default MoreHeadlinesCard;
