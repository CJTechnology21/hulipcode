import React, { useState } from "react";
import { MdClose, MdOutlinePublish } from "react-icons/md";
import Button from "../../../components/Button";
import { FiDownload, FiSend } from "react-icons/fi";
import { formatDate } from "../../../utils/dateFormatter";
import { publishExistingRFQ } from "../../../services/rfqServices";
import { generateRFQText } from "../../../utils/generateRFQText";
import { sendRFQEmail } from "../../../utils/emailHelpers";
import { toast } from "react-toastify";
export default function RFQDetailDrawer({ rfq, onClose }) {
  const [activeTab, setActiveTab] = useState("detail");

  const handlePublishDraft = async () => {
    // figure out supplier email
    let supplierEmail = null;

    if (Array.isArray(rfq?.suppliers) && rfq.suppliers.length > 0) {
      supplierEmail = rfq.suppliers[0].email;
    }

    if (!supplierEmail && rfq?.supplier?.email) {
      supplierEmail = rfq.supplier.email;
    }

    if (!supplierEmail) {
      toast.error("No supplier email found for this RFQ.");
      return;
    }

    // build email body
    const rfqText = generateRFQText({
      project: rfq?.project?.name || "",
      deliveryLocation: rfq?.deliveryLocation,
      biddingStartDate: rfq?.biddingStartDate,
      biddingEndDate: rfq?.biddingEndDate,
      deliveryDate: rfq?.deliveryDate,
      selectedMaterials: rfq?.materials,
      terms: rfq?.terms,
    });

    try {
      toast.loading("Publishing RFQ...");

      // ✅ call with rfq._id and optional data
      await publishExistingRFQ(rfq._id, {
        status: "published",
        // include any fields you want updated at publish time:
        deliveryLocation: rfq.deliveryLocation,
        biddingStartDate: rfq.biddingStartDate,
        biddingEndDate: rfq.biddingEndDate,
        deliveryDate: rfq.deliveryDate,
        terms: rfq.terms,
        materials: rfq.materials,
      });

      // send email
      await sendRFQEmail({
        to_email: supplierEmail,
        project: rfq?.project?.name || "",
        deliveryLocation: rfq?.deliveryLocation,
        biddingStartDate: rfq?.biddingStartDate,
        biddingEndDate: rfq?.biddingEndDate,
        deliveryDate: rfq?.deliveryDate,
        selectedMaterials: rfq?.materials,
        terms: rfq?.terms,
        message: rfqText,
      });

      toast.dismiss();
      toast.success("RFQ published and email sent!");
      onClose();
    } catch (err) {
      toast.dismiss();
      console.error("Error publishing RFQ:", err);
      toast.error("Failed to publish RFQ.");
    }
  };
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
                    ? "bg-red-600 text-white"
                    : "text-red-700"
                }`}
                onClick={() => setActiveTab("detail")}
              >
                Detail
              </button>
              <button
                className={`px-6 py-1.5 text-sm font-medium ${
                  activeTab === "supplier"
                    ? "bg-red-600 text-white"
                    : "text-red-700"
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
              className="gap-1 text-red-700 border-red-700"
            >
              <FiDownload className="text-lg" />
              Download
            </Button>
            <Button
              variant="outline"
              className="gap-1 text-red-700 border-red-700"
            >
              <FiSend className="text-lg" />
              Send
            </Button>
            <Button variant="solid" color="red">
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
                  <strong>Project Name:</strong> {rfq?.project.name || "--"}
                </div>
                <div>
                  <strong>Delivery Location:</strong>{" "}
                  {rfq?.deliveryLocation || "--"}
                </div>
                <div>
                  <strong>Document Date:</strong>{" "}
                  {rfq?.createdAt ? formatDate(rfq.createdAt) : "--"}
                </div>
                <div>
                  <strong>Bidding Start Date:</strong>{" "}
                  {rfq?.biddingStartDate
                    ? formatDate(rfq.biddingStartDate)
                    : "--"}
                </div>
                <div>
                  <strong>Bidding End Date:</strong>{" "}
                  {rfq?.biddingEndDate ? formatDate(rfq.biddingEndDate) : "--"}
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
                          <td className="p-2">
                            {formatDate(item?.deliveryDate) || "--"}
                          </td>
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
              {rfq?.terms && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border text-sm text-gray-700 leading-relaxed">
                  <h4 className="font-semibold text-base mb-2">
                    Terms & Conditions
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {rfq.terms
                      .split("\n")
                      .filter((t) => t.trim() !== "")
                      .map((term, idx) => (
                        <li key={idx}>{term}</li>
                      ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  variant="custom"
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                  onClick={handlePublishDraft}
                >
                  <MdOutlinePublish className="text-lg" />
                  Publish Draft
                </Button>
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
// import { MdClose, MdOutlinePublish } from "react-icons/md";
// import Button from "../../../components/Button";
// import { FiDownload, FiSend } from "react-icons/fi";
// import { formatDate } from "../../../utils/dateFormatter";
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
//                     ? "bg-red-600 text-white"
//                     : "text-red-700"
//                 }`}
//                 onClick={() => setActiveTab("detail")}
//               >
//                 Detail
//               </button>
//               <button
//                 className={`px-6 py-1.5 text-sm font-medium ${
//                   activeTab === "supplier"
//                     ? "bg-red-600 text-white"
//                     : "text-red-700"
//                 }`}
//                 onClick={() => setActiveTab("supplier")}
//               >
//                 Supplier Entries
//               </button>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               className="gap-1 text-red-700 border-red-700"
//             >
//               <FiDownload className="text-lg" />
//               Download
//             </Button>
//             <Button
//               variant="outline"
//               className="gap-1 text-red-700 border-red-700"
//             >
//               <FiSend className="text-lg" />
//               Send
//             </Button>
//             <Button variant="solid" color="red">
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
//                   <strong>Project Name:</strong> {rfq?.project.name || "--"}
//                 </div>
//                 <div>
//                   <strong>Delivery Location:</strong>{" "}
//                   {rfq?.deliveryLocation || "--"}
//                 </div>
//                 <div>
//                   <strong>Document Date:</strong>{" "}
//                   {rfq?.createdAt ? formatDate(rfq.createdAt) : "--"}
//                 </div>
//                 <div>
//                   <strong>Bidding Start Date:</strong>{" "}
//                   {rfq?.biddingStartDate
//                     ? formatDate(rfq.biddingStartDate)
//                     : "--"}
//                 </div>
//                 <div>
//                   <strong>Bidding End Date:</strong>{" "}
//                   {rfq?.biddingEndDate ? formatDate(rfq.biddingEndDate) : "--"}
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
//                           <td className="p-2">
//                             {formatDate(item?.deliveryDate) || "--"}
//                           </td>
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
//               {rfq?.terms && (
//                 <div className="mt-4 p-4 bg-gray-50 rounded-lg border text-sm text-gray-700 leading-relaxed">
//                   <h4 className="font-semibold text-base mb-2">
//                     Terms & Conditions
//                   </h4>
//                   <ul className="list-disc list-inside space-y-1">
//                     {rfq.terms
//                       .split("\n")
//                       .filter((t) => t.trim() !== "")
//                       .map((term, idx) => (
//                         <li key={idx}>{term}</li>
//                       ))}
//                   </ul>
//                 </div>
//               )}

//               <div className="flex justify-end">
//                 <Button
//                   variant="custom"
//                   className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
//                 >
//                   <MdOutlinePublish className="text-lg" />
//                   Publish Draft
//                 </Button>
//               </div>
//             </>
//           )}

//           {activeTab === "supplier" && (
//             <div className="space-y-4 text-sm">
//               <h3 className="font-semibold text-base">
//                 Supplier Quotations Summary
//               </h3>
//               {console.log("RFQ Supplier Data:", rfq?.suppliers)}
//               {console.log("RFQ Materials:", rfq?.materials)}
//               {rfq?.suppliers?.length > 0 ? (
//                 rfq.suppliers.map((supplier, idx) => (
//                   <div
//                     key={idx}
//                     className="border border-purple-300 rounded-lg p-4 bg-white shadow-sm space-y-3"
//                   >
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <h4 className="font-semibold text-purple-700 text-lg">
//                           {supplier.name}
//                         </h4>
//                         <span className="text-xs text-gray-500">
//                           Status: {supplier.status}
//                         </span>
//                       </div>
//                       <Button
//                         variant="outline"
//                         className="text-purple-600 border-purple-600"
//                       >
//                         Punch Quotation
//                       </Button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <strong>Subtotal:</strong> ₹ {supplier.subtotal || 0}
//                       </div>
//                       <div>
//                         <strong>Tax:</strong> ₹ {supplier.tax || 0}
//                       </div>
//                       <div>
//                         <strong>Discount:</strong> ₹ {supplier.discount || 0}
//                       </div>
//                       <div>
//                         <strong>Total:</strong> ₹ {supplier.total || 0}
//                       </div>
//                     </div>

//                     <div>
//                       <h5 className="mt-4 font-semibold">Item Details</h5>
//                       <ul className="divide-y divide-gray-200 mt-2">
//                         {rfq?.materials?.map((item, matIdx) => {
//                           const quote =
//                             supplier.quotedItems?.find(
//                               (q) => q.itemId === item.id
//                             ) || {};
//                           return (
//                             <li key={matIdx} className="py-2">
//                               <div className="flex justify-between items-start">
//                                 <div className="text-gray-700">
//                                   <div>
//                                     <strong>{item.name}</strong>
//                                   </div>
//                                   <div className="text-xs text-gray-500">
//                                     Requested: {item.quantity} {item.unit}
//                                   </div>
//                                 </div>
//                                 <div className="text-right text-gray-600 text-sm">
//                                   <div>Qty: {quote.quantity || "-"}</div>
//                                   <div>Price: ₹ {quote.price || "0"}</div>
//                                   <div>Tax: ₹ {quote.tax || "0"}</div>
//                                 </div>
//                               </div>
//                             </li>
//                           );
//                         })}
//                       </ul>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center text-gray-500">
//                   No supplier entries found.
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
