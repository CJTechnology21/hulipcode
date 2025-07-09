import { useState } from "react";
import SideBar from "../SideBar";
import Header from "../Header";
import { FaCheckCircle, FaFilter } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { PiSealCheckFill } from "react-icons/pi";

function Projects() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const allProjects = [
    {
      id: "SLX0810H",
      name: "RATLAN B 1H02",
      client: "SANDEEP BAKSHI",
      location: "DELHI / KALKAJI",
      category: "RESIDENTIAL",
      status: "EXECUTION IN PROGRESS",
      protect: true,
    },
    {
      id: "SPV5730W",
      name: "SHALIMAR TOWER 23 B",
      client: "RAHUL GUPTA",
      location: "DELHI / RANI BAGH",
      category: "RESIDENTIAL",
      status: "SITE MEASUREMENTS",
      protect: false,
    },
    {
      id: "DJC9846J",
      name: "CAFE ZUZU",
      client: "UTKARSH VIJAY",
      location: "DELHI / SAKET",
      category: "COMMERCIAL",
      status: "DESIGNING IN PROCESS",
      protect: false,
    },
    {
      id: "BDG6677O",
      name: "RB INTERNATIONAL",
      client: "SONIA KAPOOR",
      location: "JAIPUR / C SCHEME",
      category: "COMMERCIAL",
      status: "HOLD",
      protect: true,
    },
    {
      id: "LZU0345H",
      name: "AAGMAN RESIDENCY",
      client: "RAJESH MITTAL",
      location: "RANCHI/ KATATOLI",
      category: "RESIDENTIAL",
      status: "COMPLETED",
      protect: true,
    },
  ];

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

// import { useState } from "react";
// import SideBar from "../SideBar";
// import Header from "../Header";
// import {
//   FaAddressCard,
//   FaClipboardList,
//   FaLightbulb,
//   FaProjectDiagram,
//   FaMoneyCheckAlt,
//   FaChartLine,
//   FaShieldAlt,
//   FaShoppingBag,
// } from "react-icons/fa";
// import { IoIosPeople } from "react-icons/io";
// import { useNavigate } from "react-router-dom";

// function Projects() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const navigate = useNavigate();

//   const modules = [
//     {
//       title: "Basic Details",
//       subtitle: "Manage contact details etc.",
//       icon: <FaAddressCard className="text-3xl" />,
//       path: "/project/basicdetails",
//     },
//     {
//       title: "Quotations & Site Details",
//       subtitle: "Generate BoQs and Capture Site Details",
//       icon: <FaClipboardList className="text-3xl" />,
//       path: "/quote",
//     },
//     {
//       title: "Inspirations",
//       subtitle: "View Images Liked by Client",
//       icon: <FaLightbulb className="text-3xl" />,
//       path: "/project/inspirations",
//     },
//     {
//       title: "Contact Vendor",
//       subtitle: "Purchase Interiors",
//       icon: <FaShoppingBag className="text-3xl" />,
//       path: "/project/vendor",
//     },
//     {
//       title: "Project Management",
//       subtitle: "Track Your Project",
//       icon: <FaProjectDiagram className="text-3xl" />,
//       path: "/project/management",
//     },
//     {
//       title: "Financial Planning",
//       subtitle: "Manage your cashflow",
//       icon: <FaMoneyCheckAlt className="text-3xl" />,
//       path: "/project/finance",
//     },
//     {
//       title: "Site Progress Uploads",
//       subtitle: "Share Your Site Progress",
//       icon: <FaChartLine className="text-3xl" />,
//       path: "/project/progress",
//     },
//     {
//       title: "Warranty",
//       subtitle: "View Warranties",
//       icon: <FaShieldAlt className="text-3xl" />,
//       path: "/project/warranty",
//     },
//     {
//       title: "Labour Report",
//       subtitle: "Capture Labour Availability",
//       icon: <IoIosPeople className="text-3xl" />,
//       path: "/project/labour",
//     },
//   ];

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-20 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
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
//           title="Project Data"
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />

//         <div className="p-6 space-y-6">
//           {/* Project Info */}

//           {/* Progress Info */}
//           <div className="flex items-center justify-end flex-wrap gap-4">
//             <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm shadow">
//               Progress Report
//             </button>
//           </div>

//           {/* Module Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {modules.map((mod, idx) => (
//               <div
//                 key={idx}
//                 onClick={() => navigate(mod.path)}
//                 className="cursor-pointer bg-white border border-blue-200 hover:shadow-md transition-all rounded-xl p-5 flex flex-col items-center text-center hover:border-blue-400"
//               >
//                 <div className="text-blue-500 mb-3">{mod.icon}</div>
//                 <h3 className="font-semibold text-gray-800">{mod.title}</h3>
//                 <p className="text-xs text-gray-500 mt-1">{mod.subtitle}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Projects;
