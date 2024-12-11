// ManageMoviesSection.js

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FaImage } from 'react-icons/fa';


const ManageMoviesSection = ({ token }) => {
    const [movies, setMovies] = useState([]);
    const [editForm, setEditForm] = useState({});
    const [form, setForm] = useState({
        title: '',
        description: '',
        genre: '',
        releaseDate: '',
        duration: '',
        rating: '',
    });
    const [expandedMovieId, setExpandedMovieId] = useState(null);
    const [fileForm, setFileForm] = useState({
        poster: null,
        trailer: null,
    });
    const [trailerPreviewUrl, setTrailerPreviewUrl] = useState(null);
    const [selectedMovieId, setSelectedMovieId] = useState(null); // Declare state for selected movie ID

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    // Generate Object URL for trailer preview
    useEffect(() => {
        if (fileForm.trailer) {
            const url = URL.createObjectURL(fileForm.trailer);
            setTrailerPreviewUrl(url);

            // Cleanup the Object URL when the component unmounts or the file changes
            return () => {
                URL.revokeObjectURL(url);
            };
        } else {
            setTrailerPreviewUrl(null);
        }
    }, [fileForm.trailer]);

    // Fetch all movies
    const fetchMovies = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/movies`, { headers });
            setMovies(response.data);
        } catch (error) {
            console.error('Failed to fetch movies', error);
        }
    }, [headers]);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    // Handle movie creation
    const handleCreateMovie = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/movies`, form, { headers });
            alert('Movie created successfully');
            setSelectedMovieId(response.data.movie._id); // Store the created movie ID
            resetForm();
            fetchMovies();
        } catch (error) {
            console.error('Failed to create movie', error);
        }
    };

    // Handle file upload
    const handleUploadFiles = async (e, movieId) => {
        e.preventDefault();

        const formData = new FormData();
        if (fileForm.poster) formData.append('poster', fileForm.poster);
        if (fileForm.trailer) formData.append('trailer', fileForm.trailer);

        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/movies/${movieId}`, formData, {
                headers: { ...headers, 'Content-Type': 'multipart/form-data' },
            });
            alert('Files uploaded successfully');
            setFileForm({ poster: null, trailer: null });
            setExpandedMovieId(null); // Collapse the card
            fetchMovies();
        } catch (error) {
            console.error('Failed to upload files', error);
        }
    };

    const handleDeleteMovie = async (movieId) => {
        try {
            console.log("Trying to delete movie with ID:", movieId);
            
            // Try to get showtimes for the movie
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/showtimes/${movieId}`);
            
            // Log showtimes response
            console.log('Showtimes response data:', response.data);
    
            // If showtimes exist, prevent deletion
            if (response.data.length > 0) {
                alert('Showtimes for this movie exist, deletion is not allowed.');
            } else {
                // Proceed with the deletion if no showtimes exist
                await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/movies/${movieId}`, { headers });
                console.log('Deleting movie with ID:', movieId);
                alert('Movie deleted successfully');
                fetchMovies();  // Refresh movie list
            }
        } catch (error) {
            console.error('Failed to check or delete movie', error);
    
            // If we get a 404 (No showtimes), allow deletion
            if (error.response?.status === 404) {
                console.log('No showtimes found for this movie, proceeding with deletion.');
                await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/movies/${movieId}`, { headers });
                alert('Movie deleted successfully');
                fetchMovies();  // Refresh movie list
            } else {
                // Handle other errors and show a message
                alert(error.response?.data?.message || 'An error occurred while trying to delete the movie');
            }
        }
    };

    const resetForm = () => {
        setForm({
            title: '',
            description: '',
            genre: '',
            releaseDate: '',
            duration: '',
            rating: '',
        });
        setSelectedMovieId(null);
    };

    const handleInputChange = (e, isEdit = false) => {
        const { name, value } = e.target;
        if (isEdit) {
            setEditForm({ ...editForm, [name]: value });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFileForm({ ...fileForm, [name]: files[0] });
    };

    const formatDate = (isoDate) => (isoDate ? new Date(isoDate).toISOString().split('T')[0] : '');

    const toggleExpandedCard = (movieId) => {
        if (expandedMovieId === movieId) {
            setExpandedMovieId(null);
            setEditForm({});
        } else {
            const movieToEdit = movies.find((movie) => movie._id === movieId);
            if (movieToEdit) {
                setEditForm({
                    ...movieToEdit,
                    releaseDate: formatDate(movieToEdit.releaseDate),
                });
            }
            setExpandedMovieId(movieId);
        }
    };


    const handleUpdateMovie = async (e, movieId) => {
        e.preventDefault();
    
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/movies/${movieId}`, editForm, {
                headers,
            });
            alert('Movie updated successfully');
            setExpandedMovieId(null); // Collapse expanded card
            fetchMovies(); // Refresh movies list
        } catch (error) {
            console.error('Failed to update movie', error);
            alert(error.response?.data?.message || 'An error occurred while updating the movie');
        }
    };
    

    return (
        <div className="p-6 bg-background text-primary">
            <h2 className="text-3xl font-bold mb-6">Manage Movies</h2>

            {/* Create Movie Form */}
            <form className="mb-6 p-4 bg-secondary rounded-xl shadow-lg" onSubmit={handleCreateMovie}>
                <h3 className="font-semibold text-xl mb-4">Add New Movie</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleInputChange}
                        placeholder="Title"
                        className="border-2 border-highlight bg-background text-primary p-2 mb-4 w-full rounded-lg"
                        required
                    />
                    <input
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        className="border-2 border-highlight bg-background text-primary p-2 mb-4 w-full rounded-lg"
                    />
                    <input
                        type="text"
                        name="genre"
                        value={form.genre}
                        onChange={handleInputChange}
                        placeholder="Genre"
                        className="border-2 border-highlight bg-background text-primary p-2 mb-4 w-full rounded-lg"
                        required
                    />
                    <input
                        type="date"
                        name="releaseDate"
                        value={form.releaseDate}
                        onChange={handleInputChange}
                        placeholder=" "
                        className="border-2 border-highlight bg-background text-primary p-2 mb-4 w-full rounded-lg"
                        required
                    />
                    <input
                        type="number"
                        name="duration"
                        value={form.duration}
                        onChange={handleInputChange}
                        placeholder="Duration (mins)"
                        className="border-2 border-highlight bg-background text-primary p-2 mb-4 w-full rounded-lg"
                        required
                    />
                    <input
                        type="number"
                        step="0.1"
                        name="rating"
                        value={form.rating}
                        onChange={handleInputChange}
                        placeholder="Rating (0-10)"
                        className="border-2 border-highlight bg-background text-primary p-2 mb-4 w-full rounded-lg"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 px-6 py-2 bg-accent text-white rounded-lg"
                >
                    Add Movie
                </button>
            </form>

            {/* Movie List */}
            <div className="grid grid-cols-1 gap-6">
                {movies.map((movie) => (
                    <div
                        key={movie._id}
                        className={`flex flex-col bg-secondary rounded-xl shadow-lg overflow-hidden ${
                            expandedMovieId === movie._id ? 'p-4' : ''
                        }`}
                    >
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => toggleExpandedCard(movie._id)}
                        >
                            {movie.picture_url ? (
                                <img
                                    src={`${process.env.REACT_APP_BACKEND_URL_STATIC}/MovieFiles/${movie.picture_url.replace(/\\/g, '/')}`}
                                    alt={movie.title}
                                    className="w-32 h-32 object-cover"
                                />
                            ) : (
                                <div className="w-32 h-32 bg-gray-300 flex items-center justify-center">
                                    <FaImage className="text-gray-500 text-3xl" />
                                </div>
                            )}
                            <div className="flex flex-col p-4">
                                <h3 className="text-xl font-bold">{movie.title}</h3>
                                <p>{movie.description}</p>
                            </div>
                        </div>

                        {/* Expanded View */}
                        {expandedMovieId === movie._id && (
                            <div>
                                <form
                                    className="mt-4 p-4 bg-background bg-opacity-50 rounded-lg shadow-lg"
                                    onSubmit={(e) => handleUpdateMovie(e, movie._id)}
                                >
                                    <h4 className="font-semibold text-lg text-primary mb-4">Update Movie</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="title"
                                            value={editForm.title || ''}
                                            onChange={(e) => handleInputChange(e, true)}
                                            placeholder="Title"
                                            className="border-2 border-highlight bg-background text-primary p-2 mb-4 w-full rounded-lg"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="description"
                                            value={editForm.description || ''}
                                            onChange={(e) => handleInputChange(e, true)}
                                            placeholder="Description"
                                            className="border-2 border-highlight bg-background text-primary p-2 mb-4 w-full rounded-lg"
                                        />
                                        <input
                                            type="text"
                                            name="genre"
                                            value={editForm.genre || ''}
                                            onChange={(e) => handleInputChange(e, true)}
                                            placeholder="Genre"
                                            className="border-2 border-highlight bg-background text-primary p-2 mb-4 w-full rounded-lg"
                                            required
                                        />
                                        <input
                                            type="date"
                                            name="releaseDate"
                                            value={editForm.releaseDate || ''}
                                            onChange={(e) => handleInputChange(e, true)}
                                            className="border-2 border-highlight bg-background text-primary p-2 mb-4 w-full rounded-lg"
                                            required
                                        />
                                        <input
                                            type="number"
                                            name="duration"
                                            value={editForm.duration || ''}
                                            onChange={(e) => handleInputChange(e, true)}
                                            placeholder="Duration (mins)"
                                            className="border-2 border-highlight bg-background text-primary p-2 mb-4 w-full rounded-lg"
                                            required
                                        />
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="rating"
                                            value={editForm.rating || ''}
                                            onChange={(e) => handleInputChange(e, true)}
                                            placeholder="Rating (0-10)"
                                            className="border-2 border-highlight bg-background text-primary p-2 mb-4 w-full rounded-lg"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="mt-4 px-6 py-2 bg-accent text-white rounded-lg hover:bg-highlight"
                                    >
                                        Update Movie
                                    </button>
                                </form>

                                {/* ManageMoviesSection.js (Updated File Upload Form) */}
                                <form
                                    className="mt-4 p-6 bg-background bg-opacity-50 rounded-lg shadow-lg"
                                    onSubmit={(e) => handleUploadFiles(e, movie._id)}
                                >
                                    <h4 className="font-semibold text-lg text-primary mb-6">Upload Files</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Poster Upload */}
                                        <div
                                            className="relative border-2 border-dashed border-accent bg-secondary-light rounded-lg p-4 flex items-center justify-center cursor-pointer"
                                            onClick={() => document.getElementById(`poster-${movie._id}`).click()}
                                        >
                                            {fileForm.poster ? (
                                                <img
                                                    src={URL.createObjectURL(fileForm.poster)}
                                                    alt="Poster Preview"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <span className="text-center text-primary font-medium">
                                                    Click to upload Poster
                                                </span>
                                            )}
                                            <input
                                                type="file"
                                                id={`poster-${movie._id}`}
                                                name="poster"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </div>

                                        {/* Trailer Upload */}
                                        <div
                                            className="relative border-2 border-dashed border-accent bg-secondary-light rounded-lg p-4 flex items-center justify-center cursor-pointer"
                                            onClick={() => document.getElementById(`trailer-${movie._id}`).click()}
                                        >
                                            {trailerPreviewUrl ? (
                                                <video
                                                    controls
                                                    src={trailerPreviewUrl}
                                                    className="w-full h-full rounded-lg"
                                                />
                                            ) : (
                                                <span className="text-center text-primary font-medium">
                                                    Click to upload Trailer
                                                </span>
                                            )}
                                            <input
                                                type="file"
                                                id={`trailer-${movie._id}`}
                                                name="trailer"
                                                accept="video/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="mt-6 w-full py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition"
                                    >
                                        Upload Files
                                    </button>
                                </form>
                                <button
                                    onClick={() => handleDeleteMovie(movie._id)}  // Call delete function on button click
                                    className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg"
                                >
                                    Delete Movie
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageMoviesSection;
