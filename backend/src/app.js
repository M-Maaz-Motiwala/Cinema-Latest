// src/app.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import movieRoutes from './routes/movieRoutes.js';
import authRoutes from './routes/authRoutes.js';  // Import authentication routes
import userRoutes from './routes/userRoutes.js';
import showtimeRoutes from './routes/showtimeRoutes.js';
import hallRoutes from './routes/hallRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import seatRoutes from './routes/seatRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// Use Routes
app.use('/api/movies', movieRoutes); // Movie routes
app.use('/api/auth', authRoutes);  // Register & Login routes
app.use('/api/users', userRoutes); //user profile
app.use('/api/showtimes', showtimeRoutes); // Use the showtime routes
app.use('/api/halls', hallRoutes); // Use the theater routes
app.use('/api/bookings', bookingRoutes); // Booking routes
app.use('/api/seats', seatRoutes); // Seat routes

// Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

export default app;
