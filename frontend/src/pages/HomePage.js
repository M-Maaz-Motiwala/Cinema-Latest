//pages/HomePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { FaImage, FaClock,FaTags, FaStar, FaCalendar } from 'react-icons/fa';

const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/movies`),
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/showtimes`)
        ])
            .then(([moviesResponse, showtimesResponse]) => {
                setMovies(moviesResponse.data);
                setShowtimes(showtimesResponse.data);
                
                // Filter upcoming movies (movies without showtimes)
                const moviesWithShowtimes = new Set(showtimesResponse.data.map(st => st.movieId._id));
                const upcoming = moviesResponse.data.filter(movie => !moviesWithShowtimes.has(movie._id));
                setUpcomingMovies(upcoming);
                
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        className: "rounded-xl overflow-hidden",
    };

    
    const MovieCard = ({ movie, isUpcoming = false }) => (
        <Link to={`/movies/${movie._id}`}>
            <div className="bg-secondary rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="relative aspect-[2/3]">
                    {movie.picture_url ? (
                        <img
                            src={`${process.env.REACT_APP_BACKEND_URL_STATIC}/MovieFiles/${movie.picture_url.replace(/\\/g, '/')}`}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                            <FaImage className="text-gray-500 text-4xl" />
                        </div>
                    )}
                    {isUpcoming && (
                        <div className="absolute top-4 right-4 bg-highlight text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Coming Soon
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="text-xl font-bold text-primary mb-2 line-clamp-1">{movie.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <FaClock className="text-highlight" />
                        <span>{movie.duration} mins</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <FaStar className="text-highlight" />
                        <span>{movie.rating}/10</span>
                    </div>
                    {/* Genre Section with Icon */}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <FaTags className="text-highlight" />
                        <span>
                            {movie.genre?.length > 0 ? movie.genre.join(', ') : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );

    
    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-highlight"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-primary">
            {/* Hero Carousel */}
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-6xl mx-auto h-[400px] md:h-[500px]">
                    <Slider {...settings}>
                        {movies.slice(0, 5).map((movie) => (
                            <div key={movie._id} className="outline-none">
                                <Link to={`/movies/${movie._id}`}>
                                    <div className="relative h-[400px] md:h-[500px]">
                                        {movie.picture_url ? (
                                            <img
                                                src={`${process.env.REACT_APP_BACKEND_URL_STATIC}/MovieFiles/${movie.picture_url.replace(/\\/g, '/')}`}
                                                alt={movie.title}
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded-xl">
                                                <FaImage className="text-gray-500 text-6xl" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-xl">
                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">{movie.title}</h2>
                                                <p className="text-gray-300 text-sm md:text-base line-clamp-2">{movie.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>

            {/* Now Showing */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                    <FaCalendar className="text-highlight" />
                    Now Showing
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {movies.filter(movie => !upcomingMovies.includes(movie)).map((movie) => (
                        <MovieCard key={movie._id} movie={movie} />
                    ))}
                </div>
            </div>

            {/* Upcoming Movies */}
            {upcomingMovies.length > 0 && (
                <div className="container mx-auto px-4 py-8">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                        <FaClock className="text-highlight" />
                        Coming Soon
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {upcomingMovies.map((movie) => (
                            <MovieCard key={movie._id} movie={movie} isUpcoming={true} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;