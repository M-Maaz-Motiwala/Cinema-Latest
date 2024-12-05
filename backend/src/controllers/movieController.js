// src/controllers/movieController.js
import fs from 'fs';
import path from 'path';
import Movie from '../models/Movie.js';
// import { saveMovieFiles } from '../utils/fileUtils.js';
import asyncHandler from 'express-async-handler';

// Utility function to save files to local storage
const saveFileLocally = (file, destFolder) => {
    const destination = path.join(destFolder, file.originalname);
    fs.writeFileSync(destination, file.buffer);
    return destination;
};


// **CREATE**: Add a new movie
// @desc    Create a new movie
// @route   POST /api/movies
// @access  Private (Admin only)
export const createMovie = asyncHandler(async (req, res) => {
    const { title, description, genre, releaseDate, duration, rating } = req.body;

    const movie = new Movie({
        title,
        description,
        genre,
        releaseDate,
        duration,
        rating
    });

    const createdMovie = await movie.save();

    res.status(201).json({
        message: 'Movie created successfully',
        movie: createdMovie,
    });
});

// **UPDATE**: Save files (poster and trailer) after movie creation
// @desc    Save files for an existing movie
// @route   POST /api/movies/:id
// @access  Private (Admin only)
export const saveMovieFilesController = asyncHandler(async (req, res) => {
    const { id: movieId } = req.params;

    if (!movieId) {
        return res.status(400).json({ message: 'Movie ID is required' });
    }

    try {
        // Retrieve uploaded file paths
        let posterPath = null;
        let trailerPath = null;

        if (req.files?.poster && req.files.poster.length > 0) {
            posterPath = path.join('public', 'movie', movieId.toString(),'poster', req.files.poster[0].filename);
        }

        if (req.files?.trailer && req.files.trailer.length > 0) {
            trailerPath = path.join('public', 'movie', movieId.toString(), 'trailer', req.files.trailer[0].filename);
        }

        // Update the movie document in the database
        const updatedMovie = await Movie.findByIdAndUpdate(
            movieId,
            {
                ...(posterPath && { picture_url: posterPath }),
                ...(trailerPath && { trailer_url: trailerPath }),
            },
            { new: true } // Return the updated movie document
        );

        res.status(201).json({
            message: 'Movie files saved successfully',
            movie: updatedMovie,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Handle the file saving (poster and trailer)
// const { poster: savedPosterPath, trailer: savedTrailerPath } = await saveMovieFiles(req.files, movieId);

// **READ**: Get all movies
// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
export const getMovies = asyncHandler(async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// **READ ONE**: Get a single movie by ID
// @desc    Get a single movie by ID
// @route   GET /api/movies/:id
// @access  Public
export const getMovieById = asyncHandler(async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// **UPDATE**: Update an existing movie
// @desc    Update a movie
// @route   PUT /api/movies/:id
// @access  Private (Admin only)
export const updateMovie = asyncHandler(async (req, res) => {
    try {
      const movie = await Movie.findById(req.params.id);
      if (!movie) return res.status(404).json({ message: 'Movie not found' });
  
      // Update movie fields
      Object.assign(movie, req.body);
  
      // Save poster and trailer files if provided
      const { poster: savedPosterPath, trailer: savedTrailerPath } = await saveMovieFiles(req.files, req.params.id);
  
      if (savedPosterPath) movie.poster = savedPosterPath;
      if (savedTrailerPath) movie.trailer = savedTrailerPath;
  
      const updatedMovie = await movie.save();
      res.status(200).json(updatedMovie);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  

// **DELETE**: Remove a movie by ID
// @desc    Delete a movie
// @route   DELETE /api/movies/:id
// @access  Private (Admin only)
export const deleteMovie = asyncHandler(async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });

        // Delete associated files
        const posterPath = movie.poster;
        const trailerPath = movie.trailer;
        if (fs.existsSync(posterPath)) fs.unlinkSync(posterPath);
        if (fs.existsSync(trailerPath)) fs.unlinkSync(trailerPath);

        await Movie.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// **SEARCH**: Search for movies based on query parameters
// @desc    Search movies
// @route   GET /api/movies/search
// @access  Public
export const searchMovies = asyncHandler(async (req, res) => {
    const { title, genre, rating } = req.query;
    try {
        const query = {};
        if (title) query.title = new RegExp(title, 'i'); // Case-insensitive search
        if (genre) query.genre = genre;
        if (rating) query.rating = { $gte: rating };

        const movies = await Movie.find(query);
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
