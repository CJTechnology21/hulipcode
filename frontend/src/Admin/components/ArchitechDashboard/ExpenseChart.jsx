import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
} from "recharts";

// Chart data
const data = [
  { name: "Real Estate", value: 30, color: "#2f345f", offset: 15 },
  { name: "Construction", value: 15, color: "#ff7f0e", offset: 20 },
  { name: "Home", value: 40, color: "#ff00ff", offset: 18 },
  { name: "Others", value: 15, color: "#1f3cff", offset: 22 },
];

// Custom exploded shape
const renderCustomizedShape = (props) => {
  const {
    cx,
    cy,
    startAngle,
    endAngle,
    outerRadius,
    fill,
    payload,
    midAngle,
    value,
  } = props;

  const RADIAN = Math.PI / 180;
  const offset = payload.offset || 10;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);

  const sx = cx + offset * cos;
  const sy = cy + offset * sin;

  return (
    <g>
      <Sector
        cx={sx}
        cy={sy}
        innerRadius={0}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <text
        x={sx + cos * (outerRadius / 1.5)}
        y={sy + sin * (outerRadius / 1.5)}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#fff"
        fontSize={10}
        fontWeight={600}
      >
        {`${value}%`}
        <tspan x={sx + cos * (outerRadius / 1.5)} dy="1.1em">
          {payload.name}
        </tspan>
      </text>
    </g>
  );
};

const FinalExpensePieChart = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="bg-white border-2 rounded-xl px-4 pt-2 pb-3 w-full max-w-sm">
        {/* Header */}
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Expense Statistics
        </h3>

        {/* Chart */}
        <div className="relative w-full aspect-square">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius="70%"
                isAnimationActive={false}
                labelLine={false}
                shape={renderCustomizedShape}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinalExpensePieChart;

// import React from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Sector,
// } from "recharts";

// // Chart data
// const data = [
//   { name: "Real Estate", value: 30, color: "#2f345f", offset: 15 },
//   { name: "Construction", value: 15, color: "#ff7f0e", offset: 20 },
//   { name: "Home", value: 40, color: "#ff00ff", offset: 18 },
//   { name: "Others", value: 15, color: "#1f3cff", offset: 22 },
// ];

// // Custom exploded shape
// const renderCustomizedShape = (props) => {
//   const {
//     cx,
//     cy,
//     startAngle,
//     endAngle,
//     outerRadius,
//     fill,
//     payload,
//     midAngle,
//     value,
//   } = props;

//   const RADIAN = Math.PI / 180;
//   const offset = payload.offset || 10;

//   const sin = Math.sin(-RADIAN * midAngle);
//   const cos = Math.cos(-RADIAN * midAngle);

//   const sx = cx + offset * cos;
//   const sy = cy + offset * sin;

//   return (
//     <g>
//       <Sector
//         cx={sx}
//         cy={sy}
//         innerRadius={0}
//         outerRadius={outerRadius}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         fill={fill}
//       />
//       <text
//         x={sx + cos * (outerRadius / 1.5)}
//         y={sy + sin * (outerRadius / 1.5)}
//         textAnchor="middle"
//         dominantBaseline="central"
//         fill="#fff"
//         fontSize={10}
//         fontWeight={600}
//       >
//         {`${value}%`}
//         <tspan x={sx + cos * (outerRadius / 1.5)} dy="1.1em">
//           {payload.name}
//         </tspan>
//       </text>
//     </g>
//   );
// };

// const FinalExpensePieChart = () => {
//   return (
//     <div className="flex justify-start w-full">
//       <div className="bg-white border-2 rounded-xl px-4 pt-2 pb-3 w-[280px] h-[250px] flex flex-col ml-40">
//         {/* Header */}
//         <h3 className="text-sm font-semibold text-gray-800 mb-1">
//           Expense Statistics
//         </h3>

//         {/* Chart */}
//         <div className="flex-1">
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 data={data}
//                 dataKey="value"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={70}
//                 isAnimationActive={false}
//                 labelLine={false}
//                 shape={renderCustomizedShape}
//               >
//                 {data.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FinalExpensePieChart;

