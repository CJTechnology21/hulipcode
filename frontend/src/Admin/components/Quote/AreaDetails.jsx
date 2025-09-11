import React, { useState, useEffect } from "react";
import Button from "../../../components/Button";
import DropDown from "../../../components/DropDown";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  fetchSpaces,
  fetchOpenings,
  updateSpace,
  deleteOpening as deleteOpeningService,
} from "../../../services/quoteServices";
import OpeningModal from "./OpeningModal";
import SpaceModal from "./SpaceModal";

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

const AreaDetails = ({ quoteId, spaceId, summaryId }) => {
  const [spaceData, setSpaceData] = useState(null);

  // space form
  const [areaName, setAreaName] = useState("");
  const [category, setCategory] = useState("");
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState("Feet");

  // fetched values from DB
  const [perimeter, setPerimeter] = useState("");
  const [floorArea, setFloorArea] = useState("");
  const [wallArea, setWallArea] = useState("");

  // openings
  const [openings, setOpenings] = useState([]);
  const [showOpeningModal, setShowOpeningModal] = useState(false);
  const [editingOpening, setEditingOpening] = useState(null); // for edit mode

  // modal for Add/Edit space
  const [showSpaceModal, setShowSpaceModal] = useState(false);

  // action mode (automatic vs custom)
  const [mode, setMode] = useState("automatic");

  // LOAD SPACE DATA
  useEffect(() => {
    const loadSpace = async () => {
      if (!quoteId || !spaceId) return;
      try {
        const data = await fetchSpaces(quoteId, spaceId);

        if (Array.isArray(data) && data.length > 0) {
          const space = data[0];
          setSpaceData(space);
          setAreaName(space.name || "");
          setCategory(space.category || "");
          setLength(space.length || "");
          setBreadth(space.breadth || "");
          setHeight(space.height || "");
          setUnit(space.unit || "Feet");
          setPerimeter(space.perimeter || 0);
          setFloorArea(space.floorArea || 0);
          setWallArea(space.wallArea || 0);
        }
      } catch (err) {
        console.error("Error fetching space:", err);
        toast.error("Failed to fetch space data");
      }
    };

    loadSpace();
  }, [quoteId, spaceId]);

  // LOAD OPENINGS DATA
  const loadOpeningsData = async () => {
    if (!quoteId || !spaceId) return;
    try {
      const data = await fetchOpenings(quoteId, spaceId);
      setOpenings(data || []);
    } catch (err) {
      toast.error("Failed to fetch openings");
    }
  };

  useEffect(() => {
    loadOpeningsData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteId, spaceId]);

  // Unit shorthand
  const displayUnit = unit === "Feet" ? "ft" : unit === "Meter" ? "m" : unit;

  // Handle Save
  const handleSave = async () => {
    try {
      if (!spaceData?._id) {
        toast.error("No space ID found to update");
        return;
      }

      const payload = {
        name: areaName,
        category,
        length,
        breadth,
        height,
        unit,
        perimeter,
        floorArea,
        wallArea,
      };

      await updateSpace(quoteId, summaryId, spaceData._id, payload);

      toast.success("Space updated successfully!");
      setMode("automatic");
    } catch (err) {
      console.error("Error saving space:", err);
      toast.error("Failed to update space");
    }
  };

  // Handle delete opening
  const handleDeleteOpening = async (openingId) => {
    if (!window.confirm("Are you sure you want to delete this opening?"))
      return;

    try {
      await deleteOpeningService(quoteId, spaceId, openingId);
      toast.success("Opening deleted successfully!");
      loadOpeningsData();
    } catch (err) {
      console.error("Error deleting opening:", err);
      toast.error("Failed to delete opening");
    }
  };

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
            disabled
            className="border rounded px-2 py-1 w-full font-semibold disabled:bg-gray-100"
          />
        </div>
        <div>
          <DropDown
            label="Select Category"
            name="category"
            value={category}
            disabled
            options={categories}
            className="border-red-700 text-red-700 focus:ring-red-700 focus:border-red-700"
          />
        </div>
      </div>

      {/* Area Dimensions */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-red-700 font-bold text-sm block">
            Enter Area Dimensions
          </label>
          <Button
            variant="custom"
            onClick={() => setShowSpaceModal(true)}
            className="flex items-center gap-1 bg-red-700 text-white text-sm px-3 py-1 rounded-full"
          >
            <FaPlus className="text-xs" /> {spaceData ? "Edit" : "Add"}
          </Button>
        </div>

        {[
          { label: "Length", val: length },
          { label: "Breadth", val: breadth },
          { label: "Height", val: height },
        ].map((dim) => (
          <div key={dim.label} className="flex items-center gap-3">
            <span className="text-sm font-bold text-red-700 w-16">
              {dim.label}
            </span>
            <input
              type="number"
              value={dim.val}
              disabled
              className="border rounded px-2 py-1 w-24 font-bold text-sm text-center disabled:bg-gray-100"
            />
            <span className="text-xs font-bold">{displayUnit}</span>
          </div>
        ))}
      </div>

      {/* Doors & Windows (Openings) */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-red-700 font-bold text-sm mr-6">
            Door &amp; Window Dimensions
          </label>
          {spaceId && (
            <Button
              variant="custom"
              onClick={() => {
                setEditingOpening(null); // Add mode
                setShowOpeningModal(true);
              }}
              className="flex items-center gap-1 bg-red-700 text-white text-sm px-3 py-1 rounded-full"
            >
              <FaPlus className="text-xs" /> Add
            </Button>
          )}
        </div>
        <div className="space-y-2 -ml-20">
          {openings.map((item, index) => (
            <div
              key={item._id || `opening-${index}`}
              className="grid grid-cols-[100px_20px_70px_20px_70px_30px_30px] items-center gap-2"
            >
              <label className="text-red-700 font-bold text-sm text-right">
                {item.name}
              </label>
              <span className="text-red-700 font-bold text-sm">H</span>
              <input
                type="number"
                value={item.h || ""}
                disabled
                className="border rounded px-2 py-1 text-sm font-bold text-center disabled:bg-gray-100"
              />
              <span className="text-red-700 font-bold text-sm">W</span>
              <input
                type="number"
                value={item.w || ""}
                disabled
                className="border rounded px-2 py-1 text-sm font-bold text-center disabled:bg-gray-100"
              />
             
              <button
                onClick={() => {
                  setEditingOpening(item);
                  setShowOpeningModal(true);
                }}
                className="text-yellow-500 hover:text-yellow-600"
              >
                <FaEdit />
              </button>
           
              <button
                onClick={() => handleDeleteOpening(item._id)}
                className="text-red-600 hover:text-red-700 -ml-3"
              >
                <FaTrash />
              </button>
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
            disabled
            className="flex items-center bg-red-700 text-white text-sm rounded-full px-3 py-1"
          >
            {displayUnit}
          </Button>
        </div>
        <div className="text-sm space-y-1">
          <div className="flex justify-between items-center ">
            <span className="text-red-700 font-bold">Perimeter</span>
            <input
              type="number"
              value={perimeter}
              disabled={mode === "automatic"}
              onChange={(e) => setPerimeter(e.target.value)}
              className="text-black font-bold border-2 border-black rounded px-2 py-1 text-center w-24 disabled:bg-gray-100"
            />
            <span className="ml-1 font-bold">{displayUnit}</span>
          </div>
          <div className="flex justify-between items-center ">
            <span className="text-red-700 font-bold">Floor Area</span>
            <input
              type="number"
              value={floorArea}
              disabled={mode === "automatic"}
              onChange={(e) => setFloorArea(e.target.value)}
              className="text-black font-bold border-2 border-black rounded px-2 py-1 text-center w-24 disabled:bg-gray-100"
            />
            <span className="ml-1 font-bold">{displayUnit}²</span>
          </div>
          <div className="flex justify-between items-center ">
            <span className="text-red-700 font-bold">Wall Area</span>
            <input
              type="number"
              value={wallArea}
              disabled={mode === "automatic"}
              onChange={(e) => setWallArea(e.target.value)}
              className="text-black font-bold border-2 border-black rounded px-2 py-1 text-center w-24 disabled:bg-gray-100"
            />
            <span className="ml-1 font-bold">{displayUnit}²</span>
          </div>
        </div>
      </div>

      {/* Save / Action Buttons */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-red-700">Action</label>
          <Button
            variant="custom"
            onClick={handleSave}
            className="flex items-center bg-red-700 hover:bg-red-900 text-white text-sm rounded-full px-3 py-1"
          >
            Save
          </Button>
        </div>

        <div className="font-bold text-black text-sm border-b-4 border-red-700 w-fit">
          Area Calculation
        </div>
        <Button
          variant="custom"
          onClick={() => setMode("automatic")}
          className={`w-full border-2 border-black px-2 py-1 rounded-full text-sm font-bold ${
            mode === "automatic"
              ? "bg-gray-200 text-black"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Automatic
        </Button>
        <Button
          variant="custom"
          onClick={() => setMode("custom")}
          className={`w-full px-2 py-1 rounded-full text-sm font-bold ${
            mode === "custom"
              ? "bg-red-700 text-white hover:bg-red-800"
              : "bg-white border-2 border-black hover:bg-gray-100"
          }`}
        >
          Custom
        </Button>
      </div>

      {/* Opening Modal */}
      <OpeningModal
        isOpen={showOpeningModal}
        onClose={() => setShowOpeningModal(false)}
        onSave={loadOpeningsData} 
        quoteId={quoteId}
        spaceId={spaceId}
        initialData={editingOpening} 
      />

      {/* Space Modal */}
      <SpaceModal
        isOpen={showSpaceModal}
        onClose={() => setShowSpaceModal(false)}
        quoteId={quoteId}
        spaceId={spaceId}
        initialData={spaceData}
        onSave={(updated) => {
          setSpaceData(updated);
          setAreaName(updated.name);
          setCategory(updated.category);
          setLength(updated.length);
          setBreadth(updated.breadth);
          setHeight(updated.height);
          setUnit(updated.unit);
          setPerimeter(updated.perimeter);
          setFloorArea(updated.floorArea);
          setWallArea(updated.wallArea);
        }}
      />
    </div>
  );
};

export default AreaDetails;

// import React, { useState, useEffect } from "react";
// import Button from "../../../components/Button";
// import DropDown from "../../../components/DropDown";
// import { FaPlus } from "react-icons/fa";
// import { toast } from "react-toastify";
// import {
//   fetchSpaces,
//   fetchOpenings,
//   updateSpace,
// } from "../../../services/quoteServices";
// import OpeningModal from "./OpeningModal";
// import SpaceModal from "./SpaceModal";

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

// const AreaDetails = ({ quoteId, spaceId, summaryId }) => {
//   const [spaceData, setSpaceData] = useState(null);

//   // space form
//   const [areaName, setAreaName] = useState("");
//   const [category, setCategory] = useState("");
//   const [length, setLength] = useState("");
//   const [breadth, setBreadth] = useState("");
//   const [height, setHeight] = useState("");
//   const [unit, setUnit] = useState("Feet");

//   // fetched values from DB
//   const [perimeter, setPerimeter] = useState("");
//   const [floorArea, setFloorArea] = useState("");
//   const [wallArea, setWallArea] = useState("");

//   // openings
//   const [openings, setOpenings] = useState([]);
//   const [showOpeningModal, setShowOpeningModal] = useState(false);

//   // modal for Add/Edit space
//   const [showSpaceModal, setShowSpaceModal] = useState(false);

//   // action mode (automatic vs custom)
//   const [mode, setMode] = useState("automatic");

//   // LOAD SPACE DATA
//   useEffect(() => {
//     const loadSpace = async () => {
//       if (!quoteId || !spaceId) return;
//       try {
//         const data = await fetchSpaces(quoteId, spaceId);

//         if (Array.isArray(data) && data.length > 0) {
//           const space = data[0];
//           setSpaceData(space);
//           setAreaName(space.name || "");
//           setCategory(space.category || "");
//           setLength(space.length || "");
//           setBreadth(space.breadth || "");
//           setHeight(space.height || "");
//           setUnit(space.unit || "Feet");
//           setPerimeter(space.perimeter || 0);
//           setFloorArea(space.floorArea || 0);
//           setWallArea(space.wallArea || 0);
//         }
//       } catch (err) {
//         console.error("Error fetching space:", err);
//         toast.error("Failed to fetch space data");
//       }
//     };

//     loadSpace();
//   }, [quoteId, spaceId]);

//   // LOAD OPENINGS DATA
//   useEffect(() => {
//     const loadOpenings = async () => {
//       if (!quoteId || !spaceId) return;
//       try {
//         const data = await fetchOpenings(quoteId, spaceId);
//         setOpenings(data || []);
//       } catch (err) {
//         toast.error("Failed to fetch openings");
//       }
//     };

//     loadOpenings();
//   }, [quoteId, spaceId]);

//   //  Unit shorthand
//   const displayUnit = unit === "Feet" ? "ft" : unit === "Meter" ? "m" : unit;
//   //  Handle Save
//   const handleSave = async () => {
//     try {
//       if (!spaceData?._id) {
//         toast.error("No space ID found to update");
//         return;
//       }

//       const payload = {
//         name: areaName,
//         category,
//         length,
//         breadth,
//         height,
//         unit,
//         perimeter,
//         floorArea,
//         wallArea,
//       };

//       // 🔍 Debug logs
//       console.log("Quote ID:", quoteId);
//       console.log("Summary ID:", summaryId);
//       console.log("Space ID:", spaceData._id);
//       console.log("Payload:", payload);

//       // ✅ Pass all 4 args correctly
//       await updateSpace(
//         quoteId, // quote id
//         summaryId, // summary id
//         spaceData._id, // space id
//         payload // fields
//       );

//       toast.success("Space updated successfully!");
//       setMode("automatic");
//     } catch (err) {
//       console.error("Error saving space:", err);
//       toast.error("Failed to update space");
//     }
//   };

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
//       {/* Area Name & Category */}
//       <div className="space-y-4">
//         <div>
//           <label className="text-red-700 font-bold text-sm block">
//             Area Name
//           </label>
//           <input
//             type="text"
//             value={areaName}
//             disabled
//             className="border rounded px-2 py-1 w-full font-semibold disabled:bg-gray-100"
//           />
//         </div>
//         <div>
//           <DropDown
//             label="Select Category"
//             name="category"
//             value={category}
//             disabled
//             options={categories}
//             className="border-red-700 text-red-700 focus:ring-red-700 focus:border-red-700"
//           />
//         </div>
//       </div>

//       {/* Area Dimensions */}
//       <div className="space-y-2">
//         <div className="flex justify-between items-center">
//           <label className="text-red-700 font-bold text-sm block">
//             Enter Area Dimensions
//           </label>
//           <Button
//             variant="custom"
//             onClick={() => setShowSpaceModal(true)}
//             className="flex items-center gap-1 bg-red-700 text-white text-sm px-3 py-1 rounded-full"
//           >
//             <FaPlus className="text-xs" /> {spaceData ? "Edit" : "Add"}
//           </Button>
//         </div>

//         {[
//           { label: "Length", val: length },
//           { label: "Breadth", val: breadth },
//           { label: "Height", val: height },
//         ].map((dim) => (
//           <div key={dim.label} className="flex items-center gap-3">
//             <span className="text-sm font-bold text-red-700 w-16">
//               {dim.label}
//             </span>
//             <input
//               type="number"
//               value={dim.val}
//               disabled
//               className="border rounded px-2 py-1 w-24 font-bold text-sm text-center disabled:bg-gray-100"
//             />
//             <span className="text-xs font-bold">{displayUnit}</span>
//           </div>
//         ))}
//       </div>

//       {/* Doors & Windows (Openings) */}
//       <div className="mb-4">
//         <div className="flex items-center justify-between mb-3">
//           <label className="text-red-700 font-bold text-sm mr-6">
//             Door &amp; Window Dimensions
//           </label>
//           {spaceId && (

//             <Button
//               variant="custom"
//               onClick={() => setShowOpeningModal(true)}
//               className="flex items-center gap-1 bg-red-700 text-white text-sm px-3 py-1 rounded-full"
//             >
//               <FaPlus className="text-xs" /> Add
//             </Button>
//           )}
//         </div>
//         <div className="space-y-2 -ml-20">
//           {openings.map((item, index) => (
//             <div
//               key={item._id || `opening-${index}`}
//               className="grid grid-cols-[100px_20px_80px_20px_80px] items-center gap-2"
//             >
//               <label className="text-red-700 font-bold text-sm text-right">
//                 {item.name}
//               </label>
//               <span className="text-red-700 font-bold text-sm">H</span>
//               <input
//                 type="number"
//                 value={item.h || ""}
//                 disabled
//                 className="border rounded px-2 py-1 text-sm font-bold text-center disabled:bg-gray-100"
//               />
//               <span className="text-red-700 font-bold text-sm">W</span>
//               <input
//                 type="number"
//                 value={item.w || ""}
//                 disabled
//                 className="border rounded px-2 py-1 text-sm font-bold text-center disabled:bg-gray-100"
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
//             disabled
//             className="flex items-center bg-red-700 text-white text-sm rounded-full px-3 py-1"
//           >
//             {displayUnit}
//           </Button>
//         </div>
//         <div className="text-sm space-y-1">
//           <div className="flex justify-between items-center ">
//             <span className="text-red-700 font-bold">Perimeter</span>
//             <input
//               type="number"
//               value={perimeter}
//               disabled={mode === "automatic"}
//               onChange={(e) => setPerimeter(e.target.value)}
//               className="text-black font-bold border-2 border-black rounded px-2 py-1 text-center w-24 disabled:bg-gray-100"
//             />
//             <span className="ml-1 font-bold">{displayUnit}</span>
//           </div>
//           <div className="flex justify-between items-center ">
//             <span className="text-red-700 font-bold">Floor Area</span>
//             <input
//               type="number"
//               value={floorArea}
//               disabled={mode === "automatic"}
//               onChange={(e) => setFloorArea(e.target.value)}
//               className="text-black font-bold border-2 border-black rounded px-2 py-1 text-center w-24 disabled:bg-gray-100"
//             />
//             <span className="ml-1 font-bold">{displayUnit}²</span>
//           </div>
//           <div className="flex justify-between items-center ">
//             <span className="text-red-700 font-bold">Wall Area</span>
//             <input
//               type="number"
//               value={wallArea}
//               disabled={mode === "automatic"}
//               onChange={(e) => setWallArea(e.target.value)}
//               className="text-black font-bold border-2 border-black rounded px-2 py-1 text-center w-24 disabled:bg-gray-100"
//             />
//             <span className="ml-1 font-bold">{displayUnit}²</span>
//           </div>
//         </div>
//       </div>

//       {/* Save / Action Buttons */}
//       <div className="space-y-2">
//         <div className="flex justify-between items-center">
//           <label className="text-sm font-bold text-red-700">Action</label>
//           <Button
//             variant="custom"
//             onClick={handleSave}
//             className="flex items-center bg-red-700 hover:bg-red-900 text-white text-sm rounded-full px-3 py-1"
//           >
//             Save
//           </Button>
//         </div>

//         <div className="font-bold text-black text-sm border-b-4 border-red-700 w-fit">
//           Area Calculation
//         </div>
//         <Button
//           variant="custom"
//           onClick={() => setMode("automatic")}
//           className={`w-full border-2 border-black px-2 py-1 rounded-full text-sm font-bold ${
//             mode === "automatic"
//               ? "bg-gray-200 text-black"
//               : "bg-white hover:bg-gray-100"
//           }`}
//         >
//           Automatic
//         </Button>
//         <Button
//           variant="custom"
//           onClick={() => setMode("custom")}
//           className={`w-full px-2 py-1 rounded-full text-sm font-bold ${
//             mode === "custom"
//               ? "bg-red-700 text-white hover:bg-red-800"
//               : "bg-white border-2 border-black hover:bg-gray-100"
//           }`}
//         >
//           Custom
//         </Button>
//       </div>

//       {/* Opening Modal */}
//       <OpeningModal
//         isOpen={showOpeningModal}
//         onClose={() => setShowOpeningModal(false)}
//         onSave={() => {}}
//         quoteId={quoteId}
//         spaceId={spaceId}
//       />

//       {/* Space Modal */}
//       <SpaceModal
//         isOpen={showSpaceModal}
//         onClose={() => setShowSpaceModal(false)}
//         quoteId={quoteId}
//         spaceId={spaceId}
//         initialData={spaceData}
//         onSave={(updated) => {
//           setSpaceData(updated);
//           setAreaName(updated.name);
//           setCategory(updated.category);
//           setLength(updated.length);
//           setBreadth(updated.breadth);
//           setHeight(updated.height);
//           setUnit(updated.unit);
//           setPerimeter(updated.perimeter);
//           setFloorArea(updated.floorArea);
//           setWallArea(updated.wallArea);
//         }}
//       />
//     </div>
//   );
// };

// export default AreaDetails;
