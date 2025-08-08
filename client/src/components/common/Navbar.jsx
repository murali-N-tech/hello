// client/src/components/common/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const authLinks = (
    <>
      {/* Dashboard link for logged-in users */}
      <Link
        to="/dashboard"
        className="text-gray-600 font-semibold hover:text-green-500 transition-colors"
      >
        Dashboard
      </Link>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </>
  );

  const guestLinks = (
    <>
      <Link
        to="/login"
        className="text-gray-600 hover:text-green-500 transition-colors"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="bg-green-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-600 transition-colors"
      >
        Register
      </Link>
    </>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          VoiceYourBill
        </Link>
        <div className="flex items-center space-x-6">
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
