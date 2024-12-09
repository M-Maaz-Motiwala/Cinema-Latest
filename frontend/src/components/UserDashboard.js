// UserDashboardContent.js

import React from 'react';
import defaultAvatar from '../static/default-avatar.png'

const UserDashboardContent = ({ user, handleUpdate, name, setName, email, setEmail, currentPassword, setCurrentPassword, newPassword, setNewPassword, handleProfilePicUpload }) => {
    return (
        <div>
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
                        alt="Click here to change"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                        onChange={(e) => {
                            handleProfilePicUpload(e);
                        }}
                    />
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
    );
};

export default UserDashboardContent;
