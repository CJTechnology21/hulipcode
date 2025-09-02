import React, { useState, useEffect } from "react";
import { MdConstruction } from "react-icons/md";
import { FaPlus, FaEllipsisV } from "react-icons/fa";
import Button from "../../../components/Button";
import SubconModal from "./SubconComponents/SubconModal";
import {
  fetchSubconByProject,
  createSubcon,
  updateSubcon,
  deleteSubcon,
} from "../../../services/subConServices";
import { formatDate } from "../../../utils/dateFormatter";
import { toast } from "react-toastify";

function ProjectSubcon({ projectId }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  // Fetch subcon orders
  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchSubconByProject(projectId);
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Error fetching subcon orders:", err);
      toast.error("Failed to fetch sub-contractor orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) loadOrders();
  }, [projectId]);

  // Handle create or update
  const handleSubmitOrder = async (data, orderId) => {
    try {
      if (orderId) {
        await updateSubcon(orderId, { ...data, projectId });
        toast.success("Sub-Con Work Order updated successfully!");
      } else {
        await createSubcon({ ...data, projectId });
        toast.success("Sub-Con Work Order created successfully!");
      }
      setModalOpen(false);
      setEditingOrder(null);
      loadOrders();
    } catch (err) {
      console.error("Error saving subcon order:", err);
      toast.error("Failed to save sub-contractor order");
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setModalOpen(true);
    setActionMenuOpen(null);
  };

  const handleDelete = async (orderId) => {
    try {
      await deleteSubcon(orderId);
      toast.success("Sub-Con Work Order deleted successfully!");
      loadOrders();
    } catch (err) {
      console.error("Error deleting subcon order:", err);
      toast.error("Failed to delete sub-contractor order");
    }
    setActionMenuOpen(null);
  };

  if (loading) {
    return <p className="text-gray-500 text-center">Loading...</p>;
  }

  // Empty state
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] w-full px-4 text-center">
        <div className="text-red-600 text-6xl mb-4">
          <MdConstruction />
        </div>
        <h2 className="text-lg font-semibold text-gray-700">
          No work order found
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Create a work order so you can start using <br />
          <span className="font-medium">Sub-Contractor</span>
        </p>
        <Button
          variant="custom"
          onClick={() => {
            setEditingOrder(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition-all"
        >
          <FaPlus size={14} />
          Sub Con Work Order
        </Button>

        <SubconModal
          projectId={projectId}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingOrder(null);
          }}
          onSubmit={handleSubmitOrder}
          initialData={editingOrder}
        />
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Subcon Work Orders
        </h2>
        <Button
          variant="custom"
          onClick={() => {
            setEditingOrder(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          <FaPlus size={14} />
          Create Order
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b text-left text-sm">S NO</th>
                <th className="px-4 py-2 border-b text-left text-sm">
                  Work Item
                </th>
                <th className="px-4 py-2 border-b text-left text-sm">Staff</th>
                <th className="px-4 py-2 border-b text-left text-sm">Amount</th>
                <th className="px-4 py-2 border-b text-left text-sm">
                  Decription
                </th>
                <th className="px-4 py-2 border-b text-left text-sm">Status</th>
                <th className="px-4 py-2 border-b text-left text-sm">
                  Start Date
                </th>
                <th className="px-4 py-2 border-b text-left text-sm">
                  End Date
                </th>
                <th className="px-4 py-2 border-b text-left text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={order._id} className="hover:bg-gray-50 relative">
                  <td className="px-4 py-2 border-b text-sm">{idx + 1}</td>
                  <td className="px-4 py-2 border-b text-sm">
                    {order.task?.name || order.todo?.itemName || "—"}
                  </td>
                  <td className="px-4 py-2 border-b text-sm">
                    {order.staff?.name || "—"}
                  </td>
                  <td className="px-4 py-2 border-b text-sm">{order.amount}</td>
                  <td className="px-4 py-2 border-b text-sm">{order.notes}</td>
                  <td className="px-4 py-2 border-b text-sm capitalize">
                    {order.status || "—"}
                  </td>
                  <td className="px-4 py-2 border-b text-sm">
                    {order.startDate ? formatDate(order.startDate) : "—"}
                  </td>
                  <td className="px-4 py-2 border-b text-sm">
                    {order.endDate ? formatDate(order.endDate) : "—"}
                  </td>
                  <td className="px-4 py-2 border-b text-sm">
                    <div className="flex flex-col items-start gap-2">
                      <button
                        onClick={() =>
                          setActionMenuOpen(
                            actionMenuOpen === order._id ? null : order._id
                          )
                        }
                        className="p-2 rounded-full hover:bg-gray-200"
                      >
                        <FaEllipsisV />
                      </button>

                      {actionMenuOpen === order._id && (
                        <div className="flex gap-2 mt-1">
                          <Button
                            variant="secondary"
                            onClick={() => handleEdit(order)}
                            className="px-3 py-1 text-sm"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(order._id)}
                            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SubconModal
        projectId={projectId}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingOrder(null);
        }}
        onSubmit={handleSubmitOrder}
        initialData={editingOrder}
      />
    </div>
  );
}

export default ProjectSubcon;

// import React, { useState, useEffect } from "react";
// import { MdConstruction } from "react-icons/md";
// import { FaPlus, FaEllipsisV } from "react-icons/fa";
// import Button from "../../../components/Button";
// import SubconModal from "./SubconComponents/SubconModal";
// import {
//   fetchSubconByProject,
//   createSubcon,
//   updateSubcon,
//   deleteSubcon,
// } from "../../../services/subConServices";
// import { formatDate } from "../../../utils/dateFormatter";
// import { toast } from "react-toastify";

// function ProjectSubcon({ projectId }) {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionMenuOpen, setActionMenuOpen] = useState(null);
//   const [editingOrder, setEditingOrder] = useState(null);

//   // ✅ Local getLabel helper
//   const getLabel = (id, list, key = "name") => {
//     if (!id || !Array.isArray(list)) return "—";
//     const item = list.find((i) => String(i._id) === String(id));
//     return item ? item[key] : "—";
//   };

//   // Fetch subcon orders
//   const loadOrders = async () => {
//     try {
//       setLoading(true);
//       const data = await fetchSubconByProject(projectId);
//       setOrders(data.orders || []);
//     } catch (err) {
//       console.error("Error fetching subcon orders:", err);
//       toast.error("Failed to fetch sub-contractor orders");
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (projectId) loadOrders();
//   }, [projectId]);

//   // Handle create or update
//   const handleSubmitOrder = async (data, orderId) => {
//     try {
//       if (orderId) {
//         await updateSubcon(orderId, { ...data, projectId });
//         toast.success("Sub-Con Work Order updated successfully!");
//       } else {
//         await createSubcon({ ...data, projectId });
//         toast.success("Sub-Con Work Order created successfully!");
//       }
//       setModalOpen(false);
//       setEditingOrder(null);
//       loadOrders();
//     } catch (err) {
//       console.error("Error saving subcon order:", err);
//       toast.error("Failed to save sub-contractor order");
//     }
//   };

//   const handleEdit = (order) => {
//     setEditingOrder(order);
//     setModalOpen(true);
//     setActionMenuOpen(null);
//   };

//   const handleDelete = async (orderId) => {
//     try {
//       await deleteSubcon(orderId);
//       toast.success("Sub-Con Work Order deleted successfully!");
//       loadOrders();
//     } catch (err) {
//       console.error("Error deleting subcon order:", err);
//       toast.error("Failed to delete sub-contractor order");
//     }
//     setActionMenuOpen(null);
//   };

//   if (loading) {
//     return <p className="text-gray-500 text-center">Loading...</p>;
//   }

//   // Empty state
//   if (!orders.length) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] w-full px-4 text-center">
//         <div className="text-red-600 text-6xl mb-4">
//           <MdConstruction />
//         </div>
//         <h2 className="text-lg font-semibold text-gray-700">
//           No work order found
//         </h2>
//         <p className="text-sm text-gray-500 mb-4">
//           Create a work order so you can start using <br />
//           <span className="font-medium">Sub-Contractor</span>
//         </p>
//         <Button
//           variant="custom"
//           onClick={() => {
//             setEditingOrder(null);
//             setModalOpen(true);
//           }}
//           className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition-all"
//         >
//           <FaPlus size={14} />
//           Sub Con Work Order
//         </Button>

//         <SubconModal
//           projectId={projectId}
//           isOpen={modalOpen}
//           onClose={() => {
//             setModalOpen(false);
//             setEditingOrder(null);
//           }}
//           onSubmit={handleSubmitOrder}
//           initialData={editingOrder}
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="w-full p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold text-gray-700">
//           Subcon Work Orders
//         </h2>
//         <Button
//           variant="custom"
//           onClick={() => {
//             setEditingOrder(null);
//             setModalOpen(true);
//           }}
//           className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
//         >
//           <FaPlus size={14} />
//           Create Order
//         </Button>
//       </div>

//       <div className="bg-white rounded-lg shadow-md p-4">
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-200 rounded-md">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-4 py-2 border-b text-left text-sm">
//                   Work Item
//                 </th>
//                 <th className="px-4 py-2 border-b text-left text-sm">Staff</th>
//                 <th className="px-4 py-2 border-b text-left text-sm">Amount</th>
//                 <th className="px-4 py-2 border-b text-left text-sm">Status</th>
//                 <th className="px-4 py-2 border-b text-left text-sm">
//                   Start Date
//                 </th>
//                 <th className="px-4 py-2 border-b text-left text-sm">End Date</th>
//                 <th className="px-4 py-2 border-b text-left text-sm">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order._id} className="hover:bg-gray-50 relative">
//                   <td className="px-4 py-2 border-b text-sm">
//                     {order.task
//                       ? getLabel(order.task, order.taskList)
//                       : getLabel(order.todo, order.todoList)}
//                   </td>
//                   <td className="px-4 py-2 border-b text-sm">
//                     {getLabel(order.staff, order.staffList)}
//                   </td>
//                   <td className="px-4 py-2 border-b text-sm">{order.amount}</td>
//                   <td className="px-4 py-2 border-b text-sm capitalize">
//                     {order.status || "—"}
//                   </td>
//                   <td className="px-4 py-2 border-b text-sm">
//                     {order.startDate ? formatDate(order.startDate) : "—"}
//                   </td>
//                   <td className="px-4 py-2 border-b text-sm">
//                     {order.endDate ? formatDate(order.endDate) : "—"}
//                   </td>
//                   <td className="px-4 py-2 border-b text-sm">
//                     <div className="relative inline-block text-left">
//                       <button
//                         onClick={() =>
//                           setActionMenuOpen(
//                             actionMenuOpen === order._id ? null : order._id
//                           )
//                         }
//                         className="p-2 rounded-full hover:bg-gray-200"
//                       >
//                         <FaEllipsisV />
//                       </button>

//                       {actionMenuOpen === order._id && (
//                         <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-md shadow-lg z-10">
//                           <button
//                             onClick={() => handleEdit(order)}
//                             className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(order._id)}
//                             className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <SubconModal
//         projectId={projectId}
//         isOpen={modalOpen}
//         onClose={() => {
//           setModalOpen(false);
//           setEditingOrder(null);
//         }}
//         onSubmit={handleSubmitOrder}
//         initialData={editingOrder}
//       />
//     </div>
//   );
// }

// export default ProjectSubcon;
