// import React from 'react';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const PieChartBox = ({ title, value, label, color }) => {
//   const data = {
//     labels: [label, 'Others'],
//     datasets: [
//       {
//         data: [value, 100 - value],
//         backgroundColor: [color, '#E5E7EB'],
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <div className="bg-white p-3 rounded shadow flex flex-col items-center w-full h-[200px] sm:h-[220px] md:h-[240px]">
//       <h4 className="text-xs sm:text-sm font-semibold mb-2 font-fredoka text-center">{title}</h4>
//       <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
//         <Pie
//           data={data}
//           options={{
//             maintainAspectRatio: false,
//             responsive: true,
//             plugins: {
//               legend: { display: false },
//             },
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default PieChartBox;

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartBox = ({ title, value, label, color }) => {
  const data = {
    labels: [label, 'Others'],
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: [color, '#E5E7EB'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-3 rounded shadow flex flex-col items-center w-full h-[180px]">
      <h4 className="text-sm font-semibold mb-2 font-fredoka">{title}</h4>
      <div className="w-20 h-20">
        <Pie data={data} options={{ plugins: { legend: { display: false } } }} />
      </div>
    </div>
  );
};

export default PieChartBox;
