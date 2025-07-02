
import React, { useState } from "react";

const colorOptions = [
  { name: "Brown", hex: "#8B4513" },
  { name: "Grey", hex: "#808080" },
  { name: "White", hex: "#ffffff" },
  { name: "Beige", hex: "#f5f5dc" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Black", hex: "#000000" },
  { name: "Red", hex: "#FF0000" },
  { name: "Green", hex: "#008000" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Purple", hex: "#800080" },
  { name: "Navy", hex: "#000080" },
  { name: "Gold", hex: "#FFD700" },
  { name: "Teal", hex: "#008080" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Ivory", hex: "#FFFFF0" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Charcoal", hex: "#36454F" },
  { name: "Olive", hex: "#808000" },
  { name: "Cyan", hex: "#00FFFF" },
  { name: "Tan", hex: "#D2B48C" },
];

export default function ColorFilter({ selectedColors, onColorChange }) {
  const [showModal, setShowModal] = useState(false);

  const toggleColor = (color) => {
    if (selectedColors.includes(color)) {
      onColorChange(selectedColors.filter((c) => c !== color));
    } else {
      onColorChange([...selectedColors, color]);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-2">Color</h3>
      <input
        type="text"
        placeholder="Search Color"
        className="w-full border px-2 py-1 rounded mb-2"
      />

      {/* Show first 6 */}
      {colorOptions.slice(0, 6).map((color) => (
        <label key={color.name} className="flex items-center gap-2 mb-1">
          <input
            type="checkbox"
            checked={selectedColors.includes(color.name)}
            onChange={() => toggleColor(color.name)}
          />
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ backgroundColor: color.hex }}
          ></span>
          {color.name}
        </label>
      ))}

      <p
        className="text-blue-600 text-sm mt-2 cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        + See more ({colorOptions.length - 6})
      </p>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-2/3 max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Select Colors</h2>
              <button onClick={() => setShowModal(false)} className="text-lg font-bold text-gray-500">✕</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {colorOptions.map((color) => (
                <label key={color.name} className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color.name)}
                    onChange={() => toggleColor(color.name)}
                  />
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: color.hex }}
                  ></span>
                  {color.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const colorOptions = [
//   { name: "Brown", hex: "#8B4513" },
//   { name: "Grey", hex: "#808080" },
//   { name: "White", hex: "#ffffff" },
//   { name: "Beige", hex: "#f5f5dc" },
//   { name: "Blue", hex: "#0000FF" },
//   { name: "Black", hex: "#000000" },
//   { name: "Red", hex: "#FF0000" },
//   { name: "Green", hex: "#008000" },
//   { name: "Yellow", hex: "#FFFF00" },
//   { name: "Pink", hex: "#FFC0CB" },
//   { name: "Purple", hex: "#800080" },
//   { name: "Navy", hex: "#000080" },
//   { name: "Gold", hex: "#FFD700" },
//   { name: "Teal", hex: "#008080" },
//   { name: "Orange", hex: "#FFA500" },
//   { name: "Ivory", hex: "#FFFFF0" },
//   { name: "Silver", hex: "#C0C0C0" },
//   { name: "Charcoal", hex: "#36454F" },
//   { name: "Olive", hex: "#808000" },
//   { name: "Cyan", hex: "#00FFFF" },
//   { name: "Tan", hex: "#D2B48C" },
// ];

// export default function ColorFilter() {
//   const [selectedColors, setSelectedColors] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   // 🔄 Fetch products whenever selectedColors changes
//   useEffect(() => {
//     const fetchFilteredProducts = async () => {
//       try {
//         const query = selectedColors.length ? `?color=${selectedColors.join(",")}` : "";
//         const res = await axios.get(`/api/products${query}`);
//         setProducts(res.data);
//       } catch (err) {
//         console.error("Fetch failed", err);
//       }
//     };

//     fetchFilteredProducts();
//   }, [selectedColors]);

//   const toggleColor = (color) => {
//     setSelectedColors((prev) =>
//       prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
//     );
//   };

//   return (
//     <div className="mb-6">
//       <h3 className="font-medium mb-2">Color</h3>
//       <input
//         type="text"
//         placeholder="Search Color"
//         className="w-full border px-2 py-1 rounded mb-2"
//       />

//       {/* Show first 6 */}
//       {colorOptions.slice(0, 6).map((color) => (
//         <label key={color.name} className="flex items-center gap-2 mb-1">
//           <input
//             type="checkbox"
//             checked={selectedColors.includes(color.name)}
//             onChange={() => toggleColor(color.name)}
//           />
//           <span
//             className="w-3 h-3 rounded-full inline-block"
//             style={{ backgroundColor: color.hex }}
//           ></span>
//           {color.name}
//         </label>
//       ))}

//       <p
//         className="text-blue-600 text-sm mt-2 cursor-pointer"
//         onClick={() => setShowModal(true)}
//       >
//         + See more ({colorOptions.length - 6})
//       </p>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
//           <div className="bg-white rounded-lg p-6 w-11/12 md:w-2/3 max-h-[90vh] overflow-y-auto relative">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">Select Colors</h2>
//               <button onClick={() => setShowModal(false)} className="text-lg font-bold text-gray-500">✕</button>
//             </div>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//               {colorOptions.map((color) => (
//                 <label key={color.name} className="flex items-center gap-2 mb-1">
//                   <input
//                     type="checkbox"
//                     checked={selectedColors.includes(color.name)}
//                     onChange={() => toggleColor(color.name)}
//                   />
//                   <span
//                     className="w-3 h-3 rounded-full inline-block"
//                     style={{ backgroundColor: color.hex }}
//                   ></span>
//                   {color.name}
//                 </label>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Preview filtered results */}
//       <div className="mt-6">
//         <h3 className="font-semibold mb-2">Filtered Products</h3>
//         {products.length === 0 ? (
//           <p>No products found.</p>
//         ) : (
//           <ul className="space-y-2">
//             {products.map((p) => (
//               <li key={p._id} className="border p-2 rounded">
//                 <h4 className="font-medium">{p.name}</h4>
//                 <p className="text-sm text-gray-600">{p.description}</p>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }
