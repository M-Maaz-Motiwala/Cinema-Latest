// UsersSection.js

import React, { useEffect, useState } from "react";
import axios from "axios";

const UsersSection = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [userBookings, setUserBookings] = useState({});
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsers(response.data);
        fetchBookingsForAllUsers(response.data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, [token]);

  const fetchBookingsForAllUsers = (users) => {
    const promises = users.map((user) =>
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/bookings/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => ({
          userId: user._id,
          bookings: response.data,
        }))
        .catch((error) => {
          console.error(`Error fetching bookings for user ${user._id}:`, error);
          return { userId: user._id, bookings: [] };
        })
    );

    Promise.all(promises).then((results) => {
      const bookingsMap = results.reduce((acc, { userId, bookings }) => {
        acc[userId] = bookings;
        return acc;
      }, {});
      setUserBookings(bookingsMap);
    });
  };

  const handleRoleChange = (userId, role) => {
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/users/${userId}/role`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert(`User role updated to ${role}`);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, role } : user
          )
        );
      })
      .catch((error) => {
        console.error("Error updating role:", error);
        alert("Failed to update user role.");
      });
  };

  const handleViewBookings = (userId) => {
    setSelectedUser(userId);
    setSelectedBookings(userBookings[userId] || []);
  };

  const closePopup = () => {
    setSelectedUser(null);
    setSelectedBookings([]);
  };

  // Helper function to format the time in HH:mm format
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-background text-primary">
      <h2 className="text-3xl font-display font-bold mb-6">Users Management</h2>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border-2 border-primary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-highlight"
        />
      </div>

      {/* User Table */}
      <table className="w-full table-auto bg-secondary rounded-xl shadow-lg">
        <thead className="bg-background text-highlight">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Role</th>
            <th className="px-6 py-3">Tickets</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id} className="border-t border-primary">
              <td className="px-6 py-4">{user.name}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.role}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleViewBookings(user._id)}
                  className="px-3 py-1 bg-highlight text-background rounded-lg hover:bg-accent"
                >
                  View ({(userBookings[user._id]?.length || 0)})
                </button>
              </td>
              <td className="px-6 py-4">
                {user.role === "admin" ? (
                  <button
                    onClick={() => handleRoleChange(user._id, "user")}
                    className="px-3 py-1 bg-accent text-background rounded-lg hover:bg-highlight"
                  >
                    Demote to User
                  </button>
                ) : (
                  <button
                    onClick={() => handleRoleChange(user._id, "admin")}
                    className="px-3 py-1 bg-highlight text-background rounded-lg hover:bg-accent"
                  >
                    Promote to Admin
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bookings Popup */}
      {selectedUser && (
        <div className="fixed inset-0 bg-background bg-opacity-90 flex justify-center items-center z-50">
          <div className="bg-secondary p-6 rounded-xl shadow-lg w-3/4 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-highlight scrollbar-track-background">
            <h3 className="text-xl font-display font-bold mb-4 text-primary">
              User Bookings
            </h3>
            <div className="space-y-4">
              {selectedBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="p-4 border rounded-lg bg-background shadow-sm text-primary"
                >
                  <p>
                    <strong>Movie:</strong> {booking.showtimeId?.movieId?.title || "N/A"}
                  </p>
                  <p>
                    <strong>Showtime:</strong>{" "}
                    {booking.showtimeId?.time
                      ? formatTime(booking.showtimeId.time)
                      : "Invalid Showtime"}
                  </p>
                  <p>
                    <strong>Seats:</strong> {booking.seats.join(", ")}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={closePopup}
              className="mt-4 px-4 py-2 bg-accent text-background rounded-lg hover:bg-highlight"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersSection;
