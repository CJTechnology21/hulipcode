import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import allProjects from "./projectsData";
import Layout from "../Layout";
import SearchBar from "../../../components/SearchBar";
import AddProjectModal from "./AddProjectModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Projects() {
  const [projects, setProjects] = useState(
    allProjects.map((p) => ({
      ...p,
      progress: p.progress || 50,
      cashFlow: p.cashFlow || "₹10,000 IN",
      showMenu: false,
      isEditing: false,
    }))
  );
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState("all");
  const [newProjectModal, setNewProjectModal] = useState(false);
  const navigate = useNavigate();

  const filteredProjects = projects.filter((proj) => {
    const isProtected = activeTab === "protect" ? proj.protect : true;
    const matchesFilters = Object.entries(filters).every(([key, val]) =>
      proj[key]?.toLowerCase().includes(val.toLowerCase())
    );
    return isProtected && matchesFilters;
  });

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

  const handleEdit = (id) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isEditing: true } : p))
    );
  };

  const handleSave = (id) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isEditing: false, showMenu: false } : p
      )
    );
    toast.success("Project updated!");
  };

  const handleDelete = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast.error("Project deleted!");
  };

  const handleChange = (id, key, value) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [key]: value } : p))
    );
  };

  return (
    <Layout title="Projects">
      <ToastContainer />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-300 px-4 py-2 bg-white">
          <div className="flex space-x-6 font-semibold text-sm">
            {["all", "protect"].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 pb-2 px-2 border-b-4 cursor-pointer ${
                  activeTab === tab
                    ? "border-red-600 text-black"
                    : "border-transparent text-gray-600"
                }`}
              >
                <span>{tab === "all" ? "All Projects" : "Huelip Protect"}</span>
                <span
                  className={`text-xs font-bold px-2 rounded ${
                    activeTab === tab
                      ? "bg-red-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {tab === "all"
                    ? projects.length
                    : projects.filter((p) => p.protect).length}
                </span>
              </div>
            ))}
          </div>
          <div>
            <button
              className="bg-red-700 hover:bg-red-800 text-white text-sm font-semibold px-4 py-2 rounded shadow"
              onClick={() => setNewProjectModal(true)}
            >
              + Add Project
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl overflow-x-auto p-8">
        <table className="min-w-full text-sm text-left bg-white rounded-lg">
          <thead className="bg-gray-200 text-black font-semibold uppercase text-xs">
            <tr>
              {[
                "#",
                "Project ID",
                "Project Name",
                "Client Name",
                "City / Area",
                "Category",
                "Status",
                "Progress",
                "In / Out",
                "Protect",
                "",
              ].map((title, i) => (
                <th key={i} className="p-3">
                  {title}
                  {i > 0 && i < 10 && (
                    <SearchBar
                      value={filters[Object.keys(allProjects[0])[i - 1]] || ""}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          [Object.keys(allProjects[0])[i - 1]]:
                            e.target.value,
                        }))
                      }
                      className="mt-1"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((proj, idx) => (
              <tr
                key={proj.id}
                className="border-t hover:bg-gray-50 transition duration-150"
              >
                <td className="p-3">{idx + 1}</td>
                <td className="p-3">{proj.id}</td>
                <td
                  className="p-3 cursor-pointer hover:underline text-blue-600"
                  onClick={() =>
                    navigate("/ptabs", { state: { projectName: proj.name } })
                  }
                >
                  {proj.name}
                </td>
                {["client", "location", "category", "status"].map((key) => (
                  <td key={key} className="p-3">
                    {proj.isEditing ? (
                      <input
                        value={proj[key]}
                        onChange={(e) =>
                          handleChange(proj.id, key, e.target.value)
                        }
                        className="w-full border rounded p-1 text-sm"
                      />
                    ) : key === "status" ? (
                      <span
                        className={`whitespace-nowrap px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(
                          proj.status
                        )}`}
                      >
                        {proj.status}
                      </span>
                    ) : (
                      proj[key]
                    )}
                  </td>
                ))}
                <td className="p-3 w-32">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: `${proj.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs mt-1 text-gray-600">
                    {proj.progress}%
                  </div>
                </td>
                <td className="p-3 font-medium text-xs">{proj.cashFlow}</td>
                <td className="p-3 text-center text-green-600">
                  {proj.protect && <FaCheckCircle />}
                </td>
                <td className="p-3 text-gray-600 relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setProjects((prev) =>
                        prev.map((p) =>
                          p.id === proj.id
                            ? { ...p, showMenu: !p.showMenu }
                            : { ...p, showMenu: false }
                        )
                      );
                    }}
                  >
                    <BsThreeDotsVertical />
                  </button>
                  {proj.showMenu && (
                    <div className="absolute right-0 bg-white shadow-md rounded mt-2 z-10">
                      {proj.isEditing ? (
                        <button
                          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSave(proj.id);
                          }}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(proj.id);
                          }}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(proj.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {newProjectModal && (
          <AddProjectModal
            onClose={() => setNewProjectModal(false)}
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;

              const newProject = {
                id: form.id.value,
                name: form.name.value,
                client: form.client.value,
                location: form.location.value,
                category: form.category.value,
                status: form.status.value,
                progress: Number(form.progress.value || 0),
                cashFlow: form.cashFlow.value || "₹0",
                protect: form.protect.checked,
                isEditing: false,
                showMenu: false,
              };

              setProjects((prev) => [...prev, newProject]);
              setNewProjectModal(false);
              toast.success("Project added successfully!");
            }}
          />
        )}
      </div>
    </Layout>
  );
}

export default Projects;

// import { useState } from "react";
// import { FaCheckCircle } from "react-icons/fa";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import allProjects from "./projectsData";
// import Layout from "../Layout";
// import SearchBar from "../../../components/SearchBar";
// import AddProjectModal from "./AddProjectModal";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";

// function Projects() {
//   const [projects, setProjects] = useState(
//     allProjects.map((p) => ({
//       ...p,
//       progress: p.progress || 50,
//       cashFlow: p.cashFlow || "₹10,000 IN",
//       showMenu: false,
//       isEditing: false,
//     }))
//   );
//   const [filters, setFilters] = useState({});
//   const [activeTab, setActiveTab] = useState("all");
//   const [newProjectModal, setNewProjectModal] = useState(false);
//   const navigate = useNavigate();
//   const filteredProjects = projects.filter((proj) => {
//     const isProtected = activeTab === "protect" ? proj.protect : true;
//     const matchesFilters = Object.entries(filters).every(([key, val]) =>
//       proj[key]?.toLowerCase().includes(val.toLowerCase())
//     );
//     return isProtected && matchesFilters;
//   });

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "EXECUTION IN PROGRESS":
//         return "bg-green-500";
//       case "SITE MEASUREMENTS":
//         return "bg-yellow-400 text-black";
//       case "DESIGNING IN PROCESS":
//         return "bg-indigo-500";
//       case "HOLD":
//         return "bg-red-700";
//       case "COMPLETED":
//         return "bg-emerald-500";
//       default:
//         return "bg-gray-300";
//     }
//   };

//   const handleEdit = (id) => {
//     setProjects((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, isEditing: true } : p))
//     );
//   };

//   const handleSave = (id) => {
//     setProjects((prev) =>
//       prev.map((p) =>
//         p.id === id ? { ...p, isEditing: false, showMenu: false } : p
//       )
//     );
//     toast.success("Project updated!");
//   };

//   const handleDelete = (id) => {
//     setProjects((prev) => prev.filter((p) => p.id !== id));
//     toast.error("Project deleted!");
//   };

//   const handleChange = (id, key, value) => {
//     setProjects((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, [key]: value } : p))
//     );
//   };

//   return (
//     <Layout title="Projects">
//       <ToastContainer />
//       <div className="p-6 space-y-6">
//         <div className="flex items-center justify-between border-b border-gray-300 px-4 py-2 bg-white">
//           {/* Left: Tabs */}
//           <div className="flex space-x-6 font-semibold text-sm">
//             {["all", "protect"].map((tab) => (
//               <div
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`flex items-center gap-2 pb-2 px-2 border-b-4 cursor-pointer ${
//                   activeTab === tab
//                     ? "border-red-600 text-black"
//                     : "border-transparent text-gray-600"
//                 }`}
//               >
//                 <span>{tab === "all" ? "All Projects" : "Huelip Protect"}</span>
//                 <span
//                   className={`text-xs font-bold px-2 rounded ${
//                     activeTab === tab
//                       ? "bg-red-600 text-white"
//                       : "bg-gray-300 text-gray-700"
//                   }`}
//                 >
//                   {tab === "all"
//                     ? projects.length
//                     : projects.filter((p) => p.protect).length}
//                 </span>
//               </div>
//             ))}
//           </div>
//           <div>
//             <button
//               className="bg-red-700 hover:bg-red-800 text-white text-sm font-semibold px-4 py-2 rounded shadow"
//               onClick={() => setNewProjectModal(true)}
//             >
//               + Add Project
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="rounded-xl overflow-x-auto p-8">
//         <table className="min-w-full text-sm text-left bg-white rounded-lg">
//           <thead className="bg-gray-200 text-black font-semibold uppercase text-xs">
//             <tr>
//               {[
//                 "#",
//                 "Project ID",
//                 "Project Name",
//                 "Client Name",
//                 "City / Area",
//                 "Category",
//                 "Status",
//                 "Progress",
//                 "In / Out",
//                 "Protect",
//                 "",
//               ].map((title, i) => (
//                 <th key={i} className="p-3">
//                   {title}
//                   {i > 0 && i < 10 && (
//                     <SearchBar
//                       value={filters[Object.keys(allProjects[0])[i - 1]] || ""}
//                       onChange={(e) =>
//                         setFilters((f) => ({
//                           ...f,
//                           [Object.keys(allProjects[0])[i - 1]]: e.target.value,
//                         }))
//                       }
//                       className="mt-1"
//                     />
//                   )}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProjects.map((proj, idx) => (
//               <tr
//                 key={proj.id}
//                 onClick={() =>
//                   navigate("/ptabs", { state: { projectName: proj.name } })
//                 }
//                 className="border-t hover:bg-gray-50 transition duration-150"
//               >
//                 <td className="p-3">{idx + 1}</td>
//                 {["id", "name", "client", "location", "category", "status"].map(
//                   (key) => (
//                     <td key={key} className="p-3">
//                       {proj.isEditing ? (
//                         <input
//                           value={proj[key]}
//                           onChange={(e) =>
//                             handleChange(proj.id, key, e.target.value)
//                           }
//                           className="w-full border rounded p-1 text-sm"
//                         />
//                       ) : key === "status" ? (
//                         <span
//                           className={`whitespace-nowrap px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(
//                             proj.status
//                           )}`}
//                         >
//                           {proj.status}
//                         </span>
//                       ) : (
//                         proj[key]
//                       )}
//                     </td>
//                   )
//                 )}
//                 <td className="p-3 w-32">
//                   <div className="w-full bg-gray-200 rounded-full h-2.5">
//                     <div
//                       className="bg-green-600 h-2.5 rounded-full"
//                       style={{ width: `${proj.progress}%` }}
//                     ></div>
//                   </div>
//                   <div className="text-xs mt-1 text-gray-600">
//                     {proj.progress}%
//                   </div>
//                 </td>
//                 <td className="p-3 font-medium text-xs">{proj.cashFlow}</td>
//                 <td className="p-3 text-center text-green-600">
//                   {proj.protect && <FaCheckCircle />}
//                 </td>
//                 <td className="p-3 text-gray-600 relative">
//                   <button
//                     onClick={() =>
//                       setProjects((prev) =>
//                         prev.map((p) =>
//                           p.id === proj.id
//                             ? { ...p, showMenu: !p.showMenu }
//                             : { ...p, showMenu: false }
//                         )
//                       )
//                     }
//                   >
//                     <BsThreeDotsVertical />
//                   </button>
//                   {proj.showMenu && (
//                     <div className="absolute right-0 bg-white shadow-md rounded mt-2 z-10">
//                       {proj.isEditing ? (
//                         <button
//                           className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
//                           onClick={() => handleSave(proj.id)}
//                         >
//                           Save
//                         </button>
//                       ) : (
//                         <button
//                           className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
//                           onClick={() => handleEdit(proj.id)}
//                         >
//                           Edit
//                         </button>
//                       )}
//                       <button
//                         className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-600"
//                         onClick={() => handleDelete(proj.id)}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {newProjectModal && (
//           <AddProjectModal
//             onClose={() => setNewProjectModal(false)}
//             onSubmit={(e) => {
//               e.preventDefault();
//               const form = e.target;

//               const newProject = {
//                 id: form.id.value,
//                 name: form.name.value,
//                 client: form.client.value,
//                 location: form.location.value,
//                 category: form.category.value,
//                 status: form.status.value,
//                 progress: Number(form.progress.value || 0),
//                 cashFlow: form.cashFlow.value || "₹0",
//                 protect: form.protect.checked,
//                 isEditing: false,
//                 showMenu: false,
//               };

//               setProjects((prev) => [...prev, newProject]);
//               setNewProjectModal(false);
//               toast.success("Project added successfully!");
//             }}
//           />
//         )}
//       </div>
//     </Layout>
//   );
// }

// export default Projects;

// import { useState } from "react";
// import SideBar from "../SideBar";
// import Header from "../Header";
// import { FaCheckCircle, FaFilter } from "react-icons/fa";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { PiSealCheckFill } from "react-icons/pi";
// import allProjects from "./projectsData";

// function Projects() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("all");
//   const [projects, setProjects] = useState(allProjects);
//   const [newProjectModal, setNewProjectModal] = useState(false);

//   const filteredProjects =
//     activeTab === "protect"
//       ? projects.filter((p) => p.protect)
//       : projects;

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "EXECUTION IN PROGRESS":
//         return "bg-green-500";
//       case "SITE MEASUREMENTS":
//         return "bg-yellow-400 text-black";
//       case "DESIGNING IN PROCESS":
//         return "bg-indigo-500";
//       case "HOLD":
//         return "bg-red-700";
//       case "COMPLETED":
//         return "bg-emerald-500";
//       default:
//         return "bg-gray-300";
//     }
//   };

//   const handleAddProject = (e) => {
//     e.preventDefault();
//     const form = e.target;
//     const newProject = {
//       id: form.id.value,
//       name: form.name.value,
//       client: form.client.value,
//       location: form.location.value,
//       category: form.category.value,
//       status: form.status.value,
//       progress: parseInt(form.progress.value),
//       cashFlow: form.cashFlow.value,
//       protect: form.protect.checked,
//     };
//     setProjects((prev) => [...prev, newProject]);
//     setNewProjectModal(false);
//   };

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
//           {/* Tabs */}
//           <div className="flex items-center justify-between border-b border-gray-300 px-4 py-2 bg-white">
//             <div className="flex space-x-6 font-semibold text-sm">
//               <div
//                 onClick={() => setActiveTab("all")}
//                 className={`flex items-center gap-2 pb-2 px-2 border-b-4 cursor-pointer ${
//                   activeTab === "all"
//                     ? "border-red-600 text-black"
//                     : "border-transparent text-gray-600"
//                 }`}
//               >
//                 <span>All Projects</span>
//                 <span
//                   className={`text-xs font-bold px-2 rounded ${
//                     activeTab === "all"
//                       ? "bg-red-600 text-white"
//                       : "bg-gray-300 text-gray-700"
//                   }`}
//                 >
//                   {projects.length}
//                 </span>
//               </div>
//               <div
//                 onClick={() => setActiveTab("protect")}
//                 className={`flex items-center gap-2 pb-2 px-2 border-b-4 cursor-pointer ${
//                   activeTab === "protect"
//                     ? "border-red-600 text-black"
//                     : "border-transparent text-gray-600"
//                 }`}
//               >
//                 <span>Huelip Protect</span>
//                 <span
//                   className={`text-xs font-bold px-2 rounded ${
//                     activeTab === "protect"
//                       ? "bg-red-600 text-white"
//                       : "bg-gray-300 text-gray-700"
//                   }`}
//                 >
//                   {projects.filter((p) => p.protect).length}
//                 </span>
//               </div>
//             </div>
//             <button
//               className="bg-red-700 hover:bg-red-800 text-white text-sm font-semibold px-4 py-2 rounded shadow"
//               onClick={() => setNewProjectModal(true)}
//             >
//               + Add Project
//             </button>
//           </div>

//           {/* Table */}
//           <div className="bg-white shadow rounded-lg overflow-x-auto">
//             <table className="min-w-full text-sm text-left">
//               <thead className="bg-gray-200 text-black font-semibold uppercase text-xs">
//                 <tr>
//                   <th className="p-3">#</th>
//                   <th className="p-3">Project ID</th>
//                   <th className="p-3">Project Name</th>
//                   <th className="p-3">Client Name</th>
//                   <th className="p-3">City / Area</th>
//                   <th className="p-3">Category</th>
//                   <th className="p-3">Status</th>
//                   <th className="p-3">Progress</th>
//                   <th className="p-3">In / Out</th>
//                   <th className="p-3 text-center">Protect</th>
//                   <th className="p-3" />
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredProjects.map((proj, idx) => (
//                   <tr
//                     key={idx}
//                     className="border-t hover:bg-gray-50 transition duration-150"
//                   >
//                     <td className="p-3">{idx + 1}</td>
//                     <td className="p-3">{proj.id}</td>
//                     <td className="p-3">{proj.name}</td>
//                     <td className="p-3">{proj.client}</td>
//                     <td className="p-3">{proj.location}</td>
//                     <td className="p-3">{proj.category}</td>
//                     <td className="p-3">
//                       <span
//                         className={`text-white text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(
//                           proj.status
//                         )}`}
//                       >
//                         {proj.status}
//                       </span>
//                     </td>
//                     <td className="p-3 w-32">
//                       <div className="w-full bg-gray-200 rounded-full h-2.5">
//                         <div
//                           className="bg-green-600 h-2.5 rounded-full"
//                           style={{ width: `${proj.progress || 0}%` }}
//                         ></div>
//                       </div>
//                       <div className="text-xs mt-1 text-gray-600">
//                         {proj.progress || 0}%
//                       </div>
//                     </td>
//                     <td className="p-3 font-medium text-xs">
//                       {proj.cashFlow}
//                     </td>
//                     <td className="p-3 text-center text-green-600">
//                       {proj.protect && <FaCheckCircle />}
//                     </td>
//                     <td className="p-3 text-gray-600">
//                       <BsThreeDotsVertical />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Add Project Modal */}
//       {newProjectModal && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg w-full max-w-md">
//             <h2 className="text-lg font-semibold mb-4">Add New Project</h2>
//             <form className="space-y-4" onSubmit={handleAddProject}>
//               <input name="id" placeholder="Project ID" className="input" required />
//               <input name="name" placeholder="Project Name" className="input" required />
//               <input name="client" placeholder="Client Name" className="input" required />
//               <input name="location" placeholder="Location" className="input" required />
//               <input name="category" placeholder="Category" className="input" />
//               <select name="status" className="input" required>
//                 <option>EXECUTION IN PROGRESS</option>
//                 <option>SITE MEASUREMENTS</option>
//                 <option>DESIGNING IN PROCESS</option>
//                 <option>HOLD</option>
//                 <option>COMPLETED</option>
//               </select>
//               <input
//                 type="number"
//                 name="progress"
//                 placeholder="Progress %"
//                 className="input"
//                 min="0"
//                 max="100"
//               />
//               <input
//                 name="cashFlow"
//                 placeholder="Cash Flow (e.g., ₹25,000 IN)"
//                 className="input"
//               />
//               <label className="flex items-center gap-2">
//                 <input type="checkbox" name="protect" />
//                 <span className="text-sm">Huelip Protect</span>
//               </label>
//               <div className="flex justify-end gap-4">
//                 <button
//                   type="button"
//                   className="px-4 py-2 bg-gray-300 rounded"
//                   onClick={() => setNewProjectModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded">
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Projects;
