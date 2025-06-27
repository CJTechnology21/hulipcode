import axios from 'axios'
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity, removeFromCart } from '../../app/features/cart/cartSlice'
import Header from "./Header";
import { useNavigate } from 'react-router-dom';


function CartScreen() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const token = localStorage.getItem("crm_token");

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(removeFromCart(productId));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const handleIncrement = async (item) => {
    const updatedQty = item.quantity + 1;
    try {
      await axios.put(
        `http://localhost:5000/api/cart/${item._id}`,
        { quantity: updatedQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(incrementQuantity(item._id));
    } catch (err) {
      console.error("Failed to increment quantity:", err);
    }
  };

  const handleDecrement = async (item) => {
    if (item.quantity <= 1) return;
    const updatedQty = item.quantity - 1;
    try {
      await axios.put(
        `http://localhost:5000/api/cart/${item._id}`,
        { quantity: updatedQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(decrementQuantity(item._id));
    } catch (err) {
      console.error("Failed to decrement quantity:", err);
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
                      onClick={() => handleRemove(item._id)}
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


// function CartScreen() {
//   const dispatch = useDispatch();
//   const cartItems = useSelector((state) => state.cart.items);
//   const navigate = useNavigate();

//   const subtotal = cartItems.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );
// const handleRemove = async (productId) => {
//     const token = localStorage.getItem("crm_token");
//     try {
//       await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       dispatch(removeFromCart(productId)); // update redux store
//     } catch (err) {
//       console.error("Failed to remove item:", err);
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
//             {/* Cart Items List */}
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
//                         onClick={() => dispatch(decrementQuantity(item._id))}
//                         className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
//                       >
//                         -
//                       </button>
//                       <span>{item.quantity}</span>
//                       <button
//                         onClick={() => dispatch(incrementQuantity(item._id))}
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

//             {/* Summary Section */}
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
//               <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//               onClick={()=>{navigate('/checkout')}}>
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
