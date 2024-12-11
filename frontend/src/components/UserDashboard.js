// UserDashboard.js

import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import defaultAvatar from '../static/default-avatar.png';
import axios from 'axios';

const UserDashboardContent = ({
  user,
  handleUpdate,
  name,
  setName,
  email,
  setEmail,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  handleProfilePicUpload,
  token,
}) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [token]);

  return (
    <div className="container mx-auto p-6 bg-secondary rounded-lg shadow-lg">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-highlight text-center">
        Welcome, {user.name}
      </h2>

      {/* Profile Section */}
      <div className="flex flex-col sm:flex-row items-center justify-center mb-10 space-y-6 sm:space-y-0 sm:space-x-10">
        <div className="relative group">
          <img
            src={
              user.profilePicture
                ? `${process.env.REACT_APP_BACKEND_URL_STATIC}/UserFiles/${user.profilePicture.replace(/\\/g, '/')}`
                : defaultAvatar
            }
            alt="Profile"
            className="rounded-full w-32 h-32 sm:w-40 sm:h-40 object-cover border-4 border-highlight shadow-md"
          />
          <input
            type="file"
            alt="Click here to change"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
            onChange={handleProfilePicUpload}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <FiEdit className="text-white text-3xl" />
          </div>
        </div>
      </div>

      {/* Update Form */}
      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm sm:text-base font-medium text-primary mb-1">
            Name
          </label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-highlight" />
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 pl-10 border-2 border-highlight bg-background text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm sm:text-base font-medium text-primary mb-1">
            Email
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-highlight" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 border-2 border-highlight bg-background text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight"
            />
          </div>
        </div>
        <div>
          <label htmlFor="currentPassword" className="block text-sm sm:text-base font-medium text-primary mb-1">
            Current Password
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-highlight" />
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 pl-10 border-2 border-highlight bg-background text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm sm:text-base font-medium text-primary mb-1">
            New Password (Optional)
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-highlight" />
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 pl-10 border-2 border-highlight bg-background text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-highlight text-white py-3 rounded-lg shadow-md hover:bg-accent hover:shadow-lg transition-transform transform hover:scale-105 font-semibold"
        >
          Update Profile
        </button>
      </form>

      {/* Bookings List */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-primary mb-6 text-center">Your Bookings</h3>
        {bookings.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <li key={booking._id} className="bg-background p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow transform hover:scale-105">
                <h4 className="text-xl font-semibold text-highlight">
                  Showtime: {new Date(booking.showtimeId.date).toLocaleDateString()} - {booking.showtimeId.time}
                </h4>
                <p className="text-primary mt-2">Seats: {booking.seats.join(', ')}</p>
                <p className="text-primary mt-2">Status: {booking.paymentStatus}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-primary text-lg">You have no bookings yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboardContent;
