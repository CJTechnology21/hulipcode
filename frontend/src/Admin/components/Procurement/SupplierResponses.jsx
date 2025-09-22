import React, { useEffect, useState } from "react";
import { getResponsesOfRFQ } from "../../../services/rfqServices";
import Button from "../../../components/Button";
import { toast } from "react-toastify";

function SupplierResponses({ rfqId, materials }) {
  const [responses, setResponses] = useState([]);
  const [activeResponse, setActiveResponse] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!rfqId) return;
    const fetchResponses = async () => {
      setLoading(true);
      try {
        const data = await getResponsesOfRFQ(rfqId);
        setResponses(data.responses || []);
        toast.success("Responses fetched successfully", {
          toastId: "fetch-success",
        });
      } catch (err) {
        toast.error("Error in fetching responses", { toastId: "fetch-error" });
        console.error("Error fetching responses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, [rfqId]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-6">Loading responses...</div>
    );
  }

  if (!responses || responses.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6">
        You have no response for this quotation yet
      </div>
    );
  }

  const currentResponse = responses[activeResponse];

  // Calculate totals
  const itemTotals = materials.map((mat) => {
    const quote = currentResponse.quotes.find((q) => q.material === mat._id);
    const qty = quote?.quantity || 0;
    const price = quote?.price || 0;
    return qty * price;
  });

  const subtotal = itemTotals.reduce((sum, val) => sum + val, 0);
  const taxAmount = (currentResponse.tax || 0) / 100 * subtotal;
  const totalWithTax = subtotal + taxAmount;

  return (
    <div className="space-y-4">
      {/* Tabs for responses */}
      <div className="flex gap-2 border-b overflow-x-auto">
        {responses.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveResponse(idx)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeResponse === idx
                ? "border-b-2 border-red-600 text-red-600"
                : "text-gray-600"
            }`}
          >
            Response {idx + 1}
          </button>
        ))}
      </div>

      {/* Response Details */}
      {currentResponse && (
        <div className="p-4 border rounded-lg bg-white shadow-sm space-y-4">
          {/* Supplier Info */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
            <div>
              <h4 className="font-semibold text-purple-700 text-lg">
                {currentResponse.supplier?.name}
              </h4>
              <p className="text-sm text-gray-500">
                {currentResponse.supplier?.email}
              </p>
              <p className="text-xs text-gray-500">
                Status: {currentResponse.status}
              </p>
            </div>

            <div className="text-right md:text-center">
              <p className="text-sm font-semibold text-gray-800">
                Submitted on:{" "}
                {new Date(currentResponse.submittedAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                )}
              </p>
              <p className="text-sm text-gray-600">
                Submitted at:{" "}
                {new Date(currentResponse.submittedAt).toLocaleTimeString(
                  "en-IN",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }
                )}
              </p>
            </div>
          </div>

          {/* Quotes table */}
          <div>
            <h5 className="mt-2 font-semibold">Quoted Items</h5>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded mt-2 min-w-[600px]">
                <thead className="bg-purple-100 text-left">
                  <tr>
                    <th className="p-2">Item</th>
                    <th className="p-2">Requested Qty</th>
                    <th className="p-2">Quoted Qty</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Total</th>
                    <th className="p-2">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((mat, idx) => {
                    const quote = currentResponse.quotes.find(
                      (q) => q.material === mat._id
                    );
                    const qty = quote?.quantity || 0;
                    const price = quote?.price || 0;
                    const total = qty * price;
                    return (
                      <tr key={idx} className="border-t">
                        <td className="p-2">{mat.name}</td>
                        <td className="p-2">
                          {mat.quantity} {mat.unit}
                        </td>
                        <td className="p-2">{qty || "-"}</td>
                        <td className="p-2">₹ {price || "-"}</td>
                        <td className="p-2">₹ {total || "-"}</td>
                        <td className="p-2">{quote?.remarks || "-"}</td>
                      </tr>
                    );
                  })}

                  {/* Subtotal row */}
                  <tr className="border-t font-semibold bg-gray-100">
                    <td colSpan={4} className="p-2 text-right">
                      Subtotal
                    </td>
                    <td className="p-2">₹ {subtotal}</td>
                    <td></td>
                  </tr>

                  {/* Tax row */}
                  <tr className="border-t font-semibold bg-gray-100">
                    <td colSpan={4} className="p-2 text-right">
                      Tax ({currentResponse.tax || 0}%)
                    </td>
                    <td className="p-2">₹ {taxAmount.toFixed(2)}</td>
                    <td></td>
                  </tr>

                  {/* Total including tax row */}
                  <tr className="border-t font-bold bg-gray-200">
                    <td colSpan={4} className="p-2 text-right">
                      Total (Including Tax)
                    </td>
                    <td className="p-2 text-red-700">₹ {totalWithTax.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="custom"
              className=" bg-red-500 hover:bg-red-600 text-white"
            >
              Punch Quotation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SupplierResponses;

// import React, { useEffect, useState } from "react";
// import { getResponsesOfRFQ } from "../../../services/rfqServices";
// import Button from "../../../components/Button";
// import { toast } from "react-toastify";

// function SupplierResponses({ rfqId, materials }) {
//   const [responses, setResponses] = useState([]);
//   const [activeResponse, setActiveResponse] = useState(0);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!rfqId) return;
//     const fetchResponses = async () => {
//       setLoading(true);
//       try {
//         const data = await getResponsesOfRFQ(rfqId);
//         setResponses(data.responses || []);
//         toast.success("Responses fetched successfully", {
//           toastId: "fetch-success",
//         });
//       } catch (err) {
//         toast.error("Error in fetching responses", { toastId: "fetch-error" });
//         console.error("Error fetching responses:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchResponses();
//   }, [rfqId]);

//   if (loading) {
//     return (
//       <div className="text-center text-gray-500 py-6">Loading responses...</div>
//     );
//   }

//   if (!responses || responses.length === 0) {
//     return (
//       <div className="text-center text-gray-500 py-6">
//         You have no response for this quotation yet
//       </div>
//     );
//   }

//   const currentResponse = responses[activeResponse];

//   return (
//     <div className="space-y-4">
//       {/* Tabs for responses */}
//       <div className="flex gap-2 border-b overflow-x-auto">
//         {responses.map((_, idx) => (
//           <button
//             key={idx}
//             onClick={() => setActiveResponse(idx)}
//             className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
//               activeResponse === idx
//                 ? "border-b-2 border-red-600 text-red-600"
//                 : "text-gray-600"
//             }`}
//           >
//             Response {idx + 1}
//           </button>
//         ))}
//       </div>

