// Logout.js

import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Logout = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout()); // Clears the auth state
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
