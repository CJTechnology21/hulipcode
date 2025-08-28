import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Button from "../../../../components/Button";
import DropDown from "../../../../components/DropDown";
import { toast } from "react-toastify";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../../../services/transactionServices"; // your axios API calls
import { fetchVendors } from "../../../../services/leadServices";
import { fetchPartyByProject } from "../../../../services/partyServices";

// ----------------- constants ----------------- //

// field configuration
const fieldConfig = {
  "Payment In": ["amount", "mode", "date", "party", "proof", "notes"],
  "Payment Out": ["amount", "mode", "date", "party", "proof", "notes"],
  "Debit Note": ["party", "amount", "date", "mode", "notes"],
  "Credit Note": ["party", "amount", "date", "mode", "notes"],
  "Party to Party Payment": [
    "fromParty",
    "toParty",
    "amount",
    "mode",
    "date",
    "proof",
    "notes",
  ],
  "Sales Invoice": ["party", "amount", "date", "dueDate", "mode", "proof", "notes"],
  "Material Sales": ["party", "material", "quantity", "amount", "date", "mode", "notes"],
  "Material Purchase": ["vendor", "material", "quantity", "amount", "date", "mode", "proof", "notes"],
  "Material Return": ["vendor", "material", "quantity", "amount", "date", "mode", "notes"],
  "Material Transfer": ["fromLocation", "toLocation", "material", "quantity", "date", "mode", "notes"],
  "Sub Con Bill": ["vendor", "amount", "date", "mode", "proof", "notes"],
  "Other Expense": ["category", "amount", "mode", "date", "notes"],
  "I Paid": ["amount", "mode", "date", "notes"],
  "I Received": ["amount", "mode", "date", "notes"],
};

// map transaction type → category
const typeCategoryMap = {
  "Payment In": "Invoice",
  "Sales Invoice": "Invoice",
  "Material Sales": "Invoice",
  "I Received": "Invoice",
  "Payment Out": "Expense",
  "Material Purchase": "Expense",
  "Material Return": "Expense",
  "Material Transfer": "Expense",
  "Sub Con Bill": "Expense",
  "Other Expense": "Expense",
  "I Paid": "Expense",
  "Debit Note": "Adjustment",
  "Credit Note": "Adjustment",
  "Party to Party Payment": "Transfer",
};

// map type → button color
const typeColorMap = {
  "Payment In": "green",
  "I Received": "green",
  "Sales Invoice": "blue",
  "Material Sales": "blue",
  "Payment Out": "red",
  "I Paid": "red",
  "Material Purchase": "red",
  "Material Return": "red",
  "Material Transfer": "red",
  "Sub Con Bill": "red",
  "Other Expense": "red",
  "Debit Note": "blue",
  "Credit Note": "blue",
  "Party to Party Payment": "blue",
};

