
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
import { fetchTasksByProject } from "../../../services/overViewServices";
import { fetchAssignableUsers } from "../../../services/leadServices";
import DropDown from "../../../components/DropDown";

function ProjectToDo({ projectId, quoteId }) {
  const [deliverables, setDeliverables] = useState([]);
  const [tasks, setTasks] = useState([]); // ✅ Add tasks state
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMenuId, setActionMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [summary, setSummary] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [viewMode, setViewMode] = useState(quoteId ? "deliverables" : "tasks"); // ✅ "tasks" or "deliverables"
  const [assignableUsers, setAssignableUsers] = useState([]); // All team members for assignment
  const [updatingDeliverable, setUpdatingDeliverable] = useState(null); // Track which deliverable is being updated
  const [selectedSpace, setSelectedSpace] = useState(null); // Selected space for filtering deliverables
  const [availableSpaces, setAvailableSpaces] = useState([]); // List of all spaces from summary

  // ✅ Fetch Tasks
  const fetchTasks = async () => {
    try {
      if (!projectId) return;
      // Ensure projectId is a string
      const projectIdString = typeof projectId === 'string' ? projectId : (projectId?._id || projectId?.toString());
      if (!projectIdString) {
        console.warn("Invalid projectId:", projectId);
        return;
      }
      const data = await fetchTasksByProject(projectIdString);
      // Handle both { tasks: [...] } and array formats
      const tasksArray = Array.isArray(data) ? data : (data?.tasks || []);
      setTasks(tasksArray);
      if (viewMode === "tasks") {
        setFilteredItems(tasksArray);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      // Don't show error if it's just 404 (no tasks yet)
      if (error.response?.status !== 404) {
        toast.error("Failed to load tasks");
      }
      setTasks([]);
    }
  };

  // ✅ Fetch Deliverables
  const fetchDeliverables = async () => {
    try {
      if (!quoteId) return;
      // Ensure quoteId is a string (handle if it's an object)
      const quoteIdString = typeof quoteId === 'string' ? quoteId : (quoteId?._id || quoteId?.toString());
      if (!quoteIdString) {
        console.warn("Invalid quoteId:", quoteId);
        return;
      }
      const data = await getDeliverablesByQuoteId(quoteIdString);
      if (!data?.deliverables) return;
      setDeliverables(data.deliverables);
      if (viewMode === "deliverables") {
        setFilteredItems(data.deliverables);
      }
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
      // Ensure quoteId is a string (handle if it's an object)
      const quoteIdString = typeof quoteId === 'string' ? quoteId : (quoteId?._id || quoteId?.toString());
      if (!quoteIdString) {
        console.warn("Invalid quoteId:", quoteId);
        return;
      }
      const data = await fetchQuoteSummary(quoteIdString);
      if (Array.isArray(data)) {
        setSummary(data);
        // Extract unique spaces from summary
        const spaces = data
          .filter(s => s.space)
          .map(s => ({ name: s.space, id: s._id, spaceId: s.spaceId }))
          .filter((space, index, self) => 
            index === self.findIndex(s => s.name === space.name)
          );
        setAvailableSpaces(spaces);
        // Auto-select first space if none selected
        if (!selectedSpace && spaces.length > 0) {
          setSelectedSpace(spaces[0].name);
        }
      } else {
        setSummary([]);
        setAvailableSpaces([]);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      toast.error("Failed to fetch summary");
    } finally {
      setLoadingSummary(false);
    }
  };

  // Fetch assignable users (all team members)
  const fetchUsers = async () => {
    try {
      const users = await fetchAssignableUsers();
      setAssignableUsers(users || []);
    } catch (error) {
      console.error("Error fetching assignable users:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchDeliverables();
    fetchSummary();
    fetchUsers(); // Fetch team members
  }, [projectId, quoteId]);

  // ✅ Update filtered items when view mode or selected space changes
  useEffect(() => {
    if (viewMode === "tasks") {
      setFilteredItems(tasks);
    } else {
      // Filter deliverables by selected space
      if (selectedSpace) {
        const filtered = deliverables.filter(d => d.space === selectedSpace);
        setFilteredItems(filtered);
      } else {
        setFilteredItems(deliverables);
      }
    }
  }, [viewMode, tasks, deliverables, selectedSpace]);
  
  // ✅ Initial load - set filtered items based on view mode
  useEffect(() => {
    if (viewMode === "tasks" && tasks.length > 0) {
      setFilteredItems(tasks);
    } else if (viewMode === "deliverables") {
      setFilteredItems(deliverables);
    }
  }, [viewMode]);

  // ✅ Search Filter
  useEffect(() => {
    let filtered = viewMode === "tasks" ? tasks : deliverables;
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        (item.name || item.description || item.code || item.space || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredItems(filtered);
  }, [searchTerm, viewMode, tasks, deliverables]);

  // ✅ Update deliverable status or assignedTo
  const handleUpdateDeliverable = async (deliverable, field, value) => {
    try {
      if (!quoteId) {
        toast.error("Quote ID is missing");
        return;
      }
      setUpdatingDeliverable(deliverable._id);
      const updateData = { [field]: value };
      // Ensure quoteId is a string
      const quoteIdString = typeof quoteId === 'string' ? quoteId : (quoteId?._id || quoteId?.toString());
      await updateDeliverable(
        quoteIdString,
        deliverable.spaceId,
        deliverable._id,
        updateData
      );
      toast.success("Deliverable updated successfully");
      fetchDeliverables();
    } catch (error) {
      console.error("Error updating deliverable:", error);
      toast.error("Failed to update deliverable");
    } finally {
      setUpdatingDeliverable(null);
    }
  };

  // ✅ Edit / Save Deliverable (for other fields)
  const handleEdit = (deliverable) => {
    setEditingId(deliverable._id);
    setEditData({ ...deliverable });
    setActionMenuId(null);
  };

  const handleSave = async (deliverable) => {
    try {
      if (!quoteId) {
        toast.error("Quote ID is missing");
        return;
      }
      // Ensure quoteId is a string
      const quoteIdString = typeof quoteId === 'string' ? quoteId : (quoteId?._id || quoteId?.toString());
      await updateDeliverable(
        quoteIdString,
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
      if (!quoteId) {
        toast.error("Quote ID is missing");
        return;
      }
      // Ensure quoteId is a string
      const quoteIdString = typeof quoteId === 'string' ? quoteId : (quoteId?._id || quoteId?.toString());
      await deleteDeliverable(quoteIdString, deliverable.spaceId, deliverable._id);
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
          {/* View Mode Toggle */}
          <div className="flex gap-2 border rounded-md p-1">
            <button
              onClick={() => setViewMode("tasks")}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === "tasks"
                  ? "bg-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Tasks
            </button>
            {quoteId && (
              <button
                onClick={() => setViewMode("deliverables")}
                className={`px-3 py-1 text-sm rounded ${
                  viewMode === "deliverables"
                    ? "bg-red-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Deliverables
              </button>
            )}
          </div>
          <div className="w-60">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={viewMode === "tasks" ? "Search tasks" : "Search deliverables"}
            />
          </div>
          <Button
            className="text-red-600 text-sm flex items-center gap-1 hover:bg-red-200 cursor-pointer bg-red-100"
            onClick={() => setShowFilter(true)}
          >
            <FiFilter /> Filter
          </Button>
        </div>
        {viewMode === "tasks" && (
          <Button
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <FiPlus /> New Task
          </Button>
        )}
      </div>

      {/* Space Tabs (only for deliverables view) */}
      {viewMode === "deliverables" && availableSpaces.length > 0 && (
        <div className="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
          {availableSpaces.map((space) => (
            <button
              key={space.id || space.name}
              onClick={() => setSelectedSpace(space.name)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors ${
                selectedSpace === space.name
                  ? "bg-red-600 text-white border-b-2 border-red-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {space.name}
            </button>
          ))}
        </div>
      )}


      {/* ✅ Table - Tasks or Deliverables */}
      <div className="overflow-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm text-gray-700 border-collapse">
          <thead className="bg-red-100 text-left">
            {viewMode === "tasks" ? (
              <tr>
                <th className="px-2 py-2 text-center w-8">#</th>
                <th className="px-2 py-2 w-[25%]">Task Name</th>
                <th className="px-2 py-2 w-[15%]">Status</th>
                <th className="px-2 py-2 w-[15%]">Priority</th>
                <th className="px-2 py-2 w-[15%]">Assigned To</th>
                <th className="px-2 py-2 w-[12%]">Due Date</th>
                <th className="px-2 py-2 text-right w-[10%]">Value</th>
                <th className="px-2 py-2 text-right w-[8%]">Weight %</th>
                <th className="px-2 py-2 text-center w-20">Action</th>
              </tr>
            ) : (
              <tr>
                <th className="px-2 py-2 text-center w-8">#</th>
                <th className="px-2 py-2 w-20">Code</th>
                <th className="px-2 py-2 w-24">Category</th>
                <th className="px-2 py-2 w-[30%]">Description</th>
                <th className="px-1 py-2 text-center w-14">Unit</th>
                <th className="px-2 py-2 text-right w-16">Qty</th>
                <th className="px-2 py-2 text-right w-24">Rate</th>
                <th className="px-2 py-2 text-right w-16">GST</th>
                <th className="px-2 py-2 w-32">Status</th>
                <th className="px-2 py-2 w-40">Assigned To</th>
                <th className="px-2 py-2 w-32">Progress</th>
                <th className="px-2 py-2 text-center w-20">Photo</th>
              </tr>
            )}
          </thead>

          <tbody>
            {viewMode === "tasks" ? (
              // Tasks Table
              filteredItems.map((task, index) => (
                <tr
                  key={task._id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-2 py-2 text-center">{index + 1}</td>
                  <td className="px-2 py-2 truncate font-medium">{task.name || "-"}</td>
                  <td className="px-2 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.status === "DONE" ? "bg-green-100 text-green-800" :
                      task.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" :
                      task.status === "REVIEW" ? "bg-yellow-100 text-yellow-800" :
                      task.status === "REJECTED" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {task.status || "TODO"}
                    </span>
                  </td>
                  <td className="px-2 py-2">{task.priority || "-"}</td>
                  <td className="px-2 py-2 truncate">
                    {task.assignedTo?.name || "-"}
                  </td>
                  <td className="px-2 py-2">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-2 py-2 text-right">
                    ₹{task.value?.toLocaleString() || 0}
                  </td>
                  <td className="px-2 py-2 text-right">
                    {task.weight_pct || 0}%
                  </td>
                  <td className="px-2 py-2 text-center relative">
                    <button
                      className="text-gray-500 hover:text-black"
                      onClick={() =>
                        setActionMenuId(
                          actionMenuId === task._id ? null : task._id
                        )
                      }
                    >
                      <BsThreeDotsVertical />
                    </button>
                    {actionMenuId === task._id && (
                      <div className="absolute right-0 mt-1 w-32 bg-white border shadow-md rounded-md z-10">
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            setActionMenuId(null);
                            // TODO: Add edit functionality
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                          onClick={() => {
                            setActionMenuId(null);
                            // TODO: Add delete functionality
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              // Deliverables Table (Read-only)
              filteredItems.map((d, index) => (
                <tr
                  key={d._id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-2 py-2 text-center">{index + 1}</td>
                  <td className="px-2 py-2 truncate">{d.code || "-"}</td>
                  <td className="px-2 py-2 truncate">{d.category || "-"}</td>
                  <td className="px-2 py-2 truncate max-w-[200px]">
                    {d.description || "-"}
                  </td>
                  <td className="px-1 py-2 text-center">{d.unit || "-"}</td>
                  <td className="px-2 py-2 text-right">{d.qty || 0}</td>
                  <td className="px-2 py-2 text-right">
                    ₹{d.rate?.toLocaleString() || 0}
                  </td>
                  <td className="px-2 py-2 text-right">{d.gst || 0}%</td>
                  <td className="px-2 py-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      d.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                      d.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" :
                      d.status === "ON_HOLD" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {d.status || "PENDING"}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <span className="text-xs">
                      {d.assignedTo?.name || "Unassigned"}
                      {d.assignedTo?.role && (
                        <span className="text-gray-500 ml-1">({d.assignedTo.role})</span>
                      )}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            (d.progress || 0) === 100 ? "bg-green-600" :
                            (d.progress || 0) >= 50 ? "bg-blue-600" :
                            (d.progress || 0) > 0 ? "bg-yellow-500" :
                            "bg-gray-300"
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, d.progress || 0))}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-10 text-right">
                        {d.progress || 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-center">
                    {d.photo ? (
                      <img
                        src={d.photo}
                        alt="Deliverable"
                        className="w-10 h-10 object-cover rounded mx-auto"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {filteredItems.length === 0 && !viewMode && (
          <div className="p-6 text-center text-gray-500">
            {viewMode === "tasks"
              ? "No tasks found. Create a new task to get started."
              : "No deliverables found. Items from signed quotations will appear here."}
          </div>
        )}
        {filteredItems.length === 0 && viewMode === "tasks" && (
          <div className="p-6 text-center text-gray-500">
            No tasks found. Create a new task to get started.
          </div>
        )}
        {filteredItems.length === 0 && viewMode === "deliverables" && (
          <div className="p-6 text-center text-gray-500">
            No deliverables found. Items from signed quotations will appear here.
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
        onCreated={() => {
          if (viewMode === "tasks") {
            fetchTasks();
          } else {
            fetchDeliverables();
          }
        }}
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
