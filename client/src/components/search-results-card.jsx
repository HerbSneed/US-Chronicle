import { useCurrentUserContext } from "../context/CurrentUser";

const SearchResultsCard = ({ news, handleSaveArticle }) => {
  const { isLoggedIn } = useCurrentUserContext();

    if (!news) {
      return null; 
    }

  const truncateTitle = (title, maxLength) => {
    if (title.length <= maxLength) {
      return title;
    }
    return title.substring(0, maxLength) + "...";
  };

  return (
    <>
      <div
        key={news.newsId}
        className="grid grid-cols-2 mx-3 space-y-2 items-center"
      >
        <div className="">
          <h3 className="font-bold text-gray-900 text-xl mt-5 leading-[20px]">
            {truncateTitle(news.title, 48)} 
            <span>
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
            </span>
          </h3>
        </div>

        <div className="">
          {news.image && (
            <img
              className="w-9/12 rounded-t-sm w-9/12 ml-12 shadow-lg"
              src={news.image}
              alt={`Image for ${news.title}`}
            />
          )}
        </div>
      </div>
      <h4 className="text-xs ml-3 text-gray-900">
        Updated {news.latest_publish_date}
      </h4>
    </>
  );
};

export default SearchResultsCard;
