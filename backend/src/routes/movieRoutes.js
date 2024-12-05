// src/routes/movieRoute.js
import express from 'express';
import {
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  createMovie,
  searchMovies,
  saveMovieFilesController,
} from '../controllers/movieController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadFiles } from '../middleware/uploadMiddleware.js';


const router = express.Router();

// Routes
router.get('/', getMovies);              // Get all movies
router.get('/:id', getMovieById);        // Get a movie by ID
router.post('/', protect, admin, createMovie);              // Add a new movie
router.put('/:id', protect, admin, updateMovie);         // Update a movie by ID
router.delete('/:id', protect, admin, deleteMovie);      // Delete a movie by ID
router.get('/search', searchMovies); // Search movies by genre, rating, etc.
router.post('/:id',protect, admin, uploadFiles, saveMovieFilesController);  // Save files for a movie (poster and trailer)
export default router;
