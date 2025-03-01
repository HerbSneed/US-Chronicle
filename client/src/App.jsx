// Import necessary modules and styles
import "./App.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useCookies } from "react-cookie";
import Header from "./components/Header";
import Sidebar from "./components/sidebar";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Search from "./pages/search";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Use environment variables for API URL
// const API_URL = import.meta.env.VITE_API_URL;

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";


// Main App component
function App({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const [cookies] = useCookies(["auth_token"]);
  const [selectedCategory, setSelectedCategory] = useState("Top News");
  const navigate = useNavigate();
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);

  const routeToApiMap = { 
    "": "/api/usheadlines",
    "category": "/api/categoryheadlines?category=technology",
    "search": "/api/search?searchQuery=bitcoin",
  };

  const path = location.pathname.replace("/", "") || "home";
  const apiRoute = routeToApiMap[path] || "/api/usheadlines"; // Default if not found

  // Create HTTP link for Apollo Client
  const httpLink = createHttpLink({
    uri: `${API_URL}/graphql`, // ✅ Use env variable
  });
  console.log("API URL:", API_URL);
  // Set authorization header for Apollo Client based on auth token
  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: cookies?.auth_token ? `Bearer ${cookies.auth_token}` : "",
    },
  }));

  // Create Apollo Client instance
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  // Fetch API data from API Gateway
  useEffect(() => {
    console.log("Fetching from:", `${API_URL}${apiRoute}`);

    if (!API_URL) {
      console.error("❌ API_URL is not set");
      return;
    }

    fetch(`${API_URL}${apiRoute}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ API Response:", data);
        setApiData(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("❌ Error fetching data:", error);
      });
  }, [apiRoute, location.pathname]);


  // Close sidebar if click occurs outside header
  useEffect(() => {
    const handleDocumentClick = (event) => {
      const header = document.querySelector("nav");
      if (header && !header.contains(event.target) && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [isSidebarOpen]);

  // Render the app
  return (
    <ApolloProvider client={client}>
      <Header isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main>
        <Outlet>
          <Search />
        </Outlet>
        {children}
        {loading && (
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      )}
      </main>
    </ApolloProvider>
  );
}

export default App;
