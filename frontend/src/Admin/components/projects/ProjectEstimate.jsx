import React from "react";
import Button from "../../../components/Button";

function ProjectEstimate() {
  return (
    <div className="relative flex flex-col items-center justify-center h-[80vh] text-center px-4">
      <p className="text-gray-600 mb-4">
        You need to create a BOQ in order to see your budgeting
      </p>
      <Button
        variant="custom"
        color="red"
        size="sm"
        className=" bg-red-500 hover:bg-red-600 text-white cursor-pointer font-medium"
      >
        + Create BOQ
      </Button>

      <div className="mt-6">
        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-2xl">
          abc
        </div>
      </div>

      <div className="absolute bottom-4 w-full text-xs text-gray-500 flex justify-around border-t pt-2">
        <div>Cost Price:</div>
        <div>Markup:</div>
        <div>Total Amount:</div>
      </div>
    </div>
  );
}

export default ProjectEstimate;

// import React from 'react';

// function ProjectEstimate() {
//   return (
//     <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
//       {/* Main Message */}
//       <p className="text-gray-600 mb-4">
//         You need to create a BOQ in order to see your budgeting
//       </p>

//       {/* Create BOQ Text Button */}
//       <button className="text-indigo-600 text-sm font-medium hover:underline">
//         + Create BOQ
//       </button>

//       {/* Optional: Icon Placeholder */}
//       <div className="mt-6">
//         <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-2xl">
//           abc
//         </div>
//       </div>

//       {/* Bottom Cost Summary */}
//       <div className="absolute bottom-4 w-full text-xs text-gray-500 flex justify-around border-t pt-2">
//         <div>Cost Price:</div>
//         <div>Markup:</div>
//         <div>Total Amount:</div>
//       </div>
//     </div>
//   );
// }

// export default ProjectEstimate;
