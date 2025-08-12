import React from "react";
import Input from '../../../components/Input';
import Button from '../../../components/Button';

export default function UpdateLeadModal({
  showModal,
  modalData,
  setModalData,
  closeModal,
  handleSave
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-xl">
        <h2 className="text-lg font-bold">
          Update Lead - {modalData.id}
        </h2>

        {/* Update Text Area */}
        <textarea
          rows={4}
          className="w-full p-2 border rounded"
          placeholder="Enter update details"
          value={modalData.text}
          onChange={(e) =>
            setModalData({ ...modalData, text: e.target.value })
          }
        />

        {/* Date & Time Picker */}
        <Input
          type="datetime-local"
          className="w-full p-2 border rounded"
          value={modalData.datetime}
          onChange={(e) =>
            setModalData({ ...modalData, datetime: e.target.value })
          }
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            variant="custom"
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            variant="custom"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
