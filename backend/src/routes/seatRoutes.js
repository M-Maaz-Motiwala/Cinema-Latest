// src/routes/seatRoutes.js
import express from 'express';
import {
  createSeats,
  getSeatsByShowtime,
  updateSeatSelection,
  deleteShowtimeSeats,
} from '../controllers/seatController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Routes
router.route('/')
  .post(protect, admin, createSeats) // Admin only: Create seats for a specific showtime, layout of hall
  .get(getSeatsByShowtime); // Get all seats for a showtime

router.route('/:id')
  .put(protect, admin, updateSeatSelection) // Update seat availability
  .delete(protect, admin, deleteShowtimeSeats);
// Public Routes
export default router;
