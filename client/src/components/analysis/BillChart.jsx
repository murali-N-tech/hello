import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// This registers the necessary components for Chart.js to work.
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BillChart = ({ historicalData }) => {
  // Ensure historicalData is an array before processing
  if (!Array.isArray(historicalData) || historicalData.length === 0) {
    return <p>No data available for chart.</p>;
  }

  // Reverse the data to show oldest to newest for a proper timeline
  const sortedData = [...historicalData].reverse();

  const data = {
    // Labels for the X-axis (Months)
    labels: sortedData.map(bill => {
      // Safely access nested data
      const dueDate = bill?.structuredData?.dueDate;
      return dueDate ? new Date(dueDate).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }) : 'Unknown Date';
    }),
    // Data for the Y-axis
    datasets: [
      {
        label: 'Total Cost (in ₹)',
        data: sortedData.map(bill => bill?.structuredData?.totalCost || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Bill Cost Analysis',
        font: {
          size: 18,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Format the Y-axis labels to show the currency symbol
          callback: function (value) {
            return '₹' + value;
          },
        },
      },
    },
  };

  return <Bar options={options} data={data} />;
};

export default BillChart;