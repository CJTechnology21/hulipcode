import React, { useState } from "react";
import Modal from "../Modal";
import Button from "../../../components/Button";
import { toast } from "react-toastify";

function AddSectionModal({ isOpen, onClose, onAddSection }) {
  const [sectionForm, setSectionForm] = useState({
    space: "",
    workPackages: "",
    items: "",
    amount: "",
    tax: "",
    total: "",
  });

  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    setSectionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!sectionForm.space) {
      toast.error("Space name is required");
      return;
    }
    onAddSection(sectionForm);

    // Reset form after saving
    setSectionForm({
      space: "",
      workPackages: "",
      items: "",
      amount: "",
      tax: "",
      total: "",
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Section" size="md">
      <form className="space-y-4">
        {["space", "workPackages", "items", "amount", "tax"].map((field) => (
          <div key={field}>
            <label className="block font-semibold capitalize mb-1">
              {field}
            </label>
            <input
              type={
                field === "items" ||
                field === "amount" ||
                field === "tax" ||
                field === "total"
                  ? "number"
                  : "text"
              }
              name={field}
              value={sectionForm[field]}
              onChange={handleSectionChange}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700"
            />
          </div>
        ))}
        <div className="flex justify-end space-x-2">
          <Button
            className="bg-gray-300 text-black px-4 py-1 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-700 hover:bg-red-900 text-white px-4 py-1 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default AddSectionModal;