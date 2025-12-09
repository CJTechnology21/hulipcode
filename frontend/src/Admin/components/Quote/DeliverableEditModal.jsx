import React, { useState, useEffect } from "react";
import Button from "../../../components/Button";
import DropDown from "../../../components/DropDown";
import SidebarModal from "../SidebarModal";
import { toast } from "react-toastify";
import { updateDeliverable, fetchDeliverables } from "../../../services/quoteServices";
import { FaEdit } from "react-icons/fa";

const DeliverableEditModal = ({ isOpen, onClose, item, quoteId, spaceId, onSave }) => {
  const [form, setForm] = useState({
    description: "",
    spec: "",
    code: "",
    category: "",
    unit: "",
    qty: 1,
    rate: 0,
    hsn: "",
    gst: 18,
    photo: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({
        description: item.description || "",
        spec: item.spec || "",
        code: item.code || "",
        category: item.category || "",
        unit: item.unit || "",
        qty: item.qty || 1,
        rate: item.rate || 0,
        hsn: item.hsn || "",
        gst: item.gst || 18,
        photo: item.photo || "",
      });
    }
  }, [item]);

  if (!item) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Call API to update deliverable - backend returns the entire quote
      const response = await updateDeliverable(quoteId, spaceId, item._id, form);
      
      // Extract the updated deliverable from the response
      let updatedItem = null;
      if (response && response.summary) {
        const space = response.summary.find((s) => s._id.toString() === spaceId.toString());
        if (space && space.deliverables) {
          updatedItem = space.deliverables.find((d) => d._id.toString() === item._id.toString());
        }
      }
      
      // If we couldn't extract from response, fetch fresh data
      if (!updatedItem) {
        const updatedDeliverables = await fetchDeliverables(quoteId, spaceId);
        updatedItem = updatedDeliverables.find((d) => d._id.toString() === item._id.toString());
      }
      
      if (onSave && updatedItem) {
        onSave(updatedItem);
      }
      
      toast.success("Deliverable updated successfully!");
      onClose();
    } catch (err) {
      console.error("Failed to update deliverable:", err);
      toast.error("Failed to update deliverable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarModal isOpen={isOpen} onClose={onClose} title="Deliverable Detail">
      <div className="space-y-4">
        {/* Photo Preview */}
        {form.photo && (
          <div className="mb-4">
            <img
              src={form.photo}
              alt="Deliverable"
              className="w-full h-48 object-cover rounded-lg border"
            />
          </div>
        )}

        {/* Deliverable */}
        <div>
          <label className="block text-sm font-bold text-red-700 mb-1">Deliverable</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="border rounded w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Deliverable Description */}
        <div>
          <label className="block text-sm font-bold text-red-700 mb-1">Deliverable Description</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
            className="border rounded w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Specification */}
        <div>
          <label className="block text-sm font-bold text-red-700 mb-1">Specification</label>
          <input
            type="text"
            value={form.spec}
            onChange={(e) => handleChange("spec", e.target.value)}
            className="border rounded w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Code */}
        <div>
          <label className="block text-sm font-bold text-red-700 mb-1">Code</label>
          <input
            type="text"
            value={form.code}
            onChange={(e) => handleChange("code", e.target.value)}
            className="border rounded w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-red-700 mb-1">Category</label>
          <DropDown
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            options={["Civil", "Electrical", "Plumbing", "Carpentry", "Electrical Work", "Plumbing Work"]}
          />
        </div>

        {/* UOM with edit icon */}
        <div>
          <label className="block text-sm font-bold text-red-700 mb-1">UOM</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={form.unit}
              onChange={(e) => handleChange("unit", e.target.value)}
              className="border rounded w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <FaEdit className="text-red-700 cursor-pointer" />
          </div>
        </div>

        {/* QTY with edit icon */}
        <div>
          <label className="block text-sm font-bold text-red-700 mb-1">QTY</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={form.qty}
              onChange={(e) => handleChange("qty", +e.target.value)}
              className="border rounded w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <FaEdit className="text-red-700 cursor-pointer" />
          </div>
        </div>

        {/* RATE with edit icon */}
        <div>
          <label className="block text-sm font-bold text-red-700 mb-1">RATE</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={form.rate}
              onChange={(e) => handleChange("rate", +e.target.value)}
              className="border rounded w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <FaEdit className="text-red-700 cursor-pointer" />
          </div>
        </div>

        {/* HSN with edit icon */}
        <div>
          <label className="block text-sm font-bold text-red-700 mb-1">HSN</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={form.hsn}
              onChange={(e) => handleChange("hsn", e.target.value)}
              className="border rounded w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <FaEdit className="text-red-700 cursor-pointer" />
          </div>
        </div>

        {/* GST with edit icon */}
        <div>
          <label className="block text-sm font-bold text-red-700 mb-1">GST</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={form.gst}
              onChange={(e) => handleChange("gst", +e.target.value)}
              className="border rounded w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <FaEdit className="text-red-700 cursor-pointer" />
            <span className="text-sm text-gray-600">%</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-6 gap-2 pt-4 border-t">
          <Button
            variant="custom"
            onClick={onClose}
            className="bg-gray-400 text-white px-6 py-2 rounded-full"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="custom"
            onClick={handleSave}
            className={`bg-red-700 hover:bg-red-900 text-white px-6 py-2 rounded-full ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </SidebarModal>
  );
};

export default DeliverableEditModal;

