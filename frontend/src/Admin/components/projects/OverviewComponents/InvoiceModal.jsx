import React, { useState } from "react";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";

function InvoiceModal({ isOpen, onClose, addInvoice, nextId }) {
  const [invoiceData, setInvoiceData] = useState({ firm: "", amount: "" });

  const handleChange = (e) => {
    setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newInvoice = {
      id: nextId, // auto-generate ID from parent
      ...invoiceData,
    };

    console.log("Submitting Invoice:", newInvoice); // ✅ debug

    addInvoice(newInvoice);
    setInvoiceData({ firm: "", amount: "" }); // reset form
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md sm:max-w-lg">
        <h3 className="font-semibold text-gray-800 mb-4 text-lg sm:text-xl">
          Add Invoice
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
            placeholder=" Invoice Date "
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
            >
              Cancel
            </Button>
            <Button
              variant="custom"
              type="submit"
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InvoiceModal;

// import { Button } from "@headlessui/react";
// import React, { useState } from "react";
// import Input from "../../../../components/Input";

// function InvoiceModal({ isOpen, onClose, addInvoice }) {
//   const [invoiceData, setInvoiceData] = useState({ number: "", amount: "" });

//   const handleChange = (e) => {
//     setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     addInvoice(invoiceData);
//     setInvoiceData({ number: "", amount: "" });
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-xl w-80">
//         <h3 className="font-semibold text-gray-800 mb-4">Add Invoice</h3>
//         <form onSubmit={handleSubmit} className="space-y-3">
//           <Input
//             type="text"
//             name="number"
//             value={invoiceData.number}
//             onChange={handleChange}
//             placeholder="Invoice Number"
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
//               className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
//             >
//               Add
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default InvoiceModal;
