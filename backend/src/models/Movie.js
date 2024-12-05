// src/models/Movie.js
import mongoose from 'mongoose';

const movieSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    genre: { type: String, required: true },
    duration: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
    picture_url: { type: String },
    trailer_url: { type: String },
    rating: { type: Number, min: 0, max: 10, default: 5 },
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
