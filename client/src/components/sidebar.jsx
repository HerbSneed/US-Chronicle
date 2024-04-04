import React from "react";
import { useCurrentUserContext } from "../context/CurrentUser";
import { useQuery } from "@apollo/client";
import { QUERY_CURRENT_USER } from "../utils/queries";
import { useNavigate, Link } from "react-router-dom";
import { latestLinks, localNewsLinks } from "../utils/categories";
import { toggleSidebar } from "../utils/sidebarUtils";


const Sidebar = React.memo(({ isOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const { isLoggedIn, logoutUser } = useCurrentUserContext();
  const { currentUser } = useCurrentUserContext();

  const { data } = useQuery(QUERY_CURRENT_USER, {
    variables: { email: currentUser?.email },
  });

  const userData = data?.currentUser || null;

  const handleLatestClick = async ({ query }) => {
    try {
      const path = isLoggedIn()
        ? `/sidebar?link=${encodeURIComponent(query)}`
        : "/login";
      await navigate(path);
      setIsSidebarOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const renderLinks = (links) => {
    return links.map((link) => (
      <li key={link.label}>
        <a
          href="#"
          className="flex items-center p-2"
          onClick={() => handleLatestClick(link)}
        >
          <span className="ms-3 hover:text-blue-600">{link.label}</span>
        </a>
      </li>
    ));
  };

  const handleHomepageClick = () => {
    if (isLoggedIn()) {
      const userCategory = userData?.userDefaultNews?.trim();
      if (userCategory) {
        navigate(`/${userCategory}`);
      } else {
        console.error("User category not found");
      }
    } else {
      navigate("/");
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <div
        id="drawer-navigation"
        className={`fixed top-0 left-0 z-40 w-full h-screen p-4 overflow-y-auto transition-transform shadow-xl ${
          isOpen ? "" : "-translate-x-full"
        } bg-white dark:bg-gray-800`}
        tabIndex="-1"
        aria-labelledby="drawer-navigation-label"
      >
        <div className="flex">
          <button
            type="button"
            data-drawer-hide="drawer-navigation"
            aria-controls="drawer-navigation"
            className="text-gray-400 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center"
            onClick={handleCloseSidebar}
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close menu</span>
          </button>

          {isLoggedIn() ? (
            <div className="flex flex-col text-base font-semibold uppercase mt-7 dark:text-gray-400">
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-800 ml-3"
                onClick={(e) => {
                  e.preventDefault();
                  handleHomepageClick();
                  toggleSidebar(isOpen, setIsSidebarOpen);
                }}
                role="button"
                tabIndex="0"
              >
                Home
              </Link>

              <Link
                to="/dashboard"
                className="text-blue-600 hover:text-blue-800 ml-3"
                onClick={() => toggleSidebar(isOpen, setIsSidebarOpen)}
                role="button"
                tabIndex="0"
              >
                Dashboard
              </Link>

              <Link
                type="button"
                className="text-blue-600 hover:text-blue-800 ml-3"
                onClick={() => {
                  logoutUser();
                  toggleSidebar(isOpen, setIsSidebarOpen);
                }}
                role="button"
                tabIndex="0"
              >
                LOGOUT
              </Link>
            </div>
          ) : (
            <div className="flex flex-col ml-2 text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-800"
                onClick={(e) => {
                  e.preventDefault();
                  handleHomepageClick();
                  toggleSidebar(isOpen, setIsSidebarOpen);
                }}
                role="button"
                tabIndex="0"
              >
                Home
              </Link>

              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800"
                onClick={() => toggleSidebar(isOpen, setIsSidebarOpen)}
                role="button"
                tabIndex="0"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-800"
                onClick={() => toggleSidebar(isOpen, setIsSidebarOpen)}
                role="button"
                tabIndex="0"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <h1
          id="drawer-navigation-label"
          className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400 ml-3 mt-4"
        >
          Latest
        </h1>

        <ul className="font-medium grid grid-cols-2">
          {renderLinks(latestLinks)}
        </ul>

        <h1
          id="drawer-navigation-label"
          className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400 ml-3 mt-4"
        >
          Local News
        </h1>

        <ul className="font-medium grid grid-cols-2">
          {renderLinks(localNewsLinks)}
        </ul>
      </div>
    </>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
