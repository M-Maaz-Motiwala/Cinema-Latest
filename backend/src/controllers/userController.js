// userController.js
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import { generateToken } from './authController.js';
import fs from 'fs';
import path from 'path';
// import cloudinary from 'cloudinary';


// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });



// @desc Get user profile
// @route GET /api/users/profile
// @access Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Upload user profile picture
// @route POST /api/users/profile-picture
// @access Private
export const uploadProfilePicture = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.profilePicture = `${userId}/${req.file.filename}`;
  await user.save();

  res.json({ message: 'Profile picture uploaded successfully', profilePicture: user.profilePicture });
});


// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      console.log('Before saving, password:', user.password); // Debugging
      user.password = req.body.password; // This will trigger the pre-save hook
      console.log('After updating, password:', user.password); // Debugging
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Get all users (Admin only)
// @route GET /api/users
// @access Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc Delete a user (Admin only)
// @route DELETE /api/users/:id
// @access Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  
  try{
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Assign a role to user (Admin only)
// @route PUT /api/users/assign-role
// @access Private/Admin
export const assignRole = asyncHandler(async (req, res) => {
  const { identifier, email, role } = req.body;
  const idOrEmail = identifier || email;

  if (!idOrEmail) {
    res.status(400);
    throw new Error("Identifier (email or user ID) is required");
  }

  // Validate role
  if (!["user", "admin"].includes(role)) {
    res.status(400);
    throw new Error("Invalid role specified");
  }

  // Find the user by ID or email
  let user;
  if (idOrEmail.includes("@")) {
    // If identifier contains '@', assume it's an email
    user = await User.findOne({ email: idOrEmail });
  } else {
    // Otherwise, assume it's a user ID
    user = await User.findById(identifier);
  }

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update the user's role
  user.role = role;
  await user.save();

  res.status(200).json({
    message: `Role updated successfully to ${role}`,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
