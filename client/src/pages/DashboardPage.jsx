import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BillLineGraph from '../components/analysis/BillLineGraph';
import BillPieChart from '../components/analysis/BillPieChart';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const DashboardPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/bills/dashboard`);
        setBills(response.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center p-10">Loading Dashboard...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  const mostRecentBill = bills[0];
  const hasPieChartData = mostRecentBill && (
    mostRecentBill.structuredData?.baseCharge ||
    mostRecentBill.structuredData?.taxesAndFees ||
    mostRecentBill.structuredData?.otherCharges
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Dashboard</h1>
        
        {bills.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
              <BillLineGraph historicalData={bills} />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center">
              {hasPieChartData ? (
                <BillPieChart structuredData={mostRecentBill.structuredData} />
              ) : (
                <div className="text-center">
                  <p className="text-gray-500">
                    A detailed cost breakdown was not available for the most recent bill.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center bg-white p-10 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-700">No bill data found</h2>
            <p className="text-gray-500 mt-2">Upload your first bill to see your dashboard and analysis.</p>
            <Link to="/" className="mt-6 inline-block bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600">
              Upload a Bill
            </Link>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Bill Archive</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bills.map((bill) => (
                  <tr key={bill._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bill.originalName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(bill.uploadDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{bill.structuredData?.totalCost?.toFixed(2) || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        bill.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/analysis/${bill._id}`} className="text-green-600 hover:text-green-900">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
