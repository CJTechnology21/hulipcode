import React, { useState } from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import { FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const Tasklogs = () => {
   const [sidebarOpen, setSidebarOpen] = useState(false);
  const itemsPerPage = 8;

  const dummyData = Array.from({ length: 32 }, (_, i) => ({
    id: i + 1,
    startDate: "12, Jan 2025",
    endDate: "12, Feb 2025",
    completedBy: "Rohan",
    description: "Room X wall colour Completed",
    workDone: "15% Done",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaUHsPZUE06fBao0uCgqqyWPzD2X5K20HQsg&s",
  }));

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(dummyData.length / itemsPerPage);

  const filteredData = dummyData.filter((item) =>
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filteredData.slice(
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
          title="TaskLogs"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <div className="p-6 flex-1 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow p-4 flex-1 flex flex-col">
            {/* Top Controls */}
            <div className="flex justify-end items-center mb-4 flex-wrap gap-4">
              {/* <span className="text-lg font-medium">Task Logs</span> */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-xl px-3 py-1 w-64 pr-9 text-sm"
                />
                <FaSearch className="absolute right-3 top-2.5 text-gray-500 text-sm" />
              </div>
            </div>

            {/* Table Section */}
            <div className="flex-1 overflow-y-auto max-h-[60vh]">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-2 border">Task Starting Date</th>
                    <th className="p-2 border">Task Ending Date</th>
                    <th className="p-2 border">Task Image</th>
                    <th className="p-2 border">Completed By</th>
                    <th className="p-2 border">Task Completed Description</th>
                    <th className="p-2 border">Work Done</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="p-2 border">{row.startDate}</td>
                      <td className="p-2 border">{row.endDate}</td>
                      <td className="p-2 border">
                        <img
                          src={row.image}
                          alt="task"
                          className="w-10 h-10 object-cover rounded"
                        />
                      </td>
                      <td className="p-2 border">{row.completedBy}</td>
                      <td className="p-2 border">{row.description}</td>
                      <td className="p-2 border">{row.workDone}</td>
                      <td className="p-2 border flex gap-2 items-center">
                        <FaEye title="View" className="cursor-pointer" />
                        <FaEdit title="Edit" className="text-purple-500 cursor-pointer" />
                        <FaTrash title="Delete" className="text-red-500 cursor-pointer" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
           
            </div> <div className="flex justify-between items-center mt-4 flex-wrap">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="border bg-white px-4 py-1 rounded disabled:opacity-50"
                disabled={currentPage === 1}
              >
                &lt; Back
              </button>
              <div className="flex gap-2">
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
                  className="border bg-white px-4 py-1 rounded disabled:opacity-50"
                  disabled={currentPage === totalPages}
                >
                  Next &gt;
                </button>
              </div>
              
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasklogs;
