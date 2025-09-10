import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../../components/Button";
import {
  fetchDeliverables,
  updateDeliverable,
  deleteDeliverable,
} from "../../../services/quoteServices";

const DeliverablesTable = ({ quoteId, spaceId, onRowClick, onDelete, onAddDeliverable }) => {
  const [items, setItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editFields, setEditFields] = useState({});

  // -------------------- FETCH DELIVERABLES -------------------- //
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
    if (quoteId && spaceId) {
      loadDeliverables();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteId, spaceId]);

  const total = items.reduce(
    (sum, item) => sum + item.qty * item.rate * (1 + item.gst / 100),
    0
  );

  // -------------------- EDIT HANDLERS -------------------- //
  const handleEditClick = (idx, item) => {
    setEditIndex(idx);
    setEditFields({ ...item });
  };

  const handleFieldChange = (field, value) => {
    setEditFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (itemId) => {
    try {
      const { qty, rate, gst, ...rest } = editFields;
      const fields = {
        ...rest,
        qty: parseFloat(qty),
        rate: parseFloat(rate),
        gst: parseFloat(gst),
      };
      await updateDeliverable(quoteId, spaceId, itemId, fields);
      setEditIndex(null);
      loadDeliverables();
      toast.success("Deliverable updated successfully");
    } catch (err) {
      console.error("Failed to update deliverable:", err);
      toast.error("Failed to update deliverable");
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this deliverable?")) return;
    try {
      await deleteDeliverable(quoteId, spaceId, itemId);
      setItems((prev) => prev.filter((itm) => itm.id !== itemId));
      onDelete?.(itemId); // call parent delete
      toast.success("Deliverable deleted successfully");
    } catch (err) {
      console.error("Failed to delete deliverable:", err);
      toast.error("Failed to delete deliverable");
    }
  };

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
                const isEditing = editIndex === idx;

                return (
                  <tr
                    key={item._id}
                    className="hover:bg-red-50 cursor-pointer"
                    onClick={() => !isEditing && onRowClick?.(item)}
                  >
                    <td className="border px-2 py-1">{idx + 1}</td>
                    <td className="border px-2 py-1">
                      <img src={item.photo} alt="item" className="w-10 h-10 object-cover" />
                    </td>
                    <td className="border px-2 py-1">
                      {item.code} / {item.category}
                    </td>
                    <td className="border px-2 py-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editFields.description}
                          onChange={(e) => handleFieldChange("description", e.target.value)}
                          className="border px-1 py-0.5 w-full"
                        />
                      ) : (
                        item.description
                      )}
                    </td>
                    <td className="border px-2 py-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editFields.spec}
                          onChange={(e) => handleFieldChange("spec", e.target.value)}
                          className="border px-1 py-0.5 w-full"
                        />
                      ) : (
                        item.spec
                      )}
                    </td>
                    <td className="border px-2 py-1">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editFields.qty}
                          onChange={(e) => handleFieldChange("qty", e.target.value)}
                          className="border px-1 py-0.5 w-16 text-center"
                        />
                      ) : (
                        item.qty
                      )}
                    </td>
                    <td className="border px-2 py-1">{item.unit}</td>
                    <td className="border px-2 py-1">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editFields.rate}
                          onChange={(e) => handleFieldChange("rate", e.target.value)}
                          className="border px-1 py-0.5 w-20 text-center"
                        />
                      ) : (
                        `₹ ${item.rate}`
                      )}
                    </td>
                    <td className="border px-2 py-1">₹ {amount}</td>
                    <td className="border px-2 py-1">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editFields.gst}
                          onChange={(e) => handleFieldChange("gst", e.target.value)}
                          className="border px-1 py-0.5 w-16 text-center"
                        />
                      ) : (
                        `${item.gst}%`
                      )}
                    </td>
                    <td className="border px-2 py-1">₹ {totalWithGST.toFixed(2)}</td>
                    <td
                      className="border px-2 py-1 flex gap-2"
                      onClick={(e) => e.stopPropagation()} // prevent triggering onRowClick
                    >
                      {isEditing ? (
                        <>
                          <FaCheck
                            className="text-green-600 cursor-pointer"
                            onClick={() => handleUpdate(item.id)}
                          />
                          <FaTimes
                            className="text-gray-600 cursor-pointer"
                            onClick={() => setEditIndex(null)}
                          />
                        </>
                      ) : (
                        <>
                          <FaEdit
                            className="text-blue-600 cursor-pointer"
                            onClick={() => handleEditClick(idx, item)}
                          />
                          <FaTrash
                            className="text-red-600 cursor-pointer"
                            onClick={() => handleDelete(item.id)}
                          />
                        </>
                      )}
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
    </>
  );
};

