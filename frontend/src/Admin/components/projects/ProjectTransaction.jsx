import React, { useState } from "react";
import Button from "../../../components/Button";
import { FiTrendingUp } from "react-icons/fi";
import TransactionTypesModal from "./TransactionTypesModal"; // adjust path if needed

function ProjectTransaction() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-screen h-screen bg-white flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-4">
          <button className="px-4 py-1 bg-gray-100 rounded-md border">
            Filter
          </button>
          <button className="px-4 py-1 bg-gray-100 rounded-md border">
            Date Filter
          </button>
        </div>
        <Button
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          onClick={() => setIsModalOpen(true)}
        >
          Create Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
        {/* Invoice */}
        <div className="bg-blue-100 rounded-lg p-4 shadow-sm">
          <div className="text-sm font-semibold text-gray-700">Invoice</div>
          <div className="text-2xl font-bold">₹0</div>
          <div className="text-sm text-gray-600">Payment In ₹0</div>
        </div>
        {/* Expense */}
        <div className="bg-purple-100 rounded-lg p-4 shadow-sm">
          <div className="text-sm font-semibold text-gray-700">Expense</div>
          <div className="text-2xl font-bold">₹0</div>
          <div className="text-sm text-gray-600">Payment Out ₹0</div>
        </div>
        {/* Margin */}
        <div className="bg-green-100 rounded-lg p-4 shadow-sm">
          <div className="text-sm font-semibold text-gray-700">Margin</div>
          <div className="text-2xl font-bold">₹0</div>
          <div className="text-sm text-gray-600">Project Balance ₹0</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b">
        <div className="flex gap-4 text-sm text-gray-600">
          <div className="border-b-2 border-red-600 pb-2">Transaction</div>
          {/* Add more tabs as needed */}
        </div>
      </div>

      {/* Table Header */}
      <div className="flex justify-between px-6 py-2 bg-gray-100 text-sm font-medium border-b">
        <div>Party</div>
        <div>Status</div>
      </div>

      {/* Content Area */}
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 border border-red-600">
            <FiTrendingUp className="text-red-600 text-3xl" />
          </div>
          <div className="text-gray-500 text-sm">No Data Transaction</div>
        </div>
      </div>

      {/* Transaction Types Modal */}
      <TransactionTypesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(type) => {
          console.log("Selected transaction type:", type);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}

export default ProjectTransaction;

// import React from "react";
// import Button from "../../../components/Button";
// import { FiTrendingUp } from "react-icons/fi";

// function ProjectTransaction() {
//   return (
//     <div className="w-screen h-screen bg-white flex flex-col font-sans">
//       {/* Header */}
//       <div className="flex items-center justify-between px-6 py-4 border-b">
//         <div className="flex items-center gap-4">
//           <button className="px-4 py-1 bg-gray-100 rounded-md border">
//             Filter
//           </button>
//           <button className="px-4 py-1 bg-gray-100 rounded-md border">
//             Date Filter
//           </button>
//         </div>
//         <Button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
//           Create Transaction
//         </Button>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
//         {/* Invoice */}
//         <div className="bg-blue-100 rounded-lg p-4 shadow-sm">
//           <div className="text-sm font-semibold text-gray-700">Invoice</div>
//           <div className="text-2xl font-bold">₹0</div>
//           <div className="text-sm text-gray-600">Payment In ₹0</div>
//         </div>
//         {/* Expense */}
//         <div className="bg-purple-100 rounded-lg p-4 shadow-sm">
//           <div className="text-sm font-semibold text-gray-700">Expense</div>
//           <div className="text-2xl font-bold">₹0</div>
//           <div className="text-sm text-gray-600">Payment Out ₹0</div>
//         </div>
//         {/* Margin */}
//         <div className="bg-green-100 rounded-lg p-4 shadow-sm">
//           <div className="text-sm font-semibold text-gray-700">Margin</div>
//           <div className="text-2xl font-bold">₹0</div>
//           <div className="text-sm text-gray-600">Project Balance ₹0</div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="px-6 border-b">
//         <div className="flex gap-4 text-sm text-gray-600">
//           <div className="border-b-2 border-red-600  pb-2">Transaction</div>
//           {/* Add more tabs as needed */}
//         </div>
//       </div>

//       {/* Table Header */}
//       <div className="flex justify-between px-6 py-2 bg-gray-100 text-sm font-medium border-b">
//         <div>Party</div>
//         <div>Status</div>
//       </div>

//       {/* Content Area */}
//       <div className="flex-grow flex items-center justify-center bg-gray-50">
//         <div className="flex flex-col items-center justify-center space-y-2">
//           <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 border border-red-600">
//             <FiTrendingUp className="text-red-600 text-3xl" />
//           </div>
//           <div className="text-gray-500 text-sm">No Data Transaction</div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProjectTransaction;
