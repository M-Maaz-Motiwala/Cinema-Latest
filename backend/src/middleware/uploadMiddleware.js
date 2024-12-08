// uploadMiddleware.js

import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Helper function to create directory if it doesn't exist
const createDirectory = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Helper function to clear a directory
const clearDirectory = (directory) => {
  if (fs.existsSync(directory)) {
    fs.readdirSync(directory).forEach((file) => {
      const filePath = path.join(directory, file);
      if (fs.lstatSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      }
    });
  }
};

// Define the storage location and filename logic
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderPath;

    if (file.fieldname === 'poster' || file.fieldname === 'trailer') {
      // For movie files (poster, trailer), use movieId from the body
      const movieId = req.body.movieId || req.params.id;
      if (!movieId) {
        return cb(new Error('Movie ID is required to save files'), false);
      }
      const basePath = path.join('public', 'movie', movieId.toString());
      folderPath = path.join(basePath, file.fieldname); // Separate folders for poster and trailer
      createDirectory(folderPath);

      // Clear existing files in respective folders
      clearDirectory(folderPath);
    } else if (file.fieldname === 'profilePicture') {
      // For user profile pictures, use userId from the request
      const userId = req.user?._id || req.params.id;
      if (!userId) {
        return cb(new Error('User ID is required to save files'), false);
      }
      folderPath = path.join('public', 'user', userId.toString());
      createDirectory(folderPath);

      // Clear existing files in the user's folder
      clearDirectory(folderPath);
    } else {
      return cb(new Error('Invalid file field name'), false);
    }

    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const extension = file.originalname.split('.').pop();
    cb(null, `${Date.now()}.${extension}`);
  },
});

// File size limits for different fields
const fileSizeLimits = {
  poster: 5 * 1024 * 1024,  // 5 MB for posters
  trailer: 50 * 1024 * 1024, // 50 MB for trailers
  profilePicture: 5 * 1024 * 1024, // 5 MB for profile pictures
};

// File filter for allowed file types
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'poster' && !file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed for posters'), false);
  }
  if (file.fieldname === 'trailer' && !file.mimetype.startsWith('video/')) {
    return cb(new Error('Only video files are allowed for trailers'), false);
  }
  if (file.fieldname === 'profilePicture' && !file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed for profile pictures'), false);
  }
  cb(null, true);
};

// Create the multer upload instance for handling multiple file fields (poster, trailer)
const upload = multer({
  storage,
  limits: { fileSize: fileSizeLimits },
  fileFilter,
});

// Middleware for handling movie files (poster and trailer) and profile picture uploads
export const uploadFiles = upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'trailer', maxCount: 1 },
]);

// Middleware for handling a single profile picture upload
export const uploadSingle = multer({
  storage,
  limits: { fileSize: fileSizeLimits },
  fileFilter,
}).single('profilePicture');
