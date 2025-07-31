import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { BsGlobe } from "react-icons/bs";
import Button from "../../../components/Button";
import Input from "../../../components/Input"; // your custom Input
import DropDown from "../../../components/DropDown"; // your custom DropDown

function AddNewTodoModal({ isOpen, setIsOpen }) {
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
    taskType: "",
    assignedTo: "",
    description: "",
    visibility: "Public",
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSave = () => {
    console.log("Saved Todo:", formData);
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
      setIsOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={handleClose}
      ></div>

      {/* Drawer Panel */}
      <div className="fixed top-0 right-0 h-full w-[450px] max-w-full bg-white shadow-lg z-50 animate-slide-in-left overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b-4 border-red-500 sticky top-0 bg-white z-10 shadow">
          <div className="text-sm font-medium tracking-wide">NEW TO DO</div>
          <div className="flex items-center space-x-2">
            <Button
              className="bg-red-600 text-white text-sm px-4 py-1.5 rounded hover:bg-red-700"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              className="text-gray-600 hover:text-black"
              onClick={handleClose}
              aria-label="Close Modal"
            >
              <MdClose size={24} />
            </Button>
          </div>
        </div>

        {/* Optional Save Message */}
        {showMessage && (
          <div className="bg-green-100 text-green-700 px-4 py-2 text-sm text-center font-medium">
            Saved successfully!
          </div>
        )}

        {/* Form Content */}
        <div className="px-4 py-6 space-y-6">
          <div>
            <label className="text-xs font-medium text-gray-500">TITLE</label>
            <Input
              name="title"
              placeholder="Enter title"
              value={formData.title}
              onChange={handleChange("title")}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">DUE DATE</label>
            <div className="flex items-center mt-1 border rounded-md px-3 py-2 text-sm">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <input
                type="date"
                value={formData.dueDate}
                onChange={handleChange("dueDate")}
                className="w-full outline-none"
              />
            </div>
          </div>

          <DropDown
            label="TASK TYPE"
            name="taskType"
            value={formData.taskType}
            onChange={handleChange("taskType")}
            options={["General", "Urgent"]}
          />

          <div>
            <label className="text-xs font-medium text-gray-500">ASSIGNED TO</label>
            <Input
              name="assignedTo"
              placeholder="Assign someone"
              value={formData.assignedTo}
              onChange={handleChange("assignedTo")}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">DESCRIPTION</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={handleChange("description")}
              placeholder="Enter description"
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">VISIBILITY</label>
            <div className="flex items-center mt-1 border rounded-md px-3 py-2 text-sm">
              <BsGlobe className="text-gray-400 mr-2" />
              <select
                value={formData.visibility}
                onChange={handleChange("visibility")}
                className="w-full outline-none"
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewTodoModal;

// import React, { useState } from "react";
// import { MdClose } from "react-icons/md";
// import { FaCalendarAlt } from "react-icons/fa";
// import { BsGlobe } from "react-icons/bs";
// import Button from "../../../components/Button";

// function AddNewTodoModal({ isOpen, setIsOpen }) {
//   const [showMessage, setShowMessage] = useState(false);

//   if (!isOpen) return null;

//   const handleClose = () => {
//     setIsOpen(false);
//   };

//   const handleSave = () => {
//     // Optional: Form validation or save logic
//     setShowMessage(true);

//     setTimeout(() => {
//       setShowMessage(false);
//       setIsOpen(false);
//     }, 1500); // Close after showing message
//   };

//   return (
//     <div className="fixed inset-0 z-50">
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 bg-black bg-opacity-30 z-40"
//         onClick={handleClose}
//       ></div>

//       {/* Drawer Panel */}
//       <div className="fixed top-0 right-0 h-full w-[450px] max-w-full bg-white shadow-lg z-50 animate-slide-in-left overflow-y-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center p-4 border-b-4 border-red-500 sticky top-0 bg-white z-10 shadow">
//           <div className="text-sm font-medium tracking-wide">NEW TO DO</div>
//           <div className="flex items-center space-x-2">
//             <Button
//               className="bg-red-600 text-white text-sm px-4 py-1.5 rounded hover:bg-red-700"
//               onClick={handleSave}
//             >
//               Save
//             </Button>
//             <Button
//               className="text-gray-600 hover:text-black"
//               onClick={handleClose}
//               aria-label="Close Modal"
//             >
//               <MdClose size={24} />
//             </Button>
//           </div>
//         </div>

//         {/* Optional Save Message */}
//         {showMessage && (
//           <div className="bg-green-100 text-green-700 px-4 py-2 text-sm text-center font-medium">
//             Saved successfully!
//           </div>
//         )}

//         {/* Form Content */}
//         <div className="px-4 py-6 space-y-6">
//           <div>
//             <label className="text-xs font-medium text-gray-500">TITLE</label>
//             <input
//               type="text"
//               placeholder="Enter title"
//               className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
//             />
//           </div>

//           <div>
//             <label className="text-xs font-medium text-gray-500">
//               DUE DATE
//             </label>
//             <div className="flex items-center mt-1 border rounded-md px-3 py-2 text-sm">
//               <FaCalendarAlt className="text-gray-400 mr-2" />
//               <input type="date" className="w-full outline-none" />
//             </div>
//           </div>

//           <div>
//             <label className="text-xs font-medium text-gray-500">
//               TASK TYPE
//             </label>
//             <select className="w-full mt-1 px-3 py-2 border rounded-md text-sm">
//               <option value="">Select type</option>
//               <option value="General">General</option>
//               <option value="Urgent">Urgent</option>
//             </select>
//           </div>

//           <div>
//             <label className="text-xs font-medium text-gray-500">
//               ASSIGNED TO
//             </label>
//             <input
//               type="text"
//               placeholder="Assign someone"
//               className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
//             />
//           </div>

//           <div>
//             <label className="text-xs font-medium text-gray-500">
//               DESCRIPTION
//             </label>
//             <textarea
//               rows={4}
//               placeholder="Enter description"
//               className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
//             />
//           </div>

//           <div>
//             <label className="text-xs font-medium text-gray-500">
//               VISIBILITY
//             </label>
//             <div className="flex items-center mt-1 border rounded-md px-3 py-2 text-sm">
//               <BsGlobe className="text-gray-400 mr-2" />
//               <select className="w-full outline-none">
//                 <option value="Public">Public</option>
//                 <option value="Private">Private</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddNewTodoModal;
