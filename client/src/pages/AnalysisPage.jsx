// client/src/pages/AnalysisPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BillChart from '../components/analysis/BillChart';

const AnalysisPage = () => {
  const { billId } = useParams();
  const [currentBill, setCurrentBill] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [error, setError] = useState('');

  const hasFetchedDashboardData = useRef(false);
  const intervalRef = useRef(null);

  // Fetch dashboard chart data (no userId needed anymore)
  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('https://voiceyourbill-server.onrender.com/api/bills/dashboard');
      setHistoricalData(response.data);
    } catch (err) {
      console.error('Could not fetch dashboard data.', err);
      setError('Could not load historical chart data.');
    }
  };

  useEffect(() => {
    const fetchBillStatus = async () => {
      try {
        const response = await axios.get(`https://voiceyourbill-server.onrender.com/api/bills/${billId}`);
        const billData = response.data;
        setCurrentBill(billData);

        const isProcessFinished =
          billData.status === 'completed' || billData.status === 'failed';

        if (isProcessFinished) {
          clearInterval(intervalRef.current);
          if (billData.status === 'completed' && !hasFetchedDashboardData.current) {
            hasFetchedDashboardData.current = true;
            fetchDashboardData();
          }
        }
      } catch (err) {
        setError('Could not fetch bill data. Please try again later.');
        clearInterval(intervalRef.current);
      }
    };

    fetchBillStatus();
    intervalRef.current = setInterval(fetchBillStatus, 3000);

    return () => clearInterval(intervalRef.current);
  }, [billId]);

  const renderContent = () => {
    if (error && !currentBill) {
      return <p className="text-red-500 text-center text-xl">{error}</p>;
    }

    if (!currentBill || ['uploaded', 'processing'].includes(currentBill.status)) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold animate-pulse">Analyzing Your Bill...</h2>
          <p className="text-gray-600 mt-2">
            This may take up to 30 seconds. Please wait.
          </p>
        </div>
      );
    }

    if (currentBill.status === 'failed') {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-700">Analysis Failed</h2>
          <p className="text-gray-600 mt-2">
            We were unable to process your bill. Please try again.
          </p>
        </div>
      );
    }

    if (currentBill.status === 'completed') {
      return (
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Analysis Complete</h2>
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border">
            <h3 className="text-xl font-semibold mb-3">AI Summary</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{currentBill.aiSummary}</p>
          </div>
          <div className="mt-10">
            {historicalData.length > 0 ? (
              <BillChart historicalData={historicalData} />
            ) : (
              <p className="text-center text-gray-500">Loading chart data...</p>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md min-h-[400px] flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default AnalysisPage;
