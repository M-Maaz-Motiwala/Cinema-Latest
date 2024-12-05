// src/config/config.js
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import AWS from 'aws-sdk';

// Load environment variables from .env file
dotenv.config();

// Cloudinary Configuration
const cloudinaryConfig = cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// AWS S3 Configuration
const awsConfig = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Export all configurations
export { cloudinaryConfig, awsConfig };
