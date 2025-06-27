import React, { useState } from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
  FaFileAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const VendorManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const dummyData = Array.from({ length: 32 }, (_, i) => ({
    id: i + 1,
    firmName: "Rohan",
    contractorName: "Alpesh",
    contractorPhone: "7894561230",
    firmEmail: "vendor12@gmail.com",
    firmAddress: "A1, Wolf drive",
    firmGST: "08 ABCDE9999F1Z8",
    firmPincode: "00-00-00",
    firmCity: "Atlanta, Georgia",
  }));

  const totalPages = Math.ceil(dummyData.length / itemsPerPage);

  const paginatedData = dummyData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Vendor Management"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="p-4 flex-1 flex flex-col gap-4">
          {/* Card Container */}
          <div className="bg-white rounded-xl shadow p-4 flex-1 flex flex-col">
            {/* Top Controls */}
            <div className="flex flex-col md:flex-row justify-end items-start md:items-center mb-4 gap-4 flex-wrap">
              <div className="w-full md:w-auto relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="border rounded-xl px-3 py-2 w-full md:w-64 pr-9 text-sm"
                />
                <FaSearch className="absolute right-3 top-3 text-gray-500 text-sm" />
              </div>

              <button
                className="flex items-center justify-center gap-2 border border-gray-400 text-gray-600 px-4 py-2 rounded-xl text-sm w-full md:w-auto"
                onClick={() => navigate("/vendormanagementform")}
              >
                Add New
                <FaPlus className="text-gray-600" />
              </button>
            </div>

            {/* Table Section */}
            <div className="flex-1 overflow-auto max-h-[60vh]">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-2 border">FIRM NAME</th>
                    <th className="p-2 border">CONTRACTOR NAME</th>
                    <th className="p-2 border">CONTRACTOR PHONE</th>
                    <th className="p-2 border">FIRM EMAIL ID</th>
                    <th className="p-2 border">FIRM ADDRESS</th>
                    <th className="p-2 border">FIRM GST DETAILS</th>
                    <th className="p-2 border">FIRM PINCODE</th>
                    <th className="p-2 border">FIRM CITY</th>
                    <th className="p-2 border">GST FILE</th>
                    <th className="p-2 border">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-gray-50">
                      <td className="p-2 border">{vendor.firmName}</td>
                      <td className="p-2 border">{vendor.contractorName}</td>
                      <td className="p-2 border">{vendor.contractorPhone}</td>
                      <td className="p-2 border">{vendor.firmEmail}</td>
                      <td className="p-2 border">{vendor.firmAddress}</td>
                      <td className="p-2 border">{vendor.firmGST}</td>
                      <td className="p-2 border">{vendor.firmPincode}</td>
                      <td className="p-2 border">{vendor.firmCity}</td>
                      <td className="p-2 border text-center">
                        <FaFileAlt className="text-gray-600 cursor-pointer inline" />
                      </td>
                      <td className="p-2 border flex gap-2 items-center">
                        <FaEye title="View" className="cursor-pointer" />
                        <FaEdit
                          title="Edit"
                          className="text-purple-500 cursor-pointer"
                        />
                        <FaTrash
                          title="Delete"
                          className="text-red-500 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Section */}
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 flex-wrap sm:flex-nowrap gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="border bg-white px-4 py-1 rounded disabled:opacity-50 flex items-center"
              disabled={currentPage === 1}
            >
              <span className="block sm:hidden">&lt;</span>
              <span className="hidden sm:inline">&lt; Back</span>
            </button>

            <div className="flex flex-wrap gap-2">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`border px-3 py-1 rounded ${
                    currentPage === idx + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="border bg-white px-4 py-1 rounded disabled:opacity-50 flex items-center"
                disabled={currentPage === totalPages}
              >
                <span className="block sm:hidden">&gt;</span>
                <span className="hidden sm:inline">Next &gt;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorManagement;
// import React, { useState } from "react";
// import SideBar from "../../components/SideBar";
// import Header from "../../components/Header";
// import {
//   FaEye,
//   FaEdit,
//   FaTrash,
//   FaSearch,
//   FaPlus,
//   FaFileAlt,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const VendorManagement = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const itemsPerPage = 8;
//   const [currentPage, setCurrentPage] = useState(1);
//   const navigate = useNavigate();

//   const dummyData = Array.from({ length: 32 }, (_, i) => ({
//     id: i + 1,
//     firmName: "Rohan",
//     contractorName: "Alpesh",
//     contractorPhone: "7894561230",
//     firmEmail: "vendor12@gmail.com",
//     firmAddress: "A1, Wolf drive",
//     firmGST: "08 ABCDE9999F1Z8",
//     firmPincode: "00-00-00",
//     firmCity: "Atlanta, Georgia",
//   }));

//   const totalPages = Math.ceil(dummyData.length / itemsPerPage);

//   const paginatedData = dummyData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };

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

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main content */}
//       <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
//         <Header
//           title="Dashboard"
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />

//         <div className="p-6 flex-1 flex flex-col gap-4">
//           {/* Card Container */}
//           <div className="bg-white rounded-xl shadow p-4 flex-1 flex flex-col">
//             {/* Top Controls */}
//             <div className="flex justify-end items-center mb-4 flex-wrap gap-6">
//               {/* <h2 className="text-xl font-semibold">Vendor Management</h2> */}
//               <div className="flex gap-2">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Search"
//                     className="border rounded-xl px-3 py-1 w-64 pr-9 text-sm"
//                   />
//                   <FaSearch className="absolute right-3 top-2.5 text-gray-500 text-sm" />
//                 </div>
//                 <button
//                   className="flex items-center gap-2 border border-gray-400 text-gray-600 px-3 py-1 rounded-xl text-sm"
//                   onClick={() => navigate("/vendormanagementform")}
//                 >
//                   Add New
//                   <FaPlus className="text-gray-600" />
//                 </button>
//               </div>
//             </div>

//             {/* Table Section */}
//             <div className="flex-1 overflow-y-auto max-h-[60vh]">
//               <table className="min-w-full border text-sm">
//                 <thead className="bg-gray-100 text-left">
//                   <tr>
//                     <th className="p-2 border">FIRM NAME</th>
//                     <th className="p-2 border">CONTRACTOR NAME</th>
//                     <th className="p-2 border">CONTRACTOR PHONE</th>
//                     <th className="p-2 border">FIRM EMAIL ID</th>
//                     <th className="p-2 border">FIRM ADDRESS</th>
//                     <th className="p-2 border">FIRM GST DETAILS</th>
//                     <th className="p-2 border">FIRM PINCODE</th>
//                     <th className="p-2 border">FIRM CITY</th>
//                     <th className="p-2 border">GST FILE</th>
//                     <th className="p-2 border">ACTION</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedData.map((vendor) => (
//                     <tr key={vendor.id} className="hover:bg-gray-50">
//                       <td className="p-2 border">{vendor.firmName}</td>
//                       <td className="p-2 border">{vendor.contractorName}</td>
//                       <td className="p-2 border">{vendor.contractorPhone}</td>
//                       <td className="p-2 border">{vendor.firmEmail}</td>
//                       <td className="p-2 border">{vendor.firmAddress}</td>
//                       <td className="p-2 border">{vendor.firmGST}</td>
//                       <td className="p-2 border">{vendor.firmPincode}</td>
//                       <td className="p-2 border">{vendor.firmCity}</td>
//                       <td className="p-2 border text-center">
//                         <FaFileAlt className="text-gray-600 cursor-pointer inline" />
//                       </td>
//                       <td className="p-2 border flex gap-2 items-center">
//                         <FaEye title="View" className="cursor-pointer" />
//                         <FaEdit
//                           title="Edit"
//                           className="text-purple-500 cursor-pointer"
//                         />
//                         <FaTrash
//                           title="Delete"
//                           className="text-red-500 cursor-pointer"
//                         />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//           {/* Pagination Section */}
//           <div className="flex justify-between items-center mt-4 flex-wrap">
//             {/* Back Button - Aligned Left */}
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               className="border  bg-white px-4 py-1 rounded disabled:opacity-50"
//               disabled={currentPage === 1}
//             >
//               &lt; Back
//             </button>

//             {/* Page Numbers and Next - Aligned Right */}
//             <div className="flex gap-2">
//               {[...Array(totalPages)].map((_, idx) => (
//                 <button
//                   key={idx + 1}
//                   onClick={() => handlePageChange(idx + 1)}
//                   className={`border px-3 py-1 rounded ${
//                     currentPage === idx + 1
//                       ? "bg-blue-500 text-white"
//                       : "bg-white"
//                   }`}
//                 >
//                   {idx + 1}
//                 </button>
//               ))}
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 className="border  bg-white px-4 py-1 rounded disabled:opacity-50"
//                 disabled={currentPage === totalPages}
//               >
//                 Next &gt;
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VendorManagement;
