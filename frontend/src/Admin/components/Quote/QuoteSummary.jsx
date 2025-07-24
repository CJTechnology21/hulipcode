import React, { useState } from "react";
import { FaEdit, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";

const mockData = [
  {
    id: 1,
    space: "Design & Consultation",
    workPackages: 5,
    items: 5,
    amount: 150000,
    tax: 27000,
  },
  {
    id: 2,
    space: "Bedroom 1",
    workPackages: 16,
    items: 18,
    amount: 180000,
    tax: 32000,
  },
  {
    id: 3,
    space: "Master Bedroom",
    workPackages: 23,
    items: 8,
    amount: 300000,
    tax: 54000,
  },
  {
    id: 4,
    space: "Master Bedroom Toilet",
    workPackages: 18,
    items: 22,
    amount: 200000,
    tax: 36000,
  },
  {
    id: 5,
    space: "Living Room",
    workPackages: 15,
    items: 10,
    amount: 800000,
    tax: 144000,
  },
  {
    id: 6,
    space: "Kitchen",
    workPackages: 19,
    items: 8,
    amount: 450000,
    tax: 81000,
  },
  {
    id: 7,
    space: "Powder Washroom",
    workPackages: 12,
    items: 14,
    amount: 100000,
    tax: 18000,
  },
  {
    id: 8,
    space: "Store Room",
    workPackages: 9,
    items: 4,
    amount: 50000,
    tax: 9000,
  },
];

const QuoteSummary = ({ activeSection, isHuelip }) => {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);

  const filteredData =
    activeSection === "Summary"
      ? mockData
      : mockData.filter((row) => row.space === activeSection);

  const totalAmount = filteredData.reduce((sum, row) => sum + row.amount, 0);
  const totalTax = filteredData.reduce((sum, row) => sum + row.tax, 0);
  const total = totalAmount + totalTax;

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString("en-IN")}/-`;

  const handleFinalAction = () => {
    if (isHuelip) {
      navigate("/contract");
    } else {
      navigate("/projects");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      {/* Table */}
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="border-b font-semibold">
            <th className="py-2 px-2">
              <FiFilter />
            </th>
            <th className="py-2 px-2">Space</th>
            <th className="py-2 px-2">Work Packages</th>
            <th className="py-2 px-2">Items</th>
            <th className="py-2 px-2">Amount</th>
            <th className="py-2 px-2">Tax</th>
            <th className="py-2 px-2">Total</th>
            <th className="py-2 px-2"></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={row.id} className="border-b">
              <td className="py-2 px-2">{index + 1}</td>
              <td className="py-2 px-2">{row.space}</td>
              <td className="py-2 px-2">{row.workPackages}</td>
              <td className="py-2 px-2">{row.items}</td>
              <td className="py-2 px-2">{formatCurrency(row.amount)}</td>
              <td className="py-2 px-2">{formatCurrency(row.tax)}</td>
              <td className="py-2 px-2">
                {formatCurrency(row.amount + row.tax)}
              </td>
              <td className="py-2 px-2 text-red-700 hover:cursor-pointer">
                <FaEdit />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Row */}
      <div className="flex justify-end mt-4 text-sm font-semibold">
        <div className="flex flex-col items-end space-y-1">
          <div>Amount: {formatCurrency(totalAmount)}</div>
          <div>Tax: {formatCurrency(totalTax)}</div>
          <div className="text-lg mt-1">
            Total:{" "}
            <span className="bg-red-700 text-white px-4 py-1 rounded ml-2">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Toggle */}
      {activeSection === "Summary" && (
        <div className="mt-6">
          <Button
            color="red"
            variant="custom"
            size="md"
            className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white"
            onClick={() => setShowTerms((prev) => !prev)}
          >
            Terms & Conditions
            {showTerms ? <FaChevronUp /> : <FaChevronDown />}
          </Button>

          {/* Terms Content */}
          {showTerms && (
            <div className="mt-3 text-xs text-gray-700 bg-gray-50 p-4 rounded shadow-inner">
              <p className="font-semibold mb-2 uppercase">
                Terms and Conditions for Interior Design & Execution Services
              </p>
              <p>
                This document outlines the terms and conditions governing the
                engagement between [Your Company Name] and [Client Name]. The
                Designer agrees to execute the project at [Project Site
                Address]...
              </p>
              <p className="mt-2 italic">
                1. Quotation Validity & Acceptance ...
              </p>
              <p className="mt-1">2. Payment Terms ...</p>
              <p className="mt-1">3. Project Scope ...</p>

              {/* Final Button inside terms box */}
              <div className="mt-6 text-center">
                <Button
                  color="red"
                  size="md"
                  variant="custom"
                  className="bg-red-700 hover:bg-red-800 text-white"
                  onClick={handleFinalAction}
                >
                  {isHuelip ? "Sign Contract" : "Start Project"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuoteSummary;

// import React, { useState } from "react";
// import { FaEdit, FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { FiFilter } from "react-icons/fi";
// import Button from "../../../components/Button";
// import { useNavigate } from "react-router-dom";

// const mockData = [
//   {
//     id: 1,
//     space: "Design & Consultation",
//     workPackages: 5,
//     items: 5,
//     amount: 150000,
//     tax: 27000,
//   },
//   {
//     id: 2,
//     space: "Bedroom 1",
//     workPackages: 16,
//     items: 18,
//     amount: 180000,
//     tax: 32000,
//   },
//   {
//     id: 3,
//     space: "Master Bedroom",
//     workPackages: 23,
//     items: 8,
//     amount: 300000,
//     tax: 54000,
//   },
//   {
//     id: 4,
//     space: "Master Bedroom Toilet",
//     workPackages: 18,
//     items: 22,
//     amount: 200000,
//     tax: 36000,
//   },
//   {
//     id: 5,
//     space: "Living Room",
//     workPackages: 15,
//     items: 10,
//     amount: 800000,
//     tax: 144000,
//   },
//   {
//     id: 6,
//     space: "Kitchen",
//     workPackages: 19,
//     items: 8,
//     amount: 450000,
//     tax: 81000,
//   },
//   {
//     id: 7,
//     space: "Powder Washroom",
//     workPackages: 12,
//     items: 14,
//     amount: 100000,
//     tax: 18000,
//   },
//   {
//     id: 8,
//     space: "Store Room",
//     workPackages: 9,
//     items: 4,
//     amount: 50000,
//     tax: 9000,
//   },
// ];

// const QuoteSummary = ({ activeSection, isHuelip }) => {
//   const navigate = useNavigate();
//   const [showTerms, setShowTerms] = useState(false);

//   const filteredData =
//     activeSection === "Summary"
//       ? mockData
//       : mockData.filter((row) => row.space === activeSection);

//   const totalAmount = filteredData.reduce((sum, row) => sum + row.amount, 0);
//   const totalTax = filteredData.reduce((sum, row) => sum + row.tax, 0);
//   const total = totalAmount + totalTax;

//   const formatCurrency = (amount) => `Rs ${amount.toLocaleString("en-IN")}/-`;

//   const handleFinalAction = () => {
//     if (isHuelip) {
//       navigate("/contract");
//     } else {
//       navigate("/projects");
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
//       {/* Table */}
//       <table className="min-w-full text-sm text-left">
//         <thead>
//           <tr className="border-b font-semibold">
//             <th className="py-2 px-2">
//               <FiFilter />
//             </th>
//             <th className="py-2 px-2">Space</th>
//             <th className="py-2 px-2">Work Packages</th>
//             <th className="py-2 px-2">Items</th>
//             <th className="py-2 px-2">Amount</th>
//             <th className="py-2 px-2">Tax</th>
//             <th className="py-2 px-2">Total</th>
//             <th className="py-2 px-2"></th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.map((row, index) => (
//             <tr key={row.id} className="border-b">
//               <td className="py-2 px-2">{index + 1}</td>
//               <td className="py-2 px-2">{row.space}</td>
//               <td className="py-2 px-2">{row.workPackages}</td>
//               <td className="py-2 px-2">{row.items}</td>
//               <td className="py-2 px-2">{formatCurrency(row.amount)}</td>
//               <td className="py-2 px-2">{formatCurrency(row.tax)}</td>
//               <td className="py-2 px-2">
//                 {formatCurrency(row.amount + row.tax)}
//               </td>
//               <td className="py-2 px-2 text-red-700 hover:cursor-pointer">
//                 <FaEdit />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Totals Row */}
//       <div className="flex justify-end mt-4 text-sm font-semibold">
//         <div className="flex flex-col items-end space-y-1">
//           <div>Amount: {formatCurrency(totalAmount)}</div>
//           <div>Tax: {formatCurrency(totalTax)}</div>
//           <div className="text-lg mt-1">
//             Total:{" "}
//             <span className="bg-red-700 text-white px-4 py-1 rounded ml-2">
//               {formatCurrency(total)}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Terms & Conditions */}
//       {activeSection === "Summary" && (
//         <div className="mt-6">
//           <Button
//             color="red"
//             variant="custom"
//             size="md"
//             className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white"
//             onClick={() => setShowTerms((prev) => !prev)}
//           >
//             Terms & Conditions
//             {showTerms ? <FaChevronUp /> : <FaChevronDown />}
//           </Button>
//           {showTerms && (
//             <div className="mt-3 text-xs text-gray-700 bg-gray-50 p-4 rounded shadow-inner">
//               <p className="font-semibold mb-2 uppercase">
//                 Terms and Conditions for Interior Design & Execution Services
//               </p>
//               <p>
//                 This document outlines the terms and conditions governing the
//                 engagement between [Your Company Name] and [Client Name]. The
//                 Designer agrees to execute the project at [Project Site
//                 Address]...
//               </p>
//               <p className="mt-2 italic">
//                 1. Quotation Validity & Acceptance ...
//               </p>
//               <p className="mt-1">2. Payment Terms ...</p>
//               <p className="mt-1">3. Project Scope ...</p>
//             </div>
//           )}

//           {/* Final Action Button */}
//           <div className="mt-6 text-center">
//             <Button
//               color="red"
//               size="md"
//               variant="custom"
//               className="bg-red-700 hover:bg-red-800 text-white"
//               onClick={handleFinalAction}
//             >
//               {isHuelip ? "Sign Contract" : "Start Project"}
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuoteSummary;
