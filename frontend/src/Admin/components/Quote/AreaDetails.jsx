import React, { useState } from "react";
import Button from "../../../components/Button";
import DropDown from "../../../components/DropDown";
import { FaPlus } from "react-icons/fa";

const categories = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Dining Room",
  "Hall",
  "Study Room",
  "Balcony",
  "Toilet",
];

const AreaDetails = ({
  areaName,
  setAreaName,
  category,
  setCategory,
  dimensions,
  setDimensions,
  unit,
  setUnit,
  length,
  setLength,
  breadth,
  setBreadth,
  height,
  setHeight,
  onAddOpening,
}) => {
  const [toggle, setToggle] = useState("Save"); // ✅ Added state for toggle

  const handleValueChange = (index, type, value) => {
    const updated = [...dimensions];
    updated[index][type] = value;
    setDimensions(updated);
  };

  const floorArea = length * breadth;
  const wallArea = 2 * height * (length + breadth);
  const perimeter = 2 * (length + breadth);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
      {/* Area Name & Category */}
      <div className="space-y-4">
        <div>
          <label className="text-red-700 font-bold text-sm block">
            Area Name
          </label>
          <input
            type="text"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
            className="border rounded px-2 py-1 w-full font-semibold"
          />
        </div>
        <div>
          <DropDown
            label="Select Category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categories}
            className="border-red-700 text-red-700 focus:ring-red-700 focus:border-red-700"
          />
        </div>
      </div>

      {/* Area Dimensions */}
      <div className="space-y-2">
        <label className="text-red-700 font-bold text-sm block">
          Enter Area Dimensions
        </label>
        {[
          { label: "Length", val: length, set: setLength },
          { label: "Breadth", val: breadth, set: setBreadth },
          { label: "Height", val: height, set: setHeight },
        ].map((dim) => (
          <div key={dim.label} className="flex items-center gap-3">
            <span className="text-sm font-bold text-red-700 w-16">
              {dim.label}
            </span>
            <input
              type="number"
              value={dim.val}
              onChange={(e) => dim.set(+e.target.value)}
              className="border rounded px-2 py-1 w-24 font-bold text-sm text-center"
            />
            <span className="text-xs font-bold">ft</span>
          </div>
        ))}
      </div>

      {/* Doors & Windows */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-red-700 font-bold text-sm mr-6">
            Door &amp; Window Dimensions
          </label>
          <Button
            variant="custom"
            onClick={onAddOpening}
            className="flex items-center gap-1 bg-red-700 text-white text-sm px-3 py-1 rounded-full"
          >
            <FaPlus className="text-xs" /> Add
          </Button>
        </div>
        <div className="space-y-2 -ml-20 ">
          {dimensions.map((item, index) => (
            <div
              key={item.name}
              className="grid grid-cols-[100px_20px_80px_20px_80px] items-center gap-2"
            >
              <label className="text-red-700 font-bold text-sm text-right">
                {item.name}
              </label>
              <span className="text-red-700 font-bold text-sm">H</span>
              <input
                type="number"
                value={item.h}
                onChange={(e) =>
                  handleValueChange(index, "h", parseFloat(e.target.value))
                }
                className="border rounded px-2 py-1 text-sm font-bold text-center"
              />
              <span className="text-red-700 font-bold text-sm">W</span>
              <input
                type="number"
                value={item.w}
                onChange={(e) =>
                  handleValueChange(index, "w", parseFloat(e.target.value))
                }
                className="border rounded px-2 py-1 text-sm font-bold text-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Unit toggle + Area Values */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-red-700">Unit</label>
          <Button
            variant="custom"
            onClick={() => setUnit(unit === "Feet" ? "Meters" : "Feet")}
            className="flex items-center bg-red-700 hover:bg-red-900 text-white text-sm rounded-full px-3 py-1"
          >
            {unit}
          </Button>
        </div>
        <div className="text-sm space-y-1">
          <div className="flex justify-between items-center ">
            <span className="text-red-700 font-bold">Perimeter</span>
            <span className="text-black font-bold border-2 border-black rounded px-2 py-1 text-center w-24">
              {perimeter} ft
            </span>
          </div>
          <div className="flex justify-between items-center ">
            <span className="text-red-700 font-bold">Floor Area</span>
            <span className="text-black font-bold border-2 border-black rounded px-2 py-1 text-center w-24">
              {floorArea} ft²
            </span>
          </div>
          <div className="flex justify-between items-center ">
            <span className="text-red-700 font-bold">Wall Area</span>
            <span className="text-black font-bold border-2 border-black rounded px-2 py-1 text-center w-24">
              {wallArea} ft²
            </span>
          </div>
        </div>
      </div>

      {/* Save / Action Toggle + Buttons */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-red-700">Action</label>
          <Button
            variant="custom"
            onClick={() => setToggle(toggle === "Save" ? "Action" : "Save")}
            className="flex items-center bg-red-700 hover:bg-red-900 text-white text-sm rounded-full px-3 py-1"
          >
            {toggle}
          </Button>
        </div>

        <div className="font-bold text-black text-sm border-b-4 border-red-700 w-fit">
          Area Calculation
        </div>
        <Button
          variant="custom"
          className="w-full border-2 border-black px-2 py-1 rounded-full text-sm font-bold bg-white hover:bg-gray-100"
        >
          Automatic
        </Button>
        <Button
          variant="custom"
          className="w-full bg-red-700 text-white px-2 py-1 rounded-full text-sm font-bold hover:bg-red-800"
        >
          Custom
        </Button>
      </div>
    </div>
  );
};

export default AreaDetails;

// import React from "react";
// import Button from "../../../components/Button";
// import DropDown from "../../../components/DropDown";
// import { FaPlus } from "react-icons/fa";

// const categories = [
//   "Living Room",
//   "Bedroom",
//   "Kitchen",
//   "Bathroom",
//   "Dining Room",
//   "Hall",
//   "Study Room",
//   "Balcony",
//   "Toilet",
// ];

// const AreaDetails = ({
//   areaName,
//   setAreaName,
//   category,
//   setCategory,
//   dimensions,
//   setDimensions,
//   unit,
//   setUnit,
//   length,
//   setLength,
//   breadth,
//   setBreadth,
//   height,
//   setHeight,
//   onAddOpening,
// }) => {
//   const handleValueChange = (index, type, value) => {
//     const updated = [...dimensions];
//     updated[index][type] = value;
//     setDimensions(updated);
//   };

//   const floorArea = length * breadth;
//   const wallArea = 2 * height * (length + breadth);
//   const perimeter = 2 * (length + breadth);

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
//       {/* Area Name & Category */}
//       <div className="space-y-4">
//         <div>
//           <label className="text-red-700 font-bold text-sm block">Area Name</label>
//           <input
//             type="text"
//             value={areaName}
//             onChange={(e) => setAreaName(e.target.value)}
//             className="border rounded px-2 py-1 w-full font-semibold"
//           />
//         </div>
//         <div>
//           <DropDown
//             label="Select Category"
//             name="category"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             options={categories}
//             className="border-red-700 text-red-700 focus:ring-red-700 focus:border-red-700"
//           />
//         </div>
//       </div>

//       {/* Area Dimensions */}
//       <div className="space-y-2">
//         <label className="text-red-700 font-bold text-sm block">
//           Enter Area Dimensions
//         </label>
//         {[
//           { label: "Length", val: length, set: setLength },
//           { label: "Breadth", val: breadth, set: setBreadth },
//           { label: "Height", val: height, set: setHeight },
//         ].map((dim) => (
//           <div key={dim.label} className="flex items-center gap-3">
//             <span className="text-sm font-bold text-red-700 w-16">
//               {dim.label}
//             </span>
//             <input
//               type="number"
//               value={dim.val}
//               onChange={(e) => dim.set(+e.target.value)}
//               className="border rounded px-2 py-1 w-24 font-bold text-sm text-center"
//             />
//             <span className="text-xs font-bold">ft</span>
//           </div>
//         ))}
//       </div>

//       {/* Doors & Windows */}
//       <div className="mb-4">
//         <div className="flex items-center justify-between mb-3">
//           <label className="text-red-700 font-bold text-sm mr-6">
//             Door &amp; Window Dimensions
//           </label>
//           <Button
//             variant="custom"
//             onClick={onAddOpening}
//             className="flex items-center gap-1 bg-red-700 text-white text-sm px-3 py-1 rounded-full"
//           >
//             <FaPlus className="text-xs" /> Add
//           </Button>
//         </div>
//         <div className="space-y-2 -ml-20 ">
//           {dimensions.map((item, index) => (
//             <div
//               key={item.name}
//               className="grid grid-cols-[100px_20px_80px_20px_80px] items-center gap-2"
//             >
//               <label className="text-red-700 font-bold text-sm text-right">
//                 {item.name}
//               </label>
//               <span className="text-red-700 font-bold text-sm">H</span>
//               <input
//                 type="number"
//                 value={item.h}
//                 onChange={(e) =>
//                   handleValueChange(index, "h", parseFloat(e.target.value))
//                 }
//                 className="border rounded px-2 py-1 text-sm font-bold text-center"
//               />
//               <span className="text-red-700 font-bold text-sm">W</span>
//               <input
//                 type="number"
//                 value={item.w}
//                 onChange={(e) =>
//                   handleValueChange(index, "w", parseFloat(e.target.value))
//                 }
//                 className="border rounded px-2 py-1 text-sm font-bold text-center"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Unit toggle + Area Values */}
//       <div className="space-y-3">
//         <div className="flex justify-between items-center">
//           <label className="text-sm font-bold text-red-700">Unit</label>
//           <Button
//             variant="custom"
//             onClick={() => setUnit(unit === "Feet" ? "Meters" : "Feet")}
//             className="flex items-center bg-red-700 hover:bg-red-900 text-white text-sm rounded-full px-3 py-1"
//           >
//             {unit}
//           </Button>
//         </div>
//         <div className="text-sm space-y-1">
//           <div className="flex justify-between items-center ">
//             <span className="text-red-700 font-bold">Perimeter</span>
//             <span className="text-black font-bold border-2 border-black rounded px-2 py-1 text-center w-24">
//               {perimeter} ft
//             </span>
//           </div>
//           <div className="flex justify-between items-center ">
//             <span className="text-red-700 font-bold">Floor Area</span>
//             <span className="text-black font-bold border-2 border-black rounded px-2 py-1 text-center w-24">
//               {floorArea} ft²
//             </span>
//           </div>
//           <div className="flex justify-between items-center ">
//             <span className="text-red-700 font-bold">Wall Area</span>
//             <span className="text-black font-bold border-2 border-black rounded px-2 py-1 text-center w-24">
//               {wallArea} ft²
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AreaDetails;
