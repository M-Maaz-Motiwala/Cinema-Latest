// src/middleware/seatMiddleware.js
import asyncHandler from 'express-async-handler';
import Seat from '../models/Seat.js';
import Showtime from '../models/showtimeModel.js';

// Ensure the requested seats are available
export const validateSeatAvailability = asyncHandler(async (req, res, next) => {
  const { showtimeId } = req.params;
  const { seats } = req.body;

  const unavailableSeats = await Seat.find({
    showtimeId,
    _id: { $in: seats },
    isAvailable: false,
  });

  if (unavailableSeats.length > 0) {
    res.status(400);
    throw new Error(`Seats ${unavailableSeats.map(s => s._id).join(', ')} are unavailable`);
  }

  next();
});

