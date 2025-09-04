import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { FiEdit, FiDownload, FiUpload, FiX, FiSave, FiFile } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import { updateTransaction, deleteTransaction } from "../../../services/transactionServices";
import { generateUploadURL } from "../../../services/overViewServices";

export default function TransactionModal({ open, onClose, transaction, onTransactionDeleted }) {
  const fileInputRef = useRef(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [docUrls, setDocUrls] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);

  const [editableData, setEditableData] = useState({
    name: "",
    detail: "",
    notes: "",
    amount: "",
    location: "",
    date: "",
    proofs: [],
  });

  // normalize proofs from backend
  useEffect(() => {
    if (transaction) {
      const normalizedProofs = (transaction.proofs || []).map((p) =>
        typeof p === "string" ? p : p.fileUrl || p.url
      );

      setEditableData({
        name: transaction.party?.name || "",
        detail: transaction.detail || "",
        notes: transaction.notes || "",
        amount: transaction.amount || "",
        location: transaction.projectId?.location || "",
        date: transaction.date ? new Date(transaction.date).toISOString().slice(0, 16) : "",
        proofs: normalizedProofs,
      });
      setUploadedDocs(normalizedProofs);
    }
  }, [transaction]);

  // generate object URLs for new uploads
  useEffect(() => {
    const urls = uploadedDocs.map((file) => {
      if (typeof file === "string") return file;
      if (file instanceof Blob) return URL.createObjectURL(file);
      return "";
    });

    setDocUrls(urls);

    return () => {
      urls.forEach((url, idx) => {
        if (uploadedDocs[idx] instanceof Blob) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [uploadedDocs]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const supported = files.filter((file) =>
      ["image/png", "image/jpeg", "application/pdf"].includes(file.type)
    );

    if (supported.length) {
      setUploadedDocs((prev) => [...prev, ...supported]);
      setEditableData((prev) => ({
        ...prev,
        proofs: [...(prev.proofs || []), ...supported],
      }));
      toast.success("Files added for upload");
    } else {
      toast.error("Unsupported file type");
    }
  };

  const handleDownloadTransaction = () => {
    const doc = new jsPDF();
    const rawAmount = editableData.amount || "";
    const parsedAmount = parseFloat(rawAmount.toString().replace(/[^\d.-]/g, ""));
    const formattedAmount = isNaN(parsedAmount)
      ? "Invalid Amount"
      : parsedAmount.toLocaleString("en-IN");

    const content = `
Transaction Details

Type: ${transaction.type || "-"}
Party: ${editableData.name || "-"}
Detail: ${editableData.detail || "-"}
Notes: ${editableData.notes || "-"}
Amount: ₹ ${formattedAmount}
Location: ${editableData.location || "-"}
Date: ${editableData.date ? new Date(editableData.date).toLocaleString("en-GB") : "-"}
`;

    doc.setFontSize(12);
    doc.text(content, 10, 20);
    doc.save(`transaction_${editableData.name || "data"}.pdf`);
    toast.success("Transaction PDF downloaded");
  };

  const handleSave = async () => {
    try {
      // Upload new files to S3 first
      const uploadedProofs = [];
      for (const file of editableData.proofs) {
        if (file instanceof File) {
          const { uploadUrl, url } = await generateUploadURL(file.name, file.type);

          await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });

          uploadedProofs.push({
            fileUrl: url,
            fileType: file.type.includes("image") ? "image" : "pdf",
          });
        } else {
          // keep existing proofs as is
          uploadedProofs.push({
            fileUrl: file,
            fileType: file?.toLowerCase().endsWith(".pdf") ? "pdf" : "image",
          });
        }
      }

      const updatedTransaction = {
        ...transaction,
        ...editableData,
        proofs: uploadedProofs,
      };

      await updateTransaction(transaction._id, updatedTransaction);
      toast.success("Transaction updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update transaction");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction._id);
      toast.success("Transaction deleted");
      onTransactionDeleted?.(transaction._id);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete transaction");
    }
  };

  if (!transaction) return null;

  const isPaymentIn = transaction?.type === "Payment In";

  return (
    <>
      {/* Main Transaction Modal */}
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="fixed inset-y-0 right-0 flex max-w-full">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="w-screen max-w-md bg-white shadow-xl overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b-4 border-red-600">
                  <div>
                    <Dialog.Title className="text-lg font-semibold text-red-600">
                      Transaction Details
                    </Dialog.Title>
                    <p className="text-xs text-gray-500 mt-1">{transaction.type}</p>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 text-xl">
                    {isEditing ? (
                      <FiSave
                        className="cursor-pointer hover:text-red-600"
                        onClick={handleSave}
                      />
                    ) : (
                      <FiEdit
                        className="cursor-pointer hover:text-red-600"
                        onClick={() => setIsEditing(true)}
                      />
                    )}
                    <FiDownload
                      className="cursor-pointer hover:text-red-600"
                      onClick={handleDownloadTransaction}
                    />
                    <MdDelete
                      className="cursor-pointer hover:text-red-600"
                      onClick={handleDelete}
                    />
                    <FiX
                      className="ml-2 text-lg cursor-pointer hover:text-red-600"
                      onClick={onClose}
                    />
                  </div>
                </div>

                <div className="p-6 space-y-4 text-sm">
                  {/* Party Section */}
                  <div>
                    <p className="text-xs text-gray-500">Party</p>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={editableData.name}
                          onChange={(e) =>
                            setEditableData({ ...editableData, name: e.target.value })
                          }
                          className="w-full border rounded p-1 text-sm"
                        />
                        <input
                          type="text"
                          value={editableData.detail}
                          onChange={(e) =>
                            setEditableData({ ...editableData, detail: e.target.value })
                          }
                          className="w-full border rounded p-1 text-sm mt-1"
                        />
                      </>
                    ) : (
                      <>
                        <p className="font-semibold">{editableData.name || "-"}</p>
                        <p className="text-gray-500">{editableData.detail || "-"}</p>
                      </>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                      Notes: {editableData.notes || "-"}
                    </p>
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editableData.amount}
                        onChange={(e) =>
                          setEditableData({ ...editableData, amount: e.target.value })
                        }
                        className="w-full border rounded p-1 text-sm"
                      />
                    ) : (
                      <p
                        className={`text-xl font-bold ${
                          isPaymentIn ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        ₹{" "}
                        {Number(
                          editableData.amount.toString().replace(/[^\d.-]/g, "")
                        ).toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editableData.location}
                        onChange={(e) =>
                          setEditableData({ ...editableData, location: e.target.value })
                        }
                        className="w-full border rounded p-1 text-sm"
                      />
                    ) : (
                      <p className="font-medium text-gray-800">
                        {editableData.location || "-"}
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-xs text-gray-500">Date & Time</p>
                    {isEditing ? (
                      <input
                        type="datetime-local"
                        value={editableData.date}
                        onChange={(e) =>
                          setEditableData({ ...editableData, date: e.target.value })
                        }
                        className="w-full border rounded p-1 text-sm"
                      />
                    ) : (
                      <p className="text-gray-700">
                        {editableData.date
                          ? new Date(editableData.date).toLocaleString("en-GB")
                          : "-"}
                      </p>
                    )}
                  </div>

                  {/* Upload Section */}
                  {isEditing && (
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-gray-700">
                          Supporting Documents
                        </p>
                        {uploadedDocs.length > 0 && (
                          <button
                            onClick={() => setShowDocsModal(true)}
                            className="flex items-center gap-1 text-sm px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                          >
                            <FiFile size={16} /> View Docs
                          </button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => fileInputRef.current.click()}
                          className="flex items-center gap-1 text-sm px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          <FiUpload size={16} />
                          Upload
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          multiple
                          accept=".pdf,.png,.jpg,.jpeg"
                          className="hidden"
                        />
                      </div>

                      {/* List uploaded file names */}
                      {uploadedDocs.length > 0 && (
                        <ul className="mt-2 text-sm text-gray-700 space-y-1">
                          {uploadedDocs.map((file, idx) => {
                            const fileName =
                              file?.name ||
                              (typeof file === "string"
                                ? file.split("/").pop()
                                : "Document");
                            return (
                              <li key={idx} className="truncate">
                                {fileName}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Docs Modal */}
      <Transition show={showDocsModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowDocsModal(false)}
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-semibold">
                  Uploaded Documents
                </Dialog.Title>
                <FiX
                  className="cursor-pointer text-gray-600 hover:text-red-600"
                  onClick={() => setShowDocsModal(false)}
                />
              </div>

              {uploadedDocs.length > 0 ? (
                <ul className="space-y-4 text-sm text-gray-700">
                  {uploadedDocs.map((file, idx) => {
                    const url = docUrls[idx];
                    const fileName =
                      file?.name ||
                      (typeof file === "string" ? file.split("/").pop() : "Document");

                    return (
                      <li
                        key={idx}
                        className="flex flex-col gap-2 border p-3 rounded relative"
                      >
                        <span className="font-medium truncate">{fileName}</span>

                        {/* Safe Preview */}
                        {url && (url.toLowerCase().endsWith(".pdf") ||
                          (file instanceof Blob &&
                            file.type === "application/pdf")) ? (
                          <iframe
                            src={url}
                            title={fileName}
                            className="w-full h-64 border rounded"
                          />
                        ) : url ? (
                          <img
                            src={url}
                            alt={fileName}
                            className="max-h-64 object-contain rounded border"
                          />
                        ) : (
                          <p className="text-gray-500 text-sm">
                            Preview not available
                          </p>
                        )}

                        {/* Delete button */}
                        <button
                          onClick={() => {
                            setUploadedDocs((prev) =>
                              prev.filter((_, i) => i !== idx)
                            );
                            setEditableData((prev) => ({
                              ...prev,
                              proofs: prev.proofs.filter((_, i) => i !== idx),
                            }));
                            toast.info("Document removed");
                          }}
                          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                        >
                          <MdDelete size={18} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No documents uploaded</p>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
} 
// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment, useEffect, useRef, useState } from "react";
// import { FiEdit, FiDownload, FiUpload, FiX, FiSave, FiFile } from "react-icons/fi";
// import { MdDelete } from "react-icons/md";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import jsPDF from "jspdf";
// import { updateTransaction, deleteTransaction } from "../../../services/transactionServices";

// export default function TransactionModal({ open, onClose, transaction, onTransactionDeleted }) {
//   const fileInputRef = useRef(null);
//   const [uploadedDocs, setUploadedDocs] = useState([]);
//   const [docUrls, setDocUrls] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [showDocsModal, setShowDocsModal] = useState(false);

//   const [editableData, setEditableData] = useState({
//     name: "",
//     detail: "",
//     notes: "",
//     amount: "",
//     location: "",
//     date: "",
//     proofs: [],
//   });

//   // normalize proofs from backend
//   useEffect(() => {
//     if (transaction) {
//       const normalizedProofs = (transaction.proofs || []).map((p) =>
//         typeof p === "string" ? p : p.url
//       );

//       setEditableData({
//         name: transaction.party?.name || "",
//         detail: transaction.detail || "",
//         notes: transaction.notes || "",
//         amount: transaction.amount || "",
//         location: transaction.projectId?.location || "",
//         date: transaction.date ? new Date(transaction.date).toISOString().slice(0, 16) : "",
//         proofs: normalizedProofs,
//       });
//       setUploadedDocs(normalizedProofs);
//     }
//   }, [transaction]);

//   // generate object URLs for new uploads
//   useEffect(() => {
//     const urls = uploadedDocs.map((file) => {
//       if (typeof file === "string") return file;
//       if (file instanceof Blob) return URL.createObjectURL(file);
//       return "";
//     });

//     setDocUrls(urls);

//     return () => {
//       urls.forEach((url, idx) => {
//         if (uploadedDocs[idx] instanceof Blob) {
//           URL.revokeObjectURL(url);
//         }
//       });
//     };
//   }, [uploadedDocs]);

//   const handleFileSelect = (e) => {
//     const files = Array.from(e.target.files || []);
//     const supported = files.filter((file) =>
//       ["image/png", "image/jpeg", "application/pdf"].includes(file.type)
//     );

//     if (supported.length) {
//       setUploadedDocs((prev) => [...prev, ...supported]);
//       setEditableData((prev) => ({
//         ...prev,
//         proofs: [...(prev.proofs || []), ...supported],
//       }));
//       toast.success("Files added for upload");
//     } else {
//       toast.error("Unsupported file type");
//     }
//   };

//   const handleDownloadTransaction = () => {
//     const doc = new jsPDF();
//     const rawAmount = editableData.amount || "";
//     const parsedAmount = parseFloat(rawAmount.toString().replace(/[^\d.-]/g, ""));
//     const formattedAmount = isNaN(parsedAmount) ? "Invalid Amount" : parsedAmount.toLocaleString("en-IN");

//     const content = `
// Transaction Details

// Type: ${transaction.type || "-"}
// Party: ${editableData.name || "-"}
// Detail: ${editableData.detail || "-"}
// Notes: ${editableData.notes || "-"}
// Amount: ₹ ${formattedAmount}
// Location: ${editableData.location || "-"}
// Date: ${editableData.date ? new Date(editableData.date).toLocaleString("en-GB") : "-"}
// `;

//     doc.setFontSize(12);
//     doc.text(content, 10, 20);
//     doc.save(`transaction_${editableData.name || "data"}.pdf`);
//     toast.success("Transaction PDF downloaded");
//   };

//   const handleSave = async () => {
//     try {
//       const formData = new FormData();
//       Object.keys(editableData).forEach((key) => {
//         if (key === "proofs") {
//           editableData.proofs.forEach((file) => {
//             if (file instanceof File) {
//               formData.append("proofs", file);
//             } else {
//               formData.append("existingProofs", file);
//             }
//           });
//         } else {
//           formData.append(key, editableData[key]);
//         }
//       });

//       await updateTransaction(transaction._id, formData);
//       toast.success("Transaction updated successfully");
//       setIsEditing(false);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to update transaction");
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await deleteTransaction(transaction._id);
//       toast.success("Transaction deleted");
//       onTransactionDeleted?.(transaction._id);
//       onClose();
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to delete transaction");
//     }
//   };

//   if (!transaction) return null;

//   const isPaymentIn = transaction?.type === "Payment In";

//   return (
//     <>
//       <Transition show={open} as={Fragment}>
//         <Dialog as="div" className="relative z-50" onClose={onClose}>
//           <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
//           <div className="fixed inset-y-0 right-0 flex max-w-full">
//             <Transition.Child
//               as={Fragment}
//               enter="transform transition ease-in-out duration-300"
//               enterFrom="translate-x-full"
//               enterTo="translate-x-0"
//               leave="transform transition ease-in-out duration-300"
//               leaveFrom="translate-x-0"
//               leaveTo="translate-x-full"
//             >
//               <Dialog.Panel className="w-screen max-w-md bg-white shadow-xl overflow-y-auto">
//                 <div className="flex items-center justify-between p-4 border-b-4 border-red-600">
//                   <div>
//                     <Dialog.Title className="text-lg font-semibold text-red-600">
//                       Transaction Details
//                     </Dialog.Title>
//                     <p className="text-xs text-gray-500 mt-1">{transaction.type}</p>
//                   </div>
//                   <div className="flex items-center gap-3 text-gray-600 text-xl">
//                     {isEditing ? (
//                       <FiSave className="cursor-pointer hover:text-red-600" onClick={handleSave} />
//                     ) : (
//                       <FiEdit className="cursor-pointer hover:text-red-600" onClick={() => setIsEditing(true)} />
//                     )}
//                     <FiDownload className="cursor-pointer hover:text-red-600" onClick={handleDownloadTransaction} />
//                     <MdDelete className="cursor-pointer hover:text-red-600" onClick={handleDelete} />
//                     <FiX className="ml-2 text-lg cursor-pointer hover:text-red-600" onClick={onClose} />
//                   </div>
//                 </div>

//                 <div className="p-6 space-y-4 text-sm">
//                   {/* Party Section */}
//                   <div>
//                     <p className="text-xs text-gray-500">Party</p>
//                     {isEditing ? (
//                       <>
//                         <input
//                           type="text"
//                           value={editableData.name}
//                           onChange={(e) => setEditableData({ ...editableData, name: e.target.value })}
//                           className="w-full border rounded p-1 text-sm"
//                         />
//                         <input
//                           type="text"
//                           value={editableData.detail}
//                           onChange={(e) => setEditableData({ ...editableData, detail: e.target.value })}
//                           className="w-full border rounded p-1 text-sm mt-1"
//                         />
//                       </>
//                     ) : (
//                       <>
//                         <p className="font-semibold">{editableData.name || "-"}</p>
//                         <p className="text-gray-500">{editableData.detail || "-"}</p>
//                       </>
//                     )}
//                     <p className="text-gray-500 text-sm mt-1">Notes: {editableData.notes || "-"}</p>
//                   </div>

//                   {/* Amount */}
//                   <div>
//                     <p className="text-xs text-gray-500">Amount</p>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={editableData.amount}
//                         onChange={(e) => setEditableData({ ...editableData, amount: e.target.value })}
//                         className="w-full border rounded p-1 text-sm"
//                       />
//                     ) : (
//                       <p className={`text-xl font-bold ${isPaymentIn ? "text-green-600" : "text-red-600"}`}>
//                         ₹ {Number(editableData.amount.toString().replace(/[^\d.-]/g, "")).toLocaleString("en-IN")}
//                       </p>
//                     )}
//                   </div>

//                   {/* Location */}
//                   <div>
//                     <p className="text-xs text-gray-500">Location</p>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={editableData.location}
//                         onChange={(e) => setEditableData({ ...editableData, location: e.target.value })}
//                         className="w-full border rounded p-1 text-sm"
//                       />
//                     ) : (
//                       <p className="font-medium text-gray-800">{editableData.location || "-"}</p>
//                     )}
//                   </div>

//                   {/* Date */}
//                   <div>
//                     <p className="text-xs text-gray-500">Date & Time</p>
//                     {isEditing ? (
//                       <input
//                         type="datetime-local"
//                         value={editableData.date}
//                         onChange={(e) => setEditableData({ ...editableData, date: e.target.value })}
//                         className="w-full border rounded p-1 text-sm"
//                       />
//                     ) : (
//                       <p className="text-gray-700">
//                         {editableData.date ? new Date(editableData.date).toLocaleString("en-GB") : "-"}
//                       </p>
//                     )}
//                   </div>

//                   {/* Upload Section */}
//                   {isEditing && (
//                     <div className="pt-4 border-t">
//                       <div className="flex justify-between items-center mb-2">
//                         <p className="text-sm font-medium text-gray-700">Supporting Documents</p>
//                         {uploadedDocs.length > 0 && (
//                           <button
//                             onClick={() => setShowDocsModal(true)}
//                             className="flex items-center gap-1 text-sm px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
//                           >
//                             <FiFile size={16} /> View Docs
//                           </button>
//                         )}
//                       </div>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => fileInputRef.current.click()}
//                           className="flex items-center gap-1 text-sm px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
//                         >
//                           <FiUpload size={16} />
//                           Upload
//                         </button>
//                         <input
//                           type="file"
//                           ref={fileInputRef}
//                           onChange={handleFileSelect}
//                           multiple
//                           accept=".pdf,.png,.jpg,.jpeg"
//                           className="hidden"
//                         />
//                       </div>

//                       {/* List uploaded file names */}
//                       {uploadedDocs.length > 0 && (
//                         <ul className="mt-2 text-sm text-gray-700 space-y-1">
//                           {uploadedDocs.map((file, idx) => {
//                             const fileName =
//                               file.name ||
//                               (typeof file === "string" ? file.split("/").pop() : "Document");
//                             return <li key={idx} className="truncate">{fileName}</li>;
//                           })}
//                         </ul>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </Dialog>
//       </Transition>

//       {/* Docs Modal */}
//       <Transition show={showDocsModal} as={Fragment}>
//         <Dialog as="div" className="relative z-50" onClose={() => setShowDocsModal(false)}>
//           <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
//             <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <Dialog.Title className="text-lg font-semibold">Uploaded Documents</Dialog.Title>
//                 <FiX
//                   className="cursor-pointer text-gray-600 hover:text-red-600"
//                   onClick={() => setShowDocsModal(false)}
//                 />
//               </div>

//               {uploadedDocs.length > 0 ? (
//                 <ul className="space-y-4 text-sm text-gray-700">
//                   {uploadedDocs.map((file, idx) => {
//                     const url = docUrls[idx];
//                     const fileName =
//                       file.name || (typeof file === "string" ? file.split("/").pop() : "Document");

//                     return (
//                       <li
//                         key={idx}
//                         className="flex flex-col gap-2 border p-3 rounded relative"
//                       >
//                         <span className="font-medium truncate">{fileName}</span>

//                         {/* Preview */}
//                         {url.endsWith(".pdf") ||
//                         (file instanceof Blob && file.type === "application/pdf") ? (
//                           <iframe
//                             src={url}
//                             title={fileName}
//                             className="w-full h-64 border rounded"
//                           />
//                         ) : (
//                           <img
//                             src={url}
//                             alt={fileName}
//                             className="max-h-64 object-contain rounded border"
//                           />
//                         )}

//                         {/* Delete button */}
//                         <button
//                           onClick={() => {
//                             setUploadedDocs((prev) => prev.filter((_, i) => i !== idx));
//                             setEditableData((prev) => ({
//                               ...prev,
//                               proofs: prev.proofs.filter((_, i) => i !== idx),
//                             }));
//                             toast.info("Document removed");
//                           }}
//                           className="absolute top-2 right-2 text-red-600 hover:text-red-800"
//                         >
//                           <MdDelete size={18} />
//                         </button>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               ) : (
//                 <p className="text-gray-500 text-sm">No documents uploaded</p>
//               )}
//             </Dialog.Panel>
//           </div>
//         </Dialog>
//       </Transition>
//     </>
//   );
// }

// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment, useEffect, useRef, useState } from "react";
// import { FiEdit, FiDownload, FiUpload, FiX, FiSave, FiFile } from "react-icons/fi";
// import { MdDelete } from "react-icons/md";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import jsPDF from "jspdf";
// import { updateTransaction, deleteTransaction } from "../../../services/transactionServices";

// export default function TransactionModal({ open, onClose, transaction, onTransactionDeleted }) {
//   const fileInputRef = useRef(null);
//   const [uploadedDocs, setUploadedDocs] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [showDocsModal, setShowDocsModal] = useState(false);

//   const [editableData, setEditableData] = useState({
//     name: "",
//     detail: "",
//     notes: "",
//     amount: "",
//     location: "",
//     date: "",
//     proofs: [],
//   });

//   useEffect(() => {
//     if (transaction) {
//       setEditableData({
//         name: transaction.party?.name || "",
//         detail: transaction.detail || "",
//         notes: transaction.notes || "",
//         amount: transaction.amount || "",
//         location: transaction.projectId?.location || "",
//         date: transaction.date ? new Date(transaction.date).toISOString().slice(0, 16) : "",
//         proofs: transaction.proofs || [],
//       });
//       setUploadedDocs(transaction.proofs || []);
//     }
//   }, [transaction]);

//   const handleFileSelect = (e) => {
//     const files = Array.from(e.target.files || []);
//     const supported = files.filter((file) =>
//       ["image/png", "image/jpeg", "application/pdf"].includes(file.type)
//     );

//     if (supported.length) {
//       setUploadedDocs((prev) => [...prev, ...supported]);
//       setEditableData((prev) => ({
//         ...prev,
//         proofs: [...(prev.proofs || []), ...supported],
//       }));
//       toast.success("Files added for upload");
//     } else {
//       toast.error("Unsupported file type");
//     }
//   };

//   const handleDownloadTransaction = () => {
//     const doc = new jsPDF();
//     const rawAmount = editableData.amount || "";
//     const parsedAmount = parseFloat(rawAmount.toString().replace(/[^\d.-]/g, ""));
//     const formattedAmount = isNaN(parsedAmount) ? "Invalid Amount" : parsedAmount.toLocaleString("en-IN");

//     const content = `
// Transaction Details

// Type: ${transaction.type || "-"}
// Party: ${editableData.name || "-"}
// Detail: ${editableData.detail || "-"}
// Notes: ${editableData.notes || "-"}
// Amount: ₹ ${formattedAmount}
// Location: ${editableData.location || "-"}
// Date: ${editableData.date ? new Date(editableData.date).toLocaleString("en-GB") : "-"}
// `;

//     doc.setFontSize(12);
//     doc.text(content, 10, 20);
//     doc.save(`transaction_${editableData.name || "data"}.pdf`);
//     toast.success("Transaction PDF downloaded");
//   };

//   const handleSave = async () => {
//     try {
//       // If files exist, use FormData
//       const formData = new FormData();
//       Object.keys(editableData).forEach((key) => {
//         if (key === "proofs") {
//           editableData.proofs.forEach((file) => {
//             if (file instanceof File) {
//               formData.append("proofs", file);
//             } else {
//               formData.append("existingProofs", file); // keep existing ones
//             }
//           });
//         } else {
//           formData.append(key, editableData[key]);
//         }
//       });

//       await updateTransaction(transaction._id, formData);
//       toast.success("Transaction updated successfully");
//       setIsEditing(false);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to update transaction");
//     }
//   };

//   const handleDelete = async () => {
//     if (window.confirm("Are you sure you want to delete this transaction?")) {
//       try {
//         await deleteTransaction(transaction._id);
//         toast.success("Transaction deleted");
//         onTransactionDeleted?.(transaction._id);
//         onClose();
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to delete transaction");
//       }
//     }
//   };

//   if (!transaction) return null;

//   const isPaymentIn = transaction?.type === "Payment In";

//   return (
//     <>
//       <Transition show={open} as={Fragment}>
//         <Dialog as="div" className="relative z-50" onClose={onClose}>
//           <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
//           <div className="fixed inset-y-0 right-0 flex max-w-full">
//             <Transition.Child
//               as={Fragment}
//               enter="transform transition ease-in-out duration-300"
//               enterFrom="translate-x-full"
//               enterTo="translate-x-0"
//               leave="transform transition ease-in-out duration-300"
//               leaveFrom="translate-x-0"
//               leaveTo="translate-x-full"
//             >
//               <Dialog.Panel className="w-screen max-w-md bg-white shadow-xl overflow-y-auto">
//                 <div className="flex items-center justify-between p-4 border-b-4 border-red-600">
//                   <div>
//                     <Dialog.Title className="text-lg font-semibold text-red-600">
//                       Transaction Details
//                     </Dialog.Title>
//                     <p className="text-xs text-gray-500 mt-1">{transaction.type}</p>
//                   </div>
//                   <div className="flex items-center gap-3 text-gray-600 text-xl">
//                     {isEditing ? (
//                       <FiSave className="cursor-pointer hover:text-red-600" onClick={handleSave} />
//                     ) : (
//                       <FiEdit className="cursor-pointer hover:text-red-600" onClick={() => setIsEditing(true)} />
//                     )}
//                     <FiDownload className="cursor-pointer hover:text-red-600" onClick={handleDownloadTransaction} />
//                     <MdDelete className="cursor-pointer hover:text-red-600" onClick={handleDelete} />
//                     <FiX className="ml-2 text-lg cursor-pointer hover:text-red-600" onClick={onClose} />
//                   </div>
//                 </div>

//                 <div className="p-6 space-y-4 text-sm">
//                   {/* Party Section */}
//                   <div>
//                     <p className="text-xs text-gray-500">Party</p>
//                     {isEditing ? (
//                       <>
//                         <input
//                           type="text"
//                           value={editableData.name}
//                           onChange={(e) => setEditableData({ ...editableData, name: e.target.value })}
//                           className="w-full border rounded p-1 text-sm"
//                         />
//                         <input
//                           type="text"
//                           value={editableData.detail}
//                           onChange={(e) => setEditableData({ ...editableData, detail: e.target.value })}
//                           className="w-full border rounded p-1 text-sm mt-1"
//                         />
//                       </>
//                     ) : (
//                       <>
//                         <p className="font-semibold">{editableData.name || "-"}</p>
//                         <p className="text-gray-500">{editableData.detail || "-"}</p>
//                       </>
//                     )}
//                     <p className="text-gray-500 text-sm mt-1">Notes: {editableData.notes || "-"}</p>
//                   </div>

//                   {/* Amount */}
//                   <div>
//                     <p className="text-xs text-gray-500">Amount</p>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={editableData.amount}
//                         onChange={(e) => setEditableData({ ...editableData, amount: e.target.value })}
//                         className="w-full border rounded p-1 text-sm"
//                       />
//                     ) : (
//                       <p className={`text-xl font-bold ${isPaymentIn ? "text-green-600" : "text-red-600"}`}>
//                         ₹ {Number(editableData.amount.toString().replace(/[^\d.-]/g, "")).toLocaleString("en-IN")}
//                       </p>
//                     )}
//                   </div>

//                   {/* Location */}
//                   <div>
//                     <p className="text-xs text-gray-500">Location</p>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={editableData.location}
//                         onChange={(e) => setEditableData({ ...editableData, location: e.target.value })}
//                         className="w-full border rounded p-1 text-sm"
//                       />
//                     ) : (
//                       <p className="font-medium text-gray-800">{editableData.location || "-"}</p>
//                     )}
//                   </div>

//                   {/* Date */}
//                   <div>
//                     <p className="text-xs text-gray-500">Date & Time</p>
//                     {isEditing ? (
//                       <input
//                         type="datetime-local"
//                         value={editableData.date}
//                         onChange={(e) => setEditableData({ ...editableData, date: e.target.value })}
//                         className="w-full border rounded p-1 text-sm"
//                       />
//                     ) : (
//                       <p className="text-gray-700">
//                         {editableData.date ? new Date(editableData.date).toLocaleString("en-GB") : "-"}
//                       </p>
//                     )}
//                   </div>

//                   {/* Upload Section */}
//                   {isEditing && (
//                     <div className="pt-4 border-t">
//                       <div className="flex justify-between items-center mb-2">
//                         <p className="text-sm font-medium text-gray-700">Supporting Documents</p>
//                         {uploadedDocs.length > 0 && (
//                           <button
//                             onClick={() => setShowDocsModal(true)}
//                             className="flex items-center gap-1 text-sm px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
//                           >
//                             <FiFile size={16} /> View Docs
//                           </button>
//                         )}
//                       </div>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => fileInputRef.current.click()}
//                           className="flex items-center gap-1 text-sm px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
//                         >
//                           <FiUpload size={16} />
//                           Upload
//                         </button>
//                         <input
//                           type="file"
//                           ref={fileInputRef}
//                           onChange={handleFileSelect}
//                           multiple
//                           accept=".pdf,.png,.jpg,.jpeg"
//                           className="hidden"
//                         />
//                       </div>

//                       {/* List uploaded file names */}
//                       {uploadedDocs.length > 0 && (
//                         <ul className="mt-2 text-sm text-gray-700 space-y-1">
//                           {uploadedDocs.map((file, idx) => (
//                             <li key={idx} className="truncate">
//                               {file.name || file}
//                             </li>
//                           ))}
//                         </ul>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </Dialog>
//       </Transition>

//       {/* Docs Modal */}
//       <Transition show={showDocsModal} as={Fragment}>
//         <Dialog as="div" className="relative z-50" onClose={() => setShowDocsModal(false)}>
//           <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
//             <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <Dialog.Title className="text-lg font-semibold">Uploaded Documents</Dialog.Title>
//                 <FiX
//                   className="cursor-pointer text-gray-600 hover:text-red-600"
//                   onClick={() => setShowDocsModal(false)}
//                 />
//               </div>

//               {uploadedDocs.length > 0 ? (
//                 <ul className="space-y-2 text-sm text-gray-700">
//                   {uploadedDocs.map((file, idx) => (
//                     <li
//                       key={idx}
//                       className="flex items-center justify-between border p-2 rounded"
//                     >
//                       <span className="truncate">{file.name || file}</span>
//                       <a
//                         href={typeof file === "string" ? file : URL.createObjectURL(file)}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 hover:underline text-xs"
//                       >
//                         Open
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-gray-500 text-sm">No documents uploaded</p>
//               )}
//             </Dialog.Panel>
//           </div>
//         </Dialog>
//       </Transition>
//     </>
//   );
// }