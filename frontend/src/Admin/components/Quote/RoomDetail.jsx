// import React, { useState } from "react";
// import { FaEdit, FaTrash, FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { FiFilter } from "react-icons/fi";

// const RoomDetails = ({ activeSection }) => {
//   const [showTerms, setShowTerms] = useState(false);
//   const [areaName, setAreaName] = useState("Master Bedroom Toilet");
//   const [category, setCategory] = useState("Toilet");
//   const [dimensions, setDimensions] = useState({ length: 12, breadth: 6, height: 9 });
//   const [doors, setDoors] = useState([
//     { height: 7, width: 2.5 },
//     { height: 7, width: 3 },
//   ]);
//   const [windows, setWindows] = useState([{ height: 3, width: 2 }]);

//   const [deliverables, setDeliverables] = useState([
//     {
//       id: 1,
//       code: "BHD8776633",
//       photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_YzvczViX9h-ipXqi6xIwU56qMEyUpg-kEg&s", // Replace with real image paths
//       category: "Electrical Work",
//       description: "Internal Electrical Work...",
//       specification: "KEI, FINOLEX, POLYCAB.",
//       qty: 140,
//       unit: "sqft",
//       rate: 250,
//       gst: 18,
//     },
//     {
//       id: 2,
//       code: "KNCH962635",
//       photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_YzvczViX9h-ipXqi6xIwU56qMEyUpg-kEg&s",
//       category: "Plumbing Work",
//       description: "Internal Plumbing Work...",
//       specification: "Supreme Astral prince.",
//       qty: 1,
//       unit: "Lumsum",
//       rate: 25000,
//       gst: 18,
//     },
//     {
//       id: 3,
//       code: "NHJ008976",
//       photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_YzvczViX9h-ipXqi6xIwU56qMEyUpg-kEg&s",
//       category: "Civil Work",
//       description: "Floor Screeding...",
//       specification: "",
//       qty: 60,
//       unit: "sqft",
//       rate: 140,
//       gst: 18,
//     },
//     {
//       id: 4,
//       code: "NHJ008976",
//       photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_YzvczViX9h-ipXqi6xIwU56qMEyUpg-kEg&s",
//       category: "Civil Work",
//       description: "Floor Tiling...",
//       specification: "Kajaria Somany",
//       qty: 150,
//       unit: "sqft",
//       rate: 140,
//       gst: 18,
//     },
//   ]);

//   const formatCurrency = (amount) => `Rs ${amount.toLocaleString("en-IN")}/-`;

//   const calculateTotal = (item) => {
//     const amount = item.qty * item.rate;
//     const tax = (amount * item.gst) / 100;
//     return amount + tax;
//   };

//   const floorArea = dimensions.length * dimensions.breadth;
//   const wallArea = 2 * dimensions.height * (dimensions.length + dimensions.breadth);
//   const perimeter = 2 * (dimensions.length + dimensions.breadth);

//   const totalAmount = deliverables.reduce((sum, item) => sum + item.qty * item.rate, 0);
//   const totalTax = deliverables.reduce(
//     (sum, item) => sum + (item.qty * item.rate * item.gst) / 100,
//     0
//   );

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md space-y-4 text-sm">
//       {/* Header Inputs */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div>
//           <label className="block font-semibold">Area Name</label>
//           <input
//             value={areaName}
//             onChange={(e) => setAreaName(e.target.value)}
//             className="border px-2 py-1 w-full rounded"
//           />
//         </div>
//         <div>
//           <label className="block font-semibold">Select Category</label>
//           <input
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="border px-2 py-1 w-full rounded"
//           />
//         </div>
//         <div>
//           <label className="block font-semibold">Length</label>
//           <input
//             value={dimensions.length}
//             type="number"
//             onChange={(e) =>
//               setDimensions({ ...dimensions, length: parseFloat(e.target.value) })
//             }
//             className="border px-2 py-1 w-full rounded"
//           />
//         </div>
//         <div>
//           <label className="block font-semibold">Breadth</label>
//           <input
//             value={dimensions.breadth}
//             type="number"
//             onChange={(e) =>
//               setDimensions({ ...dimensions, breadth: parseFloat(e.target.value) })
//             }
//             className="border px-2 py-1 w-full rounded"
//           />
//         </div>
//       </div>

