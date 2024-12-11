// ManageHallsSection.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { PropagateLoader } from 'react-spinners';


const ManageHallsSection = ({ token }) => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newHall, setNewHall] = useState({
    name: '',
    capacity: '',
    is3D: false,
    type: 'silver',
    Seatlayout: { row: 0, column: 0 },
  });

  // State for managing the hall to be updated
  const [editHall, setEditHall] = useState(null);

  useEffect(() => {
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
    } finally {
      setLoading(false);
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

  const handleUpdateHall = async (updatedHall) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/halls/${updatedHall._id}`, updatedHall, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedHalls = halls.map((hall) => (hall._id === updatedHall._id ? response.data : hall));
      setHalls(updatedHalls);
      setEditHall(null);  // Close the edit modal after updating
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
      setHalls(halls.filter((hall) => hall._id !== hallId));
    } catch (error) {
      console.error('Error deleting hall:', error);
    }
  };

  const handleChangeEditHall = (field, value) => {
    setEditHall({ ...editHall, [field]: value });
  };

  return (
    <div className="p-6 bg-background text-primary">
      <h2 className="text-3xl font-bold mb-6">Manage Halls</h2>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-highlight h-12 w-12"></div>
        </div>

        <PropagateLoader
          color="#d97706"
          size={20}
          speedMultiplier={1}
          className="flex justify-center items-center"
        />
      ) : (
        <>
          {/* Form to add new hall */}
          <div className="mb-6 p-4 bg-secondary rounded-xl shadow-lg">
            <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
              <FaPlus className="text-accent" /> Add New Hall
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hall Name</label>
                <input
                  type="text"
                  placeholder="Hall Name"
                  value={newHall.name}
                  onChange={(e) => setNewHall({ ...newHall, name: e.target.value })}
                  className="border-2 border-highlight bg-background text-primary p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Capacity</label>
                <input
                  type="number"
                  placeholder="Capacity"
                  value={newHall.capacity}
                  onChange={(e) => setNewHall({ ...newHall, capacity: e.target.value })}
                  className="border-2 border-highlight bg-background text-primary p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={newHall.type}
                  onChange={(e) => setNewHall({ ...newHall, type: e.target.value })}
                  className="border-2 border-highlight bg-background text-primary p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight w-full"
                >
                  <option value="silver">Silver</option>
                  <option value="golden">Golden</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Seat Layout</label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Rows"
                    value={newHall.Seatlayout.row}
                    onChange={(e) => setNewHall({ ...newHall, Seatlayout: { ...newHall.Seatlayout, row: e.target.value } })}
                    className="border-2 border-highlight bg-background text-primary p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight w-full"
                  />
                  <input
                    type="number"
                    placeholder="Columns"
                    value={newHall.Seatlayout.column}
                    onChange={(e) => setNewHall({ ...newHall, Seatlayout: { ...newHall.Seatlayout, column: e.target.value } })}
                    className="border-2 border-highlight bg-background text-primary p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight w-full"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={handleAddHall}
              className="bg-accent text-white py-2 px-6 rounded-lg hover:bg-highlight transition-colors mt-4"
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
                  <tr key={hall._id} className="border-t border-primary hover:bg-accent-light">
                    <td className="px-6 py-4 text-center">{hall.name}</td>
                    <td className="px-6 py-4 text-center">{hall.capacity}</td>
                    <td className="px-6 py-4 text-center capitalize">{hall.type}</td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <button
                        onClick={() => setEditHall(hall)}
                        className="text-accent hover:text-highlight"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteHall(hall._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal for editing hall */}
          {editHall && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20">
              <div className="bg-white bg-opacity-90 text-background p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Edit Hall</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Hall Name</label>
                  <input
                    type="text"
                    value={editHall.name}
                    onChange={(e) => handleChangeEditHall('name', e.target.value)}
                    className="border-2 border-highlight bg-background text-primary p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Capacity</label>
                  <input
                    type="number"
                    value={editHall.capacity}
                    onChange={(e) => handleChangeEditHall('capacity', e.target.value)}
                    className="border-2 border-highlight bg-background text-primary p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={editHall.type}
                    onChange={(e) => handleChangeEditHall('type', e.target.value)}
                    className="border-2 border-highlight bg-background text-primary p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight w-full"
                  >
                    <option value="silver">Silver</option>
                    <option value="golden">Golden</option>
                    <option value="platinum">Platinum</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Seat Layout</label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={editHall.Seatlayout.row}
                      onChange={(e) => handleChangeEditHall('Seatlayout.row', e.target.value)}
                      className="border-2 border-highlight bg-background text-primary p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight w-full"
                    />
                    <input
                      type="number"
                      value={editHall.Seatlayout.column}
                      onChange={(e) => handleChangeEditHall('Seatlayout.column', e.target.value)}
                      className="border-2 border-highlight bg-background text-primary p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight w-full"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setEditHall(null)} // Close modal
                    className="bg-secondary text-primary py-2 px-6 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateHall(editHall)} // Save changes
                    className="bg-accent text-white py-2 px-6 rounded-lg hover:bg-highlight transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageHallsSection;
