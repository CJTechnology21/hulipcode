import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jul", orders: 200, sales: 120 },
  { month: "Aug", orders: 300, sales: 180 },
  { month: "Sep", orders: 450, sales: 210 },
  { month: "Oct", orders: 700, sales: 260 },
  { month: "Nov", orders: 400, sales: 190 },
  { month: "Dec", orders: 500, sales: 220 },
  { month: "Jan", orders: 600, sales: 250 },
];

function MonthlySales() {
  return (
    <div className="bg-white p-4 rounded-md shadow w-full h-[300px] sm:w-[600px] sm:ml-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 space-y-2 sm:space-y-0">
        <h2 className="text-sm font-semibold">Monthly Sales</h2>
        <div className="text-xs flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
            <span className="text-gray-700">Orders</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
            <span className="text-gray-700">Sales</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="blue"
            strokeWidth={3}
            name="Orders"
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="gold"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Sales"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlySales;

// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const data = [
//   { month: "Jul", orders: 200, sales: 120 },
//   { month: "Aug", orders: 300, sales: 180 },
//   { month: "Sep", orders: 450, sales: 210 },
//   { month: "Oct", orders: 700, sales: 260 },
//   { month: "Nov", orders: 400, sales: 190 },
//   { month: "Dec", orders: 500, sales: 220 },
//   { month: "Jan", orders: 600, sales: 250 },
// ];

// function MonthlySales() {
//   return (
//     <div className="bg-white p-4 rounded-md shadow w-[600px] h-[300px] ml-2">
//       <div className="flex justify-between items-center mb-2">
//         <h2 className="text-sm font-semibold">Monthly Sales</h2>
//         <div className="text-xs flex items-center space-x-4">
//           <div className="flex items-center space-x-1">
//             <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
//             <span className="text-gray-700">Orders</span>
//           </div>
//           <div className="flex items-center space-x-1">
//             <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
//             <span className="text-gray-700">Sales</span>
//           </div>
//         </div>
//       </div>

//       {/* Graph */}
//       <ResponsiveContainer width="100%" height="90%">
//         <LineChart data={data}>
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />
//           <Line
//             type="monotone"
//             dataKey="orders"
//             stroke="blue"
//             strokeWidth={3}
//             name="Orders"
//           />
//           <Line
//             type="monotone"
//             dataKey="sales"
//             stroke="gold"
//             strokeWidth={2}
//             strokeDasharray="5 5"
//             name="Sales"
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// export default MonthlySales;
