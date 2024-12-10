// src/controllers/seatController.js
import Seat from '../models/Seat.js';
import Hall from '../models/Hall.js';
import Showtime from '../models/Showtime.js';
import asyncHandler from 'express-async-handler';

// @desc Get all seats for a hall
// @route GET /api/seats?hallId= & showtimeId=
// @access Public
export const getSeatsByShowtime = asyncHandler(async (req, res) => {
  const { showtimeId, hallId } = req.query; // Extract both parameters
  console.log(showtimeId, hallId); // Debugging log to check the received data

  const seats = await Seat.find({ showtimeId, hallId }); // Query without $and operator
  console.log(seats); // Debugging log to check the fetched seats

  if (!seats.length) {
    res.status(404);
    throw new Error('No seats found for the given showtime');
  }

  res.json(seats);
});


// @desc Add seats for a hall and showtime based on hall layout
// @route POST /api/seats
// @access Private/Admin
export const createSeats = async (hallId, showtimeId) => {
  // Fetch Hall and Showtime data
  const hall = await Hall.findById(hallId);
  if (!hall) {
    throw new Error('Hall not found');
  }

  const existingSeats = await Seat.find({ showtimeId });
  if (existingSeats.length > 0) {
    throw new Error('Seats for this showtime have already been created');
  }

  if (!hall.Seatlayout.row || !hall.Seatlayout.column) {
    console.log(hall.Seatlayout.row)
    console.log(hall.Seatlayout.column)
    throw new Error('Invalid seat layout in the hall');
  }

  const showtime = await Showtime.findById(showtimeId);
  if (!showtime) {
    throw new Error('Showtime not found');
  }

  // Fetch the seat layout from the hall (rows and columns)
  const { row, column } = hall.Seatlayout;

  // Create seats for the hall based on the seat layout
  const seats = [];
  for (let r = 1; r <= row; r++) {
    for (let c = 1; c <= column; c++) {
      const seatRow = String.fromCharCode(64 + r); // A=1, B=2, C=3, etc.
      const seatColumn = c;

      const seat = new Seat({
        hallId,
        showtimeId,
        row: seatRow,
        column: seatColumn,
        isAvailable: true,
      });

      seats.push(seat);
    }
  }

  // Save all the seats to the database
  await Seat.insertMany(seats);

  // Update availableSeats in Showtime model
  showtime.availableSeats = seats.length;
  await showtime.save();

  return { message: 'Seats created successfully', seats };
};



// @desc Update seat selection for a showtime
// @route PUT /api/seats/update
// @access Private
export const updateSeatSelection = asyncHandler(async (req, res) => {
  const { hallId, showtimeId, previousSeats, newSeats } = req.body;

  // Ensure previous and new seat lists are provided
  if (!previousSeats || !newSeats) {
    res.status(400);
    throw new Error('Previous and new seat lists are required');
  }

  // Check if the showtime exists
  const showtime = await Showtime.findById(showtimeId);
  if (!showtime) {
    res.status(404);
    throw new Error('Showtime not found');
  }

  // Check if seats are available for new selection
  const availableSeats = await Seat.find({
    showtimeId,
    _id: { $in: newSeats },
    isAvailable: true,
  });

  if (availableSeats.length !== newSeats.length) {
    res.status(400);
    throw new Error('Some of the new seats are not available');
  }

  // Mark previous seats as unavailable
  await Seat.updateMany(
    { _id: { $in: previousSeats }, showtimeId, isAvailable: false },
    { isAvailable: true }
  );

  // Mark new seats as unavailable (i.e., booked)
  await Seat.updateMany(
    { _id: { $in: newSeats }, showtimeId, isAvailable: true },
    { isAvailable: false }
  );

  // Respond with success message
  res.json({ message: 'Seat selection updated successfully' });
});

// @desc Delete seats when a showtime is deleted or ends
// @route DELETE /api/showtimes/:id
// @access Private/Admin
export const deleteShowtimeSeats = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Fetch the showtime to delete
  const showtime = await Showtime.findById(id);
  if (!showtime) {
    res.status(404);
    throw new Error('Showtime not found');
  }

  // Delete seats associated with the showtime
  await Seat.deleteMany({ showtimeId: id });

  // Remove the showtime
  await showtime.remove();

  res.json({ message: 'Showtime and associated seats deleted successfully' });
});
