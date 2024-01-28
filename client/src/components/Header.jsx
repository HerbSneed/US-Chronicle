import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCurrentUserContext } from '../context/CurrentUser';
import logo from "../../src/assets/images/US-Chronical.png";
import sidebar from "../../src/assets/images/sidebar-icon.png";
import search from "../../src/assets/images/search-icon.png";
import { useQuery } from '@apollo/client';
import { QUERY_CURRENT_USER } from '../utils/queries';
import { useNavigate } from "react-router-dom";
import Sidebar from '../components/sidebar';

function Header() {
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

  if (isLoggedIn() && userData && userData.userDefaultNews) {
    let userCategory = userData.userDefaultNews.trim();

    if (userCategory) {
      console.log("Navigating to:", `/${userCategory}`);
      navigate(`/${userCategory}`);
    } else {
      console.error("User category not found");
    }
  } else {
    console.log("Navigating to default homepage");
    navigate("/");
  }
};

  return (
    <nav className="relative bg-white border-b-[1px] border-gray-200 w-full h-18 text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 dark:bg-neutral-600 lg:py-2">
      <div className="flex w-full justify-between items-center ">
        <button className="" onClick={toggleSidebar}>
          <img
            src={sidebar}
            className="w-6 sm:w-10 overflow-hidden"
            alt="WorldWire Icon"
          />
        </button>

        <Link to="/" onClick={handleHomepageClick}>
          <img
            src={logo}
            className="w-32 sm:w-10 overflow-hidden"
            alt="WorldWire Icon"
          />
        </Link>

        <Link to="/search">
          <img
            src={search}
            className="w-6 sm:w-10 overflow-hidden"
            alt="WorldWire Icon"
          />
        </Link>
      </div>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </nav>
  );
}

export default Header;
