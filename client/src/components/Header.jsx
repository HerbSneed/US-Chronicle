import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toggleSidebar } from "../utils/sidebarUtils";
import logo from "../../src/assets/images/US-Chronical.webp";
import sidebarIcon from "../assets/images/sidebar-icon.webp";
import search from "../assets/images/search-icon.webp";

const Header = ({ setIsSidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSidebarToggle = () => {
    toggleSidebar(setIsSidebarOpen);
  };

  const handleSearch = () => {
    setIsSidebarOpen(false);
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    setSearchQuery(searchQuery);
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      const header = document.querySelector("nav");
      if (!header.contains(event.target) && setIsSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [setIsSidebarOpen]);

  return (
    <>
      <nav className="h-12 sm:h-14 bg-white flex justify-between px-3 border-b border-gray-400 items-center text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 dark:bg-neutral-600">
        <button className="" onClick={handleSidebarToggle}>
          <img
            src={sidebarIcon}
            className="w-[30px] sm:w-8"
            alt="Sidebar Icon"
          />
        </button>


        <img
          src={logo}
          className="w-[120px] sm:w-36 2xl:w-40"
          alt="US Chronicle Logo"
        />


        <Link to="/search">
          <img
            src={search}
            className="w-[30px] sm:w-8"
            alt="Search Icon"
            onClick={handleSearch}
          />
        </Link>
      </nav>
    </>
  );
};

export default Header;
