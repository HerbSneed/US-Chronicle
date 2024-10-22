import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import Auth from "../utils/auth";
import { LOGIN_USER, FORGOT_PASSWORD } from "../utils/mutations";
import { useCurrentUserContext } from "../context/CurrentUser";

export default function Login() {
  const { loginUser } = useCurrentUserContext();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetFeedback, setResetFeedback] = useState(null);

  // Mutation hooks
  const [login, { error }] = useMutation(LOGIN_USER);
  const [forgotPassword] = useMutation(FORGOT_PASSWORD);

  // Function to handle login form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: {
          email: formState.email,
          password: formState.password,
        },
      });
      const { token, currentUser } = data.login;
      // Call the function to update user context
      loginUser(currentUser, token);
      // Set token in local storage
      Auth.login(token);
      // Redirect user to the home page
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Function to handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  // Function to handle forgot password
  const handleForgotPassword = async () => {
    try {
      const { data } = await forgotPassword({
        variables: { email: resetEmail },
      });
      if (data.forgotPassword.success) {
        // Set feedback for successful password reset
        setResetFeedback(data.forgotPassword.message);
      } else {
        // Set feedback for failed password reset
        setResetFeedback("Failed to send reset email. Please try again!");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      // Set feedback for error during password reset
      setResetFeedback("An error occurred. Please try again!");
    }
  };

  return (
    <>
      <div className="w-full">
        {error ? (
          <div>
            <p className="error-text">The provided credentials are incorrect</p>
          </div>
        ) : null}

        <form
          id="login-form"
          onSubmit={handleFormSubmit}
          className="px-6 rounded m-4  mx-auto sm:w-3/5 md:w-2/4 lg:w-2/5 xl:w-2/6 2xl:w-2/6"
        >
          <div className="text-left">
            <h1 className="text-4xl -mb-2 font-bold font-[Newsreader]">
              Log In
            </h1>
            <h2 className="text-2xl mb-0 font-[Newsreader]">to your account</h2>
          </div>

          <label htmlFor="email" className="block font-semibold mb-2 mt-4">
            Email:
            <input
              placeholder="youremail@test.com"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              className="mt-1 p-2 mb-3 w-full font-normal border rounded"
            />
          </label>
          <label htmlFor="password" className="block mb-8 font-semibold">
            Password:
            <input
              placeholder="******"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
              className="mt-1 px-2 w-full border rounded font-normal"
            />
            <p>
              <Link
                to="/forgotPassword"
                className="float-right mt-1 text-xs text-blue-600"
              >
                Forgot Password?
              </Link>
            </p>
          </label>

          <button
            type="submit"
            className="bg-newsBlue text-white p-2 rounded hover:bg-blue-600 mt-1 w-full mb-2"
          >
            Login
          </button>

          <p className="font-bold text-right">
            Need an account?{" "}
            <Link to="/register" className="text-blue-600">
              Sign up
            </Link>
          </p>
          <p>{resetFeedback}</p>
        </form>
      </div>
    </>
  );
}
