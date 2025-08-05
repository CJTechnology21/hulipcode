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

// LocalStorage helpers
const LOCAL_STORAGE_KEY = "materialGroups";

const saveToLocalStorage = (groups) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(groups));
};

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to load from localStorage", err);
    return [];
  }
};

export default function MaterialLibraryDrawer({
  isOpen,
  onClose,
  selectedProject,
  setMaterialGroups
}) {
  const [category, setCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [checked, setChecked] = useState({});
  const [quantities, setQuantities] = useState({});

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

  useEffect(() => {
    // Load saved materials from localStorage when drawer opens
    const saved = loadFromLocalStorage();
    if (saved.length > 0) {
      setMaterialGroups(saved);
    }
  }, []);

  const filteredMaterials = useMemo(() => {
    return materials.filter((item) =>
      item.name?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [materials, searchText]);

  const handleNext = () => {
    const selected = materials.filter(
      (item) => checked[item._id]
    );

    const enriched = selected.map((m) => ({
      ...m,
      quantity: quantities[m._id] || "",
      deliveryDate: null,
    }));

    const hasInvalidQty = enriched.some(
      (mat) => !mat.quantity || isNaN(mat.quantity)
    );

    if (hasInvalidQty) {
      alert("Please enter quantity for all selected materials.");
      return;
    }

    setMaterialGroups((prev) => {
      const existingGroup = prev.find(
        (group) => group.project === selectedProject
      );

      let updatedGroups;
      if (existingGroup) {
        updatedGroups = prev.map((group) =>
          group.project === selectedProject
            ? { ...group, items: [...group.items, ...enriched] }
            : group
        );
      } else {
        updatedGroups = [...prev, { project: selectedProject, items: enriched }];
      }

      saveToLocalStorage(updatedGroups); // ✅ Save to localStorage
      return updatedGroups;
    });

    // Reset UI state
    setChecked({});
    setQuantities({});
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
          <span>
            Selected Materials ({Object.values(checked).filter(Boolean).length})
          </span>
          <Button
            className="text-white bg-red-600 hover:bg-red-700 cursor-pointer"
            variant="custom"
            onClick={() => setShowAddModal(true)}
          >
            + New Material
          </Button>
        </div>

        {/* Material List */}
        <div className="px-5 overflow-y-auto h-[calc(100%-190px)] pb-6 mt-2">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <ClipLoader size={35} color="#dc2626" />
            </div>
          ) : filteredMaterials.length > 0 ? (
            filteredMaterials.map((item, idx) => (
              <div
                key={item._id || idx}
                className="flex items-center justify-between py-3 border-b border-gray-200 text-sm"
              >
                {/* Left side: checkbox + name */}
                <div className="flex items-start gap-3 w-2/3">
                  <input
                    type="checkbox"
                    checked={checked[item._id] || false}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setChecked((prev) => ({
                        ...prev,
                        [item._id]: isChecked,
                      }));
                      if (!isChecked) {
                        setQuantities((prev) => {
                          const { [item._id]: _, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Category: {item.category || category}
                    </p>
                  </div>
                </div>

                {/* Right side: quantity */}
                <div className="flex flex-col items-end w-1/3">
                  <input
                    type="number"
                    placeholder="Qty"
                    min="0"
                    className="w-20 text-sm border rounded px-2 py-1"
                    value={quantities[item._id] || ""}
                    onChange={(e) =>
                      setQuantities((prev) => ({
                        ...prev,
                        [item._id]: e.target.value,
                      }))
                    }
                    disabled={!checked[item._id]}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Unit: {item.unit || "pcs"}
                  </p>
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

// export default function MaterialLibraryDrawer({
//   isOpen,
//   onClose,
//   selectedProject,
//   setMaterialGroups
// }) {
//   const [category, setCategory] = useState("");
//   const [searchText, setSearchText] = useState("");
//   const [materials, setMaterials] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [checked, setChecked] = useState({});
//   const [quantities, setQuantities] = useState({});

//   const handleMaterialSave = (newMaterial) => {
//     setMaterials((prev) => [...prev, newMaterial]);
//   };

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

//   const filteredMaterials = useMemo(() => {
//     return materials.filter((item) =>
//       item.name?.toLowerCase().includes(searchText.toLowerCase())
//     );
//   }, [materials, searchText]);

//   const handleNext = () => {
//     const selected = materials.filter(
//       (item) => checked[item._id]
//     );

//     const enriched = selected.map((m) => ({
//       ...m,
//       quantity: quantities[m._id] || "",
//       deliveryDate: null,
//     }));

//     const hasInvalidQty = enriched.some(
//       (mat) => !mat.quantity || isNaN(mat.quantity)
//     );

//     if (hasInvalidQty) {
//       alert("Please enter quantity for all selected materials.");
//       return;
//     }

//     setMaterialGroups((prev) => {
//       const existingGroup = prev.find(
//         (group) => group.project === selectedProject
//       );

//       if (existingGroup) {
//         return prev.map((group) =>
//           group.project === selectedProject
//             ? { ...group, items: [...group.items, ...enriched] }
//             : group
//         );
//       } else {
//         return [...prev, { project: selectedProject, items: enriched }];
//       }
//     });

//     // Reset UI state
//     setChecked({});
//     setQuantities({});
//     onClose();
//   };

//   return (
//     <div className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}>
//       {/* Overlay */}
//       <div
//         className={`fixed inset-0 bg-black transition-opacity duration-300 ${
//           isOpen ? "opacity-30" : "opacity-0"
//         }`}
//         onClick={onClose}
//       />

//       {/* Drawer */}
//       <div
//         className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-4">
//           <button onClick={onClose}>
//             <MdClose className="text-xl text-black" />
//           </button>

//           <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
//             Materials Library
//           </h2>

//           <button
//             className="bg-red-600 text-white text-sm font-medium px-4 py-1.5 rounded hover:bg-red-700"
//             onClick={handleNext}
//           >
//             Next
//           </button>
//         </div>

//         <div className="h-1 bg-red-600" />

//         {/* Filters */}
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

//         {/* Header Row */}
//         <div className="flex justify-between items-center px-5 text-sm text-gray-700 font-medium">
//           <span>
//             Selected Materials ({Object.values(checked).filter(Boolean).length})
//           </span>
//           <Button
//             className="text-white bg-red-600 hover:bg-red-700 cursor-pointer"
//             variant="custom"
//             onClick={() => setShowAddModal(true)}
//           >
//             + New Material
//           </Button>
//         </div>

//         {/* Material List */}
//         <div className="px-5 overflow-y-auto h-[calc(100%-190px)] pb-6 mt-2">
//           {loading ? (
//             <div className="flex justify-center items-center h-40">
//               <ClipLoader size={35} color="#dc2626" />
//             </div>
//           ) : filteredMaterials.length > 0 ? (
//             filteredMaterials.map((item, idx) => (
//               <div
//                 key={item._id || idx}
//                 className="flex items-center justify-between py-3 border-b border-gray-200 text-sm"
//               >
//                 {/* Left side: checkbox + name */}
//                 <div className="flex items-start gap-3 w-2/3">
//                   <input
//                     type="checkbox"
//                     checked={checked[item._id] || false}
//                     onChange={(e) => {
//                       const isChecked = e.target.checked;
//                       setChecked((prev) => ({
//                         ...prev,
//                         [item._id]: isChecked,
//                       }));
//                       if (!isChecked) {
//                         setQuantities((prev) => {
//                           const { [item._id]: _, ...rest } = prev;
//                           return rest;
//                         });
//                       }
//                     }}
//                     className="mt-1"
//                   />
//                   <div>
//                     <p className="font-medium">{item.name}</p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Category: {item.category || category}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Right side: quantity */}
//                 <div className="flex flex-col items-end w-1/3">
//                   <input
//                     type="number"
//                     placeholder="Qty"
//                     min="0"
//                     className="w-20 text-sm border rounded px-2 py-1"
//                     value={quantities[item._id] || ""}
//                     onChange={(e) =>
//                       setQuantities((prev) => ({
//                         ...prev,
//                         [item._id]: e.target.value,
//                       }))
//                     }
//                     disabled={!checked[item._id]}
//                   />
//                   <p className="text-xs text-gray-400 mt-1">
//                     Unit: {item.unit || "pcs"}
//                   </p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-sm text-center text-gray-500 mt-4">
//               No materials found.
//             </div>
//           )}
//         </div>

//         {/* Add Material Modal */}
//         <AddNewMaterialModal
//           isOpen={showAddModal}
//           onClose={() => setShowAddModal(false)}
//           onSave={handleMaterialSave}
//         />
//       </div>
//     </div>
//   );
// }

