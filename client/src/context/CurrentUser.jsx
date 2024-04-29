import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import decode from "jwt-decode";
import { useCookies } from "react-cookie";

// Create a context for the current user
export const CurrentUserContext = createContext();

// Custom hook to access the current user context
export const useCurrentUserContext = () => useContext(CurrentUserContext);

// Component to provide the current user context
export default function CurrentUserContextProvider({ children }) {
  // Get cookies for authentication token
  const [cookies, setCookies, removeCookies] = useCookies(["auth_token"]);

  // Initialize user state
  let initialUser = { isAuthenticated: false };

  // If authentication token exists in cookies, decode it and set the initial user
  if (cookies.auth_token) {
    const decodedToken = decode(cookies.auth_token);
    initialUser = { ...decodedToken.data, isAuthenticated: true };
  }

  // State for current user
  const [currentUser, setCurrentUser] = useState(initialUser);

  // Function to login user
  const loginUser = useCallback(
    (user, token) => {
      setCurrentUser({ ...user, isAuthenticated: true });
      setCookies("auth_token", token, { path: "/" });
    },
    [setCurrentUser, setCookies]
  );

  // Function to logout user
  const logoutUser = useCallback(() => {
    removeCookies("auth_token");
    setCurrentUser({ isAuthenticated: false });
  }, [setCurrentUser, removeCookies]);

  // Function to check if user is logged in
  const isLoggedIn = useCallback(
    () => currentUser.isAuthenticated,
    [currentUser.isAuthenticated]
  );

  // Function to get authentication token
  const getToken = useCallback(() => cookies.auth_token, [cookies.auth_token]);

  // Context value
  const contextValue = useMemo(
    () => ({
      currentUser,
      loginUser,
      logoutUser,
      isLoggedIn,
      getToken,
    }),
    [currentUser, isLoggedIn, loginUser, logoutUser, getToken]
  );

  // Provide the context value to the child components
  return (
    <CurrentUserContext.Provider value={contextValue}>
      {children}
    </CurrentUserContext.Provider>
  );
}
