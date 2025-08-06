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

      // Reset password mutation
      const { data } = await resetPassword({
        variables: { token, newPassword },
      });

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
      className="flex flex-col items-center w-11/12 sm:w-10/12 md:w-[400px] 
     gap-y-2 mx-auto mt-6"
    >
      <h2 className="text-center text-2xl">Enter your new password</h2>

      <div className="flex mt-1 gap-x-2">
        <input
          placeholder="Enter new password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-[275px] rounded"
        />
        <button
          onClick={handleReset}
          disabled={!newPassword.trim()}
          className="w-4/12 md:w-[100px] bg-blue-600 text-white rounded"
        >
          Reset
        </button>
      </div>
      {message && <p className="mt-1">{message}</p>}
    </div>
  );
}

export default ResetPassword;
