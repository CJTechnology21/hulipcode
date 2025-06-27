import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  Filler, // ✅ Add this
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  Filler // ✅ Register it here
);

const TotalRevenue = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue 2023',
        data: [12000, 15000, 11000, 18000, 20000, 17500, 21000, 22000, 19000, 18500, 17000, 16000],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'Revenue 2024',
        data: [14000, 16000, 13000, 19500, 22000, 18500, 22500, 24000, 21000, 20000, 19000, 18000],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Hide internal legend
    },
    scales: {
      x: {
        title: { display: true, text: 'Month' },
      },
      y: {
        title: { display: true, text: 'Revenue ($)' },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded shadow w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Total Revenue </h3>

        {/* Custom legend buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-600">2023</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600">2024</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default TotalRevenue;
