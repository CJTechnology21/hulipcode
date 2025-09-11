import React, { useState, useEffect } from "react";
import Button from "../../../components/Button";
import DropDown from "../../../components/DropDown";
import Modal from "../Modal";
import { toast } from "react-toastify";
import { updateDeliverable } from "../../../services/quoteServices";

const DeliverableEditModal = ({ isOpen, onClose, item, quoteId, spaceId, onSave }) => {
  const [form, setForm] = useState(item || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(item || {});
  }, [item]);

  if (!item) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Call API to update deliverable
      const updated = await updateDeliverable(quoteId, spaceId, item._id, form);
      toast.success("Deliverable updated successfully!");
      onSave(updated); // pass updated deliverable back to parent
      onClose();
    } catch (err) {
      console.error("Failed to update deliverable:", err);
      toast.error("Failed to update deliverable");
    } finally {
      setLoading(false);
    }
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
          className={`bg-red-700 hover:bg-red-900 text-white px-4 py-2 rounded-full ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </Modal>
  );
};

export default DeliverableEditModal;

