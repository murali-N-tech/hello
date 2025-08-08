import React from 'react';

const StepCard = ({ number, title, description }) => (
  <div className="relative">
    <div className="flex items-center justify-center w-16 h-16 bg-green-500 text-white text-2xl font-bold rounded-full">
      {number}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mt-6 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800">How VoiceYourBill Works</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Our simple 4-step process transforms complex utility bills into clear, actionable insights in just minutes.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <StepCard number="1" title="Upload Your Bill" description="Simply upload your utility bill as an image or PDF file. We support all major formats." />
          <StepCard number="2" title="AI Data Extraction" description="Our advanced OCR technology extracts all important data including usage, costs, dates, and fees." />
          <StepCard number="3" title="Plain English Summary" description="Get a clear, jargon-free explanation of every charge and what it means for your budget." />
          <StepCard number="4"title="Insights & Analysis" description="View trends, detect anomalies, and receive personalized recommendations to save money." />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;