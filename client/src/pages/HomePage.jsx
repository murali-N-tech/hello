import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import UploadForm from '../components/analysis/UploadForm';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import Footer from '../components/common/Footer';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

// This new component is shown to users who are not logged in
const GuestWelcome = () => (
  <div className="text-center my-10 p-8 bg-white border border-gray-200 rounded-lg shadow-md max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold text-gray-800">Welcome to VoiceYourBill</h2>
    <p className="text-gray-600 mt-4">Please log in or register to begin analyzing your utility bills.</p>
    <div className="mt-6">
      <Link
        to="/login"
        className="bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-600"
      >
        Login or Register
      </Link>
    </div>
  </div>
);

const HomePage = () => {
  const { isAuthenticated } = useAuth(); // Get the user's login status

  return (
    <div className="bg-white">
      <main>
        <Hero />
        <div id="upload-section">
          {/* Conditionally render the UploadForm or the Welcome message.
            If the user is logged in, show the form. Otherwise, show the welcome message.
          */}
          {isAuthenticated ? <UploadForm /> : <GuestWelcome />}
        </div>
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;