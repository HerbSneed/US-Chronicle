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

// Main App component
function App({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const [cookies] = useCookies(["auth_token"]);
  const [selectedCategory, setSelectedCategory] = useState("Top News");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const isLocalhost = window.location.hostname === "localhost";
  const API_URL = isLocalhost
    ? "http://localhost:3000" // local dev can stay HTTP
    : import.meta.env.VITE_API_URL; // production uses HTTPS from env

  // Dynamically get category and search query from the URL
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category");
  const searchFromUrl = queryParams.get("searchQuery");

  // Update selectedCategory and searchQuery based on URL
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [categoryFromUrl, searchFromUrl]);

  const routeToApiMap = {
    home: "/api/usheadlines",
    category: `/api/categoryheadlines?category=${selectedCategory}`,
    search: `/api/search?searchQuery=${searchQuery}`, // Dynamically use search query
  };

  const path = location.pathname.replace("/", "") || "home";
  const apiRoute = routeToApiMap[path] || "/api/usheadlines";

  // Create HTTP link for Apollo Client
  const httpLink = createHttpLink({
    uri: `${API_URL}/graphql`, // ✅ Use env variable
  });

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
    const fetchUrl = `${API_URL}${apiRoute}`;

    fetch(fetchUrl) // Ensure this is using API_URL correctly
      .then((response) => response.json())
      .then((data) => {
        setApiData(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("❌ Error fetching data:", error);
      });
  }, [apiRoute, location.pathname]);

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
