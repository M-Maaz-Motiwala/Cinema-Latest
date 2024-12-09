// Dashboard.js

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserDashboardContent from '../components/UserDashboard';
import AdminDashboardContent from '../components/AdminDashboard';

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
                    user.role === 'admin' ? (
                        <AdminDashboardContent token={token} />
                    ) : (
                        <UserDashboardContent
                            user={user}
                            name={name}
                            setName={setName}
                            email={email}
                            setEmail={setEmail}
                            currentPassword={currentPassword}
                            setCurrentPassword={setCurrentPassword}
                            newPassword={newPassword}
                            setNewPassword={setNewPassword}
                            handleProfilePicUpload={handleProfilePicUpload}
                            handleUpdate={handleUpdate}
                        />
                    )
                ) : (
                    <p className="text-center text-lg">Loading...</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
