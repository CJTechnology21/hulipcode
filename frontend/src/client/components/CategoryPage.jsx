import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import FeatureBanner from "../components/FeatureBanner";
import Footer from "../components/Footer";
import subcategoriesMap from "./Subcategories";
import axios from "axios";
import { FaSlidersH, FaThLarge, FaList } from "react-icons/fa";
import bannerImage from "../images/blured_bg.jpg";
import CategoryBar from "./CategoryBar";

// fallback dummy image
const fallbackImage = "/images/subcategories/placeholder.jpg";

// safe slugify
function slugify(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

function CategoryPage() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${
            process.env.REACT_APP_API_BASE
          }/api/products?category=${encodeURIComponent(categoryName)}`
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

  const subcategories = subcategoriesMap[categoryName];

  return (
    <>
      <Header />
      <CategoryBar />
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

      {/* Subcategory Grid */}
      {subcategories && (
        <section className="w-full px-4 md:px-8 py-10">
          <h2 className="text-2xl font-bold text-center mb-8">
            {categoryName}
          </h2>
          <div className="max-w-7xl mx-auto">
            {Array.isArray(subcategories) ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {subcategories.map((item) => {
                  const name =
                    typeof item === "string" ? item : item?.name || "Unnamed";
                  const image =
                    typeof item === "object" && item?.image
                      ? item.image
                      : fallbackImage;

                  return (
                    <Link
                      to={`/category/${categoryName}/${slugify(name)}`}
                      key={name}
                      className="bg-white border rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={name}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          e.target.src = fallbackImage;
                        }}
                      />
                      <div className="p-2 text-sm text-center font-medium">
                        {name}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              Object.entries(subcategories).map(([groupName, items]) => (
                <div key={groupName} className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">{groupName}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {items.map((item) => {
                      const name =
                        typeof item === "string"
                          ? item
                          : item?.name || "Unnamed";
                      const image =
                        typeof item === "object" && item?.image
                          ? item.image
                          : fallbackImage;

                      return (
                        <Link
                          to={`/${categoryName}/${slugify(name)}`}
                          key={name}
                          className="bg-white border rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
                        >
                          <img
                            src={image}
                            alt={name}
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              e.target.src = fallbackImage;
                            }}
                          />
                          <div className="p-2 text-sm text-center font-medium">
                            {name}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* Optional Products Grid — currently commented out */}

      <div className="mt-[120px]">
        <FeatureBanner />
      </div>
      <Footer />
    </>
  );
}

export default CategoryPage;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Header from "../components/Header";
// import FeatureBanner from "../components/FeatureBanner";
// import Footer from "../components/Footer";
// import subcategoriesMap from "./Subcategories";
// import axios from "axios";
// import { FaSlidersH, FaThLarge, FaList } from "react-icons/fa";
// import bannerImage from "../images/blured_bg.jpg";
// // import ProductCard from "../components/ProductCard"; // Uncomment if you're rendering products

// function CategoryPage() {
//   const { categoryName } = useParams();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get(
//           `${
//             process.env.REACT_APP_API_BASE
//           }/api/products?category=${encodeURIComponent(categoryName)}`
//         );
//         setProducts(res.data);
//       } catch (err) {
//         console.error("Error fetching products:", err);
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, [categoryName]);

//   const subcategories = subcategoriesMap[categoryName];

//   return (
//     <>
//       <Header />

//       {/* Banner */}
//       <div
//         className="h-[250px] w-full bg-cover bg-center flex flex-col justify-center items-center text-black opacity-50"
//         style={{ backgroundImage: `url(${bannerImage})` }}
//       >
//         <h1 className="text-3xl font-bold text-black">{categoryName}</h1>
//         <p className="text-sm">
//           <span className="text-gray-800">Home</span> &gt;{" "}
//           <span className="text-gray-900 font-medium">{categoryName}</span>
//         </p>
//       </div>

//       {/* Toolbar */}
//       <div className="bg-[#f8f9fa] w-full border-t border-b py-4 px-4 md:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
//         <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
//           <button className="flex items-center gap-2 font-medium">
//             <FaSlidersH /> Filter
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
//             Showing {products.length} result{products.length !== 1 && "s"}
//           </p>
//         </div>

//         <div className="flex items-center gap-4 text-sm">
//           <div className="flex items-center gap-2">
//             <span>Show</span>
//             <input
//               type="number"
//               className="w-14 px-2 py-1 border rounded"
//               value={products.length}
//               readOnly
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

//       {/* Subcategory Grid */}
//       {subcategories && (
//         <section className="w-full px-4 md:px-8 py-10">
//           <h2 className="text-2xl font-bold text-center mb-8">
//             {categoryName}
//           </h2>
//           <div className="max-w-7xl mx-auto">
//             {Array.isArray(subcategories) ? (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//                 {subcategories.map((item) => (
//                   <div
//                     key={item}
//                     className="bg-white border rounded-lg shadow-sm p-4 flex items-center justify-center text-center font-medium text-sm hover:shadow-md transition"
//                   >
//                     {item}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               Object.entries(subcategories).map(([groupName, items]) => (
//                 <div key={groupName} className="mb-8">
//                   <h3 className="text-lg font-semibold mb-4">{groupName}</h3>
//                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//                     {items.map((item) => (
//                       <div
//                         key={item}
//                         className="bg-white border rounded-lg shadow-sm p-4 flex items-center justify-center text-center font-medium text-sm hover:shadow-md transition"
//                       >
//                         {item}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </section>
//       )}

//       {/* Products Grid (optional) */}
//       {/*
//       <section className="w-full px-4 md:px-8 py-12 mb-44">
//         {loading ? (
//           <p className="text-center text-gray-500">Loading...</p>
//         ) : products.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
//             {products.map((product) => (
//               <ProductCard key={product._id} product={product} />
//             ))}
//           </div>
//         ) : (
//           <p className="text-center text-gray-500">
//             No products found in this category.
//           </p>
//         )}
//       </section>
//       */}

//       <div className="mt-[120px]">
//         <FeatureBanner />
//       </div>
//       <Footer />
//     </>
//   );
// }

// export default CategoryPage;
