import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../Header";
import { useAuth } from "../../../context/AuthContext";
import { addResponseToRFQ, getResponsesOfRFQ } from "../../../services/rfqServices";

function QuoteResponsePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [rfq, setRFQ] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth + role check
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: `/responses/${id}` } });
      return;
    }
    if (user.role !== "Material Supplier") {
      toast.error("Access denied. Only suppliers can respond.");
      navigate("/");
      return;
    }
  }, [user, id, navigate]);

  // Fetch RFQ + existing responses
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await getResponsesOfRFQ(id);
        console.log("RFQ fetch response:", res);
        console.log("RFQ materials:", res.rfq.materials);

        if (!res?.rfq || !res.rfq?.materials?.length) {
          toast.error("RFQ not found or has no materials.");
          setLoading(false);
          return;
        }

        setRFQ(res.rfq);

        // Prefill if supplier already submitted
        const existing = res.responses?.find(r => r.supplier?._id === user?._id);
        console.log("Existing response for this supplier:", existing);

        if (existing?.items?.length) {
          setResponses(
            existing.items.map(i => ({
              materialId: i.materialId,
              name: i.name,
              quantity: i.quantity,
              unit: i.unit,
              price: i.price,
            }))
          );
        } else {
          // Initialize blank responses from RFQ materials
          const blankResponses = (res.rfq.materials || []).map(m => {
            console.log("Mapping material:", m);
            return {
              materialId: m._id,
              name: m.name,
              quantity: m.quantity,
              unit: m.unit,
              price: "",
            };
          });
          console.log("Initialized blank responses:", blankResponses);
          setResponses(blankResponses);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load RFQ details");
      } finally {
        setLoading(false);
      }
    };

    if (id && user) fetchResponses();
  }, [id, user]);

  const updateResponse = (index, field, value) => {
    const updated = [...responses];
    updated[index][field] = value;
    setResponses(updated);
  };

  const handleSubmit = async () => {
    console.log("Submitting responses:", responses);
    if (!responses.every(r => r.price !== "")) {
      toast.error("Please fill prices for all items.");
      return;
    }

    try {
      await addResponseToRFQ(id, {
        supplierId: user._id,
        responses,
      });
      toast.success("Response submitted successfully!");
      navigate("/thank-you");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit response");
    }
  };

  if (loading) {
    return (
      <Header title="Supplier Response">
        <div className="p-6">Loading RFQ...</div>
      </Header>
    );
  }

  if (!rfq) {
    return (
      <Header title="Supplier Response">
        <div className="p-6">No RFQ found.</div>
      </Header>
    );
  }

  return (
    <Header title="Supplier Response">
      <ToastContainer />
      <div className="p-6 bg-gray-100 min-h-screen space-y-6">
        {/* RFQ Info */}
        <div className="bg-white border rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-2">
            RFQ for {rfq.project?.name || "Unnamed Project"}
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

        {/* Response Table */}
        <div className="bg-white border rounded-lg shadow-sm">
          <div className="grid grid-cols-4 text-xs font-semibold text-gray-600 uppercase bg-gray-100 px-6 py-2 rounded-t-lg">
            <span>Item</span>
            <span>Qty</span>
            <span>Unit</span>
            <span>Price</span>
          </div>
          <div className="divide-y divide-gray-200">
            {responses.length > 0 ? (
              responses.map((r, idx) => (
                <div
                  key={r.materialId || idx}
                  className="grid grid-cols-4 gap-3 px-6 py-3 items-center text-sm"
                >
                  <span>{r.name}</span>
                  <span>{r.quantity}</span>
                  <span>{r.unit}</span>
                  <input
                    type="number"
                    className="border rounded px-2 py-1"
                    placeholder="Price"
                    value={r.price}
                    onChange={(e) => updateResponse(idx, "price", e.target.value)}
                  />
                </div>
              ))
            ) : (
              <div className="px-6 py-3 text-gray-500 text-sm">No materials available.</div>
            )}
          </div>
        </div>

        {/* Submit Button */}
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
    </Header>
  );
}

