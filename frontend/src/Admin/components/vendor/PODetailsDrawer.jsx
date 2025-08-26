import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  FiX,
  FiUser,
  FiCalendar,
  FiPackage,
  FiTruck,
  FiFileText,
  FiAlertTriangle,
} from "react-icons/fi";
import Button from "../../../components/Button";
import { formatDate } from "../../../utils/dateFormatter";

export default function PODetailsDrawer({
  isOpen,
  onClose,
  selectedPO,
  onManageReturns,
  vendors = [],
  projects = [],
  archClients = [],
}) {
  if (!isOpen || !selectedPO) return null;

  const items = selectedPO.items || [];
  const returnedItems = selectedPO.returnedItems || [];

  const statusColors = {
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Overdue: "bg-red-100 text-red-700",
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + (item.qty || 0) * (item.price || 0),
    0
  );

  /**
   * ✅ Universal label resolver for IDs and objects
   */
  const getLabel = (arr, idOrObj) => {
    if (!arr || arr.length === 0 || !idOrObj) return "-";

    // If it's an object with name/label, return directly
    if (typeof idOrObj === "object" && (idOrObj.name || idOrObj.label)) {
      return idOrObj.name || idOrObj.label;
    }

    // Normalize to string ID
    const id =
      idOrObj?._id ||
      idOrObj?.value ||
      idOrObj?.$oid ||
      (typeof idOrObj === "string" ? idOrObj : null);

    if (!id) return "-";

    const match = arr.find(
      (item) => String(item._id || item.value) === String(id)
    );

    return match?.name || match?.label || "-";
  };

  // ✅ Resolve names
  const vendorName = getLabel(vendors, selectedPO.vendor);
  const projectName = getLabel(projects, selectedPO.project);
  const orderedByName = getLabel(archClients, selectedPO.orderedBy);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="w-screen max-w-lg bg-white shadow-xl flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b-2 border-red-500 bg-gray-50">
                  <Dialog.Title className="text-lg font-bold truncate">
                    PO Details - {vendorName}
                  </Dialog.Title>
                  <Button
                    variant="custom"
                    onClick={onClose}
                    className="hover:bg-gray-200 rounded-full p-1"
                  >
                    <FiX className="text-gray-500 w-5 h-5" />
                  </Button>
                </div>

                {/* Scrollable Content */}
                <div className="p-4 flex-1 overflow-y-auto space-y-4">
                  {/* General Info */}
                  <div className="bg-white rounded-lg border p-4 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiPackage />
                      <span className="font-medium">Project:</span>
                      <span className="text-gray-800">{projectName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiUser />
                      <span className="font-medium">Ordered By:</span>
                      <span className="text-gray-800">{orderedByName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiCalendar />
                      <span className="font-medium">Date:</span>
                      <span className="text-gray-800">
                        {formatDate(selectedPO.date) || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiFileText />
                      <span className="font-medium">Payment Terms:</span>
                      <span className="text-gray-800">
                        {selectedPO.paymentTerms || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiTruck />
                      <span className="font-medium">Delivery Date:</span>
                      <span className="text-gray-800">
                        {formatDate(selectedPO.deliveryDate) || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Status:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          statusColors[selectedPO.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {selectedPO.status || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Financials */}
                  <div className="bg-white rounded-lg border p-4 shadow-sm">
                    <h3 className="text-sm font-semibold mb-2">Financials</h3>
                    <p className="text-lg font-bold text-gray-800">
                      ₹{(selectedPO.amount || totalAmount).toLocaleString()}
                    </p>
                    {selectedPO.notes && (
                      <p className="text-sm text-gray-600 mt-2">
                        {selectedPO.notes}
                      </p>
                    )}
                  </div>

                  {/* Items Ordered */}
                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <h3 className="text-sm font-semibold p-4 border-b">
                      Items Ordered
                    </h3>
                    {items.length > 0 ? (
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b-2">
                          <tr>
                            <th className="p-2 text-left">Item</th>
                            <th className="p-2 text-center">Qty</th>
                            <th className="p-2 text-right">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, idx) => (
                            <tr
                              key={idx}
                              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                            >
                              <td className="p-2">{item.name || "-"}</td>
                              <td className="p-2 text-center">{item.qty || 0}</td>
                              <td className="p-2 text-right">
                                ₹{(item.price || 0).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-gray-100 font-bold border-t border-gray-300">
                            <td className="p-2 text-left">Total</td>
                            <td className="p-2 text-center">
                              {items.reduce((sum, item) => sum + (item.qty || 0), 0)}
                            </td>
                            <td className="p-2 text-right text-red-600">
                              ₹{totalAmount.toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <p className="p-4 text-gray-500 text-center">
                        No items added to this PO.
                      </p>
                    )}
                  </div>

                  {/* Returned Items */}
                  {returnedItems.length > 0 && (
                    <div className="bg-white rounded-lg border shadow-sm p-4">
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-red-600">
                        <FiAlertTriangle /> Returned Items
                      </h3>
                      <ul className="divide-y text-sm">
                        {returnedItems.map((ret, idx) => (
                          <li key={idx} className="py-2 flex justify-between">
                            <div>
                              <span className="font-medium">
                                {ret.itemName || "-"}
                              </span>{" "}
                              - {ret.qty || 0} pcs
                              <div className="text-gray-500 text-xs">
                                {ret.reason || "-"}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 flex justify-between">
                  <Button
                    variant="custom"
                    onClick={() =>
                      onManageReturns && onManageReturns(selectedPO)
                    }
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
                  >
                    Manage Returned Items
                  </Button>
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


