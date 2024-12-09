import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ShowtimePage = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch showtimes from the backend
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/showtimes`)
      .then((response) => {
        setShowtimes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching showtimes:', error);
        setLoading(false);
      });
  }, []);

  const formatTimeInterval = (time, duration) => {
    const [hours, minutes] = time.split(':').map(Number);
    const startTime = new Date(0, 0, 0, hours, minutes); // Set a base date
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const format = (date) =>
      date
        .toTimeString()
        .split(' ')[0]
        .slice(0, 5); // Extract HH:MM
    return `${format(startTime)} - ${format(endTime)}`;
  };

  if (loading) return <div className="text-center text-lg">Loading...</div>;

  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display text-center mb-8">
          Showtimes
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {showtimes.map((showtime) => (
            <div
              key={showtime._id}
              className="bg-secondary p-4 rounded-lg shadow-md hover:shadow-lg"
            >
              {/* Movie Poster */}
              <img
                src={`${process.env.REACT_APP_BACKEND_URL_STATIC}/MovieFiles/${showtime.movieId.picture_url.replace(
                  /\\/g,
                  '/'
                )}`}
                alt={showtime.movieId.title}
                className="rounded-lg object-cover w-full h-48 sm:h-56 lg:h-64"
              />
              {/* Showtime Details */}
              <div className="mt-4">
                <h3 className="text-xl sm:text-2xl font-bold">
                  {showtime.movieId.title}
                </h3>
                <p className="text-sm text-gray-400">{showtime.hallId.name}</p>
                <p className="text-sm text-highlight">
                  {formatTimeInterval(showtime.time, showtime.movieId.duration)}
                </p>
                <p className="text-sm text-highlight">
                  Ticket Price: Rs.{showtime.ticketPrice}
                </p>
                <Link to={`/book/${showtime._id}`}>
                  <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Book Now
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowtimePage;
