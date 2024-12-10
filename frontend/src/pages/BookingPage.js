//pages/
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";


const BookingPage = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [filteredShowtimes, setFilteredShowtimes] = useState([]);
  const [hallTypes, setHallTypes] = useState(["golden", "silver", "platinum"]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [selectedHallType, setSelectedHallType] = useState("");
  const [selectedHall, setSelectedHall] = useState(""); // Hall will be set based on selected showtime
  const [loading, setLoading] = useState(false);
  const [seats, setSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]); // State for selected seats
  const [userDetails, setUserDetails] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
 
  

   
  const cancelPendingBooking = async (bookingId) => {
    try {
      // Make an API call to delete the booking by its ID
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/bookings/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        console.log("Pending booking canceled successfully");
  
        // Update the seat availability in the state after successful cancellation
        setSeats((prevSeats) =>
          prevSeats.map((seat) =>
            seat.bookingId === bookingId
              ? { ...seat, isAvailable: true, bookingId: null } // Reset bookingId to null
              : seat
          )
        );
  
        // Remove the pending booking data from localStorage
        localStorage.removeItem("pendingBooking");
      } else {
        console.warn("Booking cancellation did not return a success response");
      }
    } catch (error) {
      console.error("Error canceling pending booking:", error);
  
      // Optionally handle specific errors (e.g., booking not found)
      if (error.response && error.response.status === 404) {
        console.warn("Booking not found. It may have already been canceled.");
      }
    }
  };
  


  // Fetch user details based on logged-in user
  useEffect(() => {
    const fetchUserDetails = async () => { // Get token from localStorage or context
      if (token) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserDetails(response.data); // Set user details in state
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        alert("Please log in to proceed.");
        navigate("/login"); // Redirect to login page if no token is found
      }
    };

    fetchUserDetails();
  }, [navigate]);


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

  // Set selectedHall when selectedShowtime changes
  useEffect(() => {
    if (selectedShowtime) {
      const showtime = showtimes.find((showtime) => showtime._id === selectedShowtime);
      setSelectedHall(showtime?.hallId?._id || "");
    }
  }, [selectedShowtime, showtimes]);

  // Fetch seats for selected showtime and hall
  const fetchSeats = async (showtimeId, hallId) => {
    setLoadingSeats(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/seats`,
        { params: { showtimeId, hallId } }
      );
      console.log(response.data);  // Log to check the seats data
      
      // Sort seats first by row alphabetically, then by column numerically
      const sortedSeats = response.data.sort((a, b) => {
        if (a.row === b.row) {
          return a.column - b.column; // Sort by column numerically if row is the same
        }
        return a.row.localeCompare(b.row); // Sort by row alphabetically
      });
  
      // Set the sorted seats to state
      setSeats(sortedSeats);
    } catch (error) {
      console.error("Error fetching seats:", error);
    } finally {
      setLoadingSeats(false);
    }
  };
  

  // Handle seating display
  const handleProceedToSeating = async () => {
    if (selectedShowtime && selectedHall) {
      await fetchSeats(selectedShowtime, selectedHall); // Pass both showtimeId and hallId
    } else {
      alert("Please select both a showtime and a hall.");
    }
  };
  
  // Handle seat selection
  const handleSeatClick = (seat) => {
    if (seat.isAvailable) {
      const seatIdentifier = `${seat.row}${seat.column}`; // Combine row and column for seat identifier
      setSelectedSeats((prevSelectedSeats) => {
        if (prevSelectedSeats.includes(seatIdentifier)) {
          // Deselect seat
          return prevSelectedSeats.filter((s) => s !== seatIdentifier);
        } else {
          // Select seat
          return [...prevSelectedSeats, seatIdentifier];
        }
      });
    }
  };
  

  // Handle proceed to payment
  // Proceed to Payment: Ensure booking creation succeeds
  const handleProceedToPayment = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return; // Stop execution if no seats selected
    }

    try {

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/bookings`,
        {
          showtimeId: selectedShowtime,
          seats: selectedSeats, // Send selected seats as identifiers
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("in BookingPage");
      console.log(response.data);
      const booking = response.data;
      
      // Save the booking temporarily in local storage
      localStorage.setItem(
        "pendingBooking",
        JSON.stringify({ bookingId: booking._id })
      );
      console.log(booking._id);
      // Navigate to payment only if booking is successfully created
      navigate("/payment", {
        state: {
          selectedSeats,
          movie: filteredMovies.find((movie) => movie._id === selectedMovie),
          showtime: showtimes.find((showtime) => showtime._id === selectedShowtime),
          userDetails,
          bookingId: booking._id,
          totalPrice: booking.totalPrice,
        },
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  


  if (loading || !userDetails) {
    return <div>Loading...</div>; // Wait until user details are fetched
  }

  return (
    <div className="min-h-screen bg-background text-primary p-4">
      <h1 className="text-3xl font-bold mb-6">Book Your Tickets</h1>

      {/* Movie, Hall Type, and Showtime Selections */}
      <div className="mb-6">
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
      </div>

      {/* Seating Section */}
      {seats.length > 0 && (
        <div>
          <h2 className="text-2xl justify-center font-bold mb-4">Select Your Seats</h2>
          {loadingSeats ? (
          <p>Loading seats...</p>
        ) : (
          <div className="grid gap-6 p-6 bg-secondary rounded-lg">
            {Object.keys(
              seats.reduce((rows, seat) => {
                rows[seat.row] = rows[seat.row] || [];
                rows[seat.row].push(seat);
                return rows;
              }, {})
            )
            .map((rowKey) => (
              <div key={rowKey} className="flex items-center justify-center mb-4">
                <span className="font-bold mr-4">{rowKey}</span>
                <div className="flex gap-4 justify-center">
                  {seats
                    .filter((seat) => seat.row === rowKey)
                    .map((seat) => (
                      <button
                        key={`${seat.row}${seat.column}`}
                        onClick={() => handleSeatClick(seat)}
                        className={`w-12 h-12 flex items-center justify-center border rounded-lg cursor-pointer ${
                          seat.isAvailable
                            ? selectedSeats.includes(`${seat.row}${seat.column}`)
                              ? "bg-highlight text-white"
                              : "bg-white text-black"
                            : "bg-red-500 text-white cursor-not-allowed"
                        }`}
                        disabled={!seat.isAvailable}
                      >
                        {seat.column}
                    </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}


          {/* Selected Seats Display */}
          {selectedSeats.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold">Selected Seats:</h3>
              <ul className="list-disc ml-5">
                {selectedSeats.map((seat) => (
                  <li key={seat}>{seat}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Proceed to Payment Button */}
          <button
            onClick={handleProceedToPayment}
            className="w-full bg-highlight text-white py-3 rounded-lg hover:bg-accent font-semibold mt-6"
          >
            Proceed to Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
