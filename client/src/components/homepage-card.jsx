import { useCurrentUserContext } from "../context/CurrentUser";

const HeadlineCard = ({ news, handleSaveArticle }) => {
  const { isLoggedIn } = useCurrentUserContext();

  return (
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
          <h4 className="text-xs text-gray-900">
            Updated {news.latest_publish_date}
          </h4>

          {/* Wrap the title in an anchor tag */}
          <h3 className="font-bold text-gray-900 leading-7 text-[25px]">{news.title}</h3>

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
  );
};

export default HeadlineCard;

