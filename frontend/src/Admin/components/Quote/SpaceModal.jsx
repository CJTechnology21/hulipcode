import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import Button from "../../../components/Button";
import DropDown from "../../../components/DropDown"; // import your custom dropdown
import { addSpace, updateSpace } from "../../../services/quoteServices";
import { toast } from "react-toastify";

const categories = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Dining Room",
  "Hall",
  "Study Room",
  "Balcony",
  "Toilet",
];

const SpaceModal = ({
  isOpen,
  onClose,
  quoteId,
  spaceId,
  initialData = null,
  onSave,
}) => {
  const isEditMode = !!initialData;

  const [form, setForm] = useState({
    name: "",
    category: "",
    length: "",
    breadth: "",
    height: "",
    unit: "Feet",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        category: initialData.category || "",
        length: initialData.length || "",
        breadth: initialData.breadth || "",
        height: initialData.height || "",
        unit: initialData.unit || "Feet",
      });
    } else {
      setForm({
        name: "",
        category: "",
        length: "",
        breadth: "",
        height: "",
        unit: "Feet",
      });
    }
  }, [initialData]);

  const handleSave = async () => {
    const { name, category, length, breadth, height, unit } = form;

    if (!name || !category || !length || !breadth || !height) {
      toast.error("Please fill all fields!");
      return;
    }

    const payload = {
      name,
      category,
      length: Number(length),
      breadth: Number(breadth),
      height: Number(height),
      unit,
      perimeter: 2 * (Number(length) + Number(breadth)),
      floorArea: Number(length) * Number(breadth),
      wallArea: 2 * Number(height) * (Number(length) + Number(breadth)),
    };

    try {
      let result;
      if (isEditMode) {
        result = await updateSpace(quoteId, spaceId, initialData._id, payload);
        toast.success("Space updated successfully!");
      } else {
        result = await addSpace(quoteId, spaceId, payload);
        toast.success("Space added successfully!");
      }
      onSave(result);
      onClose();
    } catch (err) {
      console.error("Error saving space:", err);
      toast.error("Failed to save space");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md mx-auto p-6 z-50">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <Dialog.Title className="text-lg font-bold text-gray-800">
              {isEditMode ? "Update Space" : "Add Space"}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-red-600"
            >
              <FaTimes />
            </button>
          </div>

          <div className="space-y-4">
            {/* Area Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Area Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border rounded w-full px-2 py-2 text-sm"
              />
            </div>

            {/* Category Dropdown using custom DropDown */}
            <DropDown
              label="Category"
              name="category"
              value={form.category}
              options={categories}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Length
                </label>
                <input
                  type="number"
                  value={form.length}
                  onChange={(e) => setForm({ ...form, length: e.target.value })}
                  className="border rounded w-full px-2 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Breadth
                </label>
                <input
                  type="number"
                  value={form.breadth}
                  onChange={(e) =>
                    setForm({ ...form, breadth: e.target.value })
                  }
                  className="border rounded w-full px-2 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Height
              </label>
              <input
                type="number"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
                className="border rounded w-full px-2 py-2 text-sm"
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Unit
              </label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="border rounded w-full px-2 py-2 text-sm"
              >
                <option value="Feet">Feet</option>
                <option value="Meters">Meters</option>
              </select>
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
              {isEditMode ? "Update" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default SpaceModal;
