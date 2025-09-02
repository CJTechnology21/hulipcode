import React, { useState } from "react";
import { FaRegWindowClose } from "react-icons/fa";

const RoomModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [roomData, setRoomData] = useState(
    initialData || {
      name: "",
      category: "",
      length: "",
      breadth: "",
      height: "",
      doors: [{ name: "Door 1", height: "", width: "" }],
      windows: [{ name: "Window", height: "", width: "" }],
    }
  );

  const handleChange = (field, value) => {
    setRoomData(prev => ({ ...prev, [field]: value }));
  };

  const handleDimensionChange = (field, index, value, type) => {
    const items = [...roomData[type]];
    items[index][field] = value;
    setRoomData(prev => ({ ...prev, [type]: items }));
  };

  const handleAddDoorWindow = type => {
    const items = [...roomData[type], { name: `${type === "doors" ? "Door" : "Window"} ${roomData[type].length + 1}`, height: "", width: "" }];
    setRoomData(prev => ({ ...prev, [type]: items }));
  };

  const handleSave = () => {
    onSave(roomData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">{initialData ? "Edit Room" : "Add New Room"}</h2>
          <FaRegWindowClose className="text-red-600 cursor-pointer" onClick={onClose} />
        </div>

        {/* Room Name & Category */}
        <div className="mb-4 space-y-2">
          <label className="font-bold block">Room Name</label>
          <input
            value={roomData.name}
            onChange={e => handleChange("name", e.target.value)}
            className="w-full border rounded p-2 outline-none"
          />
          <label className="font-bold block">Category</label>
          <input
            value={roomData.category}
            onChange={e => handleChange("category", e.target.value)}
            className="w-full border rounded p-2 outline-none"
          />
        </div>

        {/* Dimensions */}
        <div className="mb-4 space-y-2">
          <label className="font-bold block">Dimensions (ft)</label>
          {["length", "breadth", "height"].map(dim => (
            <input
              key={dim}
              type="number"
              placeholder={dim.charAt(0).toUpperCase() + dim.slice(1)}
              value={roomData[dim]}
              onChange={e => handleChange(dim, e.target.value)}
              className="w-full border rounded p-2 outline-none mb-1"
            />
          ))}
        </div>

        {/* Doors & Windows */}
        {["doors", "windows"].map(type => (
          <div key={type} className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="font-bold">{type === "doors" ? "Doors" : "Windows"}</label>
              <button
                onClick={() => handleAddDoorWindow(type)}
                className="bg-red-600 text-white text-xs px-2 py-1 rounded"
              >
                + Add
              </button>
            </div>
            {roomData[type].map((item, idx) => (
              <div key={idx} className="flex gap-2 mb-1">
                <span className="w-16 font-semibold">{item.name}</span>
                <input
                  type="number"
                  placeholder="H"
                  value={item.height}
                  onChange={e => handleDimensionChange("height", idx, e.target.value, type)}
                  className="w-16 border rounded p-1 outline-none"
                />
                <input
                  type="number"
                  placeholder="W"
                  value={item.width}
                  onChange={e => handleDimensionChange("width", idx, e.target.value, type)}
                  className="w-16 border rounded p-1 outline-none"
                />
              </div>
            ))}
          </div>
        ))}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-red-600 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;
