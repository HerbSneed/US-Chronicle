// Import necessary modules
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { CurrentUserProvider } from "./context";
import App from "./App";

// Import pages and components
import Error from "./pages/Error";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Search from "./pages/Search";

// Create router with routes
const router = createBrowserRouter(
  createRoutesFromElements(
    // Main route for the app
    <Route path="/" element={<App />} errorElement={<Error />}>
      {/* Homepage route */}
      <Route index element={<Homepage />} />
      {/* Login route */}
      <Route path="/login" element={<Login />} />
      {/* Register route */}
      <Route path="/register" element={<Register />} />
      {/* Forgot password route */}
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      {/* Reset password route */}
      <Route path="/resetPassword/:token" element={<ResetPassword />} />
      {/* Search route */}
      <Route path="/search" element={<Search />} />
      {/* Protected routes */}
      <Route
        path=":userCategory"
        element={
          <ProtectedRoute>
            <Homepage />
          </ProtectedRoute>
        }
      />
      <Route
        path=":category"
        element={
          <ProtectedRoute>
            <Homepage />
          </ProtectedRoute>
        }
      />
      <Route
        path="search/:query"
        element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        }
      />
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="sidebar"
        element={
          <ProtectedRoute>
            <Homepage />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);

// Render the app
ReactDOM.createRoot(document.getElementById("root")).render(
  <CookiesProvider>
    {/* Provide current user context */}
    <CurrentUserProvider>
      {/* Provide router */}
      <RouterProvider router={router}>
        {/* Main App component */}
        <App />
      </RouterProvider>
    </CurrentUserProvider>
  </CookiesProvider>
);
