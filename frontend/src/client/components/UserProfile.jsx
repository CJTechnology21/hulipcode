import React from "react";
import ArchitectProfileView from "./ArchitectProfileView";
import ClientProfileView from "./ClientProfileView";
import Header from "../components/Header";

export default function UserProfile() {
  const roleFromStorage = localStorage.getItem("crm_role");

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      {roleFromStorage === "architect" ? (
        <ArchitectProfileView />
      ) : (
        <ClientProfileView />
      )}
    </div>
  );
}


// import React, { useEffect, useState } from "react";
// import Header from "../components/Header";
// import { useNavigate } from "react-router-dom";
// import ClipLoader from "react-spinners/ClipLoader";
// import ProductCard from "../components/ProductCard";
// import { getFavouritesAPI } from "../../services/productServices";
// import { getOrdersAPI } from "../../services/orderServices";
// import { useAuth } from "../../context/AuthContext"; // adjust path if needed

// function UserProfile() {
//   const { user, loading: authLoading } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [favourites, setFavourites] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const roleFromStorage = localStorage.getItem("crm_role");

//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         const [ordersData, favouritesData] = await Promise.all([
//           getOrdersAPI(),
//           getFavouritesAPI(),
//         ]);

//         setOrders(ordersData || []);
//         setFavourites(favouritesData || []);
//       } catch (err) {
//         console.error("❌ Failed to fetch orders or favourites:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (!authLoading && user) {
//       fetchDetails();
//     }
//   }, [authLoading, user]);

//   if (authLoading || loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <Header />
//         <ClipLoader color="#1f2937" size={50} />
//         <p className="mt-4 text-gray-500">Loading user profile...</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div>
//         <Header />
//         <div className="p-8 text-center text-red-500 font-semibold">
//           ❌ Failed to load user profile.
//         </div>
//       </div>
//     );
//   }

//   const displayRole = user.role || roleFromStorage;
//   const orderedProducts = orders.flatMap((order) => order.products).filter(Boolean);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Header />

//       <div className="max-w-6xl mx-auto p-6 mt-10">
//         {/* User Info Card */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-10">
//           <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">👤 User Profile</h1>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
//             <div>
//               <p className="text-sm font-semibold text-gray-500">Name</p>
//               <p className="text-lg">{user.name || "N/A"}</p>
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-gray-500">Email</p>
//               <p className="text-lg">{user.email || "N/A"}</p>
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-gray-500">Phone Number</p>
//               <p className="text-lg">{user.phoneNumber || "N/A"}</p>
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-gray-500">Role</p>
//               <p className="text-lg capitalize">{displayRole || "N/A"}</p>
//             </div>
//             {displayRole === "architect" && (
//               <div className="sm:col-span-2">
//                 <p className="text-sm font-semibold text-gray-500">Reward Points</p>
//                 <p className="text-lg text-green-600 font-bold">{user.rewardPoints ?? 0}</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Ordered Products */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-10">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-semibold text-gray-800">🛒 Previous Orders</h2>
//           </div>
//           {orderedProducts.length === 0 ? (
//             <p className="text-gray-500">No previous orders found.</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {orderedProducts.map((product, index) => (
//                 <div
//                   key={index}
//                   className="cursor-pointer"
//                   onClick={() => navigate(`/products/${product._id}`)}
//                 >
//                   <ProductCard product={product} />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Favourite Products */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-10">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-semibold text-gray-800">❤️ Favourites</h2>
//             <button
//               onClick={() => navigate("/favourites")}
//               className="text-blue-500 hover:underline text-sm"
//             >
//               See All
//             </button>
//           </div>
//           {favourites.length === 0 ? (
//             <p className="text-gray-500">You haven't added any favourites yet.</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {favourites
//                 .filter((fav) => fav.productId !== null)
//                 .slice(0, 4)
//                 .map((fav) => (
//                   <div
//                     key={fav._id}
//                     className="cursor-pointer"
//                     onClick={() => navigate(`/products/${fav.productId._id}`)}
//                   >
//                     <ProductCard product={fav.productId} />
//                   </div>
//                 ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UserProfile;
