import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import Button from "../../../components/Button";
import { FiDownload, FiSend } from "react-icons/fi";

export default function RFQDetailDrawer({ rfq, onClose }) {
  const [activeTab, setActiveTab] = useState("detail");

  if (!rfq) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full max-w-4xl h-full shadow-lg overflow-y-auto animate-slide-in-right">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <button onClick={onClose}>
              <MdClose className="text-xl" />
            </button>
            <div className="flex border border-purple-200 rounded-full overflow-hidden">
              <button
                className={`px-6 py-1.5 text-sm font-medium ${
                  activeTab === "detail"
                    ? "bg-purple-600 text-white"
                    : "text-purple-700"
                }`}
                onClick={() => setActiveTab("detail")}
              >
                Detail
              </button>
              <button
                className={`px-6 py-1.5 text-sm font-medium ${
                  activeTab === "supplier"
                    ? "bg-purple-600 text-white"
                    : "text-purple-700"
                }`}
                onClick={() => setActiveTab("supplier")}
              >
                Supplier Entries
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-1 text-purple-700 border-purple-700"
            >
              <FiDownload className="text-lg" />
              Download
            </Button>
            <Button
              variant="outline"
              className="gap-1 text-purple-700 border-purple-700"
            >
              <FiSend className="text-lg" />
              Send
            </Button>
            <Button variant="solid" color="purple">
              Edit
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {activeTab === "detail" && (
            <>
              {/* Document Info */}
              <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-md text-sm">
                <div>
                  <strong>Document ID:</strong> {rfq?.rfqNo || "--"}
                </div>
                <div>
                  <strong>Delivery Location:</strong>{" "}
                  {rfq?.deliveryLocation || "--"}
                </div>
                <div>
                  <strong>Document Date:</strong>{" "}
                  {rfq?.createdAt?.slice(0, 10) || "--"}
                </div>
                <div>
                  <strong>Bidding Start Date:</strong>{" "}
                  {rfq?.biddingStartDate?.slice(0, 10) || "--"}
                </div>
                <div>
                  <strong>Bidding End Date:</strong>{" "}
                  {rfq?.biddingEndDate?.slice(0, 10) || "--"}
                </div>
              </div>

              {/* Item Table */}
              <div>
                <h3 className="font-semibold text-base mb-2">Item Details</h3>
                <table className="w-full text-sm border rounded">
                  <thead className="bg-purple-100 text-left">
                    <tr>
                      <th className="p-2">S.N.</th>
                      <th className="p-2">Item</th>
                      <th className="p-2">HSN Code</th>
                      <th className="p-2">QTY</th>
                      <th className="p-2">Delivery Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rfq?.materials?.length > 0 ? (
                      rfq.materials.map((item, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="p-2">{idx + 1}</td>
                          <td className="p-2">{item.name}</td>
                          <td className="p-2">{item.hsnCode || "--"}</td>
                          <td className="p-2">
                            {item.quantity} {item.unit || ""}
                          </td>
                          <td className="p-2">{item.deliveryDate || "--"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center p-4 text-gray-500"
                        >
                          No RFQ Item Available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Terms & Conditions */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border text-sm text-gray-700 leading-relaxed">
                <h4 className="font-semibold text-base mb-2">
                  Terms & Conditions
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    All items must be delivered on or before the specified
                    delivery date.
                  </li>
                  <li>
                    Prices quoted must include all applicable taxes and duties.
                  </li>
                  <li>
                    Any delay in delivery without prior notice may result in
                    cancellation of the order.
                  </li>
                  <li>
                    Payment terms are net 30 days unless otherwise agreed upon.
                  </li>
                  <li>
                    The supplier must ensure all goods meet the specified
                    standards and quality.
                  </li>
                </ul>
              </div>
            </>
          )}

          {activeTab === "supplier" && (
            <div className="space-y-4 text-sm">
              <h3 className="font-semibold text-base">
                Supplier Quotations Summary
              </h3>
              {console.log("RFQ Supplier Data:", rfq?.suppliers)}
              {console.log("RFQ Materials:", rfq?.materials)}
              {rfq?.suppliers?.length > 0 ? (
                rfq.suppliers.map((supplier, idx) => (
                  <div
                    key={idx}
                    className="border border-purple-300 rounded-lg p-4 bg-white shadow-sm space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-purple-700 text-lg">
                          {supplier.name}
                        </h4>
                        <span className="text-xs text-gray-500">
                          Status: {supplier.status}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        className="text-purple-600 border-purple-600"
                      >
                        Punch Quotation
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Subtotal:</strong> ₹ {supplier.subtotal || 0}
                      </div>
                      <div>
                        <strong>Tax:</strong> ₹ {supplier.tax || 0}
                      </div>
                      <div>
                        <strong>Discount:</strong> ₹ {supplier.discount || 0}
                      </div>
                      <div>
                        <strong>Total:</strong> ₹ {supplier.total || 0}
                      </div>
                    </div>

                    <div>
                      <h5 className="mt-4 font-semibold">Item Details</h5>
                      <ul className="divide-y divide-gray-200 mt-2">
                        {rfq?.materials?.map((item, matIdx) => {
                          const quote =
                            supplier.quotedItems?.find(
                              (q) => q.itemId === item.id
                            ) || {};
                          return (
                            <li key={matIdx} className="py-2">
                              <div className="flex justify-between items-start">
                                <div className="text-gray-700">
                                  <div>
                                    <strong>{item.name}</strong>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Requested: {item.quantity} {item.unit}
                                  </div>
                                </div>
                                <div className="text-right text-gray-600 text-sm">
                                  <div>Qty: {quote.quantity || "-"}</div>
                                  <div>Price: ₹ {quote.price || "0"}</div>
                                  <div>Tax: ₹ {quote.tax || "0"}</div>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No supplier entries found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// import React, { useState } from "react";
// import { MdClose } from "react-icons/md";
// import Button from "../../../components/Button";
// import { FiDownload, FiSend } from "react-icons/fi";

// export default function RFQDetailDrawer({ rfq, onClose }) {
//   const [activeTab, setActiveTab] = useState("detail");

//   if (!rfq) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex justify-end">
//       <div
//         className="absolute inset-0 bg-black bg-opacity-30"
//         onClick={onClose}
//       ></div>

//       <div className="relative bg-white w-full max-w-4xl h-full shadow-lg overflow-y-auto animate-slide-in-right">
//         {/* Header */}
//         <div className="flex justify-between items-center px-4 py-3 border-b sticky top-0 bg-white z-10">
//           <div className="flex items-center gap-2">
//             <button onClick={onClose}>
//               <MdClose className="text-xl" />
//             </button>
//             <div className="flex border border-purple-200 rounded-full overflow-hidden">
//               <button
//                 className={`px-6 py-1.5 text-sm font-medium ${
//                   activeTab === "detail"
//                     ? "bg-purple-600 text-white"
//                     : "text-purple-700"
//                 }`}
//                 onClick={() => setActiveTab("detail")}
//               >
//                 Detail
//               </button>
//               <button
//                 className={`px-6 py-1.5 text-sm font-medium ${
//                   activeTab === "supplier"
//                     ? "bg-purple-600 text-white"
//                     : "text-purple-700"
//                 }`}
//                 onClick={() => setActiveTab("supplier")}
//               >
//                 Supplier Entries
//               </button>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" className="gap-1 text-purple-700 border-purple-700">
//               <FiDownload className="text-lg" />
//               Download
//             </Button>
//             <Button variant="outline" className="gap-1 text-purple-700 border-purple-700">
//               <FiSend className="text-lg" />
//               Send
//             </Button>
//             <Button variant="solid" color="purple">
//               Edit
//             </Button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-4 space-y-4">
//           {activeTab === "detail" && (
//             <>
//               {/* Document Info */}
//               <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-md text-sm">
//                 <div>
//                   <strong>Document ID:</strong> {rfq?.rfqNo || "--"}
//                 </div>
//                 <div>
//                   <strong>Delivery Location:</strong>{" "}
//                   {rfq?.deliveryLocation || "--"}
//                 </div>
//                 <div>
//                   <strong>Document Date:</strong>{" "}
//                   {rfq?.createdAt?.slice(0, 10) || "--"}
//                 </div>
//                 <div>
//                   <strong>Bidding Start Date:</strong>{" "}
//                   {rfq?.biddingStartDate?.slice(0, 10) || "--"}
//                 </div>
//                 <div>
//                   <strong>Bidding End Date:</strong>{" "}
//                   {rfq?.biddingEndDate?.slice(0, 10) || "--"}
//                 </div>
//               </div>

//               {/* Item Table */}
//               <div>
//                 <h3 className="font-semibold text-base mb-2">Item Details</h3>
//                 <table className="w-full text-sm border rounded">
//                   <thead className="bg-purple-100 text-left">
//                     <tr>
//                       <th className="p-2">S.N.</th>
//                       <th className="p-2">Item</th>
//                       <th className="p-2">HSN Code</th>
//                       <th className="p-2">QTY</th>
//                       <th className="p-2">Delivery Date</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {rfq?.materials?.length > 0 ? (
//                       rfq.materials.map((item, idx) => (
//                         <tr key={idx} className="border-t">
//                           <td className="p-2">{idx + 1}</td>
//                           <td className="p-2">{item.name}</td>
//                           <td className="p-2">{item.hsnCode || "--"}</td>
//                           <td className="p-2">
//                             {item.quantity} {item.unit || ""}
//                           </td>
//                           <td className="p-2">{item.deliveryDate || "--"}</td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td
//                           colSpan="5"
//                           className="text-center p-4 text-gray-500"
//                         >
//                           No RFQ Item Available
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Terms & Conditions */}
//               <div className="mt-4 p-4 bg-gray-50 rounded-lg border text-sm text-gray-700 leading-relaxed">
//                 <h4 className="font-semibold text-base mb-2">
//                   Terms & Conditions
//                 </h4>
//                 <ul className="list-disc list-inside space-y-1">
//                   <li>All items must be delivered on or before the specified delivery date.</li>
//                   <li>Prices quoted must include all applicable taxes and duties.</li>
//                   <li>Any delay in delivery without prior notice may result in cancellation of the order.</li>
//                   <li>Payment terms are net 30 days unless otherwise agreed upon.</li>
//                   <li>The supplier must ensure all goods meet the specified standards and quality.</li>
//                 </ul>
//               </div>
//             </>
//           )}

//           {activeTab === "supplier" && (
//            <div className="space-y-4 text-sm">
//   <h3 className="font-semibold text-base">RFQ Summary</h3>

//   <div className="overflow-x-auto">
//     <table className="min-w-full border-collapse border rounded">
//       <thead>
//         <tr className="bg-purple-100 text-left">
//           <th className="p-3 w-1/3 border">Description</th>
//           {rfq?.suppliers?.map((supplier, idx) => (
//             <th key={idx} className="p-3 border w-[250px] min-w-[250px]">
//               {supplier.name} ({supplier.status})
//             </th>
//           ))}
//         </tr>
//       </thead>

//       <tbody>
//         {rfq?.materials?.map((item, idx) => (
//           <tr key={idx} className="border-t">
//             {/* Item description column */}
//             <td className="p-3 align-top border-r">
//               <div><strong>Item ID:</strong> --</div>
//               <div><strong>Item Name:</strong> {item.name}</div>
//               <div><strong>Requested Qty:</strong> {item.quantity} {item.unit}</div>
//             </td>

//             {/* Dynamic supplier columns */}
//             {rfq?.suppliers?.map((supplier, sIdx) => {
//               const quote = supplier.quotedItems?.find(q => q.itemId === item.id) || {};
//               return (
//                 <td key={sIdx} className="p-3 align-top border-r">
//                   <div><strong>Quantity:</strong> {quote.quantity || "-"} {item.unit}</div>
//                   <div><strong>Quoted Price:</strong> ₹ {quote.price || "0"}</div>
//                   <div><strong>Tax:</strong> ₹ {quote.tax || "0"}</div>
//                 </td>
//               );
//             })}
//           </tr>
//         ))}

//         {/* Totals per supplier */}
//         <tr className="border-t">
//           <td className="p-3 font-semibold border-r">Item Subtotal</td>
//           {rfq?.suppliers?.map((supplier, idx) => (
//             <td key={idx} className="p-3">₹ {supplier.subtotal || 0}</td>
//           ))}
//         </tr>
//         <tr className="border-t">
//           <td className="p-3 font-semibold border-r">Tax</td>
//           {rfq?.suppliers?.map((supplier, idx) => (
//             <td key={idx} className="p-3">₹ {supplier.tax || 0}</td>
//           ))}
//         </tr>
//         <tr className="border-t">
//           <td className="p-3 font-semibold border-r">Additional Discount</td>
//           {rfq?.suppliers?.map((supplier, idx) => (
//             <td key={idx} className="p-3">₹ {supplier.discount || 0}</td>
//           ))}
//         </tr>
//         <tr className="border-t">
//           <td className="p-3 font-semibold border-r">Total</td>
//           {rfq?.suppliers?.map((supplier, idx) => (
//             <td key={idx} className="p-3 font-semibold">₹ {supplier.total || 0}</td>
//           ))}
//         </tr>

//         <tr>
//           <td className="p-3 border-r"></td>
//           {rfq?.suppliers?.map((supplier, idx) => (
//             <td key={idx} className="p-3 text-right">
//               <Button variant="outline" className="border-purple-600 text-purple-600">
//                 Punch Quotation
//               </Button>
//             </td>
//           ))}
//         </tr>
//       </tbody>
//     </table>
//   </div>
// </div>

//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
