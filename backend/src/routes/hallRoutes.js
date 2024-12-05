// src/Routes/hallRoute.js
import express from 'express';
import { 
  createHall, 
  getAllHalls, 
  getHallById, 
  updateHall, 
  deleteHall, 
  getAvailableHalls // New route to get available halls
} from '../controllers/hallController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createHall)
  .get(getAllHalls); // Get all halls

router.route('/:id')
  .get(getHallById) // Get hall by ID
  .put(protect, admin, updateHall) // Update hall
  .delete(protect, admin, deleteHall); // Delete hall

// New route to get available halls
router.route('/available').get(getAvailableHalls); // Get all available halls

export default router;
