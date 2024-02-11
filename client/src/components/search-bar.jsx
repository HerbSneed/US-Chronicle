// SearchBar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="flex w-full justify-between">
      <input
        type="text"
        placeholder="Search for News..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSearch();
        }}
      }
        className="px-2 py-1 ml-3 border border-gray-300 rounded-md text-black"
      />
      <button
        onClick={() => {
          handleSearch();
        }}
        className="inset-y-0 right-0 px-4 ml-3 mr-2 bg-blue-500 text-white rounded-md"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
