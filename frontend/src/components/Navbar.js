// Navbar.js

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "./Logout"; // Assuming Logout handles logout functionality

const Navbar = () => {
  // Access auth state (user and role)
  const user = useSelector((state) => state.auth.user);

  // Get the current location/path
  const location = useLocation();

  // Function to check if the current path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-secondary text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="hover:text-primary">
          <h1 className="text-2xl font-bold">CinemaApp</h1>
        </Link>

        {/* Navigation Links */}
        <ul className="flex space-x-6 items-center">
          {/* Always visible links */}
          <li>
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive("/") ? "bg-primary text-accent font-semibold" : "hover:bg-accent"
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/showtimes"
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive("/showtimes") ? "bg-primary text-accent font-semibold" : "hover:bg-accent"
              }`}
            >
              Showtime
            </Link>
          </li>
          <li>
            <Link
              to="/booking"
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive("/booking") ? "bg-primary text-accent font-semibold" : "hover:bg-accent"
              }`}
            >
              Booking
            </Link>
          </li>

          {/* Role-based links (Admin/User Dashboard) */}
          {user && (
            <li>
              <Link
                to={"/dashboard"}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive("/dashboard")
                    ? "bg-primary text-accent font-semibold"
                    : "hover:bg-accent"
                }`}
              >
                {"Dashboard"}
              </Link>
            </li>
          )}

          {/* Authentication buttons */}
          {user ? (
            // Logout button for signed-in users
            <li>
              <Logout />
            </li>
          ) : (
            // Login button for guests
            <li>
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive("/login") ? "bg-primary text-accent font-semibold" : "hover:bg-accent"
                }`}
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
