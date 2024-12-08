// Layout.js

import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-primary">
      <header >
        <Navbar />
      </header>
      <main className="container mx-auto py-8">{children}</main>
      <footer className="bg-secondary text-white text-center py-4 mt-8">
        &copy; 2024 Cinema Booking System
      </footer>
    </div>
  );
};

export default Layout;
