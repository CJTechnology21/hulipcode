import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";

const units = ["nos", "pcs", "sqft", "meter"];
const gstOptions = ["0", "5", "12", "18", "28"];
const categories = [
  "Kitchen", "Laminates", "Wardrobe", "Flooring", "LouversandPanels",
  "Bathroom", "Wallpaper", "Outdoor", "TVUnit"
];

export default function AddMaterialModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    unit: "nos",
    gst: "18",
    category: "",
    hsn: "",
    specifications: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      onSave(form);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-30"
          onClick={onClose}
        />

        {/* Slide-over panel */}
        <div className="relative w-full max-w-xl h-full bg-white shadow-lg z-50 transition-transform duration-300">
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-800 uppercase">
              Add Material
            </h2>
            <button onClick={onClose}>
              <FaTimes className="text-lg text-gray-700" />
            </button>
          </div>
          <div className="h-1 bg-red-600" />

          {/* Body */}
          <div className="p-5 overflow-y-auto h-[calc(100%-100px)]">
            <div className="space-y-4">
              {/* Material Name */}
              <div>
                <label className="text-xs font-medium">MATERIAL NAME</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded p-2 mt-1"
                  placeholder="Material Name"
                />
              </div>

              {/* Unit and GST */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-xs font-medium">UNIT</label>
                  <select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    className="w-full border rounded p-2 mt-1"
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="text-xs font-medium">GST %</label>
                  <select
                    name="gst"
                    value={form.gst}
                    onChange={handleChange}
                    className="w-full border rounded p-2 mt-1"
                  >
                    {gstOptions.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-medium">CATEGORY</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border rounded p-2 mt-1"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* HSN */}
              <div>
                <label className="text-xs font-medium">HSN/SAC</label>
                <input
                  type="text"
                  name="hsn"
                  value={form.hsn}
                  onChange={handleChange}
                  className="w-full border rounded p-2 mt-1"
                  placeholder="HSN/SAC"
                />
              </div>

              {/* Specs */}
              <div>
                <label className="text-xs font-medium">SPECIFICATIONS</label>
                <textarea
                  name="specifications"
                  value={form.specifications}
                  onChange={handleChange}
                  className="w-full border rounded p-2 mt-1"
                  rows={4}
                  placeholder="Enter specifications..."
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 px-5 py-3 border-t">
            <button
              className="text-sm px-4 py-2 border rounded text-gray-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="text-sm px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <ClipLoader size={16} color="#fff" /> : "Save"}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  );
}
