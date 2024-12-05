// Dashboard.js

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!token) {
            navigate('/login'); // Redirect if not logged in
        } else {
            axios
                .get(`${process.env.REACT_APP_BACKEND_URL}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    const userData = response.data;
                    setUser(userData);
                    setName(userData.name);
                    setEmail(userData.email);
                })
                .catch((error) => {
                    console.error('Error fetching user profile:', error);
                });
        }
    }, [token, navigate]);

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!currentPassword) {
            alert('Please enter your current password to update the profile.');
            return;
        }

        const updatedData = {
            name,
            email,
            currentPassword,
            ...(newPassword && { newPassword }), // Add new password only if provided
        };

        axios
            .put(`${process.env.REACT_APP_BACKEND_URL}/users/profile`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setUser(response.data);
                alert('Profile updated successfully!');
                setCurrentPassword('');
                setNewPassword('');
            })
            .catch((error) => {
                console.error('Error updating profile:', error);
                alert('Failed to update profile. Please check your current password.');
            });
    };

    const handleProfilePicUpload = (e) => {
        const formData = new FormData();
        formData.append('profilePicture', profilePic);

        axios
            .post(`${process.env.REACT_APP_BACKEND_URL}/users/profile-picture`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                setUser(response.data);
                alert('Profile picture uploaded successfully!');
            })
            .catch((error) => {
                console.error('Error uploading profile picture:', error);
                alert('Failed to upload profile picture!');
            });
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background text-primary">
            <div className="container mx-auto py-10">
                <h1 className="text-4xl font-display text-center mb-8">Dashboard</h1>
                {user ? (
                    <div className="bg-secondary p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6 text-highlight">Welcome, {user.name}</h2>
                        <div className="flex items-center mb-8">
                        <img
                            src={(user?.profilePicture) || '../../static/default-avatar.png'}
                            alt="Profile"
                            className="rounded-full w-32 h-32 object-cover border-4 border-highlight mr-6"
                        />
                            <div>
                                <p className="text-lg">
                                    <span className="font-semibold">Email:</span> {user.email}
                                </p>
                                <button
                                    onClick={handleLogout}
                                    className="mt-4 bg-highlight text-white px-4 py-2 rounded-lg hover:bg-accent"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full p-3 rounded-lg bg-background border border-highlight text-primary"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full p-3 rounded-lg bg-background border border-highlight text-primary"
                                />
                            </div>
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="mt-1 block w-full p-3 rounded-lg bg-background border border-highlight text-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium">
                                    New Password (Optional)
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="mt-1 block w-full p-3 rounded-lg bg-background border border-highlight text-primary"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-highlight text-white py-3 rounded-lg hover:bg-accent font-semibold"
                            >
                                Update Profile
                            </button>
                        </form>

                        <div className="mt-10">
                            <h3 className="text-xl font-semibold mb-4">Change Profile Picture</h3>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="file"
                                    onChange={(e) => setProfilePic(e.target.files[0])}
                                    className="p-2 border border-highlight rounded-lg"
                                />
                                <button
                                    onClick={handleProfilePicUpload}
                                    className="bg-highlight text-white px-4 py-2 rounded-lg hover:bg-accent"
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-lg">Loading...</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
