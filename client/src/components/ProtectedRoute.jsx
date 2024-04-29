import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUserContext } from "../context/CurrentUser";
import jwtDecode from "jwt-decode";

// ProtectedRoute component
function ProtectedRoute({ children }) {
  // Get isLoggedIn and getToken functions from the CurrentUserContext
  const { isLoggedIn, getToken } = useCurrentUserContext();
  // Get the current location
  const location = useLocation();

  // Function to check if the token is expired
  const isTokenExpired = () => {
    // Get the token
    const token = getToken();
    // If token exists
    if (token) {
      // Decode the token
      const decodedToken = jwtDecode(token);
      // Check if the token expiration time is less than the current time
      return decodedToken.exp < Date.now() / 1000;
    }
    // If token doesn't exist, consider it expired
    return true;
  };

  // If the user is not logged in or the token is expired
  if (!isLoggedIn() || isTokenExpired()) {
    // Redirect to the login page with the current location as state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // If user is logged in and token is valid, render the children
  return children;
}

// Export the ProtectedRoute component
export default ProtectedRoute;
