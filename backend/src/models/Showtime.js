// src/models/Showtime.js
import mongoose from 'mongoose';
import Seat from './Seat.js'; // Import the Seat model


const showtimeSchema = mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie', // Referencing the Movie model
      required: true,
    },
    hallId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hall', // Reference to the hall directly
        required: true,
    },
    date: { type: Date, required: true},
    time: { type: String, required: true}, // Example format: "18:30"
    availableSeats: { type: Number}, // Total available seats for the showtime
    ticketPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

// Post-hook to remove seats when a showtime is removed
showtimeSchema.post('remove', async function (next) {
  try {
    // Delete all seats associated with this showtime
    await Seat.deleteMany({ showtimeId: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const Showtime = mongoose.model('Showtime', showtimeSchema);
export default Showtime;
