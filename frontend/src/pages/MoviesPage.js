import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendar, FaTicketAlt } from 'react-icons/fa';

const MoviePage = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
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

        // Fetch the showtimes for this movie
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/showtimes/${movieId}`)
            .then((response) => {
                setShowtimes(response.data);
            })
            .catch((error) => {
                console.error('Error fetching showtimes:', error);
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

    const handleBookNow = (showtime) => {
        navigate('/bookings', {
            state: {
              hall: showtime.hallId.type,
              movie: movie._id,
              showtime: showtime._id,
            },
          });
    };

    const formatGenres = (genres) => (Array.isArray(genres) ? genres.join(', ') : '');

    if (loading) return <div className="text-center text-lg">Loading...</div>;

    return (
        <div className="min-h-screen bg-background text-primary ">
            <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-7 ">
                {movie && (
                    <div className="bg-secondary p-6 sm:p-8 rounded-lg shadow-md animate-fadeIn transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
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
                            <p className="text-xl text-gray-500 mt-2">{formatGenres(movie.genre)}</p>
                            <p className="text-xl text-highlight mt-4">Rating: {movie.rating}</p>
                            <p className="mt-4 text-lg sm:text-xl">{movie.description}</p>
                        </div>
                    </div>
                )}

                {/* Showtimes */}
                {showtimes.length > 0 && (
                    <div className="mt-10">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <FaCalendar className="text-highlight" />
                            Showtimes
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {showtimes.map((showtime) => (
                                <div 
                                    key={showtime._id} 
                                    className="bg-secondary rounded-xl shadow-md p-6 animate-fadeIn transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                    <h3 className="text-xl font-semibold text-primary">{showtime.hallId.name}</h3>
                                    <p className="text-gray-300 text-sm">{new Date(showtime.date).toLocaleDateString()} - {showtime.time}</p>
                                    <p className="text-m mt-2 text-highlight">Price: Rs.{showtime.ticketPrice}</p>
                                    <div className="flex items-center mt-4">
                                        <button
                                            className="bg-highlight text-white py-1 px-3 rounded-lg hover:bg-accent transition-colors flex items-center"
                                            onClick={() => handleBookNow(showtime)}
                                        >
                                            <FaTicketAlt className="mr-2" />
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default MoviePage;
