import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { removeFromCart, addToCart } from "../../app/features/cart/cartSlice";

const Cart = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.items) || [];

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ✅ Fetch saved cart from backend when cart opens

  const useFetchCart = (isOpen) => {
    const dispatch = useDispatch();

    useEffect(() => {
      const fetchCart = async () => {
        const token = localStorage.getItem("crm_token");
        if (!token) return;

        try {
          const res = await axios.get("http://localhost:5000/api/cart", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const savedItems = res.data.items || []; // <-- expect correct format
          savedItems.forEach((item) => {
            dispatch(addToCart({ ...item, quantity: item.quantity || 1 }));
          });
        } catch (err) {
          console.error("Error fetching cart:", err);
        }
      };

      if (isOpen) {
        fetchCart();
      }
    }, [isOpen, dispatch]);
  };
  const handleRemove = async (id) => {
    dispatch(removeFromCart(id));

    try {
      const token = localStorage.getItem("crm_token");
      await axios.delete(`http://localhost:5000/api/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Failed to remove item from server cart:", err);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white z-50 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <button onClick={onClose}>
            <FiX size={22} />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 border rounded-lg p-2 shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} x{" "}
                    <span className="text-blue-600">₹{item.price}</span>
                  </p>
                </div>
                <button onClick={() => handleRemove(item._id)}>
                  <FiX size={16} className="text-gray-500" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t px-5 py-4">
          <div className="flex justify-between items-center font-semibold">
            <span>Subtotal</span>
            <span className="text-blue-600">₹{total.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex justify-around gap-2 p-4 border-t">
          <button
            className="border px-4 py-2 rounded-full text-sm font-medium"
            onClick={() => {
              onClose();
              navigate("/cartscreen");
            }}
          >
            Cart
          </button>
          <button className="border px-4 py-2 rounded-full text-sm font-medium">
            Checkout
          </button>
          <button className="border px-4 py-2 rounded-full text-sm font-medium">
            Comparison
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
