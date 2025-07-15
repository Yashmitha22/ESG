import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Portfolio from './pages/Portfolio';
import Market from './pages/Market';
import Settings from './pages/Settings';
import { ESGProvider } from './context/ESGContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ESGProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/market" element={<Market />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </ESGProvider>
  );
}

export default App;
