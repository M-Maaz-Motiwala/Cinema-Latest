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
  console.log(`Reset URL sent to: ${user.email}`);
  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // HTML Email content with color theme
  const emailContent = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #1f2937; padding: 20px; text-align: center; color: #e5e7eb;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #374151; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #f59e0b;">Password Reset Request</h2>
          <p style="font-size: 16px; color: #e5e7eb;">We received a request to reset your password. Click the button below to reset it:</p>
          <a href="${resetURL}" style="display: inline-block; margin-top: 20px; padding: 12px 30px; background-color: #f59e0b; color: #ffffff; font-size: 16px; text-decoration: none; border-radius: 5px; box-shadow: 0 4px 6px rgba(245, 158, 11, 0.2);">
            Reset Password
          </a>
          <p style="font-size: 14px; color: #e5e7eb; margin-top: 30px;">If you did not request a password reset, please ignore this email.</p>
          <footer style="color: #acbbd0; font-size: 12px; margin-top: 30px;">
            <p>© ${new Date().getFullYear()} Cinema App. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: emailContent, // Sending HTML content
    });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to send email. Please try again.");
  }

  res.status(200).json({ message: "Password reset email sent" });
});


// Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(404);
      throw new Error("Invalid or expired token");
    }

    console.log("new password: ",newPassword)
    // Hash the new password before saving
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(newPassword, salt);
    user.password= newPassword;
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(400).json({ message: "Reset token has expired. Please try again." });
    } else {
      res.status(500).json({ message: "An error occurred while resetting the password" });
    }
  }
});

// Generate JWT Token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