//       {/* Doors & Windows */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
//         <div>
//           <label className="block font-semibold">Height</label>
//           <input
//             value={dimensions.height}
//             type="number"
//             onChange={(e) =>
//               setDimensions({ ...dimensions, height: parseFloat(e.target.value) })
//             }
//             className="border px-2 py-1 w-full rounded"
//           />
//         </div>
//         <div className="col-span-2">
//           <label className="block font-semibold">Door & Window Dimensions</label>
//           <button className="bg-red-600 text-white px-2 py-1 rounded ml-2 text-xs">
//             <FaPlus className="inline-block mr-1" /> Add
//           </button>
//         </div>
//         <div>
//           <div className="font-semibold">Unit</div>
//           <div className="flex gap-2 mt-1">
//             <button className="border px-2 py-1 rounded text-xs">Feet</button>
//             <button className="border px-2 py-1 rounded text-xs">Meter</button>
//           </div>
//         </div>
//       </div>

//       {/* Auto Calculation */}
//       <div className="grid grid-cols-3 gap-4 text-sm mt-4">
//         <div>
//           <label className="block font-medium">Perimeter</label>
//           <div className="border px-2 py-1 rounded">{perimeter} ft</div>
//         </div>
//         <div>
//           <label className="block font-medium">Floor Area</label>
//           <div className="border px-2 py-1 rounded">{floorArea} ft</div>
//         </div>
//         <div>
//           <label className="block font-medium">Wall Area</label>
//           <div className="border px-2 py-1 rounded">{wallArea} ft</div>
//         </div>
//       </div>

//       {/* Deliverables Table */}
//       <div className="overflow-x-auto mt-4">
//         <table className="min-w-full border text-xs">
//           <thead>
//             <tr className="bg-gray-100 border-b">
//               <th className="p-2">S.No</th>
//               <th className="p-2">Photo</th>
//               <th className="p-2">Deliverables</th>
//               <th className="p-2">Specification</th>
//               <th className="p-2">Qty</th>
//               <th className="p-2">Unit</th>
//               <th className="p-2">Rate</th>
//               <th className="p-2">Amount</th>
//               <th className="p-2">GST (%)</th>
//               <th className="p-2">Total</th>
//               <th className="p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {deliverables.map((item, index) => {
//               const amount = item.qty * item.rate;
//               const total = calculateTotal(item);
//               return (
//                 <tr key={item.id} className="border-b">
//                   <td className="p-2">{index + 1}</td>
//                   <td className="p-2">
//                     <img src={item.photo} alt="work" className="w-12 h-12 object-cover" />
//                   </td>
//                   <td className="p-2">
//                     <div className="font-semibold">{item.code}</div>
//                     <div>{item.category}</div>
//                     <div className="text-gray-500">{item.description}</div>
//                   </td>
//                   <td className="p-2">{item.specification}</td>
//                   <td className="p-2">{item.qty}</td>
//                   <td className="p-2">{item.unit}</td>
//                   <td className="p-2">{item.rate}</td>
//                   <td className="p-2">{amount}</td>
//                   <td className="p-2">{item.gst}</td>
//                   <td className="p-2">{formatCurrency(total)}</td>
//                   <td className="p-2">
//                     <div className="flex gap-2">
//                       <FaEdit className="text-blue-600 cursor-pointer" />
//                       <FaTrash className="text-red-600 cursor-pointer" />
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Add Item Button */}
//       <div className="flex justify-start mt-4">
//         <button className="bg-red-700 text-white px-3 py-2 rounded text-xs">
//           <FaPlus className="inline-block mr-1" />
//           Add Item
//         </button>
//       </div>

//       {/* Total Footer */}
//       <div className="flex justify-end mt-4 font-semibold text-sm">
//         <div className="flex flex-col items-end">
//           <div>Amount: {formatCurrency(totalAmount)}</div>
//           <div>Tax: {formatCurrency(totalTax)}</div>
//           <div className="text-lg">
//             Total:{" "}
//             <span className="bg-red-700 text-white px-4 py-1 rounded ml-2">
//               {formatCurrency(totalAmount + totalTax)}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RoomDetails; 