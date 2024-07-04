import { useCurrentUserContext } from "../context/CurrentUser"; // Importing custom hook to access current user data
import Auth from "../utils/auth"; // Importing utility for authentication
import { useMutation, useQuery } from "@apollo/client"; // Importing hooks for GraphQL queries and mutations
import { QUERY_CURRENT_USER } from "../utils/queries"; // Importing GraphQL query for current user data
import { DELETE_NEWS } from "../utils/mutations"; // Importing GraphQL mutation for deleting news
import DashboardCard from "../components/dashboard-card"; // Importing DashboardCard component
import Footer from "../components/Footer"

// Dashboard component
const Dashboard = () => {
  const { currentUser } = useCurrentUserContext(); // Getting current user from context

  // Query to fetch current user data
  const { data } = useQuery(QUERY_CURRENT_USER, {
    variables: { email: currentUser.email }, // Pass current user's email as a variable
  });

  const userData = data?.currentUser || null; // Extracting current user data from query result
  const [deleteNews] = useMutation(DELETE_NEWS); // Mutation hook for deleting news

  // Function to handle news deletion
  const handleDeleteNews = async (newsId) => {
    // Check if user is logged in
    if (!Auth.loggedIn()) {
      alert("Not logged in");
      return false;
    }

    const token = Auth.loggedIn() ? Auth.getToken() : null; // Get authentication token

    // Check if token is available
    if (!token) {
      console.log("Token not available");
      return false;
    }

    try {
      // Call deleteNews mutation
      await deleteNews({
        variables: { newsId },
      });
    } catch (err) {
      console.error("Error deleting news:", err.message);
    }
  };

  // Sort saved news by date
  const sortedSavedNews = userData?.savedNews
    ? [...userData.savedNews].sort(
        (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
      )
    : [];

  // Render loading message if user data is not available
  if (!userData) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      {/* Dashboard layout */}
      <div
        key={userData?.firstName}
        className="relative bg-white border-t-[1px] border-gray-400 min-h-screen px-5 mx-auto w-[100%]"
      >
        {/* Dashboard header */}
        <h1 className="text-center text-3xl xl:text-4xl font-[newsReader] font-bold p-3 mt-1 drop-shadow-lg text-blue-600">
          {userData.firstName}&apos;s Dashboard
        </h1>

        {/* Message for empty saved articles */}
        <h1
          className={`font-bold font-[newsReader] -mt-3 drop-shadow-lg text-center text-2xl xl:text-3xl text-red-700 ${userData?.savedNews.length > 0 ? "hidden" : ""}`}
        >
          You have no saved articles
        </h1>

        {/* Saved news cards */}
        <div className="top-0 w-full ">
          <div
            className="
          w-full
          grid 
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3 
          2xl:grid-cols-4
          gap-4
          px-3
          pb-5"
          >
            {/* Map over sorted saved news and render DashboardCard for each */}
            {sortedSavedNews.map((news) => {
              return (
                <div key={news.newsId}>
                  <DashboardCard
                    key={news.newsId}
                    news={news}
                    handleDeleteNews={handleDeleteNews}
                    isLoggedIn={Auth.loggedIn}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
