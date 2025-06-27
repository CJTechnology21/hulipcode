import React, { useState } from "react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];

const values = {
  Jan: "$5,000", Feb: "$4,200", Mar: "$6,300", Apr: "$3,800", May: "$7,500",
  Jun: "$2,900", Jul: "$5,600", Aug: "$6,000", Sep: "$8,200", Oct: "$4,700",
};

function ArchitectExpense() {
  const [selectedMonth, setSelectedMonth] = useState("Oct");

  return (
    <div className="bg-white rounded-xl p-4 shadow w-full max-w-[300px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[450px] xl:max-w-[460px]">
      <h2 className="text-md font-semibold text-gray-800 mb-4">Architect Expense</h2>

      <div className="flex items-end justify-between gap-3 overflow-x-auto h-[140px]">
        {months.map((month) => (
          <div
            key={month}
            className="flex flex-col items-center cursor-pointer flex-shrink-0"
            onClick={() => setSelectedMonth(month)}
          >
            {selectedMonth === month && (
              <span className="text-xs font-medium text-gray-700 mb-1">{values[month]}</span>
            )}
            <div
              className={`w-4 transition-all duration-300 rounded-md ${
                selectedMonth === month ? "bg-green-500 h-24" : "bg-gray-200 h-16"
              }`}
            ></div>
            <span className="text-[10px] mt-1 text-gray-600">{month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArchitectExpense;

// import React, { useState } from "react";

// const months = [
//   "Jan", "Feb", "Mar", "Apr",
//   "May", "Jun", "Jul", "Aug",
//   "Sep", "Oct",
// ];

// const values = {
//   Jan: "$5,000",
//   Feb: "$4,200",
//   Mar: "$6,300",
//   Apr: "$3,800",
//   May: "$7,500",
//   Jun: "$2,900",
//   Jul: "$5,600",
//   Aug: "$6,000",
//   Sep: "$8,200",
//   Oct: "$4,700",
// };

// function ArchitectExpense() {
//   const [selectedMonth, setSelectedMonth] = useState("Oct");

//   return (
//     <div className="bg-white rounded-xl p-4 w-[250px] h-[250px] shadow ml-[150px]">
//       <h2 className="text-md font-semibold text-gray-800 mb-4">Architect Expense</h2>
//       <div className="flex items-end justify-between h-[140px] overflow-x-auto custom-scroll">
//         {months.map((month) => (
//           <div
//             key={month}
//             className="flex flex-col items-center cursor-pointer"
//             onClick={() => setSelectedMonth(month)}
//           >
//             {selectedMonth === month && (
//               <span className="text-xs font-medium text-gray-700 mb-1">
//                 {values[month]}
//               </span>
//             )}
//             <div
//               className={`w-4 transition-all duration-300 rounded-md ${
//                 selectedMonth === month ? "bg-green-500 h-24" : "bg-gray-200 h-16"
//               }`}
//             ></div>
//             <span className="text-[10px] mt-1 text-gray-600">{month}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ArchitectExpense;
