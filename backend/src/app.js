// app.js

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import movieRoutes from './routes/movieRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import showtimeRoutes from './routes/showtimeRoutes.js';
import hallRoutes from './routes/hallRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import seatRoutes from './routes/seatRoutes.js';

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// Use Routes
app.use('/api/movies', movieRoutes); // Movie routes
app.use('/api/auth', authRoutes); // Register & Login routes
app.use('/api/users', userRoutes); // User profile
app.use('/api/showtimes', showtimeRoutes); // Use the showtime routes
app.use('/api/halls', hallRoutes); // Use the theater routes
app.use('/api/bookings', bookingRoutes); // Booking routes
app.use('/api/seats', seatRoutes); // Seat routes

// http://localhost:5000/static/674cbf9e58d85a51b97b4111/poster/1733086131184.jpg
// Static Files
app.use('/MovieFiles', express.static(path.join( 'public','movie')));
app.get('/MovieFiles/*', (req, res) => {
    console.log('MovieFiles requested:', req.path);
});
app.use('/UserFiles', express.static(path.join( 'public','user')));
app.get('/UserFiles/*', (req, res) => {
    console.log('UserFiles requested:', req.path);
});

// Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

export default app;
