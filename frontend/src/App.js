// App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard"; // Example protected route
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute
import Layout from "./components/Layout"; // Layout with Navbar
import MoviePage from "./pages/MoviesPage";
import ShowtimePage from "./pages/ShowtimePage";

const App = () => {
    return (
            <Layout>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/movies/:movieId" element={<MoviePage />} />
                    <Route path="/showtimes" element={<ShowtimePage />} />
                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Layout>
    );
};

export default App;
