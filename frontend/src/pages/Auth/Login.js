// login.js

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    if (token) {
        navigate('/dashboard');
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-background text-primary">
            <div className="bg-secondary p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-display mb-6 text-center text-highlight">Login</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
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
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-highlight text-secondary font-bold hover:bg-accent"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
