// src/routes/showtimeRoutes.js
import express from 'express';
import {
  createShowtime,
  getShowtimesForMovie,
  getShowtimesForHall,
  getAllShowtimes,
  updateShowtime,
  deleteShowtime,
  getShowtimesByDate
} from '../controllers/showtimeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { checkShowtimeConflictMiddleware } from '../middleware/showtimeValidation.js';


const router = express.Router();

// Admin routes
router
  .route('/')
  .post(protect, admin, createShowtime); // Admin only: Create a new showtime

router
  .route('/:id')
  .put(protect, admin, updateShowtime) // Admin only: Update showtime
  .delete(protect, admin, deleteShowtime); // Admin only: Delete showtime

// Public route to get showtimes for a movie
router.route('/:movieId').get(getShowtimesForMovie); // Get all showtimes for a movie

// Public route to get showtimes for a specific hall
router.route('/hall/:hallId').get(getShowtimesForHall); // Get showtimes for a hall

// Public route to get all showtimes
router.route('/').get(getAllShowtimes); // Get all showtimes

// New route for filtering showtimes by date
router.route('/filter/date/:date').get(getShowtimesByDate); // Get showtimes for a specific date

export default router;
