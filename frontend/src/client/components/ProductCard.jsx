import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { FaShare, FaHeart } from "react-icons/fa";
import { addToCart } from "../../app/features/cart/cartSlice";
import { toast } from "react-toastify";
import axios from "axios";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isFavourite, setIsFavourite] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);

  const imageUrl =
    product.images?.[0]?.startsWith("http") ||
    product.images?.[0]?.startsWith("/")
      ? product.images[0]
      : `http://localhost:5000/${product.images?.[0]}`;

  let userRole = null;
  let token = null;

  try {
    token = localStorage.getItem("crm_token");
    if (token) {
      const decoded = jwtDecode(token);
      userRole = decoded.role;
    }
  } catch (err) {
    console.error("JWT decode error:", err);
  }

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.warning("Login first to add products to cart", { autoClose: 2000 });
      return navigate("/login");
    }

    const price = product.price?.[userRole] || 0;

    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price,
        image: imageUrl,
        vendor: product.vendor, 

      })
    );

    try {
      setTimeout(async () => {
        await axios.post(
          "http://localhost:5000/api/cart",
          {
            items: [
              ...cartItems,
              {
                _id: product._id,
                name: product.name,
                price,
                image: imageUrl,
                quantity: 1,
                vendor:product.vendor,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }, 200);
    } catch (err) {
      toast.error("Could not save cart to server");
    }
  };
useEffect(() => {
  const fetchFavourites = async () => {
    const token = localStorage.getItem("crm_token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:5000/api/favourites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const found = res.data?.some((fav) => fav.productId?._id === product._id);
      setIsFavourite(found);
    } catch (err) {
      console.error("🔴 Error fetching favourites:", err.response?.data || err.message);
    }
  };

  fetchFavourites();
}, [product._id]);

  // const fetchFavourites = async () => {
  //   if (!token) return;

  //   try {
  //     const res = await axios.get("http://localhost:5000/api/favourites", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const found = res.data?.some((fav) => fav.productId?._id === product._id);
  //     setIsFavourite(found);
  //   } catch (err) {
  //     console.error("🔴 Error checking favourites:", err);
  //   }
  // };

  // useEffect(() => {
  //   fetchFavourites();
  // }, [token, product._id]);

  const handleToggleFavourite = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.warning("Login to manage favourites", { autoClose: 2000 });
      return navigate("/login");
    }

    try {
      if (isFavourite) {
        await axios.delete(
          `http://localhost:5000/api/favourites/${product._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.info(`${product.name} removed from favourites`);
      } else {
        await axios.post(
          "http://localhost:5000/api/favourites",
          { productId: product._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(`${product.name} added to favourites`);
      }

      setIsFavourite(!isFavourite);
    } catch (err) {
      console.error("🔴 Favourites error:", err.message);
      toast.error(err.message);
    }
  };

  return (
    <Link to={`/product/${product._id}`} key={product._id}>
      <div className="relative group border rounded-xl overflow-hidden shadow-sm cursor-pointer">
        <img
          src={imageUrl || "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {product.tag && (
          <span
            className={`absolute top-3 left-3 px-2 py-1 text-xs rounded-full ${
              product.tag === "New" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {product.tag}
          </span>
        )}

        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center space-y-4">
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
          <p className="text-gray-500 text-sm">
            {" "}
            Vendor Name: {product.vendorName}
          </p>
          <p className="text-gray-500 text-sm"> Brand Name: {product.brand}</p>
          <p className="text-gray-500 text-sm truncate">
            {product.description}
          </p>

          {userRole === "architect" && (
            <p className="text-[#111827] font-medium mt-1">
              Price: ₹{product.price?.architect}
            </p>
          )}
          {userRole === "client" && (
            <p className="text-[#0070f3] font-medium mt-1">
              Price: ₹{product.price?.client}
            </p>
          )}
          {!userRole && (
            <p className="text-gray-400 text-sm mt-1">Login to view pricing</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
