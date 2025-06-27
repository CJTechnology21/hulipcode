
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { year: "2018", sales: 500, profit: 250 },
  { year: "2019", sales: 300, profit: 150 },
  { year: "2020", sales: 350, profit: 200 },
  { year: "2021", sales: 480, profit: 380 },
  { year: "2022", sales: 180, profit: 230 },
  { year: "2023", sales: 400, profit: 260 },
  { year: "2034", sales: 380, profit: 310 },
];

function Activity() {
  return (
    <div className="bg-white p-4 rounded-md shadow w-full h-[300px] sm:w-[600px] sm:ml-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
        <h2 className="text-sm font-semibold mb-2 sm:mb-0">Activity</h2>
        <div className="text-xs flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-[#7DB9FF]"></span>
            <span>Total sales</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-[#FFB6A2]"></span>
            <span>Profits</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} barGap={8}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#7DB9FF" radius={[10, 10, 0, 0]} />
          <Bar dataKey="profit" fill="#FFB6A2" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Activity;
// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const data = [
//   { year: "2018", sales: 500, profit: 250 },
//   { year: "2019", sales: 300, profit: 150 },
//   { year: "2020", sales: 350, profit: 200 },
//   { year: "2021", sales: 480, profit: 380 },
//   { year: "2022", sales: 180, profit: 230 },
//   { year: "2023", sales: 400, profit: 260 },
//   { year: "2034", sales: 380, profit: 310 },
// ];

// function Activity() {
//   return (
//     <div className="bg-white p-4 rounded-md shadow w-[600px] h-[300px] ml-2 relative">
//       <div className="flex justify-between items-center mb-2">
//         <h2 className="text-sm font-semibold">Activity</h2>
//         <div className="text-xs flex items-center space-x-4 pr-2">
//           <div className="flex items-center space-x-1">
//             <span className="w-3 h-3 rounded-full bg-[#7DB9FF]"></span>
//             <span>Total sales</span>
//           </div>
//           <div className="flex items-center space-x-1">
//             <span className="w-3 h-3 rounded-full bg-[#FFB6A2]"></span>
//             <span>Profits</span>
//           </div>
//         </div>
//       </div>
//       <ResponsiveContainer width="100%" height="90%">
//         <BarChart data={data} barGap={8}>
//           <XAxis dataKey="year" />
//           <YAxis />
//           <Tooltip />
//           <Bar dataKey="sales" fill="#7DB9FF" radius={[10, 10, 0, 0]}></Bar>
//           <Bar dataKey="profit" fill="#FFB6A2" radius={[10, 10, 0, 0]}></Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// export default Activity;
