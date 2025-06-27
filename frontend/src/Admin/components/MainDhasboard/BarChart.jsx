'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 10, 15, 8],
        backgroundColor: '#3B82F6',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.4,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6B7280' },
      },
      y: {
        beginAtZero: true,
        grid: { drawBorder: false },
        ticks: { stepSize: 5, color: '#6B7280' },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-md shadow w-full h-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold font-fredoka">Total Sales</h3>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full" />
          <span className="text-sm font-fredoka">Tasks</span>
          <button className="text-gray-400 hover:text-gray-600 text-lg font-bold">⋮</button>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;

// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// const BarChart = () => {
//   const data = {
//     labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
//     datasets: [
//       {
//         label: 'Sales',
//         data: [12, 19, 10, 15, 8],
//         backgroundColor: '#3B82F6', // Tailwind blue-500
//         borderRadius: 6,
//         barThickness: 10,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//         ticks: {
//           color: '#6B7280', // Tailwind gray-500
//         },
//       },
//       y: {
//         beginAtZero: true,
//         grid: {
//           drawBorder: false,
//         },
//         ticks: {
//           stepSize: 5,
//           color: '#6B7280',
//         },
//       },
//     },
//   };

//   return (
//     <div className="bg-white p-2 rounded-md shadow w-[340px] h-[300px] flex flex-col ml-14">
//       {/* Header row */}
//       <div className="flex items-center justify-between mb-2">
//         <h3 className="text-sm font-semibold mb-2 font-fredoka">Total Sales</h3>

//         <div className="flex items-center gap-2">
//           <button className="w-4 h-4 bg-blue-600 hover:bg-gray-200 text-white rounded-full flex items-center justify-center text-xs font-medium"></button>
//           <span className="text-sm  font-fredoka">Tasks</span>
//           <button className="text-gray-400 hover:text-gray-600 text-lg font-bold">⋮</button>
//         </div>
//       </div>

//       {/* Chart area */}
//       <div className="flex-1">
//         <Bar data={data} options={options} />
//       </div>
//     </div>
//   );
// };

// export default BarChart;
