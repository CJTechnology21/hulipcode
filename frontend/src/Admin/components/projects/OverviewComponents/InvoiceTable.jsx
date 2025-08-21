import React, { useState } from "react";
import Button from "../../../../components/Button";
import { BsThreeDotsVertical } from "react-icons/bs";
import { toast } from "react-toastify";
import { deleteInvoice, updateInvoice } from "../../../../services/overViewServices"; // adjust path

function InvoiceTable({ invoices, loadingInvoices, setInvoices, setShowInvoiceModal, formatDate }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [editInvoiceId, setEditInvoiceId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Delete handler
  const handleDelete = async (invoice) => {
    try {
      await deleteInvoice(invoice._id);
      setInvoices((prev) => prev.filter((i) => i._id !== invoice._id));
      toast.success("Invoice deleted successfully ✅");
    } catch (err) {
      toast.error("Failed to delete invoice ❌");
      console.error(err);
    }
  };

  // Enter edit mode
  const handleEdit = (invoice) => {
    setEditInvoiceId(invoice._id);
    setEditForm({
      firm: invoice.firm,
      date: invoice.date?.slice(0, 10),
      amount: invoice.amount ?? "",
    });
  };

  // Save updated invoice
  const handleSave = async (invoiceId) => {
    try {
      const updated = await updateInvoice(invoiceId, editForm);
      setInvoices((prev) =>
        prev.map((i) => (i._id === invoiceId ? updated : i))
      );
      toast.success("Invoice updated successfully ✅");
      setEditInvoiceId(null);
    } catch (err) {
      toast.error("Failed to update invoice ❌");
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex justify-between mb-2 items-center">
        <h3 className="font-semibold text-gray-800">Sales Invoices</h3>
        <Button
          variant="custom"
          className="text-xs text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600"
          onClick={() => setShowInvoiceModal(true)}
        >
          + Add Invoice
        </Button>
      </div>

      {loadingInvoices ? (
        <div className="h-24 text-center text-sm text-gray-400 flex items-center justify-center border rounded">
          Loading invoices...
        </div>
      ) : invoices.length === 0 ? (
        <div className="h-24 text-center text-sm text-gray-400 flex items-center justify-center border rounded">
          No invoices to show
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700 border">
            <thead>
              <tr className="text-gray-500 border-b bg-gray-50">
                <th className="py-2 px-3 text-left">S.No</th>
                <th className="py-2 px-3 text-left">Firm</th>
                <th className="py-2 px-3 text-left">Date</th>
                <th className="py-2 px-3 text-left">Amount</th>
                <th className="py-2 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, index) => (
                <tr
                  key={inv._id || inv.id}
                  className="border-t hover:bg-gray-50 transition relative"
                >
                  <td className="px-3 py-2">{index + 1}</td>

                  {editInvoiceId === inv._id ? (
                    <>
                      {/* Editable row */}
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={editForm.firm}
                          onChange={(e) =>
                            setEditForm({ ...editForm, firm: e.target.value })
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={(e) =>
                            setEditForm({ ...editForm, date: e.target.value })
                          }
                          className="border rounded px-2 py-1"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={editForm.amount}
                          onChange={(e) =>
                            setEditForm({ ...editForm, amount: e.target.value })
                          }
                          className="border rounded px-2 py-1 w-24"
                        />{" "}
                        ₹
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => handleSave(inv._id)}
                          className="text-green-600 px-2 hover:underline"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditInvoiceId(null)}
                          className="text-gray-500 px-2 hover:underline"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      {/* Normal row */}
                      <td className="px-3 py-2">{inv.firm}</td>
                      <td className="px-3 py-2">{formatDate(inv.date)}</td>
                      <td className="px-3 py-2">₹ {inv.amount}</td>
                      <td className="px-3 py-2 text-center relative">
                        <button
                          className="p-1 rounded hover:bg-gray-200"
                          onClick={() =>
                            setOpenMenu(openMenu === inv._id ? null : inv._id)
                          }
                        >
                          <BsThreeDotsVertical size={18} />
                        </button>

                        {openMenu === inv._id && (
                          <div className="absolute right-4 mt-1 w-28 bg-white border rounded shadow-md text-sm z-10">
                            <button
                              className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                              onClick={() => {
                                setOpenMenu(null);
                                handleEdit(inv);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                              onClick={() => {
                                setOpenMenu(null);
                                handleDelete(inv);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default InvoiceTable;
