import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  FiEdit,
  FiDownload,
  FiMoreVertical,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";

export default function TransactionModal({ open, onClose, transaction }) {
  const fileInputRef = useRef(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editableData, setEditableData] = useState({
    name: "",
    detail: "",
    amount: "",
    site: "",
    date: "",
  });

  useEffect(() => {
    if (transaction) {
      setEditableData({
        name: transaction.name || "",
        detail: transaction.detail || "",
        amount: transaction.amount || "",
        site: transaction.site || "",
        date: transaction.date
          ? new Date(transaction.date).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [transaction]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    const supported = files.filter((file) =>
      ["image/png", "image/jpeg", "application/pdf"].includes(file.type)
    );

    if (supported.length) {
      setUploading(true);
      await new Promise((res) => setTimeout(res, 1000));
      setUploadedDocs((prev) => [...prev, ...supported]);
      setUploading(false);
      toast.success("Files uploaded successfully");
    } else {
      toast.error("Unsupported file type");
    }
  };

  const handleDownloadTransaction = () => {
    const doc = new jsPDF();

    const rawAmount = editableData.amount || "";
    const parsedAmount = parseFloat(
      rawAmount.toString().replace(/[^\d.-]/g, "")
    );

    const formattedAmount = isNaN(parsedAmount)
      ? "Invalid Amount"
      : parsedAmount.toLocaleString("en-IN");

    const content = `
Transaction Details

Type: ${transaction.type}
Name: ${editableData.name}
Detail: ${editableData.detail}
Amount: ₹ ${formattedAmount}
Site: ${editableData.site}
Date: ${new Date(editableData.date).toLocaleString("en-GB")}
`;

    doc.setFontSize(12);
    doc.text(content, 10, 20);
    doc.save(`transaction_${editableData.name || "data"}.pdf`);
    toast.success("Transaction PDF downloaded");
  };

  if (!transaction) return null;

  const isPaymentIn = transaction?.type === "Payment In";

  return (
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
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b-4 border-red-600">
                <div>
                  <Dialog.Title className="text-lg font-semibold text-red-600">
                    Transaction Details
                  </Dialog.Title>
                  <p className="text-xs text-gray-500 mt-1">
                    {transaction.type}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-xl">
                  <FiEdit
                    className="cursor-pointer hover:text-red-600"
                    onClick={() => setIsEditing((prev) => !prev)}
                  />
                  <FiDownload
                    className="cursor-pointer hover:text-red-600"
                    onClick={handleDownloadTransaction}
                  />
                  <FiMoreVertical className="cursor-pointer hover:text-red-600" />
                  <FiX
                    className="ml-2 text-lg cursor-pointer hover:text-red-600"
                    onClick={onClose}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 text-sm">
                {/* Party */}
                <div>
                  <p className="text-xs text-gray-500">Party</p>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={editableData.name}
                        onChange={(e) =>
                          setEditableData({
                            ...editableData,
                            name: e.target.value,
                          })
                        }
                        className="w-full border rounded p-1 text-sm"
                      />
                      <input
                        type="text"
                        value={editableData.detail}
                        onChange={(e) =>
                          setEditableData({
                            ...editableData,
                            detail: e.target.value,
                          })
                        }
                        className="w-full border rounded p-1 text-sm mt-1"
                      />
                    </>
                  ) : (
                    <>
                      <p className="font-semibold">{editableData.name}</p>
                      <p className="text-gray-500">{editableData.detail}</p>
                    </>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editableData.amount}
                      onChange={(e) =>
                        setEditableData({
                          ...editableData,
                          amount: e.target.value,
                        })
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

                {/* Site */}
                <div>
                  <p className="text-xs text-gray-500">Site</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editableData.site}
                      onChange={(e) =>
                        setEditableData({
                          ...editableData,
                          site: e.target.value,
                        })
                      }
                      className="w-full border rounded p-1 text-sm"
                    />
                  ) : (
                    <p className="font-medium text-gray-800">
                      {editableData.site}
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
                        setEditableData({
                          ...editableData,
                          date: e.target.value,
                        })
                      }
                      className="w-full border rounded p-1 text-sm"
                    />
                  ) : (
                    <p className="text-gray-700">
                      {new Date(editableData.date).toLocaleString("en-GB")}
                    </p>
                  )}
                </div>

                {/* Upload Section */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-medium text-gray-700">
                      Supporting Documents
                    </p>
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="flex items-center gap-1 text-sm px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                      disabled={uploading}
                    >
                      <FiUpload size={16} />
                      {uploading ? "Uploading..." : "Upload"}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                    />
                  </div>

                  {uploading ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <ClipLoader size={18} color="#dc2626" />
                      Uploading files...
                    </div>
                  ) : uploadedDocs.length > 0 ? (
                    <ul className="space-y-2">
                      {uploadedDocs.map((file, idx) => (
                        <li
                          key={idx}
                          className="border rounded px-3 py-2 text-sm flex justify-between items-center"
                        >
                          <span className="truncate w-40">{file.name}</span>
                          <div className="flex items-center gap-2">
                            <a
                              href={URL.createObjectURL(file)}
                              download={file.name}
                              className="text-gray-600 hover:text-red-600"
                              title="Download"
                            >
                              <FiDownload />
                            </a>
                            <FiEdit
                              className="text-gray-400"
                              title="Edit (via Edit button above)"
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-400">
                      No supporting documents found.
                    </p>
                  )}
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}


// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment, useEffect, useRef, useState } from "react";
// import {
//   FiEdit,
//   FiDownload,
//   FiMoreVertical,
//   FiUpload,
//   FiX,
// } from "react-icons/fi";
// import { ClipLoader } from "react-spinners";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import jsPDF from "jspdf";

// export default function TransactionModal({ open, onClose, transaction }) {
//   const fileInputRef = useRef(null);
//   const [uploadedDocs, setUploadedDocs] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   const [editableData, setEditableData] = useState({
//     name: "",
//     detail: "",
//     amount: "",
//     site: "",
//     date: "",
//   });

//   useEffect(() => {
//     if (transaction) {
//       setEditableData({
//         name: transaction.name || "",
//         detail: transaction.detail || "",
//         amount: transaction.amount || "",
//         site: transaction.site || "",
//         date: transaction.date
//           ? new Date(transaction.date).toISOString().slice(0, 16)
//           : "",
//       });
//     }
//   }, [transaction]);

//   const handleFileUpload = async (e) => {
//     const files = Array.from(e.target.files || []);
//     const supported = files.filter((file) =>
//       ["image/png", "image/jpeg", "application/pdf"].includes(file.type)
//     );

//     if (supported.length) {
//       setUploading(true);
//       await new Promise((res) => setTimeout(res, 1000));
//       setUploadedDocs((prev) => [...prev, ...supported]);
//       setUploading(false);
//       toast.success("Files uploaded successfully");
//     } else {
//       toast.error("Unsupported file type");
//     }
//   };
// const handleDownloadTransaction = () => {
//   const doc = new jsPDF();

//   // Sanitize and parse amount
//   const rawAmount = editableData.amount || "";
//   const parsedAmount = parseFloat(rawAmount.replace(/[^\d.-]/g, ""));

//   const content = `
// Transaction Details

// Type: ${transaction.type}
// Name: ${editableData.name}
// Detail: ${editableData.detail}
// Amount: ₹ ${isNaN(parsedAmount) ? "Invalid Amount" : parsedAmount.toLocaleString("en-IN")}
// Site: ${editableData.site}
// Date: ${new Date(editableData.date).toLocaleString("en-GB")}
//   `;

//   doc.setFontSize(12);
//   doc.text(content, 10, 20);
//   doc.save(`transaction_${editableData.name || "data"}.pdf`);
//   toast.success("Transaction PDF downloaded");
// };

//   if (!transaction) return null;

//   const isPaymentIn = transaction?.type === "Payment In";

//   return (
//     <Transition show={open} as={Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={onClose}>
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
//         <div className="fixed inset-y-0 right-0 flex max-w-full">
//           <Transition.Child
//             as={Fragment}
//             enter="transform transition ease-in-out duration-300"
//             enterFrom="translate-x-full"
//             enterTo="translate-x-0"
//             leave="transform transition ease-in-out duration-300"
//             leaveFrom="translate-x-0"
//             leaveTo="translate-x-full"
//           >
//             <Dialog.Panel className="w-screen max-w-md bg-white shadow-xl overflow-y-auto">
//               {/* Header */}
//               <div className="flex items-center justify-between p-4 border-b-4 border-red-600">
//                 <div>
//                   <Dialog.Title className="text-lg font-semibold text-red-600">
//                     Transaction Details
//                   </Dialog.Title>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {transaction.type}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-3 text-gray-600 text-xl">
//                   <FiEdit
//                     className="cursor-pointer hover:text-red-600"
//                     onClick={() => setIsEditing((prev) => !prev)}
//                   />
//                   <FiDownload
//                     className="cursor-pointer hover:text-red-600"
//                     onClick={handleDownloadTransaction}
//                   />
//                   <FiMoreVertical className="cursor-pointer hover:text-red-600" />
//                   <FiX
//                     className="ml-2 text-lg cursor-pointer hover:text-red-600"
//                     onClick={onClose}
//                   />
//                 </div>
//               </div>

//               {/* Content */}
//               <div className="p-6 space-y-4 text-sm">
//                 {/* Party */}
//                 <div>
//                   <p className="text-xs text-gray-500">Party</p>
//                   {isEditing ? (
//                     <>
//                       <input
//                         type="text"
//                         value={editableData.name}
//                         onChange={(e) =>
//                           setEditableData({
//                             ...editableData,
//                             name: e.target.value,
//                           })
//                         }
//                         className="w-full border rounded p-1 text-sm"
//                       />
//                       <input
//                         type="text"
//                         value={editableData.detail}
//                         onChange={(e) =>
//                           setEditableData({
//                             ...editableData,
//                             detail: e.target.value,
//                           })
//                         }
//                         className="w-full border rounded p-1 text-sm mt-1"
//                       />
//                     </>
//                   ) : (
//                     <>
//                       <p className="font-semibold">{editableData.name}</p>
//                       <p className="text-gray-500">{editableData.detail}</p>
//                     </>
//                   )}
//                 </div>

//                 {/* Amount */}
//                 <div>
//                   <p className="text-xs text-gray-500">Amount</p>
//                   {isEditing ? (
//                     <input
//                       type="number"
//                       value={editableData.amount}
//                       onChange={(e) =>
//                         setEditableData({
//                           ...editableData,
//                           amount: e.target.value,
//                         })
//                       }
//                       className="w-full border rounded p-1 text-sm"
//                     />
//                   ) : (
//                     <p
//                       className={`text-xl font-bold ${
//                         isPaymentIn ? "text-green-600" : "text-red-600"
//                       }`}
//                     >
//                       ₹{" "}
//                       {Number(
//                         editableData.amount.replace(/[^\d.-]/g, "")
//                       ).toLocaleString("en-IN")}
//                     </p>
//                   )}
//                 </div>

//                 {/* Site */}
//                 <div>
//                   <p className="text-xs text-gray-500">Site</p>
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       value={editableData.site}
//                       onChange={(e) =>
//                         setEditableData({
//                           ...editableData,
//                           site: e.target.value,
//                         })
//                       }
//                       className="w-full border rounded p-1 text-sm"
//                     />
//                   ) : (
//                     <p className="font-medium text-gray-800">
//                       {editableData.site}
//                     </p>
//                   )}
//                 </div>

//                 {/* Date */}
//                 <div>
//                   <p className="text-xs text-gray-500">Date & Time</p>
//                   {isEditing ? (
//                     <input
//                       type="datetime-local"
//                       value={editableData.date}
//                       onChange={(e) =>
//                         setEditableData({
//                           ...editableData,
//                           date: e.target.value,
//                         })
//                       }
//                       className="w-full border rounded p-1 text-sm"
//                     />
//                   ) : (
//                     <p className="text-gray-700">
//                       {new Date(editableData.date).toLocaleString("en-GB")}
//                     </p>
//                   )}
//                 </div>

//                 {/* Upload Section */}
//                 <div className="pt-4 border-t">
//                   <div className="flex justify-between items-center mb-3">
//                     <p className="text-sm font-medium text-gray-700">
//                       Supporting Documents
//                     </p>
//                     <button
//                       onClick={() => fileInputRef.current.click()}
//                       className="flex items-center gap-1 text-sm px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
//                       disabled={uploading}
//                     >
//                       <FiUpload size={16} />
//                       {uploading ? "Uploading..." : "Upload"}
//                     </button>
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       onChange={handleFileUpload}
//                       multiple
//                       accept=".pdf,.png,.jpg,.jpeg"
//                       className="hidden"
//                     />
//                   </div>

//                   {uploading ? (
//                     <div className="flex items-center gap-2 text-sm text-gray-500">
//                       <ClipLoader size={18} color="#dc2626" />
//                       Uploading files...
//                     </div>
//                   ) : uploadedDocs.length > 0 ? (
//                     <ul className="space-y-2">
//                       {uploadedDocs.map((file, idx) => (
//                         <li
//                           key={idx}
//                           className="border rounded px-3 py-2 text-sm flex justify-between items-center"
//                         >
//                           <span className="truncate w-40">{file.name}</span>
//                           <div className="flex items-center gap-2">
//                             <a
//                               href={URL.createObjectURL(file)}
//                               download={file.name}
//                               className="text-gray-600 hover:text-red-600"
//                               title="Download"
//                             >
//                               <FiDownload />
//                             </a>
//                             <FiEdit
//                               className="text-gray-400"
//                               title="Edit (via Edit button above)"
//                             />
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p className="text-xs text-gray-400">
//                       No supporting documents found.
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </Dialog.Panel>
//           </Transition.Child>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }
