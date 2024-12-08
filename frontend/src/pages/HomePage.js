// HomePage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Slider from 'react-slick'; // Import React Slick for carousel

const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch movies from the backend
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/movies`)
            .then((response) => {
                console.log(response.data);
                setMovies(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching movies:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center text-lg">Loading...</div>;

    // Settings for React Slick Carousel
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className="min-h-screen bg-background text-primary">
            {/* Fullscreen Carousel */}
            <div className="w-full">
                <Slider {...settings}>
                    {movies.map((movie) => (
                        <div key={movie._id}>
                            <Link to={`/movies/${movie._id}`}>
                                <div className="relative group">
                                    {/* Movie Poster */}
                                    <img
                                        src={`${process.env.REACT_APP_BACKEND_URL_STATIC}/MovieFiles/${movie.picture_url.replace(/\\/g, '/')}`}
                                        alt={movie.title}
                                        className="w-full h-[600px] sm:h-[800px] object-cover rounded-lg"
                                    />
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <h3 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white font-sans px-4">
                                            {movie.title}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* Movie Grid below carousel */}
            <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display text-center mb-8">Browse Movies</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {movies.map((movie) => (
                        <Link to={`/movies/${movie._id}`} key={movie._id}>
                            <div className="bg-secondary p-4 rounded-lg shadow-md hover:shadow-lg">
                                <img
                                    src={`${process.env.REACT_APP_BACKEND_URL_STATIC}/MovieFiles/${movie.picture_url.replace(/\\/g, '/')}`}
                                    alt={movie.title}
                                    className="rounded-lg object-cover w-full h-48 sm:h-56 lg:h-64"
                                />
                                <div className="mt-4">
                                    <h3 className="text-xl sm:text-2xl font-bold">{movie.title}</h3>
                                    <p className="text-sm text-gray-400">{movie.genre}</p>
                                    <p className="text-sm text-highlight">Rating: {movie.rating}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
