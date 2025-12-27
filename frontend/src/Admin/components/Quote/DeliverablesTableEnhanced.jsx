import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import {
  fetchDeliverables,
  deleteDeliverable,
} from "../../../services/quoteServices";
import DeliverableEditModal from "./DeliverableEditModal";

const DeliverablesTableEnhanced = ({ 
  quoteId, 
  spaceId, 
  onAddDeliverable,
  onDeliverableAddedOrUpdated,
  isReadOnly = false
}) => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Search/filter states
  const [searchCode, setSearchCode] = useState("");
  const [searchSpec, setSearchSpec] = useState("");
  const [searchUnit, setSearchUnit] = useState("");
  const [searchGst, setSearchGst] = useState("");

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
  }, [quoteId, spaceId, onDeliverableAddedOrUpdated]); // Refresh when onDeliverableAddedOrUpdated changes


  // Delete handler
  const handleDelete = async (itemId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this deliverable?")) {
      return;
    }
    try {
      await deleteDeliverable(quoteId, spaceId, itemId);
      setItems((prev) => prev.filter((itm) => itm._id !== itemId));
      toast.success("Deliverable deleted successfully");
      // Trigger refresh callback if provided
      if (onDeliverableAddedOrUpdated) {
        onDeliverableAddedOrUpdated();
      }
    } catch (err) {
      console.error("Failed to delete deliverable:", err);
      toast.error("Failed to delete deliverable");
    }
  };

  // Edit handler - open sidebar when row is clicked
  const handleRowClick = (item) => {
    if (isReadOnly) return;
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Edit button handler
  const handleEdit = (item, e) => {
    if (isReadOnly) return;
    e.stopPropagation();
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
    loadDeliverables(); // Reload after edit
  };

  const handleSave = (updatedItem) => {
    // Update local state
    setItems((prev) =>
      prev.map((itm) => (itm._id === updatedItem._id ? updatedItem : itm))
    );
    // Reload to ensure consistency
    loadDeliverables();
  };

  // Calculate totals
  const totalAmount = items.reduce((sum, item) => {
    const amount = (item.qty || 0) * (item.rate || 0);
    const gstAmount = amount * ((item.gst || 0) / 100);
    return sum + amount + gstAmount;
  }, 0);

  // Filter items based on search
  const filteredItems = items.filter((item) => {
    const codeMatch = !searchCode || 
      (item.code && item.code.toLowerCase().includes(searchCode.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchCode.toLowerCase()));
    const specMatch = !searchSpec || 
      (item.spec && item.spec.toLowerCase().includes(searchSpec.toLowerCase()));
    const unitMatch = !searchUnit || 
      (item.unit && item.unit.toLowerCase().includes(searchUnit.toLowerCase()));
    const gstMatch = !searchGst || 
      (item.gst && item.gst.toString().includes(searchGst));
    
    return codeMatch && specMatch && unitMatch && gstMatch;
  });

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        {/* Table with search filters */}
        <div className="overflow-x-auto">
          {filteredItems.length === 0 && items.length === 0 ? (
            <div className="text-center text-gray-500 py-8 font-semibold">
              No deliverables available now
            </div>
          ) : (
            <table className="min-w-full text-sm border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-2 py-2 text-left font-semibold">
                    S.No
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-left font-semibold">
                    Photo
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-left font-semibold">
                    <div className="space-y-1">
                      <div>Deliverables Code & Category</div>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        className="w-full px-1 py-1 text-xs border rounded"
                      />
                    </div>
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-left font-semibold">
                    Deliverables along with Description
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-left font-semibold">
                    <div className="space-y-1">
                      <div>Specification</div>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchSpec}
                        onChange={(e) => setSearchSpec(e.target.value)}
                        className="w-full px-1 py-1 text-xs border rounded"
                      />
                    </div>
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-center font-semibold">
                    Qty
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-left font-semibold">
                    <div className="space-y-1">
                      <div>Unit Of Qty</div>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchUnit}
                        onChange={(e) => setSearchUnit(e.target.value)}
                        className="w-full px-1 py-1 text-xs border rounded"
                      />
                    </div>
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-right font-semibold">
                    Rate
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-right font-semibold">
                    Amount
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-left font-semibold">
                    <div className="space-y-1">
                      <div>Gst (%)</div>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchGst}
                        onChange={(e) => setSearchGst(e.target.value)}
                        className="w-full px-1 py-1 text-xs border rounded"
                      />
                    </div>
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-right font-semibold">
                    Total
                  </th>
                  {!isReadOnly && (
                    <th className="border border-gray-300 px-2 py-2 text-center font-semibold">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, idx) => {
                  const amount = (item.qty || 0) * (item.rate || 0);
                  const gstAmount = amount * ((item.gst || 0) / 100);
                  const totalWithGST = amount + gstAmount;

                  return (
                    <tr
                      key={item._id}
                      className={`transition-colors ${isReadOnly ? "" : "hover:bg-red-50 cursor-pointer"}`}
                      onClick={() => !isReadOnly && handleRowClick(item)}
                    >
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {idx + 1}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        {item.photo ? (
                          <img
                            src={item.photo}
                            alt="deliverable"
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/48";
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <div className="font-semibold">
                          {item.code || "-"} / {item.category || "-"}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 max-w-xs">
                        <div
                          className="truncate"
                          title={item.description || ""}
                        >
                          {item.description || "-"}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        {item.spec || "-"}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {item.qty || 0}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        {item.unit || "-"}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-right">
                        ₹{item.rate?.toLocaleString("en-IN") || 0}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-right">
                        ₹{amount.toLocaleString("en-IN")}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {item.gst || 0}%
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-right font-semibold">
                        ₹{totalWithGST.toLocaleString("en-IN")}
                      </td>
                      {!isReadOnly && (
                        <td className="border border-gray-300 px-2 py-2" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={(e) => handleEdit(item, e)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={(e) => handleDelete(item._id, e)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Bottom Section: Add Item Button and Total Amount */}
        <div className="flex justify-between items-center mt-6">
          {!isReadOnly && (
            <Button
              variant="custom"
              onClick={onAddDeliverable}
              className="flex items-center gap-2 bg-red-700 hover:bg-red-900 text-white px-6 py-2 rounded-lg font-semibold"
            >
              <FaPlus /> Add Item
            </Button>
          )}
          {isReadOnly && <div></div>}

          <div className="flex flex-col items-end">
            <div className="text-sm text-gray-600 mb-1">
              Including Gst (Tax)
            </div>
            <div className="bg-red-700 text-white px-6 py-3 rounded-lg font-bold text-lg">
              Total Amount: ₹{totalAmount.toLocaleString("en-IN")}/-
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
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

export default DeliverablesTableEnhanced;

