// src/models/Seat.js
import mongoose from 'mongoose';

const seatSchema = mongoose.Schema({
  hallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hall', // Reference to the hall
    required: true,
  },
  showtimeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime', // Reference to the showtime
    required: true,
  },
  row: { type: String, required: true }, // Row identifier (e.g., A, B, C)
  column: { type: Number, required: true }, // Column number
  isAvailable: { type: Boolean, default: true }, // Seat availability
}, { timestamps: true });

const Seat = mongoose.model('Seat', seatSchema);
export default Seat;
