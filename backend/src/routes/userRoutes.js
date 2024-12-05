// src/routes/userRoute.js
import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  assignRole,
  uploadProfilePicture, // New route to delete a user account
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// User Routes
router
  .route('/profile')
  .get(protect, getUserProfile) // Get user profile
  .put(protect, updateUserProfile); // Update user profile
router.post("/profile-picture", protect, uploadSingle, uploadProfilePicture);
// router.route('/delete').delete(protect, deleteUser); // Delete user account(by user itself)

// Admin Routes
router.route('/').get(protect, admin, getAllUsers); // Get all users
router.route('/:id').delete(protect, admin, deleteUser); // Delete user by ID by admin
router.post("/assign-role", protect, admin, assignRole); // Assign role

export default router;
