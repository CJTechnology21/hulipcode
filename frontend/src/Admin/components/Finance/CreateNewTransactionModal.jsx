import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState, useEffect } from "react";
import { FiUpload, FiX, FiSave } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  createTransaction,
  updateTransaction,
} from "../../../services/transactionServices";
import { getAllParties } from "../../../services/partyServices";
import { fetchProjects } from "../../../services/projectServices";
import { useAuth } from "../../../context/AuthContext";

function CreateNewTransactionModal({ open, onClose, onCreate, transaction }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [parties, setParties] = useState([]);
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();

  const [newTransaction, setNewTransaction] = useState({
    _id: null,
    partyId: "",
    name: "",
    detail: "",
    amount: "",
    projectId: "",
    site: "",
    date: "",
    type: "PaymentIn",
    status: "pending",
    mode: "Cash",
    category: "Payment",
    vendor: "",
  });

  useEffect(() => {
    const fetchPartiesData = async () => {
      try {
        const data = await getAllParties();
        setParties(data.parties || data);
      } catch (err) {
        toast.error("Failed to load parties ❌");
      }
    };
    fetchPartiesData();
  }, []);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data.projects || data);
      } catch (err) {
        toast.error("Failed to load projects ❌");
      }
    };
    fetchProjectsData();
  }, []);

  useEffect(() => {
    if (transaction) {
      setNewTransaction({
        _id: transaction._id,
        partyId: transaction.party?._id || "",
        name: transaction.party?.name || transaction.name || "",
        detail: transaction.detail || "",
        amount: transaction.amount || "",
        projectId: transaction.projectId?._id || "",
        site: transaction.projectId?.name || transaction.site || "",
        date: transaction.date
          ? new Date(transaction.date).toISOString().slice(0, 16)
          : "",
        type: transaction.transactionType || "PaymentIn",
        status: transaction.status || "pending",
        mode: transaction.mode || "Cash",
        category: transaction.category || "Payment",
        vendor: transaction.vendor || "",
      });
    }
  }, [transaction]);

  const handleSubmit = async () => {
    // Only required fields validation
    if (!newTransaction.projectId || !user?._id || !newTransaction.amount) {
      toast.error("Project, Amount, and Architect are required.");
      return;
    }

    const formData = new FormData();
    formData.append("projectId", newTransaction.projectId);
    formData.append("architectId", user._id);
    formData.append("category", newTransaction.category);
    formData.append("transactionType", newTransaction.type);
    if (newTransaction.partyId) formData.append("party", newTransaction.partyId);
    if (newTransaction.vendor) formData.append("vendor", newTransaction.vendor);
    formData.append("amount", newTransaction.amount);
    if (newTransaction.detail) formData.append("detail", newTransaction.detail);
    formData.append("mode", newTransaction.mode);
    formData.append("status", newTransaction.status);
    if (newTransaction.site) formData.append("site", newTransaction.site);
    if (newTransaction.date)
      formData.append("date", new Date(newTransaction.date).toISOString());

    if (fileInputRef.current.files[0]) {
      formData.append("file", fileInputRef.current.files[0]);
    }

    // Debug payload
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      setUploading(true);
      if (newTransaction._id) {
        await updateTransaction(newTransaction._id, formData);
        toast.success("Transaction updated successfully");
      } else {
        await createTransaction(formData);
        toast.success("Transaction created successfully");
      }
      setUploading(false);
      if (onCreate) onCreate(newTransaction);
      onClose();
    } catch (error) {
      console.error("Transaction Error:", error);
      setUploading(false);
      toast.error("Failed to save transaction");
    }
  };

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
                <Dialog.Title className="text-lg font-semibold text-red-600">
                  {newTransaction._id
                    ? "Update Transaction"
                    : "Create New Transaction"}
                </Dialog.Title>
                <FiX
                  className="text-xl cursor-pointer hover:text-red-600"
                  onClick={onClose}
                />
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 text-sm">
                {/* Transaction Type, Mode, Status */}
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Transaction Type</p>
                    <select
                      value={newTransaction.type}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, type: e.target.value })
                      }
                      className="w-full border rounded p-1 text-sm"
                    >
                      <option value="PaymentIn">PaymentIn</option>
                      <option value="PaymentOut">PaymentOut</option>
                    </select>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Mode</p>
                    <select
                      value={newTransaction.mode}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, mode: e.target.value })
                      }
                      className="w-full border rounded p-1 text-sm"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Bank">Bank</option>
                    </select>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <select
                      value={newTransaction.status}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, status: e.target.value })
                      }
                      className="w-full border rounded p-1 text-sm"
                    >
                      <option value="pending">pending</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </div>

                  {/* Party */}
                  <div>
                    <p className="text-xs text-gray-500">Party Name</p>
                    <select
                      value={newTransaction.partyId}
                      onChange={(e) => {
                        const selectedParty = parties.find((p) => p._id === e.target.value);
                        setNewTransaction({
                          ...newTransaction,
                          partyId: selectedParty?._id || "",
                          name: selectedParty?.name || "",
                        });
                      }}
                      className="w-full border rounded p-1 text-sm"
                    >
                      <option value="">Select Party</option>
                      {parties.map((party) => (
                        <option key={party._id} value={party._id}>
                          {party.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Project */}
                  <div>
                    <p className="text-xs text-gray-500">Project / Site</p>
                    <select
                      value={newTransaction.projectId}
                      onChange={(e) => {
                        const selectedProject = projects.find((p) => p._id === e.target.value);
                        setNewTransaction({
                          ...newTransaction,
                          projectId: selectedProject?._id || "",
                          site: selectedProject?.name || "",
                        });
                      }}
                      className="w-full border rounded p-1 text-sm"
                    >
                      <option value="">Select Project</option>
                      {projects.map((project) => (
                        <option key={project._id} value={project._id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Detail */}
                  <div>
                    <p className="text-xs text-gray-500">Detail</p>
                    <input
                      type="text"
                      value={newTransaction.detail}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, detail: e.target.value })
                      }
                      className="w-full border rounded p-1 text-sm"
                      placeholder="Transaction detail"
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <input
                      type="number"
                      value={newTransaction.amount}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, amount: e.target.value })
                      }
                      className="w-full border rounded p-1 text-sm"
                      placeholder="e.g., 20000"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-xs text-gray-500">Date & Time</p>
                    <input
                      type="datetime-local"
                      value={newTransaction.date}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, date: e.target.value })
                      }
                      className="w-full border rounded p-1 text-sm"
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-medium text-gray-700">
                      Supporting Documents (optional)
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
                      multiple={false}
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    {fileInputRef.current?.files[0]?.name || "No file selected."}
                  </p>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  className="w-full mt-6 flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded"
                  disabled={uploading}
                >
                  <FiSave />
                  {newTransaction._id ? "Update Transaction" : "Save Transaction"}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default CreateNewTransactionModal;

// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment, useRef, useState, useEffect } from "react";
// import { FiUpload, FiX, FiSave } from "react-icons/fi";
// import { ClipLoader } from "react-spinners";
// import { toast } from "react-toastify";
// import {
//   createTransaction,
//   updateTransaction,
// } from "../../../services/transactionServices";
// import { getAllParties } from "../../../services/partyServices";
// import { fetchProjects } from "../../../services/projectServices";
// import { useAuth } from "../../../context/AuthContext"; // adjust path if needed

// function CreateNewTransactionModal({ open, onClose, onCreate, transaction }) {
//   const fileInputRef = useRef(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadedDocs, setUploadedDocs] = useState([]);
//   const [parties, setParties] = useState([]);
//   const [projects, setProjects] = useState([]);

//   const { user } = useAuth(); // architectId

//   const [newTransaction, setNewTransaction] = useState({
//     _id: null,
//     partyId: "",
//     name: "",
//     detail: "",
//     amount: "",
//     projectId: "",
//     site: "",
//     date: "",
//     type: "Payment In",
//     status: "Pending",
//     category: "Payment", // default
//   });

//   // 🔹 Fetch parties
//   useEffect(() => {
//     const fetchPartiesData = async () => {
//       try {
//         const data = await getAllParties();
//         setParties(data.parties || data);
//       } catch (err) {
//         toast.error("Failed to load parties ❌");
//       }
//     };
//     fetchPartiesData();
//   }, []);

