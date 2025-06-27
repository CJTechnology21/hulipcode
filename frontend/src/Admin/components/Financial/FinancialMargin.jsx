
import React, { useState } from "react";
import Header from "../Header";
import SideBar from "../SideBar";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaFileAlt,
  FaSearch,
  FaCheckCircle,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function FinancialMargin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const navigate = useNavigate();

  const transactions = [
    {
      createdOn: "12 feb 2024",
      date: "12 feb 2024",
      vendor: "Vendor name",
      transaction: "Paid to Vendor",
      amount: -20000,
    },
    {
      createdOn: "12 feb 2024",
      date: "12 feb 2024",
      vendor: "Vendor name",
      transaction: "Received from Client",
      amount: 40000,
    },
  ];

  const repeatedTransactions = [
    ...Array(5).fill(transactions[0]),
    ...Array(5).fill(transactions[1]),
  ];

  const filteredTransactions = repeatedTransactions.filter((txn) => {
    const matchesSearch =
      txn.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.transaction.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPayment =
      paymentType === ""
        ? true
        : paymentType === "paid"
        ? txn.amount < 0
        : txn.amount > 0;

    return matchesSearch && matchesPayment;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:block`}
      >
        <SideBar />
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Financial Margin"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 font-fredoka">
            {/* Margin Card */}
            <div className="bg-white border border-gray-300 rounded-xl p-4 shadow flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col gap-2 w-full md:border-r md:border-gray-300 md:pr-4">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <div>
                    <p className="text-sm font-semibold">Quotes Approved</p>
                    <p className="text-gray-600 text-sm">2,00,000 RS</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <div>
                    <p className="text-sm font-semibold">Orders Approved</p>
                    <p className="text-gray-600 text-sm">2,00,000 RS</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center w-full">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <p className="text-sm font-semibold">Margin</p>
                </div>
                <p className="text-2xl font-bold text-gray-700 mt-1">
                  2,00,000 RS
                </p>
              </div>
            </div>

            {/* Cashflow Card */}
            <div className="bg-white border border-gray-300 rounded-xl p-4 shadow flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col gap-2 w-full md:border-r md:border-gray-300 md:pr-4">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <div>
                    <p className="text-sm font-semibold">Payment Received</p>
                    <p className="text-gray-600 text-sm">5,00,000 RS</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <div>
                    <p className="text-sm font-semibold">Payment Done</p>
                    <p className="text-gray-600 text-sm">2,00,000 RS</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center w-full">
                <div className="flex items-center gap-2">
                  <FaMoneyBillWave className="text-green-600" />
                  <p className="text-sm font-semibold">Cashflow</p>
                </div>
                <p className="text-2xl font-bold text-green-700 mt-1">
                  3,00,000 RS
                </p>
              </div>
            </div>
          </div>

          {/* Search + Filter + Button */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 border rounded-md w-60 mr-4"
              />
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">Payment</option>
                <option value="paid">Paid</option>
                <option value="received">Received</option>
              </select>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md" onClick={()=>navigate('/project/addfinancial')}>
              + New Record
            </button>
          </div>

          {/* Transaction Table */}
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full table-auto text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-600 font-medium">
                <tr>
                  <th className="px-4 py-3">CREATED ON</th>
                  <th className="px-4 py-3">DATE</th>
                  <th className="px-4 py-3">VENDOR</th>
                  <th className="px-4 py-3">TRANSACTION</th>
                  <th className="px-4 py-3">AMOUNT</th>
                  <th className="px-4 py-3">RECEIPT</th>
                  <th className="px-4 py-3">DETAILS</th>
                  <th className="px-4 py-3">ACTION</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {filteredTransactions.map((txn, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{txn.createdOn}</td>
                    <td className="px-4 py-2">{txn.date}</td>
                    <td className="px-4 py-2">{txn.vendor}</td>
                    <td className="px-4 py-2">{txn.transaction}</td>
                    <td className="px-4 py-2 font-semibold">
                      <span
                        className={`${
                          txn.amount < 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {txn.amount < 0 ? "-" : "+"}
                        {Math.abs(txn.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <FaFileAlt className="h-4 w-4 text-gray-600" />
                    </td>
                    <td className="px-4 py-2">
                      <FaSearch className="h-4 w-4 text-gray-600" />
                    </td>
                    <td className="px-4 py-2 flex space-x-2">
                      <FaEye className="h-4 w-4 text-blue-600 cursor-pointer" />
                      <FaEdit className="h-4 w-4 text-green-600 cursor-pointer" />
                      <FaTrash className="h-4 w-4 text-red-600 cursor-pointer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinancialMargin;
// import React, { useState } from "react";
// import Header from "../Header";
// import SideBar from "../SideBar";
// import {
//   FaEye,
//   FaEdit,
//   FaTrash,
//   FaFileAlt,
//   FaSearch,
//   FaCheckCircle,
//   FaMoneyBillWave,
// } from "react-icons/fa";

// function FinancialMargin() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const transactions = [
//     {
//       createdOn: "12 feb 2024",
//       date: "12 feb 2024",
//       vendor: "Vendor name",
//       transaction: "Paid to Vendor",
//       amount: -20000,
//     },
//     {
//       createdOn: "12 feb 2024",
//       date: "12 feb 2024",
//       vendor: "Vendor name",
//       transaction: "Received from Client",
//       amount: 40000,
//     },
//   ];

//   const repeatedTransactions = [
//     ...Array(5).fill(transactions[0]),
//     ...Array(5).fill(transactions[1]),
//   ];

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:relative md:block`}
//       >
//         <SideBar />
//       </div>

//       {/* Overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main content */}
//       <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
//         <Header
//           title="Financial Margin"
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />
//         <div className="p-6 space-y-6">
//           {/* Summary Cards */}
//           <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 font-fredoka">
//             {/* Margin Card */}
//             <div className="bg-white border border-gray-300 rounded-xl p-4 shadow flex flex-col md:flex-row justify-between items-center gap-4">
//               <div className="flex flex-col gap-2 w-full md:border-r md:border-gray-300 md:pr-4">
//                 <div className="flex items-center gap-2">
//                   <FaCheckCircle className="text-green-500" />
//                   <div>
//                     <p className="text-sm font-semibold">Quotes Approved</p>
//                     <p className="text-gray-600 text-sm">2,00,000 RS</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <FaCheckCircle className="text-green-500" />
//                   <div>
//                     <p className="text-sm font-semibold">Orders Approved</p>
//                     <p className="text-gray-600 text-sm">2,00,000 RS</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex flex-col items-center justify-center w-full">
//                 <div className="flex items-center gap-2">
//                   <FaCheckCircle className="text-green-500" />
//                   <p className="text-sm font-semibold">Margin</p>
//                 </div>
//                 <p className="text-2xl font-bold text-gray-700 mt-1">
//                   2,00,000 RS
//                 </p>
//               </div>
//             </div>

//             {/* Cashflow Card */}
//             <div className="bg-white border border-gray-300 rounded-xl p-4 shadow flex flex-col md:flex-row justify-between items-center gap-4">
//               <div className="flex flex-col gap-2 w-full md:border-r md:border-gray-300 md:pr-4">
//                 <div className="flex items-center gap-2">
//                   <FaCheckCircle className="text-green-500" />
//                   <div>
//                     <p className="text-sm font-semibold">Payment Received</p>
//                     <p className="text-gray-600 text-sm">5,00,000 RS</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <FaCheckCircle className="text-green-500" />
//                   <div>
//                     <p className="text-sm font-semibold">Payment Done</p>
//                     <p className="text-gray-600 text-sm">2,00,000 RS</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex flex-col items-center justify-center w-full">
//                 <div className="flex items-center gap-2">
//                   <FaMoneyBillWave className="text-green-600" />
//                   <p className="text-sm font-semibold">Cashflow</p>
//                 </div>
//                 <p className="text-2xl font-bold text-green-700 mt-1">
//                   3,00,000 RS
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Search + Filter */}
//           <div className="flex justify-end items-center ">
//             <input
//               type="text"
//               placeholder="Search"
//               className="px-3 py-2 border rounded-md w-60 mr-4"
//             />
//             <select className="px-3 py-2 border rounded-md">
//               <option value="">Payment</option>
//               <option value="paid">Paid</option>
//               <option value="received">Received</option>
//             </select>
//           </div>

//           {/* Transaction Table */}
//           <div className="overflow-x-auto bg-white rounded-xl shadow">
//             <table className="min-w-full table-auto text-sm text-left border-collapse">
//               <thead className="bg-gray-100 text-gray-600 font-medium">
//                 <tr>
//                   <th className="px-4 py-3">CREATED ON</th>
//                   <th className="px-4 py-3">DATE</th>
//                   <th className="px-4 py-3">VENDOR</th>
//                   <th className="px-4 py-3">TRANSACTION</th>
//                   <th className="px-4 py-3">AMOUNT</th>
//                   <th className="px-4 py-3">RECEIPT</th>
//                   <th className="px-4 py-3">DETAILS</th>
//                   <th className="px-4 py-3">ACTION</th>
//                 </tr>
//               </thead>
//               <tbody className="text-gray-700">
//                 {repeatedTransactions.map((txn, index) => (
//                   <tr key={index} className="border-t">
//                     <td className="px-4 py-2">{txn.createdOn}</td>
//                     <td className="px-4 py-2">{txn.date}</td>
//                     <td className="px-4 py-2">{txn.vendor}</td>
//                     <td className="px-4 py-2">{txn.transaction}</td>
//                     <td className="px-4 py-2 font-semibold">
//                       <span
//                         className={`${
//                           txn.amount < 0 ? "text-red-600" : "text-green-600"
//                         }`}
//                       >
//                         {txn.amount < 0 ? "-" : "+"}
//                         {Math.abs(txn.amount).toLocaleString()}
//                       </span>
//                     </td>
//                     <td className="px-4 py-2">
//                       <FaFileAlt className="h-4 w-4 text-gray-600" />
//                     </td>
//                     <td className="px-4 py-2">
//                       <FaSearch className="h-4 w-4 text-gray-600" />
//                     </td>
//                     <td className="px-4 py-2 flex space-x-2">
//                       <FaEye className="h-4 w-4 text-blue-600 cursor-pointer" />
//                       <FaEdit className="h-4 w-4 text-green-600 cursor-pointer" />
//                       <FaTrash className="h-4 w-4 text-red-600 cursor-pointer" />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FinancialMargin;