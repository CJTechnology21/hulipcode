import React, { useState } from "react";
import Button from "../../../components/Button";
import DropDown from "../../../components/DropDown";
import Modal from "../Modal";
import { addDeliverable } from "../../../services/quoteServices";
import { generateUploadURL, addProjectPhoto } from "../../../services/overViewServices";

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
    gst: 0,
    hsn: "",
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setUploading(true);

      let photoUrl = form.photo;

      // Upload to S3 if it's a File
      if (form.photo instanceof File) {
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
        } catch (_) {}

        photoUrl = url;
      }

      // Build deliverable payload
      const newItem = {
        ...form,
        id: Date.now(),
        photo: photoUrl,
      };

      // Add deliverable
      const savedDeliverable = await addDeliverable(quoteId, spaceId, newItem);

      if (onSave) {
        onSave(savedDeliverable);
      }

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
        gst: 0,
        hsn: "",
      });

      onClose();
    } catch (_) {
      // silently fail
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Deliverable" size="2xl">
      <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
        {/* Upload Photo */}
        <div>
          <label className="block text-sm font-bold text-red-700">
            Upload Photo
          </label>
          <input
            type="file"
            onChange={(e) => handleChange("photo", e.target.files[0])}
            className="border rounded w-full px-2 py-1 text-sm"
          />
        </div>

        {/* Deliverable */}
        <div>
          <label className="block text-sm font-bold text-red-700">
            Deliverable
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="border rounded w-full px-2 py-1 text-sm"
          />
        </div>

        {/* Specification */}
        <div>
          <label className="block text-sm font-bold text-red-700">
            Specification
          </label>
          <textarea
            value={form.spec}
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
              value={form.code}
              onChange={(e) => handleChange("code", e.target.value)}
              className="border rounded w-full px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-red-700">
              Category
            </label>
            <DropDown
              value={form.category}
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
              value={form.unit}
              onChange={(e) => handleChange("unit", e.target.value)}
              className="border rounded w-full px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-red-700">QTY</label>
            <input
              type="number"
              value={form.qty}
              onChange={(e) => handleChange("qty", +e.target.value)}
              className="border rounded w-full px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-red-700">Rate</label>
            <input
              type="number"
              value={form.rate}
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
              value={form.hsn}
              onChange={(e) => handleChange("hsn", e.target.value)}
              className="border rounded w-full px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-red-700">
              GST (%)
            </label>
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
          disabled={uploading}
        >
          Cancel
        </Button>
        <Button
          variant="custom"
          onClick={handleSave}
          className="bg-red-700 hover:bg-red-900 text-white px-4 py-2 rounded-full"
          disabled={uploading}
        >
          {uploading ? "Saving..." : "Save"}
        </Button>
      </div>
    </Modal>
  );
};

export default DeliverableModal;
