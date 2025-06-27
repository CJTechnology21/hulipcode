
import React from "react";
import PieChartBox from "./PieChartBox";

const PieCharts = () => (
  <div className="bg-white p-4 rounded shadow w-full max-w-[700px] mx-auto">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-semibold">Pie Charts</h3>
      <div className="flex items-center gap-2">
        <button className="w-4 h-4 bg-red-600 hover:bg-gray-200 text-gray-600 rounded flex items-center justify-center text-sm font-medium" />
        <span className="text-sm text-black">show value</span>
        <button className="text-gray-400 hover:text-gray-600 text-lg font-bold">
          ⋮
        </button>
      </div>
    </div>

    {/* Responsive Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <PieChartBox
        title="Bookings"
        value={81}
        label="Bookings"
        color="#3B82F6"
      />
      <PieChartBox
        title="Customer Growth"
        value={22}
        label="Growth"
        color="#10B981"
      />
      <PieChartBox
        title="Sales Share"
        value={62}
        label="Sales"
        color="#F59E0B"
      />
    </div>
  </div>
);

export default PieCharts;
// import React from "react";
// import PieChartBox from "./PieChartBox";

// const PieCharts = () => (
//   <div className="bg-white p-4 rounded shadow w-[450px] h-[300px]">
//     {/* Header with title on the left, controls on the right */}
//     <div className="flex items-center justify-between mb-4">
//       <h3 className="text-base font-semibold">Pie Charts</h3>

//       <div className="flex items-center gap-2">
//         <button className="w-4 h-4 bg-red-600 hover:bg-gray-200 text-gray-600 rounded flex items-center justify-center text-sm font-medium"></button>
//         <span className="text-sm text-black">show value</span>
//         <button className="text-gray-400 hover:text-gray-600 text-lg font-bold">
//           ⋮
//         </button>
//       </div>
//     </div>

//     {/* Pie chart grid */}
//     <div className="grid grid-cols-3 gap-3 mt-4">
//       <PieChartBox
//         title="Bookings"
//         value={81}
//         label="Bookings"
//         color="#3B82F6"
//       />
//       <PieChartBox
//         title="Customer Growth"
//         value={22}
//         label="Growth"
//         color="#10B981"
//       />
//       <PieChartBox
//         title="Sales Share"
//         value={62}
//         label="Sales"
//         color="#F59E0B"
//       />
//     </div>
//   </div>
// );

// export default PieCharts;

