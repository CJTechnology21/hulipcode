import React, { useState } from "react";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import { createInvoice } from "../../../../services/overViewServices";

function InvoiceModal({ isOpen, onClose, addInvoice, projectId }) {
  const [invoiceData, setInvoiceData] = useState({
    firm: "",
    date: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...invoiceData, projectId };
      const res = await createInvoice(payload);

      if (addInvoice) addInvoice(res.invoice || res); // update parent state
      setInvoiceData({ firm: "", date: "", amount: "" });
      onClose();
    } catch (err) {
      console.error("Error saving invoice:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to save invoice");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md sm:max-w-lg">
        <h3 className="font-semibold text-gray-800 mb-4 text-lg sm:text-xl">
          Add Invoice {projectId && `(Project ID: ${projectId})`}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            name="firm"
            value={invoiceData.firm}
            onChange={handleChange}
            placeholder="Firm Name"
            className="w-full border p-2 rounded"
            required
          />
          <Input
            type="date"
            name="date"
            value={invoiceData.date}
            onChange={handleChange}
            placeholder="Invoice Date"
            className="w-full border p-2 rounded"
            required
          />
          <Input
            type="number"
            name="amount"
            value={invoiceData.amount}
            onChange={handleChange}
            placeholder="Amount ₹"
            className="w-full border p-2 rounded"
            required
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="custom"
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="custom"
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InvoiceModal;

// import React, { useState } from "react";
// import axios from "axios";
// import Input from "../../../../components/Input";
// import Button from "../../../../components/Button";

// function InvoiceModal({ isOpen, onClose, addInvoice, projectId }) {
//   const [invoiceData, setInvoiceData] = useState({
//     firm: "",
//     date: "",
//     amount: "",
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newInvoice = {
//       ...invoiceData,
//       projectId, // ✅ required by backend
//     };

//     try {
//       setLoading(true);

//       // ✅ POST to backend
//       const res = await axios.post(
//         "http://localhost:5000/api/invoice",
//         newInvoice,
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       console.log("Invoice saved:", res.data);

//       // ✅ update parent state with backend response
//       addInvoice(res.data.invoice || res.data);

//       // reset form
//       setInvoiceData({ firm: "", date: "", amount: "" });
//       onClose();
//     } catch (err) {
//       console.error("Error saving invoice:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Failed to save invoice");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
//       <div className="bg-white p-6 rounded-xl w-full max-w-md sm:max-w-lg">
//         <h3 className="font-semibold text-gray-800 mb-4 text-lg sm:text-xl">
//           Add Invoice
//           {/* Add Invoice */}
//         </h3>
//         <form onSubmit={handleSubmit} className="space-y-3">
//           <Input
//             type="text"
//             name="firm"
//             value={invoiceData.firm}
//             onChange={handleChange}
//             placeholder="Firm Name"
//             className="w-full border p-2 rounded"
//             required
//           />
//           <Input
//             type="date"
//             name="date"
//             value={invoiceData.date}
//             onChange={handleChange}
//             placeholder="Invoice Date"
//             className="w-full border p-2 rounded"
//             required
//           />
//           <Input
//             type="number"
//             name="amount"
//             value={invoiceData.amount}
//             onChange={handleChange}
//             placeholder="Amount ₹"
//             className="w-full border p-2 rounded"
//             required
//           />

//           <div className="flex justify-end gap-2 mt-4">
//             <Button
//               variant="custom"
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-300 rounded"
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="custom"
//               type="submit"
//               disabled={loading}
//               className={`px-4 py-2 rounded text-white ${
//                 loading
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-red-500 hover:bg-red-600"
//               }`}
//             >
//               {loading ? "Saving..." : "Save"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default InvoiceModal;
