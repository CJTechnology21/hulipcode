
import { useState } from "react";
import SideBar from "../SideBar";
import Header from "../Header";
import { FaEye, FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function BasicDetails() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const handleView = (project) => {
    navigate(`/project/${project.projectId}`, { state: { project } });
  };
  const handleEdit = (project) => {
    navigate(`/projectform/${project.projectId}`, {
      state: { project },
    });
  };
  const itemsPerPage = 8;
  const dummyData = Array.from({ length: 32 }, (_, i) => ({
    projectId: i + 1,
    projectName: "Project-k",
    projectType: "house",
    projectDescription:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum nulla culpa, repudiandae consectetur quia qui blanditiis ex velit harum sapiente.",
    budget: "12,00,000",
    location: "all sites",
    buildingYear: "2024",
    projectDuration: "6m",
    projectsize: "100",
    credit: "100",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
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
          title="Basid Details"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <div className="p-6 flex-1 flex flex-col gap-4">
          {/* Card Container */}
          <div className="bg-white rounded-xl shadow p-4 flex-1 flex flex-col">
            {/* Top Controls */}
            <div className="flex justify-between items-center mb-4 flex-wrap gap-6">
              <div className="flex items-center gap-3"></div>

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
                  onClick={() => navigate("/projectform")}
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
                    <th className="p-2 border">PROJECT ID</th>
                    <th className="p-2 border">PROJECT NAME</th>
                    <th className="p-2 border">PROJECT TYPE</th>
                    <th className="p-2 border"> DESCRIPTION</th>
                    <th className="p-2 border">IMAGE</th>
                    <th className="p-2 border">BUDGET</th>
                    <th className="p-2 border">LOCATION</th>
                    <th className="p-2 border">BUILDING YEAR</th>
                    <th className="p-2 border">PROJECT DURATION</th>
                    <th className="p-2 border">PROJECT SIZE</th>
                    <th className="p-2 border">CREDITS</th>
                    <th className="p-2 border">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row) => (
                    <tr key={row.projectId} className="hover:bg-gray-50">
                      <td className="p-4 border">{row.projectId}</td>
                      <td className="p-2 border">{row.projectName}</td>
                      <td className="p-2 border">{row.projectType}</td>
                      <td className="p-2 border">{row.projectDescription}</td>
                      <td className="p-2 border">
                        <img
                          src={row.image}
                          alt="task"
                          className="w-10 h-10 object-cover rounded"
                        />
                      </td>
                      <td className="p-2 border">{row.budget}</td>
                      <td className="p-2 border">{row.location}</td>
                      <td className="p-2 border">{row.buildingYear}</td>
                      <td className="p-2 border">{row.projectDuration}</td>
                      <td className="p-2 border">{row.projectsize}</td>
                      <td className="p-2 border">{row.credit}</td>
                      <td className="p-6 flex gap-2 items-center justify-center">
                        {/* <FaEye title="View" className="cursor-pointer" /> */}
                        <FaEye
                          title="View"
                          className="cursor-pointer text-blue-500"
                          onClick={() => handleView(row)}
                        />
                        <FaEdit
                          title="Edit"
                           onClick={() => handleEdit(row)}
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

export default BasicDetails;
