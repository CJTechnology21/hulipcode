// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Button from "../../../components/Button";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Header from "../Header";
// import { useAuth } from "../../../context/AuthContext";
// import {
//   addResponseToRFQ,
//   getResponsesOfRFQ,
// } from "../../../services/rfqServices";

// function QuoteResponsePage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [rfq, setRFQ] = useState(null);
//   const [responses, setResponses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Auth + role check
//   useEffect(() => {
//     if (!user) {
//       navigate("/login", { state: { from: `/responses/${id}` } });
//       return;
//     }
//     if (user.role !== "Material Supplier") {
//       toast.error("Access denied. Only suppliers can respond.");
//       navigate("/");
//       return;
//     }
//   }, [user, id, navigate]);

//   // ✅ Fetch RFQ + existing responses
//   useEffect(() => {
//     const fetchResponses = async () => {
//       try {
//         const res = await getResponsesOfRFQ(id);
//         console.log("RFQ fetch response:", res);

//         if (!res?.rfq || !res.rfq?.materials?.length) {
//           toast.error("RFQ not found or has no materials.");
//           setLoading(false);
//           return;
//         }

//         setRFQ(res.rfq);

//         // Find supplier’s existing response if any
//         const existing = res.responses?.find(
//           (r) => r.supplier?._id === user?._id
//         );
//         console.log("Existing response for this supplier:", existing);

//         // Prefill price if response exists
//         const initializedResponses = (res.rfq.materials || []).map((m, idx) => {
//           const existingQuote = existing?.quotes?.find(
//             (q) => q.material === m._id
//           );
//           return {
//             materialId: m._id || idx,
//             name: m.name,
//             quantity: m.quantity,
//             unit: m.unit,
//             price: existingQuote?.price || "",
//             totalAmount:
//               (existingQuote?.price || 0) * (m.quantity || 0),
//           };
//         });

//         console.log("Initialized responses:", initializedResponses);
//         setResponses(initializedResponses);
//       } catch (err) {
//         console.error("Error fetching RFQ:", err);
//         toast.error("Failed to load RFQ details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id && user) fetchResponses();
//   }, [id, user]);

//   // ✅ Update single response value
//   const updateResponse = (index, field, value) => {
//     const updated = [...responses];
//     updated[index][field] = value;

//     if (field === "price") {
//       const qty = updated[index].quantity || 0;
//       const price = parseFloat(value) || 0;
//       updated[index].totalAmount = qty * price;
//     }

//     setResponses(updated);
//   };

//   // ✅ Calculate grand total
//   const grandTotal = responses.reduce(
//     (sum, r) => sum + (parseFloat(r.totalAmount) || 0),
//     0
//   );

//   // ✅ Submit handler
//   const handleSubmit = async () => {
//     console.log("📝 Submitting responses:", responses);

//     if (!responses.every((r) => r.price !== "")) {
//       toast.error("Please fill prices for all items.");
//       return;
//     }

//     try {
//       const supplierId = user?._id || user?.id || user?.userId;
//       if (!supplierId) {
//         console.error("SupplierId missing in user object:", user);
//         toast.error("Supplier ID is missing. Please log in again.");
//         return;
//       }

//       // Transform into schema-compatible payload
//       const quotes = responses.map((r) => ({
//         material: r.materialId,
//         productName: r.name,
//         price: parseFloat(r.price),
//         quantity: r.quantity,
//       }));

//       const payload = {
//         supplierId,
//         responses: quotes,
//         totalAmount: grandTotal,
//       };

//       console.log("📦 Payload being sent:", payload);

//       await addResponseToRFQ(id, supplierId, quotes);

//       toast.success("Response submitted successfully!");
//       navigate("/thank-you");
//     } catch (err) {
//       console.error(
//         "Error submitting response:",
//         err.response?.data || err.message
//       );
//       toast.error("Failed to submit response");
//     }
//   };

//   // ✅ UI states
//   if (loading) {
//     return (
//       <>
//         <Header title="Supplier Response" />
//         <div className="p-6">Loading RFQ...</div>
//       </>
//     );
//   }

//   if (!rfq) {
//     return (
//       <>
//         <Header title="Supplier Response" />
//         <div className="p-6">No RFQ found.</div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Header title="Supplier Response" />
//       <div className="p-6 bg-gray-100 min-h-screen space-y-6">
//         <ToastContainer />

