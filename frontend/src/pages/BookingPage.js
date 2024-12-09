import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookingPage = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [filteredShowtimes, setFilteredShowtimes] = useState([]);
  const [hallTypes, setHallTypes] = useState(["golden", "silver", "platinum"]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [selectedHallType, setSelectedHallType] = useState("");
  const [loading, setLoading] = useState(false);
  const [seats, setSeats] = useState([]);
  const [showSeating, setShowSeating] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);



  const navigate = useNavigate();

  // Fetch all showtimes and movies on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [moviesResponse, showtimesResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/movies`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/showtimes`),
        ]);
        setMovies(moviesResponse.data);
        setShowtimes(showtimesResponse.data);
        setFilteredShowtimes(showtimesResponse.data); // Default to all showtimes initially
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Set selectedHall when the user picks a hall
  const handleHallSelection = (hallId) => {
    setSelectedHall(hallId);
  };
  // Update filtered movies when hallType changes
  useEffect(() => {
    if (selectedHallType) {
      const filtered = showtimes
        .filter((showtime) => showtime.hallId.type === selectedHallType)
        .map((showtime) => showtime.movieId);
      const uniqueMovies = Array.from(new Set(filtered.map((movie) => movie._id)))
        .map((id) => filtered.find((movie) => movie._id === id));
      setFilteredMovies(uniqueMovies);
    } else {
      setFilteredMovies(movies); // Reset to all movies if no hallType selected
    }
  }, [selectedHallType, showtimes, movies]);

  // Update filtered showtimes when movie or hallType changes
  useEffect(() => {
    const filtered = showtimes.filter(
      (showtime) =>
        (!selectedHallType || showtime.hallId.type === selectedHallType) &&
        (!selectedMovie || showtime.movieId._id === selectedMovie)
    );
    setFilteredShowtimes(filtered);
  }, [selectedHallType, selectedMovie, showtimes]);

  // Fetch seats for selected showtime
  const fetchSeats = async (showtimeId, hallId) => {
    setLoadingSeats(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/seats`,
        { params: { showtimeId, hallId } } // Passing both showtimeId and hallId
      );
      console.log(response.data);  // Log to check the seats data
      setSeats(response.data);
    } catch (error) {
      console.error("Error fetching seats:", error);
    } finally {
      setLoadingSeats(false);
    }
  };
  
  

  // Handle seating display
  const handleProceedToSeating = async () => {
    if (selectedShowtime && selectedHall) { // Ensure hallId and showtimeId are both selected
      await fetchSeats(selectedShowtime, selectedHall); // Pass both showtimeId and hallId
      setShowSeating(true);
    } else {
      alert("Please select both a showtime and a hall.");
    }
  };
  

  return (
    <div className="min-h-screen bg-background text-primary p-4">
      <h1 className="text-3xl font-bold mb-6">Book Your Tickets</h1>

      {!showSeating ? (
        <>
          {/* Hall Type Dropdown */}
          <div className="mb-6">
            <label htmlFor="hallType" className="block text-lg font-semibold mb-2">
              Select Hall Type:
            </label>
            <select
              id="hallType"
              value={selectedHallType}
              onChange={(e) => setSelectedHallType(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white text-black"
            >
              <option value="">-- Select a Hall Type --</option>
              {hallTypes.map((hall) => (
                <option key={hall} value={hall}>
                  {hall.charAt(0).toUpperCase() + hall.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Movie Dropdown */}
          <div className="mb-6">
            <label htmlFor="movie" className="block text-lg font-semibold mb-2">
              Select Movie:
            </label>
            <select
              id="movie"
              value={selectedMovie}
              onChange={(e) => setSelectedMovie(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white text-black"
            >
              <option value="">-- Select a Movie --</option>
              {filteredMovies.map((movie) => (
                <option key={movie._id} value={movie._id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>

          {/* Showtime Dropdown */}
          <div className="mb-6">
            <label htmlFor="showtime" className="block text-lg font-semibold mb-2">
              Select Showtime:
            </label>
            <select
              id="showtime"
              value={selectedShowtime}
              onChange={(e) => setSelectedShowtime(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white text-black"
              disabled={!filteredShowtimes.length}
            >
              <option value="">-- Select a Showtime --</option>
              {filteredShowtimes.map((showtime) => (
                <option key={showtime._id} value={showtime._id}>
                  {new Date(showtime.date).toLocaleDateString()} - {showtime.time} (
                  {showtime.hallId.name})
                </option>
              ))}
            </select>
          </div>

          {/* Proceed to Seating Button */}
          <button
            onClick={handleProceedToSeating}
            disabled={!selectedShowtime || !selectedHall} // Disable if either showtime or hall is not selected
            className="w-full bg-highlight text-white py-3 rounded-lg hover:bg-accent font-semibold"
          >
            Proceed to Seat Selection
          </button>

        </>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Select Your Seats</h2>
          {loadingSeats ? (
            <p>Loading seats...</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {Object.keys(
                seats.reduce((rows, seat) => {
                  rows[seat.row] = rows[seat.row] || [];
                  rows[seat.row].push(seat);
                  return rows;
                }, {})
              ).map((rowKey) => (
                <div key={rowKey} className="flex items-center">
                  <span className="font-bold mr-2">{rowKey}</span>
                  {seats
                    .filter((seat) => seat.row === rowKey)
                    .map((seat) => (
                      <div
                        key={seat._id}
                        className={`w-8 h-8 flex items-center justify-center border rounded-lg mx-1 ${
                          seat.isAvailable ? "bg-green-500" : "bg-red-500"
                        }`}
                        title={`Seat ${seat.row}${seat.column}`}
                      >
                        {seat.column}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => setShowSeating(false)}
            className="mt-4 px-4 py-2 bg-secondary text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
