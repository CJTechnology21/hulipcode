// src/components/Cart.jsx
import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, setCart } from "../../app/features/cart/cartSlice";
import {
  getUserRewardPointsAPI,
  getCartAPI,
  removeFromCartAPI,
} from "../../services/cartServices";

const Cart = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.items) || [];

  const [redeemedPoints, setRedeemedPoints] = useState(0);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountedTotal = total - redeemedPoints;

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const items = await getCartAPI();
        dispatch(setCart(items));
      } catch (err) {
        console.error("❌ Failed to fetch cart:", err);
      }
    };

    if (isOpen) {
      fetchCart();
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const rewardPoints = await getUserRewardPointsAPI();
        const maxRedeemable = Math.min(total * 0.1, rewardPoints);
        setRedeemedPoints(maxRedeemable);
      } catch (err) {
        console.error("❌ Failed to fetch reward points:", err);
      }
    };

    if (isOpen && cartItems.length > 0) {
      fetchPoints();
    }
  }, [isOpen, cartItems, total]);

  const handleRemove = async (id) => {
    dispatch(removeFromCart(id)); // Optimistic update
    try {
      await removeFromCartAPI(id);
    } catch (err) {
      console.error("❌ Server failed to remove cart item:", err);
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
            cartItems.map((item, index) => (
              <div
                key={item._id || `${item.name}-${item.price}-${index}`}
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

        <div className="border-t px-5 py-4 space-y-2">
          <div className="flex justify-between items-center font-medium">
            <span>Subtotal</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          {redeemedPoints > 0 && (
            <div className="flex justify-between items-center text-green-600 text-sm">
              <span>Reward Points Applied</span>
              <span>-₹{redeemedPoints.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between items-center font-semibold text-blue-600">
            <span>Total</span>
            <span>₹{discountedTotal.toLocaleString()}</span>
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

          <button
            className="border px-4 py-2 rounded-full text-sm font-medium"
            onClick={() => {
              onClose();
              navigate("/checkout", {
                state: {
                  redeemedPoints,
                  discountedTotal,
                },
              });
            }}
          >
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
// // src/components/Cart.jsx
// import React, { useEffect, useState } from "react";
// import { FiX } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { removeFromCart, setCart } from "../../app/features/cart/cartSlice";
// import {
//   getUserRewardPointsAPI,
//   getCartAPI,
//   removeFromCartAPI,
// } from "../../services/cartServices";

// const Cart = ({ isOpen, onClose }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const cartItems = useSelector((state) => state.cart?.items) || [];

//   const [redeemedPoints, setRedeemedPoints] = useState(0);

//   const total = cartItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );
//   const discountedTotal = total - redeemedPoints;

//   // ✅ Fetch cart items when drawer opens
//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const items = await getCartAPI();
//         // console.log("✅ Cart API returned (Cart.jsx):", items);
//         dispatch(setCart(items));
//       } catch (err) {
//         console.error("❌ Failed to fetch cart:", err);
//       }
//     };

//     if (isOpen) {
//       fetchCart();
//     }
//   }, [isOpen, dispatch]);

//   // ✅ Fetch reward points after cart updates
//   useEffect(() => {
//     const fetchPoints = async () => {
//       try {
//         const rewardPoints = await getUserRewardPointsAPI();
//         const maxRedeemable = Math.min(total * 0.1, rewardPoints); // Max 10%
//         setRedeemedPoints(maxRedeemable);
//       } catch (err) {
//         console.error("❌ Failed to fetch reward points:", err);
//       }
//     };

//     if (isOpen && cartItems.length > 0) {
//       fetchPoints();
//     }
//   }, [isOpen, cartItems, total]);

//   const handleRemove = async (id) => {
//     dispatch(removeFromCart(id)); // Optimistic update
//     try {
//       await removeFromCartAPI(id);
//     } catch (err) {
//       // console.error("❌ Server failed to remove cart item:", err);
//     }
//   };

//   return (
//     <>
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
//           onClick={onClose}
//         />
//       )}

//       <div
//         className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white z-50 shadow-lg transform transition-transform duration-300 ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* Header */}
//         <div className="p-5 flex justify-between items-center border-b">
//           <h2 className="text-xl font-semibold">Shopping Cart</h2>
//           <button onClick={onClose}>
//             <FiX size={22} />
//           </button>
//         </div>

//         {/* Cart Items */}
//         <div className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
//           {cartItems.length === 0 ? (
//             <p className="text-center text-gray-500">Your cart is empty.</p>
//           ) : (
//             cartItems.map((item) => (
//               <div
//                 key={item._id}
//                 className="flex items-center gap-4 border rounded-lg p-2 shadow-sm"
//               >
//                 <img
//                   src={item.image}
//                   alt={item.name}
//                   className="w-16 h-16 object-cover rounded"
//                 />
//                 <div className="flex-1">
//                   <p className="font-medium">{item.name}</p>
//                   <p className="text-sm text-gray-600">
//                     {item.quantity} x{" "}
//                     <span className="text-blue-600">₹{item.price}</span>
//                   </p>
//                 </div>
//                 <button onClick={() => handleRemove(item._id)}>
//                   <FiX size={16} className="text-gray-500" />
//                 </button>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Price Summary */}
//         <div className="border-t px-5 py-4 space-y-2">
//           <div className="flex justify-between items-center font-medium">
//             <span>Subtotal</span>
//             <span>₹{total.toLocaleString()}</span>
//           </div>

//           {redeemedPoints > 0 && (
//             <div className="flex justify-between items-center text-green-600 text-sm">
//               <span>Reward Points Applied</span>
//               <span>-₹{redeemedPoints.toLocaleString()}</span>
//             </div>
//           )}

//           <div className="flex justify-between items-center font-semibold text-blue-600">
//             <span>Total</span>
//             <span>₹{discountedTotal.toLocaleString()}</span>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-around gap-2 p-4 border-t">
//           <button
//             className="border px-4 py-2 rounded-full text-sm font-medium"
//             onClick={() => {
//               onClose();
//               navigate("/cartscreen");
//             }}
//           >
//             Cart
//           </button>

//           <button
//             className="border px-4 py-2 rounded-full text-sm font-medium"
//             onClick={() => {
//               onClose();
//               navigate("/checkout", {
//                 state: {
//                   redeemedPoints,
//                   discountedTotal,
//                 },
//               });
//             }}
//           >
//             Checkout
//           </button>

//           <button className="border px-4 py-2 rounded-full text-sm font-medium">
//             Comparison
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Cart;
