import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../../components/Button";
import {
  fetchDeliverables,
  deleteDeliverable,
} from "../../../services/quoteServices";
import DeliverableEditModal from "./DeliverableEditModal"; // import your modal

const DeliverablesTable = ({ quoteId, spaceId, onAddDeliverable }) => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch deliverables
  const loadDeliverables = async () => {
    try {
      const data = await fetchDeliverables(quoteId, spaceId);
      setItems(data || []);
    } catch (err) {
      console.error("Failed to fetch deliverables:", err);
      toast.error("Failed to fetch deliverables");
    }
  };

  useEffect(() => {
    if (quoteId && spaceId) loadDeliverables();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteId, spaceId]);

  // Delete handler
  const handleDelete = async (itemId) => {
    try {
      await deleteDeliverable(quoteId, spaceId, itemId);
      setItems((prev) => prev.filter((itm) => itm._id !== itemId));
      toast.success("Deliverable deleted successfully");
    } catch (err) {
      console.error("Failed to delete deliverable:", err);
      toast.error("Failed to delete deliverable");
    }
  };

  // Open modal
  const handleRowClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  // Save updated deliverable (optional: reload table after save)
  const handleSave = (updatedItem) => {
    setItems((prev) =>
      prev.map((itm) => (itm._id === updatedItem._id ? updatedItem : itm))
    );
    toast.success("Deliverable updated successfully");
  };

  const total = items.reduce(
    (sum, item) => sum + item.qty * item.rate * (1 + item.gst / 100),
    0
  );

  return (
    <>
      <div className="flex justify-end mb-2">
        <Button
          variant="custom"
          onClick={onAddDeliverable}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-900 text-white px-4 py-2 rounded-full text-sm font-bold"
        >
          <FaPlus /> Add Deliverable
        </Button>
      </div>

      <div className="overflow-x-auto">
        {items.length === 0 ? (
          <div className="text-center text-gray-500 py-4 font-semibold">
            No deliverables available now
          </div>
        ) : (
          <table className="min-w-full text-sm text-left border mt-4">
            <thead className="bg-gray-100 font-semibold">
              <tr>
                <th className="border px-2 py-1">S.No</th>
                <th className="border px-2 py-1">Photo</th>
                <th className="border px-2 py-1">Code & Category</th>
                <th className="border px-2 py-1">Description</th>
                <th className="border px-2 py-1">Specification</th>
                <th className="border px-2 py-1">Qty</th>
                <th className="border px-2 py-1">Unit</th>
                <th className="border px-2 py-1">Rate</th>
                <th className="border px-2 py-1">Amount</th>
                <th className="border px-2 py-1">GST (%)</th>
                <th className="border px-2 py-1">Total</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const amount = item.qty * item.rate;
                const totalWithGST = amount * (1 + item.gst / 100);

                return (
                  <tr
                    key={item._id}
                    className="hover:bg-red-50 cursor-pointer"
                    onClick={() => handleRowClick(item)}
                  >
                    <td className="border px-2 py-1">{idx + 1}</td>
                    <td className="border px-2 py-1">
                      <img
                        src={item.photo}
                        alt="item"
                        className="w-10 h-10 object-cover"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      {item.code} / {item.category}
                    </td>
                    <td className="border px-2 py-1">{item.description}</td>
                    <td className="border px-2 py-1">{item.spec}</td>
                    <td className="border px-2 py-1">{item.qty}</td>
                    <td className="border px-2 py-1">{item.unit}</td>
                    <td className="border px-2 py-1">₹ {item.rate}</td>
                    <td className="border px-2 py-1">₹ {amount}</td>
                    <td className="border px-2 py-1">{item.gst}%</td>
                    <td className="border px-2 py-1">
                      ₹ {totalWithGST.toFixed(2)}
                    </td>
                    <td
                      className="border px-2 py-1 flex gap-2"
                      onClick={(e) => e.stopPropagation()} // prevent modal
                    >
                      <FaTrash
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleDelete(item._id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="text-right text-lg font-semibold text-red-700 mt-4">
        Total Amount: ₹ {total.toLocaleString("en-IN")}/-
      </div>

      {/* Deliverable Edit Modal */}
      {selectedItem && (
        <DeliverableEditModal
          quoteId={quoteId}
          spaceId={spaceId}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          item={selectedItem}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default DeliverablesTable;
