const truncateTitle = (title, maxLength) => {
  if (title.length <= maxLength) {
    return title;
  }
  return title.substring(0, maxLength) + "...";
};

const SearchResultsCard = ({ title, image, latest_publish_date }) => {
  return (
    <>
      <div className="grid grid-cols-2 mx-3 space-y-2 items-center">
        {/* Wrap the title in an anchor tag */}
        <h3 className="font-bold text-gray-900 text-xl mt-5 leading-[20px]">
          {truncateTitle(title, 50)} {/* Adjust the maxLength as needed */}
        </h3>

        {image && (
          <img
            className="w-9/12 rounded-t-sm w-9/12 ml-12 shadow-lg"
            src={image}
            alt={`Image for ${title}`}
          />
        )}
      </div>
      <h4 className="text-xs ml-3 text-gray-900">
        Updated {latest_publish_date}
      </h4>
    </>
  );
};

export default SearchResultsCard;