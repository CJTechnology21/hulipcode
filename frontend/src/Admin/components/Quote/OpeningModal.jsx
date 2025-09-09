import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import Button from "../../../components/Button";

const OpeningModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({ type: "Door", h: "", w: "" });

  const handleSave = () => {
    if (!form.type || !form.h || !form.w) return;
    onSave({ name: form.type, h: Number(form.h), w: Number(form.w) });
    setForm({ type: "Door", h: "", w: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        {/* Modal panel */}
        <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md mx-auto p-6 z-50">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <Dialog.Title className="text-lg font-bold text-gray-800">
              Add Opening
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
              <label className="block text-sm font-semibold text-gray-700">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, type: e.target.value }))
                }
                className="border rounded w-full px-2 py-2 text-sm"
              >
                <option value="Door">Door</option>
                <option value="Window">Window</option>
                <option value="Ventilator">Ventilator</option>
              </select>
            </div>

            {/* Height & Width */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Height (ft)
                </label>
                <input
                  type="number"
                  placeholder="Enter height"
                  value={form.h}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, h: e.target.value }))
                  }
                  className="border rounded w-full px-2 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Width (ft)
                </label>
                <input
                  type="number"
                  placeholder="Enter width"
                  value={form.w}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, w: e.target.value }))
                  }
                  className="border rounded w-full px-2 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end mt-6 gap-2">
            <Button
              variant="custom"
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </Button>
            <Button
              variant="custom"
              onClick={handleSave}
              className="bg-red-700 hover:bg-red-900 text-white px-4 py-2 rounded-lg"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default OpeningModal;

// import React, { useState } from "react";
// import { Dialog } from "@headlessui/react";
// import { FaTimes } from "react-icons/fa";
// import Button from "../../../components/Button";

// const OpeningModal = ({ isOpen, onClose, onSave }) => {
//   const [form, setForm] = useState({ name: "", h: 0, w: 0 });

//   const handleSave = () => {
//     if (!form.name || !form.h || !form.w) return;
//     onSave(form);
//     setForm({ name: "", h: 0, w: 0 });
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
//       <div className="flex items-center justify-center min-h-screen">
//         <Dialog.Overlay className="fixed inset-0 bg-black/40" />

//         <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6 z-50">
//           {/* Header */}
//           <div className="flex justify-between items-center border-b pb-2 mb-4">
//             <Dialog.Title className="text-lg font-bold text-red-700">
//               Add Opening
//             </Dialog.Title>
//             <button onClick={onClose} className="text-gray-600 hover:text-red-600">
//               <FaTimes />
//             </button>
//           </div>

//           {/* Form */}
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-bold text-red-700">Name</label>
//               <input
//                 type="text"
//                 value={form.name}
//                 onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
//                 className="border rounded w-full px-2 py-1 text-sm"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-bold text-red-700">Height (ft)</label>
//                 <input
//                   type="number"
//                   value={form.h}
//                   onChange={(e) => setForm((prev) => ({ ...prev, h: +e.target.value }))}
//                   className="border rounded w-full px-2 py-1 text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-bold text-red-700">Width (ft)</label>
//                 <input
//                   type="number"
//                   value={form.w}
//                   onChange={(e) => setForm((prev) => ({ ...prev, w: +e.target.value }))}
//                   className="border rounded w-full px-2 py-1 text-sm"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end mt-6 gap-2">
//             <Button
//               variant="custom"
//               onClick={onClose}
//               className="bg-gray-400 text-white px-4 py-2 rounded-full"
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="custom"
//               onClick={handleSave}
//               className="bg-red-700 hover:bg-red-900 text-white px-4 py-2 rounded-full"
//             >
//               Save
//             </Button>
//           </div>
//         </div>
//       </div>
//     </Dialog>
//   );
// };

// export default OpeningModal;
