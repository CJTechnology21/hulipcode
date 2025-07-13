// components/QuoteItemizedSection.jsx
import React, { useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
const initialItems = [
  {
    id: 1,
    photo: "/images/sample.jpg",
    code: "BHD876633",
    category: "Electrical Work",
    description: "Internal Electrical Work",
    spec: "KEI, FINOLEX, POLYCAB.",
    qty: 140,
    unit: "sqft",
    rate: 250,
    gst: 18,
  },
  {
    id: 2,
    photo: "/images/sample.jpg",
    code: "KNCH962365",
    category: "Plumbing Work",
    description: "Internal Plumbing Work",
    spec: "Supreme Astral prince.",
    qty: 1,
    unit: "Lumsum",
    rate: 25000,
    gst: 18,
  },
  {
    id: 3,
    photo: "/images/sample.jpg",
    code: "FLOOR123456",
    category: "Flooring Work",
    description: "Vitrified Tiles Flooring",
    spec: "Kajaria, Somany, Johnson.",
    qty: 500,
    unit: "sqft",
    rate: 60,
    gst: 18,
  },
  {
    id: 4,
    photo: "/images/sample.jpg",
    code: "WALLPAPER7890",
    category: "Wall Treatment",
    description: "Designer Wallpaper",
    spec: "Imported Vinyl Wallpaper.",
    qty: 300,
    unit: "sqft",
    rate: 150,
    gst: 18,
  },
];

const QuoteItemizedSection = ({ areaName = "Master Bedroom Toilet" }) => {
  const [length, setLength] = useState(12);
  const [breadth, setBreadth] = useState(6);
  const [height, setHeight] = useState(9);
  const [unit, setUnit] = useState("Feet");
  const [toggle, setToggle] = useState("Save");

  const [items, setItems] = useState(initialItems);
  const [dimensions, setDimensions] = useState([
    { name: "Door 1", h: 7, w: 2.5 },
    { name: "Door 2", h: 7, w: 3 },
    { name: "Window", h: 3, w: 2 },
  ]);
  const [editField, setEditField] = useState({ index: null, type: null });

  const handleValueChange = (index, type, value) => {
    const updated = [...dimensions];
    updated[index][type] = value;
    setDimensions(updated);
  };

  const floorArea = length * breadth;
  const wallArea = 2 * height * (length + breadth);
  const perimeter = 2 * (length + breadth);
  const total = items.reduce(
    (sum, item) => sum + item.qty * item.rate * (1 + item.gst / 100),
    0
  );

  return (
    <div className="bg-white p-4 rounded shadow space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        {/* Area Name & Category */}
        <div className="space-y-4">
          <div>
            <label className="text-red-700 font-bold text-sm block">Area Name</label>
            <div className="relative">
              <input
                type="text"
                value={areaName}
                readOnly
                className="border rounded px-2 py-1 w-full pr-8 font-semibold"
              />
              <FaEdit className="absolute top-2.5 right-2 text-red-700 cursor-pointer text-sm" />
            </div>
          </div>
          <div>
            <label className="text-red-700 font-bold text-sm block">Select Category</label>
            <div className="relative">
              <input
                type="text"
                value="Toilet"
                readOnly
                className="border rounded px-2 py-1 w-full pr-8 font-semibold"
              />
              <FaEdit className="absolute top-2.5 right-2 text-red-700 cursor-pointer text-sm" />
            </div>
          </div>
        </div>

        {/* Area Dimensions */}
        <div className="space-y-2">
          <label className="text-red-700 font-bold text-sm block">Enter Area Dimensions</label>
          {[{ label: "Length", val: length, set: setLength },
            { label: "Breadth", val: breadth, set: setBreadth },
            { label: "Height", val: height, set: setHeight }].map((dim) => (
            <div key={dim.label} className="flex items-center gap-3">
              <span className="text-sm font-bold text-red-700 w-16">{dim.label}</span>
              <div className="relative w-24">
                <input
                  type="number"
                  value={dim.val}
                  onChange={(e) => dim.set(+e.target.value)}
                  className="border rounded px-2 py-1 w-full pr-10 font-bold text-sm text-center"
                />
                <span className="absolute top-1/2 right-7 transform -translate-y-1/2 text-xs text-black font-bold">ft</span>
                <FaEdit className="absolute top-1/2 right-1 transform -translate-y-1/2 text-red-700 text-xs cursor-pointer" />
              </div>
            </div>
          ))}
        </div>

        {/* Doors & Windows */}
        <div className="">
          <div className="flex items-center justify-between mb-3 mr-20">
            <label className="text-red-700 font-bold text-sm">Door &amp; Window Dimensions</label>
            <button className="flex items-center gap-1 bg-red-700 text-white text-sm px-3 py-1 rounded-full">
              <FaPlus className="text-xs" /> Add
            </button>
          </div>

          {dimensions.map((item, index) => (
            <div key={item.name} className="flex items-center gap-3 mb-2">
              <label className="text-red-700 font-bold text-sm w-20">{item.name}</label>
              <span className="text-red-700 font-bold text-sm">H</span>
              <div className="relative w-20">
                {editField.index === index && editField.type === "h" ? (
                  <input
                    type="number"
                    value={item.h}
                    autoFocus
                    className="border rounded px-2 py-1 w-full pr-10 text-sm font-bold text-center"
                    onChange={(e) => handleValueChange(index, "h", parseFloat(e.target.value))}
                    onBlur={() => setEditField({ index: null, type: null })}
                    onKeyDown={(e) => e.key === "Enter" && setEditField({ index: null, type: null })}
                  />
                ) : (
                  <div className="border rounded px-2 py-1 w-full pr-10 text-sm font-bold text-center relative">
                    {item.h}
                    <span className="absolute top-1/2 right-7 transform -translate-y-1/2 text-black text-xs">ft</span>
                    <FaEdit className="absolute top-1/2 right-1 transform -translate-y-1/2 text-red-700 text-xs cursor-pointer" onClick={() => setEditField({ index, type: "h" })} />
                  </div>
                )}
              </div>
              <span className="text-red-700 font-bold text-sm">W</span>
              <div className="relative w-20">
                {editField.index === index && editField.type === "w" ? (
                  <input
                    type="number"
                    value={item.w}
                    autoFocus
                    className="border rounded px-2 py-1 w-full pr-10 text-sm font-bold text-center"
                    onChange={(e) => handleValueChange(index, "w", parseFloat(e.target.value))}
                    onBlur={() => setEditField({ index: null, type: null })}
                    onKeyDown={(e) => e.key === "Enter" && setEditField({ index: null, type: null })}
                  />
                ) : (
                  <div className="border rounded px-2 py-1 w-full pr-10 text-sm font-bold text-center relative">
                    {item.w}
                    <span className="absolute top-1/2 right-7 transform -translate-y-1/2 text-black text-xs">ft</span>
                    <FaEdit className="absolute top-1/2 right-1 transform -translate-y-1/2 text-red-700 text-xs cursor-pointer" onClick={() => setEditField({ index, type: "w" })} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Unit toggle + Area Values */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold">Unit</label>
            <button onClick={() => setUnit(unit === "Feet" ? "Meters" : "Feet")} className="border text-sm rounded px-2 py-1">
              {unit}
            </button>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between border rounded px-2 py-1"><span>Perimeter</span><span>{perimeter} ft</span></div>
            <div className="flex justify-between border rounded px-2 py-1"><span>Floor Area</span><span>{floorArea} ft²</span></div>
            <div className="flex justify-between border rounded px-2 py-1"><span>Wall Area</span><span>{wallArea} ft²</span></div>
          </div>
        </div>

        {/* Save / Action Toggle + Buttons */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <button onClick={() => setToggle(toggle === "Save" ? "Action" : "Save")} className="border text-sm rounded px-3 py-1">
              {toggle}
            </button>
          </div>
          <div className="font-bold text-red-700 text-sm underline">Area Calculation</div>
          <button className="w-full border px-2 py-1 rounded text-sm">Automatic</button>
          <button className="w-full bg-red-700 text-white px-2 py-1 rounded text-sm">Custom</button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border mt-4">
          <thead className="bg-gray-100 font-semibold">
            <tr>
              <th className="border px-2 py-1">S.No</th>
              <th className="border px-2 py-1">Photo</th>
              <th className="border px-2 py-1">Code & Category</th>
              <th className="border px-2 py-1">Description</th>
              <th className="border px-2 py-1">Specification</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Unit</th>
              <th className="border px-2 py-1">Rate</th>
              <th className="border px-2 py-1">Amount</th>
              <th className="border px-2 py-1">GST (%)</th>
              <th className="border px-2 py-1">Total</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const amount = item.qty * item.rate;
              const totalWithGST = amount * (1 + item.gst / 100);
              return (
                <tr key={item.id}>
                  <td className="border px-2 py-1">{idx + 1}</td>
                  <td className="border px-2 py-1">
                    <img src={item.photo} alt="item" className="w-10 h-10 object-cover" />
                  </td>
                  <td className="border px-2 py-1">{item.code} / {item.category}</td>
                  <td className="border px-2 py-1">{item.description}</td>
                  <td className="border px-2 py-1">{item.spec}</td>
                  <td className="border px-2 py-1">{item.qty}</td>
                  <td className="border px-2 py-1">{item.unit}</td>
                  <td className="border px-2 py-1">₹ {item.rate}</td>
                  <td className="border px-2 py-1">₹ {amount}</td>
                  <td className="border px-2 py-1">{item.gst}%</td>
                  <td className="border px-2 py-1">₹ {totalWithGST.toFixed(2)}</td>
                  <td className="border px-2 py-1 flex gap-2">
                    <FaEdit className="text-blue-600 cursor-pointer" />
                    <FaTrash className="text-red-600 cursor-pointer" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-right text-lg font-semibold text-red-700 mt-4">
        Total Amount: ₹ {total.toLocaleString("en-IN")}/-
      </div>
    </div>
  );
};

export default QuoteItemizedSection;

// import React, { useState } from "react";
// import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

// const initialItems = [
//   {
//     id: 1,
//     photo: "/images/sample.jpg",
//     code: "BHD876633",
//     category: "Electrical Work",
//     description: "Internal Electrical Work",
//     spec: "KEI, FINOLEX, POLYCAB.",
//     qty: 140,
//     unit: "sqft",
//     rate: 250,
//     gst: 18,
//   },
//   {
//     id: 2,
//     photo: "/images/sample.jpg",
//     code: "KNCH962365",
//     category: "Plumbing Work",
//     description: "Internal Plumbing Work",
//     spec: "Supreme Astral prince.",
//     qty: 1,
//     unit: "Lumsum",
//     rate: 25000,
//     gst: 18,
//   },
//   {
//     id: 3,
//     photo: "/images/sample.jpg",
//     code: "FLOOR123456",
//     category: "Flooring Work",
//     description: "Vitrified Tiles Flooring",
//     spec: "Kajaria, Somany, Johnson.",
//     qty: 500,
//     unit: "sqft",
//     rate: 60,
//     gst: 18,
//   },
//   {
//     id: 4,
//     photo: "/images/sample.jpg",
//     code: "WALLPAPER7890",
//     category: "Wall Treatment",
//     description: "Designer Wallpaper",
//     spec: "Imported Vinyl Wallpaper.",
//     qty: 300,
//     unit: "sqft",
//     rate: 150,
//     gst: 18,
//   },
// ];

// const QuoteItemizedSection = ({ areaName = "Master Bedroom Toilet" }) => {
//   const [length, setLength] = useState(12);
//   const [breadth, setBreadth] = useState(6);
//   const [height, setHeight] = useState(9);
//   const [items, setItems] = useState(initialItems);

//   const [dimensions, setDimensions] = useState([
//     { name: "Door 1", h: 7, w: 2.5 },
//     { name: "Door 2", h: 7, w: 3 },
//     { name: "Window", h: 3, w: 2 },
//   ]);

//   const [editField, setEditField] = useState({ index: null, type: null });

//   const handleValueChange = (index, type, value) => {
//     const updated = [...dimensions];
//     updated[index][type] = value;
//     setDimensions(updated);
//   };

//   const floorArea = length * breadth;
//   const wallArea = 2 * height * (length + breadth);
//   const perimeter = 2 * (length + breadth);
//   const total = items.reduce(
//     (sum, item) => sum + item.qty * item.rate * (1 + item.gst / 100),
//     0
//   );

//   return (
//     <div className="bg-white p-4 rounded shadow space-y-6">
//       <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
//         {/* Area Name & Category */}
//         <div className="col-span-1 space-y-4">
//           <div>
//             <label className="text-red-700 font-bold text-sm block">
//               Area Name
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 value={areaName}
//                 readOnly
//                 className="border rounded px-2 py-1 w-full pr-8 font-semibold"
//               />
//               <FaEdit className="absolute top-2.5 right-2 text-red-700 cursor-pointer text-sm" />
//             </div>
//           </div>
//           <div>
//             <label className="text-red-700 font-bold text-sm block">
//               Select Category
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 value="Toilet"
//                 readOnly
//                 className="border rounded px-2 py-1 w-full pr-8 font-semibold"
//               />
//               <FaEdit className="absolute top-2.5 right-2 text-red-700 cursor-pointer text-sm" />
//             </div>
//           </div>
//         </div>

//         {/* Area Dimensions */}
//         <div className="col-span-1 space-y-2">
//           <label className="text-red-700 font-bold text-sm block">
//             Enter Area Dimensions
//           </label>
//           {[{ label: "Length", val: length, set: setLength },
//             { label: "Breadth", val: breadth, set: setBreadth },
//             { label: "Height", val: height, set: setHeight }].map((dim) => (
//             <div key={dim.label} className="flex items-center gap-2">
//               <label className="text-sm font-bold text-black w-16">{dim.label}</label>
//               <div className="relative w-24">
//                 <input
//                   type="number"
//                   value={dim.val}
//                   onChange={(e) => dim.set(+e.target.value)}
//                   className="border rounded px-2 py-1 w-full pr-10 font-bold text-sm text-center"
//                 />
//                 <span className="absolute top-1/2 right-7 transform -translate-y-1/2 text-xs text-black font-bold">
//                   ft
//                 </span>
//                 <FaEdit className="absolute top-1/2 right-1 transform -translate-y-1/2 text-red-700 text-xs cursor-pointer" />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Door & Window Dimensions */}
//         <div className="col-span-1 ">
//           <div className="flex items-center justify-between mb-3">
//             <label className="text-red-700 font-bold text-sm">
//               Door &amp; Window Dimensions
//             </label>
//             <button className="flex items-center gap-1 bg-red-700 text-white text-sm px-3 py-1 rounded-full">
//               <FaPlus className="text-xs" />
//               Add
//             </button>
//           </div>

//           {dimensions.map((item, index) => (
//             <div key={item.name} className="flex items-center gap-2 mb-2">
//               <label className="text-red-700 font-bold text-sm w-20">{item.name}</label>

//               <span className="text-red-700 font-bold text-sm">H</span>
//               <div className="relative w-20">
//                 {editField.index === index && editField.type === "h" ? (
//                   <input
//                     type="number"
//                     value={item.h}
//                     autoFocus
//                     className="border rounded px-2 py-1 w-full pr-10 text-sm font-bold text-center"
//                     onChange={(e) =>
//                       handleValueChange(index, "h", parseFloat(e.target.value))
//                     }
//                     onBlur={() => setEditField({ index: null, type: null })}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter")
//                         setEditField({ index: null, type: null });
//                     }}
//                   />
//                 ) : (
//                   <div className="border rounded px-2 py-1 w-full pr-10 text-sm font-bold text-center relative">
//                     {item.h}
//                     <span className="absolute top-1/2 right-7 transform -translate-y-1/2 text-black text-xs">ft</span>
//                     <FaEdit
//                       className="absolute top-1/2 right-1 transform -translate-y-1/2 text-red-700 text-xs cursor-pointer"
//                       onClick={() => setEditField({ index, type: "h" })}
//                     />
//                   </div>
//                 )}
//               </div>

//               <span className="text-red-700 font-bold text-sm">W</span>
//               <div className="relative w-20">
//                 {editField.index === index && editField.type === "w" ? (
//                   <input
//                     type="number"
//                     value={item.w}
//                     autoFocus
//                     className="border rounded px-2 py-1 w-full pr-10 text-sm font-bold text-center"
//                     onChange={(e) =>
//                       handleValueChange(index, "w", parseFloat(e.target.value))
//                     }
//                     onBlur={() => setEditField({ index: null, type: null })}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter")
//                         setEditField({ index: null, type: null });
//                     }}
//                   />
//                 ) : (
//                   <div className="border rounded px-2 py-1 w-full pr-10 text-sm font-bold text-center relative">
//                     {item.w}
//                     <span className="absolute top-1/2 right-7 transform -translate-y-1/2 text-black text-xs">ft</span>
//                     <FaEdit
//                       className="absolute top-1/2 right-1 transform -translate-y-1/2 text-red-700 text-xs cursor-pointer"
//                       onClick={() => setEditField({ index, type: "w" })}
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Unit & Area Calculations */}
//         <div className="col-span-1 space-y-2">
//           <div className="flex items-center justify-between">
//             <label className="text-sm font-bold">Unit</label>
//             <button className="border text-sm rounded px-2 py-1">Feet</button>
//           </div>
//           <div className="text-sm">
//             <div className="flex justify-between border rounded px-2 py-1 mb-1">
//               <span>Perimeter</span>
//               <span>{perimeter} ft</span>
//             </div>
//             <div className="flex justify-between border rounded px-2 py-1 mb-1">
//               <span>Floor Area</span>
//               <span>{floorArea} ft²</span>
//             </div>
//             <div className="flex justify-between border rounded px-2 py-1 mb-1">
//               <span>Wall Area</span>
//               <span>{wallArea} ft²</span>
//             </div>
//           </div>
//         </div>

//         {/* Area Buttons */}
//         <div className="col-span-1 space-y-2">
//           <div className="font-bold text-red-700 text-sm underline">
//             Area Calculation
//           </div>
//           <button className="w-full border px-2 py-1 rounded text-sm">
//             Automatic
//           </button>
//           <button className="w-full bg-red-700 text-white px-2 py-1 rounded text-sm">
//             Custom
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full text-sm text-left border mt-4">
//           <thead className="bg-gray-100 font-semibold">
//             <tr>
//               <th className="border px-2 py-1">S.No</th>
//               <th className="border px-2 py-1">Photo</th>
//               <th className="border px-2 py-1">Code & Category</th>
//               <th className="border px-2 py-1">Description</th>
//               <th className="border px-2 py-1">Specification</th>
//               <th className="border px-2 py-1">Qty</th>
//               <th className="border px-2 py-1">Unit</th>
//               <th className="border px-2 py-1">Rate</th>
//               <th className="border px-2 py-1">Amount</th>
//               <th className="border px-2 py-1">GST (%)</th>
//               <th className="border px-2 py-1">Total</th>
//               <th className="border px-2 py-1">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((item, idx) => {
//               const amount = item.qty * item.rate;
//               const totalWithGST = amount * (1 + item.gst / 100);
//               return (
//                 <tr key={item.id}>
//                   <td className="border px-2 py-1">{idx + 1}</td>
//                   <td className="border px-2 py-1">
//                     <img
//                       src={item.photo}
//                       alt="item"
//                       className="w-10 h-10 object-cover"
//                     />
//                   </td>
//                   <td className="border px-2 py-1">
//                     {item.code} / {item.category}
//                   </td>
//                   <td className="border px-2 py-1">{item.description}</td>
//                   <td className="border px-2 py-1">{item.spec}</td>
//                   <td className="border px-2 py-1">{item.qty}</td>
//                   <td className="border px-2 py-1">{item.unit}</td>
//                   <td className="border px-2 py-1">₹ {item.rate}</td>
//                   <td className="border px-2 py-1">₹ {amount}</td>
//                   <td className="border px-2 py-1">{item.gst}%</td>
//                   <td className="border px-2 py-1">₹ {totalWithGST.toFixed(2)}</td>
//                   <td className="border px-2 py-1 flex gap-2">
//                     <FaEdit className="text-blue-600 cursor-pointer" />
//                     <FaTrash className="text-red-600 cursor-pointer" />
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       <div className="text-right text-lg font-semibold text-red-700 mt-4">
//         Total Amount: ₹ {total.toLocaleString("en-IN")}/-
//       </div>
//     </div>
//   );
// };

// export default QuoteItemizedSection;
