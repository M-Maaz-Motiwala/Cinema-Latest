// src/models/Hall.js
import mongoose from 'mongoose';

const hallSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    is3D: {
      type: Boolean,
      default: false, // Hall will support 3D or not
    },
    type: {
      type: String,
      enum: ['platinum', 'golden', 'silver'], // Hall types: platinum, golden, silver
      required: true,
    },
    Seatlayout:{
      row:{
        type: Number, required: true,
      },
      column:{
        type: Number, required: true,
      },
    },
    isAvailable: {
      type: Boolean,
      default: true, // Track availability of the hall
    },
  },
  {
    timestamps: true,
  }
);

const Hall = mongoose.model('Hall', hallSchema);

export default Hall;
