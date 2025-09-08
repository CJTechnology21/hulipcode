import React, { useState } from "react";
import { FaEdit, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import {
  updateSummaryRow,
  deleteSummaryRow,
} from "../../../services/quoteServices";
import { toast } from "react-toastify";

const QuoteSummary = ({
  activeSection,
  isHuelip,
  summary,
  setSummary,
  quoteId,
}) => {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  //  Filter by section
  const filteredData =
    activeSection === "Summary"
      ? summary || []
      : (summary || []).filter((row) => row.space === activeSection);

  //  Totals
  const totalAmount = filteredData.reduce(
    (sum, row) => sum + (Number(row.amount) || 0),
    0
  );
  const totalTax = filteredData.reduce(
    (sum, row) => sum + (Number(row.tax) || 0),
    0
  );
  const total = totalAmount + totalTax;

  const formatCurrency = (amount) =>
    `Rs ${Number(amount || 0).toLocaleString("en-IN")}/-`;

  const handleFinalAction = () => {
    navigate(isHuelip ? "/contract" : "/projects");
  };

  //  Save edit
  const handleSaveEdit = async (row) => {
    try {
      const updated = await updateSummaryRow(quoteId, row.space, row);
      setSummary(updated.summary || []);
      setEditingRow(null);
      toast.success("Row updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update row");
    }
  };

  //  Delete row
  const handleDeleteRow = async (space) => {
    try {
      const updated = await deleteSummaryRow(quoteId, space);
      setSummary(updated.summary || []);
      toast.success("Row deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete row");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      {/* Table */}
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="border-b font-semibold">
            <th className="py-2 px-2">
              <FiFilter />
            </th>
            <th className="py-2 px-2">Space</th>
            <th className="py-2 px-2">Work Packages</th>
            <th className="py-2 px-2">Items</th>
            <th className="py-2 px-2">Amount</th>
            <th className="py-2 px-2">Tax</th>
            <th className="py-2 px-2">Total</th>
            <th className="py-2 px-2">Edit</th>
            <th className="py-2 px-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, index) => (
              <tr key={row._id || index} className="border-b">
                <td className="py-2 px-2">{index + 1}</td>

                {editingRow === row.space ? (
                  <>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={row.space}
                        disabled
                        className="border p-1 rounded"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        value={row.workPackages}
                        onChange={(e) =>
                          setSummary((prev) =>
                            prev.map((r) =>
                              r.space === row.space
                                ? { ...r, workPackages: e.target.value }
                                : r
                            )
                          )
                        }
                        className="border p-1 rounded"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        value={row.items}
                        onChange={(e) =>
                          setSummary((prev) =>
                            prev.map((r) =>
                              r.space === row.space
                                ? { ...r, items: e.target.value }
                                : r
                            )
                          )
                        }
                        className="border p-1 rounded"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        value={row.amount}
                        onChange={(e) =>
                          setSummary((prev) =>
                            prev.map((r) =>
                              r.space === row.space
                                ? { ...r, amount: e.target.value }
                                : r
                            )
                          )
                        }
                        className="border p-1 rounded"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        value={row.tax}
                        onChange={(e) =>
                          setSummary((prev) =>
                            prev.map((r) =>
                              r.space === row.space
                                ? { ...r, tax: e.target.value }
                                : r
                            )
                          )
                        }
                        className="border p-1 rounded"
                      />
                    </td>
                    <td className="py-2 px-2">
                      {formatCurrency(
                        (Number(row.amount) || 0) + (Number(row.tax) || 0)
                      )}
                    </td>
                    <td className="py-2 px-2">
                      <Button
                        size="sm"
                        className="bg-green-600 text-white px-2 py-1 rounded"
                        onClick={() => handleSaveEdit(row)}
                      >
                        Save
                      </Button>
                    </td>
                    <td></td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-2">{row.space || "-"}</td>
                    <td className="py-2 px-2">{row.workPackages || "-"}</td>
                    <td className="py-2 px-2">{row.items || "-"}</td>
                    <td className="py-2 px-2">{formatCurrency(row.amount)}</td>
                    <td className="py-2 px-2">{formatCurrency(row.tax)}</td>
                    <td className="py-2 px-2">
                      {formatCurrency(
                        (Number(row.amount) || 0) + (Number(row.tax) || 0)
                      )}
                    </td>
                    <td
                      className="py-2 px-2 text-red-700 hover:cursor-pointer"
                      onClick={() => setEditingRow(row.space)}
                    >
                      <FaEdit size={18} />
                    </td>
                    <td
                      className="py-2 px-2 text-red-700 hover:cursor-pointer"
                      onClick={() => handleDeleteRow(row.space)}
                    >
                      <MdDelete size={18} />
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center py-4 text-gray-500 italic">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mt-4 text-sm font-semibold">
        <div className="flex flex-col items-end space-y-1">
          <div>Amount: {formatCurrency(totalAmount)}</div>
          <div>Tax: {formatCurrency(totalTax)}</div>
          <div className="text-lg mt-1">
            Total:{" "}
            <span className="bg-red-700 text-white px-4 py-1 rounded ml-2">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Terms */}
      {activeSection === "Summary" && (
        <div className="mt-6">
          <Button
            color="red"
            variant="custom"
            size="md"
            className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white"
            onClick={() => setShowTerms((prev) => !prev)}
          >
            Terms & Conditions
            {showTerms ? <FaChevronUp /> : <FaChevronDown />}
          </Button>

          {showTerms && (
            <div className="mt-3 text-xs text-gray-700 bg-gray-50 p-4 rounded shadow-inner">
              <p className="font-semibold mb-2 uppercase">
                Terms and Conditions for Interior Design & Execution Services
              </p>
              <p>
                This document outlines the terms and conditions governing the
                engagement between [Your Company Name] and [Client Name].
              </p>
              <p className="mt-2 italic">
                1. Quotation Validity & Acceptance ...
              </p>
              <p className="mt-1">2. Payment Terms ...</p>
              <p className="mt-1">3. Project Scope ...</p>

              <div className="mt-6 text-center">
                <Button
                  color="red"
                  size="md"
                  variant="custom"
                  className="bg-red-700 hover:bg-red-800 text-white"
                  onClick={handleFinalAction}
                >
                  {isHuelip ? "Sign Contract" : "Start Project"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuoteSummary;
