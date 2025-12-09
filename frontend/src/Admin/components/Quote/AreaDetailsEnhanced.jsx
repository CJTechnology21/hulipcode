import React, { useState, useEffect } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  fetchSpaces,
  fetchOpenings,
  updateSpace,
  deleteOpening as deleteOpeningService,
  fetchStandaloneSpaceById,
  updateStandaloneSpace,
} from "../../../services/quoteServices";
import OpeningModal from "./OpeningModal";
import SpaceModal from "./SpaceModal";
import DropDown from "../../../components/DropDown";
import Button from "../../../components/Button";

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

const AreaDetailsEnhanced = ({ quoteId, spaceId, summaryId, onAddDeliverable, standaloneSpaceId }) => {
  const [spaceData, setSpaceData] = useState(null);
  const [areaName, setAreaName] = useState("");
  const [category, setCategory] = useState("");
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState("Feet");
  const [perimeter, setPerimeter] = useState("");
  const [floorArea, setFloorArea] = useState("");
  const [wallArea, setWallArea] = useState("");
  const [openings, setOpenings] = useState([]);
  const [showOpeningModal, setShowOpeningModal] = useState(false);
  const [editingOpening, setEditingOpening] = useState(null);
  const [showSpaceModal, setShowSpaceModal] = useState(false);
  const [mode, setMode] = useState("automatic");
  
  // Edit states
  const [editingAreaName, setEditingAreaName] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);
  const [editingLength, setEditingLength] = useState(false);
  const [editingBreadth, setEditingBreadth] = useState(false);
  const [editingHeight, setEditingHeight] = useState(false);

  // Load space data - try standalone space first, then nested space
  useEffect(() => {
    const loadSpace = async () => {
      if (!quoteId) return;
      
      try {
        let space = null;
        
        // If standaloneSpaceId is provided, fetch standalone space
        if (standaloneSpaceId) {
          space = await fetchStandaloneSpaceById(quoteId, standaloneSpaceId);
        } 
        // Otherwise, try to fetch nested space (for backward compatibility)
        else if (spaceId) {
          const data = await fetchSpaces(quoteId, spaceId);
          if (Array.isArray(data) && data.length > 0) {
            space = data[0];
          }
        }
        
        if (space) {
          setSpaceData(space);
          setAreaName(space.name || "");
          setCategory(space.category || "");
          setLength(space.length?.toString() || "");
          setBreadth(space.breadth?.toString() || "");
          setHeight(space.height?.toString() || "");
          setUnit(space.unit || "Feet");
          setPerimeter(space.perimeter?.toString() || "0");
          setFloorArea(space.floorArea?.toString() || "0");
          setWallArea(space.wallArea?.toString() || "0");
        }
      } catch (err) {
        console.error("Error fetching space:", err);
        // Don't show error if space doesn't exist yet (for new spaces)
        if (standaloneSpaceId || spaceId) {
          toast.error("Failed to fetch space data");
        }
      }
    };
    loadSpace();
  }, [quoteId, spaceId, standaloneSpaceId]);

  // Load openings from summary level (spaceId is summaryId)
  const loadOpeningsData = async () => {
    if (!quoteId || !spaceId) return;
    
    try {
      const data = await fetchOpenings(quoteId, spaceId);
      setOpenings(data || []);
    } catch (err) {
      console.error("Error fetching openings:", err);
      // Don't show error if openings don't exist yet
    }
  };

  useEffect(() => {
    loadOpeningsData();
  }, [quoteId, spaceId]);

  // Calculate areas automatically
  useEffect(() => {
    if (mode === "automatic" && length && breadth && height) {
      const l = parseFloat(length) || 0;
      const b = parseFloat(breadth) || 0;
      const h = parseFloat(height) || 0;
      
      // Perimeter = 2 * (length + breadth)
      const calcPerimeter = 2 * (l + b);
      
      // Floor Area = length * breadth
      const calcFloorArea = l * b;
      
      // Wall Area = 2 * (length + breadth) * height
      const calcWallArea = 2 * (l + b) * h;
      
      setPerimeter(calcPerimeter.toFixed(2));
      setFloorArea(calcFloorArea.toFixed(2));
      setWallArea(calcWallArea.toFixed(2));
    }
  }, [length, breadth, height, mode]);

  const displayUnit = unit === "Feet" ? "ft" : unit === "Meter" ? "m" : unit;

  const handleSave = async () => {
    try {
      if (!quoteId) {
        toast.error("Quote ID is missing");
        return;
      }

      const payload = {
        name: areaName,
        category,
        length: length ? Number(length) : 0,
        breadth: breadth ? Number(breadth) : 0,
        height: height ? Number(height) : 0,
        unit,
        perimeter: perimeter ? Number(perimeter) : 0,
        floorArea: floorArea ? Number(floorArea) : 0,
        wallArea: wallArea ? Number(wallArea) : 0,
      };

      // If standaloneSpaceId is provided, update standalone space
      if (standaloneSpaceId) {
        await updateStandaloneSpace(quoteId, standaloneSpaceId, payload);
        toast.success("Space updated successfully!");
      } 
      // Otherwise, try to update nested space (for backward compatibility)
      else if (spaceData?._id && summaryId) {
        await updateSpace(quoteId, summaryId, spaceData._id, payload);
        toast.success("Space updated successfully!");
      } else {
        toast.error("No space ID found to update");
        return;
      }

      // Update local spaceData
      setSpaceData({ ...spaceData, ...payload });
      setEditingAreaName(false);
      setEditingCategory(false);
      setEditingLength(false);
      setEditingBreadth(false);
      setEditingHeight(false);
    } catch (err) {
      console.error("Error saving space:", err);
      toast.error("Failed to update space");
    }
  };

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
    <div className="bg-white p-4 rounded-lg shadow-sm">
      {/* Top Section: Area Name, Category, Dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        {/* Area Name & Category */}
        <div className="space-y-3">
          <div>
            <label className="text-red-700 font-bold text-xs block mb-1">
              Area Name
            </label>
            <div className="flex items-center gap-1">
              {editingAreaName ? (
                <input
                  type="text"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  onBlur={() => {
                    setEditingAreaName(false);
                    handleSave();
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      setEditingAreaName(false);
                      handleSave();
                    }
                  }}
                  className="border rounded px-2 py-1.5 w-full text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                  autoFocus
                />
              ) : (
                <>
                  <input
                    type="text"
                    value={areaName}
                    readOnly
                    className="border rounded px-2 py-1.5 w-full text-sm font-semibold bg-gray-50"
                  />
                  <button
                    onClick={() => setEditingAreaName(true)}
                    className="text-red-700 hover:text-red-900 flex-shrink-0"
                    title="Edit"
                  >
                    <FaEdit className="text-sm" />
                  </button>
                </>
              )}
            </div>
          </div>
          <div>
            <label className="text-red-700 font-bold text-xs block mb-1">
              Select Category
            </label>
            {editingCategory ? (
              <DropDown
                name="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setEditingCategory(false);
                  handleSave();
                }}
                options={categories.map((cat) => ({ value: cat, label: cat }))}
                className="border-red-700 text-sm"
              />
            ) : (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={category}
                  readOnly
                  className="border rounded px-2 py-1.5 w-full text-sm font-semibold bg-gray-50"
                />
                <button
                  onClick={() => setEditingCategory(true)}
                  className="text-red-700 hover:text-red-900 flex-shrink-0"
                  title="Edit"
                >
                  <FaEdit className="text-sm" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Enter Area Dimensions */}
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <label className="text-red-700 font-bold text-xs">
              Enter Area Dimensions
            </label>
            <Button
              variant="custom"
              onClick={() => setShowSpaceModal(true)}
              className="flex items-center gap-1 bg-red-700 text-white text-xs px-2 py-1 rounded"
            >
              <FaPlus className="text-xs" /> Add
            </Button>
          </div>
          {[
            { label: "Length", val: length, setVal: setLength, editing: editingLength, setEditing: setEditingLength },
            { label: "Breadth", val: breadth, setVal: setBreadth, editing: editingBreadth, setEditing: setEditingBreadth },
            { label: "Height", val: height, setVal: setHeight, editing: editingHeight, setEditing: setEditingHeight },
          ].map((dim) => (
            <div key={dim.label} className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-700 w-14">
                {dim.label}
              </span>
              {dim.editing ? (
                <input
                  type="number"
                  value={dim.val}
                  onChange={(e) => dim.setVal(e.target.value)}
                  onBlur={() => {
                    dim.setEditing(false);
                    handleSave();
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      dim.setEditing(false);
                      handleSave();
                    }
                  }}
                  className="border rounded px-2 py-1 w-16 font-bold text-xs text-center focus:outline-none focus:ring-2 focus:ring-red-500"
                  autoFocus
                />
              ) : (
                <>
                  <input
                    type="number"
                    value={dim.val}
                    readOnly
                    className="border rounded px-2 py-1 w-16 font-bold text-xs text-center bg-gray-50"
                  />
                  <button
                    onClick={() => dim.setEditing(true)}
                    className="text-red-700 hover:text-red-900 flex-shrink-0"
                    title="Edit"
                  >
                    <FaEdit className="text-xs" />
                  </button>
                </>
              )}
              <span className="text-xs font-bold">{displayUnit}</span>
            </div>
          ))}
        </div>

        {/* Door & Window Dimensions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-red-700 font-bold text-sm">
              Door & Window Dimensions
            </label>
            {spaceId && (
              <Button
                variant="custom"
                onClick={() => {
                  setEditingOpening(null);
                  setShowOpeningModal(true);
                }}
                className="flex items-center gap-1 bg-red-700 text-white text-xs px-2 py-1 rounded"
              >
                <FaPlus className="text-xs" /> Add
              </Button>
            )}
          </div>
          <div className="space-y-1">
            {openings.length === 0 ? (
              <div className="text-xs text-gray-400">No doors/windows added</div>
            ) : (
              openings.map((item, index) => (
                <div
                  key={item._id || `opening-${index}`}
                  className="flex items-center gap-2 text-xs"
                >
                  <span className="text-red-700 font-bold w-14">{item.name}:</span>
                  <span className="text-red-700 font-bold">H</span>
                  <span className="font-semibold">{item.h || 0} {displayUnit}</span>
                  <span className="text-red-700 font-bold ml-1">W</span>
                  <span className="font-semibold">{item.w || 0} {displayUnit}</span>
                  <button
                    onClick={() => {
                      setEditingOpening(item);
                      setShowOpeningModal(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 ml-2"
                    title="Edit"
                  >
                    <FaEdit className="text-xs" />
                  </button>
                  <button
                    onClick={() => handleDeleteOpening(item._id)}
                    className="text-red-600 hover:text-red-700 ml-1"
                    title="Delete"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Calculated Units */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-red-700">Unit</label>
            <select
              value={unit}
              onChange={(e) => {
                setUnit(e.target.value);
                handleSave();
              }}
              className="border rounded px-2 py-1 text-sm font-bold bg-red-700 text-white"
            >
              <option value="Feet">Feet</option>
              <option value="Meter">Meter</option>
            </select>
          </div>
          <div className="text-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-red-700 font-bold">Perimeter</span>
              <div className="flex items-center gap-1">
                <span className="font-bold">{perimeter || 0}</span>
                <span className="font-bold">{displayUnit}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-700 font-bold">Floor Area</span>
              <div className="flex items-center gap-1">
                <span className="font-bold">{floorArea || 0}</span>
                <span className="font-bold">{displayUnit}²</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-700 font-bold">Wall Area</span>
              <div className="flex items-center gap-1">
                <span className="font-bold">{wallArea || 0}</span>
                <span className="font-bold">{displayUnit}²</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action & Area Calculation */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-red-700">Action</label>
            <Button
              variant="custom"
              onClick={handleSave}
              className="flex items-center bg-red-700 hover:bg-red-900 text-white text-xs px-3 py-1 rounded"
            >
              Save
            </Button>
          </div>
          <div className="font-bold text-black text-sm border-b-4 border-red-700 w-fit">
            Area Calculation
          </div>
          <div className="flex gap-2">
            <Button
              variant="custom"
              onClick={() => setMode("automatic")}
              className={`flex-1 border-2 border-black px-2 py-1 rounded text-sm font-bold ${
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
              className={`flex-1 px-2 py-1 rounded text-sm font-bold ${
                mode === "custom"
                  ? "bg-red-700 text-white hover:bg-red-800"
                  : "bg-white border-2 border-black hover:bg-gray-100"
              }`}
            >
              Custom
            </Button>
          </div>
          {onAddDeliverable && (
            <Button
              variant="custom"
              onClick={onAddDeliverable}
              className="w-full bg-red-700 hover:bg-red-900 text-white text-xs px-3 py-1 rounded flex items-center justify-center gap-1"
            >
              <FaPlus /> Add Deliverable
            </Button>
          )}
        </div>
      </div>

      {/* Modals */}
      <OpeningModal
        isOpen={showOpeningModal}
        onClose={() => setShowOpeningModal(false)}
        onSave={loadOpeningsData}
        quoteId={quoteId}
        spaceId={spaceId}
        initialData={editingOpening}
      />

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

export default AreaDetailsEnhanced;

