import { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import Layout from "../Layout";
import SearchBar from "../../../components/SearchBar";
import DropDown from "../../../components/DropDown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import {
  fetchProjects,
  deleteProject,
  updateProject,
} from "../../../services/projectServices";
import ClipLoader from "react-spinners/ClipLoader"; // <--- import ClipLoader

function Projects() {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true); // <--- loading state
  const navigate = useNavigate();

  const searchKeys = [
    "id",
    "name",
    "client",
    "location",
    "category",
    "status",
    "progress",
    "cashFlow",
  ];

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true); // show loader
      try {
        const data = await fetchProjects();
        setProjects(
          data.map((p) => ({
            ...p,
            progress: p.progress || 50,
            cashFlow: p.cashFlow || 0,
            cashFlowType: p.cashFlowType || "IN",
            showMenu: false,
            isEditing: false,
          }))
        );
      } catch (err) {
        console.error("Error fetching projects:", err);
        toast.error("Failed to load projects");
      } finally {
        setLoading(false); // hide loader
      }
    };

    loadProjects();
  }, []);

  const filteredProjects = projects.filter((proj) => {
    const isProtected = activeTab === "protect" ? proj.isHuelip : true;
    const matchesFilters = Object.entries(filters).every(([key, val]) =>
      proj[key]?.toString().toLowerCase().includes(val.toLowerCase())
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

  const handleDelete = async (_id) => {
    try {
      await deleteProject(_id);
      setProjects((prev) => prev.filter((p) => p._id !== _id));
      toast.error("Project deleted!");
    } catch (err) {
      console.error("Delete project error:", err);
      toast.error("Failed to delete project");
    }
  };

  const handleSave = async (_id) => {
    const proj = projects.find((p) => p._id === _id);
    try {
      const updated = await updateProject(_id, proj);
      setProjects((prev) =>
        prev.map((p) =>
          p._id === _id ? { ...updated, isEditing: false, showMenu: false } : p
        )
      );
      toast.success("Project updated!");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update project");
    }
  };

  const handleEdit = (_id) => {
    setProjects((prev) =>
      prev.map((p) =>
        p._id === _id ? { ...p, isEditing: true, showMenu: false } : p
      )
    );
  };

  const handleChange = (_id, key, value) => {
    setProjects((prev) =>
      prev.map((p) => (p._id === _id ? { ...p, [key]: value } : p))
    );
  };

  return (
    <Layout title="Projects">
      <ToastContainer />

      {/* Header */}
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
                  : projects.filter((p) => p.isHuelip).length}
              </span>
            </div>
          ))}
        </div>
        <div>
          <Button
            variant="custom"
            className="bg-red-700 hover:bg-red-800 text-white text-sm font-semibold px-4 py-2 rounded shadow"
            onClick={() => navigate("/addproject")}
          >
            + Add Project
          </Button>
        </div>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color="red" size={50} />
        </div>
      ) : (
        <div className="overflow-x-hidden p-4 m-4 rounded-lg">
          <table className="min-w-full text-sm text-left bg-white rounded-lg shadow-lg">
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
                    {i > 0 && i < searchKeys.length + 1 && (
                      <SearchBar
                        value={filters[searchKeys[i - 1]] || ""}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            [searchKeys[i - 1]]: e.target.value,
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
                  key={proj._id}
                  className="border-t hover:bg-gray-50 transition duration-150"
                >
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{proj.id}</td>
                  <td
                    className="p-3 cursor-pointer hover:underline text-blue-600"
                      onClick={() =>
                        navigate("/ptabs", {
                          state: {
                            projectName: proj.name,
                            projectId: proj._id,
                            projectLocation: proj.location,
                            project: proj
                          },
                        })
                      }
                  >
                    {proj.name}
                  </td>
                  {/* Editable fields */}
                  {["client", "location", "category", "status"].map((key) => (
                    <td key={key} className="p-3">
                      {proj.isEditing ? (
                        key === "status" ? (
                          <DropDown
                            name="status"
                            value={proj.status}
                            options={[
                              "EXECUTION IN PROGRESS",
                              "SITE MEASUREMENTS",
                              "DESIGNING IN PROCESS",
                              "HOLD",
                              "COMPLETED",
                            ]}
                            onChange={(e) =>
                              handleChange(proj._id, "status", e.target.value)
                            }
                          />
                        ) : key === "category" ? (
                          <DropDown
                            name="category"
                            value={proj.category}
                            options={[
                              "RESIDENTIAL",
                              "COMMERCIAL",
                              "INDUSTRIAL",
                              "RETAIL",
                            ]}
                            onChange={(e) =>
                              handleChange(proj._id, "category", e.target.value)
                            }
                          />
                        ) : (
                          <Input
                            value={proj[key]}
                            onChange={(e) =>
                              handleChange(proj._id, key, e.target.value)
                            }
                            className="w-full border rounded p-1 text-sm"
                          />
                        )
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
                  {/* Progress */}
                  <td className="p-3 w-32">
                    {proj.isEditing ? (
                      <Input
                        type="number"
                        value={proj.progress}
                        onChange={(e) =>
                          handleChange(
                            proj._id,
                            "progress",
                            Number(e.target.value)
                          )
                        }
                        className="w-full border rounded p-1 text-sm"
                      />
                    ) : (
                      <>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: `${proj.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs mt-1 text-gray-600">
                          {proj.progress}%
                        </div>
                      </>
                    )}
                  </td>
                  {/* Cashflow */}
                  <td className="p-3 font-medium text-xs">
                    {proj.isEditing ? (
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={proj.cashFlow}
                          onChange={(e) =>
                            handleChange(
                              proj._id,
                              "cashFlow",
                              Number(e.target.value)
                            )
                          }
                          className="w-28 border rounded p-1 text-sm"
                        />
                        <DropDown
                          name="cashFlowType"
                          value={proj.cashFlowType}
                          options={["IN", "OUT"]}
                          onChange={(e) =>
                            handleChange(
                              proj._id,
                              "cashFlowType",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ) : (
                      `₹${proj.cashFlow.toLocaleString()} ${proj.cashFlowType}`
                    )}
                  </td>
                  {/* Protect */}
                  <td className="p-3 text-center text-green-600">
                    {proj.isHuelip && <FaCheckCircle />}
                  </td>
                  {/* Actions */}
                  <td className="p-3 text-gray-600 relative">
                    <Button
                      aria-label="Actions"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProjects((prev) =>
                          prev.map((p) =>
                            p._id === proj._id
                              ? { ...p, showMenu: !p.showMenu }
                              : { ...p, showMenu: false }
                          )
                        );
                      }}
                    >
                      <BsThreeDotsVertical />
                    </Button>
                    {proj.showMenu && (
                      <div className="absolute right-0 bg-white shadow-md rounded mt-2 z-10">
                        {proj.isEditing ? (
                          <Button
                            variant="custom"
                            className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSave(proj._id);
                            }}
                          >
                            Save
                          </Button>
                        ) : (
                          <Button
                            variant="custom"
                            className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(proj._id);
                            }}
                          >
                            Edit
                          </Button>
                        )}
                        <Button
                          variant="custom"
                          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(proj._id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

export default Projects;

// import { useState, useEffect } from "react";
// import { FaCheckCircle } from "react-icons/fa";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import Layout from "../Layout";
// import SearchBar from "../../../components/SearchBar";
// import DropDown from "../../../components/DropDown";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import Input from "../../../components/Input";
// import Button from "../../../components/Button";
// import {
//   fetchProjects,
//   deleteProject,
//   updateProject,
// } from "../../../services/projectServices";

// function Projects() {
//   const [projects, setProjects] = useState([]);
//   const [filters, setFilters] = useState({});
//   const [activeTab, setActiveTab] = useState("all");
//   const navigate = useNavigate();

//   const searchKeys = [
//     "id",
//     "name",
//     "client",
//     "location",
//     "category",
//     "status",
//     "progress",
//     "cashFlow",
//   ];

//   // Fetch projects
//   useEffect(() => {
//     const loadProjects = async () => {
//       try {
//         const data = await fetchProjects();
//         setProjects(
//           data.map((p) => ({
//             ...p,
//             progress: p.progress || 50,
//             cashFlow: p.cashFlow || 0,
//             cashFlowType: p.cashFlowType || "IN",
//             showMenu: false,
//             isEditing: false,
//           }))
//         );
//       } catch (err) {
//         console.error("Error fetching projects:", err);
//         toast.error("Failed to load projects");
//       }
//     };

//     loadProjects();
//   }, []);

//   // Filters
//   const filteredProjects = projects.filter((proj) => {
//     const isProtected = activeTab === "protect" ? proj.isHuelip : true;
//     const matchesFilters = Object.entries(filters).every(([key, val]) =>
//       proj[key]?.toString().toLowerCase().includes(val.toLowerCase())
//     );
//     return isProtected && matchesFilters;
//   });

//   // Status colors
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

//   // Delete
//   const handleDelete = async (_id) => {
//     try {
//       await deleteProject(_id);
//       setProjects((prev) => prev.filter((p) => p._id !== _id));
//       toast.error("Project deleted!");
//     } catch (err) {
//       console.error("Delete project error:", err);
//       toast.error("Failed to delete project");
//     }
//   };

//   // Save (PUT update)
//   const handleSave = async (_id) => {
//     const proj = projects.find((p) => p._id === _id);
//     try {
//       const updated = await updateProject(_id, proj);
//       setProjects((prev) =>
//         prev.map((p) =>
//           p._id === _id ? { ...updated, isEditing: false, showMenu: false } : p
//         )
//       );
//       toast.success("Project updated!");
//     } catch (err) {
//       console.error("Update error:", err);
//       toast.error("Failed to update project");
//     }
//   };

//   // Edit
//   const handleEdit = (_id) => {
//     setProjects((prev) =>
//       prev.map((p) =>
//         p._id === _id ? { ...p, isEditing: true, showMenu: false } : p
//       )
//     );
//   };

//   // Field change
//   const handleChange = (_id, key, value) => {
//     setProjects((prev) =>
//       prev.map((p) => (p._id === _id ? { ...p, [key]: value } : p))
//     );
//   };

//   return (
//     <Layout title="Projects">
//       <ToastContainer />

//       {/* Header - No extra spacing, flush with table */}
//       <div className="flex items-center justify-between border-b border-gray-300 px-4 py-2 bg-white">
//         <div className="flex space-x-6 font-semibold text-sm">
//           {["all", "protect"].map((tab) => (
//             <div
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`flex items-center gap-2 pb-2 px-2 border-b-4 cursor-pointer ${
//                 activeTab === tab
//                   ? "border-red-600 text-black"
//                   : "border-transparent text-gray-600"
//               }`}
//             >
//               <span>{tab === "all" ? "All Projects" : "Huelip Protect"}</span>
//               <span
//                 className={`text-xs font-bold px-2 rounded ${
//                   activeTab === tab
//                     ? "bg-red-600 text-white"
//                     : "bg-gray-300 text-gray-700"
//                 }`}
//               >
//                 {tab === "all"
//                   ? projects.length
//                   : projects.filter((p) => p.isHuelip).length}
//               </span>
//             </div>
//           ))}
//         </div>
//         <div>
//           <Button
//             variant="custom"
//             className="bg-red-700 hover:bg-red-800 text-white text-sm font-semibold px-4 py-2 rounded shadow"
//             onClick={() => navigate("/addproject")}
//           >
//             + Add Project
//           </Button>
//         </div>
//       </div>

//       {/* Table - Directly attached, no gap */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full text-sm text-left bg-white">
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
//                   {i > 0 && i < searchKeys.length + 1 && (
//                     <SearchBar
//                       value={filters[searchKeys[i - 1]] || ""}
//                       onChange={(e) =>
//                         setFilters((f) => ({
//                           ...f,
//                           [searchKeys[i - 1]]: e.target.value,
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
//                 key={proj._id}
//                 className="border-t hover:bg-gray-50 transition duration-150"
//               >
//                 <td className="p-3">{idx + 1}</td>
//                 <td className="p-3">{proj.id}</td>
//                 <td
//                   className="p-3 cursor-pointer hover:underline text-blue-600"
//                   onClick={() =>
//                     navigate("/ptabs", { state: { projectName: proj.name, projectId: proj._id,} })
//                   }
//                 >
//                   {proj.name}
//                 </td>

//                 {/* Editable fields */}
//                 {["client", "location", "category", "status"].map((key) => (
//                   <td key={key} className="p-3">
//                     {proj.isEditing ? (
//                       key === "status" ? (
//                         <DropDown
//                           name="status"
//                           value={proj.status}
//                           options={[
//                             "EXECUTION IN PROGRESS",
//                             "SITE MEASUREMENTS",
//                             "DESIGNING IN PROCESS",
//                             "HOLD",
//                             "COMPLETED",
//                           ]}
//                           onChange={(e) =>
//                             handleChange(proj._id, "status", e.target.value)
//                           }
//                         />
//                       ) : key === "category" ? (
//                         <DropDown
//                           name="category"
//                           value={proj.category}
//                           options={[
//                             "RESIDENTIAL",
//                             "COMMERCIAL",
//                             "INDUSTRIAL",
//                             "RETAIL",
//                           ]}
//                           onChange={(e) =>
//                             handleChange(proj._id, "category", e.target.value)
//                           }
//                         />
//                       ) : (
//                         <Input
//                           value={proj[key]}
//                           onChange={(e) =>
//                             handleChange(proj._id, key, e.target.value)
//                           }
//                           className="w-full border rounded p-1 text-sm"
//                         />
//                       )
//                     ) : key === "status" ? (
//                       <span
//                         className={`whitespace-nowrap px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(
//                           proj.status
//                         )}`}
//                       >
//                         {proj.status}
//                       </span>
//                     ) : (
//                       proj[key]
//                     )}
//                   </td>
//                 ))}

//                 {/* Progress */}
//                 <td className="p-3 w-32">
//                   {proj.isEditing ? (
//                     <Input
//                       type="number"
//                       value={proj.progress}
//                       onChange={(e) =>
//                         handleChange(proj._id, "progress", Number(e.target.value))
//                       }
//                       className="w-full border rounded p-1 text-sm"
//                     />
//                   ) : (
//                     <>
//                       <div className="w-full bg-gray-200 rounded-full h-2.5">
//                         <div
//                           className="bg-green-600 h-2.5 rounded-full"
//                           style={{ width: `${proj.progress}%` }}
//                         ></div>
//                       </div>
//                       <div className="text-xs mt-1 text-gray-600">
//                         {proj.progress}%
//                       </div>
//                     </>
//                   )}
//                 </td>

//                 {/* Cashflow */}
//                 <td className="p-3 font-medium text-xs">
//                   {proj.isEditing ? (
//                     <div className="flex gap-2">
//                       <Input
//                         type="number"
//                         value={proj.cashFlow}
//                         onChange={(e) =>
//                           handleChange(
//                             proj._id,
//                             "cashFlow",
//                             Number(e.target.value)
//                           )
//                         }
//                         className="w-28 border rounded p-1 text-sm"
//                       />
//                       <DropDown
//                         name="cashFlowType"
//                         value={proj.cashFlowType}
//                         options={["IN", "OUT"]}
//                         onChange={(e) =>
//                           handleChange(proj._id, "cashFlowType", e.target.value)
//                         }
//                       />
//                     </div>
//                   ) : (
//                     `₹${proj.cashFlow.toLocaleString()} ${proj.cashFlowType}`
//                   )}
//                 </td>

//                 {/* Protect */}
//                 <td className="p-3 text-center text-green-600">
//                   {proj.isHuelip && <FaCheckCircle />}
//                 </td>

//                 {/* Actions */}
//                 <td className="p-3 text-gray-600 relative">
//                   <Button
//                     aria-label="Actions"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setProjects((prev) =>
//                         prev.map((p) =>
//                           p._id === proj._id
//                             ? { ...p, showMenu: !p.showMenu }
//                             : { ...p, showMenu: false }
//                         )
//                       );
//                     }}
//                   >
//                     <BsThreeDotsVertical />
//                   </Button>
//                   {proj.showMenu && (
//                     <div className="absolute right-0 bg-white shadow-md rounded mt-2 z-10">
//                       {proj.isEditing ? (
//                         <Button
//                           variant="custom"
//                           className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleSave(proj._id);
//                           }}
//                         >
//                           Save
//                         </Button>
//                       ) : (
//                         <Button
//                           variant="custom"
//                           className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleEdit(proj._id);
//                           }}
//                         >
//                           Edit
//                         </Button>
//                       )}
//                       <Button
//                         variant="custom"
//                         className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-600"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDelete(proj._id);
//                         }}
//                       >
//                         Delete
//                       </Button>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </Layout>
//   );
// }

// export default Projects;
