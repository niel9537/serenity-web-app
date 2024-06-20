// components/Layout.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar'; // Import your Navbar component

const Layout = ({ children }) => {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-4">
          {children}
        </main>
      </div>
    </Router>
  );
};

export default Layout;
