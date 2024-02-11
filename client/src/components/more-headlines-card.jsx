import { useCurrentUserContext } from "../context/CurrentUser";

const MoreHeadlinesCard = ({ news, handleSaveArticle, isLastItem }) => {
  const { isLoggedIn } = useCurrentUserContext();

  return (
    <div
      key={news.newsId}
      className={`bg-white mt-0.5 py-1 ${isLastItem ? "border-none" : "border-b border-gray-600"}`}
    >
      <div className={`${news.index === 5 ? "" : ""}`}>
        <div className="mt-0">
          <h3 className="font-bold text-gray-900 leading-4 text-[15px] sm:text-[17px]">
            {news.title}
          </h3>
          <h4 className="text-xs mt-.5 sm:mt-1 text-gray-900">
            Updated {news.latest_publish_date}
          </h4>

          {isLoggedIn() && (
            <div className="flex -mt-1 sm:mt-0">
              <a
                href={news.url}
                target="_blank"
                className="text-sm sm:text-md text-blue-600"
                rel="noopener noreferrer"
              >
                Source
              </a>
              <a
                target="_blank"
                className="text-sm sm:text-md text-red-600 ml-5"
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
  );
};

export default MoreHeadlinesCard;

