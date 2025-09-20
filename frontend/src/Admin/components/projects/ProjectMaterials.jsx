import React, { useState, useEffect, useMemo } from "react";
import { FiDownload, FiPlus } from "react-icons/fi";
import Button from "../../../components/Button";
import SearchBar from "../../../components/SearchBar";
import MaterialLibraryDrawer from "../Procurement/MaterialLibraryDrawer";
import {
  getMaterialsOfRFQ,
  addMaterialsToRFQ,
  fetchRFQByProject,
} from "../../../services/rfqServices";
import { toast } from "react-toastify";
// Redux
import { useDispatch } from "react-redux";
import { setSelectedMaterials } from "../../../app/features/pendingMaterials/pendingMaterialsSlice";

export default function ProjectMaterials({
  projectName,
  rfqId,
  projectId,
  projectLocation,
  project, // whole project if passed
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Material List");
  const [materialModal, setMaterialModal] = useState(false);
  const [materialGroups, setMaterialGroups] = useState([]); // normalized groups: [{ project, items: [] }]
  const [rfqs, setRfqs] = useState([]);
  const dispatch = useDispatch();

  const effectiveProjectId = project?._id || projectId;
  const effectiveProjectName = project?.name || projectName;
  const effectiveLocation =
    project?.deliveryLocation || projectLocation || "Main Warehouse";

  // helper: normalize incoming data into groups of { project, items }
  const normalizeGroups = (raw) => {
    if (!Array.isArray(raw)) return [];
    if (raw.length === 0) return [];
    if (raw[0] && Array.isArray(raw[0].items)) return raw;
    return [
      {
        project: {
          _id: effectiveProjectId,
          name: effectiveProjectName,
          deliveryLocation: effectiveLocation,
        },
        items: raw,
      },
    ];
  };

  // Fetch RFQs for project and then materials
  useEffect(() => {
    if (!effectiveProjectId) return;

    (async () => {
      try {
        // fetch all RFQs of this project
        const projectRfqs = await fetchRFQByProject(effectiveProjectId);
        setRfqs(projectRfqs || []);

        // if rfqId passed, fetch materials for it, else first RFQ
        const targetRfqId = rfqId || (projectRfqs[0]?._id);
        if (!targetRfqId) return;

        let data = await getMaterialsOfRFQ(targetRfqId);
        data = data?.data ?? data;

        const groups = normalizeGroups(data);

        const materialsFlat = groups.flatMap((group) =>
          (group.items || []).map((item) => ({
            ...item,
            project: {
              _id: group.project?._id || effectiveProjectId,
              name: group.project?.name || effectiveProjectName,
              deliveryLocation:
                group.project?.deliveryLocation || effectiveLocation,
            },
            status: item.status || "Pending",
          }))
        );

        setMaterialGroups(groups);
        dispatch(setSelectedMaterials(materialsFlat));
      } catch (err) {
        console.error("Failed to load RFQs or materials:", err);
        toast.error("Failed to load materials");
      }
    })();
  }, [
    effectiveProjectId,
    rfqId,
    dispatch,
    effectiveProjectName,
    effectiveLocation,
  ]);

  // Add new materials
  const handleAddMaterials = async (newMaterials) => {
    if (!rfqId || !newMaterials || newMaterials.length === 0) return;

    try {
      const materialsWithProject = newMaterials.map((item) => ({
        ...item,
        project: {
          _id: effectiveProjectId,
          name: effectiveProjectName,
          deliveryLocation: effectiveLocation,
        },
        status: item.status || "Pending",
      }));

      let updated = await addMaterialsToRFQ(rfqId, {
        materials: materialsWithProject,
      });
      updated = updated?.data ?? updated;

      const groups = normalizeGroups(updated);

      const materialsFlat = groups.flatMap((group) =>
        (group.items || []).map((item) => ({
          ...item,
          project: {
            _id: group.project?._id || effectiveProjectId,
            name: group.project?.name || effectiveProjectName,
            deliveryLocation:
              group.project?.deliveryLocation || effectiveLocation,
          },
          status: item.status || "Pending",
        }))
      );

      setMaterialGroups(groups);
      dispatch(setSelectedMaterials(materialsFlat));
      toast.success("Materials added successfully!");
      setMaterialModal(false);
    } catch (err) {
      console.error("Failed to add materials:", err.response?.data || err);
      toast.error("Failed to add materials");
    }
  };

  const flattenedMaterials = useMemo(
    () =>
      materialGroups.flatMap((group) =>
        (group.items || []).map((item) => ({
          ...item,
          project: {
            _id: group.project?._id || effectiveProjectId,
            name: group.project?.name || effectiveProjectName,
            deliveryLocation:
              group.project?.deliveryLocation || effectiveLocation,
          },
          status: item.status || "Pending",
        }))
      ),
    [
      materialGroups,
      effectiveProjectId,
      effectiveProjectName,
      effectiveLocation,
    ]
  );

  const filteredMaterials = flattenedMaterials.filter((item) =>
    (item.name || "")
      .toString()
      .toLowerCase()
      .includes((searchTerm || "").toLowerCase())
  );

  const pendingCount = flattenedMaterials.filter(
    (m) => (m.status || "Pending").toLowerCase() === "pending"
  ).length;
  const materialRequestsCount = materialGroups.length;

  return (
    <div className="p-4 md:p-6 bg-white w-full min-h-[80vh] m-2 rounded-lg">
      <div className="flex items-center justify-between gap-4 mb-6">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Material"
          className="w-44"
        />
        <div className="flex items-center gap-6 whitespace-nowrap overflow-x-auto">
          <span className="text-sm text-gray-600 cursor-default">
            Pending To Receive{" "}
            <span className="font-semibold text-gray-800">({pendingCount})</span>
          </span>
          <span className="text-sm text-gray-600 cursor-default flex items-center gap-2">
            Material Requests
            <span className="text-xs bg-gray-300 rounded-full px-1">
              {materialRequestsCount}
            </span>
          </span>
          <Button
            variant="custom"
            className="flex items-center text-sm text-gray-600 gap-1 hover:text-black"
          >
            <FiDownload />
            Download
          </Button>
          <Button
            variant="custom"
            className="flex items-center bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded gap-2"
            onClick={() => setMaterialModal(true)}
          >
            <FiPlus />
            Add Material
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-start gap-2 mb-6">
        <Button
          variant="custom"
          onClick={() => setActiveTab("Material List")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            activeTab === "Material List"
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Material List
        </Button>
        <button
          onClick={() => setActiveTab("Recent Entries")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            activeTab === "Recent Entries"
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Recent Entries
        </button>
      </div>

      {activeTab === "Material List" && (
        <>
          {filteredMaterials.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <h2 className="text-lg font-semibold mb-2">Add Materials</h2>
              <p className="text-sm text-gray-600 mb-4 max-w-xl">
                You haven’t added any material data yet, you can upload material
                data or add manually
              </p>
              <Button
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                variant="custom"
                onClick={() => setMaterialModal(true)}
              >
                Add Received
                <FiPlus />
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Material</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">Unit</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Project</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map((mat, idx) => (
                    <tr
                      key={mat._id ?? idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-2">{mat.name}</td>
                      <td className="px-4 py-2">{mat.quantity}</td>
                      <td className="px-4 py-2">{mat.unit}</td>
                      <td className="px-4 py-2">
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {mat.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">{mat.project?.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === "Recent Entries" && (
        <div className="flex items-center justify-center h-64 text-gray-500">
          No recent entries yet
        </div>
      )}

      <MaterialLibraryDrawer
        isOpen={materialModal}
        onClose={() => setMaterialModal(false)}
        selectedProject={{
          _id: effectiveProjectId,
          name: effectiveProjectName,
          location: effectiveLocation,
        }}
        setMaterialGroups={setMaterialGroups}
        onAddMaterials={handleAddMaterials}
      />
    </div>
  );
}

// import React, { useState, useEffect, useMemo } from "react";
// import { FiDownload, FiPlus } from "react-icons/fi";
// import Button from "../../../components/Button";
// import SearchBar from "../../../components/SearchBar";
// import MaterialLibraryDrawer from "../Procurement/MaterialLibraryDrawer";
// import {
//   getMaterialsOfRFQ,
//   addMaterialsToRFQ,
// } from "../../../services/rfqServices";
// import { toast } from "react-toastify";
// import { fetchRFQProject } from "../../../services/rfqServices";
// // Redux
// import { useDispatch } from "react-redux";
// import { setSelectedMaterials } from "../../../app/features/pendingMaterials/pendingMaterialsSlice";

// export default function ProjectMaterials({
//   projectName,
//   rfqId,
//   projectId,
//   projectLocation,
//   project, // whole project if passed
// }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState("Material List");
//   const [materialModal, setMaterialModal] = useState(false);
//   const [materialGroups, setMaterialGroups] = useState([]); // normalized groups: [{ project, items: [] }]
//   const dispatch = useDispatch();

//   // derive effective project data
//   const effectiveProjectId = project?._id || projectId;
//   const effectiveProjectName = project?.name || projectName;
//   const effectiveLocation =
//     project?.deliveryLocation || projectLocation || "Main Warehouse";

//   // helper: normalize incoming data into groups of { project, items }
//   const normalizeGroups = (raw) => {
//     if (!Array.isArray(raw)) return [];
//     if (raw.length === 0) return [];
//     // case 1: grouped format already: [{ project, items }]
//     if (raw[0] && Array.isArray(raw[0].items)) return raw;
//     // case 2: flat materials array -> wrap into single group using effective project
//     return [
//       {
//         project: {
//           _id: effectiveProjectId,
//           name: effectiveProjectName,
//           deliveryLocation: effectiveLocation,
//         },
//         items: raw,
//       },
//     ];
//   };

//   // Load RFQ materials
//   useEffect(() => {
//     if (!rfqId) return;

//     (async () => {
//       try {
//         let data = await getMaterialsOfRFQ(rfqId);
//         // API shape guard: some services return { data: [...] } or [...] directly
//         data = data?.data ?? data;

//         const groups = normalizeGroups(data);

//         // build flattened materials for redux and counts
//         const materialsFlat = groups.flatMap((group) =>
//           (group.items || []).map((item) => ({
//             ...item,
//             project: {
//               _id: group.project?._id || effectiveProjectId,
//               name: group.project?.name || effectiveProjectName,
//               deliveryLocation:
//                 group.project?.deliveryLocation || effectiveLocation,
//             },
//             status: item.status || "Pending",
//           }))
//         );

//         setMaterialGroups(groups);
//         dispatch(setSelectedMaterials(materialsFlat));
//       } catch (err) {
//         console.error("Failed to load RFQ materials:", err);
//         toast.error("Failed to load materials");
//       }
//     })();
//   }, [
//     rfqId,
//     dispatch,
//     effectiveProjectId,
//     effectiveProjectName,
//     effectiveLocation,
//   ]);

//   // Add new materials
//   const handleAddMaterials = async (newMaterials) => {
//     if (!rfqId || !newMaterials || newMaterials.length === 0) return;

//     try {
//       const materialsWithProject = newMaterials.map((item) => ({
//         ...item,
//         project: {
//           _id: effectiveProjectId,
//           name: effectiveProjectName,
//           deliveryLocation: effectiveLocation,
//         },
//         status: item.status || "Pending",
//       }));

//       let updated = await addMaterialsToRFQ(rfqId, {
//         materials: materialsWithProject,
//       });
//       updated = updated?.data ?? updated;

//       const groups = normalizeGroups(updated);

//       const materialsFlat = groups.flatMap((group) =>
//         (group.items || []).map((item) => ({
//           ...item,
//           project: {
//             _id: group.project?._id || effectiveProjectId,
//             name: group.project?.name || effectiveProjectName,
//             deliveryLocation:
//               group.project?.deliveryLocation || effectiveLocation,
//           },
//           status: item.status || "Pending",
//         }))
//       );

//       setMaterialGroups(groups);
//       dispatch(setSelectedMaterials(materialsFlat));
//       toast.success("Materials added successfully!");
//       setMaterialModal(false);
//     } catch (err) {
//       console.error("Failed to add materials:", err.response?.data || err);
//       toast.error("Failed to add materials");
//     }
//   };

//   // flattened materials derived from groups
//   const flattenedMaterials = useMemo(
//     () =>
//       materialGroups.flatMap((group) =>
//         (group.items || []).map((item) => ({
//           ...item,
//           project: {
//             _id: group.project?._id || effectiveProjectId,
//             name: group.project?.name || effectiveProjectName,
//             deliveryLocation:
//               group.project?.deliveryLocation || effectiveLocation,
//           },
//           status: item.status || "Pending",
//         }))
//       ),
//     [
//       materialGroups,
//       effectiveProjectId,
//       effectiveProjectName,
//       effectiveLocation,
//     ]
//   );

//   // filtered by search
//   const filteredMaterials = flattenedMaterials.filter((item) =>
//     (item.name || "")
//       .toString()
//       .toLowerCase()
//       .includes((searchTerm || "").toLowerCase())
//   );

//   const pendingCount = flattenedMaterials.filter(
//     (m) => (m.status || "Pending").toLowerCase() === "pending"
//   ).length;
//   //eslint-disable-next-line
//   const totalCount = flattenedMaterials.length;
//   const materialRequestsCount = materialGroups.length; // keep existing behaviour

//   return (
//     <div className="p-4 md:p-6 bg-white w-full min-h-[80vh] m-2 rounded-lg">
//       {/* Top Bar: search left, stats & actions right (single line) */}
//       <div className="flex items-center justify-between gap-4 mb-6">
//         <div className="flex items-center gap-4">
//           <SearchBar
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Search Material"
//             className="w-44" // smaller search box
//           />
//         </div>

//         <div className="flex items-center gap-6 whitespace-nowrap overflow-x-auto">
//           <span className="text-sm text-gray-600 cursor-default">
//             Pending To Receive{" "}
//             <span className="font-semibold text-gray-800">({pendingCount})</span>
//           </span>

//           <span className="text-sm text-gray-600 cursor-default flex items-center gap-2">
//             Material Requests
//             <span className="text-xs bg-gray-300 rounded-full px-1">
//               {materialRequestsCount}
//             </span>
//           </span>

//           <Button
//             variant="custom"
//             className="flex items-center text-sm text-gray-600 gap-1 hover:text-black"
//           >
//             <FiDownload />
//             Download
//           </Button>

//           <Button
//             variant="custom"
//             className="flex items-center bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded gap-2"
//             onClick={() => setMaterialModal(true)}
//           >
//             <FiPlus />
//             Add Material
//           </Button>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex items-center justify-start gap-2 mb-6">
//         <Button
//           variant="custom"
//           onClick={() => setActiveTab("Material List")}
//           className={`px-4 py-1.5 rounded-full text-sm font-medium ${
//             activeTab === "Material List"
//               ? "bg-red-600 text-white"
//               : "bg-gray-100 text-gray-700"
//           }`}
//         >
//           Material List
//         </Button>
//         <button
//           onClick={() => setActiveTab("Recent Entries")}
//           className={`px-4 py-1.5 rounded-full text-sm font-medium ${
//             activeTab === "Recent Entries"
//               ? "bg-red-600 text-white"
//               : "bg-gray-100 text-gray-700"
//           }`}
//         >
//           Recent Entries
//         </button>
//       </div>

//       {/* Tab Content */}
//       {activeTab === "Material List" && (
//         <>
//           {filteredMaterials.length === 0 ? (
//             // Empty state centered like screenshot
//             <div className="flex flex-col items-center justify-center text-center py-12">
//               <h2 className="text-lg font-semibold mb-2">Add Materials</h2>
//               <p className="text-sm text-gray-600 mb-4 max-w-xl">
//                 You haven’t added any material data yet, you can upload material
//                 data or add manually
//               </p>
//               <Button
//                 className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
//                 variant="custom"
//                 onClick={() => setMaterialModal(true)}
//               >
//                 Add Received
//                 <FiPlus />
//               </Button>
//             </div>
//           ) : (
//             // Table of materials (horizontal scroll for small screens)
//             <div className="overflow-x-auto">
//               <table className="min-w-full border border-gray-200 text-sm">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="px-4 py-2 text-left">Material</th>
//                     <th className="px-4 py-2 text-left">Quantity</th>
//                     <th className="px-4 py-2 text-left">Unit</th>
//                     <th className="px-4 py-2 text-left">Status</th>
//                     <th className="px-4 py-2 text-left">Project</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredMaterials.map((mat, idx) => (
//                     <tr
//                       key={mat._id ?? idx}
//                       className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                     >
//                       <td className="px-4 py-2">{mat.name}</td>
//                       <td className="px-4 py-2">{mat.quantity}</td>
//                       <td className="px-4 py-2">{mat.unit}</td>
//                       <td className="px-4 py-2">
//                         <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//                           {mat.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-2">{mat.project?.name}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}

//       {activeTab === "Recent Entries" && (
//         <div className="flex items-center justify-center h-64 text-gray-500">
//           No recent entries yet
//         </div>
//       )}

//       {/* Drawer Modal */}
//       <MaterialLibraryDrawer
//         isOpen={materialModal}
//         onClose={() => setMaterialModal(false)}
//         selectedProject={{
//           _id: effectiveProjectId,
//           name: effectiveProjectName,
//           location: effectiveLocation,
//         }}
//         setMaterialGroups={setMaterialGroups}
//         onAddMaterials={handleAddMaterials}
//       />
//     </div>
//   );
// }
