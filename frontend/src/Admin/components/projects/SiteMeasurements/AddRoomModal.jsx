import React, { useState } from "react";
import { FaRegWindowClose } from "react-icons/fa";

const AddRoomModal = ({ show, onClose, onSave, categories, projectId, architectId, calculateValues }) => {
  const [newRoom, setNewRoom] = useState({
    name: "",
    category: "",
    length: "",
    breadth: "",
    height: "",
    openings: [],
    custom: false,
    perimeter: null,
    floorArea: null,
    wallArea: null,
  });

  if (!show) return null;

  const handleSave = () => {
    if (!projectId) {
      alert("Project ID missing");
      return;
    }
    if (!newRoom.name || !newRoom.length || !newRoom.breadth || !newRoom.height) {
      alert("Please fill required fields");
      return;
    }

    const calculated = calculateValues(newRoom);
    const payload = {
      ...newRoom,
      ...calculated,
      projectId,
      architectId,
    };

    onSave(payload, () => {
      // reset after save
      setNewRoom({
        name: "",
        category: "",
        length: "",
        breadth: "",
        height: "",
        openings: [],
        custom: false,
        perimeter: null,
        floorArea: null,
        wallArea: null,
      });
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-96 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 text-lg"
        >
          <FaRegWindowClose />
        </button>
        <h2 className="text-lg font-bold mb-4">Add New Room</h2>

        {/* Room Basic Info */}
        <div className="mb-3">
          <label className="block font-bold">Room Name</label>
          <input
            type="text"
            value={newRoom.name}
            onChange={(e) =>
              setNewRoom((s) => ({ ...s, name: e.target.value }))
            }
            className="w-full border p-2 rounded mb-3"
          />

          <label className="block font-bold">Category</label>
          <select
            value={newRoom.category}
            onChange={(e) =>
              setNewRoom((s) => ({ ...s, category: e.target.value }))
            }
            className="w-full border p-2 rounded mb-3"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {["length", "breadth", "height"].map((field) => (
            <div key={field} className="mb-3">
              <label className="block font-bold capitalize">{field}</label>
              <input
                type="number"
                value={newRoom[field]}
                onChange={(e) =>
                  setNewRoom((s) => ({ ...s, [field]: e.target.value }))
                }
                className="w-full border p-2 rounded"
              />
            </div>
          ))}
        </div>

        {/* Openings */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <label className="font-bold">Doors & Windows</label>
            <button
              className="bg-red-700 text-white text-xs px-2 py-1 rounded flex items-center gap-1"
              onClick={() =>
                setNewRoom((s) => ({
                  ...s,
                  openings: [
                    ...(Array.isArray(s.openings) ? s.openings : []),
                    { type: "Door", height: 0, width: 0 },
                  ],
                }))
              }
            >
              <span className="text-lg font-bold">+</span> Add
            </button>
          </div>

          {(Array.isArray(newRoom.openings) ? newRoom.openings : []).map(
            (op, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <select
                  className="font-bold border p-1 rounded w-24"
                  value={op.type}
                  onChange={(e) => {
                    const updated = [...newRoom.openings];
                    updated[idx] = { ...updated[idx], type: e.target.value };
                    setNewRoom((s) => ({ ...s, openings: updated }));
                  }}
                >
                  <option value="Door">Door</option>
                  <option value="Window">Window</option>
                </select>
                <input
                  type="number"
                  className="border p-1 rounded w-16"
                  placeholder="Height"
                  value={op.height}
                  onChange={(e) => {
                    const updated = [...newRoom.openings];
                    updated[idx] = { ...updated[idx], height: e.target.value };
                    setNewRoom((s) => ({ ...s, openings: updated }));
                  }}
                />
                <input
                  type="number"
                  className="border p-1 rounded w-16"
                  placeholder="Width"
                  value={op.width}
                  onChange={(e) => {
                    const updated = [...newRoom.openings];
                    updated[idx] = { ...updated[idx], width: e.target.value };
                    setNewRoom((s) => ({ ...s, openings: updated }));
                  }}
                />
                <button
                  className="text-red-600 font-bold"
                  onClick={() => {
                    const updated = newRoom.openings.filter(
                      (_, i) => i !== idx
                    );
                    setNewRoom((s) => ({ ...s, openings: updated }));
                  }}
                >
                  X
                </button>
              </div>
            )
          )}
        </div>

        <button
          onClick={handleSave}
          className="bg-red-700 text-white px-4 py-2 rounded mt-2 w-full"
        >
          Add Room
        </button>
      </div>
    </div>
  );
};

export default AddRoomModal;
