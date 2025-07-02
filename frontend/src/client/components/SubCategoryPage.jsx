import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import CategoryBar from "./CategoryBar";
import ProductCard from "./ProductCard";
import CategoryFilters from "./FilterComponents/CategoryFilters";
import ColorFilter from "./FilterComponents/ColorFilters";

function SubcategoryPage() {
  const { categoryName, subcategorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("Popular");

  const [colorFilters, setColorFilters] = useState([]);
  const [finishFilters, setFinishFilters] = useState([]);
  const [thicknessFilters, setThicknessFilters] = useState([]);
  const [sizeFilters, setSizeFilters] = useState([]);

  const readableSubcategory = subcategorySlug.replace(/-/g, " ");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = `http://localhost:5000/api/products?category=${categoryName}&subCategorySlug=${readableSubcategory}`;

        if (colorFilters.length > 0) {
          query += `&color=${colorFilters.join(",")}`;
        }
        if (finishFilters.length > 0) {
          query += `&finish=${finishFilters.join(",")}`;
        }
        if (thicknessFilters.length > 0) {
          query += `&thickness=${thicknessFilters.join(",")}`;
        }
        if (sizeFilters.length > 0) {
          query += `&size=${sizeFilters.join(",")}`;
        }

        const res = await axios.get(query);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, subcategorySlug, colorFilters, finishFilters, thicknessFilters, sizeFilters]);

  const handleCheckboxChange = (value, setter, currentState) => {
    if (currentState.includes(value)) {
      setter(currentState.filter((v) => v !== value));
    } else {
      setter([...currentState, value]);
    }
  };

  return (
    <>
      <Header />
      <div className="hidden md:block">
        <CategoryBar />
      </div>

      <div className="bg-gray-100 px-4 py-2 text-sm">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="text-gray-600 hover:underline">Home</Link> /{" "}
          <Link to={`/category/${categoryName}`} className="text-gray-600 hover:underline">{categoryName}</Link> /{" "}
          <span className="font-medium text-black capitalize">{readableSubcategory}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
        <aside className="hidden md:block w-full lg:w-1/4 bg-white p-4 border rounded shadow-sm text-sm">
          <h2 className="text-lg font-semibold mb-4">Show Samples</h2>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Price</h3>
            <div className="flex gap-2">
              <input type="number" placeholder="Min" className="w-full border px-2 py-1 rounded" />
              <input type="number" placeholder="Max" className="w-full border px-2 py-1 rounded" />
            </div>
            <button className="w-full mt-2 bg-black text-white py-1 rounded text-sm">Go</button>
          </div>

          <CategoryFilters />

          <div className="mb-6">
            <h3 className="font-medium mb-2">Series Name</h3>
            <input type="text" placeholder="Search" className="w-full border px-2 py-1 rounded mb-2" />
            <label className="block"><input type="checkbox" className="mr-2" /> Cane Textures (8)</label>
            <label className="block"><input type="checkbox" className="mr-2" /> Matte Finish (4)</label>
          </div>

          <ColorFilter selectedColors={colorFilters} onColorChange={setColorFilters} />

          <div className="mb-6">
            <h3 className="font-medium mb-2">Approx Size</h3>
            {["8ft x 4ft", "6ft x 3ft", "10ft x 4ft"].map((size) => (
              <label key={size} className="block">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={sizeFilters.includes(size)}
                  onChange={() => handleCheckboxChange(size, setSizeFilters, sizeFilters)}
                />
                {size}
              </label>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Finish</h3>
            {["Matte", "Glossy", "Suede"].map((finish) => (
              <label key={finish} className="block">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={finishFilters.includes(finish)}
                  onChange={() => handleCheckboxChange(finish, setFinishFilters, finishFilters)}
                />
                {finish}
              </label>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Approx Thickness</h3>
            {["0.8 mm", "1 mm", "1.5 mm"].map((thickness) => (
              <label key={thickness} className="block">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={thicknessFilters.includes(thickness)}
                  onChange={() => handleCheckboxChange(thickness, setThicknessFilters, thicknessFilters)}
                />
                {thickness}
              </label>
            ))}
          </div>
        </aside>

        <main className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold capitalize">{readableSubcategory}</h1>
            <div className="flex items-center gap-2 text-sm">
              <span>Sort By:</span>
              <select
                className="border px-2 py-1 rounded"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option>Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          <section className="w-full px-4 md:px-2 py-6 mb-16 md:w-[1050px] md:h-[600px]">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No products found in this category.</p>
            )}
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default SubcategoryPage;


// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import axios from "axios";
// import CategoryBar from "./CategoryBar";
// import ProductCard from "./ProductCard";
// import CategoryFilters from "./FilterComponents/CategoryFilters";
// import ColorFilter from "./FilterComponents/ColorFilters";

// const dummyProducts = Array.from({ length: 12 }, (_, i) => ({
//   _id: i,
//   name: `Product ${i + 1}`,
//   series: "Cane Textures",
//   size: "8ft x 4ft",
//   image: "/images/subcategories/placeholder.png",
// }));

// function SubcategoryPage() {
//   const { categoryName, subcategorySlug } = useParams();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [sortBy, setSortBy] = useState("Popular");

//   const readableSubcategory = subcategorySlug.replace(/-/g, " ");

//   // Uncomment when using real API
//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/products?category=${categoryName}&subCategorySlug=${readableSubcategory}`
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
//   }, [categoryName, subcategorySlug]);

//   return (
//     <>
//       <Header />
//       <div className="hidden md:block">
//         <CategoryBar />
//       </div>

//       {/* Breadcrumb */}
//       <div className="bg-gray-100 px-4 py-2 text-sm">
//         <div className="max-w-7xl mx-auto">
//           <Link to="/" className="text-gray-600 hover:underline">
//             Home
//           </Link>{" "}
//           /{" "}
//           <Link
//             to={`/category/${categoryName}`}
//             className="text-gray-600 hover:underline"
//           >
//             {categoryName}
//           </Link>{" "}
//           /{" "}
//           <span className="font-medium text-black capitalize">
//             {readableSubcategory}
//           </span>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
//         {/* Sidebar */}
//         <aside className="hidden md:block w-full lg:w-1/4 bg-white p-4 border rounded shadow-sm text-sm">
//           <h2 className="text-lg font-semibold mb-4">Show Samples</h2>

//           {/* Price filter */}
//           <div className="mb-6">
//             <h3 className="font-medium mb-2">Price</h3>
//             <div className="flex gap-2">
//               <input
//                 type="number"
//                 placeholder="Min"
//                 className="w-full border px-2 py-1 rounded"
//               />
//               <input
//                 type="number"
//                 placeholder="Max"
//                 className="w-full border px-2 py-1 rounded"
//               />
//             </div>
//             <button className="w-full mt-2 bg-black text-white py-1 rounded text-sm">
//               Go
//             </button>
//           </div>

//           {/* Category Filter */}
//           <CategoryFilters/>
//           {/* Series Name */}
//           <div className="mb-6">
//             <h3 className="font-medium mb-2">Series Name</h3>
//             <input
//               type="text"
//               placeholder="Search"
//               className="w-full border px-2 py-1 rounded mb-2"
//             />
//             <label className="block">
//               <input type="checkbox" className="mr-2" /> Cane Textures (8)
//             </label>
//             <label className="block">
//               <input type="checkbox" className="mr-2" /> Matte Finish (4)
//             </label>
//           </div>

//           {/* Color */}
//           <ColorFilter/>


//           {/* Approx Size */}
//           <div className="mb-6">
//             <h3 className="font-medium mb-2">Approx Size</h3>
//             <label className="block">
//               <input type="checkbox" className="mr-2" /> 8ft x 4ft
//             </label>
//             <label className="block">
//               <input type="checkbox" className="mr-2" /> 6ft x 3ft
//             </label>
//             <label className="block">
//               <input type="checkbox" className="mr-2" /> 10ft x 4ft
//             </label>
//           </div>

//           {/* Finish */}
//           <div className="mb-6">
//             <h3 className="font-medium mb-2">Finish</h3>
//             <label className="block">
//               <input type="checkbox" className="mr-2" /> Matte
//             </label>
//             <label className="block">
//               <input type="checkbox" className="mr-2" /> Glossy
//             </label>
//             <label className="block">
//               <input type="checkbox" className="mr-2" /> Suede
//             </label>
//           </div>

//           {/* Approx Thickness */}
//           <div className="mb-6">
//             <h3 className="font-medium mb-2">Approx Thickness</h3>
//             <label className="block">
//               <input type="checkbox" className="mr-2" /> 0.8 mm
//             </label>
//             <label className="block">
//               <input type="checkbox" className="mr-2" /> 1 mm
//             </label>
//             <label className="block">
//               <input type="checkbox" className="mr-2" /> 1.5 mm
//             </label>
//           </div>
//         </aside>

//         {/* Product Grid */}
//         <main className="w-full lg:w-3/4">
//           <div className="flex justify-between items-center mb-4">
//             <h1 className="text-xl font-bold capitalize">
//               {readableSubcategory}
//             </h1>
//             <div className="flex items-center gap-2 text-sm">
//               <span>Sort By:</span>
//               <select
//                 className="border px-2 py-1 rounded"
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//               >
//                 <option>Popular</option>
//                 <option>Price: Low to High</option>
//                 <option>Price: High to Low</option>
//                 <option>Newest</option>
//               </select>
//             </div>
//           </div>

//           <section className="w-full px-4 md:px-2 py-6 mb-16 md:w-[1050px] md:h-[600px]">
//             {loading ? (
//               <p className="text-center text-gray-500">Loading...</p>
//             ) : products.length > 0 ? (
//               <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
//                 {products.map((product) => (
//                   <ProductCard key={product._id} product={product} />
//                 ))}
//               </div>
//             ) : (
//               <p className="text-center text-gray-500">
//                 No products found in this category.
//               </p>
//             )}
//           </section>
//         </main>
//       </div>
//       <Footer />
//     </>
//   );
// }

// export default SubcategoryPage;
