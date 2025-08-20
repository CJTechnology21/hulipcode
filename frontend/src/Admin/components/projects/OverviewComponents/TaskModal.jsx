import React, { useState } from "react";
import Button from "../../../../components/Button";
import { createTask } from "../../../../services/overViewServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TaskModal({ isOpen, onClose, addTask, projectId }) {
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    progress: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskPayload = {
      projectId, // ✅ Include projectId in payload
      name: formData.name,
      description: "",
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      progress: formData.progress || 0,
    };

    try {
      setLoading(true);
      // ✅ Call the service
      const res = await createTask(taskPayload);

      if (addTask) addTask(res);

      toast.success("Task saved successfully!");
      setFormData({ name: "", startDate: "", endDate: "", progress: "" });
      onClose();
    } catch (error) {
      console.error("Error saving task:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md sm:max-w-lg">
        <h3 className="font-semibold text-gray-800 mb-4 text-lg sm:text-xl">
          Add Task 
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Task Name"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="number"
            name="progress"
            value={formData.progress}
            onChange={handleChange}
            placeholder="Progress %"
            className="w-full border p-2 rounded"
            min={0}
            max={100}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="custom"
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </Button>
            <Button
              variant="custom"
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                loading
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 cursor-pointer"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;

// import React, { useState } from "react";
// import Button from "../../../../components/Button";
// import { createTask } from "../../../../services/taskServices";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function TaskModal({ isOpen, onClose, addTask, projectId }) {
//   const [formData, setFormData] = useState({
//     name: "",
//     startDate: "",
//     endDate: "",
//     progress: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const taskPayload = {
//       name: formData.name,
//       description: "",
//       startDate: formData.startDate || null,
//       endDate: formData.endDate || null,
//       // progress not in model yet, so ignore (or extend schema if you need it)
//     };

//     try {
//       setLoading(true);
//       const res = await createTask(taskPayload);
//       if (addTask) addTask(res);

//       toast.success("Task saved successfully ");
//       setFormData({ name: "", startDate: "", endDate: "", progress: "" });
//       onClose();
//     } catch (error) {
//       console.error(
//         "Error saving task:",
//         error.response?.data || error.message
//       );
//       toast.error("Failed to save task ");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
//       <div className="bg-white p-6 rounded-xl w-full max-w-md sm:max-w-lg">
//         <h3 className="font-semibold text-gray-800 mb-4 text-lg sm:text-xl">
//           Add Task 
//         </h3>
//         <form onSubmit={handleSubmit} className="space-y-3">
//           <input
//             type="text"
//             name="name" // ✅ use name
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="Task Name"
//             className="w-full border p-2 rounded"
//             required
//           />
//           <input
//             type="date"
//             name="startDate"
//             value={formData.startDate}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//             required
//           />
//           <input
//             type="date"
//             name="endDate"
//             value={formData.endDate}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//             required
//           />
//           <input
//             type="number"
//             name="progress"
//             value={formData.progress}
//             onChange={handleChange}
//             placeholder="Progress %"
//             className="w-full border p-2 rounded"
//             min={0}
//             max={100}
//           />
//           <div className="flex justify-end gap-2 mt-4">
//             <Button
//               variant="custom"
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-300 rounded"
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="custom"
//               type="submit"
//               disabled={loading}
//               className={`px-4 py-2 rounded text-white ${
//                 loading
//                   ? "bg-red-400 cursor-not-allowed"
//                   : "bg-red-500 hover:bg-red-600 cursor-pointer"
//               }`}
//             >
//               {loading ? "Saving..." : "Save"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default TaskModal;
