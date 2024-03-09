import React from "react";
import { useCurrentUserContext } from "../context/CurrentUser";

const DashboardCard = React.memo(({news, handleDeleteNews}) => {
  const { isLoggedIn } = useCurrentUserContext();
  
  return (
    <>
      <div className="rounded bg-white shadow-lg">
        <img
          src={news.image}
          alt={news.image}
          className="w-full h-72 object-cover rounded-t"
        />
        <h4 className="text-xs sm:text-sm mx-3 2xl:text-md mt-.5 sm:mt-1 text-gray-900">
          Updated {news.latest_publish_date}
        </h4>

        <h3 className="mx-3 font-bold xl:mt-0 2xl:-mt-0.5 text-gray-900 text-lg xl:text-[20px] leading-5 text-[15px] sm:text-[18px] lg:text-[20px] md:truncate ">
          {news.title}
        </h3>

        {isLoggedIn() && (
          <div className="flex text-sm sm:text-md 2xl:text-lg pb-1 py-1 text-blue-600 mx-3 -mt-1 sm:mt-0 2xl:-mt-1.5">
            <a
              href={news.url}
              target="_blank"
              className=""
              rel="noopener noreferrer"
            >
              Source
            </a>
            <a
              target="_blank"
              className="text-red-600 ml-5"
              onClick={() => handleDeleteNews(news.newsId)}
              rel="noopener noreferrer"
            >
              Delete Article
            </a>
          </div>
        )}
      </div>
    </>
  );
});

DashboardCard.displayName = "DashboardCard";

export default DashboardCard;