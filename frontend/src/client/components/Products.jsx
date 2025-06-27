import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_BASE}/api/products`); // Adjust base URL as needed
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading products...</div>;
  }

  return (
    <section className="w-full font-[Poppins] px-4 md:px-8 py-12 mb-44">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Show More Button */}
      <div className="text-center mt-10">
        <button className="border border-black text-sm px-6 py-2 rounded hover:bg-black hover:text-white transition">
          Show More
        </button>
      </div>
    </section>
  );
}

export default Products;

// import React from "react";
// import products from "./productlist";
// import ProductCard from "./ProductCard";

// function Products() {
//   return (
//     <section className="w-full font-[Poppins] px-4 md:px-8 py-12 mb-44">
//       {/* Section Heading */}
//       <div className="text-center mb-8">
//         {/* <h2 className="text-2xl md:text-3xl font-semibold">Our Products</h2> */}
//       </div>

//       {/* Product Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
//         {products.map((product) => (
//           <ProductCard key={product.id} product={product} />
//         ))}
//       </div>

//       {/* Show More Button */}
//       <div className="text-center mt-10">
//         <button className="border border-black text-sm px-6 py-2 rounded hover:bg-black hover:text-white transition">
//           Show More
//         </button>
//       </div>
//     </section>
//   );
// }

// export default Products;
