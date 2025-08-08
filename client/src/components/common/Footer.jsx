import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto py-12 px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">VoiceYourBill</h3>
            <p className="text-gray-400">Simplifying your utility bills through the power of AI.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Product</h3>
            <ul>
              <li className="mb-2"><a href="#features" className="hover:text-green-400">Features</a></li>
              <li className="mb-2"><a href="#how-it-works" className="hover:text-green-400">How it Works</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul>
              <li className="mb-2"><a href="#" className="hover:text-green-400">Help Center</a></li>
              <li className="mb-2"><a href="#" className="hover:text-green-400">Privacy Policy</a></li>
              <li className="mb-2"><a href="#" className="hover:text-green-400">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <p className="text-gray-400">hello@voiceyourbill.com</p>
            <p className="text-gray-400">Bangalore, India</p>
          </div>
        </div>
        <div className="text-center text-gray-500 border-t border-gray-700 mt-10 pt-6">
          © {new Date().getFullYear()} VoiceYourBill. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;