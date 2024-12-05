// HomePage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch movies from the backend
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/movies`)
            .then((response) => {
                setMovies(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching movies:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-background text-primary">
            <div className="container mx-auto py-10">
                <h1 className="text-4xl font-display text-center mb-8">Welcome to Movie Mania</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {movies.map((movie) => (
                        <Link to={`/movies/${movie.id}`} key={movie.id}>
                            <div className="bg-secondary p-4 rounded-lg shadow-md hover:shadow-lg">
                                <img
                                    src={movie.poster || '/default-poster.png'}
                                    alt={movie.title}
                                    className="rounded-lg object-cover w-full h-48"
                                />
                                <div className="mt-4">
                                    <h3 className="text-xl font-bold">{movie.title}</h3>
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
