import React, { useState } from "react";
import Button from "../../../../components/Button";

function TaskModal({ isOpen, onClose, addTask }) {
  const [formData, setFormData] = useState({
    item: "",
    startDate: "",
    endDate: "",
    progress: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting task:", formData); // debug log
    addTask(formData);
    setFormData({ item: "", startDate: "", endDate: "", progress: "" });
    onClose();
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
            name="item"
            value={formData.item}
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
              className="px-4 py-2 bg-red-500 hover:bg-red-600 cursor-pointer text-white rounded"
            >
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;

// import React, { useState } from "react";
// import Input from "../../../../components/Input";
// import Button from "../../../../components/Button";

// function TaskModal({ isOpen, onClose, addTask }) {
//   const [formData, setFormData] = useState({
//     item: "",
//     startDate: "",
//     endDate: "",
//     progress: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     addTask(formData);
//     setFormData({ item: "", startDate: "", endDate: "", progress: "" });
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-xl w-96">
//         <h3 className="font-semibold text-gray-800 mb-4">Add Task</h3>
//         <form onSubmit={handleSubmit} className="space-y-3">
//           <Input
//             type="text"
//             name="item"
//             value={formData.item}
//             onChange={handleChange}
//             placeholder="Task Name"
//             className="w-full border p-2 rounded"
//             required
//           />
//           <Input
//             type="date"
//             name="startDate"
//             value={formData.startDate}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//             required
//           />
//           <Input
//             type="date"
//             name="endDate"
//             value={formData.endDate}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//             required
//           />
//           <Input
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
//               className="px-4 py-2 bg-red-500 hover:bg-red-600 cursor-pointer text-white rounded"
//             >
//               Add
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default TaskModal;
