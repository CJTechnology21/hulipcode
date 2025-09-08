import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import Button from "../../../components/Button";
import DropDown from "../../../components/DropDown";

const DeliverableModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    photo: "",
    code: "",
    category: "",
    description: "",
    spec: "",
    qty: 1,
    unit: "Nos",
    rate: 0,
    gst: 18,
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const newItem = {
      ...form,
      id: Date.now(),
    };
    onSave(newItem);
    setForm({
      photo: "",
      code: "",
      category: "",
      description: "",
      spec: "",
      qty: 1,
      unit: "Nos",
      rate: 0,
      gst: 18,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen">
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />

        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto p-6 z-50">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <Dialog.Title className="text-lg font-bold text-red-700">
              Add Deliverable
            </Dialog.Title>
            <button onClick={onClose} className="text-gray-600 hover:text-red-600">
              <FaTimes />
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <label className="block text-sm font-bold text-red-700">Photo URL</label>
              <input
                type="text"
                value={form.photo}
                onChange={(e) => handleChange("photo", e.target.value)}
                className="border rounded w-full px-2 py-1 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-red-700">Code</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => handleChange("code", e.target.value)}
                className="border rounded w-full px-2 py-1 text-sm"
              />
            </div>

            <div>
              <DropDown
                label="Category"
                name="category"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                options={["Civil", "Electrical", "Plumbing", "Carpentry"]}
                className="border-red-700 text-red-700 focus:ring-red-700 focus:border-red-700"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-red-700">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="border rounded w-full px-2 py-1 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-red-700">Specification</label>
              <textarea
                value={form.spec}
                onChange={(e) => handleChange("spec", e.target.value)}
                className="border rounded w-full px-2 py-1 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-red-700">Quantity</label>
                <input
                  type="number"
                  value={form.qty}
                  onChange={(e) => handleChange("qty", +e.target.value)}
                  className="border rounded w-full px-2 py-1 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-red-700">Unit</label>
                <input
                  type="text"
                  value={form.unit}
                  onChange={(e) => handleChange("unit", e.target.value)}
                  className="border rounded w-full px-2 py-1 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-red-700">Rate</label>
                <input
                  type="number"
                  value={form.rate}
                  onChange={(e) => handleChange("rate", +e.target.value)}
                  className="border rounded w-full px-2 py-1 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-red-700">GST (%)</label>
                <input
                  type="number"
                  value={form.gst}
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
        </div>
      </div>
    </Dialog>
  );
};

export default DeliverableModal;
