// Import necessary modules and styles
import Search from "../src/pages/search";
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
import { useNavigate} from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Main App component
function App({ children }) {
  // State to manage sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Get cookies (including auth token) using react-cookie
  const [cookies] = useCookies(["auth_token"]);
  const [selectedCategory, setSelectedCategory] = useState("Top News");
  const navigate = useNavigate();

  // Create HTTP link for Apollo Client
  const httpLink = createHttpLink({
    uri: "/graphql",
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

  // Close sidebar if click occurs outside header
  useEffect(() => {
    const handleDocumentClick = (event) => {
      const header = document.querySelector("nav");
      if (!header.contains(event.target) && isSidebarOpen) {
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
      {/* Header component */}
      <Header isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      {/* Sidebar component */}
      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      {/* Main content */}
      <main>
        {/* Outlet for nested routes */}
        <Outlet>
          <Search />
        </Outlet>

        {/* Render children components */}
        {children}
      </main>
    </ApolloProvider>
  );
}

export default App;
