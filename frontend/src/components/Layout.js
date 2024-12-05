// Layout.js

import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-primary">
      <header className="bg-secondary text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-display">Cinema Booking</h1>
        </div>
      </header>
      <main className="container mx-auto py-8">{children}</main>
      <footer className="bg-secondary text-white text-center py-4 mt-8">
        &copy; 2024 Cinema Booking System
      </footer>
    </div>
  );
};

export default Layout;
