import { useState } from "react";
import Header from "../Header";
import SideBar from "../SideBar";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaEye, FaPlus, FaSearch, FaTrash } from "react-icons/fa";

function Product() {
   const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 8;

  // Dummy data with unique ID
  const dummyData = Array.from({ length: 32 }, (_, i) => ({
    id: i + 1,
    productName: "Drum",
    productDetails: "Room C wall color",
    rate: "5",
    Unit: "10",
    GST: "10",
  
  }));

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(dummyData.length / itemsPerPage);

  const filteredData = dummyData.filter((item) =>
    item.productDetails.toLowerCase().includes(search.toLowerCase())
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
          title="Product"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="p-6 flex-1 flex flex-col gap-4">
          {/* Card Container */}
          <div className="bg-white rounded-xl shadow p-4 flex-1 flex flex-col">
            {/* Top Controls */}
            <div className="flex justify-end items-center mb-4 flex-wrap gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 w-full sm:w-auto">
                {/* Search */}
                <div className="relative w-full sm:w-64 mb-2 sm:mb-0">
                  <input
                    type="text"
                    placeholder="Search"
                    className="border rounded-xl px-3 py-1 w-full pr-9 text-sm"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <FaSearch className="absolute right-3 top-2.5 text-gray-500 text-sm" />
                </div>

                {/* Add New Button */}
                <button
                  className="flex items-center justify-center gap-2 border border-gray-400 text-gray-600 px-3 py-1 rounded-xl text-sm w-full sm:w-auto sm:min-w-[100px]"
                  onClick={() => navigate("/productform")}
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
                    <th className="p-2 border font-fredoka">Product Name</th>
                    <th className="p-2 border font-fredoka">Product Details</th>
                    <th className="p-2 border font-fredoka">Rate</th>
                    <th className="p-2 border font-fredoka">Units</th>
                    <th className="p-2 border font-fredoka">GST</th>
                    <th className="p-2 border font-fredoka">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="p-2 border font-fredoka">{row.productName}</td>
                      <td className="p-2 border font-fredoka">{row.productDetails}</td>
                      <td className="p-2 border font-fredoka">{row.rate}</td>
                      <td className="p-2 border font-fredoka">{row.Unit}</td>
                      <td className="p-2 border font-fredoka">{row.GST}</td>
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
               <div className="text-right mt-4 text-sm space-y-1">
                    <p className="font-fredoka">Subtotal: 1,20,000</p>
                    <p className="font-fredoka">GST: 1,000</p>
                    <p className="font-bold font-fredoka">Total: 1,21,000</p>
                  </div>
                </div>
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
                <span className="hidden sm:inline font-fredoka">Next &gt;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
   
  );
}

export default Product;
