// src/controllers/showtimeController.js
import Hall from '../models/Hall.js';
import Movie from '../models/Movie.js';
import Seats from '../models/Seat.js';
import {createSeats} from '../controllers/seatController.js'
import Showtime from '../models/Showtime.js';
import asyncHandler from 'express-async-handler';

/**
 * Helper Function: Check for conflicting showtimes
 * Returns true if a conflict exists, false otherwise
 */
const checkShowtimeConflict = async (hallId, date, time, movieDuration) => {
    // Convert date to ISO format to avoid parsing issues
    const formattedDate = new Date(date).toISOString().split('T')[0]; // Ensure it's in YYYY-MM-DD format
    const newShowStart = new Date(`${formattedDate}T${time}:00`);
    const newShowEnd = new Date(newShowStart.getTime() + movieDuration * 60000);

    console.log(`New Show Start: ${newShowStart}`);
    console.log(`New Show End: ${newShowEnd}`);
    console.log("Existing Showtimes: ");

    // Fetch existing showtimes for the hall on the same date
    const existingShowtimes = await Showtime.find({ hallId, date: formattedDate }).populate('movieId', 'duration');

    for (const show of existingShowtimes) {
        if (!show.movieId || !show.movieId.duration) {
            throw new Error('Duration not found for an existing movie. Check movieId population.');
        }

        const showStart = new Date(`${formattedDate}T${show.time}`);
        const showEnd = new Date(showStart.getTime() + show.movieId.duration * 60000);

        console.log(`Existing Show Start: ${showStart}`);
        console.log(`Existing Show End: ${showEnd}`);

        // Check for conflicts
        if (!(newShowEnd <= showStart || newShowStart >= showEnd)) {
            console.log("Conflict Found!");
            return true;
        }
    }

    console.log("No Conflict Found!");
    return false;
};



// @desc Create a new showtime
// @route POST /api/showtimes
// @access Private/Admin
export const createShowtime = asyncHandler(async (req, res) => {
    const { movieId, hallId, date, time, ticketPrice } = req.body;
  
    const movie = await Movie.findById(movieId);
    if (!movie) {
      res.status(404);
      throw new Error('Movie not found');
    }
    const hall = await Hall.findById(hallId);
    if (!hall) {
      res.status(404);
      throw new Error('Hall not found');
    }
  
    const conflict = await checkShowtimeConflict(hallId, date, time, movie.duration);
    if (conflict) {
      res.status(400);
      throw new Error('Hall is not available at the selected time');
    }
  
    const showtime = new Showtime({
      movieId,
      hallId,
      date,
      time,
      availableSeats: hall.capacity,
      ticketPrice,
    });
  
    const createdShowtime = await showtime.save();
  
    try {
      const seats = await createSeats(createdShowtime.hallId, createdShowtime._id);
      res.status(201).json({ createdShowtime, seats });
    } catch (error) {
      res.status(500);
      throw new Error(`Failed to create seats: ${error.message}`);
    }
  });
  

// @desc Showtime By Date
// @route GET /api/showtimes/filter/date/:date
// @access Private/Admin
export const getShowtimesByDate = asyncHandler(async (req, res) => {
  const date = req.params.date;

  const showtimes = await Showtime.find({ date })
      .populate('movieId')
      .populate('hallId');

  if (!showtimes.length) {
      res.status(404);
      throw new Error('No showtimes found for this date');
  }

  res.json(showtimes);
});

// @desc Update a showtime
// @route PUT /api/showtimes/:id
// @access Private/Admin
export const updateShowtime = asyncHandler(async (req, res) => {
    const { hallId, date, time, ticketPrice } = req.body;

    const showtime = await Showtime.findById(req.params.id);
    if (!showtime) {
        res.status(404);
        throw new Error('Showtime not found');
    }

    if (hallId) showtime.hallId = hallId;
    if (date) showtime.date = date;
    if (time) showtime.time = time;
    if (ticketPrice) showtime.ticketPrice = ticketPrice;

    const updatedShowtime = await showtime.save();
    res.json(updatedShowtime);
});

// @desc Get showtimes for a specific movie
// @route GET /api/showtimes/:movieId
// @access Public
export const getShowtimesForMovie = asyncHandler(async (req, res) => {
    const movieId = req.params.movieId;
    const showtimes = await Showtime.find({ movieId }).populate('hallId');
    if (!showtimes.length) {
        res.status(404);
        throw new Error('No showtimes found for this movie');
    }
    res.json(showtimes);
});

// @desc Get showtimes for a specific hall
// @route GET /api/showtimes/hall/:hallId
// @access Public
export const getShowtimesForHall = asyncHandler(async (req, res) => {
    const hallId = req.params.hallId;
    const showtimes = await Showtime.find({ hallId }).populate('movieId');
    if (!showtimes.length) {
        res.status(404);
        throw new Error('No showtimes found for this hall');
    }
    res.json(showtimes);
});

// @desc Get all showtimes
// @route GET /api/showtimes
// @access Public
export const getAllShowtimes = asyncHandler(async (req, res) => {
    const showtimes = await Showtime.find().populate('hallId','name type').populate('movieId','title duration picture_url');
    if (!showtimes.length) {
        res.status(404);
        throw new Error('No showtimes found');
    }
    res.json(showtimes);
});

// @desc Delete a showtime
// @route DELETE /api/showtimes/:id
// @access Private/Admin
export const deleteShowtime = asyncHandler(async (req, res) => {
    
    try {
        const showtime = await Showtime.findByIdAndDelete(req.params.id);
        if (!showtime) {
            res.status(404);
            throw new Error('Showtime not found');
        }
        const seat = await Seats.deleteMany({ShowtimeId: req.params.id})
        res.json({ message: 'Showtime removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
