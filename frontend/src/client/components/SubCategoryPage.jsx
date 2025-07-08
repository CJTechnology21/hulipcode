import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import CategoryBar from "./CategoryBar";
import ProductCard from "./ProductCard";
import CategoryFilters from "./FilterComponents/CategoryFilters";
import ColorFilter from "./FilterComponents/ColorFilters";
import SeriesFilter from "./FilterComponents/SeriesFilter";
import FinishFilter from "./FilterComponents/FinishFilter";
import SizeFilter from "./FilterComponents/SizeFilter";
import ThicknessFilter from "./FilterComponents/ThicknessFilter";
import BaseMaterialFilter from "./FilterComponents/BaseMaterialFilter";
import ApplicationFilter from "./FilterComponents/ApllicationFilter";
import MobileFilters from "./FilterComponents/MobileFilters";
import { jwtDecode } from "jwt-decode";

function SubcategoryPage() {
  const { categoryName, subcategorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("Popular");
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [seriesFilters, setSeriesFilters] = useState([]);
  const [colorFilters, setColorFilters] = useState([]);
  const [finishFilters, setFinishFilters] = useState([]);
  const [thicknessFilters, setThicknessFilters] = useState([]);
  const [sizeFilters, setSizeFilters] = useState([]);
  const [baseMaterialFilters, setBaseMaterialFilters] = useState([]);
  const [applicationFilters, setApplicationFilters] = useState([]);

  const [filterOpen, setFilterOpen] = useState(false);

  const readableSubcategory = subcategorySlug.replace(/-/g, " ");
  let role = "client";

  const token = localStorage.getItem("crm_token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role || "client";
    } catch (err) {
      console.error("JWT decode error:", err);
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = `${process.env.REACT_APP_API_BASE}/api/products?category=${categoryName}&subCategorySlug=${readableSubcategory}`;

        if (categoryFilters.length > 0) {
          query += `&category=${categoryFilters.join(",")}`;
        }
        if (seriesFilters.length > 0) {
          query += `&series=${seriesFilters.join(",")}`;
        }
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
        if (baseMaterialFilters.length > 0) {
          query += `&baseMaterial=${baseMaterialFilters.join(",")}`;
        }
        if (applicationFilters.length > 0) {
          query += `&application=${applicationFilters.join(",")}`;
        }

        switch (sortBy) {
          case "Price: Low to High":
            query += `&sort=price_asc`;
            break;
          case "Price: High to Low":
            query += `&sort=price_desc`;
            break;
          case "Newest":
            query += `&sort=newest`;
            break;
          default:
            query += `&sort=popular`;
        }

        query += `&role=${role}`;

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
  }, [
    categoryName,
    subcategorySlug,
    colorFilters,
    finishFilters,
    thicknessFilters,
    sizeFilters,
    categoryFilters,
    seriesFilters,
    baseMaterialFilters,
    applicationFilters,
    sortBy,
    role,
    readableSubcategory,
  ]);

  return (
    <>
      <Header />
      <div className="hidden md:block">
        <CategoryBar />
      </div>

      <div className="bg-gray-100 px-4 py-2 text-sm">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="text-gray-600 hover:underline">
            Home
          </Link>{" "}
          /{" "}
          <Link
            to={`/category/${categoryName}`}
            className="text-gray-600 hover:underline"
          >
            {categoryName}
          </Link>{" "}
          /{" "}
          <span className="font-medium text-black capitalize">
            {readableSubcategory}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
        <aside className="hidden md:block w-full lg:w-1/4 bg-white p-4 border rounded shadow-sm text-sm">
          <h2 className="text-lg font-semibold mb-4">Show Samples</h2>
          <div className="mb-6">
            <h3 className="font-medium mb-2">Price</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full border px-2 py-1 rounded"
              />
              <input
                type="number"
                placeholder="Max"
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <button className="w-full mt-2 bg-black text-white py-1 rounded text-sm">
              Go
            </button>
          </div>

          <CategoryFilters onChange={setCategoryFilters} />
          <SeriesFilter onChange={setSeriesFilters} />
          <ColorFilter
            selectedColors={colorFilters}
            onColorChange={setColorFilters}
          />
          <FinishFilter
            selectedFinishes={finishFilters}
            onChange={setFinishFilters}
          />
          <SizeFilter selectedSizes={sizeFilters} onChange={setSizeFilters} />
          <ThicknessFilter
            selected={thicknessFilters}
            onChange={setThicknessFilters}
          />
          <BaseMaterialFilter
            selected={baseMaterialFilters}
            onChange={setBaseMaterialFilters}
          />
          <ApplicationFilter
            selected={applicationFilters}
            onChange={setApplicationFilters}
          />
        </aside>

        <main className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold capitalize">
              {readableSubcategory}
            </h1>
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
              {loading && (
                <span className="text-gray-400 text-xs">Loading...</span>
              )}
            </div>
          </div>
          <section className="w-full px-4 md:px-2 py-6 mb-16 md:w-[1050px] md:h-[600px]">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded shadow animate-pulse space-y-4"
                  >
                    <div className="w-full h-40 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No products found in this category.
              </p>
            )}
            {/* Mobile Filter Button & Modal */}
            <div className="block md:hidden fixed bottom-4 right-4 z-50">
              <button
                className="bg-yellow-400 text-black px-4 py-2 rounded shadow"
                onClick={() => setFilterOpen(true)}
              >
                Filter
              </button>

              <MobileFilters
                sortOpen={false}
                setSortOpen={() => {}}
                filterOpen={filterOpen}
                setFilterOpen={setFilterOpen}
                categoryName={categoryName}
                subcategorySlug={readableSubcategory}
                setProducts={setProducts}
                setLoading={setLoading}
              />
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default SubcategoryPage;
