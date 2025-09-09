import React, { useState, useEffect } from "react";
import Button from "../../../components/Button";
import DropDown from "../../../components/DropDown";
import Modal from "../Modal";

const DeliverableEditModal = ({ isOpen, onClose, item, onSave }) => {
  const [form, setForm] = useState(item || {});

  useEffect(() => {
    setForm(item || {});
  }, [item]);

  if (!item) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deliverable Detail" size="md">
      <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
        {/* Photo Preview */}
        {form.photo && (
          <div>
            <img
              src={form.photo}
              alt="Deliverable"
              className="w-full h-40 object-cover rounded-lg border"
            />
          </div>
        )}

        {/* Deliverable */}
        <div>
          <label className="block text-sm font-bold text-red-700">Deliverable</label>
          <input
            type="text"
            value={form.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            className="border rounded w-full px-2 py-1 text-sm"
          />
        </div>

        {/* Specification */}
        <div>
          <label className="block text-sm font-bold text-red-700">Specification</label>
          <textarea
            value={form.spec || ""}
            onChange={(e) => handleChange("spec", e.target.value)}
            className="border rounded w-full px-2 py-1 text-sm"
          />
        </div>

        {/* Code + Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-red-700">Code</label>
            <input
              type="text"
              value={form.code || ""}
              onChange={(e) => handleChange("code", e.target.value)}
              className="border rounded w-full px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-red-700">Category</label>
            <DropDown
              value={form.category || ""}
              onChange={(e) => handleChange("category", e.target.value)}
              options={["Civil", "Electrical", "Plumbing", "Carpentry"]}
            />
          </div>
        </div>

        {/* UOM + Qty + Rate */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-red-700">UOM</label>
            <input
              type="text"
              value={form.unit || ""}
              onChange={(e) => handleChange("unit", e.target.value)}
              className="border rounded w-full px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-red-700">QTY</label>
            <input
              type="number"
              value={form.qty || 1}
              onChange={(e) => handleChange("qty", +e.target.value)}
              className="border rounded w-full px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-red-700">Rate</label>
            <input
              type="number"
              value={form.rate || 0}
              onChange={(e) => handleChange("rate", +e.target.value)}
              className="border rounded w-full px-2 py-1 text-sm"
            />
          </div>
        </div>

        {/* HSN + GST */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-red-700">HSN</label>
            <input
              type="text"
              value={form.hsn || ""}
              onChange={(e) => handleChange("hsn", e.target.value)}
              className="border rounded w-full px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-red-700">GST (%)</label>
            <input
              type="number"
              value={form.gst || 18}
              onChange={(e) => handleChange("gst", +e.target.value)}
              className="border rounded w-full px-2 py-1 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end mt-4 gap-2">
        <Button
          variant="custom"
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded-full"
        >
          Cancel
        </Button>
        <Button
          variant="custom"
          onClick={handleSave}
          className="bg-red-700 hover:bg-red-900 text-white px-4 py-2 rounded-full"
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default DeliverableEditModal;

// import React, { useState, useEffect } from "react";
  // import { Dialog } from "@headlessui/react";
  // import { FaTimes } from "react-icons/fa";
  // import Button from "../../../components/Button";
  // import DropDown from "../../../components/DropDown";

  // const DeliverableEditModal = ({ isOpen, onClose, item, onSave }) => {
  //   const [form, setForm] = useState(item || {});

  //   useEffect(() => {
  //     setForm(item || {});
  //   }, [item]);

  //   if (!item) return null;

  //   const handleChange = (field, value) => {
  //     setForm((prev) => ({ ...prev, [field]: value }));
  //   };

  //   const handleSave = () => {
  //     onSave(form);
  //     onClose();
  //   };

  //   return (
  //     <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
  //       <div className="fixed inset-0 bg-black/40" />

  //       <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-lg p-6 overflow-y-auto">
  //         {/* Header */}
  //         <div className="flex justify-between items-center border-b pb-2 mb-4">
  //           <Dialog.Title className="text-lg font-bold text-red-700">
  //             Edit Deliverable
  //           </Dialog.Title>
  //           <button onClick={onClose} className="text-gray-600 hover:text-red-600">
  //             <FaTimes />
  //           </button>
  //         </div>

  //         {/* Form Fields */}
  //         <div className="space-y-4">
  //           <div>
  //             <label className="block text-sm font-bold text-red-700">Photo URL</label>
  //             <input
  //               type="text"
  //               value={form.photo || ""}
  //               onChange={(e) => handleChange("photo", e.target.value)}
  //               className="border rounded w-full px-2 py-1 text-sm"
  //             />
  //           </div>

  //           <div>
  //             <label className="block text-sm font-bold text-red-700">Code</label>
  //             <input
  //               type="text"
  //               value={form.code || ""}
  //               onChange={(e) => handleChange("code", e.target.value)}
  //               className="border rounded w-full px-2 py-1 text-sm"
  //             />
  //           </div>

  //           <DropDown
  //             label="Category"
  //             name="category"
  //             value={form.category || ""}
  //             onChange={(e) => handleChange("category", e.target.value)}
  //             options={["Civil", "Electrical", "Plumbing", "Carpentry"]}
  //             className="border-red-700 text-red-700 focus:ring-red-700 focus:border-red-700"
  //           />

  //           <div>
  //             <label className="block text-sm font-bold text-red-700">Description</label>
  //             <textarea
  //               value={form.description || ""}
  //               onChange={(e) => handleChange("description", e.target.value)}
  //               className="border rounded w-full px-2 py-1 text-sm"
  //             />
  //           </div>

  //           <div>
  //             <label className="block text-sm font-bold text-red-700">Specification</label>
  //             <textarea
  //               value={form.spec || ""}
  //               onChange={(e) => handleChange("spec", e.target.value)}
  //               className="border rounded w-full px-2 py-1 text-sm"
  //             />
  //           </div>

  //           <div className="grid grid-cols-2 gap-4">
  //             <div>
  //               <label className="block text-sm font-bold text-red-700">Quantity</label>
  //               <input
  //                 type="number"
  //                 value={form.qty || 1}
  //                 onChange={(e) => handleChange("qty", +e.target.value)}
  //                 className="border rounded w-full px-2 py-1 text-sm"
  //               />
  //             </div>

  //             <div>
  //               <label className="block text-sm font-bold text-red-700">Unit</label>
  //               <input
  //                 type="text"
  //                 value={form.unit || "Nos"}
  //                 onChange={(e) => handleChange("unit", e.target.value)}
  //                 className="border rounded w-full px-2 py-1 text-sm"
  //               />
  //             </div>
  //           </div>

  //           <div className="grid grid-cols-2 gap-4">
  //             <div>
  //               <label className="block text-sm font-bold text-red-700">Rate</label>
  //               <input
  //                 type="number"
  //                 value={form.rate || 0}
  //                 onChange={(e) => handleChange("rate", +e.target.value)}
  //                 className="border rounded w-full px-2 py-1 text-sm"
  //               />
  //             </div>

  //             <div>
  //               <label className="block text-sm font-bold text-red-700">GST (%)</label>
  //               <input
  //                 type="number"
  //                 value={form.gst || 18}
  //                 onChange={(e) => handleChange("gst", +e.target.value)}
  //                 className="border rounded w-full px-2 py-1 text-sm"
  //               />
  //             </div>
  //           </div>
  //         </div>

  //         {/* Actions */}
  //         <div className="flex justify-end mt-6 gap-2">
  //           <Button
  //             variant="custom"
  //             onClick={onClose}
  //             className="bg-gray-400 text-white px-4 py-2 rounded-full"
  //           >
  //             Cancel
  //           </Button>
  //           <Button
  //             variant="custom"
  //             onClick={handleSave}
  //             className="bg-red-700 hover:bg-red-900 text-white px-4 py-2 rounded-full"
  //           >
  //             Save
  //           </Button>
  //         </div>
  //       </div>
  //     </Dialog>
  //   );
  // };

  // export default DeliverableEditModal;
