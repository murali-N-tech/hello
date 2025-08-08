// client/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; // Import DashboardPage
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/analysis/:billId"
          element={
            <PrivateRoute>
              <AnalysisPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;