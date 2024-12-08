// MoviesPage.js

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MoviePage = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const videoRef = useRef(null);

    useEffect(() => {
        // Fetch the specific movie details by movieId
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/movies/${movieId}`)
            .then((response) => {
                setMovie(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching movie:', error);
                setLoading(false);
            });
    }, [movieId]);

    const handleMouseEnter = () => {
        // Reset video to the start and play on hover
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    };

    const handleMouseLeave = () => {
        // Pause the video when mouse leaves the poster
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    if (loading) return <div className="text-center text-lg">Loading...</div>;

    return (
        <div className="min-h-screen bg-background text-primary">
            <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {movie && (
                    <div className="bg-secondary p-6 sm:p-8 rounded-lg shadow-md">
                        {/* Movie Poster and Trailer */}
                        <div
                            className="relative group"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {/* Video element for the trailer */}
                            <video
                                ref={videoRef}
                                className="w-full h-[600px] sm:h-[800px] object-cover rounded-lg absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                src={`${process.env.REACT_APP_BACKEND_URL_STATIC}/MovieFiles/${movie.trailer_url.replace(/\\/g, '/')}`} 
                                alt={movie.title}
                                autoPlay
                                loop
                            />
                            
                            <img
                                src={`${process.env.REACT_APP_BACKEND_URL_STATIC}/MovieFiles/${movie.picture_url.replace(/\\/g, '/')}`}
                                alt={movie.title}
                                className="w-full h-[600px] sm:h-[800px] object-cover rounded-lg"
                            />
                        </div>

                        {/* Movie Details */}
                        <div className="mt-6">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">{movie.title}</h1>
                            <p className="text-xl text-gray-500 mt-2">{movie.genre}</p>
                            <p className="text-xl text-highlight mt-4">Rating: {movie.rating}</p>
                            <p className="mt-4 text-lg sm:text-xl">{movie.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MoviePage;
