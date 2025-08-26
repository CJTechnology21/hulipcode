import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX, FiAlertTriangle, FiPackage, FiRepeat } from "react-icons/fi";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

export default function ReturnItemsModal({
  isOpen,
  onClose,
  po,
  onUpdate,
  vendors = [],
}) {
  const [selectedItem, setSelectedItem] = useState("");
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState("");

  if (!po) return null;

  const items = po.items || [];
  const returns = po.returns || [];

  /** ✅ Universal label resolver (same logic as PODetailsDrawer) */
  const getLabel = (arr, idOrObj) => {
    if (!arr || arr.length === 0 || !idOrObj) return "-";

    if (typeof idOrObj === "object" && (idOrObj.name || idOrObj.label)) {
      return idOrObj.name || idOrObj.label;
    }

    const id =
      idOrObj?.$oid ||
      idOrObj?._id ||
      idOrObj?.value ||
      (typeof idOrObj === "string" ? idOrObj : null);

    if (!id) return "-";

    const match = arr.find(
      (item) => String(item._id || item.value) === String(id)
    );

    return match?.name || match?.label || "-";
  };

  const vendorName = getLabel(vendors, po.vendor);

  const handleAddReturn = () => {
    if (!selectedItem || !qty) {
      alert("Please select an item and enter quantity.");
      return;
    }

    const itemData = items.find((i) => i.name === selectedItem);
    if (!itemData) return;

    if (Number(qty) > itemData.qty) {
      alert(
        `You cannot return more than ${itemData.qty} units of ${itemData.name}.`
      );
      return;
    }

    const updatedPO = {
      ...po,
      returns: [
        ...returns,
        {
          name: selectedItem,
          qty: Number(qty),
          reason,
          date: new Date().toISOString().split("T")[0],
        },
      ],
    };

    onUpdate(updatedPO);
    setSelectedItem("");
    setQty("");
    setReason("");
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
        {/* Background overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        {/* Modal Content */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                  <Dialog.Title className="text-lg font-bold flex items-center gap-2">
                    <FiRepeat className="text-red-500" />
                    Manage Returns - {vendorName}
                  </Dialog.Title>
                  <Button
                    variant="custom"
                    onClick={onClose}
                    className="hover:bg-gray-200 rounded-full p-1"
                  >
                    <FiX className="text-gray-500 w-5 h-5" />
                  </Button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  {/* Existing Returns */}
                  {returns.length > 0 ? (
                    <div className="bg-white rounded-lg border shadow-sm">
                      <h3 className="text-sm font-semibold p-3 border-b flex items-center gap-2 text-red-600">
                        <FiAlertTriangle /> Returned Items
                      </h3>
                      <ul className="divide-y text-sm">
                        {returns.map((r, idx) => (
                          <li
                            key={idx}
                            className="py-2 px-3 flex justify-between text-gray-700"
                          >
                            <span>
                              {r.name} (x{r.qty})
                              <div className="text-xs text-gray-500">
                                {r.reason || "—"}
                              </div>
                            </span>
                            <span className="text-xs text-gray-400">
                              {r.date || ""}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No returned items logged yet.
                    </p>
                  )}

                  {/* Add New Return */}
                  <div className="bg-gray-50 rounded-lg p-4 border space-y-3">
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <FiPackage /> Add Returned Item
                    </h3>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Select Item
                      </label>
                      <select
                        className="w-full border rounded px-3 py-2 text-sm"
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e.target.value)}
                      >
                        <option value="">-- Select --</option>
                        {items.map((item, idx) => (
                          <option key={idx} value={item.name}>
                            {item.name} (Ordered: {item.qty || 0})
                          </option>
                        ))}
                      </select>
                    </div>

                    <Input
                      name="qty"
                      type="number"
                      placeholder="Quantity to return"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                    />
                    <Input
                      name="reason"
                      placeholder="Reason for return"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />

                    <Button
                      variant="custom"
                      className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                      fullWidth
                      onClick={handleAddReturn}
                    >
                      Add Returned Item
                    </Button>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 text-right">
                  <Button
                    variant="custom"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                  >
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}