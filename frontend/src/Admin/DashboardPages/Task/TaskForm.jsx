import React, { useState } from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";

function TaskForm() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    roomType: "",
    image: null,
    unit: "",
    area: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:block`}
      >
        <SideBar />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Room"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <div className="p-6 flex-1 overflow-auto">
          <div className="bg-white rounded-xl shadow p-6 h-full flex flex-col">
            <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl">
              {/* Room Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Room Type
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select Room type</option>
                  <option value="Living Room">Living Room</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Kitchen">Kitchen</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <div className="w-full border rounded px-3 py-2 h-32 flex items-start justify-between bg-gray-50">
                  <span className="text-gray-500 ">Upload Image</span>
                  <label className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm px-4 py-2 rounded cursor-pointer">
                    Browse File
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Unit</label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter Price"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Area in Sq Ft
                  </label>
                  <select
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Room area</option>
                    <option value="100x100">100 x 100</option>
                    <option value="200x200">200 x 200</option>
                    <option value="300x300">300 x 300</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Room Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Write here"
                  required
                />
              </div>

              {/* Add Button */}
              <div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  ADD
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskForm;
