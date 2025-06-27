
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import FeatureBanner from "../components/FeatureBanner";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import { FaSlidersH, FaThLarge, FaList } from "react-icons/fa";
import bannerImage from "../images/blured_bg.jpg";

function CategoryPage() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/products?category=${encodeURIComponent(
            categoryName
          )}`
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  return (
    <>
      <Header />

      {/* Banner */}
      <div
        className="h-[250px] w-full bg-cover bg-center flex flex-col justify-center items-center text-black opacity-50"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <h1 className="text-3xl font-bold text-black">{categoryName}</h1>
        <p className="text-sm">
          <span className="text-gray-800">Home</span> &gt;{" "}
          <span className="text-gray-900 font-medium">{categoryName}</span>
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-[#f8f9fa] w-full border-t border-b py-4 px-4 md:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
          <button className="flex items-center gap-2 font-medium">
            <FaSlidersH /> Filter
          </button>
          <div className="flex items-center gap-2">
            <button className="p-1 border rounded">
              <FaThLarge />
            </button>
            <button className="p-1 border rounded">
              <FaList />
            </button>
          </div>
          <p className="text-gray-500">
            Showing {products.length} result{products.length !== 1 && "s"}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <input
              type="number"
              className="w-14 px-2 py-1 border rounded"
              value={products.length}
              readOnly
            />
          </div>
          <div className="flex items-center gap-2">
            <span>Sort by</span>
            <select className="px-3 py-1 border rounded">
              <option>Default</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="w-full px-4 md:px-8 py-12 mb-44">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No products found in this category.
          </p>
        )}
      </section>

      <div className="mt-[-12rem]">
        <FeatureBanner />
      </div>
      <Footer />
    </>
  );
}

export default CategoryPage;
// // src/pages/CategoryPage.jsx
// import React from "react";
// import { useParams, Link } from "react-router-dom";
// import Header from "../components/Header";
// import products from "./productlist";
// import { FaSlidersH, FaThLarge, FaList } from "react-icons/fa";
// import bannerImage from "../images/blured_bg.jpg";
// import FeatureBanner from "../components/FeatureBanner";
// import Footer from "../components/Footer";

// function CategoryPage() {
//   const { categoryName } = useParams();

//   const filteredProducts = products.filter(
//     (product) => product.category.toLowerCase() === categoryName.toLowerCase()
//   );

//   return (
//     <>
//       <Header />

//       {/* 📸 Category Banner */}
//       <div
//         className="h-[250px] w-full bg-center bg-cover flex flex-col justify-center items-center text-center text-black opacity-50"
//         style={{
//           backgroundImage: `url(${bannerImage})`,
//         }}
//       >
//         <h1 className="text-3xl font-bold text-black">{categoryName}</h1>
//         <p className="text-sm mt-2">
//           <span className="text-gray-800">Home</span> &gt;{" "}
//           <span className="text-gray-900 font-medium">{categoryName}</span>
//         </p>
//       </div>

//       {/* 🧰 Toolbar Section */}
//       <div className="bg-[#f8f9fa] w-full border-t border-b py-4 px-4 md:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
//         <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
//           <button className="flex items-center gap-2 font-medium">
//             <FaSlidersH />
//             Filter
//           </button>
//           <div className="flex items-center gap-2">
//             <button className="p-1 border rounded">
//               <FaThLarge />
//             </button>
//             <button className="p-1 border rounded">
//               <FaList />
//             </button>
//           </div>
//           <p className="text-gray-500">
//             Showing {filteredProducts.length} result{filteredProducts.length !== 1 && "s"}
//           </p>
//         </div>

//         <div className="flex items-center gap-4 text-sm">
//           <div className="flex items-center gap-2">
//             <span>Show</span>
//             <input
//               type="number"
//               className="w-14 px-2 py-1 border rounded"
//               defaultValue={filteredProducts.length}
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <span>Sort by</span>
//             <select className="px-3 py-1 border rounded">
//               <option>Default</option>
//               <option>Price: Low to High</option>
//               <option>Price: High to Low</option>
//               <option>Newest</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* 🛍️ Products Grid */}
//       <section className="w-full font-[Poppins] px-4 md:px-8 py-12 mb-44">
//         {filteredProducts.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
//             {filteredProducts.map((product) => (
//               <Link to={`/product/${product.id}`} key={product.id}>
//                 <div className="relative group border rounded-xl overflow-hidden shadow-sm cursor-pointer">
//                   <img
//                     src={product.img}
//                     alt={product.name}
//                     className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
//                   />
//                   {product.tag && (
//                     <span
//                       className={`absolute top-3 left-3 px-2 py-1 text-xs rounded-full ${
//                         product.tag === "New" ? "bg-green-500" : "bg-red-500"
//                       } text-white`}
//                     >
//                       {product.tag}
//                     </span>
//                   )}
//                   <div className="p-4 bg-white space-y-1">
//                     <h4 className="font-semibold">{product.name}</h4>
//                     <p className="text-gray-500 text-sm">{product.description}</p>
//                     <div className="text-sm">
//                       <span className="text-[#0070f3] font-medium mr-2">
//                         {product.price}
//                       </span>
//                       {product.oldPrice && (
//                         <span className="line-through text-gray-400">
//                           {product.oldPrice}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         ) : (
//           <p className="text-center text-gray-500">No products found in this category.</p>
//         )}
//       </section>

//       <div className="mt-[-12rem]">
//         <FeatureBanner />
//       </div>
//       <Footer />
//     </>
//   );
// }

// export default CategoryPage;
