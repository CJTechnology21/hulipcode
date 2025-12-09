import React, { useState } from "react";
import Button from "../../../components/Button";
import DropDown from "../../../components/DropDown";
import SidebarModal from "../SidebarModal";
import { addDeliverable, fetchDeliverables } from "../../../services/quoteServices";
import { generateUploadURL, addProjectPhoto } from "../../../services/overViewServices";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";

const DeliverableModal = ({ isOpen, onClose, onSave, quoteId, spaceId }) => {
  const [form, setForm] = useState({
    photo: "",
    code: "",
    category: "",
    description: "",
    spec: "",
    qty: 1,
    unit: "",
    rate: 0,
    gst: 18,
    hsn: "",
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // Validate required props
      if (!quoteId) {
        toast.error("Quote ID is missing. Please refresh the page.");
        return;
      }
      
      if (!spaceId) {
        toast.error("Space ID is missing. Please select a space first.");
        return;
      }

      setUploading(true);

      let photoUrl = "";

      // Upload to S3 if it's a File (optional - continue even if it fails)
      if (form.photo instanceof File) {
        try {
          const { uploadUrl, url } = await generateUploadURL(
            form.photo.name,
            form.photo.type
          );

          await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": form.photo.type },
            body: form.photo,
          });

          try {
            await addProjectPhoto(quoteId, url);
          } catch (err) {
            console.warn("Failed to add project photo:", err);
          }

          photoUrl = url;
        } catch (err) {
          console.warn("Photo upload failed (S3 not configured), continuing without photo:", err);
          // Continue without photo - photo upload is optional
          photoUrl = "";
          // Don't show warning toast - it's expected if S3 is not configured
        }
      } else if (typeof form.photo === "string" && form.photo.trim() !== "") {
        // If it's already a URL string, use it
        photoUrl = form.photo;
      }

      // Build deliverable payload (photo is optional)
      const newItem = {
        description: form.description || "",
        spec: form.spec || "",
        code: form.code || "",
        category: form.category || "",
        unit: form.unit || "",
        qty: form.qty || 1,
        rate: form.rate || 0,
        hsn: form.hsn || "",
        gst: form.gst || 18,
        photo: photoUrl, // Can be empty string
      };

      // Ensure IDs are strings and not undefined
      const validQuoteId = String(quoteId).trim();
      const validSpaceId = String(spaceId).trim();
      
      if (!validQuoteId || validQuoteId === "undefined" || validQuoteId === "null") {
        toast.error("Invalid Quote ID. Please refresh the page.");
        return;
      }
      
      if (!validSpaceId || validSpaceId === "undefined" || validSpaceId === "null") {
        toast.error("Invalid Space ID. Please select a space first.");
        return;
      }

      console.log("Adding deliverable with:", { quoteId: validQuoteId, spaceId: validSpaceId, newItem });

      // Add deliverable - backend returns the entire quote, we need to extract the new deliverable
      const response = await addDeliverable(validQuoteId, validSpaceId, newItem);
      
      // Extract the newly added deliverable from the response
      // The backend returns the entire quote, so we need to find the space and get the last deliverable
      let newDeliverable = null;
      if (response && response.summary) {
        const space = response.summary.find((s) => s._id.toString() === spaceId.toString());
        if (space && space.deliverables && space.deliverables.length > 0) {
          // The last deliverable in the array should be the newly added one
          newDeliverable = space.deliverables[space.deliverables.length - 1];
        }
      }
      
      // If we couldn't extract from response, fetch fresh data
      if (!newDeliverable) {
        const updatedDeliverables = await fetchDeliverables(quoteId, spaceId);
        if (updatedDeliverables && updatedDeliverables.length > 0) {
          // Find by matching description and code (or take the last one)
          newDeliverable = updatedDeliverables.find(
            (d) => d.description === newItem.description && d.code === newItem.code
          ) || updatedDeliverables[updatedDeliverables.length - 1];
        }
      }
      
      if (onSave && newDeliverable) {
        onSave(newDeliverable);
      }

      toast.success("Deliverable added successfully!");

      // Reset form
      setForm({
        photo: "",
        code: "",
        category: "",
        description: "",
        spec: "",
        qty: 1,
        unit: "",
        rate: 0,
        gst: 18,
        hsn: "",
      });

      onClose();
    } catch (err) {
      console.error("Error adding deliverable:", err);
      toast.error(err.response?.data?.message || "Failed to add deliverable. Please check all required fields.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SidebarModal isOpen={isOpen} onClose={onClose} title="Deliverable Detail">
      <div className="space-y-4">
        {/* Upload Photo */}
        <div>
          <label className="block text-sm font-bold text-red-700 mb-1">
            Upload Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleChange("photo", e.target.files[0])}
            className="border rounded w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {form.photo && form.photo instanceof File && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(form.photo)}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>

        {/* Deliverable */}
        <div>
          <label className="block text-sm font-bold text-red-700 mb-1">
            Deliverable
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="border rounded w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Deliverable Description */}
        <div>
          <label className="block text-sm font-bold text-red-700 mb-1">
            Deliverable Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
            className="border rounded w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Specification */}
        <div>
          <label className="block text-sm font-bold text-red-700 mb-1">
            Specification
          </label>
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
          <label className="block text-sm font-bold text-red-700 mb-1">
            Category
          </label>
          <DropDown
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            options={["Civil", "Electrical", "Plumbing", "Carpentry", "Electrical Work", "Plumbing Work"]}
            className="w-full"
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
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            variant="custom"
            onClick={handleSave}
            className={`bg-red-700 hover:bg-red-900 text-white px-6 py-2 rounded-full ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={uploading}
          >
            {uploading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </SidebarModal>
  );
};

export default DeliverableModal;
