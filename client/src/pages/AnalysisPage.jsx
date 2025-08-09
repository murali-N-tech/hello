import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BillLineGraph from '../components/analysis/BillLineGraph';
import BillPieChart from '../components/analysis/BillPieChart';

// --- ENHANCED Metric Card Component ---
const MetricCard = ({ title, value, icon, bgColor, iconColor }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg flex items-center transition-transform transform hover:scale-105">
    <div className={`p-4 rounded-full mr-5 ${bgColor} ${iconColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-md text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const AnalysisPage = () => {
  const { billId } = useParams();
  const [currentBill, setCurrentBill] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const audioRef = useRef(null);
  const hasFetchedDashboardData = useRef(false);
  const intervalRef = useRef(null);

  const handleSpeak = async (text, language) => {
    if (!text) return;

    if (isSpeaking && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/tts/speak`,
        { text, language },
        { responseType: 'blob' }
      );

      if (response.data.type !== 'audio/mpeg') {
        const errorText = await response.data.text();
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || 'Backend did not return a valid audio file.');
      }

      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => {
        console.error("Error playing audio.");
        setIsSpeaking(false);
      };
      
      audio.play();

    } catch (err) {
      console.error("Failed to fetch audio:", err);
      setError("Sorry, couldn't generate audio for this summary.");
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    const fetchBillStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/bills/${billId}`);
        const billData = response.data;
        setCurrentBill(billData);
        const isProcessFinished = billData.status === 'completed' || billData.status === 'failed';
        if (isProcessFinished) {
          clearInterval(intervalRef.current);
          if (billData.status === 'completed' && !hasFetchedDashboardData.current) {
            hasFetchedDashboardData.current = true;
            fetchDashboardData();
          }
        }
      } catch (err) {
        setError('Could not fetch bill data.');
        clearInterval(intervalRef.current);
      }
    };

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/bills/dashboard`);
        setHistoricalData(response.data);
      } catch (err) {
        console.error("Could not fetch dashboard data.", err);
        setError("Could not load historical chart data.");
      }
    };

    fetchBillStatus();
    intervalRef.current = setInterval(fetchBillStatus, 3000);
    
    return () => {
      clearInterval(intervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [billId]);

  const renderContent = () => {
    if (error && !currentBill) {
      return <p className="text-red-500 text-center text-xl">{error}</p>;
    }

    if (!currentBill || ['uploaded', 'processing'].includes(currentBill.status)) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold animate-pulse">Analyzing Your Bill...</h2>
          <p className="text-gray-600 mt-2">This may take up to 30 seconds. Please wait.</p>
        </div>
      );
    }

    if (currentBill.status === 'failed') {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-700">Analysis Failed</h2>
          <p className="text-gray-600 mt-2">We were unable to process your bill. Please try again.</p>
        </div>
      );
    }

    if (currentBill.status === 'completed') {
      const { structuredData } = currentBill;
      const hasPieChartData = structuredData?.baseCharge || structuredData?.taxesAndFees || structuredData?.otherCharges;

      return (
        <div className="w-full">
          <div className="flex justify-between items-center mb-6">
             <h1 className="text-4xl font-bold text-gray-800">Analysis Complete</h1>
             <span className="text-sm text-gray-500">Bill: {currentBill.originalName}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard 
              title="Total Cost" 
              value={`₹${structuredData?.totalCost?.toFixed(2) || 'N/A'}`} 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}
              bgColor="bg-green-100"
              iconColor="text-green-600"
            />
            <MetricCard 
              title="Units Used" 
              value={structuredData?.unitsUsed || 'N/A'} 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              bgColor="bg-yellow-100"
              iconColor="text-yellow-600"
            />
            <MetricCard 
              title="Due Date" 
              value={structuredData?.dueDate ? new Date(structuredData.dueDate).toLocaleDateString() : 'N/A'} 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              bgColor="bg-red-100"
              iconColor="text-red-600"
            />
          </div>

          {currentBill.anomalyData?.isAnomaly && (
            <div className="mb-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow">
              <p className="font-bold">Anomaly Detected!</p>
              <p>{currentBill.anomalyData.message}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg flex items-center justify-center">
              {hasPieChartData ? (
                <BillPieChart structuredData={structuredData} />
              ) : (
                <div className="text-center text-gray-500">
                  <p>A detailed cost breakdown was not available for this bill.</p>
                </div>
              )}
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">AI Summary</h3>
                <button
                  onClick={() => handleSpeak(currentBill.aiSummary, currentBill.language)}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                  title={isSpeaking ? "Stop Reading" : "Read Aloud"}
                >
                  {isSpeaking ? '⏹️' : '🔊'}
                </button>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{currentBill.aiSummary}</p>
            </div>
          </div>

          <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
            {historicalData.length > 0 ? (
              <BillLineGraph historicalData={historicalData} />
            ) : (
              <div className="flex items-center justify-center h-full">
                 <p className="text-center text-gray-500">Loading historical chart data...</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto min-h-[500px] flex items-center justify-center">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
