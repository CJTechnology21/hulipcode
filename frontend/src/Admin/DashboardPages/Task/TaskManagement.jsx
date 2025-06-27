import React, { useState } from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
  FaClipboard,
  FaFolder,
  FaUser,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";

const TaskManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const itemsPerPage = 8;
  const dummyData = Array.from({ length: 32 }, (_, i) => ({
    userId: i + 1,
    taskname: "task-1",
    projectname: "Living room",
    assignedby: "ABC dealers",
    duedate: "10 Feb 2025",
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
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
          title="Task Management"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <div className="p-6 flex-1 flex flex-col gap-4">
          {/* Card Container */}
          <div className="bg-white rounded-xl shadow p-4 flex-1 flex flex-col">
            {/* Top Controls */}
            <div className="flex justify-between items-center mb-4 flex-wrap gap-6">
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
                  onClick={() => setShowModal(true)}
                >
                  Add New
                  <FaPlus className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Table Section */}
            <div className="flex-1 overflow-y-auto max-h-[60vh]">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-2 border">USER ID</th>
                    <th className="p-2 border">TASK NAME</th>
                    <th className="p-2 border">PROJECT NAME</th>
                    <th className="p-2 border">ASSIGNED BY</th>
                    <th className="p-2 border">DUE DATE</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row) => (
                    <tr key={row.userId} className="hover:bg-gray-50">
                      <td className="p-4 border">{row.userId}</td>
                      <td className="p-2 border">{row.taskname}</td>
                      <td className="p-2 border">{row.projectname}</td>
                      <td className="p-2 border">{row.assignedby}</td>
                      <td className="p-2 border">{row.duedate}</td>
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

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[400px] max-w-full relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-blue-600">Add Task</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-blue-600 text-xl font-bold"
              >
                <FaTimes />
              </button>
            </div>

            <form className="flex flex-col gap-3 text-sm">
              <div className="flex items-center border rounded px-3 py-2">
                <FaClipboard className="text-blue-600 mr-2" />
                <input
                  type="text"
                  placeholder="Task Name"
                  className="w-full outline-none bg-transparent"
                />
              </div>

              <div className="flex items-center border rounded px-3 py-2">
                <FaFolder className="text-blue-600 mr-2" />
                <select className="w-full outline-none bg-transparent">
                  <option value="">Project</option>
                  <option value="project-a">Project A</option>
                  <option value="project-b">Project B</option>
                </select>
              </div>

              <div className="flex items-center border rounded px-3 py-2">
                <FaUser className="text-blue-600 mr-2" />
                <select className="w-full outline-none bg-transparent">
                  <option value="">Assigned by</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center border rounded px-3 py-2">
                <FaCalendarAlt className="text-blue-600 mr-2" />
                <input
                  type="date"
                  className="w-full outline-none bg-transparent"
                />
              </div>

              <button
                type="submit"
                className="mt-3 bg-blue-600 text-white font-semibold py-2 rounded"
              >
                ADD
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;

// import React, { useState } from "react";
// import SideBar from "../../components/SideBar";
// import Header from "../../components/Header";
// import { FaEye, FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";
// // import { useNavigate } from "react-router-dom";
// import {
//   FaClipboard,
//   FaFolder,
//   FaUser,
//   FaCalendarAlt,
//   FaTimes,
// } from "react-icons/fa";

// const TaskManagement = () => {
//   // const navigate = useNavigate();
//    const [sidebarOpen, setSidebarOpen] = useState(false);
//   const itemsPerPage = 8;
//   const dummyData = Array.from({ length: 32 }, (_, i) => ({
//     userId: i + 1,
//     taskname: "task-1",
//     projectname: "Living room",
//     assignedby: "ABC dealers",
//     duedate: "10 Feb 2025",
//   }));

//   const [currentPage, setCurrentPage] = useState(1);
//   const [showModal, setShowModal] = useState(false);
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
//                   onClick={() => setShowModal(true)}
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
//           <div className="flex justify-between items-center mt-4 flex-wrap">
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               className="border bg-white px-4 py-1 rounded disabled:opacity-50"
//               disabled={currentPage === 1}
//             >
//               &lt; Back
//             </button>
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
//                 className="border bg-white px-4 py-1 rounded disabled:opacity-50"
//                 disabled={currentPage === totalPages}
//               >
//                 Next &gt;
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-xl shadow-lg w-[400px] max-w-full relative">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-bold text-blue-600">Add Task</h2>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="text-blue-600 text-xl font-bold"
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             <form className="flex flex-col gap-3 text-sm">
//               {/* Task Name */}
//               <div className="flex items-center border rounded px-3 py-2">
//                 <FaClipboard className="text-blue-600 mr-2" />
//                 <input
//                   type="text"
//                   placeholder="Task Name"
//                   className="w-full outline-none bg-transparent"
//                 />
//               </div>

//               {/* Project */}
//               <div className="flex items-center border rounded px-3 py-2">
//                 <FaFolder className="text-blue-600 mr-2" />
//                 <select className="w-full outline-none bg-transparent">
//                   <option value="">Project</option>
//                   <option value="project-a">Project A</option>
//                   <option value="project-b">Project B</option>
//                 </select>
//               </div>

//               {/* Assigned by */}
//               <div className="flex items-center border rounded px-3 py-2">
//                 <FaUser className="text-blue-600 mr-2" />
//                 <select className="w-full outline-none bg-transparent">
//                   <option value="">Assigned by</option>
//                   <option value="manager">Manager</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>

//               {/* Due Date */}
//               <div className="flex items-center border rounded px-3 py-2">
//                 <FaCalendarAlt className="text-blue-600 mr-2" />
//                 <input
//                   type="date"
//                   className="w-full outline-none bg-transparent"
//                 />
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 className="mt-3 bg-blue-600 text-white font-semibold py-2 rounded"
//               >
//                 ADD
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TaskManagement;
