// ResetPassword.js

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/reset-password`,
        { token, newPassword }
      );
      setMessage(data.message);
      setTimeout(() => navigate("/login"), 3000); // Redirect after success
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-primary">
      <div className="bg-secondary p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-display mb-6 text-center text-highlight">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password Field */}
          <div>
            <label htmlFor="newPassword" className="block text-sm">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-background border border-accent focus:outline-none focus:ring-2 focus:ring-highlight"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-accent"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-background border border-accent focus:outline-none focus:ring-2 focus:ring-highlight"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-accent"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-highlight text-secondary font-bold hover:bg-accent"
          >
            Reset Password
          </button>
        </form>

        {/* Message and Error Handling */}
        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
