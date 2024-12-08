// login.js

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((state) => state.auth);

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Reset previous errors
        setEmailError("");
        setPasswordError("");

        // Dispatch login action
        dispatch(loginUser({ email, password }));
    };

    useEffect(() => {
        if (token) {
            navigate("/dashboard");
        }
    }, [token, navigate]);

    useEffect(() => {
        // If backend error for invalid credentials
        if (error) {
            if (error.includes("email")) {
                setEmailError("Email does not exit, Register Now!");
            }
            if (error.includes("password")) {
                setPasswordError("Invalid password");
            }
        }
    }, [error]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-background text-primary">
            <div className="bg-secondary p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-display mb-6 text-center text-highlight">Login</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        {emailError && <p className="text-red-500 text-sm mt-2">{emailError}</p>}
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
                        {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-highlight text-secondary font-bold hover:bg-accent"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p className="text-sm text-center mt-4">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-highlight hover:text-accent">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