export default DeliverablesTable;

// import React from "react";
// import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
// import Button from "../../../components/Button";

// const DeliverablesTable = ({ items, onRowClick, onDelete, onAddDeliverable }) => {
//   const total = items.reduce(
//     (sum, item) => sum + item.qty * item.rate * (1 + item.gst / 100),
//     0
//   );

//   return (
//     <>
//       <div className="flex justify-end mb-2">
//         <Button
//           variant="custom"
//           onClick={onAddDeliverable}
//           className="flex items-center gap-2 bg-red-700 hover:bg-red-900 text-white px-4 py-2 rounded-full text-sm font-bold"
//         >
//           <FaPlus /> Add Deliverable
//         </Button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full text-sm text-left border mt-4">
//           <thead className="bg-gray-100 font-semibold">
//             <tr>
//               <th className="border px-2 py-1">S.No</th>
//               <th className="border px-2 py-1">Photo</th>
//               <th className="border px-2 py-1">Code & Category</th>
//               <th className="border px-2 py-1">Description</th>
//               <th className="border px-2 py-1">Specification</th>
//               <th className="border px-2 py-1">Qty</th>
//               <th className="border px-2 py-1">Unit</th>
//               <th className="border px-2 py-1">Rate</th>
//               <th className="border px-2 py-1">Amount</th>
//               <th className="border px-2 py-1">GST (%)</th>
//               <th className="border px-2 py-1">Total</th>
//               <th className="border px-2 py-1">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((item, idx) => {
//               const amount = item.qty * item.rate;
//               const totalWithGST = amount * (1 + item.gst / 100);
//               return (
//                 <tr
//                   key={item.id}
//                   onClick={() => onRowClick(item)}
//                   className="cursor-pointer hover:bg-red-50"
//                 >
//                   <td className="border px-2 py-1">{idx + 1}</td>
//                   <td className="border px-2 py-1">
//                     <img
//                       src={item.photo}
//                       alt="item"
//                       className="w-10 h-10 object-cover"
//                     />
//                   </td>
//                   <td className="border px-2 py-1">
//                     {item.code} / {item.category}
//                   </td>
//                   <td className="border px-2 py-1">{item.description}</td>
//                   <td className="border px-2 py-1">{item.spec}</td>
//                   <td className="border px-2 py-1">{item.qty}</td>
//                   <td className="border px-2 py-1">{item.unit}</td>
//                   <td className="border px-2 py-1">₹ {item.rate}</td>
//                   <td className="border px-2 py-1">₹ {amount}</td>
//                   <td className="border px-2 py-1">{item.gst}%</td>
//                   <td className="border px-2 py-1">₹ {totalWithGST.toFixed(2)}</td>
//                   <td className="border px-2 py-1 flex gap-2">
//                     <FaEdit className="text-blue-600 cursor-pointer" />
//                     <FaTrash
//                       className="text-red-600 cursor-pointer"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onDelete(item.id);
//                       }}
//                     />
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       <div className="text-right text-lg font-semibold text-red-700 mt-4">
//         Total Amount: ₹ {total.toLocaleString("en-IN")}/-
//       </div>
//     </>
//   );
// };

// export default DeliverablesTable;
