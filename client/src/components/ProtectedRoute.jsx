import { Navigate, useLocation } from "react-router-dom";

import { useCurrentUserContext } from "../context/CurrentUser";
import jwtDecode from "jwt-decode";

function ProtectedRoute({ children }) {
  const { isLoggedIn, getToken } = useCurrentUserContext();
  const location = useLocation();


  const isTokenExpired = () => {
    const token = getToken();
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp < Date.now() / 1000;
    }
    return true; 
  };

  if (!isLoggedIn() || isTokenExpired()) {

   return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default ProtectedRoute;
