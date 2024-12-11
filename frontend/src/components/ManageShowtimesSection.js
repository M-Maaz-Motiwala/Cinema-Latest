// ManageShowtimesSection.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PropagateLoader } from 'react-spinners';
import { FaEdit, FaTrash } from 'react-icons/fa';


const ManageShowtimesSection = ({ token }) => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [halls, setHalls] = useState([]);
  const [formData, setFormData] = useState({
    movieId: '',
    hallId: '',
    date: '',
    time: '',
    ticketPrice: '',
  });
  const [editingShowtime, setEditingShowtime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (isoDate) => (isoDate ? new Date(isoDate).toISOString().split('T')[0] : '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [showtimesResponse, moviesResponse, hallsResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/showtimes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/movies`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/halls`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setShowtimes(showtimesResponse.data);
        setMovies(moviesResponse.data);
        setHalls(hallsResponse.data);
        setIsLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateShowtime = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    if (formData.date < today) {
      alert("You can't select a past date!");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/showtimes`,
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowtimes((prev) => [...prev, response.data]);
      setFormData({
        movieId: '',
        hallId: '',
        date: '',
        time: '',
        ticketPrice: '',
      });
      alert('Showtime added successfully');
    } catch (error) {
      console.error('Error creating showtime:', error);
      alert('Failed to create showtime');
    }
  };

  const handleDeleteShowtime = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/showtimes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowtimes((prev) => prev.filter((showtime) => showtime._id !== id));
      alert('Showtime deleted successfully');
    } catch (error) {
      console.error('Error deleting showtime:', error);
      alert('Failed to delete showtime');
    }
  };

  const handleEditShowtime = (showtime) => {
    setEditingShowtime(showtime);
    setFormData({
      movieId: showtime.movieId._id,
      hallId: showtime.hallId._id,
      date: formatDate(showtime.date),
      time: showtime.time,
      ticketPrice: showtime.ticketPrice,
    });
  };

  const handleUpdateShowtime = async (e) => {
    e.preventDefault();
    
    const today = new Date().toISOString().split('T')[0];
    if (formData.date < today) {
      alert("You can't select a past date!");
      return;
    }
    
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/showtimes/${editingShowtime._id}`,
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowtimes((prev) =>
        prev.map((showtime) =>
          showtime._id === editingShowtime._id ? response.data : showtime
        )
      );
      setEditingShowtime(null);
      alert('Showtime updated successfully');
    } catch (error) {
      console.error('Error updating showtime:', error);
      alert('Failed to update showtime');
    }
  };

  return (
    <div className="p-6 bg-background text-primary min-h-screen">

      <h2 className="text-3xl font-bold mb-6">Manage Showtimes</h2>

      {/* Form for creating or editing showtime */}
      <form
        onSubmit={editingShowtime ? handleUpdateShowtime : handleCreateShowtime}
        className="mb-8 p-6 bg-secondary rounded-xl shadow-lg transition-all duration-300 ease-in-out"
      >
        <h3 className="font-semibold text-2xl mb-6 text-center">
          {editingShowtime ? 'Update Showtime' : 'Add Showtime'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select Movie</label>
            <select
              name="movieId"
              value={formData.movieId}
              onChange={handleInputChange}
              required
              className="border-2 border-highlight bg-background text-primary p-3 rounded-lg w-full"
            >
              <option value="" disabled>
                Select Movie
              </option>
              {movies.map((movie) => (
                <option key={movie._id} value={movie._id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select Hall</label>
            <select
              name="hallId"
              value={formData.hallId}
              onChange={handleInputChange}
              required
              className="border-2 border-highlight bg-background text-primary p-3 rounded-lg w-full"
            >
              <option value="" disabled>
                Select Hall
              </option>
              {halls.map((hall) => (
                <option key={hall._id} value={hall._id}>
                  {hall.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Show Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]} // Disable past dates
              required
              className="border-2 border-highlight bg-background text-primary p-3 rounded-lg w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Show Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
              className="border-2 border-highlight bg-background text-primary p-3 rounded-lg w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ticket Price</label>
            <input
              type="number"
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={handleInputChange}
              placeholder="Ticket Price"
              required
              className="border-2 border-highlight bg-background text-primary p-3 rounded-lg w-full"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 px-8 py-3 bg-accent text-white rounded-lg w-full hover:bg-highlight focus:outline-none"
        >
          {editingShowtime ? 'Update Showtime' : 'Add Showtime'}
        </button>
      </form>

      {/* Showtimes List */}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <PropagateLoader
            color="#d97706"
            size={20}
            speedMultiplier={1}
          />{/* Show loading spinner when data is loading */}
        </div>
      ) : (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Existing Showtimes</h3>
          <ul className="space-y-4">
            {showtimes.map((showtime) => (
              <li
                key={showtime._id}
                className="p-4 bg-secondary rounded-xl shadow-lg flex justify-between items-center transition-all duration-300 ease-in-out"
              >
                <span className="text-lg font-medium">
                  {showtime.movieId?.title} - {showtime.hallId?.name} -{' '}
                  {showtime.date} - {showtime.time} - ${showtime.ticketPrice}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditShowtime(showtime)}
                    className="px-4 py-2 text-accent hover:text-highlight rounded-lg transition-all"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteShowtime(showtime._id)}
                    className="px-4 py-2 text-red-500 hover:text-red-700 rounded-lg transition-all"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ManageShowtimesSection;
