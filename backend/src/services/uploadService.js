// src/services/uploadService.js
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path'; // To extract file extensions
// import config from '../config/config';

// AWS S3 Configuration
const awsConfig = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

// Create an S3 instance
const s3 = new AWS.S3();

// Helper function to determine ContentType based on file extension
const getContentType = (filePath) => {
  const extname = path.extname(filePath).toLowerCase();
  if (extname === '.jpg' || extname === '.jpeg') {
    return 'image/jpeg';
  } else if (extname === '.png') {
    return 'image/png';
  } else if (extname === '.mp4') {
    return 'video/mp4';
  } else if (extname === '.mov') {
    return 'video/quicktime';
  } else if (extname === '.avi') {
    return 'video/x-msvideo';
  } else {
    return 'application/octet-stream'; // Default for unknown files
  }
};

// Upload file function to S3
export const uploadToS3 = async (filePath, fileName, bucketName) => {
  const fileContent = fs.readFileSync(filePath);

  // Get the content type based on the file extension
  const contentType = getContentType(filePath);

  const uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileContent,
    ContentType: contentType,
  };

  try {
    const data = await s3.upload(uploadParams).promise();
    return data.Location; // Return the file URL
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('S3 upload failed');
  }
};
