import React from "react";
import { formatDate } from "../../../utils/dateFormatter";
import { FiEdit, FiTrash2 } from "react-icons/fi";

function POTable({
  purchaseOrders,
  vendors,
  projects,
  archClients,
  onRowClick,
  onEdit,
  onDelete,
}) {
  const getLabel = (arr, id) =>
    arr.find((item) => item.value === id)?.label || "-";

  return (
    <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full text-sm text-left">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-2">S.NO</th>
              <th className="p-2">Vendor</th>
              <th className="p-2">Project</th>
              <th className="p-2">Ordered By</th>
              <th className="p-2">Payment Terms</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Delivery Date</th>
              <th className="p-2">Description</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center py-4 text-gray-500">
                  No purchase orders found.
                </td>
              </tr>
            )}
            {purchaseOrders.map((po, idx) => (
              <tr
                key={po._id || po.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => onRowClick(po)}
              >
                <td className="p-2">{idx + 1}</td>
                <td className="p-2">{getLabel(vendors, po.vendor)}</td>
                <td className="p-2">{getLabel(projects, po.project)}</td>
                <td className="p-2">{getLabel(archClients, po.orderedBy)}</td>
                <td className="p-2">{po.paymentTerms || "-"}</td>
                <td className="p-2">₹{po.amount?.toLocaleString()}</td>
                <td className="p-2">
                  {po.deliveryDate ? formatDate(po.deliveryDate) : "-"}
                </td>
                <td className="p-2">{po.notes || "-"}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      po.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {po.status}
                  </span>
                </td>
                <td className="p-2 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(po); // ✅ send full object
                      }}
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(po._id || po.id);
                      }}
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-4">
        {purchaseOrders.length === 0 && (
          <p className="text-center text-gray-500">No purchase orders found.</p>
        )}
        {purchaseOrders.map((po, idx) => (
          <div
            key={po._id || po.id}
            className="border rounded-lg p-4 shadow hover:bg-gray-50 cursor-pointer"
            onClick={() => onRowClick(po)}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold">
                {idx + 1}. {getLabel(vendors, po.vendor)}
              </h3>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  po.status === "Paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {po.status}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              <strong>Project:</strong> {getLabel(projects, po.project)}
            </p>
            <p className="text-xs text-gray-600">
              <strong>Ordered By:</strong> {getLabel(archClients, po.orderedBy)}
            </p>
            <p className="text-xs text-gray-600">
              <strong>Payment Terms:</strong> {po.paymentTerms || "-"}
            </p>
            <p className="text-xs text-gray-600">
              <strong>Amount:</strong> ₹{po.amount?.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">
              <strong>Delivery Date:</strong>{" "}
              {po.deliveryDate ? formatDate(po.deliveryDate) : "-"}
            </p>
            <p className="text-xs text-gray-600">
              <strong>Description:</strong> {po.notes || "-"}
            </p>
            <div className="flex justify-end gap-3 mt-3">
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(po);
                }}
              >
                <FiEdit className="w-5 h-5" />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(po._id || po.id);
                }}
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default POTable;

