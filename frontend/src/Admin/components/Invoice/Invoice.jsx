import { useState } from "react";
import SideBar from "../SideBar";
import Header from "../Header";
import { FaPlus, FaEye, FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Invoice() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const itemsPerPage = 8;
  const currentYear = new Date().getFullYear();

  const dummyData = Array.from({ length: 32 }, (_, i) => ({
    invoiceNo: `INV-${currentYear}-${String(i + 1).padStart(2, "0")}`,
    billedTo: "task-1",
    invoicedate: "10 Jan 2025",
    duedate: "10 Feb 2025",
    "tax in %": "18%",
    dueamount: 2590,
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

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Invoice"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <div className="p-6 flex-1 flex flex-col gap-4 font-fredoka">
          {/* Card Container */}
          <div className="bg-white rounded-xl shadow p-4 flex-1 flex flex-col">
            {/* Top Controls */}
            <div className="flex justify-between items-center mb-4 flex-wrap gap-6">
              <div className="flex items-center gap-3">
                {/* <span className="text-sm font-medium">Working Progress</span>
                <input type="range" className="w-48" /> */}
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
                  onClick={() => navigate("/addinvoice")}
                >
                  Add New Invoice
                  <FaPlus className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Table Section */}
            <div className="flex-1 overflow-y-auto max-h-[60vh]">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-2 border">INVOICE NO.</th>
                    <th className="p-2 border">BILLED TO.</th>
                    <th className="p-2 border">INVOICE DATE</th>
                    <th className="p-2 border"> DUE DATE</th>
                    <th className="p-2 border">TAS IN %</th>
                    <th className="p-2 border">DUE IN AMOUNT</th>
                    <th className="p-2 border">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row) => (
                    <tr key={row.invoiceNo} className="hover:bg-gray-50">
                      <td className="p-4 border">{row.invoiceNo}</td>
                      <td className="p-2 border">{row.billedTo}</td>
                      <td className="p-2 border">{row.invoicedate}</td>
                      <td className="p-2 border">{row.duedate}</td>
                      <td className="p-2 border">{row["tax in %"]}</td>
                      <td className="p-2 border">{row.dueamount}</td>
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
    </div>
  );
}

export default Invoice;
