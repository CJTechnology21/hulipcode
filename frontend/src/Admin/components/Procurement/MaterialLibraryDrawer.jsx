import React, { useState, useEffect, useMemo } from "react";
import { MdClose } from "react-icons/md";
import DropDown from "../../../components/DropDown";
import SearchBar from "../../../components/SearchBar";
import Button from "../../../components/Button";
import AddNewMaterialModal from "./AddNewMaterialModal";
import { fetchProductsByCategory } from "../../../services/productServices";
import { ClipLoader } from "react-spinners";

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

export default function MaterialLibraryDrawer({
  isOpen,
  onClose,
  selectedMaterials,
  setSelectedMaterials,
}) {
  const [category, setCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [checked, setChecked] = useState({});

  const handleMaterialSave = (newMaterial) => {
    setMaterials((prev) => [...prev, newMaterial]);
  };

  useEffect(() => {
    const getMaterials = async () => {
      if (!category) return;
      setLoading(true);
      const data = await fetchProductsByCategory(category);
      setMaterials(data);
      setLoading(false);
    };

    getMaterials();
  }, [category]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((item) =>
      item.name?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [materials, searchText]);

  const handleNext = () => {
    const selected = materials.filter(
      (item) =>
        checked[item._id] &&
        !selectedMaterials.some((mat) => mat._id === item._id)
    );

    const enriched = selected.map((m) => ({
      ...m,
      quantity: "",
      deliveryDate: null,
    }));

    setSelectedMaterials((prev) => [...prev, ...enriched]);
    setChecked({});
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-30" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
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

          <button
            className="bg-red-600 text-white text-sm font-medium px-4 py-1.5 rounded hover:bg-red-700"
            onClick={handleNext}
          >
            Next
          </button>
        </div>

        <div className="h-1 bg-red-600" />

        {/* Filters */}
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

        {/* Header Row */}
        <div className="flex justify-between items-center px-5 text-sm text-gray-700 font-medium">
          <span>Selected Materials ({Object.values(checked).filter(Boolean).length})</span>
          <Button
            className="text-white bg-red-600 hover:bg-red-700 cursor-pointer"
            variant="custom"
            onClick={() => setShowAddModal(true)}
          >
            + New Material
          </Button>
        </div>

        {/* List */}
        <div className="px-5 overflow-y-auto h-[calc(100%-190px)] pb-6 mt-2">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <ClipLoader size={35} color="#dc2626" />
            </div>
          ) : filteredMaterials.length > 0 ? (
            filteredMaterials.map((item, idx) => (
              <div
                key={item._id || idx}
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
                  <input
                    type="checkbox"
                    checked={checked[item._id] || false}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setChecked((prev) => ({ ...prev, [item._id]: isChecked }));
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-center text-gray-500 mt-4">
              No materials found.
            </div>
          )}
        </div>

        {/* Add Material Modal */}
        <AddNewMaterialModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleMaterialSave}
        />
      </div>
    </div>
  );
}

// // components/MaterialLibraryDrawer.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import { MdClose } from "react-icons/md";
// import DropDown from "../../../components/DropDown";
// import SearchBar from "../../../components/SearchBar";
// import Button from "../../../components/Button";
// import AddNewMaterialModal from "./AddNewMaterialModal";
// import { fetchProductsByCategory } from "../../../services/productServices";
// import { ClipLoader } from "react-spinners";

// const categories = [
//   { name: "Kitchen" },
//   { name: "Laminates" },
//   { name: "Wardrobe" },
//   { name: "Flooring" },
//   { name: "LouversandPanels" },
//   { name: "Bathroom" },
//   { name: "Wallpaper" },
//   { name: "Outdoor" },
//   { name: "TVUnit" },
// ];

// export default function MaterialLibraryDrawer({ isOpen, onClose, }) {
//   const [category, setCategory] = useState("");
//   const [searchText, setSearchText] = useState("");
//   const [materials, setMaterials] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);

//   const handleMaterialSave = (newMaterial) => {
//     setMaterials((prev) => [...prev, newMaterial]);
//     // You can also send `newMaterial` to backend here
//   };

//   // Fetch materials from API based on selected category
//   useEffect(() => {
//     const getMaterials = async () => {
//       if (!category) return;
//       setLoading(true);
//       const data = await fetchProductsByCategory(category);
//       setMaterials(data);
//       setLoading(false);
//     };

//     getMaterials();
//   }, [category]);

//   // Filtered materials based on search
//   const filteredMaterials = useMemo(() => {
//     return materials.filter((item) =>
//       item.name?.toLowerCase().includes(searchText.toLowerCase())
//     );
//   }, [materials, searchText]);

//   return (
//     <div
//       className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
//     >
//       <div
//         className={`fixed inset-0 bg-black transition-opacity duration-300 ${
//           isOpen ? "opacity-30" : "opacity-0"
//         }`}
//         onClick={onClose}
//       />

//       <div
//         className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="flex items-center justify-between px-5 py-4">
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

//         <div className="flex items-center gap-2 px-5 py-4">
//           <div className="w-2/5">
//             <DropDown
//               name="category"
//               label=""
//               value={category}
//               options={categories.map((c) => c.name)}
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

//         <div className="flex justify-between items-center px-5 text-sm text-gray-700 font-medium">
//           <span>Selected Materials(0)</span>
//           <Button
//             className="text-white bg-red-600 hover:bg-red-700 cursor-pointer"
//             variant="custom"
//             onClick={() => setShowAddModal(true)}
//           >
//             + New Materail
//           </Button>
//         </div>

//         <div className="px-5 overflow-y-auto h-[calc(100%-190px)] pb-6 mt-2">
//           {loading ? (
//             <div className="flex justify-center items-center h-40">
//               <ClipLoader size={35} color="#dc2626" />
//             </div>
//           ) : filteredMaterials.length > 0 ? (
//             filteredMaterials.map((item, idx) => (
//               <div
//                 key={idx}
//                 className="flex justify-between items-start py-3 border-b border-gray-200 text-sm"
//               >
//                 <div>
//                   <p className="font-semibold">{item.name}</p>
//                   <span className="bg-gray-100 px-2 py-0.5 text-xs rounded text-gray-700 inline-block mt-1">
//                     Category: {item.category || category}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <p className="text-xs text-gray-500 whitespace-nowrap">
//                     Unit: {item.unit || "pcs"}
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
//         <AddNewMaterialModal
//           isOpen={showAddModal}
//           onClose={() => setShowAddModal(false)}
//           onSave={handleMaterialSave}
//         />
//       </div>
//     </div>
//   );
// }
