import React from 'react';

const Hero = () => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gradient-to-r from-green-50 to-cyan-50 py-20 px-6">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">
          Understand Your Utility Bills
          <br />
          <span className="text-green-600">In Plain English</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Transform confusing electricity, water, and internet bills into clear insights. Detect errors, track trends, and save money with AI-powered analysis.
        </p>
        <div className="mt-8">
          <button
            onClick={() => scrollTo('upload-section')}
            className="bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-600 transition-transform transform hover:scale-105"
          >
            Upload Your Bill
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;