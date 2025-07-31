// AddProjectModal.jsx
import React from "react";

function AddProjectModal({ onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add New Project</h2>
        <form className="space-y-4" onSubmit={onSubmit}>
          <input name="id" placeholder="Project ID" className="input" required />
          <input name="name" placeholder="Project Name" className="input" required />
          <input name="client" placeholder="Client Name" className="input" required />
          <input name="location" placeholder="Location" className="input" required />
          <input name="category" placeholder="Category" className="input" />
          <select name="status" className="input" required>
            <option>EXECUTION IN PROGRESS</option>
            <option>SITE MEASUREMENTS</option>
            <option>DESIGNING IN PROCESS</option>
            <option>HOLD</option>
            <option>COMPLETED</option>
          </select>
          <input
            type="number"
            name="progress"
            placeholder="Progress %"
            className="input"
            min="0"
            max="100"
          />
          <input
            name="cashFlow"
            placeholder="Cash Flow (e.g., ₹25,000 IN)"
            className="input"
          />
          <label className="flex items-center gap-2">
            <input type="checkbox" name="protect" />
            <span className="text-sm">Huelip Protect</span>
          </label>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProjectModal;
