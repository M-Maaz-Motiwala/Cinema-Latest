import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Types
const HALL_TYPES = ["golden", "silver", "platinum"];

// Utility Functions
const formatDate = (date) => new Date(date).toLocaleDateString();

const sortSeats = (seats) => {
  return seats.sort((a, b) => {
    if (a.row === b.row) {
      return a.column - b.column;
    }
    return a.row.localeCompare(b.row);
  });
};

const groupSeatsByRow = (seats) => {
  return seats.reduce((rows, seat) => {
    rows[seat.row] = rows[seat.row] || [];
    rows[seat.row].push(seat);
    return rows;
  }, {});
};

// UI Components
const LoadingSpinner = () => (
  <div className="min-h-screen bg-background flex justify-center items-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-highlight"></div>
  </div>
);

const SelectionForm = ({
  hallType,
  setHallType,
  movie,
  setMovie,
  showtime,
  setShowtime,
  movies,
  showtimes,
  onProceedToSeating,
  selectedHall,
}) => (
  <div className="bg-secondary rounded-xl p-8 shadow-lg animate-fadeIn">
    <div className="space-y-6">
      <div className="relative">
        <label htmlFor="hallType" className="text-lg font-display font-semibold text-primary mb-2 block">
          Select Hall Type
        </label>
        <select
          id="hallType"
          value={hallType}
          onChange={(e) => setHallType(e.target.value)}
          className="w-full p-4 rounded-lg bg-background border-2 border-highlight text-primary focus:ring-2 focus:ring-accent transition-all duration-300"
        >
          <option value="">-- Select a Hall Type --</option>
          {HALL_TYPES.map((type) => (
            <option key={type} value={type} className="bg-background">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <label htmlFor="movie" className="text-lg font-display font-semibold text-primary mb-2 block">
          Select Movie
        </label>
        <select
          id="movie"
          value={movie}
          onChange={(e) => setMovie(e.target.value)}
          className="w-full p-4 rounded-lg bg-background border-2 border-highlight text-primary focus:ring-2 focus:ring-accent transition-all duration-300"
        >
          <option value="">-- Select a Movie --</option>
          {movies.map((m) => (
            <option key={m._id} value={m._id} className="bg-background">
              {m.title}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <label htmlFor="showtime" className="text-lg font-display font-semibold text-primary mb-2 block">
          Select Showtime
        </label>
        <select
          id="showtime"
          value={showtime}
          onChange={(e) => setShowtime(e.target.value)}
          className="w-full p-4 rounded-lg bg-background border-2 border-highlight text-primary focus:ring-2 focus:ring-accent transition-all duration-300"
          disabled={!showtimes.length}
        >
          <option value="">-- Select a Showtime --</option>
          {showtimes.map((st) => (
            <option key={st._id} value={st._id} className="bg-background">
              {formatDate(st.date)} - {st.time} ({st.hallId?.name || 'Unknown Hall'})
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onProceedToSeating}
        disabled={!showtime || !selectedHall}
        className="w-full py-4 bg-highlight hover:bg-accent text-white font-display font-semibold rounded-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        Proceed to Seat Selection
      </button>
    </div>
  </div>
);

// Main Component
const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const bookingData = location.state;

  // State Management
  const [loading, setLoading] = useState(true);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [filteredShowtimes, setFilteredShowtimes] = useState([]);
  const [selectedHallType, setSelectedHallType] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [selectedHall, setSelectedHall] = useState("");
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // API Calls
  const fetchUserDetails = async () => {
    if (!token) {
      alert("Please log in to proceed.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserDetails(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      navigate("/login");
    }
  };

  const fetchInitialData = async () => {
    try {
      const [moviesResponse, showtimesResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/movies`),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/showtimes`),
      ]);

      // Filter out showtimes with invalid hallId
      const validShowtimes = showtimesResponse.data.filter(
        (showtime) => showtime?.hallId && showtime.hallId?.type
      );

      setMovies(moviesResponse.data);
      setShowtimes(validShowtimes);
      setFilteredShowtimes(validShowtimes);
      
      // Set initial values from navigation state
      if (bookingData) {
        setSelectedHallType(bookingData.hall || "");
        setSelectedMovie(bookingData.movie || "");
        setSelectedShowtime(bookingData.showtime || "");
        
        if (bookingData.showtime) {
          const showtime = validShowtimes.find(st => st._id === bookingData.showtime);
          if (showtime?.hallId) {
            setSelectedHall(showtime.hallId._id);
            await fetchSeats(bookingData.showtime, showtime.hallId._id);
          }
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchSeats = async (showtimeId, hallId) => {
    if (!showtimeId || !hallId) return;
    
    setLoadingSeats(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/seats`,
        { params: { showtimeId, hallId } }
      );
      setSeats(sortSeats(response.data));
    } catch (error) {
      console.error("Error fetching seats:", error);
    } finally {
      setLoadingSeats(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchUserDetails();
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedHallType && showtimes.length > 0) {
      const validShowtimes = showtimes.filter(
        (st) => st?.hallId?.type === selectedHallType
      );
      const filtered = validShowtimes
        .map((st) => st.movieId)
        .filter((movie) => movie); // Filter out null/undefined movies
      
      const uniqueMovies = Array.from(
        new Set(filtered.map((m) => m._id))
      ).map((id) => filtered.find((m) => m._id === id));
      
      setFilteredMovies(uniqueMovies);
    } else {
      setFilteredMovies(movies);
    }
  }, [selectedHallType, showtimes, movies]);

  useEffect(() => {
    const filtered = showtimes.filter(
      (st) =>
        (!selectedHallType || (st?.hallId?.type === selectedHallType)) &&
        (!selectedMovie || st?.movieId?._id === selectedMovie)
    );
    setFilteredShowtimes(filtered);
  }, [selectedHallType, selectedMovie, showtimes]);

  useEffect(() => {
    if (selectedShowtime) {
      const showtime = showtimes.find((st) => st._id === selectedShowtime);
      if (showtime?.hallId?._id) {
        setSelectedHall(showtime.hallId._id);
        fetchSeats(selectedShowtime, showtime.hallId._id);
      }
    }
  }, [selectedShowtime, showtimes]);

  // Rest of the component remains the same...
  // (SeatGrid, handleSeatClick, handleProceedToPayment, and render logic)

  return (
    <div className="min-h-screen bg-background text-primary p-4 md:p-8">
      {/* ... Rest of the JSX remains the same ... */}
    </div>
  );
};

export default BookingPage;