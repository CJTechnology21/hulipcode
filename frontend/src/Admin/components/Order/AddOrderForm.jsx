import React, { useState } from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import { FaEye, FaEdit, FaTrash, FaSearch,  } from "react-icons/fa";


function AddOrderForm() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const itemsPerPage = 8;
  const dummyData = Array.from({ length: 32 }, (_, i) => ({
    id: i + 1,
    itemName: "Rohan",
    itemDetails: "Room C wall color",
    itemqty: 10,
    uom: "sqft",
    price: "100",
    GST: "18%",
    amount: "codyfisher",
    image:
      "https://media.designcafe.com/wp-content/uploads/2023/04/03120224/space-saving-design-solutions-in-hyderabad-with-tv-unit-and-mandir.jpg",
  }));

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(dummyData.length / itemsPerPage);

  const filteredData = dummyData.filter((item) =>
    item.itemDetails.toLowerCase().includes(search.toLowerCase())
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
          title="Lead Management"
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
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Vendor Dropdown */}
                  <select className="border border-gray-400 text-gray-600 px-3 py-1 rounded-xl text-sm w-full sm:w-auto sm:min-w-[100px]">
                    <option value="">Select Vendor</option>
                    <option value="vendor1">Vendor 1</option>
                    <option value="vendor2">Vendor 2</option>
                    <option value="vendor3">Vendor 3</option>
                  </select>

                  {/* Order Type Dropdown */}
                  <select className="border border-gray-400 text-gray-600 px-3 py-1 rounded-xl text-sm w-full sm:w-auto sm:min-w-[100px]">
                    <option value="">Select Order Type</option>
                    <option value="type1">Type 1</option>
                    <option value="type2">Type 2</option>
                    <option value="type3">Type 3</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Table Section */}
            <div className="flex-1 overflow-y-auto max-h-[60vh]">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-2 border">Item Name</th>
                    <th className="p-2 border"> Item Image</th>
                    <th className="p-2 border">Item Details</th>
                    <th className="p-2 border">Item Qty</th>
                    <th className="p-2 border">UOM</th>
                    <th className="p-2 border">Price</th>
                    <th className="p-2 border">GST</th>
                    <th className="p-2 border">Amount</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="p-2 border">{row.itemName}</td>
                      <td className="p-2 border">
                        <img
                          src={row.image}
                          alt="task"
                          className="w-10 h-10 object-cover rounded"
                        />
                      </td>
                      <td className="p-2 border">{row.itemDetails}</td>
                      <td className="p-2 border">{row.itemqty}</td>

                      <td className="p-2 border">{row.uom}</td>
                      <td className="p-2 border">{row.price}</td>
                      <td className="p-2 border">{row.GST}</td>
                      <td className="p-2 border">{row.amount}</td>
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

export default AddOrderForm;
