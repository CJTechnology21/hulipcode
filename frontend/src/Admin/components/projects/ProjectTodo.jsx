
import React, { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiPlus, FiFilter } from "react-icons/fi";
import Button from "../../../components/Button";
import SearchBar from "../../../components/SearchBar";
import TodoFilter from "./TodoFilter";
import AddNewTodoModal from "./AddNewTodoModal";
import { toast } from "react-toastify";
import {
  getDeliverablesByQuoteId,
  updateDeliverable,
  deleteDeliverable,
  fetchQuoteSummary,
} from "../../../services/quoteServices";

function ProjectToDo({ projectId, quoteId }) {
  const [deliverables, setDeliverables] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMenuId, setActionMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [summary, setSummary] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState("");

  // ✅ Fetch Deliverables
  const fetchDeliverables = async () => {
    try {
      if (!quoteId) return;
      const data = await getDeliverablesByQuoteId(quoteId);
      if (!data?.deliverables) return;
      setDeliverables(data.deliverables);
      setFilteredItems(data.deliverables);
    } catch (error) {
      console.error("Error fetching deliverables:", error);
      toast.error("Failed to load deliverables");
    }
  };

  // ✅ Fetch Quote Summary
  const fetchSummary = async () => {
    if (!quoteId) return;
    try {
      setLoadingSummary(true);
      const data = await fetchQuoteSummary(quoteId);
      if (Array.isArray(data)) {
        setSummary(data);
        if (data.length > 0 && !selectedSpace) {
          setSelectedSpace(data[0].space);
        }
      } else setSummary([]);
    } catch (error) {
      console.error("Error fetching summary:", error);
      toast.error("Failed to fetch summary");
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    fetchDeliverables();
    fetchSummary();
  }, [quoteId]);

  // ✅ Filter by selected space
  useEffect(() => {
    if (!selectedSpace) {
      setFilteredItems([]);
      return;
    }
    const filtered = deliverables.filter(
      (d) => d.space?.toLowerCase() === selectedSpace.toLowerCase()
    );
    setFilteredItems(filtered);
  }, [selectedSpace, deliverables]);

  // ✅ Search Filter
  useEffect(() => {
    let filtered = deliverables.filter(
      (d) => d.space?.toLowerCase() === selectedSpace.toLowerCase()
    );
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredItems(filtered);
  }, [searchTerm]);

  // ✅ Edit / Save Deliverable
  const handleEdit = (deliverable) => {
    setEditingId(deliverable._id);
    setEditData({ ...deliverable });
    setActionMenuId(null);
  };

  const handleSave = async (deliverable) => {
    try {
      await updateDeliverable(
        quoteId,
        deliverable.spaceId,
        deliverable._id,
        editData
      );
      toast.success("Deliverable updated successfully");
      setEditingId(null);
      setEditData({});
      fetchDeliverables();
    } catch (error) {
      console.error("Error updating deliverable:", error);
      toast.error("Failed to update deliverable");
    }
  };

  // ✅ Delete Deliverable
  const handleDelete = async (deliverable) => {
    try {
      await deleteDeliverable(quoteId, deliverable.spaceId, deliverable._id);
      toast.success("Deliverable deleted successfully");
      fetchDeliverables();
      setActionMenuId(null);
    } catch (error) {
      console.error("Error deleting deliverable:", error);
      toast.error("Failed to delete deliverable");
    }
  };

  return (
    <div className="p-8 m-4 md:p-6 space-y-6 bg-white w-full rounded-xl shadow-sm">
      {/* Header Tools */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
          <div className="w-60">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search deliverables"
            />
          </div>
          <Button
            className="text-red-600 text-sm flex items-center gap-1 hover:bg-red-200 cursor-pointer bg-red-100"
            onClick={() => setShowFilter(true)}
          >
            <FiFilter /> Filter
          </Button>
        </div>
        <Button
          className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <FiPlus /> New Deliverable
        </Button>
      </div>

      {/* ✅ Scrollable Room Tabs */}
      <div className="overflow-x-auto border-b border-gray-200">
        <div className="flex space-x-4 min-w-max">
          {summary.map((room, index) => (
            <button
              key={room._id || index}
              onClick={() => setSelectedSpace(room.space)}
              className={`px-4 py-3 font-semibold whitespace-nowrap transition-all ${
                selectedSpace === room.space
                  ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                  : "text-gray-600 hover:text-red-600"
              }`}
            >
              {room.space}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Compact & Properly Aligned Table */}
      <div className="overflow-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm text-gray-700 border-collapse">
          <thead className="bg-red-100 text-left">
            <tr>
              <th className="px-2 py-2 text-center w-8">#</th>
              <th className="px-2 py-2 w-20">Code</th>
              <th className="px-2 py-2 w-28">Category</th>
              <th className="px-2 py-2 w-[38%]">Description</th>
              <th className="px-1 py-2 text-center w-14">Unit</th>
              <th className="px-2 py-2 text-right w-16">Qty</th>
              <th className="px-2 py-2 text-right w-24">Rate</th>
              <th className="px-2 py-2 text-right w-16">GST</th>
              <th className="px-2 py-2 text-center w-20">Photo</th>
              <th className="px-2 py-2 text-center w-20">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((d, index) => (
              <tr
                key={d._id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-2 py-2 text-center">{index + 1}</td>
                <td className="px-2 py-2 truncate">{d.code || "-"}</td>
                <td className="px-2 py-2 truncate">{d.category || "-"}</td>
                <td className="px-2 py-2 truncate max-w-[260px]">
                  {d.description || "-"}
                </td>
                <td className="px-1 py-2 text-center">{d.unit || "-"}</td>
                <td className="px-2 py-2 text-right">{d.qty || 0}</td>
                <td className="px-2 py-2 text-right">
                  ₹{d.rate?.toLocaleString() || 0}
                </td>
                <td className="px-2 py-2 text-right">{d.gst || 0}%</td>
                <td className="px-2 py-2 text-center">
                  {d.photo ? (
                    <img
                      src={d.photo}
                      alt="deliverable"
                      className="w-8 h-8 rounded object-cover mx-auto"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-2 py-2 text-center relative">
                  {editingId === d._id ? (
                    <button
                      className="text-green-600 hover:text-green-800 font-medium"
                      onClick={() => handleSave(d)}
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        className="text-gray-500 hover:text-black"
                        onClick={() =>
                          setActionMenuId(
                            actionMenuId === d._id ? null : d._id
                          )
                        }
                      >
                        <BsThreeDotsVertical />
                      </button>
                      {actionMenuId === d._id && (
                        <div className="absolute right-0 mt-1 w-32 bg-white border shadow-md rounded-md z-10">
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={() => handleEdit(d)}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                            onClick={() => handleDelete(d)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredItems.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            {selectedSpace
              ? "No deliverables found for this space."
              : "Select a space to view deliverables."}
          </div>
        )}
      </div>

      {/* Modals */}
      <TodoFilter
        show={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={(filters) => {
          setFilteredItems(filters);
          setShowFilter(false);
        }}
      />

      <AddNewTodoModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onCreated={fetchDeliverables}
        projectId={projectId}
      />
    </div>
  );
}

export default ProjectToDo;


// import React, { useState, useEffect } from "react";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { FiPlus, FiFilter } from "react-icons/fi";
// import Button from "../../../components/Button";
// import SearchBar from "../../../components/SearchBar";
// import DropDown from "../../../components/DropDown";
// import TodoFilter from "./TodoFilter";
// import AddNewTodoModal from "./AddNewTodoModal";
// import { toast } from "react-toastify";
// import {
//   getDeliverablesByQuoteId,
//   updateDeliverable,
//   deleteDeliverable,
// } from "../../../services/quoteServices";

// function ProjectToDo({ projectId, quoteId }) {
//   const [status, setStatus] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilter, setShowFilter] = useState(false);
//   const [deliverables, setDeliverables] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [actionMenuId, setActionMenuId] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState({});

//   // ✅ Fetch deliverables from backend
//   const fetchDeliverables = async () => {
//     try {
//       if (!quoteId) {
//         console.warn("⚠️ Quote ID missing — cannot fetch deliverables");
//         return;
//       }

//       console.log("Fetching deliverables for quote:", quoteId);
//       const data = await getDeliverablesByQuoteId(quoteId);

//       if (!data || !Array.isArray(data.deliverables)) {
//         console.error("❌ Unexpected response format:", data);
//         toast.error("Invalid data format received from server");
//         return;
//       }

//       console.log("✅ Deliverables fetched:", data.deliverables);
//       setDeliverables(data.deliverables);
//       setFilteredItems(data.deliverables);
//     } catch (error) {
//       console.error("❌ Error fetching deliverables:", error);
//       toast.error("Failed to load deliverables");
//     }
//   };

//   useEffect(() => {
//     fetchDeliverables();
//   }, [quoteId]);

//   // ✅ Filter deliverables
//   useEffect(() => {
//     let filtered = deliverables;
//     if (searchTerm)
//       filtered = filtered.filter((item) =>
//         item.description?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     setFilteredItems(filtered);
//   }, [status, searchTerm, deliverables]);

//   // ✅ Edit / Save Deliverable
//   const handleEdit = (deliverable) => {
//     setEditingId(deliverable._id);
//     setEditData({ ...deliverable });
//     setActionMenuId(null);
//   };

//   const handleSave = async (deliverable) => {
//     try {
//       await updateDeliverable(
//         quoteId,
//         deliverable.spaceId,
//         deliverable._id,
//         editData
//       );
//       toast.success("Deliverable updated successfully");
//       setEditingId(null);
//       setEditData({});
//       fetchDeliverables();
//     } catch (error) {
//       console.error("❌ Error updating deliverable:", error);
//       toast.error("Failed to update deliverable");
//     }
//   };

//   // ✅ Delete Deliverable
//   const handleDelete = async (deliverable) => {
//     try {
//       await deleteDeliverable(quoteId, deliverable.spaceId, deliverable._id);
//       toast.success("Deliverable deleted successfully");
//       fetchDeliverables();
//       setActionMenuId(null);
//     } catch (error) {
//       console.error("❌ Error deleting deliverable:", error);
//       toast.error("Failed to delete deliverable");
//     }
//   };

//   return (
//     <div className="p-8 m-4 md:p-6 space-y-4 bg-white w-full rounded-xl">
//       {/* Filters */}
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
//           <div className="w-60">
//             <SearchBar
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search deliverables"
//             />
//           </div>
//           <Button
//             className="text-red-600 text-sm flex items-center gap-1 hover:bg-red-200 cursor-pointer bg-red-100"
//             onClick={() => setShowFilter(true)}
//           >
//             <FiFilter /> Filter
//           </Button>
//         </div>
//         <Button
//           className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2"
//           onClick={() => setIsModalOpen(true)}
//         >
//           <FiPlus /> New Deliverable
//         </Button>
//       </div>

//       {/* Table */}
//       <div className="overflow-auto rounded-xl border border-gray-200">
//         <table className="min-w-full text-sm text-gray-700">
//           <thead className="bg-red-100 text-left">
//             <tr>
//               <th className="px-4 py-2">S.No</th>
//               <th className="px-4 py-2">Code</th>
//               <th className="px-4 py-2">Category</th>
//               <th className="px-4 py-2">Description</th>
//               <th className="px-4 py-2">Specification</th>
//               <th className="px-4 py-2">Unit</th>
//               <th className="px-4 py-2">Qty</th>
//               <th className="px-4 py-2">Rate</th>
//               <th className="px-4 py-2">GST</th>
//               <th className="px-4 py-2">Space</th>
//               <th className="px-4 py-2">Photo</th>
//               <th className="px-4 py-2">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredItems.map((d, index) => (
//               <tr key={d._id} className="border-t">
//                 <td className="px-4 py-3">{index + 1}</td>

//                 {/* Code */}
//                 <td className="px-4 py-3">{d.code || "-"}</td>

//                 {/* Category */}
//                 <td className="px-4 py-3">
//                   {editingId === d._id ? (
//                     <input
//                       type="text"
//                       value={editData.category || ""}
//                       onChange={(e) =>
//                         setEditData({ ...editData, category: e.target.value })
//                       }
//                       className="border rounded px-2 py-1 w-full"
//                     />
//                   ) : (
//                     d.category || "-"
//                   )}
//                 </td>

//                 {/* Description */}
//                 <td className="px-4 py-3 max-w-xs truncate">
//                   {editingId === d._id ? (
//                     <input
//                       type="text"
//                       value={editData.description || ""}
//                       onChange={(e) =>
//                         setEditData({
//                           ...editData,
//                           description: e.target.value,
//                         })
//                       }
//                       className="border rounded px-2 py-1 w-full"
//                     />
//                   ) : (
//                     d.description || "-"
//                   )}
//                 </td>

//                 {/* Spec */}
//                 <td className="px-4 py-3">{d.spec || "-"}</td>

//                 {/* Unit */}
//                 <td className="px-4 py-3">{d.unit || "-"}</td>

//                 {/* Qty */}
//                 <td className="px-4 py-3">{d.qty || 0}</td>

//                 {/* Rate */}
//                 <td className="px-4 py-3">₹{d.rate?.toLocaleString() || 0}</td>

//                 {/* GST */}
//                 <td className="px-4 py-3">{d.gst || 0}%</td>

//                 {/* Space */}
//                 <td className="px-4 py-3">{d.space || "-"}</td>

//                 {/* Photo */}
//                 <td className="px-4 py-3">
//                   {d.photo ? (
//                     <img
//                       src={d.photo}
//                       alt="deliverable"
//                       className="w-12 h-12 object-cover rounded"
//                     />
//                   ) : (
//                     "-"
//                   )}
//                 </td>

//                 {/* Actions */}
//                 <td className="px-4 py-3 relative">
//                   {editingId === d._id ? (
//                     <button
//                       className="text-green-600 hover:text-green-800"
//                       onClick={() => handleSave(d)}
//                     >
//                       Save
//                     </button>
//                   ) : (
//                     <>
//                       <button
//                         className="text-gray-500 hover:text-black"
//                         onClick={() =>
//                           setActionMenuId(
//                             actionMenuId === d._id ? null : d._id
//                           )
//                         }
//                       >
//                         <BsThreeDotsVertical />
//                       </button>
//                       {actionMenuId === d._id && (
//                         <div className="absolute right-0 mt-2 w-32 bg-white border shadow-md rounded-md z-10">
//                           <button
//                             className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                             onClick={() => handleEdit(d)}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
//                             onClick={() => handleDelete(d)}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {filteredItems.length === 0 && (
//           <div className="p-6 text-center text-gray-500">No deliverables found.</div>
//         )}
//       </div>

//       <TodoFilter
//         show={showFilter}
//         onClose={() => setShowFilter(false)}
//         onApply={(filters) => {
//           setFilteredItems(filters);
//           setShowFilter(false);
//         }}
//       />

//       <AddNewTodoModal
//         isOpen={isModalOpen}
//         setIsOpen={setIsModalOpen}
//         onCreated={fetchDeliverables}
//         projectId={projectId}
//       />
//     </div>
//   );
// }

// export default ProjectToDo;
