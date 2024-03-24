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
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cookies] = useCookies(["auth_token"]);

  const httpLink = createHttpLink({
    uri: "/graphql",
  });

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: cookies?.auth_token ? `Bearer ${cookies.auth_token}` : "",
    },
  }));

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

    useEffect(() => {
      const handleDocumentClick = (event) => {
        const header = document.querySelector("nav");
        if (!header.contains(event.target) && setIsSidebarOpen) {
          // Click occurred outside the header, close sidebar if open
          setIsSidebarOpen(false);
        }
      };

      document.addEventListener("click", handleDocumentClick);

      return () => {
        document.removeEventListener("click", handleDocumentClick);
      };
    }, [setIsSidebarOpen]);
  
  return (
    <ApolloProvider client={client}>
      <Header isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
      <main>
        <Outlet>
          <Search/>
        </Outlet>
        {children}
      </main>
    </ApolloProvider>
  );
}

export default App;