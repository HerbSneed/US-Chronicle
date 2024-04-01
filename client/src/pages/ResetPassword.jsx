import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { RESET_PASSWORD } from "../utils/mutations";

function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [resetPassword] = useMutation(RESET_PASSWORD);

  const handleReset = async () => {
    try {

      console.log("New Password", newPassword);
      console.log("Token", token);

      const { data } = await resetPassword({
        variables: { token, newPassword },
      });

      console.log("data", data)

      if (data && data.resetPassword && data.resetPassword.success) {
        setMessage("Password reset successful. Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage(
          (data && data.resetPassword && data.resetPassword.message) ||
            "Reset password failed."
        );
      }
    } catch (err) {
      setMessage("Error resetting password.");
      console.error("Error resetting password: ", err);
    }
  };

  return (
    <div className="flex w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12
     gap-x-3 mx-auto mt-6">
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
        className="w-4/12 bg-blue-600 text-white rounded">
        Reset
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ResetPassword;
