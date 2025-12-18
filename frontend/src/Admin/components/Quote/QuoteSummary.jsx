import React, { useState } from "react";
import { FaEdit, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import {
  updateSummaryRow,
  deleteSummaryRow,
  createProjectFromQuote,
  sendQuoteToClient,
  patchQuote,
} from "../../../services/quoteServices";
import { toast } from "react-toastify";

const QuoteSummary = ({
  activeSection,
  isHuelip,
  summary,
  setSummary,
  quoteId, //  Mongo _id
  qid, //  Human-readable ID (e.g. "Q005")
  architectId,
  clientName,
  quoteStatus = "Send", // Quote status: "Send", "In Review", "Approved", etc. (default to "Send")
  onQuoteStatusChange, // Callback to update parent when status changes
}) => {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isSendingQuote, setIsSendingQuote] = useState(false);

  // Debug: Log quote status
  console.log("QuoteSummary - quoteStatus:", quoteStatus);

  // Filter by section
  const filteredData =
    activeSection === "Summary"
      ? summary || []
      : (summary || []).filter((row) => row.space === activeSection);

  // Totals
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

  // ✅ FIXED: Pass both Mongo _id and qid to Contract page
  const handleFinalAction = async () => {
    if (isHuelip) {
      if (!quoteId) {
        toast.error("Quote ID missing!");
        return;
      }

      navigate("/contract", {
        state: {
          quoteId, // ✅ Mongo _id (for API call)
          qid, // ✅ human-readable code (for display)
          totalAmount: total,
          architectId,
        },
      });
    } else {
      // ✅ For Non-Huelip: Create project directly and then navigate
      if (!quoteId) {
        toast.error("Quote ID missing!");
        return;
      }

      if (!architectId) {
        toast.error("Architect ID missing! Cannot create project.");
        return;
      }

      try {
        setIsCreatingProject(true);
        toast.info("Creating project from quote...");
        
        await createProjectFromQuote(quoteId, architectId);
        
        toast.success("Project created successfully!");
        navigate("/projects");
      } catch (err) {
        console.error("Error creating project:", err);
        toast.error(
          err.response?.data?.message ||
            "Failed to create project. Please try again."
        );
      } finally {
        setIsCreatingProject(false);
      }
    }
  };

  // Save edit
  const handleSaveEdit = async (row) => {
    try {
      const fields = {
        space: row.space,
        workPackages: row.workPackages,
        items: row.items,
        amount: row.amount,
        tax: row.tax,
      };

      const updated = await updateSummaryRow(quoteId, row._id, fields);
      setSummary(updated.summary || []);
      setEditingRowId(null);
      toast.success("Row updated successfully");
    } catch (err) {
      console.error("Update row failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to update row");
    }
  };

  // Delete row
  const handleDeleteRow = async (spaceId) => {
    try {
      const updated = await deleteSummaryRow(quoteId, spaceId);
      setSummary(updated.summary || []);
      toast.success("Row deleted successfully");
    } catch (err) {
      console.error("Delete row failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to delete row");
    }
  };

  // Send quote to client (TESTING MODE: Directly approves quote)
  const handleSendToClient = async () => {
    if (!quoteId) {
      toast.error("Quote ID missing!");
      return;
    }

    try {
      setIsSendingQuote(true);
      toast.info(`Approving quote ${qid} for testing...`);
      
      // TESTING MODE: Skip email sending and directly approve quote
      // This enables "Create Contract" button immediately
      // TODO: Re-enable email sending when ready for production
      
      // Commented out for testing:
      // const result = await sendQuoteToClient(quoteId);
      
      // Update quote status to "Approved" in database
      await patchQuote(quoteId, { status: "Approved" });
      
      // Update status in parent component
      if (onQuoteStatusChange) {
        onQuoteStatusChange("Approved");
      }
      
      toast.success(`Quote ${qid} approved! You can now create a contract.`);
    } catch (err) {
      console.error("Error approving quote:", err);
      toast.error("Failed to approve quote. Please try again.");
    } finally {
      setIsSendingQuote(false);
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
              <tr key={row._id} className="border-b">
                <td className="py-2 px-2">{index + 1}</td>

                {editingRowId === row._id ? (
                  <>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={row.space || ""}
                        onChange={(e) =>
                          setSummary((prev) =>
                            prev.map((r) =>
                              r._id === row._id
                                ? { ...r, space: e.target.value }
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
                        value={row.workPackages}
                        onChange={(e) =>
                          setSummary((prev) =>
                            prev.map((r) =>
                              r._id === row._id
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
                              r._id === row._id
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
                              r._id === row._id
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
                              r._id === row._id
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
                      onClick={() => setEditingRowId(row._id)}
                    >
                      <FaEdit size={18} />
                    </td>
                    <td
                      className="py-2 px-2 text-red-700 hover:cursor-pointer"
                      onClick={() => handleDeleteRow(row._id)}
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

      {/* Action Buttons - Always visible when Summary section */}
      {activeSection === "Summary" && (
        <div className="mt-6 space-y-4">
          {/* Debug Info */}
          <div className="text-xs text-gray-500 mb-2">
            Quote Status: <strong>{quoteStatus || "Not Set"}</strong>
          </div>

          {/* Action Buttons Section */}
          <div className="flex gap-3 justify-center flex-wrap items-center">
            {/* Send to Client Button - Show when status is "Send", undefined, or null */}
            {(quoteStatus === "Send" || !quoteStatus || quoteStatus === null || quoteStatus === undefined) && (
              <Button
                color="red"
                size="md"
                variant="custom"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow-md"
                onClick={handleSendToClient}
                disabled={isSendingQuote}
              >
                {isSendingQuote ? "⏳ Sending..." : "📧 Send to Client"}
              </Button>
            )}

            {/* Status Message */}
            {quoteStatus === "In Review" && (
              <div className="w-full text-center py-3 px-4 bg-yellow-100 text-yellow-800 rounded border border-yellow-300">
                <p className="font-semibold">⏳ Quote sent to client. Waiting for approval...</p>
                <p className="text-sm mt-1">The client will receive an email with the quotation details.</p>
              </div>
            )}

            {/* Create Contract Button - Show when status is "Approved" */}
            {quoteStatus === "Approved" && (
              <Button
                color="red"
                size="md"
                variant="custom"
                className="bg-red-700 hover:bg-red-800 text-white px-6 py-2"
                onClick={async () => {
                  if (!quoteId) {
                    toast.error("Quote ID missing!");
                    return;
                  }
                  try {
                    toast.info("Creating contract...");
                    const { createContractFromQuote } = await import("../../../services/contractServices");
                    await createContractFromQuote(quoteId);
                    toast.success("Contract created successfully! You can now sign it from the Contracts page.");
                    // Optionally navigate to contracts page
                    setTimeout(() => {
                      navigate("/contracts");
                    }, 1500);
                  } catch (err) {
                    console.error("Error creating contract:", err);
                    toast.error(err.response?.data?.error || "Failed to create contract. Please try again.");
                  }
                }}
              >
                📄 Create Contract
              </Button>
            )}

            {/* Start Project Button - Show only when approved */}
            {quoteStatus === "Approved" && (
              <Button
                color="red"
                size="md"
                variant="custom"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                onClick={handleFinalAction}
                disabled={isCreatingProject}
              >
                {isCreatingProject
                  ? "Creating Project..."
                  : "🚀 Start Project"}
              </Button>
            )}
          </div>

          {/* Terms & Conditions Section */}
          <div className="mt-4">
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteSummary;

// import React, { useState } from "react";
// import { FaEdit, FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { FiFilter } from "react-icons/fi";
// import { MdDelete } from "react-icons/md";
// import Button from "../../../components/Button";
// import { useNavigate } from "react-router-dom";
// import {
//   updateSummaryRow,
//   deleteSummaryRow,
// } from "../../../services/quoteServices";
// import { toast } from "react-toastify";

// const QuoteSummary = ({
//   activeSection,
//   isHuelip,
//   summary,
//   setSummary,
//   quoteId,
//   qid,
// }) => {
//   const navigate = useNavigate();
//   const [showTerms, setShowTerms] = useState(false);
//   const [editingRowId, setEditingRowId] = useState(null);

//   // Filter by section
//   const filteredData =
//     activeSection === "Summary"
//       ? summary || []
//       : (summary || []).filter((row) => row.space === activeSection);

//   // Totals
//   const totalAmount = filteredData.reduce(
//     (sum, row) => sum + (Number(row.amount) || 0),
//     0
//   );
//   const totalTax = filteredData.reduce(
//     (sum, row) => sum + (Number(row.tax) || 0),
//     0
//   );
//   const total = totalAmount + totalTax;

//   const formatCurrency = (amount) =>
//     `Rs ${Number(amount || 0).toLocaleString("en-IN")}/-`;

// const handleFinalAction = () => {
//     if (isHuelip) {
//       if (!qid) {
//         toast.error("Quote ID missing!");
//         return;
//       }
//       navigate("/contract", {
//         state: {
//           quoteId: qid, // ✅ pass human-readable quote code (like "Q005")
//           totalAmount: total,
//         },
//       });
//     } else {
//       navigate("/projects");
//     }
//   };
//   // Save edit
//   const handleSaveEdit = async (row) => {
//     try {
//       const fields = {
//         space: row.space,
//         workPackages: row.workPackages,
//         items: row.items,
//         amount: row.amount,
//         tax: row.tax,
//       };

//       const updated = await updateSummaryRow(quoteId, row._id, fields);
//       setSummary(updated.summary || []);
//       setEditingRowId(null);
//       toast.success("Row updated successfully");
//     } catch (err) {
//       console.error("Update row failed:", err.response?.data || err.message);
//       toast.error(err.response?.data?.message || "Failed to update row");
//     }
//   };

//   // Delete row
//   const handleDeleteRow = async (spaceId) => {
//     try {
//       const updated = await deleteSummaryRow(quoteId, spaceId);
//       setSummary(updated.summary || []);
//       toast.success("Row deleted successfully");
//     } catch (err) {
//       console.error("Delete row failed:", err.response?.data || err.message);
//       toast.error(err.response?.data?.message || "Failed to delete row");
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
//       {/* Table */}
//       <table className="min-w-full text-sm text-left">
//         <thead>
//           <tr className="border-b font-semibold">
//             <th className="py-2 px-2">
//               <FiFilter />
//             </th>
//             <th className="py-2 px-2">Space</th>
//             <th className="py-2 px-2">Work Packages</th>
//             <th className="py-2 px-2">Items</th>
//             <th className="py-2 px-2">Amount</th>
//             <th className="py-2 px-2">Tax</th>
//             <th className="py-2 px-2">Total</th>
//             <th className="py-2 px-2">Edit</th>
//             <th className="py-2 px-2">Delete</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.length > 0 ? (
//             filteredData.map((row, index) => (
//               <tr key={row._id} className="border-b">
//                 <td className="py-2 px-2">{index + 1}</td>

//                 {editingRowId === row._id ? (
//                   <>
//                     <td className="py-2 px-2">
//                       <input
//                         type="text"
//                         value={row.space || ""}
//                         onChange={(e) =>
//                           setSummary((prev) =>
//                             prev.map((r) =>
//                               r._id === row._id
//                                 ? { ...r, space: e.target.value }
//                                 : r
//                             )
//                           )
//                         }
//                         className="border p-1 rounded"
//                       />
//                     </td>

//                     {/* <td className="py-2 px-2">
//                       <input
//                         type="text"
//                         value={row.space || ""}
//                         disabled
//                         className="border p-1 rounded"
//                       />
//                     </td> */}
//                     <td className="py-2 px-2">
//                       <input
//                         type="number"
//                         value={row.workPackages}
//                         onChange={(e) =>
//                           setSummary((prev) =>
//                             prev.map((r) =>
//                               r._id === row._id
//                                 ? { ...r, workPackages: e.target.value }
//                                 : r
//                             )
//                           )
//                         }
//                         className="border p-1 rounded"
//                       />
//                     </td>
//                     <td className="py-2 px-2">
//                       <input
//                         type="number"
//                         value={row.items}
//                         onChange={(e) =>
//                           setSummary((prev) =>
//                             prev.map((r) =>
//                               r._id === row._id
//                                 ? { ...r, items: e.target.value }
//                                 : r
//                             )
//                           )
//                         }
//                         className="border p-1 rounded"
//                       />
//                     </td>
//                     <td className="py-2 px-2">
//                       <input
//                         type="number"
//                         value={row.amount}
//                         onChange={(e) =>
//                           setSummary((prev) =>
//                             prev.map((r) =>
//                               r._id === row._id
//                                 ? { ...r, amount: e.target.value }
//                                 : r
//                             )
//                           )
//                         }
//                         className="border p-1 rounded"
//                       />
//                     </td>
//                     <td className="py-2 px-2">
//                       <input
//                         type="number"
//                         value={row.tax}
//                         onChange={(e) =>
//                           setSummary((prev) =>
//                             prev.map((r) =>
//                               r._id === row._id
//                                 ? { ...r, tax: e.target.value }
//                                 : r
//                             )
//                           )
//                         }
//                         className="border p-1 rounded"
//                       />
//                     </td>
//                     <td className="py-2 px-2">
//                       {formatCurrency(
//                         (Number(row.amount) || 0) + (Number(row.tax) || 0)
//                       )}
//                     </td>
//                     <td className="py-2 px-2">
//                       <Button
//                         size="sm"
//                         className="bg-green-600 text-white px-2 py-1 rounded"
//                         onClick={() => handleSaveEdit(row)}
//                       >
//                         Save
//                       </Button>
//                     </td>
//                     <td></td>
//                   </>
//                 ) : (
//                   <>
//                     <td className="py-2 px-2">{row.space || "-"}</td>
//                     <td className="py-2 px-2">{row.workPackages || "-"}</td>
//                     <td className="py-2 px-2">{row.items || "-"}</td>
//                     <td className="py-2 px-2">{formatCurrency(row.amount)}</td>
//                     <td className="py-2 px-2">{formatCurrency(row.tax)}</td>
//                     <td className="py-2 px-2">
//                       {formatCurrency(
//                         (Number(row.amount) || 0) + (Number(row.tax) || 0)
//                       )}
//                     </td>
//                     <td
//                       className="py-2 px-2 text-red-700 hover:cursor-pointer"
//                       onClick={() => setEditingRowId(row._id)}
//                     >
//                       <FaEdit size={18} />
//                     </td>
//                     <td
//                       className="py-2 px-2 text-red-700 hover:cursor-pointer"
//                       onClick={() => handleDeleteRow(row._id)}
//                     >
//                       <MdDelete size={18} />
//                     </td>
//                   </>
//                 )}
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="9" className="text-center py-4 text-gray-500 italic">
//                 No data available
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Totals */}
//       <div className="flex justify-end mt-4 text-sm font-semibold">
//         <div className="flex flex-col items-end space-y-1">
//           <div>Amount: {formatCurrency(totalAmount)}</div>
//           <div>Tax: {formatCurrency(totalTax)}</div>
//           <div className="text-lg mt-1">
//             Total:{" "}
//             <span className="bg-red-700 text-white px-4 py-1 rounded ml-2">
//               {formatCurrency(total)}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Terms */}
//       {activeSection === "Summary" && (
//         <div className="mt-6">
//           <Button
//             color="red"
//             variant="custom"
//             size="md"
//             className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white"
//             onClick={() => setShowTerms((prev) => !prev)}
//           >
//             Terms & Conditions
//             {showTerms ? <FaChevronUp /> : <FaChevronDown />}
//           </Button>

//           {showTerms && (
//             <div className="mt-3 text-xs text-gray-700 bg-gray-50 p-4 rounded shadow-inner">
//               <p className="font-semibold mb-2 uppercase">
//                 Terms and Conditions for Interior Design & Execution Services
//               </p>
//               <p>
//                 This document outlines the terms and conditions governing the
//                 engagement between [Your Company Name] and [Client Name].
//               </p>
//               <p className="mt-2 italic">
//                 1. Quotation Validity & Acceptance ...
//               </p>
//               <p className="mt-1">2. Payment Terms ...</p>
//               <p className="mt-1">3. Project Scope ...</p>

//               <div className="mt-6 text-center">
//                 <Button
//                   color="red"
//                   size="md"
//                   variant="custom"
//                   className="bg-red-700 hover:bg-red-800 text-white"
//                   onClick={handleFinalAction}
//                 >
//                   {isHuelip ? "Sign Contract" : "Start Project"}
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuoteSummary;
