import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { RESET_PASSWORD } from "../utils/mutations";

function ResetPassword() {
  // Extracting token from URL params
  const { token } = useParams();

  // State for new password and message
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // Navigate function from react-router
  const navigate = useNavigate();

  // Mutation hook for resetting password
  const [resetPassword] = useMutation(RESET_PASSWORD);

  // Function to handle password reset
  const handleReset = async () => {
    try {
      // Logging new password and token
      console.log("New Password", newPassword);
      console.log("Token", token);

      // Reset password mutation
      const { data } = await resetPassword({
        variables: { token, newPassword },
      });

      // Logging mutation data
      console.log("data", data);

      // Checking if password reset was successful
      if (data && data.resetPassword && data.resetPassword.success) {
        // Display success message and redirect to login after 2 seconds
        setMessage("Password reset successful. Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        // Display error message if password reset failed
        setMessage(
          (data && data.resetPassword && data.resetPassword.message) ||
            "Reset password failed."
        );
      }
    } catch (err) {
      // Display error message if there's an error during password reset
      setMessage("Error resetting password.");
      console.error("Error resetting password: ", err);
    }
  };

  return (
    <div
      className="flex w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12
     gap-x-3 mx-auto mt-6"
    >
      <input
        placeholder="Enter new password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-10/12 rounded"
      />
      <button
        onClick={handleReset}
        disabled={!newPassword.trim()}
        className="w-4/12 bg-blue-600 text-white rounded"
      >
        Reset
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ResetPassword;
