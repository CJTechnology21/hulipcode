import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getOrdersAPI } from "../../services/orderServices";
import { getFavouritesAPI } from "../../services/productServices";
import ClipLoader from "react-spinners/ClipLoader";
import ProductCard from "../components/ProductCard";
import {
  FaUser,
  FaBriefcase,
  FaTrophy,
  FaHardHat,
  FaShoppingCart,
  FaHeart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
export default function ArchitectProfileView() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, favouritesData] = await Promise.all([
          getOrdersAPI(),
          getFavouritesAPI(),
        ]);
        setOrders(ordersData || []);
        setFavourites(favouritesData || []);
      } catch (err) {
        console.error(" Failed to fetch architect data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <ClipLoader color="#2563eb" size={50} />
        <p className="mt-4 text-gray-500">Loading architect profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center text-red-500">
         No architect profile found.
      </div>
    );
  }

  const orderedProducts = orders.flatMap((o) => o.products).filter(Boolean);

  return (
    <>
      <div className="max-w-7xl mx-auto p-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gray-50">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <div className="bg-gradient-to-r from-red-600 to-red-800 h-28 w-full"></div>
          <div className="flex flex-col items-center -mt-16 p-6 text-center">
            <div className="rounded-full p-1 bg-gradient-to-tr from-red-500 to-red-600">
              <img
                src={
                  user.profilePic ||
                  "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                }
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
            <h1 className="mt-4 text-2xl font-bold flex items-center gap-2">
              <FaUser className="text-red-500" /> {user.name || "N/A"}
            </h1>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-gray-500">{user.phoneNumber || "N/A"}</p>

            {/* Stats Badges */}
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <span className="flex items-center gap-2 bg-green-50 text-green-600 font-semibold px-3 py-1 rounded-full text-sm shadow-sm">
                <FaTrophy /> {user.rewardPoints ?? 0} Points
              </span>
              <span className="flex items-center gap-2 bg-yellow-50 text-yellow-600 font-semibold px-3 py-1 rounded-full text-sm shadow-sm">
                <FaHardHat /> 3 Active Projects
              </span>
              <span className="flex items-center gap-2 bg-blue-50 text-blue-600 font-semibold px-3 py-1 rounded-full text-sm shadow-sm">
                <FaBriefcase /> 12 Completed
              </span>
            </div>

            <Button
            variant="custom"
              className="mt-5 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition"
              onClick={() => setShowProfileModal(true)}
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Column 1 */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <FaBriefcase className="text-blue-500" /> Active Projects
            </h2>
            <p className="text-gray-500 italic">
              Project tracking coming soon...
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <FaTrophy className="text-yellow-500" /> Achievements
            </h2>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>Certified Architect</li>
              <li>10+ Completed Projects</li>
              <li>Specialized in Sustainable Design</li>
            </ul>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-gray-400 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <FaShoppingCart className="text-gray-500" /> Material Orders
            </h2>
            {orderedProducts.length === 0 ? (
              <p className="text-gray-500">No material orders found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {orderedProducts.map((product, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedProduct(product)}
                    className="cursor-pointer transform hover:scale-105 transition"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-pink-500 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <FaHeart className="text-pink-500" /> Favourites
            </h2>
            {favourites.length === 0 ? (
              <p className="text-gray-500">No favourites yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favourites
                  .filter((f) => f.productId)
                  .slice(0, 4)
                  .map((f) => (
                    <div
                      key={f._id}
                      onClick={() => setSelectedProduct(f.productId)}
                      className="cursor-pointer transform hover:scale-105 transition"
                    >
                      <ProductCard product={f.productId} />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <Input
              type="text"
              defaultValue={user.name}
              className="w-full mb-3 px-3 py-2 border rounded"
            />
            <Input
              type="email"
              defaultValue={user.email}
              className="w-full mb-3 px-3 py-2 border rounded"
            />
            <Input
              type="text"
              defaultValue={user.phoneNumber}
              className="w-full mb-3 px-3 py-2 border rounded"
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button
              variant="outlined"
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </Button>
              <Button 
              
              variant="custom"
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <Button
            variant="outlined"
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedProduct(null)}
            >
              ✖
            </Button>
            <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
            <img
              src={selectedProduct.image || "https://via.placeholder.com/150"}
              alt={selectedProduct.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <p className="text-gray-700 mb-3">
              {selectedProduct.description || "No description available."}
            </p>
            <p className="font-semibold">Price: ₹{selectedProduct.price}</p>
          </div>
        </div>
      )}
    </>
  );
}
