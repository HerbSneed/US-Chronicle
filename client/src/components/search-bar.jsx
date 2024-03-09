// SearchBar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = () => {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const handdleSearchAndSidebar = () => {
    handleSearch();
    handleSidebar();
  }

  return (
    <>
      <div className="flex w-full justify-between">
        <input
          type="text"
          placeholder="Search for News..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="px-2 py-1 ml-3 border w-full border-gray-300 rounded-md text-black"
        />
        <button
          onClick={handdleSearchAndSidebar}
          className="inset-y-0 right-0 px-4 ml-3 mr-3 bg-blue-500 text-white rounded-md"
        >
          Search
        </button>
      </div>
    </>
  );
};

export default SearchBar;
