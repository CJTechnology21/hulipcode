import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Button from "../../../../components/Button";
import DropDown from "../../../../components/DropDown";
import { toast } from "react-toastify";
import {
  createTransaction,
  updateTransaction,
} from "../../../../services/transactionServices";
import { fetchVendors } from "../../../../services/leadServices";
import { fetchPartyByProject } from "../../../../services/partyServices";
import { typeColorMap, typeCategoryMap, fieldConfig } from "./allConfigs";
import { useAuth } from "../../../../context/AuthContext";

// ----------------- constants ----------------- //
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
  const { user } = useAuth();
  const architectId = user?._id;

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

  // ----------------- handleSave ----------------- //
  const normalizeTransactionType = (type) => type.replace(/\s+/g, ""); // "Sales Invoice" -> "SalesInvoice"

  const backendCategoryMap = {
    Invoice: "Sales",
    Expense: "Expense",
    Adjustment: "Expense",
    Transfer: "MyAccount",
  };

  const handleSave = async () => {
    try {
      const uiCategory = typeCategoryMap[type] || "Other";
      const normalizedType = normalizeTransactionType(type);
      const backendCategory = backendCategoryMap[uiCategory] || "Other";

      const transaction = {
        ...formData,
        projectId,
        architectId,
        category: backendCategory,
        transactionType: normalizedType,
      };

      if (transaction.amount) transaction.amount = Number(transaction.amount);
      if (transaction.quantity) transaction.quantity = Number(transaction.quantity);

      Object.keys(transaction).forEach(
        (key) =>
          (transaction[key] === "" || transaction[key] === null) && delete transaction[key]
      );

      let payload = transaction;
      let config = {};
      if (transaction.proof) {
        const formDataObj = new FormData();
        for (let key in transaction) {
          formDataObj.append(key, transaction[key]);
        }
        payload = formDataObj;
        config = { headers: { "Content-Type": "multipart/form-data" } };
      }

      let res;
      if (editData?.id) {
        res = await updateTransaction(editData.id, payload, config);
        toast.success(`${type} transaction updated successfully!`);
      } else {
        res = await createTransaction(payload, config);
        toast.success(`${type} transaction created successfully!`);
      }

      onSubmit(res, !!editData);
      onClose();
    } catch (err) {
      console.error("Error Response:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Something went wrong!");
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
// import {
//   createTransaction,
//   updateTransaction,
// } from "../../../../services/transactionServices";
// import { fetchVendors } from "../../../../services/leadServices";
// import { fetchPartyByProject } from "../../../../services/partyServices";
// import { typeColorMap, typeCategoryMap, fieldConfig } from "./allConfigs";
// import { useAuth } from "../../../../context/AuthContext";

// // ----------------- constants ----------------- //
// const renderField = (field, value, onChange, vendors, parties) => {
//   switch (field) {
//     case "amount":
//     case "quantity":
//       return (
//         <div>
//           <label className="block text-sm font-medium mb-1">{field}</label>
//           <input
//             type="number"
//             placeholder={`Enter ${field}`}
//             value={value}
//             onChange={(e) => onChange(field, e.target.value)}
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
//             { value: "Cash", label: "Cash" },
//             { value: "BankTransfer", label: "Bank Transfer" },
//             { value: "UPI", label: "UPI" },
//             { value: "Cheque", label: "Cheque" },
//             { value: "Card", label: "Card" },
//             { value: "Other", label: "Other" },
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
//     case "material":
//     case "fromParty":
//     case "toParty":
//     case "fromLocation":
//     case "toLocation":
//       return (
//         <div>
//           <label className="block text-sm font-medium mb-1">{field}</label>
//           <input
//             type="text"
//             placeholder={`Enter ${field}`}
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

// // ----------------- TransactionModal ----------------- //
// function TransactionModal({ isOpen, onClose, type, onSubmit, editData, projectId }) {
//   const { user } = useAuth();
//   const architectId = user?._id;

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
//       fetchPartyByProject(projectId).then(setParties).catch(() => setParties([]));
//     }
//   }, [projectId]);

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSave = async () => {
//     try {
//       const category = typeCategoryMap[type] || "Other";
//       const transaction = {
//         ...formData,
//         projectId,
//         architectId,
//         category,
//         transactionType: type,
//       };

//       if (transaction.amount) transaction.amount = Number(transaction.amount);
//       if (transaction.quantity) transaction.quantity = Number(transaction.quantity);

//       Object.keys(transaction).forEach(
//         (key) => (transaction[key] === "" || transaction[key] === null) && delete transaction[key]
//       );

//       let payload = transaction;
//       let config = {};
//       if (transaction.proof) {
//         const formDataObj = new FormData();
//         for (let key in transaction) {
//           formDataObj.append(key, transaction[key]);
//         }
//         payload = formDataObj;
//         config = { headers: { "Content-Type": "multipart/form-data" } };
//       }

//       let res;
//       if (editData?.id) {
//         res = await updateTransaction(editData.id, payload, config);
//         toast.success(`${type} transaction updated successfully!`);
//       } else {
//         res = await createTransaction(payload, config);
//         toast.success(`${type} transaction created successfully!`);
//       }

//       onSubmit(res, !!editData);
//       onClose();
//     } catch (err) {
//       console.error("Error Response:", err.response?.data || err.message);
//       toast.error(err.response?.data?.message || "Something went wrong!");
//     }
//   };

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

// import { Fragment, useState, useEffect } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import { XMarkIcon } from "@heroicons/react/24/outline";
// import Button from "../../../../components/Button";
// import DropDown from "../../../../components/DropDown";
// import { toast } from "react-toastify";
// import {
//   createTransaction,
//   updateTransaction,
//   fetchCashFlow,
// } from "../../../../services/transactionServices";
// import { fetchVendors } from "../../../../services/leadServices";
// import { fetchPartyByProject } from "../../../../services/partyServices";
// import { typeColorMap, typeCategoryMap, fieldConfig } from "./allConfigs";
// import {useAuth} from '../../../../context/AuthContext'
// // ----------------- constants ----------------- //
// const renderField = (field, value, onChange, vendors, parties) => {
//   switch (field) {
//     case "amount":
//     case "quantity":
//       return (
//         <div>
//           <label className="block text-sm font-medium mb-1">{field}</label>
//           <input
//             type="number"
//             placeholder={`Enter ${field}`}
//             value={value}
//             onChange={(e) => onChange(field, e.target.value)}
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
//             { value: "Cash", label: "Cash" },
//             { value: "BankTransfer", label: "Bank Transfer" },
//             { value: "UPI", label: "UPI" },
//             { value: "Cheque", label: "Cheque" },
//             { value: "Card", label: "Card" },
//             { value: "Other", label: "Other" },
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
//     case "material":
//     case "fromParty":
//     case "toParty":
//     case "fromLocation":
//     case "toLocation":
//       return (
//         <div>
//           <label className="block text-sm font-medium mb-1">{field}</label>
//           <input
//             type="text"
//             placeholder={`Enter ${field}`}
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

// // ----------------- TransactionModal ----------------- //
// function TransactionModal({ isOpen, onClose, type, onSubmit, editData, projectId, architectId }) {
//   const fields = fieldConfig[type] || [];
//   const [formData, setFormData] = useState({});
//   const [vendors, setVendors] = useState([]);
//   const [parties, setParties] = useState([]);
//   const [cashFlow, setCashFlow] = useState({ inflow: 0, outflow: 0, balance: 0 }); // ✅ Added

//   useEffect(() => {
//     if (editData) setFormData(editData);
//     else setFormData({});
//   }, [editData, type]);

//   useEffect(() => {
//     fetchVendors().then(setVendors).catch(() => setVendors([]));
//     if (projectId) {
//       fetchPartyByProject(projectId).then(setParties).catch(() => setParties([]));
//     }
//   }, [projectId]);

//   // ✅ Fetch Cash Flow
//   const loadCashFlow = () => {
//     if (projectId && architectId) {
//       fetchCashFlow(projectId, architectId)
//         .then((data) => setCashFlow(data))
//         .catch(() => setCashFlow({ inflow: 0, outflow: 0, balance: 0 }));
//     }
//   };

//   useEffect(() => {
//     loadCashFlow();
//   }, [projectId, architectId]);

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };
//   const handleSave = async () => {
//   try {
//     const category = typeCategoryMap[type] || "Other";
//     const transaction = {
//       ...formData,
//       projectId,
//       architectId: formData.architectId || architectId,
//       category,
//       transactionType: type,
//     };

//     // Convert numbers
//     if (transaction.amount) transaction.amount = Number(transaction.amount);
//     if (transaction.quantity) transaction.quantity = Number(transaction.quantity);

//     // Remove empty fields
//     Object.keys(transaction).forEach(
//       (key) => (transaction[key] === "" || transaction[key] === null) && delete transaction[key]
//     );

//     // If proof exists → FormData
//     let payload = transaction;
//     let config = {};
//     if (transaction.proof) {
//       const formDataObj = new FormData();
//       for (let key in transaction) {
//         formDataObj.append(key, transaction[key]);
//       }
//       payload = formDataObj;
//       config = { headers: { "Content-Type": "multipart/form-data" } };
//     }

//     let res;
//     if (editData?.id) {
//       res = await updateTransaction(editData.id, payload, config);
//       toast.success(`${type} transaction updated successfully!`);
//     } else {
//       res = await createTransaction(payload, config);
//       toast.success(`${type} transaction created successfully!`);
//     }

//     onSubmit(res, !!editData);
//     loadCashFlow();
//     onClose();
//   } catch (err) {
//     console.error("Error Response:", err.response?.data || err.message);
//     toast.error(err.response?.data?.message || "Something went wrong!");
//   }
// };
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
            
//             {/* ✅ Cash Flow Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//               <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow">
//                 <h3 className="text-sm font-medium">Cash Inflow</h3>
//                 <p className="text-xl font-bold">₹{cashFlow.inflow.toLocaleString()}</p>
//               </div>
//               <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow">
//                 <h3 className="text-sm font-medium">Cash Outflow</h3>
//                 <p className="text-xl font-bold">₹{cashFlow.outflow.toLocaleString()}</p>
//               </div>
//               <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow">
//                 <h3 className="text-sm font-medium">Net Balance</h3>
//                 <p className="text-xl font-bold">₹{cashFlow.balance.toLocaleString()}</p>
//               </div>
//             </div>

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

// import { Fragment, useState, useEffect } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import { XMarkIcon } from "@heroicons/react/24/outline";
// import Button from "../../../../components/Button";
// import DropDown from "../../../../components/DropDown";
// import { toast } from "react-toastify";
// import {
//   createTransaction,
//   updateTransaction,
// } from "../../../../services/transactionServices"; // your axios API calls
// import { fetchVendors } from "../../../../services/leadServices";
// import { fetchPartyByProject } from "../../../../services/partyServices";
// import{typeColorMap,typeCategoryMap,fieldConfig} from './allConfigs'
// // ----------------- constants ----------------- //
// // render field function
// const renderField = (field, value, onChange, vendors, parties) => {
//   switch (field) {
//     case "amount":
//     case "quantity":
//       return (
//         <div>
//           <label className="block text-sm font-medium mb-1">{field}</label>
//           <input
//             type="number"
//             placeholder={`Enter ${field}`}
//             value={value}
//             onChange={(e) => onChange(field, e.target.value)}
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
//             { value: "Cash", label: "Cash" },
//             { value: "BankTransfer", label: "Bank Transfer" },
//             { value: "UPI", label: "UPI" },
//             { value: "Cheque", label: "Cheque" },
//             { value: "Card", label: "Card" },
//             { value: "Other", label: "Other" },
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
//     case "material":
//     case "fromParty":
//     case "toParty":
//     case "fromLocation":
//     case "toLocation":
//       return (
//         <div>
//           <label className="block text-sm font-medium mb-1">{field}</label>
//           <input
//             type="text"
//             placeholder={`Enter ${field}`}
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

// // ----------------- TransactionModal ----------------- //

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
//       fetchPartyByProject(projectId).then(setParties).catch(() => setParties([]));
//     }
//   }, [projectId]);

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSave = async () => {
//     try {
//       const category = typeCategoryMap[type] || "Other";
//       const transaction = {
//         ...formData,
//         projectId,
//         architectId: formData.architectId, // should come from formData or context
//         category,
//         transactionType: type,
//       };

//       let res;
//       if (editData?.id) {
//         res = await updateTransaction(editData.id, transaction);
//         toast.success(`${type} transaction updated successfully!`);
//       } else {
//         res = await createTransaction(transaction);
//         toast.success(`${type} transaction created successfully!`);
//       }

//       onSubmit(res, !!editData);
//       onClose();
//     } catch (err) {
//       console.error(err);
//       toast.error("Something went wrong!");
//     }
//   };

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
