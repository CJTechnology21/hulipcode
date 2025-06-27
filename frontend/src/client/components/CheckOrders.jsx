
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { toast } from "react-toastify";
import {
  FaBoxOpen,
  FaBarcode,
  FaEdit,
  FaMapMarkerAlt,
  FaListUl,
} from "react-icons/fa";
import SubscriptionVendor from "./SubscribeVendor";

function CheckOrders() {
  const [orders, setOrders] = useState([]);
  const [isVendor, setIsVendor] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState({});
  const token = localStorage.getItem("crm_token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders/vendor-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const role = res.data.role || localStorage.getItem("crm_user_role");
        if (role === "vendor") {
          setOrders(res.data.orders || []);
          setIsVendor(true);
        } else {
          setIsVendor(false);
        }
      } catch (err) {
        console.error("Failed to fetch vendor orders", err);
        toast.error("You are not authorized to view orders");
        setIsVendor(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));
  };

  const updateStatus = async (orderId) => {
    const newStatus = statusUpdates[orderId];
    if (!newStatus) return toast.warning("Please select a status");

    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(" Order status updated");
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setStatusUpdates((prev) => ({ ...prev, [orderId]: "" }));
    } catch (err) {
      console.error("Status Update Error:", err);
      toast.error("Failed to update status");
    }
  };

//   useEffect(() => {
//   const interval = setInterval(async () => {
//     if (!isVendor || orders.length === 0) return;

//     const latestTime = orders[0]?.createdAt || new Date().toISOString();

//     try {
//       const res = await axios.get(`http://localhost:5000/api/orders/vendor-new?after=${latestTime}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.data.newOrders.length > 0) {
//         toast.info(`📦 ${res.data.newOrders.length} new order(s) received!`);
//         setOrders(prev => [...res.data.newOrders, ...prev]);
//       }
//     } catch (error) {
//       console.error("Polling error:", error);
//     }
//   }, 10000); // every 10 seconds

//   return () => clearInterval(interval);
// }, [isVendor, orders, token]);


  return (
    <div className="min-h-screen bg-gray-50 font-[Poppins]">
      <Header />
      <SubscriptionVendor/>
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaBoxOpen /> Vendor Orders
        </h2>

        {!isVendor ? (
          <div className="text-red-500 font-semibold">
            You are not authorized to view orders.
          </div>
        ) : orders.length === 0 ? (
          <div>No orders found for this vendor.</div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow rounded-lg p-5 border border-gray-200"
              >
                <div className="flex justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <FaBarcode /> Order ID: {order._id}
                    </h3>
                    <p className="text-gray-700">
                      Buyer: <span className="text-blue-600">{order.buyer?.name || "N/A"}</span>
                    </p>
                    <p className="text-gray-600">Total: ₹{order.totalAmount}</p>
                    <p className="text-gray-600">Payment: {order.paymentMethod}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Current Status:{" "}
                      <span className="font-semibold text-green-600">
                        {order.status || "Not updated"}
                      </span>
                    </p>
                  </div>

                  <div>
                    <label className=" font-medium text-sm text-gray-700 flex items-center gap-1">
                      <FaEdit /> Update Status
                    </label>
                    <select
                      className="border px-3 py-1 mt-1 rounded-md"
                      value={statusUpdates[order._id] || ""}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Received">Received</option>
                      <option value="Packed">Packed</option>
                      <option value="Moved">Moved</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Returned">Returned</option>
                    </select>
                    <button
                      onClick={() => updateStatus(order._id)}
                      disabled={!statusUpdates[order._id]}
                      className={`ml-2 mt-1 px-3 py-1 rounded-md text-white ${
                        statusUpdates[order._id]
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Update
                    </button>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="mt-4 text-sm text-gray-700">
                  <strong className="flex items-center gap-1">
                    <FaMapMarkerAlt /> Shipping Address:
                  </strong>
                  <p>{order.shippingAddress?.fullName}</p>
                  <p>{order.shippingAddress?.addressLine}</p>
                  <p>
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                    {order.shippingAddress?.postalCode}
                  </p>
                  <p> {order.shippingAddress?.phone}</p>
                  <p> {order.shippingAddress?.country}</p>
                </div>

                {/* Items */}
                <div className="mt-4">
                  <strong className="flex items-center gap-2 text-gray-800">
                    <FaListUl /> Items:
                  </strong>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-gray-100 p-3 rounded-md"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                          <p className="font-medium text-gray-700">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} pcs × ₹{item.price}
                          </p>
                          <p className="text-sm font-semibold text-blue-600">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckOrders;
