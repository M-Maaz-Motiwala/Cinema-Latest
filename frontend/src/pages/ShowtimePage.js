import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const ShowtimePage = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('movie'); // Default filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredShowtimes, setFilteredShowtimes] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();

  const handleBooking = (showtime) => {
    navigate('/bookings', {
      state: {
        hall: showtime.hallId.type,
        movie: showtime.movieId._id,
        showtime: showtime._id,
      },
    });
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/showtimes`)
      .then((response) => {
        setShowtimes(response.data);
        setFilteredShowtimes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching showtimes:', error);
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setSearchQuery(''); // Reset search query when filter type changes
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = showtimes.filter((showtime) => {
      const targetField =
        filterType === 'movie'
          ? showtime.movieId.title.toLowerCase()
          : filterType === 'hall'
          ? showtime.hallId.name.toLowerCase()
          : `${new Date(showtime.date).toLocaleDateString()} ${showtime.time}`.toLowerCase();

      return targetField.includes(query);
    });

    setFilteredShowtimes(filtered);

    const dropdownData = [...new Set(
      showtimes.map((showtime) =>
        filterType === 'movie'
          ? showtime.movieId.title
          : filterType === 'hall'
          ? showtime.hallId.name
          : `${new Date(showtime.date).toLocaleDateString()} ${showtime.time}`
      )
    )];

    setDropdownOptions(
      dropdownData.filter((option) => option.toLowerCase().includes(query))
    );
  };

  const openModal = (movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  if (loading) return <div className="text-center text-lg">Loading...</div>;

  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-center mb-8 text-highlight font-extrabold">
          Explore Showtimes
        </h1>

        {/* Filter and Search */}
        <div className="mb-8 flex flex-col md:flex-row justify-center items-center gap-4">
          <select
            value={filterType}
            onChange={handleFilterChange}
            className="p-3 border border-secondary rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-accent bg-secondary text-primary"
          >
            <option value="movie">Movie</option>
            <option value="hall">Hall</option>
            <option value="showtime">Showtime</option>
          </select>

          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder={`Search by ${filterType}...`}
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 border border-secondary rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-accent bg-secondary text-primary"
            />
            {searchQuery && dropdownOptions.length > 0 && (
              <ul className="absolute left-0 w-full bg-secondary text-primary rounded-lg shadow-md mt-2 z-10">
                {dropdownOptions.map((option, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-highlight cursor-pointer"
                    onClick={() => {
                      setSearchQuery(option);
                      setFilteredShowtimes(
                        showtimes.filter((showtime) => {
                          const targetField =
                            filterType === 'movie'
                              ? showtime.movieId.title
                              : filterType === 'hall'
                              ? showtime.hallId.name
                              : `${new Date(showtime.date).toLocaleDateString()} ${showtime.time}`;
                          return targetField === option;
                        })
                      );
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Movie List */}
        <div className="space-y-6">
          {filteredShowtimes.length > 0 ? (
            filteredShowtimes.map((showtime) => (
              <div
                key={showtime._id}
                className="bg-secondary p-4 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 flex gap-6 items-center"
              >
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL_STATIC}/MovieFiles/${showtime.movieId.picture_url.replace(
                    /\\/g,
                    '/'
                  )}`}
                  alt={showtime.movieId.title}
                  className="rounded-lg object-cover w-24 h-24 cursor-pointer border border-accent"
                  onClick={() => openModal(showtime.movieId)}
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-highlight">
                    {showtime.movieId.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{showtime.hallId.name}</p>
                  <p className="text-lg font-semibold text-accent mt-2">
                    {`${new Date(showtime.date).toLocaleDateString()} ${showtime.time}`}
                  </p>
                  <p className="text-sm text-gray-300">Ticket Price: Rs.{showtime.ticketPrice}</p>
                </div>
                <button
                  onClick={() => handleBooking(showtime)}
                  className="ml-auto bg-accent hover:bg-highlight text-primary font-semibold py-2 px-6 rounded-lg transition duration-300"
                >
                  Book Now
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-lg text-gray-400">No showtimes found.</div>
          )}
        </div>

        {/* Modal for Movie Details */}
        <Modal
          isOpen={!!selectedMovie}
          onRequestClose={closeModal}
          className="bg-background text-primary rounded-xl p-6 max-w-lg mx-auto mt-20 shadow-lg focus:outline-none"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          {selectedMovie && (
            <div>
              <h2 className="text-3xl font-bold mb-4 text-highlight">
                {selectedMovie.title}
              </h2>
              <p className="text-lg text-gray-300 mb-4">
                <strong>Synopsis:</strong> {selectedMovie.synopsis || 'No synopsis available.'}
              </p>
              <p className="text-lg text-gray-300">
                <strong>Cast:</strong> {selectedMovie.cast?.join(', ') || 'Not available.'}
              </p>
              <button
                onClick={closeModal}
                className="mt-6 w-full bg-accent hover:bg-highlight text-primary font-semibold py-2 px-4 rounded-lg transition duration-300"
              >
                Close
              </button>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ShowtimePage;
