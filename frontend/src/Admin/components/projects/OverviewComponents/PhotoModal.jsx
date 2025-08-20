import React, { useState } from "react";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
function PhotoModal({ isOpen, onClose, addPhoto }) {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) addPhoto(URL.createObjectURL(file)); // For demo, convert to URL
    setFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-80">
        <h3 className="font-semibold text-gray-800 mb-4">Add Project Photo</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="custom"
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </Button>
            <Button
              variant="custom"
              type="submit"
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PhotoModal;
