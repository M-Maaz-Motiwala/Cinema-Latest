// AdminDashboard.js

import React, { useState } from 'react';
import ProfileSection from './ProfileSection.js';
import ManageHallsSection from './ManageHallsSection.js';
import ManageMoviesSection from './ManageMoviesSection.js';
import ManageShowtimesSection from './ManageShowtimesSection.js';
import UsersSection from './UsersSection.js';

const AdminDashboard = ({ token }) => {
    const [activeSection, setActiveSection] = useState('Profile');

    const renderSection = () => {
        switch (activeSection) {
            case 'Profile':
                return <ProfileSection token={token} />;
            case 'Manage Halls':
                return <ManageHallsSection token={token} />;
            case 'Manage Movies':
                return <ManageMoviesSection token={token} />;
            case 'Manage Showtimes':
                return <ManageShowtimesSection token={token} />;
            case 'Users':
                return <UsersSection token={token} />;
            default:
                return <ProfileSection token={token} />;
        }
    };

    return (
        <div className="min-h-screen flex bg-background text-primary">
            {/* Sidebar */}
            <aside className="w-1/4 bg-secondary p-4 flex-shrink-0 shadow-lg md:w-1/3 lg:w-1/4">
                <h1 className="text-3xl font-display font-bold mb-6 text-center">Admin Dashboard</h1>
                <ul className="space-y-4">
                    {['Profile', 'Manage Halls', 'Manage Movies', 'Manage Showtimes', 'Users'].map((section) => (
                        <li key={section}>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${
                                    activeSection === section
                                        ? 'bg-accent text-primary shadow-md'
                                        : 'hover:bg-accent hover:text-background'
                                }`}
                                onClick={() => setActiveSection(section)}
                            >
                                {section}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-6 animate-fadeIn">
                <div className="shadow-xl rounded-lg p-4  transition-transform duration-500 hover:scale-105">
                    {renderSection()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
