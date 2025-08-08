import React from 'react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <div className="text-3xl text-green-500 mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Features = () => {
  const featureList = [
    { icon: '📄', title: 'Smart OCR Extraction', description: 'Advanced OCR technology extracts all critical data from your bills with high accuracy.' },
    { icon: '💡', title: 'AI-Powered Summaries', description: 'Get plain-English explanations of every charge, fee, and tax on your utility bills.' },
    { icon: '📊', title: 'Interactive Visualizations', description: 'Beautiful charts and graphs help you understand your usage patterns and spending trends.' },
    { icon: '🔍', title: 'Error Detection', description: 'Machine learning algorithms identify billing errors, overcharges, and unusual spikes.' },
  ];

  return (
    <section id="features" className="bg-gray-50 py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Powerful Features to Understand Your Bills</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Our AI-powered platform combines cutting-edge technology with user-friendly design to make utility bill analysis accessible to everyone.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureList.map(feature => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;