// bookingController.js
import Seat from '../models/Seat.js';
import mongoose from "mongoose";
import Showtime from '../models/Showtime.js';
import Booking from '../models/Booking.js';
import asyncHandler from 'express-async-handler';


import User from '../models/User.js';


// @desc Create a booking
// @route POST /api/bookings
// @access Private
export const createBooking = asyncHandler(async (req, res) => {
  const { showtimeId, seats } = req.body;
  const userId = req.user._id;

  console.log("I am in createBooking");
  // Check if the showtime exists
  const showtime = await Showtime.findById(showtimeId);
  if (!showtime) {
    res.status(404);
    throw new Error('Showtime not found');
  }

  // Check seat availability using the Seat model
  const unavailableSeats = [];
  for (const i of seats) {
    const row = i.charAt(0); // First character is the row
    const column = parseInt(i.charAt(1)); // second character is column and its number
    const seat = await Seat.findOne({ showtimeId, row, column });
    if (!seat || !seat.isAvailable) {
      unavailableSeats.push(i); // Add to unavailable seats list
    }
  }

  if (unavailableSeats.length > 0) {
    res.status(400);
    throw new Error(`Seats ${unavailableSeats.join(', ')} are already booked`);
  }

  // Update seats availability
  for (const i of seats) {
    const row = i.charAt(0); // First character is the row
    const column = parseInt(i.charAt(1)); // second character is column and its number
    await Seat.updateMany(
      { row, column, showtimeId },
      { $set: { isAvailable: false } }
    );
  }

  // Update showtime available seats count
  showtime.availableSeats -= seats.length;
  await showtime.save();

  // Create a booking
  const booking = new Booking({ userId, showtimeId, seats, totalPrice: await calculateTotalPrice(showtimeId, seats.length) });
  const createdBooking = await booking.save();
  console.log("created");
  console.log(booking);
  res.status(201).json(createdBooking);
});

// Helper to calculate total price (if necessary)
const calculateTotalPrice = async (showtimeId, seats) => {
  // Retrieve the showtime object to get seat price
  const showtime = await Showtime.findById(showtimeId);
  if (!showtime) {
    throw new Error('Showtime not found');
  }
  const seatPrice = showtime.ticketPrice || 0; // Adjust as needed for how seat price is stored
  return seats * seatPrice;
};

// @desc Get all bookings for the logged-in user
// @route GET /api/bookings
// @access Private
export const getBookingsForUser = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id });
  res.json(bookings);
});

// @desc Get booking details by booking ID
// @route GET /api/bookings/:id
// @access Private
export const getBookingDetails = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  res.json(booking);
});

// @desc Get all bookings for a specific showtime (Admin)
// @route GET /api/bookings/showtime/:showtimeId
// @access Private/Admin
export const getBookingsByShowtime = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ showtimeId: req.params.showtimeId });
  res.json(bookings);
});

// @desc Delete a booking (Cancel booking)
// @route DELETE /api/bookings/:id
// @access Private
export const cancelSeatReservation = asyncHandler(async (req, res) => {
  const { id } = req.params; // Get the bookingId from the route parameter
  const unbook = await Booking.findById(id);
  
  if (!unbook) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const showtime1 = unbook.showtimeId;
  const user1 = unbook.userId;
  for (const i of unbook.seats) {
    console.log(i);
    const row = i.charAt(0); // First character is the row
    const column = parseInt(i.charAt(1)); // Second character is column and its number
    console.log("row", row);
    console.log("column", column);

    // Query the database for the seat
    console.log(showtime1, " ", row, " ", column);
    const seat = await Seat.findOne({ showtimeId: showtime1, row, column });
    console.log(seat);

    if (seat.isAvailable) {
      res.status(400);
      throw new Error('Seat is not reserved');
    }

    // Mark seat as available again
    seat.isAvailable = true;
    await seat.save();
  }


  const showtime = await Showtime.findById(showtime1);

  if (showtime) {
    showtime.availableSeats += unbook.seats.length;
    await showtime.save();
  }
  
  await Booking.findByIdAndDelete(id); // Use the id from the URL params

  res.json({ message: 'Seat reservation canceled' });
});


// @desc Update the status of a booking (Admin)
// @route PUT /api/bookings/:id/status
// @access Private
export const updateBookingStatus = asyncHandler(async (req, res) => {
  try {
    const allowedStatuses = ['Paid', 'Failed'];
    if (!allowedStatuses.includes(req.body.paymentStatus)) {
      res.status(400);
      throw new Error('Invalid status');
    }
    if (!req.body.showtimeId) {
      res.status(400);
      throw new Error("Missing showtime ID");
    }
    
    if (!req.body.userId || !req.body.selectedSeats || !req.body.totalPrice) {
      res.status(400);
      throw new Error("Missing required fields");
    }
    console.log("Received request to update booking:", req.body);

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    booking.paymentStatus = req.body.paymentStatus || booking.paymentStatus;
    await booking.save();
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error in updateBookingStatus:", error.message);
    res.status(500).json({ message: error.message || "An unexpected error occurred" });
  }

});
// @desc Get all bookings for a specific user (Admin only)
// @route GET /api/bookings/user/:userId
// @access Private/Admin
export const getBookingsForSpecificUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Validate if userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  // Fetch bookings with population
  const bookings = await Booking.find({ userId })
    .populate({
      path: "showtimeId",
      populate: {
        path: "movieId",
        select: "title", // Select only the movie title
      },
    })
    .lean(); // Convert Mongoose documents to plain JS objects

  // Handle no bookings found
  if (!bookings || bookings.length === 0) {
    return res.status(404).json({ message: "No bookings found for this user" });
  }

  // Return the bookings
  res.status(200).json(bookings);
});

