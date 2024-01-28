import { useCurrentUserContext } from "../context/CurrentUser";
import { useQuery } from "@apollo/client";
import { QUERY_CURRENT_USER } from "../utils/queries";
import { useNavigate, Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { isLoggedIn, logoutUser } = useCurrentUserContext();
  const { currentUser } = useCurrentUserContext();
  const { data } = useQuery(QUERY_CURRENT_USER, {
    variables: { email: currentUser?.email },
  });

  const userData = data?.currentUser || null;

  const handleHomepageClick = (event) => {
    event.preventDefault();

    if (isLoggedIn() && userData && userData.userDefaultNews) {
      let userCategory = userData.userDefaultNews.trim();

      if (userCategory) {
        console.log("Navigating to:", `/${userCategory}`);
        navigate(`/${userCategory}`);
        return;
      } else {
        console.error("User category not found");
      }
    }

    console.log("Navigating to default homepage");
    navigate("/");
  };

  const handleCloseSidebar = () => {
    toggleSidebar();
  };

  const handleLatestClick = async (sidebarQuery) => {
    try {
      const path = isLoggedIn()
        ? `/${encodeURIComponent(sidebarQuery)}`
        : "/login";
      await navigate(path);
      toggleSidebar();
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div
      id="drawer-navigation"
      className={`fixed top-0 left-0 z-40 w-68 h-screen p-4 overflow-y-auto transition-transform shadow-xl ${
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
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
          <div className="flex flex-col ml-3 text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
            <Link
              to="/homepage"
              className="text-blue-600 ml-3"
              onClick={(handleHomepageClick, handleCloseSidebar)}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="text-blue-600 ml-3"
              onClick={handleCloseSidebar}
            >
              Dashboard
            </Link>

            <Link
              type="button"
              className="text-blue-600 text-left ml-3"
              onClick={() => {
                logoutUser(), handleCloseSidebar();
              }}
            >
              LOGOUT
            </Link>
          </div>
        ) : (
          <div className="flex flex-col ml-2 text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
            <Link
              to="/"
              className="text-blue-600"
              onClick={(handleHomepageClick, handleCloseSidebar)}
            >
              Home
            </Link>

            <Link
              to="/login"
              className="text-blue-600 mr-3"
              onClick={handleCloseSidebar}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-blue-600"
              onClick={handleCloseSidebar}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      <h5
        id="drawer-navigation-label"
        className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400 ml-3 mt-4"
      >
        Latest
      </h5>

      <ul className="space-y-2 font-medium grid grid-cols-2">
        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Politics")}
          >
            <span className="ms-3">Politics</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Money")}
          >
            <span className="ms-3">Money</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center px-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Crime")}
          >
            <span className="ms-3">Crime</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Social Media")}
          >
            <span className="ms-3">Social Media</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Travel")}
          >
            <span className="ms-3">Travel</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center py-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Arts Culture")}
          >
            <span className="ms-3">Arts & Culture</span>
          </a>
        </li>
      </ul>

      <h5
        id="drawer-navigation-label"
        className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400 ml-3 mt-4"
      >
        Local News
      </h5>

      <ul className="font-medium grid grid-cols-2">
        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("New York, NY")}
          >
            <span className="ms-3">New York, NY</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center py-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Los Angeles, CA")}
          >
            <span className="ms-3">Los Angeles, CA</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Chicago, IL")}
          >
            <span className="ms-3">Chicago, IL</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center py-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Houston, TX")}
          >
            <span className="ms-3">Houston, TX</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Phoenix, AZ")}
          >
            <span className="ms-3">Phoenix, AZ</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center py-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Philadelphia, PA")}
          >
            <span className="ms-3">Philadelphia, PA</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("San Antonio, TX")}
          >
            <span className="ms-3">San Antonio, TX</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center py-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("San Diego, CA")}
          >
            <span className="ms-3">San Diego, CA</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Atlanta, GA")}
          >
            <span className="ms-3">Atlanta, GA</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center py-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Dallas, TX")}
          >
            <span className="ms-3">Dallas, TX</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Jackonville, FL")}
          >
            <span className="ms-3">Jackonville, FL</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center py-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Fort Worth, TX")}
          >
            <span className="ms-3">Fort Worth, TX</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Columbus, O")}
          >
            <span className="ms-3">Columbus, OH</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center py-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Charlotte, NC")}
          >
            <span className="ms-3">Charlotte, NC</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("San Francisco, CA")}
          >
            <span className="ms-3">San Francisco, CA</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center py-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Indianapolis, IN")}
          >
            <span className="ms-3">Indianapolis, IN</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Seattle, WA")}
          >
            <span className="ms-3">Seattle, WA</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center py-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Denver, CO")}
          >
            <span className="ms-3">Denver, CO</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Washington, DC")}
          >
            <span className="ms-3">Washington, DC</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center py-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Boston, MA")}
          >
            <span className="ms-3">Boston, MA</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("El Paso, TX")}
          >
            <span className="ms-3">El Paso, TX</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center py-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Nashville, TN")}
          >
            <span className="ms-3">Nashville, TN</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Detroit, MI")}
          >
            <span className="ms-3">Detroit, MI</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center py-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Oklahoma City, OK")}
          >
            <span className="ms-3">Oklahoma City, OK</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Portland, OR")}
          >
            <span className="ms-3">Portland, OR</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center py-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Las Vegas, NV")}
          >
            <span className="ms-3">Las Vegas, NV</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Memphis, TN")}
          >
            <span className="ms-3">Memphis, TN</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center py-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Louisville, KY")}
          >
            <span className="ms-3">Louisville, KY</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Milwaukee, WI")}
          >
            <span className="ms-3">Milwaukee, WI</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center py-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Baltimore, MD")}
          >
            <span className="ms-3">Baltimore, MD</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Albuquerque, NM")}
          >
            <span className="ms-3">Albuquerque, NM</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center py-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Tucson, AZ")}
          >
            <span className="ms-3">Tucson, AZ</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Fresno, CA")}
          >
            <span className="ms-3">Fresno, CA</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center py-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Sacramento, CA")}
          >
            <span className="ms-3">Sacramento, CA</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Kansas City, MO")}
          >
            <span className="ms-3">Kansas City, MO</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center py-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Long Beach, CA")}
          >
            <span className="ms-3">Long Beach, CA</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("Mesa, AZ")}
          >
            <span className="ms-3">Mesa, AZ</span>
          </a>
        </li>

        <li>
          <a
            className="flex items-center py-2 text-gray-900 rounded-lg dark:text-white hover:text-blue-600 dark:hover:bg-gray-700 group"
            onClick={() => handleLatestClick("San Jose, CA")}
          >
            <span className="ms-3">San Jose, CA</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