//         {/* RFQ Info */}
//         <div className="bg-white border rounded-lg shadow-sm p-4">
//           <h2 className="text-lg font-semibold mb-2">
//             RFQ for Project: {rfq.project || "Unknown Project"}
//           </h2>
//           <p className="text-sm text-gray-600">
//             Delivery Location: {rfq.deliveryLocation || "N/A"}
//           </p>
//           <p className="text-sm text-gray-600">
//             Bidding:{" "}
//             {rfq.biddingStartDate
//               ? new Date(rfq.biddingStartDate).toLocaleDateString()
//               : "N/A"}{" "}
//             -{" "}
//             {rfq.biddingEndDate
//               ? new Date(rfq.biddingEndDate).toLocaleDateString()
//               : "N/A"}
//           </p>
//         </div>

//         {/* Response Table */}
//         <div className="bg-white border rounded-lg shadow-sm min-h-[100px]">
//           <div className="grid grid-cols-6 text-xs font-semibold text-gray-600 uppercase bg-gray-100 px-6 py-2 rounded-t-lg">
//             <span>S.No</span>
//             <span>Item</span>
//             <span>Qty</span>
//             <span>Unit</span>
//             <span>Price</span>
//             <span>Total</span>
//           </div>
//           <div className="divide-y divide-gray-200">
//             {responses.length > 0 ? (
//               responses.map((r, idx) => (
//                 <div
//                   key={r.materialId || idx}
//                   className="grid grid-cols-6 gap-3 px-6 py-3 items-center text-sm"
//                 >
//                   <span>{idx + 1}</span>
//                   <span>{r.name}</span>
//                   <span>{r.quantity}</span>
//                   <span>{r.unit}</span>
//                   <input
//                     type="number"
//                     className="border rounded px-2 py-1"
//                     placeholder="Price"
//                     value={r.price}
//                     onChange={(e) =>
//                       updateResponse(idx, "price", e.target.value)
//                     }
//                   />
//                   <span className="font-medium">
//                     {r.totalAmount ? `₹${r.totalAmount}` : "-"}
//                   </span>
//                 </div>
//               ))
//             ) : (
//               <div className="px-6 py-3 text-gray-500 text-sm">
//                 No materials available.
//               </div>
//             )}
//           </div>

//           {/* Grand Total */}
//           {responses.length > 0 && (
//             <div className="flex justify-end px-6 py-3 font-semibold text-gray-800 border-t">
//               Grand Total: ₹{grandTotal}
//             </div>
//           )}
//         </div>

//         {/* Submit Button */}
//         {responses.length > 0 && (
//           <div className="flex justify-end">
//             <Button
//               color="red"
//               variant="custom"
//               className="bg-red-600 hover:bg-red-700 text-white mt-4"
//               onClick={handleSubmit}
//             >
//               Submit Response
//             </Button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// export default QuoteResponsePage;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../Header";
import { useAuth } from "../../../context/AuthContext";
import {
  addResponseToRFQ,
  getResponsesOfRFQ,
} from "../../../services/rfqServices";

function QuoteResponsePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [rfq, setRFQ] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: `/responses/${id}` } });
      return;
    }
    if (user.role !== "Material Supplier") {
      toast.error("❌ Access denied. Only suppliers can respond.");
      navigate("/");
    }
  }, [user, id, navigate]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await getResponsesOfRFQ(id);

        if (!res?.rfq || !res.rfq?.materials?.length) {
          toast.error("⚠️ RFQ not found or has no materials.");
          setLoading(false);
          return;
        }

        setRFQ(res.rfq);

        const existing = res.responses?.find(
          (r) => r.supplier?._id === user?._id
        );

        const initializedResponses = (res.rfq.materials || []).map((m, idx) => {
          const existingQuote = existing?.quotes?.find(
            (q) => q.material === m._id
          );
          return {
            materialId: m._id || idx,
            name: m.name,
            quantity: m.quantity,
            unit: m.unit,
            price: existingQuote?.price || "",
            totalAmount: (existingQuote?.price || 0) * (m.quantity || 0),
          };
        });

        setResponses(initializedResponses);
      } catch (err) {
        toast.error("❌ Failed to load RFQ details.");
      } finally {
        setLoading(false);
      }
    };

    if (id && user) fetchResponses();
  }, [id, user]);

  const updateResponse = (index, field, value) => {
    const updated = [...responses];
    updated[index][field] = value;

    if (field === "price") {
      const qty = updated[index].quantity || 0;
      const price = parseFloat(value) || 0;
      updated[index].totalAmount = qty * price;
    }

    setResponses(updated);
  };

  const grandTotal = responses.reduce(
    (sum, r) => sum + (parseFloat(r.totalAmount) || 0),
    0
  );
  const handleSubmit = async () => {
    if (!responses.every((r) => r.price !== "")) {
      toast.error("⚠️ Please fill prices for all items.");
      return;
    }

    try {
      const supplierId = user?._id || user?.id || user?.userId;
      if (!supplierId) {
        toast.error("❌ Supplier ID is missing. Please log in again.");
        return;
      }

      // Pass the responses array directly
      await addResponseToRFQ(id, supplierId, responses);

      toast.success("✅ Response submitted successfully!");
      setTimeout(() => navigate("/thankyou"), 1200);
    } catch (err) {
      console.error("Error submitting response:", err);
      toast.error("❌ Failed to submit response.");
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Supplier Response" />
        <div className="p-6">Loading RFQ...</div>
      </>
    );
  }

  if (!rfq) {
    return (
      <>
        <Header title="Supplier Response" />
        <div className="p-6">No RFQ found.</div>
      </>
    );
  }

  return (
    <>
      <Header title="Supplier Response" />
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen space-y-6">
        <ToastContainer position="top-right" autoClose={2000} />

        <div className="bg-white border rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-2">
            RFQ for Project: {rfq.project || "Unknown Project"}
          </h2>
          <p className="text-sm text-gray-600">
            Delivery Location: {rfq.deliveryLocation || "N/A"}
          </p>
          <p className="text-sm text-gray-600">
            Bidding:{" "}
            {rfq.biddingStartDate
              ? new Date(rfq.biddingStartDate).toLocaleDateString()
              : "N/A"}{" "}
            -{" "}
            {rfq.biddingEndDate
              ? new Date(rfq.biddingEndDate).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        {/* Responsive Table */}
        <div className="bg-white border rounded-lg shadow-sm">
          {/* Desktop Header */}
          <div className="hidden sm:grid grid-cols-6 text-xs font-semibold text-gray-600 uppercase bg-gray-100 px-6 py-2 rounded-t-lg">
            <span>S.No</span>
            <span>Item</span>
            <span>Qty</span>
            <span>Unit</span>
            <span>Price</span>
            <span>Total</span>
          </div>

          <div className="divide-y divide-gray-200">
            {responses.length > 0 ? (
              responses.map((r, idx) => (
                <div
                  key={r.materialId || idx}
                  className="grid grid-cols-1 sm:grid-cols-6 gap-3 px-4 sm:px-6 py-3 items-center text-sm"
                >
                  {/* Mobile Card Layout */}
                  <div className="sm:hidden space-y-1">
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs text-gray-600">
                      Qty: {r.quantity} {r.unit}
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-24"
                        placeholder="Price"
                        value={r.price}
                        onChange={(e) =>
                          updateResponse(idx, "price", e.target.value)
                        }
                      />
                      <span className="font-medium text-gray-800">
                        {r.totalAmount ? `₹${r.totalAmount}` : "-"}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <span className="hidden sm:block">{idx + 1}</span>
                  <span className="hidden sm:block">{r.name}</span>
                  <span className="hidden sm:block">{r.quantity}</span>
                  <span className="hidden sm:block">{r.unit}</span>
                  <input
                    type="number"
                    className="hidden sm:block border rounded px-2 py-1"
                    placeholder="Price"
                    value={r.price}
                    onChange={(e) =>
                      updateResponse(idx, "price", e.target.value)
                    }
                  />
                  <span className="hidden sm:block font-medium">
                    {r.totalAmount ? `₹${r.totalAmount}` : "-"}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-3 text-gray-500 text-sm">
                No materials available.
              </div>
            )}
          </div>

          {responses.length > 0 && (
            <div className="flex justify-end px-6 py-3 font-semibold text-gray-800 border-t">
              Grand Total: ₹{grandTotal}
            </div>
          )}
        </div>

        {responses.length > 0 && (
          <div className="flex justify-end">
            <Button
              color="red"
              variant="custom"
              className="bg-red-600 hover:bg-red-700 text-white mt-4"
              onClick={handleSubmit}
            >
              Submit Response
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

export default QuoteResponsePage;
