import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import Button from "../../../components/Button";
import { addOpening, updateOpening } from "../../../services/quoteServices"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OpeningModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  quoteId, 
  spaceId, 
  initialData = null 
}) => {
  const [form, setForm] = useState({ type: "Door", name: "", h: "", w: "" });
  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      setForm({
        type: initialData.type || "Door",
        name: initialData.name || "",
        h: initialData.h || "",
        w: initialData.w || ""
      });
    } else {
      setForm({ type: "Door", name: "", h: "", w: "" });
    }
  }, [initialData, isOpen]);

  const handleSave = async () => {
    if (!form.type || !form.name || !form.h || !form.w) {
      toast.error("Please fill all fields!");
      return;
    }

    const payload = { name: form.name, type: form.type, h: Number(form.h), w: Number(form.w) };

    try {
      let result;
      if (isEditMode && initialData._id) {
        result = await updateOpening(quoteId, spaceId, initialData._id, payload);
        toast.success("Opening updated successfully!");
      } else {
        result = await addOpening(quoteId, spaceId, payload);
        toast.success("Opening added successfully!");
      }

      onSave(result); 
      setForm({ type: "Door", name: "", h: "", w: "" }); 
      onClose();
    } catch (err) {
      console.error("Error saving opening:", err);
      toast.error("Failed to save opening. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen px-2 sm:px-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        {/* Modal panel */}
        <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto p-4 sm:p-6 md:p-8 z-50">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <Dialog.Title className="text-lg sm:text-xl font-bold text-gray-800">
              {isEditMode ? "Update Opening" : "Add Opening"}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-red-600"
            >
              <FaTimes />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Type */}
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, type: e.target.value }))
                }
                className="border rounded w-full px-2 py-2 text-sm sm:text-base"
              >
                <option value="Door">Door</option>
                <option value="Window">Window</option>
                <option value="Ventilator">Ventilator</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border rounded w-full px-2 py-2 text-sm sm:text-base"
              />
            </div>

            {/* Height & Width */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1">
                  Height (ft)
                </label>
                <input
                  type="number"
                  placeholder="Enter height"
                  value={form.h}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, h: e.target.value }))
                  }
                  className="border rounded w-full px-2 py-2 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1">
                  Width (ft)
                </label>
                <input
                  type="number"
                  placeholder="Enter width"
                  value={form.w}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, w: e.target.value }))
                  }
                  className="border rounded w-full px-2 py-2 text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end mt-6 gap-2">
            <Button
              variant="custom"
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </Button>
            <Button
              variant="custom"
              onClick={handleSave}
              className="w-full sm:w-auto bg-red-700 hover:bg-red-900 text-white px-4 py-2 rounded-lg"
            >
              {isEditMode ? "Update" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default OpeningModal;

// import React, { useState, useEffect } from "react";
// import { Dialog } from "@headlessui/react";
// import { FaTimes } from "react-icons/fa";
// import Button from "../../../components/Button";
// import { addOpening, updateOpening } from "../../../services/quoteServices"; 
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const OpeningModal = ({ 
//   isOpen, 
//   onClose, 
//   onSave, 
//   quoteId, 
//   spaceId, 
//   initialData = null 
// }) => {
//   const [form, setForm] = useState({ type: "Door", name: "", h: "", w: "" });
//   const isEditMode = !!initialData;

//   useEffect(() => {
//     if (initialData) {
//       setForm({
//         type: initialData.type || "Door",
//         name: initialData.name || "",
//         h: initialData.h || "",
//         w: initialData.w || ""
//       });
//     } else {
//       setForm({ type: "Door", name: "", h: "", w: "" });
//     }
//   }, [initialData, isOpen]);

//   const handleSave = async () => {
//     if (!form.type || !form.name || !form.h || !form.w) {
//       toast.error("Please fill all fields!");
//       return;
//     }

//     const payload = { name: form.name, type: form.type, h: Number(form.h), w: Number(form.w) };

//     try {
//       let result;
//       if (isEditMode && initialData._id) {
//         // Edit mode
//         result = await updateOpening(quoteId, spaceId, initialData._id, payload);
//         toast.success("Opening updated successfully!");
//       } else {
//         // Add mode
//         result = await addOpening(quoteId, spaceId, payload);
//         toast.success("Opening added successfully!");
//       }

//       onSave(result); // Pass new/updated opening back to parent
//       setForm({ type: "Door", name: "", h: "", w: "" }); // Reset form for new entry
//       onClose();
//     } catch (err) {
//       console.error("Error saving opening:", err);
//       toast.error("Failed to save opening. Please try again.");
//     }
//   };

//   return (
//     <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
//       <div className="flex items-center justify-center min-h-screen">
//         {/* Backdrop */}
//         <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

//         {/* Modal panel */}
//         <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md mx-auto p-6 z-50">
//           {/* Header */}
//           <div className="flex justify-between items-center border-b pb-2 mb-4">
//             <Dialog.Title className="text-lg font-bold text-gray-800">
//               {isEditMode ? "Update Opening" : "Add Opening"}
//             </Dialog.Title>
//             <button
//               onClick={onClose}
//               className="text-gray-600 hover:text-red-600"
//             >
//               <FaTimes />
//             </button>
//           </div>

//           {/* Form */}
//           <div className="space-y-4">
//             {/* Type */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700">
//                 Type
//               </label>
//               <select
//                 value={form.type}
//                 onChange={(e) =>
//                   setForm((prev) => ({ ...prev, type: e.target.value }))
//                 }
//                 className="border rounded w-full px-2 py-2 text-sm"
//               >
//                 <option value="Door">Door</option>
//                 <option value="Window">Window</option>
//                 <option value="Ventilator">Ventilator</option>
//               </select>
//             </div>

//             {/* Name */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter name"
//                 value={form.name}
//                 onChange={(e) =>
//                   setForm((prev) => ({ ...prev, name: e.target.value }))
//                 }
//                 className="border rounded w-full px-2 py-2 text-sm"
//               />
//             </div>

//             {/* Height & Width */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Height (ft)
//                 </label>
//                 <input
//                   type="number"
//                   placeholder="Enter height"
//                   value={form.h}
//                   onChange={(e) =>
//                     setForm((prev) => ({ ...prev, h: e.target.value }))
//                   }
//                   className="border rounded w-full px-2 py-2 text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Width (ft)
//                 </label>
//                 <input
//                   type="number"
//                   placeholder="Enter width"
//                   value={form.w}
//                   onChange={(e) =>
//                     setForm((prev) => ({ ...prev, w: e.target.value }))
//                   }
//                   className="border rounded w-full px-2 py-2 text-sm"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end mt-6 gap-2">
//             <Button
//               variant="custom"
//               onClick={onClose}
//               className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="custom"
//               onClick={handleSave}
//               className="bg-red-700 hover:bg-red-900 text-white px-4 py-2 rounded-lg"
//             >
//               {isEditMode ? "Update" : "Save"}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </Dialog>
//   );
// };

// export default OpeningModal;
