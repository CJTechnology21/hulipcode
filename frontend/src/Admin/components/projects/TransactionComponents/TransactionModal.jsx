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
import {
  typeColorMap,
  typeCategoryMap,
  fieldConfig,
  normalizeTransactionType,
} from "./allConfigs";
import { useAuth } from "../../../../context/AuthContext";
import {
  generateUploadURL,
} from "../../../../services/overViewServices";

// ----------------- renderField ----------------- //
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
          name="partyId"
          value={value}
          onChange={(e) => onChange("partyId", e.target.value)}
          options={parties.map((p) => ({ value: p._id, label: p.name }))}
        />
      );
    case "vendor":
      return (
        <DropDown
          label="Vendor"
          name="vendorId"
          value={value}
          onChange={(e) => onChange("vendorId", e.target.value)}
          options={vendors.map((v) => ({ value: v._id, label: v.name }))}
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
function TransactionModal({
  isOpen,
  onClose,
  type,
  onSubmit,
  editData,
  projectId,
}) {
  const { user } = useAuth();
  const architectId = user?._id;

  const uiType =
    Object.keys(fieldConfig).find((key) => key.replace(/\s+/g, "") === type) ||
    type;

  const fields = fieldConfig[uiType] || [];
  const [formData, setFormData] = useState({});
  const [vendors, setVendors] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      const mapped = {
        ...editData,
        partyId: editData.party || "",
        vendorId: editData.vendor || "",
      };
      setFormData(mapped);
    } else {
      setFormData({});
    }
  }, [editData, type]);

  useEffect(() => {
    fetchVendors()
      .then(setVendors)
      .catch(() => setVendors([]));
    if (projectId) {
      fetchPartyByProject(projectId)
        .then(setParties)
        .catch(() => setParties([]));
    }
  }, [projectId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const backendCategoryMap = {
    Invoice: "Sales",
    Expense: "Expense",
    Adjustment: "Expense",
    Transfer: "MyAccount",
  };
  const handleSave = async () => {
    try {
      setLoading(true);

      const uiCategory = typeCategoryMap[uiType] || "Other";
      const normalizedType = normalizeTransactionType(uiType);
      const backendCategory = backendCategoryMap[uiCategory] || "Other";

      const transaction = {
        ...formData,
        projectId,
        architectId, // make sure this comes from useAuth
        category: backendCategory,
        transactionType: normalizedType,
      };

      // Map party and vendor
      if (transaction.partyId) {
        transaction.party = transaction.partyId;
        delete transaction.partyId;
      }
      if (transaction.vendorId) {
        transaction.vendor = transaction.vendorId;
        delete transaction.vendorId;
      }

      // Convert numeric fields
      if (transaction.amount) transaction.amount = Number(transaction.amount);
      if (transaction.quantity)
        transaction.quantity = Number(transaction.quantity);

      // Remove empty or null fields
      Object.keys(transaction).forEach((key) => {
        if (transaction[key] === "" || transaction[key] === null)
          delete transaction[key];
      });
      delete transaction._id;

      //  Handle proof file upload
      if (transaction.proof && transaction.proof instanceof File) {
        const file = transaction.proof;
        const { uploadUrl, url } = await generateUploadURL(
          file.name,
          file.type
        );

        // Upload file to S3
        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        // Set proofs as an array of objects (required by Mongoose)
        transaction.proofs = [
          {
            fileUrl: url,
            fileType: file.type.includes("image") ? "image" : "pdf",
          },
        ];

        // Remove the raw file object
        delete transaction.proof;

        // console.log(" Uploaded Proof:", transaction.proofs);
      }

      // console.log(
      //   "✅ Final Transaction Payload:",
      //   JSON.stringify(transaction, null, 2)
      // );

      // Create or update transaction
      let res;
      if (editData?._id) {
        res = await updateTransaction(editData._id, transaction);
        toast.success(`${uiType} transaction updated successfully!`);
      } else {
        res = await createTransaction(transaction);
        toast.success(`${uiType} transaction created successfully!`);
      }

      onSubmit(res, !!editData);
      onClose();
    } catch (err) {
      // console.error(
      //   " Transaction Error:",
      //   err.response?.data
      //     ? JSON.stringify(err.response.data, null, 2)
      //     : err.message
      // );
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // const handleSave = async () => {
  //   try {
  //     setLoading(true);

  //     const uiCategory = typeCategoryMap[uiType] || "Other";
  //     const normalizedType = normalizeTransactionType(uiType);
  //     const backendCategory = backendCategoryMap[uiCategory] || "Other";

  //     const transaction = {
  //       ...formData,
  //       projectId,
  //       architectId,
  //       category: backendCategory,
  //       transactionType: normalizedType,
  //     };

  //     if (transaction.partyId) {
  //       transaction.party = transaction.partyId;
  //       delete transaction.partyId;
  //     }
  //     if (transaction.vendorId) {
  //       transaction.vendor = transaction.vendorId;
  //       delete transaction.vendorId;
  //     }

  //     if (transaction.amount) transaction.amount = Number(transaction.amount);
  //     if (transaction.quantity)
  //       transaction.quantity = Number(transaction.quantity);

  //     Object.keys(transaction).forEach((key) => {
  //       if (transaction[key] === "" || transaction[key] === null)
  //         delete transaction[key];
  //     });
  //     delete transaction._id;

  //     // ✅ If proof exists, upload to S3 first
  //     if (transaction.proof && transaction.proof instanceof File) {
  //       const file = transaction.proof;
  //       const { uploadUrl, url } = await generateUploadURL(file.name, file.type);

  //       // Upload file to S3
  //       await fetch(uploadUrl, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": file.type,
  //         },
  //         body: file,
  //       });

  //       // Add file URL to transaction proofs
  //       transaction.proofs = [url];

  //       // Remove the file object from transaction
  //       delete transaction.proof;
  //     }

  //     console.log("✅ Final Transaction Payload:", transaction);

  //     let res;
  //     if (editData?._id) {
  //       res = await updateTransaction(editData._id, transaction);
  //       toast.success(`${uiType} transaction updated successfully!`);
  //     } else {
  //       res = await createTransaction(transaction);
  //       toast.success(`${uiType} transaction created successfully!`);
  //     }

  //     onSubmit(res, !!editData);
  //     onClose();
  //   } catch (err) {
  //     console.error("❌ Transaction Error:", err.response?.data || err.message);
  //     toast.error(err.response?.data?.message || "Something went wrong!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const isValid = fields.every((f) => {
    if (f === "proof" || f === "notes") return true;
    if (f === "amount" || f === "quantity")
      return formData[f] && Number(formData[f]) > 0;
    if (f === "party") return !!formData.partyId;
    if (f === "vendor") return !!formData.vendorId;
    return !!formData[f];
  });

  const buttonColor = typeColorMap[uiType] || "gray";

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                {editData ? `Edit ${uiType}` : uiType}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field}>
                  {renderField(
                    field,
                    formData[
                      field +
                        (field === "party" || field === "vendor" ? "Id" : "")
                    ] || "",
                    handleChange,
                    vendors,
                    parties
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outlined" onClick={onClose} color="gray">
                Cancel
              </Button>
              <Button
                variant="custom"
                color={isValid ? buttonColor : "gray"}
                disabled={!isValid || loading}
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
                {loading ? "Saving..." : editData ? "Update" : "Save"}
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
// import {
//   typeColorMap,
//   typeCategoryMap,
//   fieldConfig,
//   normalizeTransactionType,
// } from "./allConfigs";
// import { useAuth } from "../../../../context/AuthContext";

// // ----------------- renderField ----------------- //
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
//           name="partyId"
//           value={value}
//           onChange={(e) => onChange("partyId", e.target.value)}
//           options={parties.map((p) => ({ value: p._id, label: p.name }))}
//         />
//       );
//     case "vendor":
//       return (
//         <DropDown
//           label="Vendor"
//           name="vendorId"
//           value={value}
//           onChange={(e) => onChange("vendorId", e.target.value)}
//           options={vendors.map((v) => ({ value: v._id, label: v.name }))}
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
// function TransactionModal({
//   isOpen,
//   onClose,
//   type,
//   onSubmit,
//   editData,
//   projectId,
// }) {
//   const { user } = useAuth();
//   const architectId = user?._id;

//   // ✅ Convert backend type (MaterialPurchase) → UI type (Material Purchase)
//   const uiType =
//     Object.keys(fieldConfig).find((key) => key.replace(/\s+/g, "") === type) ||
//     type;

//   const fields = fieldConfig[uiType] || [];
//   const [formData, setFormData] = useState({});
//   const [vendors, setVendors] = useState([]);
//   const [parties, setParties] = useState([]);

//   useEffect(() => {
//     if (editData) {
//       // Map backend keys to formData keys for dropdowns
//       const mapped = {
//         ...editData,
//         partyId: editData.party || "",
//         vendorId: editData.vendor || "",
//       };
//       setFormData(mapped);
//     } else {
//       setFormData({});
//     }
//   }, [editData, type]);

//   useEffect(() => {
//     fetchVendors()
//       .then(setVendors)
//       .catch(() => setVendors([]));
//     if (projectId) {
//       fetchPartyByProject(projectId)
//         .then(setParties)
//         .catch(() => setParties([]));
//     }
//   }, [projectId]);

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const backendCategoryMap = {
//     Invoice: "Sales",
//     Expense: "Expense",
//     Adjustment: "Expense",
//     Transfer: "MyAccount",
//   };

//   const handleSave = async () => {
//     try {
//       const uiCategory = typeCategoryMap[uiType] || "Other";
//       const normalizedType = normalizeTransactionType(uiType);
//       const backendCategory = backendCategoryMap[uiCategory] || "Other";

//       const transaction = {
//         ...formData,
//         projectId,
//         architectId,
//         category: backendCategory,
//         transactionType: normalizedType,
//       };

//       // Map party/vendor IDs
//       if (transaction.partyId) {
//         transaction.party = transaction.partyId;
//         delete transaction.partyId;
//       }
//       if (transaction.vendorId) {
//         transaction.vendor = transaction.vendorId;
//         delete transaction.vendorId;
//       }

//       // Convert numbers
//       if (transaction.amount) transaction.amount = Number(transaction.amount);
//       if (transaction.quantity)
//         transaction.quantity = Number(transaction.quantity);

//       // Remove empty fields & _id
//       Object.keys(transaction).forEach((key) => {
//         if (transaction[key] === "" || transaction[key] === null)
//           delete transaction[key];
//       });
//       delete transaction._id;

//       // Prepare payload
//       let payload;
//       let config = {};

//       if (transaction.proof && transaction.proof instanceof File) {
//         // Build FormData for file upload
//         const formDataObj = new FormData();
//         Object.keys(transaction).forEach((key) => {
//           formDataObj.append(key, transaction[key]);
//         });
//         payload = formDataObj;
//         config = { headers: { "Content-Type": "multipart/form-data" } };
//       } else {
//         // Send JSON if no file
//         payload = transaction;
//       }

//       // ✅ Add console.log to debug payload
//       // ✅ Add detailed console log
//       if (payload instanceof FormData) {
//         console.log("📦 Final Payload (FormData):");
//         for (let [key, value] of payload.entries()) {
//           console.log(`${key}:`, value);
//         }
//       } else {
//         console.log("📦 Final Payload (JSON):", payload);
//       }

//       let res;
//       if (editData?._id) {
//         // Update Transaction
//         res = await updateTransaction(editData._id, payload, config);
//         toast.success(`${uiType} transaction updated successfully!`);
//       } else {
//         // Create Transaction
//         res = await createTransaction(payload, config);
//         toast.success(`${uiType} transaction created successfully!`);
//       }

//       onSubmit(res, !!editData);
//       onClose();
//     } catch (err) {
//       console.error(" Transaction Error:", err.response?.data || err.message);
//       toast.error(err.response?.data?.message || "Something went wrong!");
//     }
//   };

//   //   const handleSave = async () => {
//   //   try {
//   //     const uiCategory = typeCategoryMap[uiType] || "Other";
//   //     const normalizedType = normalizeTransactionType(uiType);
//   //     const backendCategory = backendCategoryMap[uiCategory] || "Other";

//   //     const transaction = {
//   //       ...formData,
//   //       projectId,
//   //       architectId,
//   //       category: backendCategory,
//   //       transactionType: normalizedType,
//   //     };

//   //     // ✅ Map party/vendor IDs
//   //     if (transaction.partyId) {
//   //       transaction.party = transaction.partyId;
//   //       delete transaction.partyId;
//   //     }
//   //     if (transaction.vendorId) {
//   //       transaction.vendor = transaction.vendorId;
//   //       delete transaction.vendorId;
//   //     }

//   //     // ✅ Convert numbers
//   //     if (transaction.amount) transaction.amount = Number(transaction.amount);
//   //     if (transaction.quantity) transaction.quantity = Number(transaction.quantity);

//   //     // ✅ Remove empty fields & _id
//   //     Object.keys(transaction).forEach(
//   //       (key) => {
//   //         if (transaction[key] === "" || transaction[key] === null) delete transaction[key];
//   //       }
//   //     );
//   //     delete transaction._id;

//   //     let payload = transaction;
//   //     let config = {};
//   //     if (transaction.proof) {
//   //       const formDataObj = new FormData();
//   //       for (let key in transaction) {
//   //         formDataObj.append(key, transaction[key]);
//   //       }
//   //       payload = formDataObj;
//   //       config = { headers: { "Content-Type": "multipart/form-data" } };
//   //     }

//   //     let res;
//   //     if (editData?._id) {
//   //       // ✅ Call Update API
//   //       res = await updateTransaction(editData._id, payload, config);
//   //       toast.success(`${uiType} transaction updated successfully!`);
//   //     } else {
//   //       // ✅ Call Create API
//   //       res = await createTransaction(payload, config);
//   //       toast.success(`${uiType} transaction created successfully!`);
//   //     }

//   //     onSubmit(res, !!editData);
//   //     onClose();
//   //   } catch (err) {
//   //     console.error("❌ Transaction Error:", err.response?.data || err.message);
//   //     toast.error(err.response?.data?.message || "Something went wrong!");
//   //   }
//   // };

//   // ----------------- validation for Save button ----------------- //
//   const isValid = fields.every((f) => {
//     if (f === "proof" || f === "notes") return true;
//     if (f === "amount" || f === "quantity")
//       return formData[f] && Number(formData[f]) > 0;
//     if (f === "party") return !!formData.partyId;
//     if (f === "vendor") return !!formData.vendorId;
//     return !!formData[f];
//   });

//   const buttonColor = typeColorMap[uiType] || "gray";

//   return (
//     <Transition show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={onClose}>
//         <div className="fixed inset-0 bg-black/40" />
//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-4">
//               <Dialog.Title className="text-lg font-semibold text-gray-900">
//                 {editData ? `Edit ${uiType}` : uiType}
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
//                   {renderField(
//                     field,
//                     formData[
//                       field +
//                         (field === "party" || field === "vendor" ? "Id" : "")
//                     ] || "",
//                     handleChange,
//                     vendors,
//                     parties
//                   )}
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
