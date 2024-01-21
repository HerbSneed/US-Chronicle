

// Define a list of country codes with their names and code3 values
const countryCodesList = [
  // ... (list of countries)
];

// Define the Homepage component
const Homepage = () => {
  // State to store news items
  const [newsItems, setNewsItems] = useState([]);
  // Ref to track whether fetchNews function is called
  const fetchNewsCalled = useRef(false);
  // Access current user data from context
  const { currentUser } = useCurrentUserContext();
  // Get selected country code from URL parameters
  const { code: selectedCountry } = useParams();

  // Query current user data using Apollo Client
  const { data } = useQuery(QUERY_CURRENT_USER, {
    variables: { email: currentUser.email },
  });
  // Extract user data or set it to null
  const userData = data?.currentUser || null;

  // useEffect hook to fetch news data when component mounts or dependencies change
  useEffect(() => {
    // Define the asynchronous function to fetch news
    const fetchNews = async () => {
      try {
        let response;

        // Check if there is no user data or no default news and no selected country
        if (!userData || (!userData.userDefaultNews && !selectedCountry)) {
          // If conditions are not met, return
          return;
        }

        let countryCode;

        // Log country codes for debugging
        console.log("Country_Code", countryCodesList);

        // Check conditions to determine which headlines to fetch
        if (userData.userDefaultNews === "World" && !selectedCountry) {
          // Fetch world headlines if user default is World and no selected country
          response = await getHeadlines();
        } else if (selectedCountry === "World") {
          // Fetch world headlines if the selected country is World
          response = await getHeadlines();
          console.log("Select _ World_Headline", response);
        } else {
          // Fetch headlines based on user default or selected country
          // const userDefaultNews = userData.userDefaultNews
          //   ? userData.userDefaultNews.trim()
          //   : null;
          const selectedCountryTrimmed = selectedCountry
            ? selectedCountry.trim()
            : null;
            response = await getCountryHeadlines(selectedCountryTrimmed);

          console.log("userDefaultNews:", userDefaultNews);
          console.log("selectedCountryTrimmed:", selectedCountryTrimmed);

          // Find the country object based on user default or selected country
          const countryObject = countryCodesList.find(
            (country) =>
              country.name === (userDefaultNews || selectedCountryTrimmed)
          );

          console.log("countryObject:", countryObject);

          // Get the country code or default to "World"
          countryCode = countryObject ? countryObject.code : "World";
          // Fetch headlines for the selected country
          response = await getSelectedHeadlines(countryCode);
          console.log("Country_Code", countryCode);
        }

        // Check if the response is OK
        if (!response || !response.ok) {
          console.error("Error in response:", response);
          throw new Error("something went wrong!");
        }

        // Parse the response JSON
        const headlines = await response.json();
        console.log("Headlines", headlines);

        // Process the articles and filter out certain conditions
        if (Array.isArray(headlines.articles)) {
          const newsData = headlines.articles
            .filter((news) => {
              return (
                news.title !== "[Removed]" &&
                news.status !== "410" &&
                news.status !== "404"
              );
            })
            .map((news) => ({
              // Map relevant news data to a new format
              newsId: news.publishedAt + news.title,
              title: news.title,
              image: news.urlToImage,
              url: news.url,
              description: news.description,
            }));

          // Set the news items state
          setNewsItems(newsData);
        } else {
          console.error("Headlines is not an array:", headlines);
        }
      } catch (err) {
        console.error(err);
      } finally {
        // Set the fetchNewsCalled ref to true
        fetchNewsCalled.current = true;
      }
    };

    // Call the fetchNews function
    fetchNews();
  }, [userData, selectedCountry]);

  // JSX rendering of the Homepage component
  return (
    <>
      {/* Country Header component */}
      <section
        id="country-links"
        className="bg-white h-10 py-1 border-t-2 border-b-2 border-newsBlue overflow-hidden"
      >
        <CountryHeader />
      </section>

      {/* Top News Headlines section */}
      <section id="top-five-hl" className="grid grid-cols-1 gap-y-2 px-2 mt-2">
        <div>
          <h2 className="text-2xl">Top News Headlines</h2>
        </div>

        {/* Render the top five news headlines */}
        {newsItems.slice(0, 5).map((news, index) => (
          <div key={news.newsId}>
            <div
              className={`border-b-2 border-newsGray ${
                index === 4 ? "last:border-b-0" : ""
              }`}
            >
              {/* Render news image if available */}
              {news.image && (
                <img
                  className="w-full"
                  src={news.image}
                  alt={`Image for ${news.title}`}
                />
              )}
              {/* Render news title */}
              <h3 className="font-bold">{news.title}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* More News Headlines section */}
      <section id="more-news-hl" className="grid grid-cols-1 gap-y-2 px-2 mt-2">
        <div>
          <h2 className="text-2xl">More News Headlines</h2>
        </div>
        {/* Render more news headlines (from index 5 to 20) */}
        {newsItems.slice(5, 20).map((news, index) => (
          <div key={news.newsId}>
            <div
              className={`border-b-2 border-newsGray ${
                index === newsItems.length - 1 ? "last:border-b-0" : ""
              }`}
            >
              {/* Render more news titles */}
              <h3 className="flex justify-right font-bold p-1">{news.title}</h3>
              {/* Placeholder link (modify as needed) */}
              <a className=""> Source </a>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

// Export the Homepage component as the default export
export default Homepage;
