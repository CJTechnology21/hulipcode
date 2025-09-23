import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  fetchPOsByArchitect,
  deletePO,
  updatePO,
} from "../../../services/purchaseOrderServices";
import { fetchMaterialSuppliers } from "../../../services/leadServices"; // <- add this service
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import DropDown from "../../../components/DropDown";
import { FaTrash, FaPen, FaSave } from "react-icons/fa";
import { toId, getLabel } from "../../../utils/getLabel"; 

function PurchaseOrder() {
  const { user } = useAuth();
  const [poList, setPoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editablePOs, setEditablePOs] = useState([]);
  const [fetchedOnce, setFetchedOnce] = useState(false);

  // store supplier master list
  const [suppliers, setSuppliers] = useState([]);

  // fetch suppliers once
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const res = await fetchMaterialSuppliers();
        setSuppliers(res.data || []);
      } catch (err) {
        toast.error("Failed to fetch suppliers");
      }
    };
    loadSuppliers();
  }, []);

  // fetch POs
  useEffect(() => {
    if (!user?._id) return;
    const loadPOs = async () => {
      try {
        const res = await fetchPOsByArchitect(user._id);
        setPoList(res.data || []);
        setEditablePOs((res.data || []).map((po) => ({ ...po })));
        if (!fetchedOnce) {
          toast.success("POs fetched successfully");
          setFetchedOnce(true);
        }
      } catch (err) {
        toast.error("Failed to fetch purchase orders");
      } finally {
        setLoading(false);
      }
    };
    loadPOs();
  }, [user, fetchedOnce]);

  const handleDelete = async (id) => {
    try {
      await deletePO(id);
      setPoList((prev) => prev.filter((po) => po._id !== id));
      setEditablePOs((prev) => prev.filter((po) => po._id !== id));
      toast.success("Purchase Order deleted successfully");
    } catch (err) {
      toast.error("Failed to delete PO");
    }
  };

  const handleEdit = (idx) => setEditingIndex(idx);

  const handleChange = (idx, field, value) => {
    setEditablePOs((prev) => {
      const updated = [...prev];
      updated[idx][field] = value;
      return updated;
    });
  };

  const handleSave = async (idx) => {
    const po = editablePOs[idx];
    try {
      const updated = await updatePO(po._id, po);
      setPoList((prev) =>
        prev.map((p) => (p._id === po._id ? updated.data : p))
      );
      setEditablePOs((prev) =>
        prev.map((p, i) => (i === idx ? updated.data : p))
      );
      setEditingIndex(null);
      toast.success("PO updated successfully");
    } catch (err) {
      toast.error("Failed to update PO");
    }
  };

  return (
    <div className="bg-white min-h-screen p-4 m-2 rounded-xl shadow-2xl">
      <ToastContainer />
      <h2 className="text-xl font-bold mb-4">My Purchase Orders</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <ClipLoader color="red" size={50} />
        </div>
      ) : poList.length === 0 ? (
        <p className="text-gray-600 text-center">No POs found for you</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Project</th>
                <th className="p-2 border">Supplier</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {editablePOs.map((po, idx) => {
                const isEditing = editingIndex === idx;
                return (
                  <tr key={po._id} className="hover:bg-gray-50">
                    <td className="p-2 border">{idx + 1}</td>
                    <td className="p-2 border">
                      {isEditing ? (
                        <input
                          type="text"
                          value={po.project?.name || ""}
                          onChange={(e) =>
                            handleChange(idx, "project", {
                              ...po.project,
                              name: e.target.value,
                            })
                          }
                          className="w-full p-1 border rounded"
                        />
                      ) : (
                        po.project?.name || "-"
                      )}
                    </td>
                    <td className="p-2 border">
                      {isEditing ? (
                        <input
                          type="text"
                          value={po.supplier?.name || ""}
                          onChange={(e) =>
                            handleChange(idx, "supplier", {
                              ...po.supplier,
                              name: e.target.value,
                            })
                          }
                          className="w-full p-1 border rounded"
                        />
                      ) : (
                        getLabel(suppliers, po.supplier)
                      )}
                    </td>
                    <td className="p-2 border">
                      {isEditing ? (
                        <input
                          type="number"
                          value={po.totalAmount}
                          onChange={(e) =>
                            handleChange(idx, "totalAmount", e.target.value)
                          }
                          className="w-full p-1 border rounded"
                        />
                      ) : (
                        `₹${po.totalAmount}`
                      )}
                    </td>
                    <td className="p-2 border">
                      {isEditing ? (
                        <DropDown
                          label="Status"
                          name="status"
                          value={po.status}
                          options={[
                            "draft",
                            "confirmed",
                            "completed",
                            "cancelled",
                          ]}
                          onChange={(e) =>
                            handleChange(idx, "status", e.target.value)
                          }
                        />
                      ) : (
                        <span className="capitalize">{po.status}</span>
                      )}
                    </td>
                    <td className="p-2 border space-x-2 flex items-center">
                      {isEditing ? (
                        <button
                          onClick={() => handleSave(idx)}
                          className="text-green-500 hover:text-green-600"
                        >
                          <FaSave />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(idx)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <FaPen />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(po._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PurchaseOrder;

// import React, { useEffect, useState } from "react";
// import { useAuth } from "../../../context/AuthContext";
// import {
//   fetchPOsByArchitect,
//   deletePO,
//   updatePO,
// } from "../../../services/purchaseOrderServices";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import ClipLoader from "react-spinners/ClipLoader";
// import DropDown from "../../../components/DropDown";
// import { FaTrash, FaPen, FaSave } from "react-icons/fa";

// // helpers you provided
// export const toId = (val) => {
//   if (!val) return null;
//   if (val._id && val._id.$oid) return val._id.$oid; // nested _id.$oid
//   if (val.$oid) return val.$oid; // direct $oid
//   if (val._id) return val._id; // plain object with _id
//   if (val.id) return val.id; // sometimes id instead of _id
//   if (val.value) return val.value; // sometimes comes as value
//   return val; // already string
// };

// export const getLabel = (arr, idOrObj) => {
//   if (!arr || arr.length === 0 || !idOrObj) {
//     return "—";
//   }
//   const id = String(toId(idOrObj));
//   const item = arr.find(
//     (i) => String(toId(i._id) || toId(i.id) || i.value) === id
//   );
//   if (!item) {
//     return "—";
//   }
//   return (
//     item.name || // Party.name or Vendor.name
//     item.type || // Party.type (Client, Vendor, Contractor, Miss)
//     item.label || // generic label
//     "—"
//   );
// };

// function PurchaseOrder() {
//   const { user } = useAuth();
//   const [poList, setPoList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [editablePOs, setEditablePOs] = useState([]);

//   // to prevent multiple toasts on first fetch
//   const [fetchedOnce, setFetchedOnce] = useState(false);

//   useEffect(() => {
//     if (!user?._id) return;
//     const loadPOs = async () => {
//       try {
//         const res = await fetchPOsByArchitect(user._id);
//         setPoList(res.data || []);
//         setEditablePOs((res.data || []).map((po) => ({ ...po })));
//         if (!fetchedOnce) {
//           toast.success("POs fetched successfully");
//           setFetchedOnce(true);
//         }
//       } catch (err) {
//         toast.error("Failed to fetch purchase orders");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadPOs();
//   }, [user, fetchedOnce]);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this PO?")) return;
//     try {
//       await deletePO(id);
//       setPoList((prev) => prev.filter((po) => po._id !== id));
//       setEditablePOs((prev) => prev.filter((po) => po._id !== id));
//       toast.success("Purchase Order deleted successfully");
//     } catch (err) {
//       toast.error("Failed to delete PO");
//     }
//   };

//   const handleEdit = (idx) => setEditingIndex(idx);

//   const handleChange = (idx, field, value) => {
//     setEditablePOs((prev) => {
//       const updated = [...prev];
//       updated[idx][field] = value;
//       return updated;
//     });
//   };

//   const handleSave = async (idx) => {
//     const po = editablePOs[idx];
//     try {
//       const updated = await updatePO(po._id, po);
//       setPoList((prev) =>
//         prev.map((p) => (p._id === po._id ? updated.data : p))
//       );
//       setEditablePOs((prev) =>
//         prev.map((p, i) => (i === idx ? updated.data : p))
//       );
//       setEditingIndex(null);
//       toast.success("PO updated successfully");
//     } catch (err) {
//       toast.error("Failed to update PO");
//     }
//   };

//   return (
//     <div className="bg-white min-h-screen p-4 m-2 rounded-xl shadow-2xl">
//       <ToastContainer />
//       <h2 className="text-xl font-bold mb-4">My Purchase Orders</h2>

//       {loading ? (
//         <div className="flex justify-center items-center h-40">
//           <ClipLoader color="red" size={50} />
//         </div>
//       ) : poList.length === 0 ? (
//         <p className="text-gray-600 text-center">No POs found for you</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full border border-gray-200 rounded-lg">
//             <thead>
//               <tr className="bg-gray-100 text-left">
//                 <th className="p-2 border">#</th>
//                 <th className="p-2 border">Project</th>
//                 <th className="p-2 border">Supplier</th>
//                 <th className="p-2 border">Total</th>
//                 <th className="p-2 border">Status</th>
//                 <th className="p-2 border">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {editablePOs.map((po, idx) => {
//                 const isEditing = editingIndex === idx;
//                 return (
//                   <tr key={po._id} className="hover:bg-gray-50">
//                     <td className="p-2 border">{idx + 1}</td>
//                     <td className="p-2 border">
//                       {isEditing ? (
//                         <input
//                           type="text"
//                           value={po.project?.name || ""}
//                           onChange={(e) =>
//                             handleChange(idx, "project", {
//                               ...po.project,
//                               name: e.target.value,
//                             })
//                           }
//                           className="w-full p-1 border rounded"
//                         />
//                       ) : (
//                         po.project?.name || "-"
//                       )}
//                     </td>
//                     <td className="p-2 border">
//                       {isEditing ? (
//                         <input
//                           type="text"
//                           value={po.supplier?.name || ""}
//                           onChange={(e) =>
//                             handleChange(idx, "supplier", {
//                               ...po.supplier,
//                               name: e.target.value,
//                             })
//                           }
//                           className="w-full p-1 border rounded"
//                         />
//                       ) : (
//                         getLabel([po.supplier], po.supplier) // uses your getLabel
//                       )}
//                     </td>
//                     <td className="p-2 border">
//                       {isEditing ? (
//                         <input
//                           type="number"
//                           value={po.totalAmount}
//                           onChange={(e) =>
//                             handleChange(idx, "totalAmount", e.target.value)
//                           }
//                           className="w-full p-1 border rounded"
//                         />
//                       ) : (
//                         `₹${po.totalAmount}`
//                       )}
//                     </td>
//                     <td className="p-2 border">
//                       {isEditing ? (
//                         <DropDown
//                           label="Status"
//                           name="status"
//                           value={po.status}
//                           options={[
//                             "draft",
//                             "confirmed",
//                             "completed",
//                             "cancelled",
//                           ]}
//                           onChange={(e) =>
//                             handleChange(idx, "status", e.target.value)
//                           }
//                         />
//                       ) : (
//                         <span className="capitalize">{po.status}</span>
//                       )}
//                     </td>
//                     <td className="p-2 border space-x-2 flex items-center">
//                       {isEditing ? (
//                         <button
//                           onClick={() => handleSave(idx)}
//                           className="text-green-500 hover:text-green-600"
//                         >
//                           <FaSave />
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleEdit(idx)}
//                           className="text-blue-500 hover:text-blue-600"
//                         >
//                           <FaPen />
//                         </button>
//                       )}
//                       <button
//                         onClick={() => handleDelete(po._id)}
//                         className="text-red-500 hover:text-red-600"
//                       >
//                         <FaTrash />
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PurchaseOrder;

