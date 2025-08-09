import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const BillPieChart = ({ structuredData }) => {
  const { baseCharge, taxesAndFees, otherCharges } = structuredData;

  const data = {
    labels: ['Base Charge', 'Taxes & Fees', 'Other Charges'],
    datasets: [
      {
        label: 'Cost Breakdown',
        data: [baseCharge || 0, taxesAndFees || 0, otherCharges || 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          '#ffffff',
          '#ffffff',
          '#ffffff',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Cost Breakdown',
        font: { size: 18, weight: 'bold' },
        padding: { top: 10, bottom: 20 },
      },
    },
    cutout: '50%',
  };

  return <Doughnut data={data} options={options} />;
};

export default BillPieChart;
