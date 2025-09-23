
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  fetchPOsByArchitect,
  deletePO,
  updatePO,
} from "../../../services/purchaseOrderServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";

function PurchaseOrder() {
  const { user } = useAuth();
  const [poList, setPoList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔁 Fetch POs
  useEffect(() => {
    if (!user?._id) return;

    const loadPOs = async () => {
      try {
        const res = await fetchPOsByArchitect(user._id);
        setPoList(res.data || []);
        toast.success("PO's Fetched Successfullyy!")
      } catch (err) {
        toast.error("Failed to fetch purchase orders");
      } finally {
        setLoading(false);
      }
    };

    loadPOs();
  }, [user]);

  // ❌ Delete PO
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this PO?")) return;
    try {
      await deletePO(id);
      setPoList((prev) => prev.filter((po) => po._id !== id));
      toast.success("Purchase Order deleted successfully");
    } catch (err) {
      toast.error("Failed to delete PO");
    }
  };

  // ✏️ Edit PO (dummy example: update status to 'confirmed')
  const handleEdit = async (id) => {
    try {
      const updated = await updatePO(id, { status: "confirmed" });
      setPoList((prev) =>
        prev.map((po) => (po._id === id ? updated.data : po))
      );
      toast.success("PO updated successfully");
    } catch (err) {
      toast.error("Failed to update PO");
    }
  };

  return (
    <div className="bg-white min-h-screen p-4 m-2 rounded-xl shadow-2xl">
      <ToastContainer />
      <h2 className="text-xl font-bold mb-4">My Purchase Orders</h2>

      {/* Loader */}
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
                <th className="p-2 border">PO ID</th>
                <th className="p-2 border">Project</th>
                <th className="p-2 border">Supplier</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {poList.map((po) => (
                <tr key={po._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{po._id}</td>
                  <td className="p-2 border">{po.project?.name || "-"}</td>
                  <td className="p-2 border">{po.supplier?.name || "-"}</td>
                  <td className="p-2 border">₹{po.totalAmount}</td>
                  <td className="p-2 border capitalize">{po.status}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => handleEdit(po._id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(po._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PurchaseOrder;

// import React from "react";

// function PurchaseOrder() {
//   return (
//     <div className="bg-white min-h-screen p-4 m-2 rounded-xl shadow-2xl"></div>
//   );
// }

// export default PurchaseOrder;
