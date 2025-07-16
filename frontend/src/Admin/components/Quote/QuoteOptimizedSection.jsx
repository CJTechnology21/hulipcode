// components/QuoteItemizedSection.jsx
import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Modal from "../Modal";
const initialItems = [
  {
    id: 1,
    photo: "https://www.shutterstock.com/image-photo/renovation-house-building-construction-interior-260nw-2125628186.jpg",
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
    photo: "https://www.shutterstock.com/image-photo/renovation-house-building-construction-interior-260nw-2125628186.jpg",
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
    photo: "https://www.shutterstock.com/image-photo/renovation-house-building-construction-interior-260nw-2125628186.jpg",
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
    photo: "https://www.shutterstock.com/image-photo/renovation-house-building-construction-interior-260nw-2125628186.jpg",
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
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const [items, setItems] = useState(initialItems);
  const [dimensions, setDimensions] = useState([
    { name: "Door 1", h: 7, w: 2.5 },
    { name: "Door 2", h: 7, w: 3 },
    { name: "Window", h: 3, w: 2 },
  ]);
  const [editField, setEditField] = useState({ index: null, type: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState("Door");
  const [Heightft, setHeightft] = useState("");
  const [width, setWidth] = useState("");

  // Optional: submit handler
  const handleSubmit = () => {
    console.log({ type, height, width });
    setIsModalOpen(false);
  };

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
            <label className="text-red-700 font-bold text-sm block">
              Area Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={areaName}
                readOnly
                className="border rounded px-2 py-1 w-full pr-8 font-semibold"
              />
              <FaPencil className="absolute top-2.5 right-2 text-red-700 cursor-pointer text-lg" />
            </div>
          </div>
          <div>
            <label className="text-red-700 font-bold text-sm block">
              Select Category
            </label>
            <div className="relative">
              <input
                type="text"
                value="Toilet"
                readOnly
                className="border rounded px-2 py-1 w-full pr-8 font-semibold"
              />
              <FaPencil className="absolute top-2.5 right-2 text-red-700 cursor-pointer text-lg" />
            </div>
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
              <div className="relative w-24">
                <input
                  type="number"
                  value={dim.val}
                  onChange={(e) => dim.set(+e.target.value)}
                  className="border rounded px-2 py-1 w-full pr-10 font-bold text-sm text-center"
                />
                <span className="absolute top-1/2 right-7 transform -translate-y-1/2 text-xs text-black font-bold">
                  ft
                </span>
                <FaPencil className="absolute top-1/2 right-1 transform -translate-y-1/2 text-red-700 text-lg cursor-pointer" />
              </div>
            </div>
          ))}
        </div>

        {/* Doors & Windows */}
        <div className="">
          <div className="flex items-center justify-between mb-3 mr-20">
            <label className="text-red-700 font-bold text-sm">
              Door &amp; Window Dimensions
            </label>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 bg-red-700 text-white text-sm px-3 py-1 rounded-full"
            >
              <FaPlus className="text-xs" /> Add
            </button>
          </div>

         

          {dimensions.map((item, index) => (
            <div key={item.name} className="flex items-center gap-3 mb-2">
              <label className="text-red-700 font-bold text-sm w-20">
                {item.name}
              </label>
              <span className="text-red-700 font-bold text-sm">H</span>
              <div className="relative w-20">
                {editField.index === index && editField.type === "h" ? (
                  <input
                    type="text"
                    value={item.h}
                    autoFocus
                    className="border rounded px-2 py-1 w-full pr-10 text-sm font-bold text-center"
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      handleValueChange(index, "h", isNaN(val) ? 0 : val);
                    }}
                    onBlur={() => setEditField({ index: null, type: null })}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      setEditField({ index: null, type: null })
                    }
                  />
                ) : (
                  <div className="border rounded px-2 py-1 w-full pr-10 text-sm font-bold text-center relative">
                    {item.h}
                    <span className="absolute top-1/2 right-7 transform -translate-y-1/2 text-black text-xs">
                      ft
                    </span>
                    <FaPencil
                      className="absolute top-1/2 right-1 transform -translate-y-1/2 text-red-700 cursor-pointer text-lg"
                      onClick={() => setEditField({ index, type: "h" })}
                    />
                  </div>
                )}
              </div>
              <span className="text-red-700 font-bold text-sm">W</span>
              <div className="relative w-20">
                {editField.index === index && editField.type === "w" ? (
                  <input
                    type="text"
                    value={item.w}
                    autoFocus
                    className="border rounded px-2 py-1 w-full pr-10 text-sm font-bold text-center"
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      handleValueChange(index, "w", isNaN(val) ? 0 : val);
                    }}
                    onBlur={() => setEditField({ index: null, type: null })}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      setEditField({ index: null, type: null })
                    }
                  />
                ) : (
                  <div className="border rounded px-2 py-1 w-full pr-10 text-sm font-bold text-center relative">
                    {item.w}
                    <span className="absolute top-1/2 right-7 transform -translate-y-1/2 text-black text-xs">
                      ft
                    </span>
                    <FaPencil
                      className="absolute top-1/2 right-1 transform -translate-y-1/2 text-red-700 text-lg cursor-pointer"
                      onClick={() => setEditField({ index, type: "w" })}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Unit toggle + Area Values */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-red-700">Unit</label>
            <button
              onClick={() => setUnit(unit === "Feet" ? "Meters" : "Feet")}
              className="flex items-center bg-red-700 text-white text-sm rounded-full px-3 py-1"
            >
              <span className="mr-1">▾</span>
              {unit}
            </button>
          </div>

          {/* Area Display */}
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
            <button
              onClick={() => setToggle(toggle === "Save" ? "Action" : "Save")}
              className="flex items-center bg-red-700 text-white text-sm rounded-full px-3 py-1"
            >
              <span className="mr-1">▾</span>
              {toggle}
            </button>
          </div>

          <div className="font-bold text-black text-sm border-b-4 border-red-700 w-fit">
            Area Calculation
          </div>

          <button className="w-full border-2 border-black px-2 py-1 rounded-full text-sm font-bold bg-white hover:bg-gray-100">
            Automatic
          </button>
          <button className="w-full bg-red-700 text-white px-2 py-1 rounded-full text-sm font-bold hover:bg-red-800">
            Custom
          </button>
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
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item)}
                  className="cursor-pointer hover:bg-red-50"
                >
                  <td className="border px-2 py-1">{idx + 1}</td>
                  <td className="border px-2 py-1">
                    <img
                      src={item.photo}
                      alt="item"
                      className="w-10 h-10 object-cover"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    {item.code} / {item.category}
                  </td>
                  <td className="border px-2 py-1">{item.description}</td>
                  <td className="border px-2 py-1">{item.spec}</td>
                  <td className="border px-2 py-1">{item.qty}</td>
                  <td className="border px-2 py-1">{item.unit}</td>
                  <td className="border px-2 py-1">₹ {item.rate}</td>
                  <td className="border px-2 py-1">₹ {amount}</td>
                  <td className="border px-2 py-1">{item.gst}%</td>
                  <td className="border px-2 py-1">
                    ₹ {totalWithGST.toFixed(2)}
                  </td>
                  <td className="border px-2 py-1 flex gap-2">
                    <FaPencil className="text-blue-600 cursor-pointer" />
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
      <Transition.Root show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-40"
          onClose={setShowModal}
        >
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-300"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative w-full max-w-sm bg-white rounded-3xl shadow-xl p-5 overflow-hidden mt-6">
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl font-bold"
              >
                &times;
              </button>

              {/* Modal Content */}
              <div className="space-y-0 pt-2">
                <div className="text-lg font-extrabold text-gray-800">
                  Deliverable Detail
                </div>

                <img
                  src={selectedItem?.photo}
                  alt="Selected"
                  className="w-full h-40 object-cover rounded-xl"
                />

                <div className="space-y-3 text-sm font-medium">
                  <div>
                    <label className="font-bold block mb-1">Deliverable</label>
                    <input
                      type="text"
                      value={selectedItem?.description}
                      readOnly
                      className="w-full border px-3 py-1.5 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">
                      Deliverable Description
                    </label>
                    <textarea
                      rows={3}
                      readOnly
                      value={`Creating Routes for electrical wiring and inserting conducting pipes for stability of wires running along the route. This include Mcb’s , Mcb Unit box as well. This also includes conduits, junction boxes and electrical wires as well. Wire & MCB Brand :`}
                      className="w-full border px-3 py-1.5 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">
                      Specification
                    </label>
                    <input
                      type="text"
                      value={selectedItem?.spec}
                      readOnly
                      className="w-full border px-3 py-1.5 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold block mb-1">Code</label>
                      <input
                        type="text"
                        value={selectedItem?.code}
                        readOnly
                        className="w-full border px-3 py-1.5 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">Category</label>
                      <input
                        type="text"
                        value={selectedItem?.category}
                        readOnly
                        className="w-full border px-3 py-1.5 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {/* Editable UOM */}
                    <div className="relative">
                      <label className="font-bold block mb-1">UOM</label>
                      <input
                        type="text"
                        value={selectedItem?.unit}
                        className="w-full border px-3 py-1.5 rounded-xl pr-8"
                      />
                      <FaPencil className="absolute top-9 right-2 text-gray-500 text-xs cursor-pointer" />
                    </div>

                    {/* Editable QTY */}
                    <div className="relative">
                      <label className="font-bold block mb-1">QTY</label>
                      <input
                        type="number"
                        value={selectedItem?.qty}
                        className="w-full border px-3 py-1.5 rounded-xl pr-8"
                      />
                      <FaPencil className="absolute top-9 right-2 text-gray-500 text-xs cursor-pointer" />
                    </div>

                    {/* Editable RATE */}
                    <div className="relative">
                      <label className="font-bold block mb-1">Rate</label>
                      <input
                        type="number"
                        value={selectedItem?.rate}
                        className="w-full border px-3 py-1.5 rounded-xl pr-8"
                      />
                      <FaPencil className="absolute top-9 right-2 text-gray-500 text-xs cursor-pointer" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Editable HSN */}
                    <div className="relative">
                      <label className="font-bold block mb-1">HSN</label>
                      <input
                        type="text"
                        value="7746337"
                        className="w-full border px-3 py-1.5 rounded-xl pr-8"
                      />
                      <FaPencil className="absolute top-9 right-2 text-gray-500 text-xs cursor-pointer" />
                    </div>

                    {/* Editable GST */}
                    <div className="relative">
                      <label className="font-bold block mb-1">GST</label>
                      <input
                        type="text"
                        value={`${selectedItem?.gst}%`}
                        className="w-full border px-3 py-1.5 rounded-xl pr-8"
                      />
                      <FaPencil className="absolute top-9 right-2 text-gray-500 text-xs cursor-pointer" />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2 text-center">
                  <button
                    className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-full font-semibold"
                    onClick={() => setShowModal(false)}
                  >
                    Save
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Opening"
        size="sm"
      >
        <div className="space-y-4">
          {/* Type Dropdown */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="Door">Door</option>
              <option value="Window">Window</option>
            </select>
          </div>

          {/* Height Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Height (ft)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="Enter height"
            />
          </div>

          {/* Width Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Width (ft)
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="Enter width"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded text-sm border border-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded text-sm bg-red-700 text-white"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuoteItemizedSection;
