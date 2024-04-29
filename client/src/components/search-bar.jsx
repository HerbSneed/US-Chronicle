import { useState } from "react";
import { useNavigate } from "react-router-dom";

// SearchBar component
const SearchBar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  // Hook for navigation
  const navigate = useNavigate();

  // Function to toggle sidebar state
  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to handle search
  const handleSearch = () => {
    // Navigate to search page with query parameter
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  // Function to handle search and sidebar
  const handleSearchAndSidebar = () => {
    // Perform search
    handleSearch();
    // Toggle sidebar
    handleSidebar();
  };

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
          onClick={handleSearch}
          className="inset-y-0 right-0 px-4 ml-3 mr-3 bg-blue-500 text-white rounded-md"
        >
          Search
        </button>
      </div>
    </>
  );
};

export default SearchBar;
