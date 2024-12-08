// Register.js

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate password length
        if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
            return;
        }

        const userData = { name, email, password };
        dispatch(registerUser(userData));
    };

    useEffect(() => {
        if (token) {
            navigate("/dashboard");
        }
    }, [token, navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-background text-primary">
            <div className="bg-secondary p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-display mb-6 text-center text-highlight">Register</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 rounded-lg bg-background border border-accent focus:outline-none focus:ring-2 focus:ring-highlight"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-lg bg-background border border-accent focus:outline-none focus:ring-2 focus:ring-highlight"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg bg-background border border-accent focus:outline-none focus:ring-2 focus:ring-highlight"
                            required
                        />
                        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-highlight text-secondary font-bold hover:bg-accent"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
                <p className="text-sm text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-highlight hover:text-accent">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
