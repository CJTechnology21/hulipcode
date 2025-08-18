import React, { useState } from "react";
import Button from "../../../components/Button";
import { toast } from "react-toastify";
import { patchLead } from "../../../services/leadServices";

export default function UpdateLeadModal({
  showModal,
  modalData,
  setModalData,
  closeModal,
  refreshLeads,
}) {
  const [loading, setLoading] = useState(false);

  if (!showModal) return null;

  const handleSave = async () => {
    if (!modalData?._id) {
      toast.error("Invalid lead ID");
      return;
    }

    if (!modalData.text?.trim()) {
      toast.error("Please enter update details");
      return;
    }

    setLoading(true);
    try {
      await patchLead(modalData._id, { update: modalData.text });

      toast.success("Lead updated successfully!");
      refreshLeads && refreshLeads();

      setModalData((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
      }));

      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-xl">
        <h2 className="text-lg font-bold">Update Lead</h2>
        <div className="text-gray-500 text-sm">
          {modalData.updatedAt || modalData.createdAt
            ? `Last Updated: ${new Date(
                modalData.updatedAt || modalData.createdAt
              ).toLocaleString()}`
            : "No date available"}
        </div>

        <textarea
          rows={4}
          className="w-full p-2 border rounded"
          placeholder="Enter update details"
          value={modalData.text}
          onChange={(e) =>
            setModalData({ ...modalData, text: e.target.value })
          }
        />

        <div className="flex justify-end gap-2">
          <Button
            variant="custom"
            className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
            onClick={closeModal}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="custom"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
