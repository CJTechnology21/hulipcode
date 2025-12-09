import React, { useState } from "react";
import Modal from "../Modal";
import Button from "../../../components/Button";
import { toast } from "react-toastify";
import { createStandaloneSpace, addSummaryToQuote } from "../../../services/quoteServices";

function AddSpaceModal({ isOpen, onClose, quoteId, onSpaceAdded }) {
  const [spaceForm, setSpaceForm] = useState({
    name: "",
    category: "",
    workPackages: "",
    items: "",
    amount: "",
    tax: "",
  });

  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSpaceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (!spaceForm.name || !spaceForm.category) {
      toast.error("Please fill Space name and Category");
      return;
    }

    if (!quoteId) {
      toast.error("Quote ID is missing");
      return;
    }

    try {
      setLoading(true);

      // Prepare standalone space data
      const standaloneSpaceData = {
        name: spaceForm.name,
        category: spaceForm.category,
        // Optional: can add dimensions later if needed
      };

      // Create standalone space (only name and category are stored in standalone space)
      const createdSpace = await createStandaloneSpace(quoteId, standaloneSpaceData);
      
      if (!createdSpace || !createdSpace._id) {
        throw new Error("Failed to create space - no ID returned");
      }

      // Prepare summary entry data with workPackages, items, amount, tax
      const summaryData = {
        space: spaceForm.name,
        spaceId: createdSpace._id, // Reference to the standalone space
        workPackages: spaceForm.workPackages ? Number(spaceForm.workPackages) : 0,
        items: spaceForm.items ? Number(spaceForm.items) : 0,
        amount: spaceForm.amount ? Number(spaceForm.amount) : 0,
        tax: spaceForm.tax ? Number(spaceForm.tax) : 0,
      };

      // Add to summary so it appears in the summary view immediately
      await addSummaryToQuote(quoteId, [summaryData]);

      toast.success("Space created and added to summary successfully!");

      // Reset form
      setSpaceForm({
        name: "",
        category: "",
        workPackages: "",
        items: "",
        amount: "",
        tax: "",
      });

      // Notify parent to refresh
      if (onSpaceAdded) {
        onSpaceAdded();
      }

      onClose();
    } catch (err) {
      console.error("Error creating space:", err);
      toast.error(err.response?.data?.message || "Failed to create space");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Space" size="md">
      <form className="space-y-4">
        {/* Space Name */}
        <div>
          <label className="block font-semibold capitalize mb-1">
            Space
          </label>
          <input
            type="text"
            name="name"
            value={spaceForm.name}
            onChange={handleChange}
            placeholder="Enter space name"
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-semibold capitalize mb-1">
            Category
          </label>
          <select
            name="category"
            value={spaceForm.category}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* WorkPackages */}
        <div>
          <label className="block font-semibold capitalize mb-1">
            WorkPackages
          </label>
          <input
            type="number"
            name="workPackages"
            value={spaceForm.workPackages}
            onChange={handleChange}
            placeholder="Enter work packages"
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        </div>

        {/* Items */}
        <div>
          <label className="block font-semibold capitalize mb-1">
            Items
          </label>
          <input
            type="number"
            name="items"
            value={spaceForm.items}
            onChange={handleChange}
            placeholder="Enter items"
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block font-semibold capitalize mb-1">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={spaceForm.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        </div>

        {/* Tax */}
        <div>
          <label className="block font-semibold capitalize mb-1">
            Tax
          </label>
          <input
            type="number"
            name="tax"
            value={spaceForm.tax}
            onChange={handleChange}
            placeholder="Enter tax"
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            className="bg-gray-300 text-black px-4 py-1 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-700 hover:bg-red-900 text-white px-4 py-1 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              handleSave();
            }}
            disabled={loading || !spaceForm.name || !spaceForm.category}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default AddSpaceModal;

