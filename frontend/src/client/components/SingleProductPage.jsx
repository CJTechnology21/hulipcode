import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { FaShare, FaHeart, FaTimes } from "react-icons/fa";
import ProductCard from "./ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../app/features/cart/cartSlice";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

function SingleProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mainRef = useRef();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Description");
  const [zoomImage, setZoomImage] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const getImageUrl = (imgPath) =>
    imgPath?.startsWith("http") || imgPath?.startsWith("/")
      ? imgPath
      : `http://localhost:5000/${imgPath}`;

  useEffect(() => {
    mainRef.current?.scrollIntoView({ behavior: "smooth" });

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE}/api/products/${id}`
        );
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);

        const relRes = await fetch(
          `${process.env.REACT_APP_API_BASE}/api/products?category=${data.category}`
        );
        const relData = await relRes.json();
        setRelatedProducts(relData.filter((p) => p._id !== data._id).slice(0, 4));
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const token = localStorage.getItem("crm_token");

  const handleAddToCart = async () => {
    if (!token) {
      toast.warning("Login first to add products to cart", { autoClose: 2000 });
      return navigate("/login");
    }

    const price = product.price?.client || 0;

    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price,
        image: getImageUrl(product.images?.[0]),
      })
    );

    try {
      setTimeout(async () => {
        await fetch(`${process.env.REACT_APP_API_BASE}/api/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: [
              ...cartItems,
              {
                _id: product._id,
                name: product.name,
                price,
                image: getImageUrl(product.images?.[0]),
                quantity: 1,
              },
            ],
          }),
        });
      }, 200);
    } catch (err) {
      console.error("Failed to save cart:", err);
      toast.error("Could not save cart");
    }
  };

  const handleAddToFavourites = async () => {
    if (!token) {
      toast.warning("Login to add favourites", { autoClose: 2000 });
      return navigate("/login");
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/favourites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to add to favourites");
      }

      toast.success(`${product.name} added to favourites`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <Header />
        <p className="text-xl font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <Header />
        <p className="text-xl font-semibold text-gray-600">Product not found.</p>
      </div>
    );
  }

  const mainImage = getImageUrl(product.images?.[0]);

  return (
    <div className="bg-white" ref={mainRef}>
      <Header />

      <div className="text-sm px-6 py-3 text-gray-500 bg-[#F4F5F7]">
        Home &gt; Shop &gt; <span className="text-black">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-6 py-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex lg:flex-col gap-4">
            {product.images?.map((imgUrl, idx) => (
              <div
                key={idx}
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

          <div className="flex-1 bg-[#F4F5F7] rounded-xl p-6">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-auto object-contain rounded shadow-md"
              onClick={() => setZoomImage(mainImage)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl font-semibold text-red-500">
            Price: ₹{product.price?.client}
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
            <p><strong>SKU</strong>: {product.sku || "SS001"}</p>
            <p><strong>Category</strong>: {product.category}</p>
            <p><strong>Tags</strong>: Sofa, Chair, Home, Shop</p>
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
          {["Description", "Additional Information", "Reviews [5]"].map((tab) => (
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
          ))}
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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative bg-white rounded p-4 max-w-3xl w-full">
            <button
              className="absolute top-2 right-2 text-gray-600 text-xl"
              onClick={() => setZoomImage(null)}
            >
              <FaTimes />
            </button>
            <img
              src={zoomImage}
              alt="Zoomed product"
              className="w-full h-auto object-contain rounded"
            />
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-6xl w-full relative">
            <button
              onClick={() => setShowCompareModal(false)}
              className="absolute top-3 right-4 text-xl text-gray-500"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-semibold mb-4">Compare Similar Products</h2>
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

// import React, { useState, useEffect, useRef } from "react";
  // import { useParams } from "react-router-dom";
  // import Header from "./Header";
  // import Footer from "./Footer";
  // import { FaShare, FaHeart } from "react-icons/fa";
  // import ProductCard from "./ProductCard";
  // import { useDispatch, useSelector } from "react-redux";
  // import { addToCart } from "../../app/features/cart/cartSlice";
  // import { jwtDecode } from "jwt-decode";
  // import { toast } from "react-toastify";
  // import { useNavigate } from "react-router-dom";

  // function SingleProductPage() {
  //   const { id } = useParams();
  //   const mainRef = useRef();
  //   const [product, setProduct] = useState(null);
  //   const [relatedProducts, setRelatedProducts] = useState([]);
  //   const [activeTab, setActiveTab] = useState("Description");
  //   const [loading, setLoading] = useState(true);
  //   const dispatch = useDispatch();
  //   const navigate = useNavigate();
  //   const cartItems = useSelector((state) => state.cart.items);

  //   const getImageUrl = (imgPath) =>
  //     imgPath?.startsWith("http") || imgPath?.startsWith("/")
  //       ? imgPath
  //       : `http://localhost:5000/${imgPath}`;

  //   useEffect(() => {
  //     mainRef.current?.scrollIntoView({ behavior: "smooth" });

  //     const fetchProduct = async () => {
  //       try {
  //         const res = await fetch(
  //           `${process.env.REACT_APP_API_BASE}/api/products/${id}`
  //         );

  //         if (!res.ok) throw new Error("Product not found");
  //         const data = await res.json();
  //         setProduct(data);

  //         // Optional: fetch related products
  //         const relRes = await fetch(
  //           `${process.env.REACT_APP_API_BASE}/api/products?category=${data.category}`
  //         );
  //         const relData = await relRes.json();
  //         setRelatedProducts(
  //           relData.filter((p) => p._id !== data._id).slice(0, 4)
  //         );
  //       } catch (err) {
  //         console.error("Error fetching product:", err);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     fetchProduct();
  //   }, [id]);

  //   if (loading) {
  //     return (
  //       <div className="text-center py-20">
  //         <Header />
  //         <p className="text-xl font-semibold text-gray-600">Loading...</p>
  //       </div>
  //     );
  //   }

  //   if (!product) {
  //     return (
  //       <div className="text-center py-20">
  //         <Header />
  //         <p className="text-xl font-semibold text-gray-600">
  //           Product not found.
  //         </p>
  //       </div>
  //     );
  //   }

  //   const mainImage = getImageUrl(product.images?.[0]);

  //   const handleAddToCart = async () => {
  //     if (!token) {
  //       toast.warning("Login first to add products to cart", { autoClose: 2000 });
  //       return navigate("/login");
  //     }

  //     const price = product.price?.[userRole] || 0;

  //     dispatch(
  //       addToCart({
  //         _id: product._id,
  //         name: product.name,
  //         price,
  //         image: getImageUrl(product.images?.[0]),
  //       })
  //     );

  //     try {
  //       setTimeout(async () => {
  //         await fetch(`${process.env.REACT_APP_API_BASE}/api/cart`, {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //           body: JSON.stringify({
  //             items: [
  //               ...cartItems,
  //               {
  //                 _id: product._id,
  //                 name: product.name,
  //                 price,
  //                 image: getImageUrl(product.images?.[0]),
  //                 quantity: 1,
  //               },
  //             ],
  //           }),
  //         });
  //       }, 200);
  //     } catch (err) {
  //       console.error("Failed to save cart:", err);
  //       toast.error("Could not save cart");
  //     }
  //   };

  //   const handleAddToFavourites = async () => {
  //     if (!token) {
  //       toast.warning("Login to add favourites", { autoClose: 2000 });
  //       return navigate("/login");
  //     }

  //     try {
  //       const res = await fetch(
  //         `${process.env.REACT_APP_API_BASE}/api/favourites`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //           body: JSON.stringify({ productId: product._id }),
  //         }
  //       );

  //       if (!res.ok) {
  //         const data = await res.json();
  //         throw new Error(data.message || "Failed to add to favourites");
  //       }

  //       toast.success(`${product.name} added to favourites`);
  //     } catch (err) {
  //       toast.error(err.message);
  //     }
  //   };

  //   let token = localStorage.getItem("crm_token");
  //   let userRole = null;

  //   try {
  //     if (token) {
  //       const decoded = jwtDecode(token);
  //       userRole = decoded.role;
  //     }
  //   } catch (err) {
  //     console.error("JWT decode error:", err);
  //   }

  //   return (
  //     <div className="bg-white" ref={mainRef}>
  //       <Header />

  //       {/* Breadcrumb */}
  //       <div className="text-sm px-6 py-3 text-gray-500 bg-[#F4F5F7]">
  //         Home &gt; Shop &gt; <span className="text-black">{product.name}</span>
  //       </div>

  //       {/* Main Section */}
  //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-6 py-10 max-w-7xl mx-auto">
  //         <div className="flex flex-col lg:flex-row gap-6">
  //           {/* Thumbnails */}
  //           <div className="flex lg:flex-col gap-4">
  //             {[...Array(4)].map((_, idx) => (
  //               <div
  //                 key={idx}
  //                 className="w-20 h-20 rounded border p-1 cursor-pointer bg-[#F4F5F7]"
  //               >
  //                 <img
  //                   src={mainImage}
  //                   alt={`${product.name} thumbnail ${idx + 1}`}
  //                   className="w-full h-full object-cover rounded"
  //                 />
  //               </div>
  //             ))}
  //           </div>

  //           {/* Main Image */}
  //           <div className="flex-1 bg-[#F4F5F7] rounded-xl p-6">
  //             <img
  //               src={mainImage}
  //               alt={product.name}
  //               className="w-full h-auto object-contain rounded shadow-md"
  //             />
  //           </div>
  //         </div>

  //         {/* Product Details */}
  //         <div className="space-y-4">
  //           <h1 className="text-3xl font-bold">{product.name}</h1>
  //           {product.price && (
  //             <>
  //               <p className="text-xl font-semibold text-red-500">
  //                 Client Price: ₹{product.price.client}
  //               </p>
  //               <p className="text-base font-semibold text-blue-500">
  //                 Architect Price: ₹{product.price.architect}
  //               </p>
  //             </>
  //           )}

  //           {product.oldPrice && (
  //             <p className="text-base text-gray-400 line-through">
  //               {product.oldPrice}
  //             </p>
  //           )}

  //           <p className="text-sm text-gray-600">
  //             Rating: ⭐ {product.rating || "4.5"} / 5
  //           </p>

  //           <div className="mt-4">
  //             <h3 className="text-sm font-semibold mb-1">Size</h3>
  //             <div className="flex gap-2">
  //               {["L", "XL", "XS"].map((size) => (
  //                 <button key={size} className="px-3 py-1 border rounded text-sm">
  //                   {size}
  //                 </button>
  //               ))}
  //             </div>
  //           </div>

  //           <div className="mt-4">
  //             <h3 className="text-sm font-semibold mb-1">Color</h3>
  //             <div className="flex gap-2">
  //               <div className="w-6 h-6 bg-purple-500 rounded-full border" />
  //               <div className="w-6 h-6 bg-blue-500 rounded-full border" />
  //               <div className="w-6 h-6 bg-black rounded-full border" />
  //             </div>
  //           </div>
  //           <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
  //             <div className="flex items-center border px-2 py-1 rounded self-start sm:self-auto">
  //               <button className="text-xl px-2">-</button>
  //               <span className="px-2">1</span>
  //               <button className="text-xl px-2">+</button>
  //             </div>
  //             <button
  //               className="px-6 py-2 bg-black text-white rounded border border-black"
  //               onClick={handleAddToCart}
  //             >
  //               Add To Cart
  //             </button>
  //             <button className="px-6 py-2 border rounded">+ Compare</button>
  //           </div>

  //           <div className="pt-6 border-t text-sm text-gray-700 space-y-1">
  //             <p>
  //               <strong>SKU</strong>: {product.sku || "SS001"}
  //             </p>
  //             <p>
  //               <strong>Category</strong>: {product.category}
  //             </p>
  //             <p>
  //               <strong>Tags</strong>: Sofa, Chair, Home, Shop
  //             </p>
  //             <p className="flex items-center gap-3">
  //               <strong>Share</strong>:
  //               <span className="flex gap-3">
  //                 <FaShare />
  //                 <FaHeart onClick={handleAddToFavourites} />
  //               </span>
  //             </p>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Tabs */}
  //       <div className="max-w-6xl mx-auto px-6 py-12 border-t">
  //         <div className="flex gap-8 text-gray-500 text-sm font-medium border-b">
  //           {["Description", "Additional Information", "Reviews [5]"].map(
  //             (tab) => (
  //               <button
  //                 key={tab}
  //                 onClick={() => setActiveTab(tab)}
  //                 className={`pb-3 ${
  //                   activeTab === tab
  //                     ? "text-black border-b-2 border-black font-semibold"
  //                     : "hover:text-black"
  //                 }`}
  //               >
  //                 {tab}
  //               </button>
  //             )
  //           )}
  //         </div>

  //         {activeTab === "Description" && (
  //           <div className="mt-6 text-gray-600 text-sm space-y-4">
  //             <p>{product.description}</p>
  //           </div>
  //         )}
  //         {activeTab === "Additional Information" && (
  //           <div className="mt-6 text-gray-600 text-sm">
  //             <p>Material: {product.material || "Sheesham wood, Foam cushion"}</p>
  //             <p>Assembly: DIY (Included)</p>
  //             <p>Warranty: 3 years structural</p>
  //           </div>
  //         )}
  //         {activeTab === "Reviews [5]" && (
  //           <div className="mt-6 text-gray-600 text-sm">
  //             <p>⭐️⭐️⭐️⭐️⭐️ “Absolutely love this!” – A Happy Customer</p>
  //           </div>
  //         )}
  //       </div>

  //       {/* Related Products */}
  //       <div className="text-center font-[Poppins] text-4xl font-bold mt-16 mb-6">
  //         Related Products
  //       </div>
  //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6 max-w-7xl mx-auto pb-12">
  //         {relatedProducts.map((related) => (
  //           <ProductCard key={related._id} product={related} />
  //         ))}
  //       </div>

  //       <Footer />
  //     </div>
  //   );
  // }

  // export default SingleProductPage;
