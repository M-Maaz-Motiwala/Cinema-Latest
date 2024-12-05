import fs from 'fs';
import path from 'path';

// Helper function to save movie files
export const saveMovieFiles = async (files, movieId) => {
  const movieFolderPath = path.join('public', 'movie', movieId.toString());
  const paths = {};

  // Ensure directory exists
  if (!fs.existsSync(movieFolderPath)) {
    fs.mkdirSync(movieFolderPath, { recursive: true });
  }

  if (files?.poster?.[0]) {
    const posterFile = files.poster[0];
    const posterPath = path.join(movieFolderPath, `poster_${Date.now()}_${posterFile.originalname}`);
    fs.renameSync(posterFile.path, posterPath);
    paths.poster = posterPath;
  }

  if (files?.trailer?.[0]) {
    const trailerFile = files.trailer[0];
    const trailerPath = path.join(movieFolderPath, `trailer_${Date.now()}_${trailerFile.originalname}`);
    fs.renameSync(trailerFile.path, trailerPath);
    paths.trailer = trailerPath;
  }

  return paths;
};
