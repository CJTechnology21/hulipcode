import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import {
  FiEdit2,
  FiDownload,
  FiMoreVertical,
  FiTrash2,
  FiCheck,
  FiX,
} from "react-icons/fi";

const ReqDetailsModal = ({
  selectedGroup,
  setSelectedGroup,
  items,
  setItems,
  TABS = [],
}) => {
  const [editMode, setEditMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editedItems, setEditedItems] = useState([]);

  // Hook to close dropdown menu when clicking outside
  useEffect(() => {
    const closeMenu = (e) => {
      if (!e.target.closest(".menu-button")) {
        setShowMenu(false);
      }
    };
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  // Don’t render modal if no group selected
  if (!selectedGroup) return null;

  const enterEditMode = () => {
    setEditedItems(JSON.parse(JSON.stringify(selectedGroup.items)));
    setEditMode(true);
  };

  const handleEditChange = (index, field, value) => {
    setEditedItems((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSave = () => {
    setSelectedGroup((prev) => ({ ...prev, items: editedItems }));
    setEditMode(false);
    toast.success("Changes saved ✅");
  };

  const handleCancel = () => {
    setEditedItems([]);
    setEditMode(false);
    toast.info("Edit canceled ⚠️");
  };

  const handleDownload = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text("Material Request Invoice", 14, 20);
      doc.text(`Project: ${selectedGroup?.location}`, 14, 30);
      doc.text(`Date: ${selectedGroup?.date}`, 14, 40);

      autoTable(doc, {
        startY: 50,
        head: [["Item", "Qty", "Unit", "Status"]],
        body: selectedGroup.items.map((item) => [
          item.title,
          item.quantity,
          item.unit,
          item.status,
        ]),
      });

      doc.save("material-request.pdf");
      toast.success("PDF downloaded successfully ✅");
    } catch (err) {
      console.error("PDF Download Error:", err);
      toast.error("Failed to download PDF ❌");
    }
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this request?");
    if (confirmDelete) {
      const updated = { ...items };
      const groupLoc = selectedGroup.location;
      for (const status of TABS) {
        updated[status] = updated[status].filter((item) => item.location !== groupLoc);
      }
      setItems(updated);
      setSelectedGroup(null);
      setShowMenu(false);
      toast.success("Request deleted successfully ✅");
    }
  };

  return (
    <Transition show={!!selectedGroup} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setSelectedGroup(null)}>
        <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl z-50 overflow-y-auto">
          {/* Header */}
          <div className="p-4 flex justify-between items-start border-b">
            <div>
              <div className="text-xs text-gray-500 font-semibold">MATERIAL REQUEST</div>
              <Dialog.Title className="text-xl font-bold text-gray-900">
                BY {selectedGroup?.enteredBy}
              </Dialog.Title>
            </div>

            <div className="flex items-center space-x-2 relative">
              {!editMode ? (
                <button className="p-2 rounded hover:bg-gray-100" onClick={enterEditMode} title="Edit">
                  <FiEdit2 className="text-gray-700" />
                </button>
              ) : (
                <>
                  <button className="p-2 rounded hover:bg-gray-100" onClick={handleSave} title="Save">
                    <FiCheck className="text-green-700" />
                  </button>
                  <button className="p-2 rounded hover:bg-gray-100" onClick={handleCancel} title="Cancel">
                    <FiX className="text-red-600" />
                  </button>
                </>
              )}

              <button className="p-2 rounded hover:bg-gray-100" onClick={handleDownload} title="Download PDF">
                <FiDownload className="text-gray-700" />
              </button>

              <div className="relative">
                <button
                  className="p-2 rounded hover:bg-gray-100 menu-button"
                  onClick={() => setShowMenu((prev) => !prev)}
                  title="More"
                >
                  <FiMoreVertical className="text-gray-700" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 bg-white border shadow-md rounded-md z-50">
                    <button
                      onClick={handleDelete}
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                    >
                      <FiTrash2 className="mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="h-1 bg-purple-500" />

          {/* Body */}
          <div className="p-4">
            <div className="text-2xl font-semibold text-gray-800 mb-4">
              #{selectedGroup?.location?.split(",")[0]}
            </div>

            <div className="flex justify-between text-gray-500 font-semibold text-sm border-b pb-2">
              <span className="w-1/2">Item</span>
              <span className="w-1/4 text-center">Qty.</span>
              <span className="w-1/4 text-right">Status</span>
            </div>

            {(editMode ? editedItems : selectedGroup.items).map((item, idx) => (
              <div key={idx} className="flex justify-between items-start border-b py-3">
                <div className="w-1/2">
                  <div className="font-medium text-sm text-gray-900">{item.title}</div>
                </div>

                <div className="w-1/4 text-center text-sm text-gray-700">
                  {editMode ? (
                    <>
                      <input
                        type="number"
                        className="w-14 border rounded text-center text-sm mb-1"
                        value={item.quantity}
                        onChange={(e) => handleEditChange(idx, "quantity", parseInt(e.target.value, 10))}
                      />
                      <input
                        type="text"
                        className="w-12 border rounded text-center text-sm"
                        value={item.unit}
                        onChange={(e) => handleEditChange(idx, "unit", e.target.value)}
                      />
                    </>
                  ) : (
                    <>
                      {item.quantity} {item.unit}
                      <div className="text-xs text-gray-400">0 ordered</div>
                    </>
                  )}
                </div>

                <div className="w-1/4 text-right text-sm">
                  <div className="text-green-600 font-semibold">{item.status}</div>
                  <div className="text-xs text-gray-500">{item.enteredBy}</div>
                </div>
              </div>
            ))}

            <div className="mt-6 pt-4 border-t text-sm text-gray-600">
              <div className="font-semibold">Project:</div>
              <div>{selectedGroup?.location}</div>
              <div className="mt-2 text-gray-500">Date: {selectedGroup?.date}</div>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ReqDetailsModal;
