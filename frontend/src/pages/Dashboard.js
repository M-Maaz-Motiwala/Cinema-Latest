// Dashboard.js

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../static/default-avatar.png';
import Logout from '../components/Logout';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

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
            ...(newPassword && { password: newPassword }), // Add new password only if provided
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
        const file = e.target.files[0];
        if (!file) {
            alert('No file selected');
            return;
        }
        setProfilePic(file);
    
        const formData = new FormData();
        formData.append('profilePicture', file);
    
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
    

    return (
        <div className="min-h-screen bg-background text-primary">
            <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display text-center mb-8">Dashboard</h1>
                {user ? (
                    <div className="bg-secondary p-6 sm:p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-highlight">Welcome, {user.name}</h2>
                        <div className="flex items-center flex-col sm:flex-row mb-8">
                            <div className="relative">
                                <img
                                    src={
                                        user.profilePicture
                                            ? `${process.env.REACT_APP_BACKEND_URL_STATIC}/UserFiles/${user.profilePicture.replace(/\\/g, '/')}`
                                            : defaultAvatar
                                    }
                                    alt="Profile"
                                    className="rounded-full w-32 h-32 object-cover border-4 border-highlight"
                                />
                                <input
                                    type="file"
                                    alt='Click here to change'
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                                    onChange={(e) => {
                                        setProfilePic(e.target.files[0]);
                                        handleProfilePicUpload(e);
                                    }}
                                />
                            </div>
                            <div>
                                <p className="text-lg sm:text-xl">
                                    <span className="font-semibold">Email:</span> {user.email}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm sm:text-base font-medium">
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
                                <label htmlFor="email" className="block text-sm sm:text-base font-medium">
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
                                <label htmlFor="currentPassword" className="block text-sm sm:text-base font-medium">
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
                                <label htmlFor="newPassword" className="block text-sm sm:text-base font-medium">
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
                    </div>
                ) : (
                    <p className="text-center text-lg">Loading...</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
