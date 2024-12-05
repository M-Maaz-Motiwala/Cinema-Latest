// bookingController.js
import Seat from '../models/Seat.js';
import Showtime from '../models/Showtime.js';
import Booking from '../models/Booking.js';
import asyncHandler from 'express-async-handler';

// @desc Create a booking
// @route POST /api/bookings
// @access Private
export const createBooking = asyncHandler(async (req, res) => {
  const { showtimeId, seats } = req.body;

  const userId = req.user._id;
  
  // Check if the showtime exists
  const showtime = await Showtime.findById(showtimeId);
  if (!showtime) {
    res.status(404);
    throw new Error('Showtime not found');
  }

  // Check seat availability using the Seat model
  const unavailableSeats = [];
  for (const i of seats) {
    // Extract row and column from the seatId
    console.log(seats);
    console.log(i);
    const row = i.charAt(0); // First character is the row
    const column = parseInt(i.charAt(1)); //second character is column and its number
    console.log("row",row);
    console.log("column",column);
    // Query the database for the seat
    const seat = await Seat.findOne({ showtimeId, row, column });
    console.log("column",seat);
    
    if (!seat || !seat.isAvailable) {
      unavailableSeats.push(i); // Add to unavailable seats list
    }
    console.log("UNAVAILABLESEATS",unavailableSeats);
  }
  
  console.log('Is unavailableSeats an array?', Array.isArray(unavailableSeats)); // Should be true
  console.log('Unavailable Seats:', unavailableSeats);
  console.log('Length of unavailableSeats:', unavailableSeats.length); // Should be a number
  
  if (unavailableSeats.length>0) {
    res.status(400);
    throw new Error(`Seats ${unavailableSeats.join(', ')} are already booked`);
  }

  // Update seats availability
  for (const i of seats){
    const row = i.charAt(0); // First character is the row
    const column = parseInt(i.charAt(1)); //second character is column and its number
    
    await Seat.updateMany(
      { row, column , showtimeId },
      { $set: { isAvailable: false } }
    );
  }
  
  // Update showtime available seats count
  console.log('Is Seats an array?', Array.isArray(seats)); // Should be true
  console.log('Seats:', seats);
  console.log('Length of Seats:', seats.length); // Should be a number
  
  showtime.availableSeats -= seats.length;
  await showtime.save();

  // Create a booking
  const booking = new Booking({ userId, showtimeId, seats, totalPrice: await calculateTotalPrice(showtimeId,seats.length) });
  const createdBooking = await booking.save();
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
  const { bookingId } = req.body;
  const unbook = await Booking.findById(bookingId);
  
  const showtime1 = unbook.showtimeId;
  for (const i of unbook.seats) {
    console.log(i);
    const row = i.charAt(0); // First character is the row
    const column = parseInt(i.charAt(1)); //second character is column and its number
    console.log("row",row);
    console.log("column",column);
    // Query the database for the seat
    console.log(showtime1," ", row," ", column);
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

  const showtime = await Showtime.findById(showtime1); // Corrected here
  if (showtime) {
    showtime.availableSeats += unbook.seats.length;
    await showtime.save();
  }
  
  await Booking.findByIdAndDelete(bookingId);

  res.json({ message: 'Seat reservation canceled'});
});

// @desc Update the status of a booking (Admin)
// @route PUT /api/bookings/:id/status
// @access Private/Admin
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  booking.status = req.body.status || booking.status; // Example: 'confirmed', 'canceled'
  await booking.save();
  res.json(booking);
});