//   // 🔹 Fetch projects
//   useEffect(() => {
//     const fetchProjectsData = async () => {
//       try {
//         const data = await fetchProjects();
//         setProjects(data.projects || data);
//       } catch (err) {
//         toast.error("Failed to load projects ❌");
//       }
//     };
//     fetchProjectsData();
//   }, []);

//   // 🔹 If editing, populate fields
//   useEffect(() => {
//     if (transaction) {
//       setNewTransaction({
//         _id: transaction._id,
//         partyId: transaction.party?._id || "",
//         name: transaction.party?.name || transaction.name || "",
//         detail: transaction.detail || "",
//         amount: transaction.amount || "",
//         projectId: transaction.projectId?._id || "",
//         site: transaction.projectId?.name || transaction.site || "",
//         date: transaction.date
//           ? new Date(transaction.date).toISOString().slice(0, 16)
//           : "",
//         type: transaction.transactionType || "Payment In",
//         status: transaction.status || "Pending",
//         category: transaction.category || "Payment",
//       });
//     } else {
//       // Reset form
//       setNewTransaction({
//         _id: null,
//         partyId: "",
//         name: "",
//         detail: "",
//         amount: "",
//         projectId: "",
//         site: "",
//         date: "",
//         type: "Payment In",
//         status: "Pending",
//         category: "Payment",
//       });
//       setUploadedDocs([]);
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

//   // 🔹 Transform payload for backend
//   const transformTransactionPayload = (transaction) => ({
//     projectId: transaction.projectId,
//     architectId: user?._id,
//     category: transaction.category || "Payment",
//     transactionType: transaction.type || "Payment In",
//     party: transaction.partyId || null,
//     vendor: transaction.vendor || null,
//     amount: Number(transaction.amount || 0),
//     name: transaction.name || "",
//     detail: transaction.detail || "",
//     site: transaction.site || "",
//     date: transaction.date
//       ? new Date(transaction.date).toISOString()
//       : new Date().toISOString(),
//     status: transaction.status || "Pending",
//   });

//   const handleSubmit = async () => {
//     if (
//       !newTransaction.partyId ||
//       !newTransaction.amount ||
//       !newTransaction.date ||
//       !newTransaction.projectId
//     ) {
//       toast.error("Please fill all required fields.");
//       return;
//     }

//     const payload = transformTransactionPayload(newTransaction);
//     console.log("DEBUG payload:", payload);

//     try {
//       if (newTransaction._id) {
//         await updateTransaction(newTransaction._id, payload);
//         toast.success("Transaction updated successfully");
//       } else {
//         await createTransaction(payload);
//         toast.success("Transaction created successfully");
//       }

//       if (onCreate) onCreate(payload);
//       onClose();
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to save transaction");
//     }
//   };

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
//                 <Dialog.Title className="text-lg font-semibold text-red-600">
//                   {newTransaction._id
//                     ? "Update Transaction"
//                     : "Create New Transaction"}
//                 </Dialog.Title>
//                 <FiX
//                   className="text-xl cursor-pointer hover:text-red-600"
//                   onClick={onClose}
//                 />
//               </div>

//               {/* Content */}
//               <div className="p-6 space-y-4 text-sm">
//                 <div className="space-y-2">
//                   {/* Transaction Type */}
//                   <div>
//                     <p className="text-xs text-gray-500">Transaction Type</p>
//                     <select
//                       value={newTransaction.type}
//                       onChange={(e) =>
//                         setNewTransaction({
//                           ...newTransaction,
//                           type: e.target.value,
//                         })
//                       }
//                       className="w-full border rounded p-1 text-sm"
//                     >
//                       <option>PaymentIn</option>
//                       <option>PaymentOut</option>
//                     </select>
//                   </div>

