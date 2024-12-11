// authRoutes.js
import express from 'express';
import { registerUser, loginUser, requestPasswordReset, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Register User
router.post('/register', registerUser);
// Login User and get JWT Token
router.post('/login', loginUser);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;