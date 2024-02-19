import { useState } from 'react';
import { useCurrentUserContext } from '../context/CurrentUser';
import logo from "../../src/assets/images/US-Chronical.png";
import sidebar from "../../src/assets/images/sidebar-icon.png";
import search from "../../src/assets/images/search-icon.png";
import { useQuery } from '@apollo/client';
import { QUERY_CURRENT_USER } from '../utils/queries';
import { useNavigate, Link } from "react-router-dom";
import Sidebar from '../components/sidebar';

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useCurrentUserContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const { currentUser } = useCurrentUserContext();
  const { data } = useQuery(QUERY_CURRENT_USER, {
    variables: { email: currentUser?.email },
  });

  const userData = data?.currentUser ||  null;

  const handleHomepageClick = (event) => {
    event.preventDefault();

  if (isLoggedIn() && userData.userDefaultNews) {
    let userCategory = userData.userDefaultNews.trim();

    if (userCategory) {
      navigate(`/${userCategory}`);
      location.reload();
      return;
    } else {
      console.error("User category not found");        
    }
  } else {
    navigate("/");
  }
};

  return (
    <nav className="h-12 sm:h-14 bg-white flex justify-between px-3 border-b border-gray-400 items-center text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 dark:bg-neutral-600">
      <button className="" onClick={toggleSidebar}>
        <img src={sidebar} className="w-6 sm:w-8" alt="WorldWire Icon" />
      </button>

      <Link to="/" onClick={handleHomepageClick}>
        <img
          src={logo}
          className="w-32 sm:w-36"
          alt="American Chronicle Logo"
        />
      </Link>

      <Link to="/search">
        <img
          src={search}
          className="w-6 sm:w-8"
          alt="WorldWire Icon"
          onClick={toggleSidebar}
        />
      </Link>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </nav>
  );
}

export default Header;