//                   {/* Status */}
//                   <div>
//                     <p className="text-xs text-gray-500">Status</p>
//                     <select
//                       value={newTransaction.status}
//                       onChange={(e) =>
//                         setNewTransaction({
//                           ...newTransaction,
//                           status: e.target.value,
//                         })
//                       }
//                       className="w-full border rounded p-1 text-sm"
//                     >
//                       <option>Pending</option>
//                       <option>Completed</option>
//                       <option>Cancelled</option>
//                     </select>
//                   </div>

//                   {/* Party */}
//                   <div>
//                     <p className="text-xs text-gray-500">Party Name</p>
//                     <select
//                       value={newTransaction.partyId}
//                       onChange={(e) => {
//                         const selectedParty = parties.find(
//                           (p) => p._id === e.target.value
//                         );
//                         setNewTransaction({
//                           ...newTransaction,
//                           partyId: selectedParty?._id || "",
//                           name: selectedParty?.name || "",
//                         });
//                       }}
//                       className="w-full border rounded p-1 text-sm"
//                     >
//                       <option value="">Select Party</option>
//                       {parties.map((party) => (
//                         <option key={party._id} value={party._id}>
//                           {party.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Project/Site */}
//                   <div>
//                     <p className="text-xs text-gray-500">Site / Project</p>
//                     <select
//                       value={newTransaction.projectId}
//                       onChange={(e) => {
//                         const selectedProject = projects.find(
//                           (p) => p._id === e.target.value
//                         );
//                         setNewTransaction({
//                           ...newTransaction,
//                           projectId: selectedProject?._id || "",
//                           site: selectedProject?.name || "",
//                         });
//                       }}
//                       className="w-full border rounded p-1 text-sm"
//                     >
//                       <option value="">Select Project</option>
//                       {projects.map((project) => (
//                         <option key={project._id} value={project._id}>
//                           {project.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Details */}
//                   <div>
//                     <p className="text-xs text-gray-500">Details</p>
//                     <input
//                       type="text"
//                       value={newTransaction.detail}
//                       onChange={(e) =>
//                         setNewTransaction({
//                           ...newTransaction,
//                           detail: e.target.value,
//                         })
//                       }
//                       className="w-full border rounded p-1 text-sm"
//                       placeholder="e.g., Jk Hardware"
//                     />
//                   </div>

//                   {/* Amount */}
//                   <div>
//                     <p className="text-xs text-gray-500">Amount</p>
//                     <input
//                       type="number"
//                       value={newTransaction.amount}
//                       onChange={(e) =>
//                         setNewTransaction({
//                           ...newTransaction,
//                           amount: e.target.value,
//                         })
//                       }
//                       className="w-full border rounded p-1 text-sm"
//                       placeholder="e.g., 20000"
//                     />
//                   </div>

//                   {/* Date */}
//                   <div>
//                     <p className="text-xs text-gray-500">Date & Time</p>
//                     <input
//                       type="datetime-local"
//                       value={newTransaction.date}
//                       onChange={(e) =>
//                         setNewTransaction({
//                           ...newTransaction,
//                           date: e.target.value,
//                         })
//                       }
//                       className="w-full border rounded p-1 text-sm"
//                     />
//                   </div>
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
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p className="text-xs text-gray-400">
//                       No supporting documents uploaded.
//                     </p>
//                   )}
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   onClick={handleSubmit}
//                   className="w-full mt-6 flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded"
//                 >
//                   <FiSave />
//                   {newTransaction._id
//                     ? "Update Transaction"
//                     : "Save Transaction"}
//                 </button>
//               </div>
//             </Dialog.Panel>
//           </Transition.Child>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }

// export default CreateNewTransactionModal;
