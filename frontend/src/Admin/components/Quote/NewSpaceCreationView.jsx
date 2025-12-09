import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AreaDetailsEnhanced from "./AreaDetailsEnhanced";
import DeliverablesTableEnhanced from "./DeliverablesTableEnhanced";
import DeliverableModal from "./DeliverableModal";
import DeliverableEditModal from "./DeliverableEditModal";
import {
  createStandaloneSpace,
  addSummaryToQuote,
  fetchDeliverables,
  updateSummaryRow,
  fetchQuoteSummary,
} from "../../../services/quoteServices";

const NewSpaceCreationView = ({ quoteId, onSave, onCancel }) => {
  const [areaName, setAreaName] = useState("");
  const [category, setCategory] = useState("");
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState("Feet");
  const [perimeter, setPerimeter] = useState(0);
  const [floorArea, setFloorArea] = useState(0);
  const [wallArea, setWallArea] = useState(0);
  const [openings, setOpenings] = useState([]);
  
  const [deliverables, setDeliverables] = useState([]);
  const [showDeliverableModal, setShowDeliverableModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tempSpaceId, setTempSpaceId] = useState(null); // Temporary standalone space ID
  const [summaryId, setSummaryId] = useState(null); // Summary entry ID for deliverables

  // Calculate areas automatically
  useEffect(() => {
    if (length && breadth && height) {
      const l = parseFloat(length) || 0;
      const b = parseFloat(breadth) || 0;
      const h = parseFloat(height) || 0;
      
      const calcPerimeter = 2 * (l + b);
      const calcFloorArea = l * b;
      const calcWallArea = 2 * (l + b) * h;
      
      setPerimeter(calcPerimeter);
      setFloorArea(calcFloorArea);
      setWallArea(calcWallArea);
    }
  }, [length, breadth, height]);

  // Load deliverables when summaryId is set (deliverables are stored at summary level)
  useEffect(() => {
    if (summaryId && quoteId) {
      loadDeliverables();
    }
  }, [summaryId, quoteId]);

  const loadDeliverables = async () => {
    if (!quoteId || !summaryId) return [];
    try {
      const data = await fetchDeliverables(quoteId, summaryId);
      setDeliverables(data || []);
      return data || [];
    } catch (err) {
      console.error("Failed to fetch deliverables:", err);
      return [];
    }
  };

  // Function to update summary totals automatically
  const updateSummaryTotals = async () => {
    if (!quoteId || !summaryId || !tempSpaceId) return;

    try {
      // Fetch latest deliverables
      const latestDeliverables = await fetchDeliverables(quoteId, summaryId);
      
      // Calculate totals
      const totals = calculateTotals(latestDeliverables);

      // Update summary entry
      const summaryData = {
        space: areaName,
        spaceId: tempSpaceId,
        workPackages: 0,
        items: totals.items,
        amount: totals.amount,
        tax: totals.tax,
        total: totals.total,
      };

      await updateSummaryRow(quoteId, summaryId, summaryData);
    } catch (err) {
      console.error("Error updating summary totals:", err);
    }
  };

  const handleDeliverableSave = async (savedDeliverable) => {
    setDeliverables((prev) => [...prev, savedDeliverable]);
    await loadDeliverables();
    // Update summary totals after adding deliverable
    await updateSummaryTotals();
  };

  const handleDeliverableUpdate = async (updated) => {
    setDeliverables((prev) =>
      prev.map((itm) => (itm._id === updated._id ? updated : itm))
    );
    await loadDeliverables();
    // Update summary totals after updating deliverable
    await updateSummaryTotals();
  };

  // Calculate totals from deliverables
  const calculateTotals = (deliverablesList) => {
    const itemsToCalculate = deliverablesList || deliverables;
    let totalItems = itemsToCalculate.length;
    let totalAmount = 0; // Before GST
    let totalTax = 0; // GST amount in rupees
    
    itemsToCalculate.forEach((item) => {
      const amount = (item.qty || 0) * (item.rate || 0);
      const gstAmount = amount * ((item.gst || 0) / 100);
      totalAmount += amount;
      totalTax += gstAmount;
    });

    return {
      items: totalItems,
      amount: totalAmount,
      tax: totalTax,
      total: totalAmount + totalTax,
    };
  };

  // Create space first (if not already created)
  const createSpaceIfNeeded = async () => {
    if (tempSpaceId) {
      return tempSpaceId; // Space already created
    }

    // Validate required fields
    if (!areaName || !category) {
      toast.error("Please fill Area Name and Category");
      return null;
    }

    if (!quoteId) {
      toast.error("Quote ID is missing");
      return null;
    }

    try {
      // Create the standalone space
      const standaloneSpaceData = {
        name: areaName,
        category: category,
        length: length ? Number(length) : 0,
        breadth: breadth ? Number(breadth) : 0,
        height: height ? Number(height) : 0,
        unit: unit,
        perimeter: perimeter,
        floorArea: floorArea,
        wallArea: wallArea,
      };

      const createdSpace = await createStandaloneSpace(quoteId, standaloneSpaceData);
      
      if (!createdSpace || !createdSpace._id) {
        throw new Error("Failed to create space - no ID returned");
      }

      setTempSpaceId(createdSpace._id);
      toast.success("Space created! You can now add items.");
      return createdSpace._id;
    } catch (err) {
      console.error("Error creating space:", err);
      toast.error(err.response?.data?.message || "Failed to create space");
      return null;
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!areaName || !category) {
      toast.error("Please fill Area Name and Category");
      return;
    }

    if (!quoteId) {
      toast.error("Quote ID is missing");
      return;
    }

    try {
      // Ensure space is created
      const spaceId = await createSpaceIfNeeded();
      if (!spaceId) {
        return; // Error already shown
      }

      // Check if summary entry already exists for this space
      const existingSummary = await fetchQuoteSummary(quoteId);
      const existingEntry = Array.isArray(existingSummary) 
        ? existingSummary.find(s => s.spaceId?.toString() === spaceId.toString())
        : null;

      // Get the summaryId (either existing or we'll create one)
      let currentSummaryId = existingEntry?._id || summaryId;

      // If no summary entry exists yet, create it first with initial values
      if (!existingEntry?._id) {
        const initialSummaryData = {
          space: areaName,
          spaceId: spaceId,
          workPackages: 0,
          items: 0,
          amount: 0,
          tax: 0,
          total: 0,
        };
        const newSummary = await addSummaryToQuote(quoteId, [initialSummaryData]);
        const newEntry = Array.isArray(newSummary) 
          ? newSummary.find(s => s.spaceId?.toString() === spaceId.toString())
          : null;
        if (newEntry?._id) {
          currentSummaryId = newEntry._id;
          setSummaryId(newEntry._id);
        }
      }

      // Now fetch deliverables from the summary entry
      let latestDeliverables = [];
      if (currentSummaryId) {
        try {
          latestDeliverables = await fetchDeliverables(quoteId, currentSummaryId);
        } catch (err) {
          console.log("No deliverables found, will be empty");
          latestDeliverables = [];
        }
      }

      // Calculate totals from deliverables
      const totals = calculateTotals(latestDeliverables);

      // Prepare summary entry data with calculated totals
      const summaryData = {
        space: areaName,
        spaceId: spaceId,
        workPackages: 0, // Can be updated later if needed
        items: totals.items,
        amount: totals.amount,
        tax: totals.tax,
        total: totals.total,
      };

      // Update the summary entry with calculated totals
      if (currentSummaryId) {
        await updateSummaryRow(quoteId, currentSummaryId, summaryData);
        toast.success("Space saved and totals updated successfully!");
      } else {
        toast.error("Failed to create summary entry");
        return;
      }

      // Notify parent to refresh
      if (onSave) {
        onSave();
      }
    } catch (err) {
      console.error("Error saving space:", err);
      toast.error(err.response?.data?.message || "Failed to save space");
    }
  };

  return (
    <div className="bg-gray-50 p-6 space-y-6">
      {/* Area Details Section - Editable for new space */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
          {/* Area Name & Category */}
          <div className="space-y-3">
            <div>
              <label className="text-red-700 font-bold text-xs block mb-1">
                Area Name
              </label>
              <input
                type="text"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                placeholder="Enter space name"
                className="border rounded px-2 py-1.5 w-full text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="text-red-700 font-bold text-xs block mb-1">
                Select Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border rounded px-2 py-1.5 w-full text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select category</option>
                <option value="Living Room">Living Room</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Bathroom">Bathroom</option>
                <option value="Dining Room">Dining Room</option>
                <option value="Hall">Hall</option>
                <option value="Study Room">Study Room</option>
                <option value="Balcony">Balcony</option>
                <option value="Toilet">Toilet</option>
              </select>
            </div>
          </div>

          {/* Enter Area Dimensions */}
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <label className="text-red-700 font-bold text-xs">
                Enter Area Dimensions
              </label>
            </div>
            {[
              { label: "Length", val: length, setVal: setLength },
              { label: "Breadth", val: breadth, setVal: setBreadth },
              { label: "Height", val: height, setVal: setHeight },
            ].map((dim) => (
              <div key={dim.label} className="flex items-center gap-2">
                <span className="text-xs font-bold text-red-700 w-14">
                  {dim.label}
                </span>
                <input
                  type="number"
                  value={dim.val}
                  onChange={(e) => dim.setVal(e.target.value)}
                  className="border rounded px-2 py-1 w-16 font-bold text-xs text-center focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <span className="text-xs font-bold">{unit === "Feet" ? "ft" : "m"}</span>
              </div>
            ))}
          </div>

          {/* Door & Window Dimensions - Placeholder for now */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-red-700 font-bold text-sm">
                Door & Window Dimensions
              </label>
            </div>
            <div className="text-xs text-gray-400">Add after saving space</div>
          </div>

          {/* Calculated Units */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-red-700">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
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
                  <span className="font-bold">{perimeter.toFixed(2)}</span>
                  <span className="font-bold">{unit === "Feet" ? "ft" : "m"}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-700 font-bold">Floor Area</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold">{floorArea.toFixed(2)}</span>
                  <span className="font-bold">{unit === "Feet" ? "ft²" : "m²"}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-700 font-bold">Wall Area</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold">{wallArea.toFixed(2)}</span>
                  <span className="font-bold">{unit === "Feet" ? "ft²" : "m²"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action & Save */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-red-700">Action</label>
              <button
                onClick={handleSave}
                className="bg-red-700 hover:bg-red-900 text-white text-xs px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
            <div className="font-bold text-black text-sm border-b-4 border-red-700 w-fit">
              Area Calculation
            </div>
            <div className="flex gap-2">
              <button
                className="flex-1 border-2 border-black px-2 py-1 rounded text-sm font-bold bg-gray-200 text-black"
              >
                Automatic
              </button>
              <button
                className="flex-1 px-2 py-1 rounded text-sm font-bold bg-white border-2 border-black hover:bg-gray-100"
              >
                Custom
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deliverables Table - Show after space is created and summary entry exists */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        {!tempSpaceId ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Fill in Area Name and Category, then click Save to create the space and add items.
            </p>
            <button
              onClick={createSpaceIfNeeded}
              className="bg-red-700 hover:bg-red-900 text-white px-4 py-2 rounded"
            >
              Create Space First
            </button>
          </div>
        ) : !summaryId ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Click Save to create the summary entry, then you can add items.
            </p>
          </div>
        ) : (
          <DeliverablesTableEnhanced
            quoteId={quoteId}
            spaceId={summaryId}
            onAddDeliverable={() => setShowDeliverableModal(true)}
            onDeliverableAddedOrUpdated={async () => {
              await loadDeliverables();
              await updateSummaryTotals();
            }}
          />
        )}
      </div>

      {/* Deliverables Modals - Only show if summary entry exists */}
      {summaryId && quoteId && (
        <>
          {/* Add Deliverable Modal */}
          <DeliverableModal
            isOpen={showDeliverableModal}
            onClose={() => setShowDeliverableModal(false)}
            onSave={handleDeliverableSave}
            quoteId={quoteId}
            spaceId={summaryId}
          />

          {/* Edit Deliverable Modal */}
          <DeliverableEditModal
            isOpen={showEditModal}
            item={selectedItem}
            quoteId={quoteId}
            spaceId={summaryId}
            summaryId={summaryId}
            onClose={() => {
              setShowEditModal(false);
              setSelectedItem(null);
            }}
            onSave={handleDeliverableUpdate}
          />
        </>
      )}

      {/* Cancel Button */}
      <div className="flex justify-end">
        <button
          onClick={onCancel}
          className="bg-gray-300 text-black px-4 py-2 rounded-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NewSpaceCreationView;

