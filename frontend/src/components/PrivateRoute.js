// PrivateRoute.js

import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
    const { token } = useSelector((state) => state.auth);

    // Redirect to login if no token is present
    return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
