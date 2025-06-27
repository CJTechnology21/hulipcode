
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

const ProjectStatusChart = () => {
  const data = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Completed',
        data: [15, 20, 18, 22, 25],
        backgroundColor: '#8B5CF6',
        borderRadius: 6,
        barThickness: 12,
      },
      {
        label: 'Incomplete',
        data: [5, 7, 6, 4, 3],
        backgroundColor: '#EC4899',
        borderRadius: 6,
        barThickness: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6B7280', font: { size: 10 } },
      },
      y: {
        beginAtZero: true,
        grid: { drawBorder: false },
        ticks: {
          stepSize: 5,
          color: '#6B7280',
          font: { size: 10 },
        },
        title: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white p-3 rounded-xl shadow w-full max-w-xl mx-auto flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-base font-semibold">Project Completion</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-purple-600"></span>
            <span className="text-xs text-gray-700">Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-pink-500"></span>
            <span className="text-xs text-gray-700">Incomplete</span>
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="relative w-full h-[200px] sm:h-[240px] md:h-[280px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default ProjectStatusChart;
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

// const ProjectStatusChart = () => {
//   const data = {
//     labels: ['2020', '2021', '2022', '2023', '2024'],
//     datasets: [
//       {
//         label: 'Completed',
//         data: [15, 20, 18, 22, 25],
//         backgroundColor: '#8B5CF6',
//         borderRadius: 6,
//         barThickness: 12,
//       },
//       {
//         label: 'Incomplete',
//         data: [5, 7, 6, 4, 3],
//         backgroundColor: '#EC4899',
//         borderRadius: 6,
//         barThickness: 12,
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
//         grid: { display: false },
//         ticks: { color: '#6B7280', font: { size: 10 } },
//       },
//       y: {
//         beginAtZero: true,
//         grid: { drawBorder: false },
//         ticks: {
//           stepSize: 5,
//           color: '#6B7280',
//           font: { size: 10 },
//         },
//         title: {
//           display: false,
//         },
//       },
//     },
//   };

//   return (
//     <div className="bg-white p-3 rounded-xl shadow w-[550px] h-[250px] flex flex-col justify-between">
//       {/* Header row */}
//       <div className="flex items-center justify-between">
//         <h3 className="text-base font-semibold">Project Completion</h3>
//         <div className="flex items-center gap-3">
//           <div className="flex items-center gap-1">
//             <span className="w-3 h-3 rounded-full bg-purple-600"></span>
//             <span className="text-xs text-gray-700">Completed</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <span className="w-3 h-3 rounded-full bg-pink-500"></span>
//             <span className="text-xs text-gray-700">Incomplete</span>
//           </div>
//         </div>
//       </div>

//       {/* Chart area */}
//       <div className="h-[180px] mt-2">
//         <Bar data={data} options={options} />
//       </div>
//     </div>
//   );
// };

// export default ProjectStatusChart;
