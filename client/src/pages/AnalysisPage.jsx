import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BillChart from '../components/analysis/BillChart';

const AnalysisPage = () => {
  const { billId } = useParams();
  const [currentBill, setCurrentBill] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  const hasFetchedDashboardData = useRef(false);
  const intervalRef = useRef(null);

  const languageCodeMap = {
    'English': 'en-US',
    'Hindi': 'hi-IN',
    'Telugu': 'te-IN',
    'Tamil': 'ta-IN',
    'Spanish': 'es-ES',
  };

  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const handleSpeak = (text, language) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if ('speechSynthesis' in window && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      const langCode = languageCodeMap[language] || 'en-US';
      const selectedVoice = voices.find(voice => voice.lang === langCode);
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.lang = langCode;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support text-to-speech or there is no summary to read.');
    }
  };

  useEffect(() => {
    const fetchBillStatus = async () => {
      try {
        const response = await axios.get(`https://voiceyourbill-server.onrender.com/api/bills/${billId}`);
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
        setError('Could not fetch bill data. Please try again later.');
        clearInterval(intervalRef.current);
      }
    };

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('https://voiceyourbill-server.onrender.com/api/bills/dashboard');
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
      window.speechSynthesis.cancel();
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
      return (
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Analysis Complete</h2>
          
          {currentBill.anomalyData?.isAnomaly && (
            <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md">
              <p className="font-bold">Anomaly Detected!</p>
              <p>{currentBill.anomalyData.message}</p>
            </div>
          )}

          <div className="mt-6 p-6 bg-gray-50 rounded-lg border">
            {/* --- FIX: Corrected Layout for Title and Button --- */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold">AI Summary</h3>
              <button
                onClick={() => handleSpeak(currentBill.aiSummary, currentBill.language)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                title={isSpeaking ? "Stop Reading" : "Read Aloud"}
                disabled={!currentBill.aiSummary}
              >
                {isSpeaking ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                )}
              </button>
            </div>
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
