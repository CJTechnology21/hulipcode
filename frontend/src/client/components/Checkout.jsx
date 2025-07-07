import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { FaCreditCard, FaMoneyBillWave, FaGooglePay } from "react-icons/fa";
import { SiPaytm, SiPhonepe } from "react-icons/si";
import { MdOutlineShoppingBag } from "react-icons/md";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { clearCart } from "../../app/features/cart/cartSlice";

function Checkout() {
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
    paymentMethod: "",
    selectedOnlineMethod: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("crm_token");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(res.data);
      } catch (err) {
        console.error("Cart fetch error:", err);
      }
    };
    fetchCart();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (
      !form.fullName ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.postalCode ||
      !form.phone
    ) {
      return toast.error("Please fill all shipping details");
    }

    if (form.paymentMethod === "online" && !form.selectedOnlineMethod) {
      return toast.error("Please select an online payment method");
    }

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
          vendor: item.vendor,
        })),
        shippingAddress: {
          fullName: form.fullName,
          addressLine: form.address,
          city: form.city,
          state: form.state,
          country: form.country,
          postalCode: form.postalCode,
          phone: form.phone,
        },
        paymentMethod:
          form.paymentMethod === "online" ? form.selectedOnlineMethod : "COD",
        totalAmount: subtotal,
         rewardPointsUsed: form.rewardPointsUsed || 0, // ✅ Ensure this exists
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE}/api/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const placedOrder = response.data.order;
      toast.success(`✅ Order placed by ${placedOrder.buyer.name}`);

      await axios.delete(`${process.env.REACT_APP_API_BASE}/api/cart/clear`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems([]);
      dispatch(clearCart());
    } catch (err) {
      console.error("Order placement failed:", err);
      toast.error("❌ Failed to place order");
    }
  };

  return (
    <div className="bg-[#f7f8fa] min-h-screen font-[Poppins]">
      <Header />
      <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Summary */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">🛍️ Review Your Items</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl shadow hover:shadow-md transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-gray-700">{item.name}</h3>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right font-medium text-blue-600 text-lg">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Shipping & Payment */}
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">📦 Shipping Info</h2>
          <div className="space-y-3">
            {[
              { name: "fullName", placeholder: "Full Name" },
              { name: "address", placeholder: "Address" },
              { name: "city", placeholder: "City" },
              { name: "state", placeholder: "State" },
              { name: "country", placeholder: "Country" },
              { name: "postalCode", placeholder: "Postal Code" },
              { name: "phone", placeholder: "Phone Number" },
            ].map((field) => (
              <input
                key={field.name}
                type="text"
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              />
            ))}
          </div>

          {/* Payment */}
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-2">💳 Payment Method</h2>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={form.paymentMethod === "cod"}
                  onChange={handleChange}
                />
                <FaMoneyBillWave className="text-green-600" />
                Cash on Delivery
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={form.paymentMethod === "online"}
                  onChange={handleChange}
                />
                <FaCreditCard className="text-blue-600" />
                Online Payment
              </label>
            </div>

            {form.paymentMethod === "online" && (
              <div className="mt-4 space-y-2">
                <p className="font-medium text-sm text-gray-600">Select method:</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "upi", name: "UPI", icon: <FaGooglePay className="text-blue-700" /> },
                    { id: "card", name: "Credit/Debit Card", icon: <FaCreditCard /> },
                    { id: "paytm", name: "Paytm", icon: <SiPaytm className="text-blue-500" /> },
                    { id: "phonepe", name: "PhonePe", icon: <SiPhonepe className="text-purple-600" /> },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-2 border p-2 rounded-md cursor-pointer ${
                        form.selectedOnlineMethod === method.name
                          ? "border-blue-600 bg-blue-50"
                          : "hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="selectedOnlineMethod"
                        value={method.name}
                        checked={form.selectedOnlineMethod === method.name}
                        onChange={handleChange}
                        className="hidden"
                      />
                      {method.icon}
                      <span>{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-3 pt-4">
            <button
              className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg"
              onClick={() => navigate("/")}
            >
              Back to Shop
            </button>
            <button
              onClick={handlePlaceOrder}
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <MdOutlineShoppingBag size={18} />
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Header from "./Header";
// import { useNavigate } from "react-router-dom";
// import { FaCreditCard, FaMoneyBillWave, FaGooglePay } from "react-icons/fa";
// import { SiPaytm, SiPhonepe } from "react-icons/si";
// import { MdOutlineShoppingBag } from "react-icons/md";
// import { toast } from "react-toastify";
// import { useDispatch } from "react-redux";
// import { clearCart } from "../../app/features/cart/cartSlice";
// function Checkout() {
//   const dispatch = useDispatch();

//   const [cartItems, setCartItems] = useState([]);
//   const [form, setForm] = useState({
//     fullName: "",
//     address: "",
//     city: "",
//     state: "",
//     country: "",
//     postalCode: "",
//     phone: "",
//     paymentMethod: "",
//     selectedOnlineMethod: "",
//   });

//   const navigate = useNavigate();
//   const token = localStorage.getItem("crm_token");

//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const res = await axios.get(`${process.env.REACT_APP_API_BASE}/api/cart`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setCartItems(res.data);
//       } catch (err) {
//         console.error("Cart fetch error:", err);
//       }
//     };
//     fetchCart();
//   }, [token]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const subtotal = cartItems.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );

//   const handlePlaceOrder = async () => {
//     if (
//       !form.fullName ||
//       !form.address ||
//       !form.city ||
//       !form.state ||
//       !form.postalCode ||
//       !form.phone
//     ) {
//       return toast.error("Please fill all shipping details");
//     }

//     if (form.paymentMethod === "online" && !form.selectedOnlineMethod) {
//       return toast.error("Please select an online payment method");
//     }

//     try {
//       const orderData = {
//         items: cartItems.map((item) => ({
//           product: item._id,
//           name: item.name,
//           image: item.image,
//           quantity: item.quantity,
//           price: item.price,
//           vendor: item.vendor, // 🔁 make sure this exists
//         })),
//         shippingAddress: {
//           fullName: form.fullName,
//           addressLine: form.address,
//           city: form.city,
//           state: form.state,
//           country: form.country,
//           postalCode: form.postalCode,
//           phone: form.phone,
//         },
//         paymentMethod:
//           form.paymentMethod === "online" ? form.selectedOnlineMethod : "COD",
//         totalAmount: subtotal,
//       };

//       const response = await axios.post(
//         `${process.env.REACT_APP_API_BASE}/api/orders`,
//         orderData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const placedOrder = response.data.order;

//       toast.success(`✅ Order placed by ${placedOrder.buyer.name}`);

//       await axios.delete( `${process.env.REACT_APP_API_BASE}/api/cart/clear`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setCartItems([]); // ✅ Clear local state
//       dispatch(clearCart()); // Clear from UI
//     } catch (err) {
//       console.error("Order placement failed:", err);
//       toast.error("❌ Failed to place order");
//     }
//   };

//   return (
//     <div className="bg-[#f7f8fa] min-h-screen font-[Poppins]">
//       <Header />
//       <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Products */}
//         <div className="lg:col-span-2 space-y-6">
//           <h2 className="text-2xl font-bold text-gray-800">
//             🛍️ Review Your Items
//           </h2>
//           {cartItems.length === 0 ? (
//             <p className="text-gray-500">Your cart is empty.</p>
//           ) : (
//             cartItems.map((item) => (
//               <div
//                 key={item._id}
//                 className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl shadow hover:shadow-md transition"
//               >
//                 <img
//                   src={item.image}
//                   alt={item.name}
//                   className="w-24 h-24 object-cover rounded-lg"
//                 />
//                 <div className="flex-1 text-center sm:text-left">
//                   <h3 className="text-lg font-semibold text-gray-700">
//                     {item.name}
//                   </h3>
//                   <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                   {/* <p className="text-sm text-gray-500">Qty: {item.Ve}</p> */}
//                 </div>
//                 <div className="text-right font-medium text-blue-600 text-lg">
//                   ₹{item.price * item.quantity}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Shipping + Payment */}
//         <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
//           <h2 className="text-xl font-semibold text-gray-800">
//             📦 Shipping Info
//           </h2>
//           <div className="space-y-3">
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={form.fullName}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-300 outline-none"
//             />
//             <input
//               type="text"
//               name="address"
//               placeholder="Address"
//               value={form.address}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded-md"
//             />
//             <input
//               type="text"
//               name="city"
//               placeholder="City"
//               value={form.city}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded-md"
//             />
//             <input
//               type="text"
//               name="state"
//               placeholder="State"
//               value={form.state}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded-md"
//             />
//             <input
//               type="text"
//               name="country"
//               placeholder="country"
//               value={form.country}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded-md"
//             />

//             <input
//               type="text"
//               name="postalCode"
//               placeholder="Postal Code"
//               value={form.postalCode}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded-md"
//             />
//             <input
//               type="text"
//               name="phone"
//               placeholder="Phone Number"
//               value={form.phone}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded-md"
//             />
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold mt-6 mb-2">
//               💳 Payment Method
//             </h2>
//             <div className="flex flex-col gap-3">
//               <label className="flex items-center gap-3">
//                 <input
//                   type="radio"
//                   name="paymentMethod"
//                   value="cod"
//                   checked={form.paymentMethod === "cod"}
//                   onChange={handleChange}
//                 />
//                 <FaMoneyBillWave className="text-green-600" />
//                 Cash on Delivery
//               </label>
//               <label className="flex items-center gap-3">
//                 <input
//                   type="radio"
//                   name="paymentMethod"
//                   value="online"
//                   checked={form.paymentMethod === "online"}
//                   onChange={handleChange}
//                 />
//                 <FaCreditCard className="text-blue-600" />
//                 Online Payment
//               </label>
//             </div>

//             {/* Show online payment options */}
//             {form.paymentMethod === "online" && (
//               <div className="mt-4 space-y-2">
//                 <p className="font-medium text-sm text-gray-600">
//                   Select method:
//                 </p>
//                 <div className="grid grid-cols-2 gap-3">
//                   {[
//                     {
//                       id: "upi",
//                       name: "UPI",
//                       icon: <FaGooglePay className="text-blue-700" />,
//                     },
//                     {
//                       id: "card",
//                       name: "Credit/Debit Card",
//                       icon: <FaCreditCard />,
//                     },
//                     {
//                       id: "paytm",
//                       name: "Paytm",
//                       icon: <SiPaytm className="text-blue-500" />,
//                     },
//                     {
//                       id: "phonepe",
//                       name: "PhonePe",
//                       icon: <SiPhonepe className="text-purple-600" />,
//                     },
//                   ].map((method) => (
//                     <label
//                       key={method.id}
//                       className={`flex items-center gap-2 border p-2 rounded-md cursor-pointer ${
//                         form.selectedOnlineMethod === method.name
//                           ? "border-blue-600 bg-blue-50"
//                           : "hover:border-gray-400"
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         name="selectedOnlineMethod"
//                         value={method.name}
//                         checked={form.selectedOnlineMethod === method.name}
//                         onChange={handleChange}
//                         className="hidden"
//                       />
//                       {method.icon}
//                       <span>{method.name}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Summary */}
//           <div className="border-t pt-4 space-y-2">
//             <div className="flex justify-between text-sm text-gray-600">
//               <span>Subtotal</span>
//               <span>₹{subtotal.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between text-sm text-green-600">
//               <span>Shipping</span>
//               <span>Free</span>
//             </div>
//             <div className="flex justify-between font-bold text-lg border-t pt-2">
//               <span>Total</span>
//               <span>₹{subtotal.toLocaleString()}</span>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-between gap-3 pt-4">
//             <button
//               className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg"
//               onClick={() => navigate("/")}
//             >
//               Back to Shop
//             </button>
//             <button
//               onClick={handlePlaceOrder}
//               className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
//             >
//               <MdOutlineShoppingBag size={18} />
//               Place Order
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Checkout;
