import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from "../../app/features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import {
  getCartAPI,
  removeFromCartAPI,
  updateCartItemAPI,
} from "../../services/cartServices";

function CartScreen() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const items = await getCartAPI();
        dispatch(setCart(items)); // ✅ Respect your setCart reducer
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    fetchCart();
  }, [dispatch]);
const handleRemove = async (item) => {
  try {
    await removeFromCartAPI(item.productId); // ✅ Matches backend
    dispatch(removeFromCart(item._id));      // ✅ Redux uses cart item's _id
  } catch (err) {
    console.error("❌ Remove failed:", err);
  }
};
  // const handleRemove = async (productId) => {
  //   try {
  //     await removeFromCartAPI(productId);
  //     dispatch(removeFromCart(productId)); // ✅ Uses your logic
  //   } catch (err) {
  //     console.error("Remove failed:", err);
  //   }
  // };

const handleIncrement = async (item) => {
  const updatedQty = item.quantity + 1;
  try {
    await updateCartItemAPI(item.productId, updatedQty);
    dispatch(incrementQuantity(item._id)); // Still use _id for Redux
  } catch (err) {
    console.error("Increment failed:", err);
  }
};

const handleDecrement = async (item) => {
  if (item.quantity <= 1) return;
  const updatedQty = item.quantity - 1;
  try {
    await updateCartItemAPI(item.productId, updatedQty);
    dispatch(decrementQuantity(item._id)); // Still use _id for Redux
  } catch (err) {
    console.error("Decrement failed:", err);
  }
};

  return (
    <div>
      <Header />
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 border rounded-lg p-4 shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-medium">{item.name}</h2>
                    <div className="flex items-center mt-2 gap-2">
                      <button
                        onClick={() => handleDecrement(item)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleIncrement(item)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-600 font-semibold">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      className="text-red-500 text-sm mt-1 hover:underline"
                      onClick={() => handleRemove(item)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border rounded-lg p-6 shadow-md h-fit">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-4 mt-4">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <button
                className="w-full mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartScreen;


// import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { incrementQuantity, decrementQuantity, removeFromCart } from '../../app/features/cart/cartSlice';
// import { useNavigate } from 'react-router-dom';

// import Header from "./Header";
// import {
//   removeFromCartAPI,
//   updateCartItemAPI,
// } from "../../services/cartServices"; // ✅ updated imports

// function CartScreen() {
//   const dispatch = useDispatch();
//   const cartItems = useSelector((state) => state.cart.items);
//   const navigate = useNavigate();

//   const subtotal = cartItems.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );

//   useEffect(() => {
//     console.log("Cart Items:", cartItems);
//   }, [cartItems]);

//   const handleRemove = async (productId) => {
//     try {
//       await removeFromCartAPI(productId); // ✅ use service function
//       dispatch(removeFromCart(productId));
//     } catch (err) {
//       // console.error("Failed to remove item:", err);
//     }
//   };

//   const handleIncrement = async (item) => {
//     const updatedQty = item.quantity + 1;
//     try {
//       await updateCartItemAPI(item._id, updatedQty); // ✅ use service function
//       dispatch(incrementQuantity(item._id));
//     } catch (err) {
//       // console.error("Failed to increment quantity:", err);
//     }
//   };

//   const handleDecrement = async (item) => {
//     if (item.quantity <= 1) return;
//     const updatedQty = item.quantity - 1;
//     try {
//       await updateCartItemAPI(item._id, updatedQty); // ✅ use service function
//       dispatch(decrementQuantity(item._id));
//     } catch (err) {
//       console.error("Failed to decrement quantity:", err);
//     }
//   };

//   return (
//     <div>
//       <Header />
//       <div className="max-w-[1200px] mx-auto px-4 py-8">
//         <h1 className="text-3xl font-semibold mb-6">Shopping Cart</h1>

//         {cartItems.length === 0 ? (
//           <p>Your cart is empty.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="md:col-span-2 space-y-4">
//               {cartItems.map((item) => (
//                 <div
//                   key={item._id}
//                   className="flex items-center gap-4 border rounded-lg p-4 shadow-sm"
//                 >
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="w-24 h-24 object-cover rounded"
//                   />
//                   <div className="flex-1">
//                     <h2 className="text-lg font-medium">{item.name}</h2>
//                     <div className="flex items-center mt-2 gap-2">
//                       <button
//                         onClick={() => handleDecrement(item)}
//                         className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
//                       >
//                         -
//                       </button>
//                       <span>{item.quantity}</span>
//                       <button
//                         onClick={() => handleIncrement(item)}
//                         className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
//                       >
//                         +
//                       </button>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-blue-600 font-semibold">
//                       ₹{(item.price * item.quantity).toLocaleString()}
//                     </p>
//                     <button
//                       className="text-red-500 text-sm mt-1 hover:underline"
//                       onClick={() => handleRemove(item._id)}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="border rounded-lg p-6 shadow-md h-fit">
//               <h2 className="text-xl font-semibold mb-4">Summary</h2>
//               <div className="flex justify-between mb-2">
//                 <span>Subtotal</span>
//                 <span className="font-medium">₹{subtotal.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between mb-2">
//                 <span>Shipping</span>
//                 <span className="text-green-600">Free</span>
//               </div>
//               <div className="flex justify-between text-lg font-semibold border-t pt-4 mt-4">
//                 <span>Total</span>
//                 <span>₹{subtotal.toLocaleString()}</span>
//               </div>
//               <button
//                 className="w-full mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//                 onClick={() => navigate("/checkout")}
//               >
//                 Proceed to Checkout
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default CartScreen;