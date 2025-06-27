import React, { useState } from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import { FaEye, FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Task = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 8;

  const dummyData = Array.from({ length: 32 }, (_, i) => ({
    id: i + 1,
    roomId: 100 + (i % 5),
    roomType: "Living room",
    assignedTo: "Bob",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaUHsPZUE06fBao0uCgqqyWPzD2X5K20HQsg&s",
    description: "Lorem Ipsum is simply dummy text of the printing industry.",
    workDone: "15% Done",
    unit: "$4500",
    area: "200 * 200",
  }));

  const [currentPage, setCurrentPage] = useState(1);
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

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Task Management"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="p-6 flex-1 flex flex-col gap-4">
          {/* Card */}
          <div className="bg-white rounded-xl shadow p-4 flex-1 flex flex-col">
            {/* Top Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 w-full">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Working Progress</span>
                <input type="range" className="w-48" />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search"
                    className="border rounded-xl px-3 py-1 w-full pr-9 text-sm"
                  />
                  <FaSearch className="absolute right-3 top-2.5 text-gray-500 text-sm" />
                </div>

                <button
                  className="flex items-center justify-center gap-2 border border-gray-400 text-gray-600 px-3 py-1 rounded-xl text-sm w-full sm:w-64"
                  onClick={() => navigate("/taskform")}
                >
                  Add New
                  <FaPlus className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Table Section */}
            <div className="flex-1 overflow-x-auto max-h-[60vh]">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-2 border">Room ID</th>
                    <th className="p-2 border">Room Type</th>
                    <th className="p-2 border">Assigned To</th>
                    <th className="p-2 border">Image</th>
                    <th className="p-2 border">Room Description</th>
                    <th className="p-2 border">Work Done</th>
                    <th className="p-2 border">Unit</th>
                    <th className="p-2 border">Area in Sq ft</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="p-2 border">{row.roomId}</td>
                      <td className="p-2 border">{row.roomType}</td>
                      <td className="p-2 border">{row.assignedTo}</td>
                      <td className="p-2 border">
                        <img
                          src={row.image}
                          alt="room"
                          className="w-10 h-10 object-cover rounded"
                        />
                      </td>
                      <td className="p-2 border">{row.description}</td>
                      <td className="p-2 border">{row.workDone}</td>
                      <td className="p-2 border">{row.unit}</td>
                      <td className="p-2 border">{row.area}</td>
                      <td className="p-2 border">
                        <div className="flex gap-2">
                          <FaEye title="View" className="cursor-pointer" />
                          <FaEdit
                            title="Edit"
                            className="text-purple-500 cursor-pointer"
                          />
                          <FaTrash
                            title="Delete"
                            className="text-red-500 cursor-pointer"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

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

export default Task;

// import React, { useState } from "react";
// import SideBar from "../../components/SideBar";
// import Header from "../../components/Header";
// import { FaEye, FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const Task = () => {
//    const [sidebarOpen, setSidebarOpen] = useState(false);
//   const navigate = useNavigate();
//   const itemsPerPage = 8;
//   const dummyData = Array.from({ length: 32 }, (_, i) => ({
//     id: i + 1,
//     roomId: 100 + (i % 5),
//     roomType: "Living room",
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaUHsPZUE06fBao0uCgqqyWPzD2X5K20HQsg&s",
//     description: "Lorem Ipsum is simply dummy text of the printing industry.",
//     workDone: "15% Done",
//     unit: "$4500",
//     area: "200 * 200",
//   }));

//   const [currentPage, setCurrentPage] = useState(1);
//   const totalPages = Math.ceil(dummyData.length / itemsPerPage);

//   const paginatedData = dummyData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };

//   return (<div className="flex h-screen overflow-hidden">
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
//             <div className="flex justify-between items-center mb-4 flex-wrap gap-6">
//               <div className="flex items-center gap-3">
//                 <span className="text-sm font-medium">Working Progress</span>
//                 <input type="range" className="w-48" />
//               </div>

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
//                   onClick={() => navigate("/dashboard/taskform")}
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
//                     <th className="p-2 border">Room ID</th>
//                     <th className="p-2 border">Room Type</th>
//                     <th className="p-2 border">Image</th>
//                     <th className="p-2 border">Room Description</th>
//                     <th className="p-2 border">Work Done</th>
//                     <th className="p-2 border">Unit</th>
//                     <th className="p-2 border">Area in Sq ft</th>
//                     <th className="p-2 border">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedData.map((row) => (
//                     <tr key={row.id} className="hover:bg-gray-50">
//                       <td className="p-2 border">{row.roomId}</td>
//                       <td className="p-2 border">{row.roomType}</td>
//                       <td className="p-2 border">
//                         <img
//                           src={row.image}
//                           alt="room"
//                           className="w-10 h-10 object-cover rounded"
//                         />
//                       </td>
//                       <td className="p-2 border">{row.description}</td>
//                       <td className="p-2 border">{row.workDone}</td>
//                       <td className="p-2 border">{row.unit}</td>
//                       <td className="p-2 border">{row.area}</td>
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

// export default Task;