// import React from "react";
  // import { formatDate } from "../../../utils/dateFormatter";
  // import { FiEdit, FiTrash2 } from "react-icons/fi";

  // function POTable({
  //   purchaseOrders,
  //   vendors,
  //   projects,
  //   archClients,
  //   onRowClick,
  //   onEdit,
  //   onDelete,
  // }) {
  //   const getLabel = (arr, id) =>
  //     arr.find((item) => item.value === id)?.label || "-";

  //   return (
  //     <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
  //       {/* Desktop Table */}
  //       <div className="hidden md:block">
  //         <table className="w-full text-sm text-left">
  //           <thead className="border-b bg-gray-50">
  //             <tr>
  //               <th className="p-2">S.NO</th>
  //               <th className="p-2">Vendor</th>
  //               <th className="p-2">Project</th>
  //               <th className="p-2">Ordered By</th>
  //               <th className="p-2">Payment Terms</th>
  //               <th className="p-2">Amount</th>
  //               <th className="p-2">Delivery Date</th>
  //               <th className="p-2">Description</th>
  //               <th className="p-2">Status</th>
  //               <th className="p-2 text-center">Actions</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {purchaseOrders.length === 0 && (
  //               <tr>
  //                 <td colSpan={10} className="text-center py-4 text-gray-500">
  //                   No purchase orders found.
  //                 </td>
  //               </tr>
  //             )}
  //             {purchaseOrders.map((po, idx) => (
  //               <tr
  //                 key={po.id}
  //                 className="border-b hover:bg-gray-50 cursor-pointer"
  //                 onClick={() => onRowClick(po)}
  //               >
  //                 <td className="p-2">{idx + 1}</td>
  //                 <td className="p-2">{getLabel(vendors, po.vendor)}</td>
  //                 <td className="p-2">{getLabel(projects, po.project)}</td>
  //                 <td className="p-2">{getLabel(archClients, po.orderedBy)}</td>
  //                 <td className="p-2">{po.paymentTerms || "-"}</td>
  //                 <td className="p-2">₹{po.amount.toLocaleString()}</td>

  //                 {/* ✅ Fixed: use deliveryDate instead of date */}
  //                 <td className="p-2">
  //                   {po.deliveryDate ? formatDate(po.deliveryDate) : "-"}
  //                 </td>

  //                 <td className="p-2">{po.notes || "-"}</td>
  //                 <td className="p-2">
  //                   <span
  //                     className={`px-2 py-1 rounded text-xs ${
  //                       po.status === "Paid"
  //                         ? "bg-green-100 text-green-700"
  //                         : "bg-yellow-100 text-yellow-700"
  //                     }`}
  //                   >
  //                     {po.status}
  //                   </span>
  //                 </td>
  //                 <td className="p-2 text-center">
  //                   <div className="flex justify-center gap-3">
  //                     <button
  //                       className="text-blue-500 hover:text-blue-700"
  //                       onClick={(e) => {
  //                         e.stopPropagation();
  //                         onEdit(po); // ✅ sends the correct PO object to modal
  //                       }}
  //                     >
  //                       <FiEdit className="w-5 h-5" />
  //                     </button>
  //                     <button
  //                       className="text-red-500 hover:text-red-700"
  //                       onClick={(e) => {
  //                         e.stopPropagation();
  //                         onDelete(po.id);
  //                       }}
  //                     >
  //                       <FiTrash2 className="w-5 h-5" />
  //                     </button>
  //                   </div>
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>

  //       {/* Mobile Card Layout */}
  //       <div className="block md:hidden space-y-4">
  //         {purchaseOrders.length === 0 && (
  //           <p className="text-center text-gray-500">No purchase orders found.</p>
  //         )}
  //         {purchaseOrders.map((po, idx) => (
  //           <div
  //             key={po.id}
  //             className="border rounded-lg p-4 shadow hover:bg-gray-50 cursor-pointer"
  //             onClick={() => onRowClick(po)}
  //           >
  //             <div className="flex justify-between items-center mb-2">
  //               <h3 className="text-sm font-semibold">
  //                 {idx + 1}. {getLabel(vendors, po.vendor)}
  //               </h3>
  //               <span
  //                 className={`px-2 py-1 rounded text-xs ${
  //                   po.status === "Paid"
  //                     ? "bg-green-100 text-green-700"
  //                     : "bg-yellow-100 text-yellow-700"
  //                 }`}
  //               >
  //                 {po.status}
  //               </span>
  //             </div>
  //             <p className="text-xs text-gray-600">
  //               <strong>Project:</strong> {getLabel(projects, po.project)}
  //             </p>
  //             <p className="text-xs text-gray-600">
  //               <strong>Ordered By:</strong> {getLabel(archClients, po.orderedBy)}
  //             </p>
  //             <p className="text-xs text-gray-600">
  //               <strong>Payment Terms:</strong> {po.paymentTerms || "-"}
  //             </p>
  //             <p className="text-xs text-gray-600">
  //               <strong>Amount:</strong> ₹{po.amount.toLocaleString()}
  //             </p>

  //             {/* ✅ Fixed: show deliveryDate instead of date */}
  //             <p className="text-xs text-gray-600">
  //               <strong>Delivery Date:</strong>{" "}
  //               {po.deliveryDate ? formatDate(po.deliveryDate) : "-"}
  //             </p>

  //             <p className="text-xs text-gray-600">
  //               <strong>Description:</strong> {po.notes || "-"}
  //             </p>

  //             {/* Actions */}
  //             <div className="flex justify-end gap-3 mt-3">
  //               <button
  //                 className="text-blue-500 hover:text-blue-700"
  //                 onClick={(e) => {
  //                   e.stopPropagation();
  //                   onEdit(po);
  //                 }}
  //               >
  //                 <FiEdit className="w-5 h-5" />
  //               </button>
  //               <button
  //                 className="text-red-500 hover:text-red-700"
  //                 onClick={(e) => {
  //                   e.stopPropagation();
  //                   onDelete(po.id);
  //                 }}
  //               >
  //                 <FiTrash2 className="w-5 h-5" />
  //               </button>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }
  // export default POTable;
