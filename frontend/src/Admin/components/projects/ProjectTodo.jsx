import React, { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiPlus, FiFilter } from "react-icons/fi";
import Button from "../../../components/Button";
import SearchBar from "../../../components/SearchBar";
import DropDown from "../../../components/DropDown";
import TodoFilter from "./TodoFilter";
import AddNewTodoModal from "./AddNewTodoModal";
import { toast } from "react-toastify";
import {
  getDeliverablesByQuoteId,
  updateDeliverable,
  deleteDeliverable,
} from "../../../services/quoteServices";
import { formatDate } from "../../../utils/dateFormatter";

function ProjectToDo({ projectId, quoteId }) {
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [deliverables, setDeliverables] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMenuId, setActionMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // ✅ Fetch deliverables from backend
  const fetchDeliverables = async () => {
    try {
      if (!quoteId) {
        console.warn("Quote ID missing, cannot fetch deliverables");
        return;
      }
      const data = await getDeliverablesByQuoteId(quoteId);
      setDeliverables(data);
      setFilteredItems(data);
    } catch (error) {
      console.error("Error fetching deliverables:", error);
      toast.error("Failed to load deliverables");
    }
  };

  useEffect(() => {
    fetchDeliverables();
  }, [quoteId]);

  // ✅ Filter deliverables
  useEffect(() => {
    let filtered = deliverables;
    if (status)
      filtered = filtered.filter(
        (item) =>
          item.status?.toLowerCase() === status.toLowerCase()
      );
    if (searchTerm)
      filtered = filtered.filter((item) =>
        item.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredItems(filtered);
  }, [status, searchTerm, deliverables]);

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
    <div className="p-8 m-4 md:p-6 space-y-4 bg-white w-full rounded-xl">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
          <div className="w-40">
            <DropDown
              name="status"
              value={status}
              options={["Pending", "Completed"]}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
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

      {/* Table */}
      <div className="overflow-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-red-100 text-left">
            <tr>
              <th className="px-4 py-2">S.No</th>
              <th className="px-4 py-2">Item Name</th>
              <th className="px-4 py-2">Due Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((d, index) => (
              <tr key={d._id} className="border-t">
                <td className="px-4 py-3">{index + 1}</td>

                {/* Item Name */}
                <td className="px-4 py-3">
                  {editingId === d._id ? (
                    <input
                      type="text"
                      value={editData.itemName || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, itemName: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    d.itemName || "-"
                  )}
                </td>

                {/* Due Date */}
                <td className="px-4 py-3 text-red-600 font-medium">
                  {editingId === d._id ? (
                    <input
                      type="date"
                      value={editData.dueDate?.split("T")[0] || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, dueDate: e.target.value })
                      }
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    formatDate(d.dueDate)
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  {editingId === d._id ? (
                    <DropDown
                      name="status"
                      value={editData.status || ""}
                      options={["Pending", "Completed"]}
                      onChange={(e) =>
                        setEditData({ ...editData, status: e.target.value })
                      }
                    />
                  ) : (
                    d.status || "-"
                  )}
                </td>

                {/* Description */}
                <td className="px-4 py-3 max-w-xs truncate">
                  {editingId === d._id ? (
                    <input
                      type="text"
                      value={editData.description || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    d.description || "-"
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 relative">
                  {editingId === d._id ? (
                    <button
                      className="text-green-600 hover:text-green-800"
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
                        <div className="absolute right-0 mt-2 w-32 bg-white border shadow-md rounded-md z-10">
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
      </div>

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
// import { fetchTodosByProject, updateTodo, deleteTodo } from "../../../services/todoServices";
// import { formatDate } from "../../../utils/dateFormatter";
// import { toast } from "react-toastify";
// import { getDeliverablesByQuoteId } from "../../../services/quoteServices";
// function ProjectToDo({ projectId ,quoteId}) {
//   const [status, setStatus] = useState("");
//   const [type, setType] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilter, setShowFilter] = useState(false);
//   const [todos, setTodos] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [actionMenuId, setActionMenuId] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState({});

//   // Fetch todos
//   const getTodos = async () => {
//     try {
//       if (!projectId) return;
//       const data = await fetchTodosByProject(projectId);
//       setTodos(data);
//       setFilteredItems(data);
//     } catch (error) {
//       toast.error("Error fetching todos");
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     getTodos();
//     // eslint-disable-next-line
//   }, [projectId]);

//   // Filters
//   useEffect(() => {
//     let filtered = todos;
//     if (status) filtered = filtered.filter((todo) => todo.status === status);
//     if (type) filtered = filtered.filter((todo) => todo.type === type);
//     if (searchTerm)
//       filtered = filtered.filter((todo) =>
//         todo.itemName.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     setFilteredItems(filtered);
//   }, [status, type, searchTerm, todos]);

//   // Edit / Save handlers
//   const handleEdit = (todo) => {
//     setEditingId(todo._id);
//     setEditData({ ...todo });
//     setActionMenuId(null);
//   };

//   const handleSave = async (todoId) => {
//     try {
//       // Prepare payload for backend
//       const updatedFields = {
//         itemName: editData.itemName,
//         dueDate: editData.dueDate,
//         assigned: editData.assigned.map((u) => u._id || u.name),
//         type: editData.type,
//         status: editData.status,
//         description: editData.description || "",
//         projectId: editData.projectId?._id || editData.projectId,
//       };

//       await updateTodo(todoId, updatedFields);
//       toast.success("Todo updated successfully");
//       setEditingId(null);
//       setEditData({});
//       getTodos();
//     } catch (error) {
//       toast.error("Failed to update todo");
//       console.error(error);
//     }
//   };

//   const handleDelete = async (todoId) => {
//     try {
//       await deleteTodo(todoId);
//       toast.success("Todo deleted successfully");
//       getTodos();
//       setActionMenuId(null);
//     } catch (error) {
//       toast.error("Failed to delete todo");
//     }
//   };

//   return (
//     <div className="p-8 m-4 md:p-6 space-y-4 bg-white w-full rounded-xl">
//       {/* Filters */}
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
//           <div className="w-40">
//             <DropDown
//               name="status"
//               value={status}
//               options={["Pending", "Completed"]}
//               onChange={(e) => setStatus(e.target.value)}
//             />
//           </div>
//           <div className="w-40">
//             <DropDown
//               name="type"
//               value={type}
//               options={["Plumbing", "Electrical"]}
//               onChange={(e) => setType(e.target.value)}
//             />
//           </div>
//           <div className="w-60">
//             <SearchBar
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search"
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
//           <FiPlus /> New To Do
//         </Button>
//       </div>

//       {/* Table */}
//       <div className="overflow-auto rounded-xl border border-gray-200">
//         <table className="min-w-full text-sm text-gray-700">
//           <thead className="bg-red-100 text-left">
//             <tr>
//               <th className="px-4 py-2">S.No</th>
//               <th className="px-4 py-2">Item Name</th>
//               <th className="px-4 py-2">Due Date</th>
//               <th className="px-4 py-2">Assigned</th>
//               <th className="px-4 py-2">Project</th>
//               <th className="px-4 py-2">Type</th>
//               <th className="px-4 py-2">Status</th>
//               <th className="px-4 py-2">Description</th>
//               <th className="px-4 py-2">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredItems.map((todo, index) => (
//               <tr key={todo._id} className="border-t">
//                 <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>

//                 <td className="px-4 py-3 max-w-xs truncate">
//                   {editingId === todo._id ? (
//                     <input
//                       type="text"
//                       value={editData.itemName}
//                       onChange={(e) =>
//                         setEditData({ ...editData, itemName: e.target.value })
//                       }
//                       className="border rounded px-2 py-1 w-full"
//                     />
//                   ) : (
//                     <span className="block truncate">{todo.itemName}</span>
//                   )}
//                 </td>

//                 <td className="px-4 py-3 text-red-600 font-medium whitespace-nowrap">
//                   {editingId === todo._id ? (
//                     <input
//                       type="date"
//                       value={editData.dueDate?.split("T")[0]}
//                       onChange={(e) =>
//                         setEditData({ ...editData, dueDate: e.target.value })
//                       }
//                       className="border rounded px-2 py-1"
//                     />
//                   ) : (
//                     formatDate(todo.dueDate)
//                   )}
//                 </td>

//                 <td className="px-4 py-3 max-w-xs truncate">
//                   {editingId === todo._id ? (
//                     <input
//                       type="text"
//                       value={editData.assigned.map((u) => u.name).join(", ")}
//                       onChange={(e) =>
//                         setEditData({
//                           ...editData,
//                           assigned: e.target.value
//                             .split(",")
//                             .map((name) => ({ name: name.trim() })),
//                         })
//                       }
//                       className="border rounded px-2 py-1 w-full"
//                     />
//                   ) : (
//                     todo.assigned.map((u) => u.name || "User").join(", ")
//                   )}
//                 </td>

//                 <td className="px-4 py-3 max-w-xs truncate">{todo.project}</td>

//                 <td className="px-4 py-3 whitespace-nowrap">
//                   {editingId === todo._id ? (
//                     <DropDown
//                       name="type"
//                       value={editData.type}
//                       options={["Plumbing", "Electrical"]}
//                       onChange={(e) =>
//                         setEditData({ ...editData, type: e.target.value })
//                       }
//                     />
//                   ) : (
//                     <span>{todo.type}</span>
//                   )}
//                 </td>

//                 <td className="px-4 py-3 whitespace-nowrap">
//                   {editingId === todo._id ? (
//                     <DropDown
//                       name="status"
//                       value={editData.status}
//                       options={["Pending", "Completed"]}
//                       onChange={(e) =>
//                         setEditData({ ...editData, status: e.target.value })
//                       }
//                     />
//                   ) : (
//                     todo.status
//                   )}
//                 </td>

//                 <td className="px-4 py-3 max-w-xs break-words">
//                   {editingId === todo._id ? (
//                     <input
//                       type="text"
//                       value={editData.description || ""}
//                       onChange={(e) =>
//                         setEditData({ ...editData, description: e.target.value })
//                       }
//                       className="border rounded px-2 py-1 w-full"
//                     />
//                   ) : (
//                     <span className="line-clamp-3">{todo.description || "No Description Added"}</span>
//                   )}
//                 </td>

//                 <td className="px-4 py-3 relative whitespace-nowrap">
//                   {editingId === todo._id ? (
//                     <button
//                       className="text-green-600 hover:text-green-800"
//                       onClick={() => handleSave(todo._id)}
//                     >
//                       Save
//                     </button>
//                   ) : (
//                     <>
//                       <button
//                         className="text-gray-500 hover:text-black"
//                         onClick={() =>
//                           setActionMenuId(
//                             actionMenuId === todo._id ? null : todo._id
//                           )
//                         }
//                       >
//                         <BsThreeDotsVertical />
//                       </button>
//                       {actionMenuId === todo._id && (
//                         <div className="absolute right-0 mt-2 w-32 bg-white border shadow-md rounded-md z-10">
//                           <button
//                             className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                             onClick={() => handleEdit(todo)}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
//                             onClick={() => handleDelete(todo._id)}
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
//         onCreated={getTodos}
//         projectId={projectId}
//       />
//     </div>
//   );
// }

// export default ProjectToDo;
