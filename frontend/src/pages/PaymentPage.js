import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const {
    selectedSeats,
    movie,
    showtime,
    userDetails: initialUserDetails,
    totalPrice,
    bookingId,
    bookingdate
  } = state;

  const [userDetails, setUserDetails] = useState(initialUserDetails);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [paymentTimestamp, setPaymentTimestamp] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isPaymentConfirmed) {
        alert("Your reservation has been automatically canceled due to inactivity.");
        handleAutoCancel();
      }
    }, 60000);

    return () => clearTimeout(timer);
  }, [isPaymentConfirmed]);

  const handleAutoCancel = async () => {
    try {
      const cancelResponse = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/bookings/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (cancelResponse.status === 200) {
        alert("Reservation automatically canceled.");
      } else {
        alert("Failed to cancel reservation automatically. Please try again.");
      }

      navigate("/bookings");
    } catch (error) {
      console.error("Error canceling reservation automatically:", error);
      alert("Failed to cancel reservation automatically. Please try again.");
      navigate("/bookings");
    }
  };

  const handleCancel = async () => {
    if (isPaymentConfirmed) {
      const timeElapsed = Date.now() - paymentTimestamp;
      if (timeElapsed <= 60000) {
        try {
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
            navigate("/bookings");
          } else {
            alert("Failed to cancel reservation. Please try again.");
          }
        } catch (error) {
          console.error("Error canceling reservation:", error);
          alert("Failed to cancel reservation. Please try again.");
        }
      } else {
        alert("You can only cancel your booking within 1 minute of confirming payment.");
      }
    } else {
      alert("Payment not completed.");
    }
  };

  const handlePayment = async () => {
    if (!userDetails.paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
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
        setIsPaymentConfirmed(true);
        setPaymentTimestamp(Date.now());
      } else {
        alert("Failed to process payment. Please try again.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setError("An error occurred while processing the payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = async () => {
    if (isPaymentConfirmed) {
      navigate("/bookings");
    } else {
      try {
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

        navigate("/bookings");
      } catch (error) {
        console.error("Error canceling reservation:", error);
        alert("Failed to cancel reservation. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary flex items-center justify-center">
      <div className="bg-secondary p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-display text-center mb-6 text-highlight">
          Payment Details
        </h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-accent">Booking Details</h2>
          <p className="mb-2"><strong>Movie:</strong> {movie.title}</p>
          <p className="mb-2">
            <strong>Showtime:</strong>{" "}
            {new Date(showtime.date).toLocaleDateString()} - {showtime.time}
          </p>
          <p className="mb-2">
            <strong>Booking Date:</strong>{" "}
            {new Date(bookingdate).toLocaleDateString()} - {new Date(bookingdate).toLocaleTimeString()}
          </p>
          <p className="mb-2"><strong>Seats:</strong> {selectedSeats.join(", ")}</p>
          <p className="mb-2"><strong>Name:</strong> {userDetails.name}</p>
          <p className="mb-2"><strong>Email:</strong> {userDetails.email}</p>
          <p className="mb-2"><strong>Total Price:</strong> Rs.{totalPrice}</p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="paymentMethod"
            className="block text-lg font-semibold mb-2 text-primary"
          >
            Payment Method:
          </label>
          <select
            id="paymentMethod"
            value={userDetails.paymentMethod}
            onChange={(e) =>
              setUserDetails({ ...userDetails, paymentMethod: e.target.value })
            }
            className="w-full p-3 border rounded-lg bg-background text-primary"
          >
            <option value="">Select Payment Method</option>
            <option value="credit">Credit Card</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex flex-col gap-4">
          {!isPaymentConfirmed && (
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-highlight hover:bg-accent text-background py-3 rounded-lg font-semibold"
            >
              {isLoading ? "Processing..." : "Confirm and Pay"}
            </button>
          )}

          <button
            onClick={handleCancel}
            className={`w-full bg-red-500 hover:bg-red-600 text-background py-3 rounded-lg font-semibold ${
              isPaymentConfirmed ? "block" : "hidden"
            }`}
          >
            Cancel Booking
          </button>

          <button
            onClick={handleGoBack}
            className="w-full bg-gray-500 hover:bg-gray-600 text-background py-3 rounded-lg font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