// render field function
const renderField = (field, value, onChange, vendors, parties) => {
  switch (field) {
    case "amount":
    case "quantity":
      return (
        <div>
          <label className="block text-sm font-medium mb-1">{field}</label>
          <input
            type="number"
            placeholder={`Enter ${field}`}
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
      );
    case "mode":
      return (
        <DropDown
          label="Mode"
          name="mode"
          value={value}
          onChange={(e) => onChange("mode", e.target.value)}
          options={[
            { value: "Cash", label: "Cash" },
            { value: "BankTransfer", label: "Bank Transfer" },
            { value: "UPI", label: "UPI" },
            { value: "Cheque", label: "Cheque" },
            { value: "Card", label: "Card" },
            { value: "Other", label: "Other" },
          ]}
        />
      );
    case "date":
    case "dueDate":
      return (
        <div>
          <label className="block text-sm font-medium mb-1">
            {field === "dueDate" ? "Due Date" : "Date"}
          </label>
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
      );
    case "party":
      return (
        <DropDown
          label="Party"
          name="party"
          value={value}
          onChange={(e) => onChange("party", e.target.value)}
          options={parties.map((p) => ({ value: p.id, label: p.name }))}
        />
      );
    case "vendor":
      return (
        <DropDown
          label="Vendor"
          name="vendor"
          value={value}
          onChange={(e) => onChange("vendor", e.target.value)}
          options={vendors.map((v) => ({ value: v.id, label: v.name }))}
        />
      );
    case "category":
    case "material":
    case "fromParty":
    case "toParty":
    case "fromLocation":
    case "toLocation":
      return (
        <div>
          <label className="block text-sm font-medium mb-1">{field}</label>
          <input
            type="text"
            placeholder={`Enter ${field}`}
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
      );
    case "proof":
      return (
        <div>
          <label className="block text-sm font-medium mb-1">Proof</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => onChange("proof", e.target.files[0])}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
      );
    case "notes":
      return (
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            placeholder="Enter notes"
            value={value}
            onChange={(e) => onChange("notes", e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
      );
    default:
      return null;
  }
};

// ----------------- TransactionModal ----------------- //

function TransactionModal({ isOpen, onClose, type, onSubmit, editData, projectId }) {
  const fields = fieldConfig[type] || [];
  const [formData, setFormData] = useState({});
  const [vendors, setVendors] = useState([]);
  const [parties, setParties] = useState([]);

  useEffect(() => {
    if (editData) setFormData(editData);
    else setFormData({});
  }, [editData, type]);

  useEffect(() => {
    fetchVendors().then(setVendors).catch(() => setVendors([]));
    if (projectId) {
      fetchPartyByProject(projectId).then(setParties).catch(() => setParties([]));
    }
  }, [projectId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const category = typeCategoryMap[type] || "Other";
      const transaction = {
        ...formData,
        projectId,
        architectId: formData.architectId, // should come from formData or context
        category,
        transactionType: type,
      };

      let res;
      if (editData?.id) {
        res = await updateTransaction(editData.id, transaction);
        toast.success(`${type} transaction updated successfully!`);
      } else {
        res = await createTransaction(transaction);
        toast.success(`${type} transaction created successfully!`);
      }

      onSubmit(res, !!editData);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  const isValid = fields.every((f) => {
    if (f === "proof" || f === "notes") return true;
    if (f === "amount" || f === "quantity") return formData[f] && Number(formData[f]) > 0;
    return !!formData[f];
  });

  const buttonColor = typeColorMap[type] || "gray";

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                {editData ? `Edit ${type}` : type}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Dynamic Form */}
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field}>
                  {renderField(field, formData[field] || "", handleChange, vendors, parties)}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outlined" onClick={onClose} color="gray">
                Cancel
              </Button>
              <Button
                variant="custom"
                color={isValid ? buttonColor : "gray"}
                disabled={!isValid}
                onClick={handleSave}
                className={`${
                  isValid
                    ? buttonColor === "green"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : buttonColor === "red"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {editData ? "Update" : "Save"}
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}

export default TransactionModal;

// import { Fragment, useState, useEffect } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import { XMarkIcon } from "@heroicons/react/24/outline";
// import Button from "../../../../components/Button";
// import DropDown from "../../../../components/DropDown";
// import { toast } from "react-toastify";

// // import API services
// import { fetchVendors } from "../../../../services/leadServices";
// import { fetchPartyByProject } from "../../../../services/partyServices";

// // field configuration
// const fieldConfig = {
//   "Payment In": ["amount", "mode", "date", "party", "proof", "notes"],
//   "Payment Out": ["amount", "mode", "date", "party", "proof", "notes"],
//   "Debit Note": ["party", "amount", "date", "mode", "notes"],
//   "Credit Note": ["party", "amount", "date", "mode", "notes"],
//   "Party to Party Payment": [
//     "fromParty",
//     "toParty",
//     "amount",
//     "mode",
//     "date",
//     "proof",
//     "notes",
//   ],

//   // Sales
//   "Sales Invoice": [
//     "party",
//     "amount",
//     "date",     // ✅ added
//     "dueDate",  // ✅ keep due date
//     "mode",
//     "proof",
//     "notes",
//   ],
//   "Material Sales": [
//     "party",
//     "material",
//     "quantity",
//     "amount",
//     "date",
//     "mode",
//     "notes",
//   ],

//   // Expense
//   "Material Purchase": [
//     "vendor",
//     "material",
//     "quantity",
//     "amount",
//     "date",
//     "mode",
//     "proof",
//     "notes",
//   ],
//   "Material Return": [
//     "vendor",
//     "material",
//     "quantity",
//     "amount",
//     "date",
//     "mode",
//     "notes",
//   ],
//   "Material Transfer": [
//     "fromLocation",
//     "toLocation",
//     "material",
//     "quantity",
//     "date",
//     "mode",
//     "notes",
//   ],
//   "Sub Con Bill": ["vendor", "amount", "date", "mode", "proof", "notes"],
//   "Other Expense": ["category", "amount", "mode", "date", "notes"],

//   // My Account
//   "I Paid": ["amount", "mode", "date", "notes"],
//   "I Received": ["amount", "mode", "date", "notes"],
// };

// // map transaction type → category
// const typeCategoryMap = {
//   "Payment In": "Invoice",
//   "Sales Invoice": "Invoice",
//   "Material Sales": "Invoice",
//   "I Received": "Invoice",

//   "Payment Out": "Expense",
//   "Material Purchase": "Expense",
//   "Material Return": "Expense",
//   "Material Transfer": "Expense",
//   "Sub Con Bill": "Expense",
//   "Other Expense": "Expense",
//   "I Paid": "Expense",

//   "Debit Note": "Adjustment",
//   "Credit Note": "Adjustment",
//   "Party to Party Payment": "Transfer",
// };

// // map type → button color
// const typeColorMap = {
//   "Payment In": "green",
//   "I Received": "green",
//   "Sales Invoice": "blue",
//   "Material Sales": "blue",

//   "Payment Out": "red",
//   "I Paid": "red",
//   "Material Purchase": "red",
//   "Material Return": "red",
//   "Material Transfer": "red",
//   "Sub Con Bill": "red",
//   "Other Expense": "red",

//   "Debit Note": "blue",
//   "Credit Note": "blue",
//   "Party to Party Payment": "blue",
// };

// // render field
// const renderField = (field, value, onChange, vendors, parties) => {
//   switch (field) {
//     case "amount":
//       return (
//         <div>
//           <label className="block text-sm font-medium mb-1">Amount</label>
//           <input
//             type="number"
//             placeholder="Enter amount"
//             value={value}
//             onChange={(e) => onChange("amount", e.target.value)}
//             className="w-full border rounded-md px-3 py-2"
//           />
//         </div>
//       );

//     case "mode":
//       return (
//         <DropDown
//           label="Mode"
//           name="mode"
//           value={value}
//           onChange={(e) => onChange("mode", e.target.value)}
//           options={[
//             { value: "cash", label: "Cash" },
//             { value: "bank", label: "Bank" },
//             { value: "upi", label: "UPI" },
//           ]}
//         />
//       );

//     case "date":
//     case "dueDate":
//       return (
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             {field === "dueDate" ? "Due Date" : "Date"}
//           </label>
//           <input
//             type="date"
//             value={value}
//             onChange={(e) => onChange(field, e.target.value)}
//             className="w-full border rounded-md px-3 py-2"
//           />
//         </div>
//       );

//     case "party":
//       return (
//         <DropDown
//           label="Party"
//           name="party"
//           value={value}
//           onChange={(e) => onChange("party", e.target.value)}
//           options={parties.map((p) => ({ value: p.id, label: p.name }))}
//         />
//       );

//     case "vendor":
//       return (
//         <DropDown
//           label="Vendor"
//           name="vendor"
//           value={value}
//           onChange={(e) => onChange("vendor", e.target.value)}
//           options={vendors.map((v) => ({ value: v.id, label: v.name }))}
//         />
//       );

//     case "category":
//       return (
//         <div>
//           <label className="block text-sm font-medium mb-1">Category</label>
//           <input
//             type="text"
//             placeholder="Enter category"
//             value={value}
//             onChange={(e) => onChange("category", e.target.value)}
//             className="w-full border rounded-md px-3 py-2"
//           />
//         </div>
//       );

//     case "material":
//       return (
//         <div>
//           <label className="block text-sm font-medium mb-1">Material</label>
//           <input
//             type="text"
//             placeholder="Enter material"
//             value={value}
//             onChange={(e) => onChange("material", e.target.value)}
//             className="w-full border rounded-md px-3 py-2"
//           />
//         </div>
//       );

//     case "quantity":
//       return (
//         <div>
//           <label className="block text-sm font-medium mb-1">Quantity</label>
//           <input
//             type="number"
//             placeholder="Enter quantity"
//             value={value}
//             onChange={(e) => onChange("quantity", e.target.value)}
//             className="w-full border rounded-md px-3 py-2"
//           />
//         </div>
//       );

//     case "fromParty":
//     case "toParty":
//     case "fromLocation":
//     case "toLocation":
//       return (
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             {field.replace(/([A-Z])/g, " $1")}
//           </label>
//           <input
//             type="text"
//             placeholder={field.replace(/([A-Z])/g, " $1")}
//             value={value}
//             onChange={(e) => onChange(field, e.target.value)}
//             className="w-full border rounded-md px-3 py-2"
//           />
//         </div>
//       );

//     case "proof":
//       return (
//         <div>
//           <label className="block text-sm font-medium mb-1">Proof</label>
//           <input
//             type="file"
//             accept="image/*,application/pdf"
//             onChange={(e) => onChange("proof", e.target.files[0])}
//             className="w-full border rounded-md px-3 py-2"
//           />
//         </div>
//       );

//     case "notes":
//       return (
//         <div>
//           <label className="block text-sm font-medium mb-1">Notes</label>
//           <textarea
//             placeholder="Enter notes"
//             value={value}
//             onChange={(e) => onChange("notes", e.target.value)}
//             className="w-full border rounded-md px-3 py-2"
//           />
//         </div>
//       );

//     default:
//       return null;
//   }
// };

// function TransactionModal({ isOpen, onClose, type, onSubmit, editData, projectId }) {
//   const fields = fieldConfig[type] || [];
//   const [formData, setFormData] = useState({});
//   const [vendors, setVendors] = useState([]);
//   const [parties, setParties] = useState([]);

//   useEffect(() => {
//     if (editData) setFormData(editData);
//     else setFormData({});
//   }, [editData, type]);

//   useEffect(() => {
//     fetchVendors().then(setVendors).catch(() => setVendors([]));
//     if (projectId) {
//       fetchPartyByProject(projectId)
//         .then(setParties)
//         .catch(() => setParties([]));
//     }
//   }, [projectId]);

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSave = () => {
//     const category = typeCategoryMap[type];
//     const transaction = {
//       ...formData,
//       transactionType: category || "Other",
//       type,
//       id: editData?.id || Date.now(),
//     };

//     onSubmit(transaction, !!editData);
//     toast.success(
//       editData
//         ? `${type} transaction updated successfully!`
//         : `${type} transaction created successfully!`
//     );
//     onClose();
//   };

//   // validate: all required except proof & notes
//   const isValid = fields.every((f) => {
//     if (f === "proof" || f === "notes") return true;
//     if (f === "amount" || f === "quantity") return formData[f] && Number(formData[f]) > 0;
//     return !!formData[f];
//   });

//   const buttonColor = typeColorMap[type] || "gray";

//   return (
//     <Transition show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={onClose}>
//         <div className="fixed inset-0 bg-black/40" />
//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-4">
//               <Dialog.Title className="text-lg font-semibold text-gray-900">
//                 {editData ? `Edit ${type}` : type}
//               </Dialog.Title>
//               <button
//                 onClick={onClose}
//                 className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
//               >
//                 <XMarkIcon className="h-5 w-5" />
//               </button>
//             </div>

//             {/* Dynamic Form */}
//             <div className="space-y-4">
//               {fields.map((field) => (
//                 <div key={field}>
//                   {renderField(field, formData[field] || "", handleChange, vendors, parties)}
//                 </div>
//               ))}
//             </div>

//             {/* Actions */}
//             <div className="mt-6 flex justify-end space-x-3">
//               <Button variant="outlined" onClick={onClose} color="gray">
//                 Cancel
//               </Button>
//               <Button
//                 variant="custom"
//                 color={isValid ? buttonColor : "gray"}
//                 disabled={!isValid}
//                 onClick={handleSave}
//                 className={`${
//                   isValid
//                     ? buttonColor === "green"
//                       ? "bg-green-500 hover:bg-green-600 text-white"
//                       : buttonColor === "red"
//                       ? "bg-red-500 hover:bg-red-600 text-white"
//                       : "bg-blue-500 hover:bg-blue-600 text-white"
//                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 }`}
//               >
//                 {editData ? "Update" : "Save"}
//               </Button>
//             </div>
//           </Dialog.Panel>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }

// export default TransactionModal;
