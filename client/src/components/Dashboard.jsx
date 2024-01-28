import { Card, Button } from 'react-bootstrap';
import { useCurrentUserContext } from '../context/CurrentUser';
import Auth from '../utils/auth';
import { deleteNewsId } from '../utils/localStorage';
import { useMutation, useQuery } from '@apollo/client';
import { QUERY_CURRENT_USER } from '../utils/queries';
import { DELETE_NEWS } from '../utils/mutations';

const Dashboard = () => {
  const { currentUser } = useCurrentUserContext();

  const { data } = useQuery(QUERY_CURRENT_USER, {
    variables: { email: currentUser.email },
  });

  const userData = data?.currentUser || null;
  const { deleteNews } = useMutation(DELETE_NEWS);

  const handleDeleteNews = async (newsId) => {
    console.log("Button clicked"); 

    if(!Auth.loggedIn()) {
      console.log("Not logged in");
      return false;
    }

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      console.log("Token not available");
      return false;
    }

    try {
      const { data } = await deleteNews({
        variables: { newsId },
      });

      console.log("Mutation response:", data); 

      // Upon success, remove newsId from localStorage
      deleteNewsId(newsId);
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
        className="relative bg-gray-200 pb-5 h-full px-5 mx-auto w-[100%]"
      >
        <div className="text-center text-3xl font-[newsReader] font-bold pt-2">
          <h1>{userData.firstName}'s Dashboard</h1>
        </div>
        <div className="top-0 w-full ">
          <h2 className="pt-0 mb-2 font-bold font-[newsReader] text-center">
            {userData?.savedNews.length
              ? `${userData.savedNews.length} Saved Headlines`
              : "You have no saved news!"}
          </h2>
          <div
            className="
          w-full
          grid 
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4 
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-2
          px-3 py-1"
          >
            {sortedSavedNews.map((news) => {
              const displayImage = news.image || news.source_country;
              return (
                <div
                  key={news.newsId}
                  className="
                    mb-2 
                    w-full
                    bg-white 
                    rounded 
                    shadow-xl"
                >
                  <Card key={news.newsId}>
                    {displayImage ? (
                      <Card.Img
                        src={displayImage}
                        alt={`Cover image for ${news.title}`}
                        variant="top"
                        className="rounded-t shadow-lg w-full object-"
                      />
                    ) : null}

                    <Card.Body className="px-3 pt-1">
                      <h4 className="text-xs text-gray-900">
                        Updated {news.latest_publish_date}
                      </h4>
                      <Card.Title className="font-bold leading-[23px] text-gray-800 text-xl">
                        {news.title}
                      </Card.Title>

                      <Card.Text className="leading-[20px] text-md">
                        {news.summary}
                      </Card.Text>

                      <div
                        id="delete_savebuttons"
                        className="mt-auto mb-2 flex justify-between items-end"
                      >
                        <a
                          className="text-blue-600"
                          href={news.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Source
                        </a>

                        <Button
                          className="btn-block text-red-600 btn-danger float-right"
                          onClick={() => handleDeleteNews(news.newsId)}
                        >
                          Delete article
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
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
