// src/Routes/bookingRoute.js
import express from 'express';
import {
  createBooking,
  getBookingsForUser,
  getBookingDetails,
  updateBookingStatus,
  getBookingsByShowtime,
  cancelSeatReservation, // New route to cancel a seat reservation
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User Routes
router.route('/')
  .post(protect, createBooking)          // Create a booking
  .get(protect, getBookingsForUser);     // Get all bookings for the logged-in user

  router.route('/:id')
  .get(protect, getBookingDetails) // Get booking details
  .delete(protect, cancelSeatReservation);


// Admin Routes
router.route('/:id/status').put(protect, updateBookingStatus); // Update booking status (e.g., confirmed, canceled)
router.route('/showtime/:showtimeId').get(protect, admin, getBookingsByShowtime); // Get all bookings for a showtime

export default router;
