import { useState } from "react";
import SideBar from "../SideBar";
import Header from "../Header";
import { FaCheckCircle, FaFilter } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { PiSealCheckFill } from "react-icons/pi";
import allProjects from './projectsData'
function Projects() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const filteredProjects =
    activeTab === "protect"
      ? allProjects.filter((p) => p.protect)
      : allProjects;

  const getStatusColor = (status) => {
    switch (status) {
      case "EXECUTION IN PROGRESS":
        return "bg-green-500";
      case "SITE MEASUREMENTS":
        return "bg-yellow-400 text-black";
      case "DESIGNING IN PROCESS":
        return "bg-indigo-500";
      case "HOLD":
        return "bg-red-700";
      case "COMPLETED":
        return "bg-emerald-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-20 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
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
          title="Project Data"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="p-6 space-y-6">
          {/* Tab Header */}
          {/* Tab Header Section */}
          <div className="flex items-center justify-between border-b border-gray-300 px-4 py-2 bg-white">
            <div className="flex space-x-6 font-semibold text-sm">
              {/* All Projects Tab */}
              <div
                onClick={() => setActiveTab("all")}
                className={`flex items-center gap-2 pb-2 px-2 border-b-4 cursor-pointer transition-all duration-200 ${
                  activeTab === "all"
                    ? "border-red-600 text-black"
                    : "border-transparent text-gray-600"
                }`}
              >
                <span>All Projects</span>
                <span
                  className={`text-xs font-bold px-2 rounded ${
                    activeTab === "all"
                      ? "bg-red-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {allProjects.length}
                </span>
              </div>

              {/* Huelip Protect Tab */}
              <div
                onClick={() => setActiveTab("protect")}
                className={`flex items-center gap-2 pb-2 px-2 border-b-4 cursor-pointer transition-all duration-200 ${
                  activeTab === "protect"
                    ? "border-red-600 text-black"
                    : "border-transparent text-gray-600"
                }`}
              >
                <span>Huelip Protect</span>
                <span
                  className={`text-xs font-bold px-2 rounded ${
                    activeTab === "protect"
                      ? "bg-red-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {allProjects.filter((p) => p.protect).length}
                </span>
              </div>
            </div>

            {/* Add Project Button */}
            <button className="bg-red-700 hover:bg-red-800 text-white text-sm font-semibold px-4 py-2 rounded shadow">
              + Add Project
            </button>
          </div>
          {/* Table */}
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-200 text-black font-semibold uppercase text-xs">
                <tr>
                  <th className="p-3">
                    <FaFilter />
                  </th>
                  {[
                    "Project ID",
                    "Project Name",
                    "Client Name",
                    "City/ Area",
                  ].map((label, i) => (
                    <th key={i} className="p-3">
                      <input
                        type="text"
                        placeholder="Search"
                        className="bg-gray-300 w-full text-xs px-2 py-1 rounded placeholder-gray-500 focus:outline-none"
                      />
                    </th>
                  ))}
                  <th className="p-3">
                    <select className="bg-gray-300 w-full text-xs px-2 py-1 rounded">
                      <option>Select</option>
                    </select>
                  </th>
                  <th className="p-3">
                    <select className="bg-gray-300 w-full text-xs px-2 py-1 rounded">
                      <option>Select</option>
                    </select>
                  </th>
                  <th className="p-3 text-center">
                    <PiSealCheckFill className="text-red-700 text-xl mx-auto" />
                  </th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody className="text-black">
                {filteredProjects.map((proj, idx) => (
                  <tr
                    key={idx}
                    className="border-t hover:bg-gray-50 transition duration-150"
                  >
                    <td className="p-3">{idx + 1}</td>
                    <td className="p-3">{proj.id}</td>
                    <td className="p-3">{proj.name}</td>
                    <td className="p-3">{proj.client}</td>
                    <td className="p-3">{proj.location}</td>
                    <td className="p-3">{proj.category}</td>
                    <td className="p-3">
                      <span
                        className={`text-white text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(
                          proj.status
                        )}`}
                      >
                        {proj.status}
                      </span>
                    </td>
                    <td className="p-3 text-center text-green-600">
                      {proj.protect && <FaCheckCircle />}
                    </td>
                    <td className="p-3 text-gray-600">
                      <BsThreeDotsVertical />
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

export default Projects;
