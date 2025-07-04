  import React, { useState } from "react";
  import { FiX } from "react-icons/fi";
  import { FaChevronDown, FaChevronUp } from "react-icons/fa";
  import axios from "axios";

  const filterOptions = {
    Price: [],
    Categories: ["Laminates", "Plywood", "Boards", "Acrylic"],
    "Series Name": [
      "Plain Solids",
      "Wooden Effect",
      "Marbles & Stones",
      "Geometric & Abstracts",
      "Digital Series",
      "Leather Effect",
    ],
    Color: ["White", "Black", "Beige", "Grey", "Red", "Green", "Blue"],
    Finish: ["Glossy", "Matte", "Textured", "High Gloss"],
    "Approx Size (ft)": ["8x4", "6x3", "7x4"],
    "Approx Thickness (mm)": ["0.8", "1.0", "1.5", "2.0"],
    "Base Material": ["MDF", "HDF", "Plywood"],
    Application: ["Kitchen", "Wardrobe", "Wall Panels", "Furniture"],
  };

  const MobileFilters = ({
    sortOpen,
    setSortOpen,
    filterOpen,
    setFilterOpen,
    categoryName,
    subcategorySlug,
    setProducts,
    setLoading,
  }) => {
    const [openCategory, setOpenCategory] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState({});

    const toggleCategory = (cat) => {
      setOpenCategory(openCategory === cat ? null : cat);
    };

    const toggleFilter = (cat, option) => {
      setSelectedFilters((prev) => {
        const current = prev[cat] || [];
        const updated = current.includes(option)
          ? current.filter((val) => val !== option)
          : [...current, option];
        return { ...prev, [cat]: updated };
      });
    };

    const applyFilters = async () => {
      try {
        setLoading(true);
        let query = `${process.env.REACT_APP_API_BASE}/api/products?category=${categoryName}&subCategorySlug=${subcategorySlug}`;

        for (const [key, values] of Object.entries(selectedFilters)) {
          if (values.length > 0) {
            let paramKey = key
              .replace(/\s/g, "")
              .replace(/[()]/g, "")
              .toLowerCase(); // Clean key

            // Custom remap if needed
            if (paramKey === "seriesname") paramKey = "series";
            if (paramKey === "approximatethicknessmm") paramKey = "thickness";
            if (paramKey === "approxsizeft") paramKey = "size";
            if (paramKey === "basematerial") paramKey = "baseMaterial";

            query += `&${paramKey}=${values.join(",")}`;
          }
        }

        const res = await axios.get(query);
        setProducts(res.data);
        setFilterOpen(false);
      } catch (err) {
        console.error("Error fetching filtered products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div>
        {/* Sort Modal */}
        {sortOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex items-center justify-center"
            onClick={() => setSortOpen(false)}
          >
            <div
              className="bg-white w-[90%] max-w-sm rounded-lg shadow-xl p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Sort By</h3>
                <FiX
                  className="text-2xl cursor-pointer"
                  onClick={() => setSortOpen(false)}
                />
              </div>
              <div className="space-y-2 text-sm">
                {[
                  "Popular",
                  "Recommended",
                  "Newest",
                  "Price Low to High",
                  "Price High to Low",
                  "Discount",
                ].map((item) => (
                  <div
                    key={item}
                    className="p-3 rounded cursor-pointer border hover:bg-yellow-100"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filter Modal */}
        {filterOpen && (
          <div className="fixed inset-0 bg-white z-[999] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Filters</h3>
              <FiX
                className="text-2xl cursor-pointer"
                onClick={() => setFilterOpen(false)}
              />
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Left Column */}
              <div className="w-1/3 border-r overflow-y-auto text-sm font-medium space-y-1 px-4 py-3">
                {Object.keys(filterOptions).map((cat) => (
                  <div
                    key={cat}
                    className="flex items-center justify-between cursor-pointer py-2 border-b"
                    onClick={() => toggleCategory(cat)}
                  >
                    <span>{cat}</span>
                    {openCategory === cat ? (
                      <FaChevronUp className="text-xs" />
                    ) : (
                      <FaChevronDown className="text-xs" />
                    )}
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="w-2/3 p-4 overflow-y-auto text-sm space-y-3">
                {openCategory && (
                  <>
                    <input
                      type="text"
                      placeholder={`Search ${openCategory}`}
                      className="w-full border px-3 py-2 rounded text-sm"
                    />
                    <div className="space-y-2">
                      {filterOptions[openCategory]?.map((option) => (
                        <label
                          key={option}
                          className="flex justify-between items-center border px-3 py-2 rounded cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={
                                selectedFilters[openCategory]?.includes(
                                  option
                                ) || false
                              }
                              onChange={() =>
                                toggleFilter(openCategory, option)
                              }
                            />
                            <span>{option}</span>
                          </div>
                          <span className="text-gray-400 text-xs">11083</span>
                        </label>
                      ))}
                    </div>
                    {openCategory === "Categories" && (
                      <label className="flex items-center gap-2 mt-2">
                        <input type="checkbox" className="toggle" />
                        Show Samples
                      </label>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex justify-between items-center px-6 py-4 border-t">
              <button
                className="text-red-500 font-medium"
                onClick={() => setSelectedFilters({})}
              >
                Reset
              </button>
              <button
                className="bg-yellow-400 px-6 py-2 rounded text-black font-medium"
                onClick={applyFilters}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default MobileFilters;
