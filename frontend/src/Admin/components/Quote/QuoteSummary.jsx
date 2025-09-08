import React, { useState } from "react";
import { FaEdit, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { MdDelete, MdSave, MdClose } from "react-icons/md";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  updateSummaryRow,
  deleteSummaryRow,
} from "../../../services/quoteServices";

const QuoteSummary = ({
  activeSection,
  isHuelip,
  summary = [],
  quoteId,
  onUpdate,
}) => {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const [editingRow, setEditingRow] = useState(null); // track which row is being edited
  const [editData, setEditData] = useState({}); // hold edit data for the active row

  // Ensure summary is always an array
  const safeSummary = Array.isArray(summary) ? summary : [];

  // Filter data by active section
  const filteredData =
    activeSection === "Summary"
      ? safeSummary
      : safeSummary.filter((row) => row.space === activeSection);

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

  const handleFinalAction = () => {
    if (isHuelip) {
      navigate("/contract");
    } else {
      navigate("/projects");
    }
  };

  // Start Editing
  const handleEdit = (row, index) => {
    const rowKey = row._id || index;
    setEditingRow(rowKey);
    setEditData({ ...row });
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditData({});
  };

  // Save Edit (update summary entry)
  const handleSaveEdit = async () => {
    try {
      const { space, ...fields } = editData;
      await updateSummaryRow(quoteId, space, fields);
      toast.success("Summary row updated successfully");
      setEditingRow(null);
      setEditData({});
      onUpdate?.(); // refresh parent data
    } catch (error) {
      toast.error("Failed to update summary row");
    }
  };

  // Delete Row
  const handleDelete = async (space) => {
    try {
      await deleteSummaryRow(quoteId, space);
      toast.success("Summary row deleted successfully");
      onUpdate?.(); // refresh parent data
    } catch (error) {
      toast.error("Failed to delete summary row");
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
            <th className="py-2 px-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, index) => {
              const rowKey = row._id || index;
              const isEditing = editingRow === rowKey;
              const currentData = isEditing ? editData : row;

              return (
                <tr key={rowKey} className="border-b">
                  <td className="py-2 px-2">{index + 1}</td>

                  {/* Space */}
                  <td className="py-2 px-2">
                    {isEditing ? (
                      <input
                        className="border p-1 rounded w-full"
                        value={editData.space || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, space: e.target.value })
                        }
                      />
                    ) : (
                      currentData.space || "-"
                    )}
                  </td>

                  {/* Work Packages */}
                  <td className="py-2 px-2">
                    {isEditing ? (
                      <input
                        className="border p-1 rounded w-full"
                        value={editData.workPackages || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            workPackages: e.target.value,
                          })
                        }
                      />
                    ) : (
                      currentData.workPackages || "-"
                    )}
                  </td>

                  {/* Items */}
                  <td className="py-2 px-2">
                    {isEditing ? (
                      <input
                        className="border p-1 rounded w-full"
                        value={editData.items || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, items: e.target.value })
                        }
                      />
                    ) : (
                      currentData.items || "-"
                    )}
                  </td>

                  {/* Amount */}
                  <td className="py-2 px-2">
                    {isEditing ? (
                      <input
                        type="number"
                        className="border p-1 rounded w-full"
                        value={editData.amount || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, amount: e.target.value })
                        }
                      />
                    ) : (
                      formatCurrency(currentData.amount)
                    )}
                  </td>

                  {/* Tax */}
                  <td className="py-2 px-2">
                    {isEditing ? (
                      <input
                        type="number"
                        className="border p-1 rounded w-full"
                        value={editData.tax || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, tax: e.target.value })
                        }
                      />
                    ) : (
                      formatCurrency(currentData.tax)
                    )}
                  </td>

                  {/* Total */}
                  <td className="py-2 px-2">
                    {formatCurrency(
                      (Number(currentData.amount) || 0) +
                        (Number(currentData.tax) || 0)
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-2 px-2 flex gap-2 text-red-700">
                    {isEditing ? (
                      <>
                        <MdSave
                          size={20}
                          className="cursor-pointer text-green-600"
                          onClick={handleSaveEdit}
                        />
                        <MdClose
                          size={20}
                          className="cursor-pointer text-gray-600"
                          onClick={handleCancelEdit}
                        />
                      </>
                    ) : (
                      <>
                        <FaEdit
                          size={18}
                          className="cursor-pointer"
                          onClick={() => handleEdit(row, index)}
                        />
                        <MdDelete
                          size={18}
                          className="cursor-pointer"
                          onClick={() => handleDelete(row.space)}
                        />
                      </>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500 italic">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Totals Row */}
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

      {/* Terms & Conditions Toggle */}
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
                engagement between [Your Company Name] and [Client Name]. The
                Designer agrees to execute the project at [Project Site
                Address]...
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

// import React, { useState } from "react";
// import { FaEdit, FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { FiFilter } from "react-icons/fi";
// import Button from "../../../components/Button";
// import { useNavigate } from "react-router-dom";
// import { MdDelete } from "react-icons/md";

// const QuoteSummary = ({ activeSection, isHuelip, summary = [] }) => {
//   const navigate = useNavigate();
//   const [showTerms, setShowTerms] = useState(false);

//   //  Ensure summary is always an array
//   const safeSummary = Array.isArray(summary) ? summary : [];

//   //  Filter data by active section
//   const filteredData =
//     activeSection === "Summary"
//       ? safeSummary
//       : safeSummary.filter((row) => row.space === activeSection);

//   //  Totals (safe reduce)
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

//   const handleFinalAction = () => {
//     if (isHuelip) {
//       navigate("/contract");
//     } else {
//       navigate("/projects");
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
//               <tr key={row._id || index} className="border-b">
//                 <td className="py-2 px-2">{index + 1}</td>
//                 <td className="py-2 px-2">{row.space || "-"}</td>
//                 <td className="py-2 px-2">{row.workPackages || "-"}</td>
//                 <td className="py-2 px-2">{row.items || "-"}</td>
//                 <td className="py-2 px-2">{formatCurrency(row.amount)}</td>
//                 <td className="py-2 px-2">{formatCurrency(row.tax)}</td>
//                 <td className="py-2 px-2">
//                   {formatCurrency(
//                     (Number(row.amount) || 0) + (Number(row.tax) || 0)
//                   )}
//                 </td>
//                 <td className="py-2 px-2 text-red-700 hover:cursor-pointer">
//                   <FaEdit size={18} />
//                 </td>
//                 <td className="py-2 px-2 text-red-700 hover:cursor-pointer">
//                   <MdDelete size={18} />
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="8" className="text-center py-4 text-gray-500 italic">
//                 No data available
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Totals Row */}
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

//       {/* Terms & Conditions Toggle */}
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
//                 engagement between [Your Company Name] and [Client Name]. The
//                 Designer agrees to execute the project at [Project Site
//                 Address]...
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
