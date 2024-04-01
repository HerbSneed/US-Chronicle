import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { FORGOT_PASSWORD } from "../utils/mutations";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [resetEmail, setResetEmail] = useState("");
  const [resetFeedback, setResetFeedback] = useState(null);
  const [forgotPassword] = useMutation(FORGOT_PASSWORD);

  const handleForgotPassword = async () => {
    console.log("Email to reset:", resetEmail);

    try {
      console.log("Sending password reset request for:", resetEmail);
      const { data } = await forgotPassword({
        variables: { email: resetEmail },
      });

      if (data.forgotPassword.success) {
        setResetFeedback(data.forgotPassword.message);

        // Navigate to the login page after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setResetFeedback("Failed to send reset email. Please try again!");
      }
    } catch (err) {
      console.error("Error resetting password:", err.message || err);
      setResetFeedback("An error occurred. Please try again!");
    }
  };

  return (
    <>
      <div className="py-6 rounded mx-auto my-5 w-11/12 sm:w-9/12 md:w-8/12 lg:w-7/12 xl:w-6/12 2xl:w-5/12">
        <h2 className="text-center text-2xl mb-1">Forgot Your Password?</h2>
        <p className="text-center mb-4">
          Enter your email address and we will send you instructions to reset
          your password.
        </p>
        <div className="flex h-10 items-center justify-center gap-x-2">
          <input
            placeholder="Enter your email"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            className="w-4/6 border border-gray-300 rounded-md text-black"
          />
          <button
            className="bg-blue-600 text-white rounded hover:bg-blue-200 h-10 w-1/4"
            onClick={handleForgotPassword}
          >
            Reset
          </button>
        </div>

        <p className="font-bold mt-1 text-blue-600 text-center">
          <Link to="/login"> Back to Log in </Link>
        </p>

        {resetFeedback && <p className="text-center mt-4">{resetFeedback}</p>}
      </div>
    </>
  );
}
