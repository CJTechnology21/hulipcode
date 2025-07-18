import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaGooglePay,
} from "react-icons/fa";
import { SiPaytm, SiPhonepe } from "react-icons/si";
import { MdOutlineShoppingBag } from "react-icons/md";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { clearCart } from "../../app/features/cart/cartSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Input from "../../components/Input";
import Button from "../../components/Button";

import {
  getCartAPI,
  getUserRewardPointsAPI,
} from "../../services/cartServices";
import {
  placeOrderAPI,
  clearCartAPI,
} from "../../services/orderServices";

const schema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),
  postalCode: yup.string().required("Postal code is required"),
  phone: yup.string().required("Phone number is required"),
  paymentMethod: yup.string().required("Payment method is required"),
  rewardPointsUsed: yup
    .number()
    .min(0, "Cannot be negative")
    .typeError("Must be a number"),
});

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [selectedOnlineMethod, setSelectedOnlineMethod] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      phone: "",
      paymentMethod: "",
      rewardPointsUsed: 0,
    },
  });

  const paymentMethod = watch("paymentMethod");
  const rewardPointsUsed = Math.min(
    parseInt(watch("rewardPointsUsed") || 0),
    rewardPoints
  );

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = Math.max(subtotal - rewardPointsUsed, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [items, points] = await Promise.all([
          getCartAPI(),
          getUserRewardPointsAPI(),
        ]);
        setCartItems(items);
        setRewardPoints(points);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch cart or user info");
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    if (data.paymentMethod === "online" && !selectedOnlineMethod) {
      toast.error("Please select an online payment method");
      return;
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
          fullName: data.fullName,
          addressLine: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          postalCode: data.postalCode,
          phone: data.phone,
        },
        paymentMethod:
          data.paymentMethod === "online" ? selectedOnlineMethod : "COD",
        totalAmount: total,
        rewardPointsUsed,
      };

      const res = await placeOrderAPI(orderData);

      toast.success(`✅ Order placed by ${res.order.buyer.name}`);
      if (res.rewardPointsEarned > 0) {
        toast.info(`🎁 You earned ${res.rewardPointsEarned} reward points!`);
      }

      await clearCartAPI();
      setCartItems([]);
      dispatch(clearCart());
      navigate("/orders");
    } catch (err) {
      console.error("Order error:", err);
      toast.error("❌ Failed to place order");
    }
  };

  return (
    <div className="bg-[#f7f8fa] min-h-screen font-[Poppins]">
      <Header />
      <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Review Your Items</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl shadow"
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

        {/* Right: Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 rounded-xl shadow-lg space-y-6"
        >
          <h2 className="text-xl font-semibold text-gray-800">Shipping Info</h2>

          {["fullName", "address", "city", "state", "country", "postalCode", "phone"].map(
            (field) => (
              <Input
                key={field}
                name={field}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                register={register}
                error={errors[field]}
              />
            )
          )}

          {/* Reward Points */}
          <div>
            <p className="text-sm text-gray-700 font-medium">
              Available Points: <span className="text-green-600">{rewardPoints}</span>
            </p>
            <Input
              name="rewardPointsUsed"
              type="number"
              placeholder="Points to use"
              register={register}
              error={errors.rewardPointsUsed}
            />
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-md font-medium mb-2">Payment Method</h3>
            <div className="flex flex-col gap-2 text-sm">
              <label className="flex items-center gap-2">
                <input type="radio" value="cod" {...register("paymentMethod")} />
                <FaMoneyBillWave /> Cash on Delivery
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="online" {...register("paymentMethod")} />
                <FaCreditCard /> Online Payment
              </label>
              {errors.paymentMethod && (
                <p className="text-red-500">{errors.paymentMethod.message}</p>
              )}
            </div>
          </div>

          {paymentMethod === "online" && (
            <div>
              <p className="text-sm text-gray-700">Select Payment Platform</p>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {[
                  { id: "UPI", icon: <FaGooglePay /> },
                  { id: "Card", icon: <FaCreditCard /> },
                  { id: "Paytm", icon: <SiPaytm /> },
                  { id: "PhonePe", icon: <SiPhonepe /> },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-2 border p-2 rounded-md cursor-pointer ${
                      selectedOnlineMethod === method.id
                        ? "border-blue-600 bg-blue-50"
                        : "hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedOnlineMethod(method.id)}
                  >
                    {method.icon}
                    {method.id}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Points Used</span>
              <span>-₹{rewardPointsUsed}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button type="button" onClick={() => navigate("/")}>
              Back to Shop
            </Button>
            <Button type="submit">
              Place Order <MdOutlineShoppingBag />
            </Button>
          </div>
        </form>
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
//   const [rewardPoints, setRewardPoints] = useState(0);
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
//     rewardPointsUsed: 0,
//   });

//   const navigate = useNavigate();
//   const token = localStorage.getItem("crm_token");
//   // console.log("API_URL:", process.env.REACT_APP_API_URL);
//   useEffect(() => {
//     const fetchCartAndUser = async () => {
//       try {
//         const [cartRes, userRes] = await Promise.all([
//           axios.get(`${process.env.REACT_APP_API_BASE}/api/cart`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get(`${process.env.REACT_APP_API_BASE}/api/user/me`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);
//         setCartItems(cartRes.data);
//         setRewardPoints(userRes.data.rewardPoints || 0);
//       } catch (err) {
//         console.error("Fetch error:", err);
//       }
//     };
//     fetchCartAndUser();
//   }, [token]);

//   const handleChange = (e) => {
//     let { name, value } = e.target;

//     // Handle number input for rewardPointsUsed
//     if (name === "rewardPointsUsed") {
//       value = parseInt(value || 0);
//       value = isNaN(value) ? 0 : Math.min(value, rewardPoints);
//     }

//     setForm({ ...form, [name]: value });
//   };

//   const subtotal = cartItems.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );

//   const discount = Math.min(form.rewardPointsUsed || 0, rewardPoints);
//   const totalAfterDiscount = Math.max(subtotal - discount, 0);

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
//           vendor: item.vendor,
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
//         totalAmount: totalAfterDiscount,
//         rewardPointsUsed: discount,
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

//       toast.success(`✅ Order placed by ${response.data.order.buyer.name}`);
//       if (response.data.rewardPointsEarned > 0) {
//         toast.info(
//           `🎁 You earned ${response.data.rewardPointsEarned} reward points!`
//         );
//       }

//       await axios.delete(`${process.env.REACT_APP_API_BASE}/api/cart/clear`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setCartItems([]);
//       dispatch(clearCart());
//       navigate("/orders");
//     } catch (err) {
//       console.error("Order placement failed:", err);
//       toast.error("❌ Failed to place order");
//     }
//   };

//   return (
//     <div className="bg-[#f7f8fa] min-h-screen font-[Poppins]">
//       <Header />
//       <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Product Summary */}
//         <div className="lg:col-span-2 space-y-6">
//           <h2 className="text-2xl font-bold text-gray-800">
//             Review Your Items
//           </h2>

//           {cartItems.length === 0 ? (
//             <p className="text-gray-500">Your cart is empty.</p>
//           ) : (
//             <>
//               {cartItems.map((item) => (
//                 <div
//                   key={item._id}
//                   className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl shadow"
//                 >
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="w-24 h-24 object-cover rounded-lg"
//                   />
//                   <div className="flex-1 text-center sm:text-left">
//                     <h3 className="text-lg font-semibold text-gray-700">
//                       {item.name}
//                     </h3>
//                     <p className="text-sm text-gray-500">
//                       Qty: {item.quantity}
//                     </p>
//                   </div>
//                   <div className="text-right font-medium text-blue-600 text-lg">
//                     ₹{item.price * item.quantity}
//                   </div>
//                 </div>
//               ))}

//               {/* Reward Points Summary */}
//               <div className="text-right mt-4">
//                 <p>
//                   <span className="text-gray-600">
//                     Reward Points for this Order:{" "}
//                   </span>
//                   <span className="text-green-600 font-semibold">
//                     {cartItems.reduce(
//                       (total, item) =>
//                         total + (item.rewardPoints || 0) * item.quantity,
//                       0
//                     )}
//                   </span>
//                 </p>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Shipping & Payment */}
//         <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
//           <h2 className="text-xl font-semibold text-gray-800">
//            Shipping Info
//           </h2>
//           <div className="space-y-3">
//             {[
//               { name: "fullName", placeholder: "Full Name" },
//               { name: "address", placeholder: "Address" },
//               { name: "city", placeholder: "City" },
//               { name: "state", placeholder: "State" },
//               { name: "country", placeholder: "Country" },
//               { name: "postalCode", placeholder: "Postal Code" },
//               { name: "phone", placeholder: "Phone Number" },
//             ].map((field) => (
//               <input
//                 key={field.name}
//                 type="text"
//                 name={field.name}
//                 placeholder={field.placeholder}
//                 value={form[field.name]}
//                 onChange={handleChange}
//                 className="w-full border px-3 py-2 rounded-md"
//               />
//             ))}
//           </div>

//           {/* Reward Points */}
//           <div className="pt-4">
//             <h3 className="text-sm font-medium text-gray-700">
//               Reward Points Available:{" "}
//               <span className="text-green-600 font-semibold">
//                 {rewardPoints}
//               </span>
//             </h3>
//             <input
//               type="number"
//               name="rewardPointsUsed"
//               value={form.rewardPointsUsed}
//               onChange={handleChange}
//               className="w-full mt-2 border px-3 py-2 rounded-md"
//               placeholder="Enter reward points to use"
//               max={rewardPoints}
//             />
//           </div>

//           {/* Payment */}
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

//           {/* Order Summary */}
//           <div className="border-t pt-4 space-y-2">
//             <div className="flex justify-between text-sm text-gray-600">
//               <span>Subtotal</span>
//               <span>₹{subtotal.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between text-sm text-red-600">
//               <span>Reward Points Used</span>
//               <span>-₹{discount}</span>
//             </div>
//             <div className="flex justify-between text-sm text-green-600">
//               <span>Shipping</span>
//               <span>Free</span>
//             </div>
//             <div className="flex justify-between font-bold text-lg border-t pt-2">
//               <span>Total</span>
//               <span>₹{totalAfterDiscount.toLocaleString()}</span>
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
