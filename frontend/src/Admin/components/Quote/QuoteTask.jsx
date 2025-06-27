import { useState } from "react";
import Header from "../Header";
import SideBar from "../SideBar";
import { FaEdit, FaEye, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function QuoteTask() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  // Dummy data
  const dummyData = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    task: "Task X",
    detail: "Lorem Ipsum is simply dummy text of the printing",
    rate: "123",
    unit: "10,000",
    gst: "18%",
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

      {/* Mobile Overlay */}
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

        <div className="p-4 sm:p-6 flex-1 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow p-4 flex flex-col">
            {/* Top controls */}
            <div className="flex justify-end items-center mb-4 flex-wrap gap-4">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search"
                  className="border rounded-xl px-3 py-2 w-full pr-9 text-sm"
                />
                <FaSearch className="absolute right-3 top-3 text-gray-500 text-sm" />
              </div>

              <button className="flex items-center justify-center gap-2 border border-gray-400 text-gray-600 px-4 py-2 rounded-xl text-sm w-full sm:w-auto"
              onClick={()=>navigate('/quoteform')}>
                Add New <FaPlus />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-[60vh]">
              <table className="min-w-[800px] w-full border text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-3 border">TASK</th>
                    <th className="p-3 border">TASK DETAIL</th>
                    <th className="p-3 border">RATE</th>
                    <th className="p-3 border">UNIT</th>
                    <th className="p-3 border">GST</th>
                    <th className="p-3 border">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="p-3 border">{row.task}</td>
                      <td className="p-3 border">{row.detail}</td>
                      <td className="p-3 border">{row.rate}</td>
                      <td className="p-3 border">{row.unit}</td>
                      <td className="p-3 border">{row.gst}</td>
                      <td className="p-3 border">
                        <div className="flex gap-2">
                          <FaEye className="cursor-pointer" title="View" />
                          <FaEdit
                            className="text-purple-500 cursor-pointer"
                            title="Edit"
                          />
                          <FaTrash
                            className="text-red-500 cursor-pointer"
                            title="Delete"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="flex justify-end mt-4 text-sm space-y-1 flex-col items-end">
              <p>Subtotal: 1,20,000</p>
              <p>GST: 1,000</p>
              <p className="font-bold">Total: 1,21,000</p>
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
}

export default QuoteTask;

// import { useState } from "react";
// import Header from "../Header";
// import SideBar from "../SideBar";
// import { FaEdit, FaEye, FaPlus, FaSearch, FaTrash } from "react-icons/fa";

// function QuoteTask() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const itemsPerPage = 8;
//   const dummyData = Array.from({ length: 32 }, (_, i) => ({
//     userId: i + 1,
//     taskname: "task-1",
//     projectname: "Living room",
//     assignedby: "ABC dealers",
//     duedate: "10 Feb 2025",
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
//           title="Task Management"
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />
//         <div className="p-6 flex-1 flex flex-col gap-4">
//           {/* Card Container */}
//           <div className="bg-white rounded-xl shadow p-4 flex-1 flex flex-col">
//             {/* Top Controls */}
//             <div className="flex justify-between items-center mb-4 flex-wrap gap-6">
//               <div className="flex items-center gap-3">
//                 {/* <span className="text-sm font-medium">Working Progress</span>
//                 <input type="range" className="w-48" /> */}
//               </div>

//               <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//                 <div className="relative w-full sm:w-64">
//                   <input
//                     type="text"
//                     placeholder="Search"
//                     className="border rounded-xl px-3 py-1 w-full pr-9 text-sm"
//                   />
//                   <FaSearch className="absolute right-3 top-2.5 text-gray-500 text-sm" />
//                 </div>

//                 <button
//                   className="flex items-center justify-center gap-2 border border-gray-400 text-gray-600 px-3 py-1 rounded-xl text-sm w-full sm:w-64"
//                 //   onClick={() => setShowModal(true)}
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
//                     <th className="p-2 border">USER ID</th>
//                     <th className="p-2 border">TASK NAME</th>
//                     <th className="p-2 border">PROJECT NAME</th>
//                     <th className="p-2 border">ASSIGNED BY</th>
//                     <th className="p-2 border">DUE DATE</th>
//                     <th className="p-2 border">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedData.map((row) => (
//                     <tr key={row.userId} className="hover:bg-gray-50">
//                       <td className="p-4 border">{row.userId}</td>
//                       <td className="p-2 border">{row.taskname}</td>
//                       <td className="p-2 border">{row.projectname}</td>
//                       <td className="p-2 border">{row.assignedby}</td>
//                       <td className="p-2 border">{row.duedate}</td>
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

//           {/* Pagination */}
//           <div className="flex justify-between items-center mt-4 flex-wrap sm:flex-nowrap gap-4">
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               className="border bg-white px-4 py-1 rounded disabled:opacity-50 flex items-center"
//               disabled={currentPage === 1}
//             >
//               <span className="block sm:hidden">&lt;</span>
//               <span className="hidden sm:inline">&lt; Back</span>
//             </button>

//             <div className="flex flex-wrap gap-2">
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
//                 className="border bg-white px-4 py-1 rounded disabled:opacity-50 flex items-center"
//                 disabled={currentPage === totalPages}
//               >
//                 <span className="block sm:hidden">&gt;</span>
//                 <span className="hidden sm:inline">Next &gt;</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default QuoteTask;
