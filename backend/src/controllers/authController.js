// authController.js
import bcrypt from 'bcryptjs';
import asyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import sendEmail from "../utils/sendEmail.js"; // Email helper


// Register User
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create a new user
  const user = new User({ name, email, password });

  await user.save();

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

// Login User and get JWT Token
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }
  
    const isMatch = await user.matchPassword(password);
  
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
  
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Something went wrong"});
  }
};


export const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    text: `Click here to reset your password: ${resetURL}`,
  });

  res.status(200).json({ message: "Password reset email sent" });
});

// Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  // Verify the reset token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Hash the new password before saving
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt); // Hash the new password

  await user.save();

  res.status(200).json({ message: "Password reset successful" });
});



// Generate JWT Token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
