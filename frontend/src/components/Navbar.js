import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, X, Film, Clock, BookOpen, User, LogOut } from 'lucide-react';
import Logout from "./Logout";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, icon: Icon }) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        isActive(to)
          ? "bg-highlight text-white font-semibold transform scale-105"
          : "hover:bg-accent hover:text-white"
      }`}
      onClick={() => setIsMenuOpen(false)}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </Link>
  );

  return (
    <nav className="bg-secondary shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-highlight hover:text-accent transition-colors duration-300"
          >
            <Film className="w-8 h-8" />
            <span className="text-2xl font-bold font-display hidden sm:block">CinemaApp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" icon={Film}>Home</NavLink>
            <NavLink to="/showtimes" icon={Clock}>Showtime</NavLink>
            <NavLink to="/bookings" icon={BookOpen}>Booking</NavLink>
            
            {user && (
              <NavLink to="/dashboard" icon={User}>Dashboard</NavLink>
            )}

            {user ? (
              <div className="flex items-center">
                
                <Logout />
              </div>
            ) : (
              <NavLink to="/login" icon={LogOut}>Login</NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors duration-300"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fadeIn">
            <NavLink to="/" icon={Film}>Home</NavLink>
            <NavLink to="/showtimes" icon={Clock}>Showtime</NavLink>
            <NavLink to="/bookings" icon={BookOpen}>Booking</NavLink>
            
            {user && (
              <NavLink to="/dashboard" icon={User}>Dashboard</NavLink>
            )}

            {user ? (
              <div className="space-y-2">
                <div className="px-4 py-2 text-gray-300">
                  Welcome, {user.name || 'User'}
                </div>
                <div className="px-4">
                  <Logout />
                </div>
              </div>
            ) : (
              <NavLink to="/login" icon={LogOut}>Login</NavLink>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;