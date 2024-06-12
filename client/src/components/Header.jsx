import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { toggleSidebar } from "../utils/sidebarUtils";
import logo from "../assets/images/US-Chronical.webp";
import sidebarIcon from "../assets/images/sidebar-icon.webp";
import search from "../assets/images/search-icon.webp";

const Header = ({ setIsSidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isRed, setIsRed] = useState(false);

  // Function to handle toggling the sidebar
  const handleSidebarToggle = (event) => {
    event.preventDefault();
    toggleSidebar(setIsSidebarOpen);
  };

  // Function to handle search
  const handleSearch = () => {
    setIsSidebarOpen(false); // Close the sidebar when searching
    if (location.pathname === "/search") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
    setSearchQuery(""); // Clear the search query after searching
  };

  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = document.querySelector("nav").offsetHeight;
      const scrollY = window.scrollY;

      if (scrollY > headerHeight) {
        setIsRed(true);
      } else {
        setIsRed(false);
      }
    };

    // Add event listener for scroll
    window.addEventListener("scroll", handleScroll);

    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Function to handle clicks outside the header to close the sidebar
    const handleDocumentClick = (event) => {
      const header = document.querySelector("nav");
      if (!header.contains(event.target) && setIsSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    // Add event listener for clicks outside the header
    document.addEventListener("click", handleDocumentClick);

    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [setIsSidebarOpen]);

  return (
    <>
      <nav
        className={`sticky z-50 relative top-0 h-12 sm:h-14 flex justify-between px-3 border-b border-gray-400 items-center text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 ${
          isRed ? "bg-newsRed" : "bg-white"
        } dark:bg-neutral-600`}
      >
        <button className="" onClick={handleSidebarToggle} rel="preload">
          <img
            src={sidebarIcon}
            className="w-[30px] sm:w-8"
            alt="Sidebar Icon"
          />
        </button>

        <Link
          to="/"
          rel="preload"
          onClick={() => console.log("Homepage icon clicked")}
        >
          <img
            src={logo}
            className="w-[120px] sm:w-36"
            alt="American Chronicle Logo"
            loading="lazy"
            rel="preload"
          />
        </Link>

        <Link to="/search" rel="preload">
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
