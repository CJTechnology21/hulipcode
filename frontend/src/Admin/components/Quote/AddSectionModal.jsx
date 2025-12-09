import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import Button from "../../../components/Button";
import DropDown from "../../../components/DropDown";
import { toast } from "react-toastify";
import { fetchStandaloneSpaces } from "../../../services/quoteServices";

function AddSectionModal({ isOpen, onClose, onAddSection, quoteId }) {
  const [sectionForm, setSectionForm] = useState({
    space: "",
    spaceId: "", // Reference to standalone space
    workPackages: "",
    items: "",
    amount: "",
    tax: "",
    total: "",
  });

  const [availableSpaces, setAvailableSpaces] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch standalone spaces when modal opens
  useEffect(() => {
    if (isOpen && quoteId) {
      loadSpaces();
    }
  }, [isOpen, quoteId]);

  const loadSpaces = async () => {
    try {
      setLoading(true);
      const spaces = await fetchStandaloneSpaces(quoteId);
      setAvailableSpaces(spaces || []);
    } catch (err) {
      console.error("Error fetching spaces:", err);
      toast.error("Failed to load spaces");
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    setSectionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpaceSelect = (spaceId) => {
    const selectedSpace = availableSpaces.find((s) => s._id === spaceId);
    if (selectedSpace) {
      setSectionForm((prev) => ({
        ...prev,
        space: selectedSpace.name,
        spaceId: selectedSpace._id,
      }));
    }
  };

  const handleSave = () => {
    if (!sectionForm.spaceId || !sectionForm.space) {
      toast.error("Please select a space first");
      return;
    }
    onAddSection(sectionForm);

    // Reset form after saving
    setSectionForm({
      space: "",
      spaceId: "",
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
        {/* Space Dropdown */}
        <div>
          <label className="block font-semibold capitalize mb-1">
            Space
          </label>
          {loading ? (
            <div className="text-sm text-gray-500">Loading spaces...</div>
          ) : availableSpaces.length === 0 ? (
            <div className="text-sm text-red-600">
              No spaces available. Please create a space first using "Add Space" button.
            </div>
          ) : (
            <DropDown
              name="space"
              value={sectionForm.spaceId}
              onChange={(e) => handleSpaceSelect(e.target.value)}
              options={availableSpaces.map((space) => ({
                value: space._id,
                label: `${space.name} (${space.category})`,
              }))}
            />
          )}
        </div>

        {/* Other fields */}
        {["workPackages", "items", "amount", "tax"].map((field) => (
          <div key={field}>
            <label className="block font-semibold capitalize mb-1">
              {field}
            </label>
            <input
              type="number"
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
            disabled={!sectionForm.spaceId || loading}
          >
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default AddSectionModal;