//       {/* Response Details */}
//       {currentResponse && (
//         <div className="p-4 border rounded-lg bg-white shadow-sm space-y-4">
//           {/* Supplier Info */}
//           <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
//             <div>
//               <h4 className="font-semibold text-purple-700 text-lg">
//                 {currentResponse.supplier?.name}
//               </h4>
//               <p className="text-sm text-gray-500">
//                 {currentResponse.supplier?.email}
//               </p>
//               <p className="text-xs text-gray-500">
//                 Status: {currentResponse.status}
//               </p>
//             </div>

//             <div className="text-right md:text-center">
//               <p className="text-sm font-semibold text-gray-800">
//                 Submitted on:{" "}
//                 {new Date(currentResponse.submittedAt).toLocaleDateString(
//                   "en-IN",
//                   {
//                     day: "2-digit",
//                     month: "2-digit",
//                     year: "numeric",
//                   }
//                 )}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Submitted at:{" "}
//                 {new Date(currentResponse.submittedAt).toLocaleTimeString(
//                   "en-IN",
//                   {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     hour12: true,
//                   }
//                 )}
//               </p>
//             </div>
//           </div>

//           {/* Quotes table */}
//           <div>
//             <h5 className="mt-2 font-semibold">Quoted Items</h5>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm border rounded mt-2 min-w-[600px]">
//                 <thead className="bg-purple-100 text-left">
//                   <tr>
//                     <th className="p-2">Item</th>
//                     <th className="p-2">Requested Qty</th>
//                     <th className="p-2">Quoted Qty</th>
//                     <th className="p-2">Price</th>
//                     <th className="p-2">Remarks</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {materials.map((mat, idx) => {
//                     const quote = currentResponse.quotes.find(
//                       (q) => q.material === mat._id
//                     );
//                     return (
//                       <tr key={idx} className="border-t">
//                         <td className="p-2">{mat.name}</td>
//                         <td className="p-2">
//                           {mat.quantity} {mat.unit}
//                         </td>
//                         <td className="p-2">{quote?.quantity || "-"}</td>
//                         <td className="p-2">₹ {quote?.price || "-"}</td>
//                         <td className="p-2">{quote?.remarks || "-"}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Total amount below the table */}
//           <div className="text-right mt-4">
//             <p className="text-lg font-bold text-red-700">
//               Total: ₹ {currentResponse.totalAmount}
//             </p>
//           </div>

//           <div className="flex justify-end">
//             <Button
//               variant="custom"
//               className=" bg-red-500 hover:bg-red-600 text-white"
//             >
//               Punch Quotation
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SupplierResponses;
