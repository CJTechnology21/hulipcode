
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaShare, FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { useLocation } from "../../context/LocationContext";
import { addToCart } from "../../app/features/cart/cartSlice";

import {
  addToCartAPI,
  getFavouritesAPI,
  addFavouriteAPI,
  removeFavouriteAPI,
} from "../../services/productServices";

import { getCurrentUser } from "../../services/authServices";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isFavourite, setIsFavourite] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const { location } = useLocation();

  const imageUrl =
    product?.images?.[0]?.startsWith("http") || product?.images?.[0]?.startsWith("/")
      ? product?.images?.[0]
      : product?.images?.[0]
      ? `${process.env.REACT_APP_API_BASE}/${product.images[0]}`
      : "/images/subcategories/placeholder.png";

  const isDelhi = location.city?.toLowerCase().includes("delhi");

  const basePrice =
    typeof product?.price === "number"
      ? product.price
      : product?.price?.client || 0;

  const finalPrice = isDelhi ? basePrice : basePrice + 100;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        if (data?.role) {
          setUserRole(data.role);
        }
      } catch (err) {
        console.error("Failed to fetch user info", err.message);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!product?._id) return;
    const fetchFavourites = async () => {
      try {
        const res = await getFavouritesAPI();
        const found = res.data?.some(
          (fav) => fav?.productId?._id === product._id
        );
        setIsFavourite(found);
      } catch (err) {
        console.error("Error fetching favourites:", err.message);
      }
    };
    fetchFavourites();
  }, [product?._id]);

  if (!product || !product._id) return null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userRole) {
      toast.warning("Login first to add products to cart", { autoClose: 2000 });
      return navigate("/login");
    }

    if (userRole !== "architect" && userRole !== "client") {
      toast.warning("Login to view pricing", { autoClose: 2000 });
      return navigate("/login");
    }

    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: finalPrice,
        image: imageUrl,
        vendor: product.vendor,
        rewardPoints: Math.round(finalPrice * 0.1),
      })
    );

    try {
      const response = await addToCartAPI([
        {
          productId: product._id,
          quantity: 1,
          vendor: product.vendor?._id || product.vendor,
        },
      ]);
      console.log("✅ Cart API response:", response);
    } catch (err) {
      console.error("❌ Cart API error:", err?.response?.data || err.message);
      toast.error("Could not save cart to server");
    }
  };

  const handleToggleFavourite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userRole) {
      toast.warning("Login to manage favourites", { autoClose: 2000 });
      return navigate("/login");
    }

    try {
      if (isFavourite) {
        await removeFavouriteAPI(product._id);
        toast.info(`${product.name} removed from favourites`);
      } else {
        await addFavouriteAPI(product._id);
        toast.success(`${product.name} added to favourites`);
      }
      setIsFavourite(!isFavourite);
    } catch (err) {
      console.error("Favorite toggle failed:", err?.response?.data || err.message);
      toast.error("Could not update favourites");
    }
  };

  return (
    <div className="relative group border rounded-xl overflow-hidden shadow-sm cursor-pointer">
      <Link to={`/product/${product._id}`}>
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {product.tag && (
        <span
          className={`absolute top-3 left-3 px-2 py-1 text-xs rounded-full ${
            product.tag === "New" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {product.tag}
        </span>
      )}

      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center space-y-4 z-10">
        <button
          className="bg-white text-black text-sm px-6 py-2 rounded shadow font-medium"
          onClick={handleAddToCart}
        >
          Add to cart
        </button>
        <div className="flex gap-6 text-white text-sm items-center">
          <button className="flex items-center gap-2 hover:underline">
            <FaShare /> Share
          </button>
          <button
            className="flex items-center gap-2 hover:underline"
            onClick={handleToggleFavourite}
          >
            <FaHeart color={isFavourite ? "red" : "white"} />
            {isFavourite ? "Unlike" : "Like"}
          </button>
        </div>
      </div>

      <div className="p-4 bg-white space-y-1">
        <h4 className="font-semibold">{product.name}</h4>
        <p className="text-gray-500 text-sm">{product.category}</p>
        <p className="text-gray-500 text-sm">Vendor Name: {product.vendorName}</p>
        <p className="text-gray-500 text-sm">Brand Name: {product.brand}</p>
        <p className="text-gray-500 text-sm truncate">{product.description}</p>

        {(userRole === "architect" || userRole === "client") ? (
          <>
            <p className="text-[#0070f3] font-medium mt-1">Price: ₹{finalPrice}</p>
            {userRole === "architect" && (
              <p className="text-green-600 text-sm font-semibold">
                Reward Points: {Math.round(finalPrice * 0.1)} pts
              </p>
            )}
          </>
        ) : (
          <p className="text-gray-400 text-sm mt-1">Login to view pricing</p>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { FaShare, FaHeart } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { useLocation } from "../../context/LocationContext";
// import { addToCart } from "../../app/features/cart/cartSlice";

// import {
//   addToCartAPI,
//   getFavouritesAPI,
//   addFavouriteAPI,
//   removeFavouriteAPI,
// } from "../../services/productServices";

// import { getCurrentUser } from "../../services/authServices";

// function ProductCard({ product }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isFavourite, setIsFavourite] = useState(false);
//   const [userRole, setUserRole] = useState(null);
//   const { location } = useLocation();

//   const imageUrl =
//     product?.images?.[0]?.startsWith("http") || product?.images?.[0]?.startsWith("/")
//       ? product?.images?.[0]
//       : product?.images?.[0]
//       ? `${process.env.REACT_APP_API_BASE}/${product.images[0]}`
//       : "/images/subcategories/placeholder.png";

//   const isDelhi = location.city?.toLowerCase().includes("delhi");

//   const basePrice =
//     typeof product?.price === "number"
//       ? product.price
//       : product?.price?.client || 0;

//   const finalPrice = isDelhi ? basePrice : basePrice + 100;

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const data = await getCurrentUser();
//         if (data?.role) {
//           setUserRole(data.role);
//         }
//       } catch (err) {
//         console.error("Failed to fetch user info", err.message);
//       }
//     };
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     if (!product?._id) return;
//     const fetchFavourites = async () => {
//       try {
//         const res = await getFavouritesAPI();
//         const found = res.data?.some(
//           (fav) => fav?.productId?._id === product._id
//         );
//         setIsFavourite(found);
//       } catch (err) {
//         console.error("Error fetching favourites:", err.message);
//       }
//     };
//     fetchFavourites();
//   }, [product?._id]);

//   if (!product || !product._id) return null;

//   const handleAddToCart = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!userRole) {
//       toast.warning("Login first to add products to cart", { autoClose: 2000 });
//       return navigate("/login");
//     }

//     if (userRole !== "architect" && userRole !== "client") {
//       toast.warning("Login to view pricing", { autoClose: 2000 });
//       return navigate("/login");
//     }

//     dispatch(
//       addToCart({
//         _id: product._id,
//         name: product.name,
//         price: finalPrice,
//         image: imageUrl,
//         vendor: product.vendor,
//         rewardPoints: Math.round(finalPrice * 0.1),
//       })
//     );

//     try {
//       // const response = await addToCartAPI([{ productId: product._id, quantity: 1 ,   vendor: product.vendor?._id || product.vendor}]);
//       console.log("Cart API response:", response?.data);
//     } catch (err) {
//       console.error("Cart API error:", err?.response?.data || err.message);
//       toast.error("Could not save cart to server");
//     }
//   };

//   const handleToggleFavourite = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!userRole) {
//       toast.warning("Login to manage favourites", { autoClose: 2000 });
//       return navigate("/login");
//     }

//     try {
//       if (isFavourite) {
//         await removeFavouriteAPI(product._id);
//         toast.info(`${product.name} removed from favourites`);
//       } else {
//         await addFavouriteAPI(product._id);
//         toast.success(`${product.name} added to favourites`);
//       }
//       setIsFavourite(!isFavourite);
//     } catch (err) {
//       console.error("Favorite toggle failed:", err?.response?.data || err.message);
//       toast.error("Could not update favourites");
//     }
//   };

//   return (
//     <div className="relative group border rounded-xl overflow-hidden shadow-sm cursor-pointer">
//       <Link to={`/product/${product._id}`}>
//         <img
//           src={imageUrl}
//           alt={product.name}
//           className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
//         />
//       </Link>

//       {product.tag && (
//         <span
//           className={`absolute top-3 left-3 px-2 py-1 text-xs rounded-full ${
//             product.tag === "New" ? "bg-green-500" : "bg-red-500"
//           } text-white`}
//         >
//           {product.tag}
//         </span>
//       )}

//       <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center space-y-4 z-10">
//         <button
//           className="bg-white text-black text-sm px-6 py-2 rounded shadow font-medium"
//           onClick={handleAddToCart}
//         >
//           Add to cart
//         </button>
//         <div className="flex gap-6 text-white text-sm items-center">
//           <button className="flex items-center gap-2 hover:underline">
//             <FaShare /> Share
//           </button>
//           <button
//             className="flex items-center gap-2 hover:underline"
//             onClick={handleToggleFavourite}
//           >
//             <FaHeart color={isFavourite ? "red" : "white"} />
//             {isFavourite ? "Unlike" : "Like"}
//           </button>
//         </div>
//       </div>

//       <div className="p-4 bg-white space-y-1">
//         <h4 className="font-semibold">{product.name}</h4>
//         <p className="text-gray-500 text-sm">{product.category}</p>
//         <p className="text-gray-500 text-sm">Vendor Name: {product.vendorName}</p>
//         <p className="text-gray-500 text-sm">Brand Name: {product.brand}</p>
//         <p className="text-gray-500 text-sm truncate">{product.description}</p>

//         {(userRole === "architect" || userRole === "client") ? (
//           <>
//             <p className="text-[#0070f3] font-medium mt-1">Price: ₹{finalPrice}</p>
//             {userRole === "architect" && (
//               <p className="text-green-600 text-sm font-semibold">
//                 Reward Points: {Math.round(finalPrice * 0.1)} pts
//               </p>
//             )}
//           </>
//         ) : (
//           <p className="text-gray-400 text-sm mt-1">Login to view pricing</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProductCard;