export default QuoteResponsePage;

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
//   const { id } = useParams(); // RFQ ID from URL
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

//   // Fetch RFQ + existing responses
//   useEffect(() => {
//     const fetchResponses = async () => {
//       try {
//         const res = await getResponsesOfRFQ(id);

//         if (!res?.rfq || !res?.rfq?.materials?.length) {
//           toast.error("RFQ not found or has no materials.");
//           setLoading(false);
//           return;
//         }

//         setRFQ(res.rfq); // ✅ use res.rfq directly

//         // Prefill if supplier already responded
//         const existing = res.responses?.find(
//           (r) => r.supplier?._id === user?._id
//         );

//         if (existing) {
//           setResponses(
//             existing.items.map((i) => ({
//               materialId: i.materialId,
//               name: i.name,
//               quantity: i.quantity,
//               unit: i.unit,
//               price: i.price,
//             }))
//           );
//         } else {
//           setResponses(
//             (res.rfq.materials || []).map((m) => ({
//               materialId: m._id,
//               name: m.name,
//               quantity: m.quantity,
//               unit: m.unit,
//               price: "",
//             }))
//           );
//         }
//       } catch (err) {
//         toast.error("Failed to load RFQ details");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id && user) fetchResponses();
//   }, [id, user]);

//   const updateResponse = (index, field, value) => {
//     const updated = [...responses];
//     updated[index][field] = value;
//     setResponses(updated);
//   };

//   //  Submit handler
//   const handleSubmit = async () => {
//     if (!responses.every((r) => r.price)) {
//       toast.error("Please fill prices for all items.");
//       return;
//     }

//     try {
//       await addResponseToRFQ(id, {
//         supplierId: user._id,
//         responses,
//       });
//       toast.success("Response submitted successfully!");
//       navigate("/thank-you");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to submit response");
//     }
//   };

//   if (loading) {
//     return (
//       <Header title="Supplier Response">
//         <div className="p-6">Loading RFQ...</div>
//       </Header>
//     );
//   }

//   if (!rfq) {
//     return (
//       <Header title="Supplier Response">
//         <div className="p-6">No RFQ found.</div>
//       </Header>
//     );
//   }

//   return (
//     <Header title={"Supplier Response"}>
//       <ToastContainer />
//       <div className="p-6 bg-gray-100 min-h-screen space-y-6">
//         {/* RFQ Info */}
//         <div className="bg-white border rounded-lg shadow-sm p-4">
//           <h2 className="text-lg font-semibold mb-2">
//             RFQ for {rfq?.project?.name || "Unnamed Project"}
//           </h2>
//           <p className="text-sm text-gray-600">
//             Delivery Location: {rfq?.deliveryLocation || "N/A"}
//           </p>
//           <p className="text-sm text-gray-600">
//             Bidding:{" "}
//             {rfq?.biddingStartDate
//               ? new Date(rfq.biddingStartDate).toLocaleDateString()
//               : "N/A"}{" "}
//             -{" "}
//             {rfq?.biddingEndDate
//               ? new Date(rfq.biddingEndDate).toLocaleDateString()
//               : "N/A"}
//           </p>
//         </div>

//         {/* Response Table */}
//         <div className="bg-white border rounded-lg shadow-sm">
//           <div className="grid grid-cols-4 text-xs font-semibold text-gray-600 uppercase bg-gray-100 px-6 py-2 rounded-t-lg">
//             <span>Item</span>
//             <span>Qty</span>
//             <span>Unit</span>
//             <span>Price</span>
//           </div>
//           <div className="divide-y divide-gray-200">
//             {responses.length > 0 ? (
//               responses.map((r, idx) => (
//                 <div
//                   key={r.materialId || idx}
//                   className="grid grid-cols-4 gap-3 px-6 py-3 items-center text-sm"
//                 >
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
//                 </div>
//               ))
//             ) : (
//               <div className="px-6 py-3 text-gray-500 text-sm">
//                 No materials available.
//               </div>
//             )}
//           </div>
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
//     </Header>
//   );
// }

