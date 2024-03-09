import React from "react";
import { useCurrentUserContext } from "../context/CurrentUser";

const HeadlineCard = React.memo(({ news, handleSaveArticle}) => {
  const { isLoggedIn } = useCurrentUserContext();
  
  return (
    <>
      <div key={news.newsId} className="bg-white">
        <div className={`${news.index === 0 ? "" : ""}`}>
          {news.image && (
            <img
              className="w-full rounded-sm mt-1 shadow-md"
              src={news.image}
              alt={`Image for ${news.title}`}
            />
          )}

          <div className="mt-1">
            <h4 className="text-xs md:text-sm lg:text-md text-gray-900">
              {news.latest_publish_date}
            </h4>

            {/* Wrap the title in an anchor tag */}
            <h3 className="font-bold text-gray-900 leading-7 text-[25px] sm:text-[27px] md:text-[32px]">
              {news.title}
            </h3>
            <p className="mt-0.5 text-xl leading-5">{news.summary}</p>

            {isLoggedIn() && (
              <div className="flex">
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
        </div>
      </div>
    </>
  );
});

HeadlineCard.displayName = "HeadlineCard";

export default HeadlineCard;
