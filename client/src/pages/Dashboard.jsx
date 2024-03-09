import { useCurrentUserContext } from '../context/CurrentUser';
import Auth from '../utils/auth';
import { useMutation, useQuery } from '@apollo/client';
import { QUERY_CURRENT_USER } from '../utils/queries';
import { DELETE_NEWS } from '../utils/mutations';
import DashboardCard from '../components/dashboard-card'; 

const Dashboard = () => {
  const { currentUser } = useCurrentUserContext();

  const { data } = useQuery(QUERY_CURRENT_USER, {
    variables: { email: currentUser.email },
  });

  const userData = data?.currentUser || null;
  const [ deleteNews ] = useMutation(DELETE_NEWS);

  const handleDeleteNews = async (newsId) => {

    if(!Auth.loggedIn()) {
      alert("Not logged in");
      return false;
    }

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      console.log("Token not available");
      return false;
    }

    try {
     await deleteNews({
        variables: { newsId },
      });

    } catch (err) {
      console.error("Error deleting news:", err.message);
    }
  };

  const sortedSavedNews = userData?.savedNews
    ? [...userData.savedNews].sort(
        (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
      )
    : [];


  if (!userData) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div
        key={userData?.firstName}
        className="relative bg-gray-200 pb-5 min-h-screen px-5 mx-auto w-[100%]"
      >
        <h1 className="text-center text-3xl xl:text-4xl font-[newsReader] font-bold pt-1  drop-shadow-lg text-blue-600">
          {userData.firstName}&apos;s Dashboard
        </h1>

        <h2 className="font-bold font-[newsReader] -mt-1 drop-shadow-lg text-center text-2xl 2xl:text-2xl text-red-700">
          {userData?.savedNews.length
            ? `${userData.savedNews.length} Saved Headlines`
            : "You have no saved news!"}
        </h2>

        <div className="top-0 w-full ">
          <div
            className="
          w-full
          grid 
          grid-cols-1
          sm:grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3 
          xl:grid-cols-3
          2xl:grid-cols-4
          gap-4
          px-3"
          >
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
    </>
  );
};

export default Dashboard;