// export default QuoteResponsePage;

// import React, { useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import Button from "../../../components/Button";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Header from "../Header";

// function QuoteResponsePage() {
//   const rfq = {
//     project: { name: "Demo Project" },
//     deliveryLocation: "Hyderabad",
//     biddingStartDate: "2025-09-01",
//     biddingEndDate: "2025-09-10",
//   };

//   const [responses, setResponses] = useState([
//     {
//       materialId: "m1",
//       name: "Cement",
//       quantity: 100,
//       unit: "Bags",
//       price: "",
//       remarks: "",
//       deliveryDate: new Date(),
//     },
//     {
//       materialId: "m2",
//       name: "Steel",
//       quantity: 50,
//       unit: "Tons",
//       price: "",
//       remarks: "",
//       deliveryDate: new Date(),
//     },
//   ]);

//   const updateResponse = (index, field, value) => {
//     const updated = [...responses];
//     updated[index][field] = value;
//     setResponses(updated);
//   };

//   const handleSubmit = () => {
//     if (!responses.every((r) => r.price)) {
//       toast.error("Please fill prices for all items.");
//       return;
//     }
//     toast.success("This is a static demo. Response submitted!");
//   };

//   return (
//     <Header title={"Supplier Response"}>
//       <ToastContainer />
//       <div className="p-6 bg-gray-100 min-h-screen space-y-6">
//         <div className="bg-white border rounded-lg shadow-sm p-4">
//           <h2 className="text-lg font-semibold mb-2">
//             RFQ for {rfq.project?.name}
//           </h2>
//           <p className="text-sm text-gray-600">
//             Delivery Location: {rfq.deliveryLocation}
//           </p>
//           <p className="text-sm text-gray-600">
//             Bidding:{" "}
//             {new Date(rfq.biddingStartDate).toLocaleDateString()} -{" "}
//             {new Date(rfq.biddingEndDate).toLocaleDateString()}
//           </p>
//         </div>

//         <div className="bg-white border rounded-lg shadow-sm">
//           <div className="grid grid-cols-6 text-xs font-semibold text-gray-600 uppercase bg-gray-100 px-6 py-2 rounded-t-lg">
//             <span>Item</span>
//             <span>Qty</span>
//             <span>Unit</span>
//             <span>Price</span>
//             <span>Delivery Date</span>
//             <span>Remarks</span>
//           </div>
//           <div className="divide-y divide-gray-200">
//             {responses.map((r, idx) => (
//               <div
//                 key={r.materialId}
//                 className="grid grid-cols-6 gap-3 px-6 py-3 items-center text-sm"
//               >
//                 <span>{r.name}</span>
//                 <span>{r.quantity}</span>
//                 <span>{r.unit}</span>
//                 <input
//                   type="number"
//                   className="border rounded px-2 py-1"
//                   placeholder="Price"
//                   value={r.price}
//                   onChange={(e) => updateResponse(idx, "price", e.target.value)}
//                 />
//                 <DatePicker
//                   selected={r.deliveryDate}
//                   onChange={(date) => updateResponse(idx, "deliveryDate", date)}
//                   dateFormat="dd/MM/yyyy"
//                   className="border rounded px-2 py-1 w-full"
//                 />
//                 <input
//                   type="text"
//                   className="border rounded px-2 py-1"
//                   placeholder="Remarks"
//                   value={r.remarks}
//                   onChange={(e) => updateResponse(idx, "remarks", e.target.value)}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex justify-end">
//           <Button
//             color="red"
//             variant="custom"
//             className="bg-red-600 hover:bg-red-700 text-white mt-4"
//             onClick={handleSubmit}
//           >
//             Submit Response
//           </Button>
//         </div>
//       </div>
//     </Header>
//   );
// }

// export default QuoteResponsePage;
