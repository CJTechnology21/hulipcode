import { useState, useEffect } from "react";
import Button from "../../../components/Button";
import { FiTrendingUp } from "react-icons/fi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import TransactionTypesModal from "./TransactionTypesModal";
import TransactionModal from "./TransactionComponents/TransactionModal";
import { toast } from "react-toastify";

// API services
import {
  fetchTransactions,
  deleteTransaction,
} from "../../../services/transactionServices";
import { fetchVendors } from "../../../services/leadServices";
import { fetchPartyByProject } from "../../../services/partyServices";

function ProjectTransaction({ projectId }) {
  const [isTypesModalOpen, setIsTypesModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [editTransaction, setEditTransaction] = useState(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const [vendors, setVendors] = useState([]);
  const [parties, setParties] = useState([]);

  const toId = (val) => (val && typeof val === "object" ? val._id : val);

  // Fetch transactions
  const getTransactions = async () => {
    if (!projectId) return;
    try {
      const data = await fetchTransactions({ projectId });
      const normalized = (data?.transactions || []).map((t) => ({
        ...t,
        party: toId(t.party),
        vendor: toId(t.vendor),
      }));
      setTransactions(normalized);
    } catch {
      toast.error("Failed to fetch transactions");
      setTransactions([]);
    }
  };

  // Fetch vendors & parties
  const getVendorsAndParties = async () => {
    try {
      const v = await fetchVendors();
      setVendors(v || []);
    } catch {
      setVendors([]);
    }
    try {
      const p = await fetchPartyByProject(projectId);
      setParties(p || []);
    } catch {
      setParties([]);
    }
  };

  useEffect(() => {
    getTransactions();
    getVendorsAndParties();
    //eslint-disable-next-line
  }, [projectId]);

  const getPartyName = (val) => {
    const id = toId(val);
    return parties.find((p) => p._id === id)?.name || "—";
  };

  const getVendorName = (val) => {
    const id = toId(val);
    return vendors.find((v) => v._id === id)?.name || "—";
  };

  // Summary
  const totalInvoice = transactions
    .filter((t) => t.transactionType === "Invoice")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.transactionType === "Expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const projectBalance = totalInvoice - totalExpense;

  // Handle add / update / delete
  const handleTransactionSubmit = (transaction, isEdit = false, isDelete = false) => {
    if (isDelete && isEdit) {
      setTransactions((prev) =>
        prev.filter((t) => t._id !== (editTransaction?._id || transaction?._id))
      );
      toast.success("Transaction deleted successfully");
    } else if (isEdit) {
      const normalized = {
        ...transaction,
        party: toId(transaction.party),
        vendor: toId(transaction.vendor),
      };
      setTransactions((prev) =>
        prev.map((t) => (t._id === (editTransaction?._id || transaction?._id) ? normalized : t))
      );
      toast.success("Transaction updated successfully");
    } else {
      const normalized = {
        ...transaction,
        party: toId(transaction.party),
        vendor: toId(transaction.vendor),
      };
      setTransactions((prev) => [...prev, normalized]);
      toast.success("Transaction added successfully");
    }
    setSelectedType(null);
    setEditTransaction(null);
  };

  const handleDelete = async (transactionId) => {
    try {
      await deleteTransaction(transactionId);
      setTransactions((prev) => prev.filter((t) => t._id !== transactionId));
      toast.success("Transaction deleted");
    } catch (err) {
      toast.error("Failed to delete transaction");
      console.error(err);
    }
  };

  const handleEdit = (transaction) => {
    setSelectedType(transaction.transactionType);
    setEditTransaction({
      ...transaction,
      party: toId(transaction.party),
      vendor: toId(transaction.vendor),
    });
    setActionMenuOpen(null);
  };

  const handleCloseModal = () => {
    setSelectedType(null);
    setEditTransaction(null);
  };

  return (
    <div className="w-screen h-screen bg-white flex flex-col font-sans m-4 p-2 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="custom"
            className="px-3 sm:px-4 py-1 bg-gray-100 rounded-md border text-sm"
          >
            Filter
          </Button>
          <Button
            variant="custom"
            className="px-3 sm:px-4 py-1 bg-gray-100 rounded-md border text-sm"
          >
            Date Filter
          </Button>
        </div>
        <Button
          className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base"
          onClick={() => setIsTypesModalOpen(true)}
        >
          Create Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 sm:p-6">
        <div className="bg-blue-100 rounded-lg p-4 shadow-sm">
          <div className="text-sm font-semibold text-gray-700">Invoice</div>
          <div className="text-xl sm:text-2xl font-bold">₹{totalInvoice}</div>
          <div className="text-xs sm:text-sm text-gray-600">
            Payment In ₹{totalInvoice}
          </div>
        </div>
        <div className="bg-purple-100 rounded-lg p-4 shadow-sm">
          <div className="text-sm font-semibold text-gray-700">Expense</div>
          <div className="text-xl sm:text-2xl font-bold">₹{totalExpense}</div>
          <div className="text-xs sm:text-sm text-gray-600">
            Payment Out ₹{totalExpense}
          </div>
        </div>
        <div className="bg-green-100 rounded-lg p-4 shadow-sm">
          <div className="text-sm font-semibold text-gray-700">Margin</div>
          <div className="text-xl sm:text-2xl font-bold">₹{projectBalance}</div>
          <div className="text-xs sm:text-sm text-gray-600">
            Project Balance ₹{projectBalance}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-6 border-b">
        <div className="flex gap-4 text-sm text-gray-600">
          <div className="border-b-2 border-red-600 pb-2">Transactions</div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="flex-grow bg-gray-50 overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-2">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 border border-red-600">
              <FiTrendingUp className="text-red-600 text-3xl" />
            </div>
            <div className="text-gray-500 text-sm">No Transactions</div>
          </div>
        ) : (
          <div className="w-full">
            <table className="min-w-full border-collapse text-sm m-4 p-2 overflow-hidden">
              <thead className="bg-gray-100 border-b text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">S. No</th>
                  <th className="px-4 py-2 text-left">Party / Vendor</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Mode</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Notes</th>
                  <th className="px-4 py-2 text-left">Proof</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, idx) => (
                  <tr
                    key={t._id}
                    className="border-b hover:bg-gray-50 transition relative"
                  >
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">
                      {t.party
                        ? getPartyName(t.party)
                        : t.vendor
                        ? getVendorName(t.vendor)
                        : "—"}
                    </td>
                    <td className="px-4 py-2">{t.transactionType}</td>
                    <td className="px-4 py-2">₹{t.amount}</td>
                    <td className="px-4 py-2">{t.mode || "—"}</td>
                    <td className="px-4 py-2">
                      {t.date ? new Date(t.date).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-2">{t.notes || "—"}</td>
                    <td className="px-4 py-2">
                      {t.proofs && t.proofs.length ? (
                        <a
                          href={t.proofs[0].fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-2 text-center relative">
                      <button
                        className="p-2 rounded hover:bg-gray-200"
                        onClick={() =>
                          setActionMenuOpen(actionMenuOpen === idx ? null : idx)
                        }
                      >
                        <HiOutlineDotsVertical className="w-5 h-5 text-gray-600" />
                      </button>

                      {actionMenuOpen === idx && (
                        <div className="flex justify-center gap-2 mt-2">
                          <Button
                            variant="custom"
                            onClick={() => handleEdit(t)}
                            className="px-2 py-1 text-xs bg-green-500 text-white border border-green-300 rounded hover:bg-green-600"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="custom"
                            onClick={() => handleDelete(t._id)}
                            className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white border border-red-300 rounded"
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Types Modal */}
      <TransactionTypesModal
        isOpen={isTypesModalOpen}
        onClose={() => setIsTypesModalOpen(false)}
        onSelect={(type) => {
          setSelectedType(type);
          setIsTypesModalOpen(false);
        }}
      />

      {/* Transaction Modal */}
      {(selectedType || editTransaction) && (
        <TransactionModal
          isOpen={!!selectedType || !!editTransaction}
          type={selectedType || editTransaction?.transactionType}
          editData={editTransaction}
          projectId={projectId}
          onClose={handleCloseModal}
          onSubmit={handleTransactionSubmit}
        />
      )}
    </div>
  );
}

export default ProjectTransaction;

// import { useState, useEffect } from "react";
// import Button from "../../../components/Button";
// import { FiTrendingUp } from "react-icons/fi";
// import { HiOutlineDotsVertical } from "react-icons/hi";
// import TransactionTypesModal from "./TransactionTypesModal";
// import TransactionModal from "./TransactionComponents/TransactionModal";
// import { toast } from "react-toastify";

// // API services
// import {
//   fetchTransactions,
//   deleteTransaction,
// } from "../../../services/transactionServices";
// import { fetchVendors } from "../../../services/leadServices";
// import { fetchPartyByProject } from "../../../services/partyServices";

// function ProjectTransaction({ projectId }) {
//   const [isTypesModalOpen, setIsTypesModalOpen] = useState(false);
//   const [selectedType, setSelectedType] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [editTransaction, setEditTransaction] = useState(null);
//   const [actionMenuOpen, setActionMenuOpen] = useState(null);

//   const [vendors, setVendors] = useState([]);
//   const [parties, setParties] = useState([]);

//   // Fetch transactions
//   const getTransactions = async () => {
//     if (!projectId) return;
//     try {
//       const data = await fetchTransactions({ projectId });
//       setTransactions(data.transactions || []);
//     } catch {
//       toast.error("Failed to fetch transactions");
//       setTransactions([]);
//     }
//   };

//   // Fetch vendors & parties
//   const getVendorsAndParties = async () => {
//     try {
//       const v = await fetchVendors();
//       setVendors(v || []);
//     } catch {
//       setVendors([]);
//     }
//     try {
//       const p = await fetchPartyByProject(projectId);
//       setParties(p || []);
//     } catch {
//       setParties([]);
//     }
//   };

//   useEffect(() => {
//     getTransactions();
//     getVendorsAndParties();
//     //eslint-disable-next-line
//   }, [projectId]);

//   const getPartyName = (id) => parties.find((p) => p._id === id)?.name || "—";
//   const getVendorName = (id) => vendors.find((v) => v._id === id)?.name || "—";

//   // Summary
//   const totalInvoice = transactions
//     .filter((t) => t.transactionType === "Invoice")
//     .reduce((sum, t) => sum + Number(t.amount), 0);

//   const totalExpense = transactions
//     .filter((t) => t.transactionType === "Expense")
//     .reduce((sum, t) => sum + Number(t.amount), 0);

//   const projectBalance = totalInvoice - totalExpense;

//   // Handle add / update / delete
//   const handleTransactionSubmit = (transaction, isEdit = false, isDelete = false) => {
//     if (isDelete && isEdit) {
//       setTransactions((prev) => prev.filter((t) => t._id !== editTransaction._id));
//       toast.success("Transaction deleted successfully");
//     } else if (isEdit) {
//       setTransactions((prev) =>
//         prev.map((t) => (t._id === editTransaction._id ? transaction : t))
//       );
//       toast.success("Transaction updated successfully");
//     } else {
//       setTransactions((prev) => [...prev, transaction]);
//       // toast.success("Transaction added successfully");
//     }
//     setSelectedType(null);
//     setEditTransaction(null);
//   };

//   const handleDelete = async (transactionId) => {
//     try {
//       await deleteTransaction(transactionId);
//       setTransactions((prev) => prev.filter((t) => t._id !== transactionId));
//       toast.success("Transaction deleted");
//     } catch (err) {
//       toast.error("Failed to delete transaction");
//       console.error(err);
//     }
//   };

//   const handleEdit = (transaction) => {
//     setSelectedType(transaction.transactionType);
//     setEditTransaction(transaction);
//     setActionMenuOpen(null);
//   };

//   const handleCloseModal = () => {
//     setSelectedType(null);
//     setEditTransaction(null);
//   };

//   return (
//     <div className="w-screen h-screen bg-white flex flex-col font-sans m-4 p-2 rounded-xl">
//       {/* Header */}
//       <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b">
//         <div className="flex items-center gap-2 sm:gap-4">
//           <Button
//             variant="custom"
//             className="px-3 sm:px-4 py-1 bg-gray-100 rounded-md border text-sm"
//           >
//             Filter
//           </Button>
//           <Button
//             variant="custom"
//             className="px-3 sm:px-4 py-1 bg-gray-100 rounded-md border text-sm"
//           >
//             Date Filter
//           </Button>
//         </div>
//         <Button
//           className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base"
//           onClick={() => setIsTypesModalOpen(true)}
//         >
//           Create Transaction
//         </Button>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 sm:p-6">
//         <div className="bg-blue-100 rounded-lg p-4 shadow-sm">
//           <div className="text-sm font-semibold text-gray-700">Invoice</div>
//           <div className="text-xl sm:text-2xl font-bold">₹{totalInvoice}</div>
//           <div className="text-xs sm:text-sm text-gray-600">
//             Payment In ₹{totalInvoice}
//           </div>
//         </div>
//         <div className="bg-purple-100 rounded-lg p-4 shadow-sm">
//           <div className="text-sm font-semibold text-gray-700">Expense</div>
//           <div className="text-xl sm:text-2xl font-bold">₹{totalExpense}</div>
//           <div className="text-xs sm:text-sm text-gray-600">
//             Payment Out ₹{totalExpense}
//           </div>
//         </div>
//         <div className="bg-green-100 rounded-lg p-4 shadow-sm">
//           <div className="text-sm font-semibold text-gray-700">Margin</div>
//           <div className="text-xl sm:text-2xl font-bold">₹{projectBalance}</div>
//           <div className="text-xs sm:text-sm text-gray-600">
//             Project Balance ₹{projectBalance}
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="px-4 sm:px-6 border-b">
//         <div className="flex gap-4 text-sm text-gray-600">
//           <div className="border-b-2 border-red-600 pb-2">Transactions</div>
//         </div>
//       </div>

//       {/* Transactions Table */}
//       <div className="flex-grow bg-gray-50 overflow-y-auto">
//         {transactions.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-full space-y-2">
//             <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 border border-red-600">
//               <FiTrendingUp className="text-red-600 text-3xl" />
//             </div>
//             <div className="text-gray-500 text-sm">No Transactions</div>
//           </div>
//         ) : (
//           <div className="w-full">
//             <table className="min-w-full border-collapse text-sm m-4 p-2 overflow-hidden">
//               <thead className="bg-gray-100 border-b text-gray-700">
//                 <tr>
//                   <th className="px-4 py-2 text-left">S. No</th>
//                   <th className="px-4 py-2 text-left">Party / Vendor</th>
//                   <th className="px-4 py-2 text-left">Type</th>
//                   <th className="px-4 py-2 text-left">Amount</th>
//                   <th className="px-4 py-2 text-left">Mode</th>
//                   <th className="px-4 py-2 text-left">Date</th>
//                   <th className="px-4 py-2 text-left">Notes</th>
//                   <th className="px-4 py-2 text-left">Proof</th>
//                   <th className="px-4 py-2 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {transactions.map((t, idx) => (
//                   <tr
//                     key={t._id}
//                     className="border-b hover:bg-gray-50 transition relative"
//                   >
//                     <td className="px-4 py-2">{idx + 1}</td>
//                     <td className="px-4 py-2">
//                       {t.party ? getPartyName(t.party) : t.vendor ? getVendorName(t.vendor) : "—"}
//                     </td>
//                     <td className="px-4 py-2">{t.transactionType}</td>
//                     <td className="px-4 py-2">₹{t.amount}</td>
//                     <td className="px-4 py-2">{t.mode || "—"}</td>
//                     <td className="px-4 py-2">
//                       {t.date ? new Date(t.date).toLocaleDateString() : "—"}
//                     </td>
//                     <td className="px-4 py-2">{t.notes || "—"}</td>
//                     <td className="px-4 py-2">
//                       {t.proofs && t.proofs.length ? (
//                         <a
//                           href={t.proofs[0].fileUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 underline"
//                         >
//                           View
//                         </a>
//                       ) : (
//                         "—"
//                       )}
//                     </td>
//                     <td className="px-4 py-2 text-center relative">
//                       <button
//                         className="p-2 rounded hover:bg-gray-200"
//                         onClick={() =>
//                           setActionMenuOpen(actionMenuOpen === idx ? null : idx)
//                         }
//                       >
//                         <HiOutlineDotsVertical className="w-5 h-5 text-gray-600" />
//                       </button>

//                       {actionMenuOpen === idx && (
//                         <div className="flex justify-center gap-2 mt-2">
//                           <Button
//                             variant="custom"
//                             onClick={() => handleEdit(t)}
//                             className="px-2 py-1 text-xs bg-green-500 text-white border border-green-300 rounded hover:bg-green-600"
//                           >
//                             Edit
//                           </Button>
//                           <Button
//                             variant="custom"
//                             onClick={() => handleDelete(t._id)}
//                             className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white border border-red-300 rounded"
//                           >
//                             Delete
//                           </Button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Transaction Types Modal */}
//       <TransactionTypesModal
//         isOpen={isTypesModalOpen}
//         onClose={() => setIsTypesModalOpen(false)}
//         onSelect={(type) => {
//           setSelectedType(type);
//           setIsTypesModalOpen(false);
//         }}
//       />

//       {/* Transaction Modal */}
//       {(selectedType || editTransaction) && (
//         <TransactionModal
//           isOpen={!!selectedType || !!editTransaction}
//           type={selectedType || editTransaction?.transactionType}
//           editData={editTransaction}
//           projectId={projectId}
//           onClose={handleCloseModal}
//           onSubmit={handleTransactionSubmit}
//         />
//       )}
//     </div>
//   );
// }

// export default ProjectTransaction;
