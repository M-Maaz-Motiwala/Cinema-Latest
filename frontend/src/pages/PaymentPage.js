import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Clock, CreditCard, AlertCircle, ArrowLeft, XCircle, CheckCircle } from 'lucide-react';

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
  const [timeLeft, setTimeLeft] = useState(60);

  const cancelBooking = useCallback(async (message) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/bookings/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        alert(message);
        navigate("/bookings");
      } else {
        throw new Error("Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  }, [bookingId, navigate]);

  useEffect(() => {
    let timer;
    if (!isPaymentConfirmed && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            cancelBooking("Your reservation has been automatically canceled due to inactivity.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPaymentConfirmed, timeLeft, cancelBooking]);

  const handleCancel = async () => {
    if (!isPaymentConfirmed) {
      await cancelBooking("Reservation canceled.");
      return;
    }

    const timeElapsed = Date.now() - paymentTimestamp;
    if (timeElapsed <= 60000) {
      await cancelBooking("Booking canceled successfully.");
    } else {
      alert("You can only cancel your booking within 1 minute of confirming payment.");
    }
  };

  const cancelGoBackBooking = async () => {
    // Proceed to cancel the booking
    await cancelBooking("Booking canceled due to payment not confirmed.");
    // After cancellation, navigate to the bookings page
    navigate("/bookings");
  };

  const handleGoCancel = async () => {
  if (!isPaymentConfirmed) {
    // If payment is not confirmed, cancel the booking and then go back to bookings
    await cancelGoBackBooking();
    return;
  }

  // If payment is confirmed, just navigate to bookings page without canceling
  navigate("/bookings");
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
        setIsPaymentConfirmed(true);
        setPaymentTimestamp(Date.now());
        alert("Payment successful! Your tickets have been booked.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setError("An error occurred while processing the payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-secondary rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className=" p-6 bg-highlight bg-opacity-85 text-white">
            <h1 className="text-3xl  font-display font-bold text-center">
              Payment Details
            </h1>
          </div>
            {!isPaymentConfirmed && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold">
                <Clock className="w-5 h-5 animate-pulse" />
                Time remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            )}

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Booking Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-accent">
                <CheckCircle className="w-5 h-5" />
                Booking Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-background/50 p-4 rounded-lg">
                <DetailItem label="Movie" value={movie.title} />
                <DetailItem label="Showtime" value={`${new Date(showtime.date).toLocaleDateString()} - ${showtime.time}`} />
                <DetailItem label="Booking Date" value={`${new Date(bookingdate).toLocaleDateString()} - ${new Date(bookingdate).toLocaleTimeString()}`} />
                <DetailItem label="Seats" value={selectedSeats.join(", ")} />
                <DetailItem label="Name" value={userDetails.name} />
                <DetailItem label="Email" value={userDetails.email} />
                <DetailItem label="Total Price" value={`Rs.${totalPrice}`} className="md:col-span-2 text-lg font-bold text-highlight" />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-accent">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </h2>
              <select
                value={userDetails.paymentMethod || ""}
                onChange={(e) => setUserDetails({ ...userDetails, paymentMethod: e.target.value })}
                className="w-full p-3 rounded-lg bg-background border border-gray-600 focus:border-highlight focus:ring focus:ring-highlight/20 transition-all"
                disabled={isPaymentConfirmed}
              >
                <option value="">Select Payment Method</option>
                <option value="credit">Credit Card</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              {!isPaymentConfirmed ? (
                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full bg-highlight hover:bg-accent text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : "Confirm and Pay"}
                </button>
              ) : (
                <button
                  onClick={handleCancel}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  <XCircle className="w-5 h-5 inline mr-2" />
                  Cancel Booking
                </button>
              )}
              
              <button
                onClick={handleGoCancel}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for detail items
const DetailItem = ({ label, value, className = "" }) => (
  <div className={className}>
    <span className="block text-gray-400 text-sm">{label}:</span>
    <span className="block font-semibold">{value}</span>
  </div>
);

export default PaymentPage;