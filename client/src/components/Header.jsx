import { Link } from 'react-router-dom';
import { useCurrentUserContext } from '../context/CurrentUser';
import logo from '../../src/assets/US-Chronical.png';
import sidebar from '../../src/assets/sidebar-icon.png';
import search from '../../src/assets/search-icon.png';
import { Accordion } from 'flowbite-react';
import { useQuery } from '@apollo/client';
import { QUERY_CURRENT_USER } from '../utils/queries';
import { categories } from '../utils/categories';
import { useNavigate } from "react-router-dom";


function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, logoutUser } = useCurrentUserContext();
  const { currentUser } = useCurrentUserContext();
  const { loading, data, error } = useQuery(QUERY_CURRENT_USER, {
    variables: { email: currentUser?.email },
  });

  const userData = data?.currentUser ||  null;

const handleHomepageClick = (event) => {
  event.preventDefault();

  if (isLoggedIn() && userData && userData.userDefaultNews) {
    let userCategory = userData.userDefaultNews.trim();

    if (userCategory) {
      console.log("Navigating to:", `/homepage/${userCategory}`);
      navigate(`/homepage/${userCategory}`);
    } else {
      console.error("User category not found");
    }
  } else {
    console.log("Navigating to default homepage");
    navigate("/homepage");
  }
};

  return (
    <nav className="relative bg-white border-b-[1px] border-gray-200 w-full h-18 text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 dark:bg-neutral-600 lg:py-2">
      <div className="flex w-full justify-between items-center ">
        {/* <div className="sm:w-1/2 md:w-[31%] sm:flex sm:items-center"> */}
        <img
          src={sidebar}
          className="w-6 sm:w-10 overflow-hidden"
          alt="WorldWire Icon"
        />

        <img
          src={logo}
          className="w-32 sm:w-10 overflow-hidden"
          alt="WorldWire Icon"
        />

        <Link to="/search">
          <img
            src={search}
            className="w-6 sm:w-10 overflow-hidden"
            alt="WorldWire Icon"
          />
        </Link>
        {/* </div> */}

        {/* 
        {isLoggedIn() ? (
          <div className="mt-1 mr-1">
            <Link
              to="/homepage"
              className="text-blue-600 ml-3"
              onClick={handleHomepageClick}
            >
              Home
            </Link>
            <Link to="/dashboard" className="text-blue-600 ml-3">
              Dashboard
            </Link>
            <button
              type="button"
              className="text-blue-600 ml-3"
              onClick={logoutUser}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="py-2 mr-3">
            <Link to="/login" className="text-blue-600 mr-3">
              Login
            </Link>
            <Link to="/register" className="text-blue-600">
              Sign Up
            </Link>
          </div>
        )} */}
      </div>
    </nav>
  );
}

export default Header;
