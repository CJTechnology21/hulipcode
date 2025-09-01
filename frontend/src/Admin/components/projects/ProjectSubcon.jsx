import React, { useState, useEffect } from "react";
import { MdConstruction } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import Button from "../../../components/Button";
import SubconModal from "./SubconComponents/SubconModal";
import { fetchSubconByProject, createSubcon } from "../../../services/subConServices";

function ProjectSubcon({ fetchTodos, fetchTasks, fetchStaff, projectId }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch subcon orders
  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchSubconByProject(projectId);
      setOrders(data.orders || []); // assuming backend returns { orders: [...] }
    } catch (err) {
      console.error("Error fetching subcon orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) loadOrders();
  }, [projectId]);

  // Handle new order
  const handleCreateOrder = async (data) => {
    try {
      await createSubcon({ ...data, projectId });
      setModalOpen(false);
      loadOrders(); // refresh list
    } catch (err) {
      console.error("Error creating subcon order:", err);
    }
  };

  if (loading) {
    return <p className="text-gray-500 text-center">Loading...</p>;
  }

  // If no orders → show empty state
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] w-full px-4 text-center">
        <div className="text-red-600 text-6xl mb-4">
          <MdConstruction />
        </div>
        <h2 className="text-lg font-semibold text-gray-700">No work order found</h2>
        <p className="text-sm text-gray-500 mb-4">
          Create a worker order so you can start using <br />
          <span className="font-medium">Sub-Contractor</span>
        </p>
        <Button
          variant="custom"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition-all"
        >
          <FaPlus size={14} />
          Sub Con Work Order
        </Button>

        <SubconModal
          projectId={projectId}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateOrder}
          fetchTodos={fetchTodos}
          fetchTasks={fetchTasks}
          fetchStaff={fetchStaff}
        />
      </div>
    );
  }

  // Else show table of subcon orders
  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Subcon Work Orders</h2>
        <Button
          variant="custom"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          <FaPlus size={14} />
          Create Order
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-left text-sm">Todo</th>
              <th className="px-4 py-2 border-b text-left text-sm">Task</th>
              <th className="px-4 py-2 border-b text-left text-sm">Staff</th>
              <th className="px-4 py-2 border-b text-left text-sm">Amount</th>
              <th className="px-4 py-2 border-b text-left text-sm">Status</th>
              <th className="px-4 py-2 border-b text-left text-sm">Start Date</th>
              <th className="px-4 py-2 border-b text-left text-sm">End Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-sm">{order.todo?.title || "-"}</td>
                <td className="px-4 py-2 border-b text-sm">{order.task?.name || "-"}</td>
                <td className="px-4 py-2 border-b text-sm">{order.staff?.name || "-"}</td>
                <td className="px-4 py-2 border-b text-sm">{order.amount}</td>
                <td className="px-4 py-2 border-b text-sm capitalize">{order.status}</td>
                <td className="px-4 py-2 border-b text-sm">
                  {order.startDate ? new Date(order.startDate).toLocaleDateString() : "-"}
                </td>
                <td className="px-4 py-2 border-b text-sm">
                  {order.endDate ? new Date(order.endDate).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SubconModal
        projectId={projectId}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateOrder}
        fetchTodos={fetchTodos}
        fetchTasks={fetchTasks}
        fetchStaff={fetchStaff}
      />
    </div>
  );
}

export default ProjectSubcon;

// import React, { useState } from "react";
// import { MdConstruction } from "react-icons/md";
// import { FaPlus } from "react-icons/fa";
// import Button from "../../../components/Button";
// import SubconModal from "./SubconComponents/SubconModal";
// // import { createSubconOrder } from "../../../services/subconServices"; // your API call

// function ProjectSubcon({ fetchTodos, fetchTasks, fetchStaff, projectId }) {
//   const [modalOpen, setModalOpen] = useState(false);

//   // const handleCreateOrder = async (data) => {
//   //   try {
//   //     await createSubconOrder({ ...data, projectId });
//   //     setModalOpen(false);
//   //   } catch (err) {
//   //     console.error(err);
//   //   }
//   // };
//   const handleCreateOrder = () => {
//     console.log("order created");
//   };
//   return (
//     <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] w-full px-4 text-center">
//       <div className="text-red-600 text-6xl mb-4">
//         <MdConstruction />
//       </div>
//       <h2 className="text-lg font-semibold text-gray-700">
//         No work order found
//       </h2>
//       <p className="text-sm text-gray-500 mb-4">
//         Create a worker order so you can start using <br />
//         <span className="font-medium">Sub-Contractor</span>
//       </p>
//       <Button
//         variant="custom"
//         onClick={() => setModalOpen(true)}
//         className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition-all"
//       >
//         <FaPlus size={14} />
//         Sub Con Work Order
//       </Button>

//       <SubconModal
//         projectId={projectId}
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSubmit={handleCreateOrder}
//         fetchTodos={fetchTodos}
//         fetchTasks={fetchTasks}
//         fetchStaff={fetchStaff}
//       />
//     </div>
//   );
// }

// export default ProjectSubcon;
