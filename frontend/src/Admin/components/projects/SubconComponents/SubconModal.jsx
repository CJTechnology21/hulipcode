import React, { useState, useEffect } from "react";
import DropDown from "../../../../components/DropDown";
import Button from "../../../../components/Button";
import { toast } from "react-toastify";
import { fetchStaffByType } from "../../../../services/staffServices";
import { getTaskName } from "../../../../services/taskServices";
import { getTodoName } from "../../../../services/todoServices";
import { createSubcon, updateSubcon } from "../../../../services/subConServices";
import { useAuth } from "../../../../context/AuthContext";

function SubconModal({ isOpen, onClose, projectId, initialData, onSuccess }) {
  const { user } = useAuth();

  const [todos, setTodos] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [staff, setStaff] = useState([]);

  const [formData, setFormData] = useState({
    todo: { id: "", name: "" },
    task: { id: "", name: "" },
    staff: { id: "", name: "" },
    amount: "",
    startDate: "",
    endDate: "",
    notes: "",
    status: "pending",
  });

  // Preload form for edit
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        todo: { id: initialData.todo?._id || "", name: initialData.todo?.itemName || "" },
        task: { id: initialData.task?._id || "", name: initialData.task?.name || initialData.task?.title || "" },
        staff: { id: initialData.staff?._id || "", name: initialData.staff?.name || "" },
        amount: initialData.amount || "",
        startDate: initialData.startDate ? initialData.startDate.split("T")[0] : "",
        endDate: initialData.endDate ? initialData.endDate.split("T")[0] : "",
        notes: initialData.notes || "",
        status: initialData.status || "pending",
      });
    } else if (isOpen && !initialData) {
      setFormData({
        todo: { id: "", name: "" },
        task: { id: "", name: "" },
        staff: { id: "", name: "" },
        amount: "",
        startDate: "",
        endDate: "",
        notes: "",
        status: "pending",
      });
    }
  }, [isOpen, initialData]);

  // Fetch dropdown data
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const todoData = await getTodoName(projectId);
        const taskData = await getTaskName(projectId);
        const staffData = await fetchStaffByType();
        setTodos(Array.isArray(todoData) ? todoData : todoData?.todos || []);
        setTasks(Array.isArray(taskData) ? taskData : taskData?.tasks || []);
        setStaff(Array.isArray(staffData) ? staffData : staffData?.staff || []);
      } catch {
        toast.error("Failed to fetch dropdown data");
      }
    })();
  }, [isOpen, projectId]);

  // Handle dropdown changes
  const handleDropdownChange = (name, value, label) => {
    setFormData(prev => {
      if (name === "todo") return { ...prev, todo: { id: value, name: label }, task: { id: "", name: "" } };
      if (name === "task") return { ...prev, task: { id: value, name: label }, todo: { id: "", name: "" } };
      if (name === "staff") return { ...prev, staff: { id: value, name: label } };
      return prev;
    });
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.staff.id || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.todo.id && !formData.task.id) {
      toast.error("Please select either a Todo or a Task");
      return;
    }

    const payload = {
      projectId,
      todo: formData.todo.id || null,
      task: formData.task.id || null,
      staff: formData.staff.id,
      architectId: user._id,
      amount: formData.amount,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      notes: formData.notes || "",
      status: formData.status || "pending",
    };

    console.log("Submitting payload:", payload);

    try {
      if (initialData) {
        await updateSubcon(initialData._id, payload);
        toast.success("Sub-Con Work Order updated successfully!");
      } else {
        await createSubcon(payload);
        toast.success("Sub-Con Work Order created successfully!");
      }
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Save Sub-Con Error:", error);
      toast.error("Failed to save Sub-Con Work Order");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full sm:max-w-md md:max-w-lg lg:max-w-xl rounded-2xl shadow-lg p-4 sm:p-6 relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
          {initialData ? "Edit Sub-Con Work Order" : "Create Sub-Con Work Order"}
        </h2>

        <div className="space-y-4 sm:space-y-6">
          <DropDown
            label="Todo"
            name="todo"
            value={formData.todo.id}
            options={todos.map(t => ({ value: t._id, label: t.itemName }))}
            onChange={e => {
              const selected = todos.find(t => t._id === e.target.value);
              handleDropdownChange("todo", e.target.value, selected?.itemName || "");
            }}
          />

          <DropDown
            label="Task"
            name="task"
            value={formData.task.id}
            options={tasks.map(t => ({ value: t._id, label: t.name || t.title }))}
            onChange={e => {
              const selected = tasks.find(t => t._id === e.target.value);
              handleDropdownChange("task", e.target.value, selected?.name || selected?.title || "");
            }}
          />

          <DropDown
            label="Staff"
            name="staff"
            value={formData.staff.id}
            options={staff.map(s => ({ value: s._id, label: s.name }))}
            onChange={e => {
              const selected = staff.find(s => s._id === e.target.value);
              handleDropdownChange("staff", e.target.value, selected?.name || "");
            }}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quote Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 sm:gap-3">
          <Button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg w-full sm:w-auto">
            {initialData ? "Update Order" : "Create Order"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SubconModal;

// import React, { useState, useEffect } from "react";
// import DropDown from "../../../../components/DropDown";
// import Button from "../../../../components/Button";
// import { toast } from "react-toastify";
// import { fetchStaffByType } from "../../../../services/staffServices";
// import { getTaskName } from "../../../../services/taskServices";
// import { getTodoName } from "../../../../services/todoServices";
// import { createSubcon, updateSubcon } from "../../../../services/subConServices";
// import { useAuth } from "../../../../context/AuthContext";

// function SubconModal({ isOpen, onClose, projectId, initialData, onSuccess }) {
//   const { user } = useAuth();

//   const [todos, setTodos] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [staff, setStaff] = useState([]);

//   const [formData, setFormData] = useState({
//     todo: { id: "", name: "" },
//     task: { id: "", name: "" },
//     staff: { id: "", name: "" },
//     amount: "",
//     startDate: "",
//     endDate: "",
//     notes: "",
//     status: "pending",
//   });

//   // Preload form for edit
//   useEffect(() => {
//     if (isOpen && initialData) {
//       setFormData({
//         todo: { id: initialData.todo?._id || "", name: initialData.todo?.itemName || "" },
//         task: { id: initialData.task?._id || "", name: initialData.task?.name || initialData.task?.title || "" },
//         staff: { id: initialData.staff?._id || "", name: initialData.staff?.name || "" },
//         amount: initialData.amount || "",
//         startDate: initialData.startDate ? initialData.startDate.split("T")[0] : "",
//         endDate: initialData.endDate ? initialData.endDate.split("T")[0] : "",
//         notes: initialData.notes || "",
//         status: initialData.status || "pending",
//       });
//     } else if (isOpen && !initialData) {
//       setFormData({
//         todo: { id: "", name: "" },
//         task: { id: "", name: "" },
//         staff: { id: "", name: "" },
//         amount: "",
//         startDate: "",
//         endDate: "",
//         notes: "",
//         status: "pending",
//       });
//     }
//   }, [isOpen, initialData]);

//   // Fetch dropdown data
//   useEffect(() => {
//     if (!isOpen) return;
//     (async () => {
//       try {
//         const todoData = await getTodoName(projectId);
//         const taskData = await getTaskName(projectId);
//         const staffData = await fetchStaffByType();
//         setTodos(Array.isArray(todoData) ? todoData : todoData?.todos || []);
//         setTasks(Array.isArray(taskData) ? taskData : taskData?.tasks || []);
//         setStaff(Array.isArray(staffData) ? staffData : staffData?.staff || []);
//       } catch {
//         toast.error("Failed to fetch dropdown data");
//       }
//     })();
//   }, [isOpen, projectId]);

//   const handleDropdownChange = (name, value, label) => {
//     setFormData(prev => ({ ...prev, [name]: { id: value, name: label } }));
//   };

//   const handleInputChange = e => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     if (!formData.staff.id || !formData.amount) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     if (!formData.todo.id && !formData.task.id) {
//       toast.error("Please select at least a Todo or a Task");
//       return;
//     }

//     const payload = {
//       projectId,
//       todo: formData.todo.id || null,
//       task: formData.task.id || null,
//       staff: formData.staff.id,
//       architectId: user._id,
//       amount: formData.amount,
//       startDate: formData.startDate || null,
//       endDate: formData.endDate || null,
//       notes: formData.notes || "",
//       status: formData.status || "pending",
//     };

//     console.log("Submitting payload:", payload);

//     try {
//       if (initialData) {
//         await updateSubcon(initialData._id, payload);
//         toast.success("Sub-Con Work Order updated successfully!");
//       } else {
//         await createSubcon(payload);
//         toast.success("Sub-Con Work Order created successfully!");
//       }
//       onClose();
//       if (onSuccess) onSuccess();
//     } catch (error) {
//       console.error("Save Sub-Con Error:", error);
//       toast.error("Failed to save Sub-Con Work Order");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//       <div className="bg-white w-full sm:max-w-md md:max-w-lg lg:max-w-xl rounded-2xl shadow-lg p-4 sm:p-6 relative overflow-y-auto max-h-[90vh]">
//         <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
//           {initialData ? "Edit Sub-Con Work Order" : "Create Sub-Con Work Order"}
//         </h2>

//         <div className="space-y-4 sm:space-y-6">
//           <DropDown
//             label="Todo"
//             name="todo"
//             value={formData.todo.id}
//             options={todos.map(t => ({ value: t._id, label: t.itemName }))}
//             onChange={e => {
//               const selected = todos.find(t => t._id === e.target.value);
//               handleDropdownChange("todo", e.target.value, selected?.itemName || "");
//             }}
//           />

//           <DropDown
//             label="Task"
//             name="task"
//             value={formData.task.id}
//             options={tasks.map(t => ({ value: t._id, label: t.name || t.title }))}
//             onChange={e => {
//               const selected = tasks.find(t => t._id === e.target.value);
//               handleDropdownChange("task", e.target.value, selected?.name || selected?.title || "");
//             }}
//           />

//           <DropDown
//             label="Staff"
//             name="staff"
//             value={formData.staff.id}
//             options={staff.map(s => ({ value: s._id, label: s.name }))}
//             onChange={e => {
//               const selected = staff.find(s => s._id === e.target.value);
//               handleDropdownChange("staff", e.target.value, selected?.name || "");
//             }}
//           />

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Quote Amount <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="number"
//               name="amount"
//               value={formData.amount}
//               onChange={handleInputChange}
//               className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//               <input
//                 type="date"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleInputChange}
//                 className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//               <input
//                 type="date"
//                 name="endDate"
//                 value={formData.endDate}
//                 onChange={handleInputChange}
//                 className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
//             <textarea
//               name="notes"
//               value={formData.notes}
//               onChange={handleInputChange}
//               className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 sm:gap-3">
//           <Button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg w-full sm:w-auto">
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg w-full sm:w-auto">
//             {initialData ? "Update Order" : "Create Order"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SubconModal;

// import React, { useState, useEffect } from "react";
// import DropDown from "../../../../components/DropDown";
// import Button from "../../../../components/Button";
// import { toast } from "react-toastify";
// import { fetchStaffByType } from "../../../../services/staffServices";
// import { getTaskName } from "../../../../services/taskServices";
// import { getTodoName } from "../../../../services/todoServices";
// import { createSubcon, updateSubcon } from "../../../../services/subConServices";
// import { useAuth } from "../../../../context/AuthContext";

// function SubconModal({ isOpen, onClose, projectId, initialData, onSuccess }) {
//   const { user } = useAuth();
//   const [todos, setTodos] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [staff, setStaff] = useState([]);

//   const [formData, setFormData] = useState({
//     todo: { id: "", name: "" },
//     task: { id: "", name: "" },
//     staff: { id: "", name: "" },
//     amount: "",
//     startDate: "",
//     endDate: "",
//     notes: "",
//     status: "pending",
//   });

//   // Preload form when editing
//   useEffect(() => {
//     if (isOpen && initialData) {
//       setFormData({
//         todo: { id: initialData.todo?._id || "", name: initialData.todo?.itemName || "" },
//         task: { id: initialData.task?._id || "", name: initialData.task?.name || initialData.task?.title || "" },
//         staff: { id: initialData.staff?._id || "", name: initialData.staff?.name || "" },
//         amount: initialData.amount || "",
//         startDate: initialData.startDate ? initialData.startDate.split("T")[0] : "",
//         endDate: initialData.endDate ? initialData.endDate.split("T")[0] : "",
//         notes: initialData.notes || "",
//         status: initialData.status || "pending",
//       });
//     } else if (isOpen && !initialData) {
//       setFormData({
//         todo: { id: "", name: "" },
//         task: { id: "", name: "" },
//         staff: { id: "", name: "" },
//         amount: "",
//         startDate: "",
//         endDate: "",
//         notes: "",
//         status: "pending",
//       });
//     }
//   }, [isOpen, initialData]);

//   // Fetch dropdown options
//   useEffect(() => {
//     if (isOpen) {
//       (async () => {
//         try {
//           const todoData = await getTodoName(projectId);
//           const taskData = await getTaskName(projectId);
//           const staffData = await fetchStaffByType();
//           setTodos(Array.isArray(todoData) ? todoData : todoData?.todos || []);
//           setTasks(Array.isArray(taskData) ? taskData : taskData?.tasks || []);
//           setStaff(Array.isArray(staffData) ? staffData : staffData?.staff || []);
//         } catch {
//           toast.error("Failed to fetch dropdown data");
//         }
//       })();
//     }
//   }, [isOpen, projectId]);

//   const handleDropdownChange = (name, value, label) => {
//     setFormData((prev) => ({ ...prev, [name]: { id: value, name: label } }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     if (!formData.staff.id || !formData.amount) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     if (!formData.todo.id && !formData.task.id) {
//       toast.error("Please select at least a Todo or a Task");
//       return;
//     }

//     if (!user?._id) {
//       toast.error("Architect ID missing. Please log in again.");
//       return;
//     }

//     const payload = {
//       projectId,
//       todo: formData.todo.id || null,
//       task: formData.task.id || null,
//       staff: formData.staff.id,
//       architectId: user._id,
//       amount: formData.amount,
//       startDate: formData.startDate || null,
//       endDate: formData.endDate || null,
//       notes: formData.notes || "",
//       status: formData.status || "pending",
//     };

//     console.log("Submitting payload:", payload);

//     try {
//       if (initialData) {
//         await updateSubcon(initialData._id, payload);
//         toast.success("Sub-Con Work Order updated successfully!");
//       } else {
//         await createSubcon(payload);
//         toast.success("Sub-Con Work Order created successfully!");
//       }
//       onClose();
//       if (onSuccess) onSuccess();
//     } catch (error) {
//       console.error("Save Sub-Con Error:", error);
//       toast.error("Failed to save Sub-Con Work Order");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//       <div className="bg-white w-full sm:max-w-md md:max-w-lg lg:max-w-xl rounded-2xl shadow-lg p-4 sm:p-6 relative overflow-y-auto max-h-[90vh]">
//         <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
//           {initialData ? "Edit Sub-Con Work Order" : "Create Sub-Con Work Order"}
//         </h2>

//         <div className="space-y-4 sm:space-y-6">
//           {/* Todo Dropdown */}
//           <DropDown
//             label="Todo"
//             name="todo"
//             value={formData.todo.id}
//             options={todos.map((t) => ({ value: t._id, label: t.itemName }))}
//             onChange={(e) => {
//               const selected = todos.find((t) => t._id === e.target.value);
//               handleDropdownChange("todo", e.target.value, selected?.itemName || "");
//             }}
//           />

//           {/* Task Dropdown */}
//           <DropDown
//             label="Task"
//             name="task"
//             value={formData.task.id}
//             options={tasks.map((t) => ({ value: t._id, label: t.name || t.title }))}
//             onChange={(e) => {
//               const selected = tasks.find((t) => t._id === e.target.value);
//               handleDropdownChange("task", e.target.value, selected?.name || selected?.title || "");
//             }}
//           />

//           {/* Staff Dropdown */}
//           <DropDown
//             label="Staff"
//             name="staff"
//             value={formData.staff.id}
//             options={staff.map((s) => ({ value: s._id, label: s.name }))}
//             onChange={(e) => {
//               const selected = staff.find((s) => s._id === e.target.value);
//               handleDropdownChange("staff", e.target.value, selected?.name || "");
//             }}
//           />

//           {/* Status Dropdown */}
//           <DropDown
//             label="Status"
//             name="status"
//             value={formData.status}
//             options={[
//               { value: "pending", label: "Pending" },
//               { value: "in-progress", label: "In Progress" },
//               { value: "completed", label: "Completed" },
//               { value: "cancelled", label: "Cancelled" },
//             ]}
//             onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
//           />

//           {/* Quote Amount */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Quote Amount <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="number"
//               name="amount"
//               value={formData.amount}
//               onChange={handleInputChange}
//               className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Dates */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//               <input
//                 type="date"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleInputChange}
//                 className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//               <input
//                 type="date"
//                 name="endDate"
//                 value={formData.endDate}
//                 onChange={handleInputChange}
//                 className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Notes */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
//             <textarea
//               name="notes"
//               value={formData.notes}
//               onChange={handleInputChange}
//               className="w-full p-2.5 rounded-lg border border-gray-300 shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 sm:gap-3">
//           <Button
//             variant="custom"
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg w-full sm:w-auto"
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="custom"
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg w-full sm:w-auto"
//           >
//             {initialData ? "Update Order" : "Create Order"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SubconModal;
