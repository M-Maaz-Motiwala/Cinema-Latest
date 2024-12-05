// App.js
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard'; // Example protected route
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import { useSelector } from 'react-redux';


const App = () => {
    const { token } = useSelector((state) => state.auth);

    return (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected Route */}
          <Route
            path="/dashboard"
            element={token ? <Dashboard /> : <Navigate to="/login" />}
          />
        </Routes>
    );
};

export default App;