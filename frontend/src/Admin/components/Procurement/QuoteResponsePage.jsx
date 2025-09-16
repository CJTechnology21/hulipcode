import React, { useState } from "react";
import Layout from "../Layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../../components/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function QuoteResponsePage() {
  // just hard-code some RFQ and materials for demo
  const rfq = {
    project: { name: "Demo Project" },
    deliveryLocation: "Hyderabad",
    biddingStartDate: "2025-09-01",
    biddingEndDate: "2025-09-10",
  };

  const [responses, setResponses] = useState([
    {
      materialId: "m1",
      name: "Cement",
      quantity: 100,
      unit: "Bags",
      price: "",
      remarks: "",
      deliveryDate: new Date(),
    },
    {
      materialId: "m2",
      name: "Steel",
      quantity: 50,
      unit: "Tons",
      price: "",
      remarks: "",
      deliveryDate: new Date(),
    },
  ]);

  const updateResponse = (index, field, value) => {
    const updated = [...responses];
    updated[index][field] = value;
    setResponses(updated);
  };

  const handleSubmit = () => {
    if (!responses.every((r) => r.price)) {
      toast.error("Please fill prices for all items.");
      return;
    }
    toast.success("This is a static demo. Response submitted!");
  };

  return (
    <Layout title={"Supplier Response"}>
      <ToastContainer />
      <div className="p-6 bg-gray-100 min-h-screen space-y-6">
        <div className="bg-white border rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-2">
            RFQ for {rfq.project?.name}
          </h2>
          <p className="text-sm text-gray-600">
            Delivery Location: {rfq.deliveryLocation}
          </p>
          <p className="text-sm text-gray-600">
            Bidding:{" "}
            {new Date(rfq.biddingStartDate).toLocaleDateString()} -{" "}
            {new Date(rfq.biddingEndDate).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white border rounded-lg shadow-sm">
          <div className="grid grid-cols-6 text-xs font-semibold text-gray-600 uppercase bg-gray-100 px-6 py-2 rounded-t-lg">
            <span>Item</span>
            <span>Qty</span>
            <span>Unit</span>
            <span>Price</span>
            <span>Delivery Date</span>
            <span>Remarks</span>
          </div>
          <div className="divide-y divide-gray-200">
            {responses.map((r, idx) => (
              <div
                key={r.materialId}
                className="grid grid-cols-6 gap-3 px-6 py-3 items-center text-sm"
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
                <DatePicker
                  selected={r.deliveryDate}
                  onChange={(date) => updateResponse(idx, "deliveryDate", date)}
                  dateFormat="dd/MM/yyyy"
                  className="border rounded px-2 py-1 w-full"
                />
                <input
                  type="text"
                  className="border rounded px-2 py-1"
                  placeholder="Remarks"
                  value={r.remarks}
                  onChange={(e) => updateResponse(idx, "remarks", e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

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
      </div>
    </Layout>
  );
}

export default QuoteResponsePage;

// import React from "react";
// import Layout from "../Layout";
// function QuoteResponsePage() {
//   return (
//     <Layout title={"Add Responses"}>
//       <div>QuoteResponsePage</div>
//     </Layout>
//   );
// }

// export default QuoteResponsePage;
