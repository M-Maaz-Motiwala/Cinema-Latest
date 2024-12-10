import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const { state } = useLocation();
  
  const navigate = useNavigate();
  const { selectedSeats, movie, showtime, userDetails: initialUserDetails, totalPrice, bookingId } = state;
  
  const [userDetails, setUserDetails] = useState(initialUserDetails);
  const [isLoading, setIsLoading] = useState(false); // For handling loading state
  const [error, setError] = useState(null); // For error handling

  const handlePayment = async () => {
    if (!userDetails.paymentMethod) {
      setError("Please select a payment method.");
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      console.log("Sending booking update request:", {
        userId: userDetails._id,
        selectedSeats,
        totalPrice,
        paymentStatus: "Paid",
        showtimeId: showtime._id,
      });
  
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/bookings/${bookingId}/status`,
        {
          userId: userDetails._id,
          selectedSeats,
          totalPrice,
          paymentStatus: "Paid", 
          showtimeId: showtime._id, 
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (response.status === 200) {
        alert("Payment successful! Your tickets have been booked.");
      } else {
        alert("Failed to process payment. Please try again.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
  
      if (error.response) {
        setError(`Payment failed: ${error.response.data.message || "Unknown error"}`);
      } else if (error.request) {
        setError("No response received from the server. Please check your network connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoBack = async () => {
    try {
      // Send a request to cancel the seat reservation
      const cancelResponse = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/bookings/${bookingId}`,
        
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (cancelResponse.status === 200) {
        alert("Reservation canceled.");
      } else {
        alert("Failed to cancel reservation. Please try again.");
      }

      // Redirect to the BookingPage
      navigate("/bookings"); // Adjust the path as per your routing configuration
    } catch (error) {
      console.error("Error canceling reservation:", error);
      alert("Failed to cancel reservation. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary p-4">
      <h1 className="text-3xl font-bold mb-6">Payment</h1>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Booking Details</h2>
        <p><strong>Movie:</strong> {movie.title}</p>
        <p><strong>Showtime:</strong> {new Date(showtime.date).toLocaleDateString()} - {showtime.time}</p>
        <p><strong>Seats:</strong> {selectedSeats.join(", ")}</p>
        <p><strong>Name:</strong> {userDetails.name}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
        <p><strong>Total Price:</strong> {totalPrice} </p>
      </div>

      <div className="mb-6">
        <label htmlFor="paymentMethod" className="block text-lg font-semibold mb-2">
          Payment Method:
        </label>
        <select
          id="paymentMethod"
          value={userDetails.paymentMethod}
          onChange={(e) => setUserDetails({ ...userDetails, paymentMethod: e.target.value })}
          className="w-full p-3 border rounded-lg bg-white text-black"
        >
          <option value="">Select Payment Method</option>  {/* Default empty option */}
          <option value="credit">Credit Card</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}  {/* Display error message */}

      <div className="flex justify-between">
        <button
          onClick={handleGoBack}
          className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 font-semibold"
        >
          Go Back
        </button>

        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full bg-highlight text-white py-3 rounded-lg hover:bg-accent font-semibold"
        >
          {isLoading ? "Processing..." : "Payment Confirmed"}
        </button>
      </div>


    </div>
  );
};

export default PaymentPage;
