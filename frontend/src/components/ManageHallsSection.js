// ManageHallsSection.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageHallsSection = ({ token }) => {
  const [halls, setHalls] = useState([]);
  const [newHall, setNewHall] = useState({
    name: '',
    capacity: '',
    is3D: false,
    type: 'silver',
    Seatlayout: { row: 0, column: 0 },
  });

  useEffect(() => {
    // Fetch all halls when the component mounts
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/halls`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHalls(response.data);
    } catch (error) {
      console.error('Error fetching halls:', error);
    }
  };

  const handleAddHall = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/halls`, newHall, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHalls([...halls, response.data]);
      setNewHall({ name: '', capacity: '', is3D: false, type: 'silver', Seatlayout: { row: 0, column: 0 } });
    } catch (error) {
      console.error('Error adding hall:', error);
    }
  };

  const handleUpdateHall = async (hallId, updatedHall) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/halls/${hallId}`, updatedHall, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedHalls = halls.map(hall => (hall._id === hallId ? response.data : hall));
      setHalls(updatedHalls);
    } catch (error) {
      console.error('Error updating hall:', error);
    }
  };

  const handleDeleteHall = async (hallId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/halls/${hallId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHalls(halls.filter(hall => hall._id !== hallId));
    } catch (error) {
      console.error('Error deleting hall:', error);
    }
  };

  return (
    <div className="p-6 bg-background text-primary">
      <h2 className="text-3xl font-bold mb-6">Manage Halls</h2>
      
      {/* Form to add new hall */}
      <div className="mb-6 p-4 bg-secondary rounded-xl shadow-lg">
        <h3 className="font-semibold text-xl mb-4">Add New Hall</h3>
        <input
            type="text"
            placeholder="Hall Name"
            value={newHall.name}
            onChange={(e) => setNewHall({ ...newHall, name: e.target.value })}
            className="border-2 border-primary p-2 mb-4 w-full rounded-lg text-secondary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-highlight"
        />
        <input
          type="number"
          placeholder="Capacity"
          value={newHall.capacity}
          onChange={(e) => setNewHall({ ...newHall, capacity: e.target.value })}
          className="border-2 border-primary p-2 mb-4 w-full rounded-lg text-secondary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-highlight"
        />
        <select
          value={newHall.type}
          onChange={(e) => setNewHall({ ...newHall, type: e.target.value })}
          className="border-2 border-primary p-2 mb-4 w-full rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-highlight"
        >
          <option value="silver">Silver</option>
          <option value="golden">Golden</option>
          <option value="platinum">Platinum</option>
        </select>
        <div className="mb-4">
          <label className="block text-sm font-medium">Seat Layout:</label>
          <div className="flex space-x-4">
            <input
              type="number"
              placeholder="Rows"
              value={newHall.Seatlayout.row}
              onChange={(e) => setNewHall({ ...newHall, Seatlayout: { ...newHall.Seatlayout, row: e.target.value } })}
              className="border-2 border-primary p-2 mb-4 w-1/2 rounded-lg text-secondary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-highlight"
            />
            <input
              type="number"
              placeholder="Columns"
              value={newHall.Seatlayout.column}
              onChange={(e) => setNewHall({ ...newHall, Seatlayout: { ...newHall.Seatlayout, column: e.target.value } })}
              className="border-2 border-primary p-2 mb-4 w-1/2 rounded-lg text-secondary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-highlight"
            />
          </div>
        </div>
        <button
          onClick={handleAddHall}
          className="bg-accent text-white py-2 px-6 rounded-lg hover:bg-highlight transition-colors"
        >
          Add Hall
        </button>
      </div>

      {/* Display all halls */}
      <div className="mt-8">
        <h3 className="font-semibold text-xl mb-4">All Halls</h3>
        <table className="w-full table-auto bg-secondary rounded-xl shadow-lg">
            <thead className="bg-background text-highlight">
                <tr>
                    <th className="px-6 py-3 text-center">Name</th>
                    <th className="px-6 py-3 text-center">Capacity</th>
                    <th className="px-6 py-3 text-center">Type</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                {halls.map((hall) => (
                    <tr key={hall._id} className="border-t border-primary">
                    <td className="px-6 py-4 text-center">{hall.name}</td>
                    <td className="px-6 py-4 text-center">{hall.capacity}</td>
                    <td className="px-6 py-4 text-center capitalize">{hall.type}</td>
                    <td className="px-6 py-4 flex justify-center space-x-4">
                        <button
                        onClick={() => handleUpdateHall(hall._id, { name: "Updated Name", capacity: 150 })}
                        className="bg-highlight text-white py-1 px-4 rounded-lg hover:bg-accent transition-colors"
                        >
                        Update
                        </button>
                        <button
                        onClick={() => handleDeleteHall(hall._id)}
                        className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 transition-colors"
                        >
                        Delete
                        </button>
                    </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageHallsSection;
