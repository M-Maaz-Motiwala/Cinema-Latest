// App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./app/store"; // Import persisted store and persistor
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
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
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
            </PersistGate>
        </Provider>
    );
};

export default App;
