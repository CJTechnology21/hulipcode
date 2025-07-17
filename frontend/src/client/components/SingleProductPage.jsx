import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { FaShare, FaHeart, FaTimes } from "react-icons/fa";
import ProductCard from "./ProductCard";
import { useDispatch } from "react-redux";
import { addToCart } from "../../app/features/cart/cartSlice";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useLocation } from "../../context/LocationContext";

import {
  fetchProductById,
  fetchRelatedProducts,
  addToCartAPI,
  addFavouriteAPI,
} from "../../services/productServices";
import { ClipLoader } from "react-spinners";
function SingleProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mainRef = useRef();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Description");

  const [showCompareModal, setShowCompareModal] = useState(false);
 
   const [zoomImage, setZoomImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const { location } = useLocation();
  const isDelhi = location.city?.toLowerCase().includes("delhi");

  const getImageUrl = (imgPath) =>
    imgPath?.startsWith("http") || imgPath?.startsWith("/")
      ? imgPath
      : `http://localhost:5000/${imgPath}`;

  
  useEffect(() => {
    mainRef.current?.scrollIntoView({ behavior: "smooth" });

    const fetchData = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);

        const rel = await fetchRelatedProducts(data.category);
        setRelatedProducts(rel.filter((p) => p._id !== data._id).slice(0, 4));
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    document.body.style.overflow = zoomImage ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [zoomImage]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("crm_token");
    if (!token) {
      toast.warning("Login first to add products to cart");
      return navigate("/login");
    }

    let userRole;
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.role;
    } catch {
      return toast.error("Invalid token. Please login again.");
    }

    const basePrice =
      userRole === "architect" || userRole === "client"
        ? product.price?.client || 0
        : 0;

    if (!basePrice) {
      toast.warning("Login to view pricing");
      return navigate("/login");
    }

    const finalPrice = isDelhi ? basePrice : basePrice + 100;

    const item = {
      _id: product._id,
      name: product.name,
      price: finalPrice,
      image: getImageUrl(product.images?.[0]),
      vendor: product.vendor,
      rewardPoints: product.rewardPoints || Math.round(finalPrice * 0.1),
    };

    dispatch(addToCart(item));

    try {
      await addToCartAPI([item], token);
    } catch (err) {
      console.error("Cart API error:", err);
      toast.error("Could not save cart to server");
    }
  };

  const handleAddToFavourites = async () => {
    const token = localStorage.getItem("crm_token");
    if (!token) {
      toast.warning("Login to add favourites");
      return navigate("/login");
    }

    try {
      await addFavouriteAPI(product._id, token);
      toast.success(`${product.name} added to favourites`);
    } catch (err) {
      toast.error("Could not add to favourites");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <Header />
        <ClipLoader color="#36d7b7" size={50} />
        <p className="mt-4 text-gray-600 text-sm">Loading product...</p>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <Header />
        <p className="text-xl font-semibold text-gray-600">Product not found.</p>
        <Footer />
      </div>
    );
  }


  // useEffect(() => {
  //   mainRef.current?.scrollIntoView({ behavior: "smooth" });

  //   const fetchProduct = async () => {
  //     try {
  //       const res = await fetch(
  //         `${process.env.REACT_APP_API_BASE}/api/products/${id}`
  //       );
  //       if (!res.ok) throw new Error("Product not found");
  //       const data = await res.json();
  //       setProduct(data);

  //       const relRes = await fetch(
  //         `${process.env.REACT_APP_API_BASE}/api/products?category=${data.category}`
  //       );
  //       const relData = await relRes.json();
  //       setRelatedProducts(
  //         relData.filter((p) => p._id !== data._id).slice(0, 4)
  //       );
  //     } catch (err) {
  //       console.error("Error fetching product:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProduct();
  // }, [id]);
  //  useEffect(() => {
  //   if (zoomImage) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = '';
  //   }

  //   return () => {
  //     document.body.style.overflow = '';
  //   };
  // }, [zoomImage]);

  // const handleAddToCart = async (e) => {
  //   e.preventDefault();

  //   const token = localStorage.getItem("crm_token");
  //   if (!token) {
  //     toast.warning("Login first to add products to cart", { autoClose: 2000 });
  //     return navigate("/login");
  //   }

  //   let userRole;
  //   try {
  //     const decoded = jwtDecode(token);
  //     userRole = decoded.role;
  //   } catch (err) {
  //     console.error("JWT decode error:", err);
  //     return toast.error("Invalid token. Please login again.");
  //   }

  //   let basePrice = 0;
  //   if (userRole === "architect" || userRole === "client") {
  //     basePrice = product.price?.client || 0;
  //   } else {
  //     toast.warning("Login to view pricing", { autoClose: 2000 });
  //     return navigate("/login");
  //   }

  //   const finalPrice = isDelhi ? basePrice : basePrice + 100;

  //   dispatch(
  //     addToCart({
  //       _id: product._id,
  //       name: product.name,
  //       price: finalPrice,
  //       image: getImageUrl(product.images?.[0]),
  //       vendor: product.vendor,
  //       rewardPoints: product.rewardPoints || Math.round(finalPrice * 0.1),
  //     })
  //   );

  //   try {
  //     await axios.post(
  //       `${process.env.REACT_APP_API_BASE}/api/cart`,
  //       {
  //         items: [
  //           {
  //             _id: product._id,
  //             name: product.name,
  //             price: finalPrice,
  //             image: getImageUrl(product.images?.[0]),
  //             quantity: 1,
  //             vendor: product.vendor,
  //           },
  //         ],
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //   } catch (err) {
  //     console.error("Cart API error:", err);
  //     toast.error("Could not save cart to server");
  //   }
  // };

  // const handleAddToFavourites = async () => {
  //   const token = localStorage.getItem("crm_token");
  //   if (!token) {
  //     toast.warning("Login to add favourites", { autoClose: 2000 });
  //     return navigate("/login");
  //   }

  //   try {
  //     const res = await fetch(
  //       `${process.env.REACT_APP_API_BASE}/api/favourites`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({ productId: product._id }),
  //       }
  //     );

  //     if (!res.ok) {
  //       const data = await res.json();
  //       throw new Error(data.message || "Failed to add to favourites");
  //     }

  //     toast.success(`${product.name} added to favourites`);
  //   } catch (err) {
  //     toast.error(err.message);
  //   }
  // };

  // if (loading) {
  //   return (
  //     <div className="text-center py-20">
  //       <Header />
  //       <p className="text-xl font-semibold text-gray-600">Loading...</p>
  //     </div>
  //   );
  // }

  // if (!product) {
  //   return (
  //     <div className="text-center py-20">
  //       <Header />
  //       <p className="text-xl font-semibold text-gray-600">
  //         Product not found.
  //       </p>
  //     </div>
  //   );
  // }

  const mainImage = getImageUrl(product.images?.[0]);
  const baseClientPrice = product.price?.client || 0;
  const finalPrice = isDelhi ? baseClientPrice : baseClientPrice + 100;
  
 
  return (
    <div className="bg-white" ref={mainRef}>
      <Header />

      <div className="text-sm px-6 py-3 text-gray-500 bg-[#F4F5F7]">
        Home &gt; Shop &gt; <span className="text-black">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-6 py-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible">
            {/* Top thumbnails */}
            {[...Array(4)].map((_, groupIndex) => (
              <div key={groupIndex} className="flex flex-col gap-4 shrink-0">
                {product.images?.slice(0, 4).map((imgUrl, idx) => (
                  <div
                    key={`${groupIndex}-${idx}`}
                    className="w-20 h-20 rounded border p-1 cursor-pointer bg-[#F4F5F7]"
                    onClick={() => setZoomImage(getImageUrl(imgUrl))}
                  >
                    <img
                      src={getImageUrl(imgUrl)}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex-1 bg-[#F4F5F7] rounded-xl p-6">
            <img
              src={mainImage}
              alt={product.name}
              className="object-contain rounded shadow-md"
              style={{ width: "400px", height: "400px" }} // Fixed size
              onClick={() => setZoomImage(mainImage)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl font-semibold text-red-500">
            Price: ₹{finalPrice}
            {/* <span className="text-sm text-gray-500 ml-2">
              ({isDelhi ? "Delhi" : "Outside Delhi"})
            </span> */}
          </p>
          {product.oldPrice && (
            <p className="text-base text-gray-400 line-through">
              ₹{product.oldPrice}
            </p>
          )}
          <p className="text-sm text-gray-600">
            Rating: ⭐ {product.rating || "4.5"} / 5
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
            <button
              className="px-6 py-2 bg-black text-white rounded border border-black"
              onClick={handleAddToCart}
            >
              Add To Cart
            </button>
            <button
              className="px-6 py-2 border rounded"
              onClick={() => setShowCompareModal(true)}
            >
              + Compare
            </button>
          </div>

          <div className="pt-6 border-t text-sm text-gray-700 space-y-1">
            <p>
              <strong>SKU</strong>: {product.sku || "SS001"}
            </p>
            <p>
              <strong>Category</strong>: {product.category}
            </p>
            <p>
              <strong>Tags</strong>: Sofa, Chair, Home, Shop
            </p>
            <p className="flex items-center gap-3">
              <strong>Share</strong>:
              <span className="flex gap-3">
                <FaShare />
                <FaHeart onClick={handleAddToFavourites} />
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 border-t">
        <div className="flex gap-8 text-gray-500 text-sm font-medium border-b">
          {["Description", "Additional Information", "Reviews [5]"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 ${
                  activeTab === tab
                    ? "text-black border-b-2 border-black font-semibold"
                    : "hover:text-black"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {activeTab === "Description" && (
          <div className="mt-6 text-gray-600 text-sm space-y-4">
            <p>{product.description}</p>
          </div>
        )}
        {activeTab === "Additional Information" && (
          <div className="mt-6 text-gray-600 text-sm">
            <p>Material: {product.material || "Sheesham wood, Foam cushion"}</p>
            <p>Assembly: DIY (Included)</p>
            <p>Warranty: 3 years structural</p>
          </div>
        )}
        {activeTab === "Reviews [5]" && (
          <div className="mt-6 text-gray-600 text-sm">
            <p>⭐️⭐️⭐️⭐️⭐️ “Absolutely love this!” – A Happy Customer</p>
          </div>
        )}
      </div>

      <div className="text-center font-[Poppins] text-4xl font-bold mt-16 mb-6">
        Related Products
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6 max-w-7xl mx-auto pb-12">
        {relatedProducts.map((related) => (
          <ProductCard key={related._id} product={related} />
        ))}
      </div>

      <Footer />
      {/* Zoom Modal */}
     

      {zoomImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-2">
          <div
            className="relative bg-white rounded p-4 w-full max-w-3xl max-h-[90vh] overflow-hidden"
            onWheel={(e) => {
              e.preventDefault();
              setZoomLevel((prev) =>
                Math.min(Math.max(prev + e.deltaY * -0.001, 1), 3)
              );
            }}
          >
            <button
              className="absolute top-2 right-2 text-gray-600 text-xl"
              onClick={() => {
                setZoomImage(null);
                setZoomLevel(1);
              }}
            >
              <FaTimes />
            </button>
            <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
              <img
                src={zoomImage}
                alt="Zoomed product"
                className="object-contain rounded transition-transform duration-200"
                style={{
                  transform: `scale(${zoomLevel})`,
                  maxHeight: "100%",
                  maxWidth: "100%",
                }}
              />
            </div>
          </div>
        </div>
      )}
      {/* Compare Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-6xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCompareModal(false)}
              className="absolute top-3 right-4 text-xl text-gray-500"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Compare Similar Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        </div>
      )}

    
    </div>
  );
}

export default SingleProductPage;
