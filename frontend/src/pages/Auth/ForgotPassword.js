// ForgotPassword.js

import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/forgot-password`, { email });
      setMessage(data.message);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-primary">
      <div className="bg-secondary p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-display mb-6 text-center text-highlight">Forgot Password</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-background border border-accent focus:outline-none focus:ring-2 focus:ring-highlight"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-highlight text-secondary font-bold hover:bg-accent"
          >
            Send Reset Email
          </button>
        </form>

        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
