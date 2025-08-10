import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getConnectedArchitectsAPI,
  getProjectsAPI,
  updateProfileAPI,
} from "../../services/mockServices"; // mock APIs for your domain
import ClipLoader from "react-spinners/ClipLoader";
import Button from "../../components/Button";
import { FaUser, FaBuilding, FaProjectDiagram, FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function ClientProfileView() {
  const { user, loading: authLoading, setUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phoneNumber: "" });
  const [editingProfile, setEditingProfile] = useState(false);

  const [connectedArchitects, setConnectedArchitects] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const [architects, projects] = await Promise.all([
          getConnectedArchitectsAPI(user.id),
          getProjectsAPI(user.id),
        ]);
        setConnectedArchitects(architects);
        setProjects(projects);
      } catch (err) {
        console.error("Failed to fetch client data", err);
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading && user) fetchClientData();
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <ClipLoader color="#2563eb" size={50} />
        <p className="mt-4 text-gray-500">Loading client profile...</p>
      </div>
    );
  }

  if (!user) {
    return <p className="text-center text-red-600 mt-10">No client profile found.</p>;
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      await updateProfileAPI(profileForm);
      setUser((prev) => ({ ...prev, ...profileForm }));
      setEditingProfile(false);
    } catch {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <section className="mb-8">
        <h1 className="text-3xl font-semibold flex items-center gap-2 mb-4">
          <FaUser className="text-blue-600" /> Your Profile
        </h1>
        {!editingProfile ? (
          <div className="space-y-2 text-gray-700">
            <p><strong>Name:</strong> {user.name || "N/A"}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phoneNumber || "N/A"}</p>
            <Button
              variant="custom"
              className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              onClick={() => setEditingProfile(true)}
            >
              <FaEdit className="inline mr-1" /> Edit Profile
            </Button>
          </div>
        ) : (
          <div className="space-y-3 max-w-md">
            <input
              type="text"
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              placeholder="Name"
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="email"
              name="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              placeholder="Email"
              className="w-full border px-3 py-2 rounded"
              disabled // Email probably should not be editable here
            />
            <input
              type="text"
              name="phoneNumber"
              value={profileForm.phoneNumber}
              onChange={handleProfileChange}
              placeholder="Phone Number"
              className="w-full border px-3 py-2 rounded"
            />
            <div className="flex gap-4">
              <Button
                variant="custom"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                onClick={saveProfile}
              >
                <FaSave className="inline mr-1" /> Save
              </Button>
              <Button
                variant="custom"
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
                onClick={() => setEditingProfile(false)}
              >
                <FaTimes className="inline mr-1" /> Cancel
              </Button>
            </div>
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          <FaBuilding className="text-green-600" /> Connected Architects
        </h2>
        {connectedArchitects.length === 0 ? (
          <p className="text-gray-600">You have not connected with any architects yet.</p>
        ) : (
          <ul className="space-y-4">
            {connectedArchitects.map((arch) => (
              <li
                key={arch.id}
                className="border p-4 rounded shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-lg">{arch.name}</p>
                  <p className="text-gray-600">{arch.email}</p>
                  <p className="text-sm text-gray-500">Status: {arch.status}</p>
                </div>
                {/* Optional: button to message or view architect */}
                <Button
                  variant="custom"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2"
                  onClick={() => alert(`Navigate to architect ${arch.name} profile or chat`)}
                >
                  View
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          <FaProjectDiagram className="text-purple-600" /> Your Projects
        </h2>
        {projects.length === 0 ? (
          <p className="text-gray-600">No projects started yet.</p>
        ) : (
          <ul className="space-y-4">
            {projects.map((proj) => (
              <li
                key={proj.id}
                className="border p-4 rounded shadow-sm flex flex-col gap-1"
              >
                <p className="font-semibold text-lg">{proj.title}</p>
                <p className="text-gray-600">Architect: {proj.architectName}</p>
                <p className="text-gray-500 text-sm">Status: {proj.status}</p>
                <p className="text-gray-700">{proj.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { getOrdersAPI } from "../../services/orderServices";
// import { getFavouritesAPI } from "../../services/productServices";
// import ClipLoader from "react-spinners/ClipLoader";
// import ProductCard from "../components/ProductCard";
// import {
//   FaUser,
//   FaMapMarkerAlt,
//   FaShoppingCart,
//   FaHeart,
//   FaEdit,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import Button from "../../components/Button";

// export default function ClientProfileView() {
//   const { user, loading: authLoading } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [favourites, setFavourites] = useState([]);
//   const [addresses, setAddresses] = useState([
//     { id: 1, label: "Home", details: "123 Main Street, City, State, 12345" },
//   ]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [ordersData, favouritesData] = await Promise.all([
//           getOrdersAPI(),
//           getFavouritesAPI(),
//         ]);
//         setOrders(ordersData || []);
//         setFavourites(favouritesData || []);
//       } catch (err) {
//         console.error("❌ Failed to fetch client data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (!authLoading && user) {
//       fetchData();
//     }
//   }, [authLoading, user]);

//   if (authLoading || loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//         <ClipLoader color="#2563eb" size={50} />
//         <p className="mt-4 text-gray-500">Loading client profile...</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="p-6 text-center text-red-500">
//         ❌ No client profile found.
//       </div>
//     );
//   }

//   const orderedProducts = orders.flatMap((o) => o.products).filter(Boolean);

//   return (
//     <div className="max-w-7xl mx-auto p-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gray-50">
//       {/* Profile Card */}
//       <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
//         <div className="bg-gradient-to-r from-red-600 to-red-800 h-28 w-full"></div>
//         <div className="flex flex-col items-center -mt-16 p-6 text-center">
//           <div className="rounded-full p-1 bg-gradient-to-tr from-red-500 to-red-600">
//             <img
//               src={
//                 user.profilePic ||
//                 "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
//               }
//               alt="Profile"
//               className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
//             />
//           </div>
//           <h1 className="mt-4 text-2xl font-bold flex items-center gap-2">
//             <FaUser className="text-blue-500" /> {user.name || "N/A"}
//           </h1>
//           <p className="text-gray-500">{user.email}</p>
//           <p className="text-gray-500">{user.phoneNumber || "N/A"}</p>
//           <Button
//             variant="custom"
//             className="mt-5 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition flex items-center gap-2"
//           >
//             <FaEdit /> Edit Profile
//           </Button>
//         </div>
//       </div>

//       {/* Column 1 */}
//       <div className="space-y-6 lg:col-span-1">
//         <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition">
//           <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
//             <FaMapMarkerAlt className="text-blue-500" /> Saved Addresses
//           </h2>
//           {addresses.length === 0 ? (
//             <p className="text-gray-500">No saved addresses.</p>
//           ) : (
//             <ul className="space-y-3">
//               {addresses.map((addr) => (
//                 <li
//                   key={addr.id}
//                   className="border p-3 rounded-lg text-sm text-gray-600 shadow-sm"
//                 >
//                   <span className="font-semibold">{addr.label}:</span>{" "}
//                   {addr.details}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition">
//           <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
//             <FaHeart className="text-red-500" /> Favourites
//           </h2>
//           {favourites.length === 0 ? (
//             <p className="text-gray-500">No favourites yet.</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {favourites
//                 .filter((f) => f.productId)
//                 .slice(0, 4)
//                 .map((f) => (
//                   <div
//                     key={f._id}
//                     onClick={() => setSelectedProduct(f.productId)}
//                     className="cursor-pointer transform hover:scale-105 transition"
//                   >
//                     <ProductCard product={f.productId} />
//                   </div>
//                 ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Column 2 */}
//       <div className="space-y-6 lg:col-span-1">
//         <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-gray-400 hover:shadow-xl transition">
//           <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
//             <FaShoppingCart className="text-gray-500" /> Orders
//           </h2>
//           {orderedProducts.length === 0 ? (
//             <p className="text-gray-500">No orders found.</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {orderedProducts.map((product, idx) => (
//                 <div
//                   key={idx}
//                   onClick={() => setSelectedProduct(product)}
//                   className="cursor-pointer transform hover:scale-105 transition"
//                 >
//                   <ProductCard product={product} />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Product Details Modal */}
//       {selectedProduct && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
//             <Button
//               variant="outlined"
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//               onClick={() => setSelectedProduct(null)}
//             >
//               ✖
//             </Button>
//             <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
//             <img
//               src={
//                 selectedProduct.image || "https://via.placeholder.com/150"
//               }
//               alt={selectedProduct.name}
//               className="w-full h-48 object-cover rounded mb-4"
//             />
//             <p className="text-gray-700 mb-3">
//               {selectedProduct.description || "No description available."}
//             </p>
//             <p className="font-semibold">Price: ₹{selectedProduct.price}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
