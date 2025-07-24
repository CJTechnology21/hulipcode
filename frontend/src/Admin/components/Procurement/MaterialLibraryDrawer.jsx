// components/MaterialLibraryDrawer.jsx
import React, { useState, useEffect, useMemo } from "react";
import { MdClose } from "react-icons/md";
import DropDown from "../../../components/DropDown";
import SearchBar from "../../../components/SearchBar";
import axios from "axios";

const categories = [
  { name: "Kitchen" },
  { name: "Laminates" },
  { name: "Wardrobe" },
  { name: "Flooring" },
  { name: "LouversandPanels" },
  { name: "Bathroom" },
  { name: "Wallpaper" },
  { name: "Outdoor" },
  { name: "TVUnit" },
];

export default function MaterialLibraryDrawer({ isOpen, onClose }) {
  const [category, setCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch materials from API based on selected category
  useEffect(() => {
    const fetchMaterials = async () => {
      if (!category) return;
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/products?category=${encodeURIComponent(category)}`
        );
        setMaterials(res.data || []);
      } catch (error) {
        console.error("Failed to fetch materials:", error);
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [category]);

  // Filtered materials based on search
  const filteredMaterials = useMemo(() => {
    return materials.filter((item) =>
      item.name?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [materials, searchText]);

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-30" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Right Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={onClose}>
            <MdClose className="text-xl text-black" />
          </button>

          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Materials Library
          </h2>

          <button className="bg-red-600 text-white text-sm font-medium px-4 py-1.5 rounded hover:bg-red-700">
            Next
          </button>
        </div>

        {/* Red Divider */}
        <div className="h-1 bg-red-600" />

        {/* Filter Controls */}
        <div className="flex items-center gap-2 px-5 py-4">
          <div className="w-2/5">
            <DropDown
              name="category"
              label=""
              value={category}
              options={categories.map((c) => c.name)}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="w-3/5">
            <SearchBar
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search material"
            />
          </div>
        </div>

        {/* Selected & Add New */}
        <div className="flex justify-between items-center px-5 text-sm text-gray-700 font-medium">
          <span>Selected Materials(0)</span>
          <button className="text-red-600 font-semibold hover:underline">
            + New Material
          </button>
        </div>

        {/* Material List */}
        <div className="px-5 overflow-y-auto h-[calc(100%-190px)] pb-6 mt-2">
          {loading ? (
            <div className="text-sm text-center text-gray-500 mt-4">
              Loading materials...
            </div>
          ) : filteredMaterials.length > 0 ? (
            filteredMaterials.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-start py-3 border-b border-gray-200 text-sm"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <span className="bg-gray-100 px-2 py-0.5 text-xs rounded text-gray-700 inline-block mt-1">
                    Category: {item.category || category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500 whitespace-nowrap">
                    Unit: {item.unit || "pcs"}
                  </p>
                  <input type="checkbox" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-center text-gray-500 mt-4">
              No materials found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// import React, { useState, useMemo } from "react";
// import { MdClose } from "react-icons/md";
// import DropDown from "../../../components/DropDown";
// import SearchBar from "../../../components/SearchBar";

// export default function MaterialLibraryDrawer({ isOpen, onClose }) {
//   const [category, setCategory] = useState("");
//   const [searchText, setSearchText] = useState("");

//   const materials = [
//     { name: `10" Chennal soft`, category: "hardware", unit: "nos" },
//     { name: "10MM FASTNER", category: "hardware", unit: "pcs" },
//     { name: "10MM NUT WASHER", category: "hardware", unit: "pcs" },
//     { name: "10MM TAIROD", category: "hardware", unit: "pcs" },
//     { name: "16x8 Screw", category: "hardware", unit: "nos" },
//     { name: "18MM T PROFILE ANTI BRASS", category: "hardware", unit: "pcs" },
//     { name: "2.5INCH HANGING CLAMP", category: "hardware", unit: "pcs" },
//   ];

//   // Get unique categories from materials
//   const categoryOptions = [...new Set(materials.map((item) => item.category))];

//   // Filtered materials based on category and search
//   const filteredMaterials = useMemo(() => {
//     return materials.filter((item) => {
//       const matchesCategory = category === "" || item.category === category;
//       const matchesSearch =
//         item.name.toLowerCase().includes(searchText.toLowerCase());
//       return matchesCategory && matchesSearch;
//     });
//   }, [category, searchText, materials]);

//   return (
//     <div className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}>
//       {/* Backdrop */}
//       <div
//         className={`fixed inset-0 bg-black transition-opacity duration-300 ${
//           isOpen ? "opacity-30" : "opacity-0"
//         }`}
//         onClick={onClose}
//       />

//       {/* Drawer Panel */}
//       <div
//         className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-4 py-4">
//           <button onClick={onClose}>
//             <MdClose className="text-xl text-black" />
//           </button>

//           <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
//             Materials Library
//           </h2>

//           <button className="bg-red-600 text-white text-sm font-medium px-4 py-1.5 rounded hover:bg-red-700">
//             Next
//           </button>
//         </div>

//         <div className="h-1 bg-red-600" />

//         {/* Search & Filter */}
//         <div className="flex items-center gap-2 px-5 py-4">
//           <div className="w-2/5">
//             <DropDown
//               name="category"
//               label=""
//               value={category}
//               options={categoryOptions}
//               onChange={(e) => setCategory(e.target.value)}
//             />
//           </div>
//           <div className="w-3/5">
//             <SearchBar
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               placeholder="Search material"
//             />
//           </div>
//         </div>

//         {/* Selected Materials and Add New */}
//         <div className="flex justify-between items-center px-5 text-sm text-gray-700 font-medium">
//           <span>Selected Materials(0)</span>
//           <button className="text-red-600 font-semibold hover:underline">
//             + New Material
//           </button>
//         </div>

//         {/* Material List */}
//         <div className="px-5 overflow-y-auto h-[calc(100%-190px)] pb-6 mt-2">
//           {filteredMaterials.length > 0 ? (
//             filteredMaterials.map((item, idx) => (
//               <div
//                 key={idx}
//                 className="flex justify-between items-start py-3 border-b border-gray-200 text-sm"
//               >
//                 <div>
//                   <p className="font-semibold">{item.name}</p>
//                   <span className="bg-gray-100 px-2 py-0.5 text-xs rounded text-gray-700 inline-block mt-1">
//                     Category: {item.category}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <p className="text-xs text-gray-500 whitespace-nowrap">
//                     Unit: {item.unit}
//                   </p>
//                   <input type="checkbox" />
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-sm text-center text-gray-500 mt-4">
//               No materials found.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
