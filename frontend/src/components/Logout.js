// Logout.js

import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Logout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-highlight text-white px-4 py-2 rounded-lg hover:bg-accent"
    >
      Logout
    </button>
  );
};

export default Logout;
