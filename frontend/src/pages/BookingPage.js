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
              {formatDate(st.date)} - {st.time} ({st.hallId.name})
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

const SeatLegend = () => (
  <div className="flex justify-center gap-4 mb-4">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 bg-white rounded"></div>
      <span className="text-primary">Available</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 bg-highlight rounded"></div>
      <span className="text-primary">Selected</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 bg-red-500 rounded"></div>
      <span className="text-primary">Occupied</span>
    </div>
  </div>
);

const SeatGrid = ({ seats, selectedSeats, onSeatClick }) => (
  <div className="grid gap-6">
    {Object.entries(groupSeatsByRow(seats)).map(([rowKey, rowSeats]) => (
      <div key={rowKey} className="flex items-center justify-center space-x-4">
        <span className="font-display font-bold text-primary w-8">{rowKey}</span>
        <div className="flex gap-4 flex-wrap justify-center">
          {rowSeats.map((seat) => (
            <button
              key={`${seat.row}${seat.column}`}
              onClick={() => onSeatClick(seat)}
              className={`
                w-12 h-12 rounded-lg font-display font-semibold
                flex items-center justify-center
                transform hover:scale-110 transition-all duration-300
                ${
                  seat.isAvailable
                    ? selectedSeats.includes(`${seat.row}${seat.column}`)
                      ? 'bg-highlight text-white'
                      : 'bg-white text-background hover:bg-highlight hover:text-white'
                    : 'bg-red-500 text-white cursor-not-allowed'
                }
              `}
              disabled={!seat.isAvailable}
            >
              {seat.column}
            </button>
          ))}
        </div>
      </div>
    ))}
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
      setMovies(moviesResponse.data);
      setShowtimes(showtimesResponse.data);
      setFilteredShowtimes(showtimesResponse.data);
      
      // Set initial values from navigation state
      if (bookingData) {
        setSelectedHallType(bookingData.hall || "");
        setSelectedMovie(bookingData.movie || "");
        setSelectedShowtime(bookingData.showtime || "");
        
        // Automatically trigger seat fetching if all required data is present
        if (bookingData.showtime) {
          const showtime = showtimesResponse.data.find(st => st._id === bookingData.showtime);
          if (showtime) {
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

  // Event Handlers
  const handleSeatClick = (seat) => {
    if (seat.isAvailable) {
      const seatId = `${seat.row}${seat.column}`;
      setSelectedSeats((prev) =>
        prev.includes(seatId)
          ? prev.filter((s) => s !== seatId)
          : [...prev, seatId]
      );
    }
  };

  const handleProceedToSeating = async () => {
    if (selectedShowtime && selectedHall) {
      await fetchSeats(selectedShowtime, selectedHall);
    }
  };

  const handleProceedToPayment = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/bookings`,
        {
          showtimeId: selectedShowtime,
          seats: selectedSeats,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const booking = response.data;
      localStorage.setItem(
        "pendingBooking",
        JSON.stringify({ bookingId: booking._id })
      );

      navigate("/payment", {
        state: {
          selectedSeats,
          movie: filteredMovies.find((m) => m._id === selectedMovie),
          showtime: showtimes.find((st) => st._id === selectedShowtime),
          userDetails,
          bookingId: booking._id,
          bookingdate: new Date(booking.updatedAt).toISOString(),
          totalPrice: booking.totalPrice,
        },
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  // Effects
  useEffect(() => {
    fetchUserDetails();
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedHallType) {
      const filtered = showtimes
        .filter((st) => st.hallId.type === selectedHallType)
        .map((st) => st.movieId);
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
        (!selectedHallType || st.hallId.type === selectedHallType) &&
        (!selectedMovie || st.movieId._id === selectedMovie)
    );
    setFilteredShowtimes(filtered);
  }, [selectedHallType, selectedMovie, showtimes]);

  useEffect(() => {
    if (selectedShowtime) {
      const showtime = showtimes.find((st) => st._id === selectedShowtime);
      if (showtime) {
        setSelectedHall(showtime.hallId._id);
        // Automatically fetch seats when showtime is selected
        fetchSeats(selectedShowtime, showtime.hallId._id);
      }
    }
  }, [selectedShowtime, showtimes]);

  if (loading || !userDetails) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background text-primary p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-center mb-8 text-highlight">
          Book Your Tickets
        </h1>

        <div className="space-y-8">
          <SelectionForm
            hallType={selectedHallType}
            setHallType={setSelectedHallType}
            movie={selectedMovie}
            setMovie={setSelectedMovie}
            showtime={selectedShowtime}
            setShowtime={setSelectedShowtime}
            movies={filteredMovies}
            showtimes={filteredShowtimes}
            onProceedToSeating={handleProceedToSeating}
            selectedHall={selectedHall}
          />

          {loadingSeats ? (
            <LoadingSpinner />
          ) : (
            seats.length > 0 && (
              <div className="bg-secondary rounded-xl p-8 shadow-lg animate-fadeIn">
                <h2 className="text-2xl font-display font-bold text-primary mb-6 text-center">
                  Select Your Seats
                </h2>
                
                <div className="mb-8">
                  <SeatLegend />
                </div>

                <SeatGrid
                  seats={seats}
                  selectedSeats={selectedSeats}
                  onSeatClick={handleSeatClick}
                />

                {selectedSeats.length > 0 && (
                  <div className="mt-8">
                    <div className="bg-background rounded-lg p-4 mb-6">
                      <h3 className="font-display font-semibold text-primary mb-2">
                        Selected Seats:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedSeats.map((seat) => (
                          <span
                            key={seat}
                            className="bg-highlight text-white px-3 py-1 rounded-full font-display"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleProceedToPayment}
                      className="w-full py-4 bg-accent hover:bg-highlight text-white font-display font-semibold rounded-lg transform hover:scale-105 transition-all duration-300"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;