// // components/QuoteItemizedSection.jsx
// import React, { useState, Fragment } from "react";
// import { FaPlus, FaTrash } from "react-icons/fa";
// import { FaPencil } from "react-icons/fa6";
// import { Dialog, Transition } from "@headlessui/react";
// import { initialItems } from "./initialLeads";
// import Modal from "../Modal";
// import Button from "../../../components/Button";
// import DropDown from "../../../components/DropDown";

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

// const QuoteItemizedSection = ({
//   areaName: defaultAreaName = "Master Bedroom Toilet",
// }) => {
//   const [areaName, setAreaName] = useState(defaultAreaName);
//   const [category, setCategory] = useState("Toilet");

//   const [length, setLength] = useState(12);
//   const [breadth, setBreadth] = useState(6);
//   const [height, setHeight] = useState(9);
//   const [unit, setUnit] = useState("Feet");
//   const [toggle, setToggle] = useState("Save");

//   const [items, setItems] = useState(initialItems);
//   const [dimensions, setDimensions] = useState([
//     { name: "Door 1", h: 7, w: 2.5 },
//     { name: "Door 2", h: 7, w: 3 },
//     { name: "Window", h: 3, w: 2 },
//   ]);
//   // inside QuoteItemizedSection.jsx

//   const [showDeliverableModal, setShowDeliverableModal] = useState(false);
//   const [newDeliverable, setNewDeliverable] = useState({
//     photo: "",
//     description: "",
//     spec: "",
//     code: "",
//     category: "",
//     unit: "",
//     qty: 0,
//     rate: 0,
//     hsn: "",
//     gst: 0,
//   });

//   // handle file upload
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setNewDeliverable((prev) => ({ ...prev, photo: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleNewDeliverableChange = (field, value) => {
//     setNewDeliverable((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleAddDeliverable = () => {
//     const newItem = {
//       ...newDeliverable,
//       id: Date.now(), // unique id
//     };
//     setItems((prev) => [...prev, newItem]);
//     setShowDeliverableModal(false);
//     setNewDeliverable({
//       photo: "",
//       description: "",
//       spec: "",
//       code: "",
//       category: "",
//       unit: "",
//       qty: 0,
//       rate: 0,
//       hsn: "",
//       gst: 0,
//     });
//   };

//   // const [editField, setEditField] = useState({ index: null, type: null });

//   // Modal for add opening
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [type, setType] = useState("Door");
//   const [newHeight, setNewHeight] = useState("");
//   const [newWidth, setNewWidth] = useState("");

//   // Side modal for deliverables
//   const [showModal, setShowModal] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);

//   const handleRowClick = (item) => {
//     setSelectedItem(item);
//     setShowModal(true);
//   };

//   const handleValueChange = (index, type, value) => {
//     const updated = [...dimensions];
//     updated[index][type] = value;
//     setDimensions(updated);
//   };

//   const handleSubmit = () => {
//     if (!newHeight || !newWidth) return;
//     const newItem = {
//       name: `${type} ${dimensions.length + 1}`,
//       h: parseFloat(newHeight),
//       w: parseFloat(newWidth),
//     };
//     setDimensions([...dimensions, newItem]);
//     setNewHeight("");
//     setNewWidth("");
//     setIsModalOpen(false);
//   };

//   const handleItemChange = (field, value) => {
//     setSelectedItem((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSaveItem = () => {
//     setItems((prev) =>
//       prev.map((itm) => (itm.id === selectedItem.id ? selectedItem : itm))
//     );
//     setShowModal(false);
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
//       <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
//         {/* Area Name & Category */}
//         <div className="space-y-4">
//           <div>
//             <label className="text-red-700 font-bold text-sm block">
//               Area Name
//             </label>
//             <input
//               type="text"
//               value={areaName}
//               onChange={(e) => setAreaName(e.target.value)}
//               className="border rounded px-2 py-1 w-full font-semibold"
//             />
//           </div>
//           <div>
//             <DropDown
//               label="Select Category"
//               name="category"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               options={categories}
//               className="border-red-700 text-red-700 focus:ring-red-700 focus:border-red-700"
//             />
//           </div>
//         </div>

//         {/* Area Dimensions */}
//         <div className="space-y-2">
//           <label className="text-red-700 font-bold text-sm block">
//             Enter Area Dimensions
//           </label>
//           {[
//             { label: "Length", val: length, set: setLength },
//             { label: "Breadth", val: breadth, set: setBreadth },
//             { label: "Height", val: height, set: setHeight },
//           ].map((dim) => (
//             <div key={dim.label} className="flex items-center gap-3">
//               <span className="text-sm font-bold text-red-700 w-16">
//                 {dim.label}
//               </span>
//               <input
//                 type="number"
//                 value={dim.val}
//                 onChange={(e) => dim.set(+e.target.value)}
//                 className="border rounded px-2 py-1 w-24 font-bold text-sm text-center"
//               />
//               <span className="text-xs font-bold">ft</span>
//             </div>
//           ))}
//         </div>
//         {/* Doors & Windows */}
//         <div className="mb-4">
//           <div className="flex items-center justify-between mb-3">
//             <label className="text-red-700 font-bold text-sm mr-6">
//               Door &amp; Window Dimensions
//             </label>
//             <Button
//               variant="custom"
//               onClick={() => setIsModalOpen(true)}
//               className="flex items-center gap-1 bg-red-700 text-white text-sm px-3 py-1 rounded-full"
//             >
//               <FaPlus className="text-xs" /> Add
//             </Button>
//           </div>

//           {/* Local grid wrapper just for door/window rows */}
//           <div className="space-y-2 -ml-20 ">
//             {dimensions.map((item, index) => (
//               <div
//                 key={item.name}
//                 className="grid grid-cols-[100px_20px_80px_20px_80px] items-center gap-2"
//               >
//                 <label className="text-red-700 font-bold text-sm text-right">
//                   {item.name}
//                 </label>

//                 <span className="text-red-700 font-bold text-sm">H</span>
//                 <input
//                   type="number"
//                   value={item.h}
//                   onChange={(e) =>
//                     handleValueChange(index, "h", parseFloat(e.target.value))
//                   }
//                   className="border rounded px-2 py-1 text-sm font-bold text-center"
//                 />

//                 <span className="text-red-700 font-bold text-sm">W</span>
//                 <input
//                   type="number"
//                   value={item.w}
//                   onChange={(e) =>
//                     handleValueChange(index, "w", parseFloat(e.target.value))
//                   }
//                   className="border rounded px-2 py-1 text-sm font-bold text-center"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//         {/* Unit toggle + Area Values */}
//         <div className="space-y-3">
//           <div className="flex justify-between items-center">
//             <label className="text-sm font-bold text-red-700">Unit</label>
//             <Button
//               variant="custom"
//               onClick={() => setUnit(unit === "Feet" ? "Meters" : "Feet")}
//               className="flex items-center bg-red-700 hover:bg-red-900 text-white text-sm rounded-full px-3 py-1"
//             >
//               {unit}
//             </Button>
//           </div>

//           {/* Area Display */}
//           <div className="text-sm space-y-1">
//             <div className="flex justify-between items-center ">
//               <span className="text-red-700 font-bold">Perimeter</span>
//               <span className="text-black font-bold border-2 border-black rounded px-2 py-1 text-center w-24">
//                 {perimeter} ft
//               </span>
//             </div>
//             <div className="flex justify-between items-center ">
//               <span className="text-red-700 font-bold">Floor Area</span>
//               <span className="text-black font-bold border-2 border-black rounded px-2 py-1 text-center w-24">
//                 {floorArea} ft²
//               </span>
//             </div>
//             <div className="flex justify-between items-center ">
//               <span className="text-red-700 font-bold">Wall Area</span>
//               <span className="text-black font-bold border-2 border-black rounded px-2 py-1 text-center w-24">
//                 {wallArea} ft²
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Save / Action Toggle + Buttons */}
//         <div className="space-y-2">
//           <div className="flex justify-between items-center">
//             <label className="text-sm font-bold text-red-700">Action</label>
//             <Button
//               variant="custom"
//               onClick={() => setToggle(toggle === "Save" ? "Action" : "Save")}
//               className="flex items-center bg-red-700 hover:bg-red-900 text-white text-sm rounded-full px-3 py-1"
//             >
//               {toggle}
//             </Button>
//           </div>

//           <div className="font-bold text-black text-sm border-b-4 border-red-700 w-fit">
//             Area Calculation
//           </div>

//           <Button
//             variant="custom"
//             className="w-full border-2 border-black px-2 py-1 rounded-full text-sm font-bold bg-white hover:bg-gray-100"
//           >
//             Automatic
//           </Button>
//           <Button
//             variant="custom"
//             className="w-full bg-red-700 text-white px-2 py-1 rounded-full text-sm font-bold hover:bg-red-800"
//           >
//             Custom
//           </Button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="flex justify-end mb-2">
//         <Button
//           variant="custom"
//           onClick={() => setShowDeliverableModal(true)}
//           className="flex items-center gap-2 bg-red-700 hover:bg-red-900 text-white px-4 py-2 rounded-full text-sm font-bold"
//         >
//           <FaPlus /> Add Deliverable
//         </Button>
//       </div>

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
//                 <tr
//                   key={item.id}
//                   onClick={() => handleRowClick(item)}
//                   className="cursor-pointer hover:bg-red-50"
//                 >
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
//                   <td className="border px-2 py-1">
//                     ₹ {totalWithGST.toFixed(2)}
//                   </td>
//                   <td className="border px-2 py-1 flex gap-2">
//                     <FaPencil className="text-blue-600 cursor-pointer" />
//                     <FaTrash
//                       className="text-red-600 cursor-pointer"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setItems((prev) =>
//                           prev.filter((itm) => itm.id !== item.id)
//                         );
//                       }}
//                     />
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

//       {/* Side Modal for Deliverables */}
//       <Transition.Root show={showModal} as={Fragment}>
//         <Dialog
//           as="div"
//           className="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-40"
//           onClose={setShowModal}
//         >
//           <Transition.Child
//             as={Fragment}
//             enter="transform transition ease-in-out duration-300"
//             enterFrom="translate-x-full"
//             enterTo="translate-x-0"
//             leave="transform transition ease-in-out duration-300"
//             leaveFrom="translate-x-0"
//             leaveTo="translate-x-full"
//           >
//             <Dialog.Panel className="relative w-full max-w-sm bg-white rounded-3xl shadow-xl p-5 overflow-hidden mt-6">
//               {/* Close Button */}
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl font-bold"
//               >
//                 &times;
//               </button>

//               {/* Modal Content */}
//               <div className="space-y-0 pt-2">
//                 <div className="text-lg font-extrabold text-gray-800">
//                   Deliverable Detail
//                 </div>

//                 <img
//                   src={selectedItem?.photo}
//                   alt="Selected"
//                   className="w-full h-40 object-cover rounded-xl"
//                 />

//                 <div className="space-y-3 text-sm font-medium">
//                   <div>
//                     <label className="font-bold block mb-1">Deliverable</label>
//                     <input
//                       type="text"
//                       value={selectedItem?.description || ""}
//                       onChange={(e) =>
//                         handleItemChange("description", e.target.value)
//                       }
//                       className="w-full border px-3 py-1.5 rounded-xl"
//                     />
//                   </div>

//                   <div>
//                     <label className="font-bold block mb-1">
//                       Specification
//                     </label>
//                     <input
//                       type="text"
//                       value={selectedItem?.spec || ""}
//                       onChange={(e) => handleItemChange("spec", e.target.value)}
//                       className="w-full border px-3 py-1.5 rounded-xl"
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="font-bold block mb-1">Code</label>
//                       <input
//                         type="text"
//                         value={selectedItem?.code || ""}
//                         onChange={(e) =>
//                           handleItemChange("code", e.target.value)
//                         }
//                         className="w-full border px-3 py-1.5 rounded-xl"
//                       />
//                     </div>
//                     <div>
//                       <label className="font-bold block mb-1">Category</label>
//                       <input
//                         type="text"
//                         value={selectedItem?.category || ""}
//                         onChange={(e) =>
//                           handleItemChange("category", e.target.value)
//                         }
//                         className="w-full border px-3 py-1.5 rounded-xl"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-3 gap-3">
//                     <div>
//                       <label className="font-bold block mb-1">UOM</label>
//                       <input
//                         type="text"
//                         value={selectedItem?.unit || ""}
//                         onChange={(e) =>
//                           handleItemChange("unit", e.target.value)
//                         }
//                         className="w-full border px-3 py-1.5 rounded-xl"
//                       />
//                     </div>

//                     <div>
//                       <label className="font-bold block mb-1">QTY</label>
//                       <input
//                         type="number"
//                         value={selectedItem?.qty || 0}
//                         onChange={(e) =>
//                           handleItemChange("qty", +e.target.value)
//                         }
//                         className="w-full border px-3 py-1.5 rounded-xl"
//                       />
//                     </div>

//                     <div>
//                       <label className="font-bold block mb-1">Rate</label>
//                       <input
//                         type="number"
//                         value={selectedItem?.rate || 0}
//                         onChange={(e) =>
//                           handleItemChange("rate", +e.target.value)
//                         }
//                         className="w-full border px-3 py-1.5 rounded-xl"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="font-bold block mb-1">HSN</label>
//                       <input
//                         type="text"
//                         value={selectedItem?.hsn || ""}
//                         onChange={(e) =>
//                           handleItemChange("hsn", e.target.value)
//                         }
//                         className="w-full border px-3 py-1.5 rounded-xl"
//                       />
//                     </div>

//                     <div>
//                       <label className="font-bold block mb-1">GST</label>
//                       <input
//                         type="number"
//                         value={selectedItem?.gst || 0}
//                         onChange={(e) =>
//                           handleItemChange("gst", +e.target.value)
//                         }
//                         className="w-full border px-3 py-1.5 rounded-xl"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Save Button */}
//                 <div className="pt-2 text-center">
//                   <Button
//                     variant="custom"
//                     className="bg-red-700 hover:bg-red-900 text-white px-6 py-2 rounded-full font-semibold"
//                     onClick={handleSaveItem}
//                   >
//                     Save
//                   </Button>
//                 </div>
//               </div>
//             </Dialog.Panel>
//           </Transition.Child>
//         </Dialog>
//       </Transition.Root>

//       {/* Modal for Add Opening */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title="Add Opening"
//         size="sm"
//       >
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1">
//               Type
//             </label>
//             <select
//               value={type}
//               onChange={(e) => setType(e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//             >
//               <option value="Door">Door</option>
//               <option value="Window">Window</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1">
//               Height (ft)
//             </label>
//             <input
//               type="number"
//               value={newHeight}
//               onChange={(e) => setNewHeight(e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//               placeholder="Enter height"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1">
//               Width (ft)
//             </label>
//             <input
//               type="number"
//               value={newWidth}
//               onChange={(e) => setNewWidth(e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//               placeholder="Enter width"
//             />
//           </div>

//           <div className="flex justify-end gap-3 pt-2">
//             <Button
//               variant="custom"
//               onClick={() => setIsModalOpen(false)}
//               className="px-4 py-2 rounded text-sm border border-gray-400"
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="custom"
//               onClick={handleSubmit}
//               className="px-4 py-2 rounded text-sm bg-red-700 hover:bg-red-900 text-white"
//             >
//               Save
//             </Button>
//           </div>
//         </div>
//       </Modal>
//       {/* Modal for Adding Deliverable */}
//       <Modal
//         isOpen={showDeliverableModal}
//         onClose={() => setShowDeliverableModal(false)}
//         title="Add Deliverable"
//         size="sm"
//       >
//         <div className="space-y-4">
//           {/* Upload Photo */}
//           <div>
//             <label className="font-bold block mb-1">Upload Photo</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="w-full border px-3 py-2 rounded text-sm"
//             />
//             {newDeliverable.photo && (
//               <img
//                 src={newDeliverable.photo}
//                 alt="Preview"
//                 className="w-full h-32 object-cover mt-2 rounded"
//               />
//             )}
//           </div>

//           {/* Deliverable Fields */}
//           <div>
//             <label className="font-bold block mb-1">Deliverable</label>
//             <input
//               type="text"
//               value={newDeliverable.description}
//               onChange={(e) =>
//                 handleNewDeliverableChange("description", e.target.value)
//               }
//               className="w-full border px-3 py-2 rounded text-sm"
//             />
//           </div>

//           <div>
//             <label className="font-bold block mb-1">Specification</label>
//             <input
//               type="text"
//               value={newDeliverable.spec}
//               onChange={(e) =>
//                 handleNewDeliverableChange("spec", e.target.value)
//               }
//               className="w-full border px-3 py-2 rounded text-sm"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="font-bold block mb-1">Code</label>
//               <input
//                 type="text"
//                 value={newDeliverable.code}
//                 onChange={(e) =>
//                   handleNewDeliverableChange("code", e.target.value)
//                 }
//                 className="w-full border px-3 py-2 rounded text-sm"
//               />
//             </div>
//             <div>
//               <label className="font-bold block mb-1">Category</label>
//               <input
//                 type="text"
//                 value={newDeliverable.category}
//                 onChange={(e) =>
//                   handleNewDeliverableChange("category", e.target.value)
//                 }
//                 className="w-full border px-3 py-2 rounded text-sm"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-3 gap-3">
//             <div>
//               <label className="font-bold block mb-1">UOM</label>
//               <input
//                 type="text"
//                 value={newDeliverable.unit}
//                 onChange={(e) =>
//                   handleNewDeliverableChange("unit", e.target.value)
//                 }
//                 className="w-full border px-3 py-2 rounded text-sm"
//               />
//             </div>
//             <div>
//               <label className="font-bold block mb-1">QTY</label>
//               <input
//                 type="number"
//                 value={newDeliverable.qty}
//                 onChange={(e) =>
//                   handleNewDeliverableChange("qty", +e.target.value)
//                 }
//                 className="w-full border px-3 py-2 rounded text-sm"
//               />
//             </div>
//             <div>
//               <label className="font-bold block mb-1">Rate</label>
//               <input
//                 type="number"
//                 value={newDeliverable.rate}
//                 onChange={(e) =>
//                   handleNewDeliverableChange("rate", +e.target.value)
//                 }
//                 className="w-full border px-3 py-2 rounded text-sm"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="font-bold block mb-1">HSN</label>
//               <input
//                 type="text"
//                 value={newDeliverable.hsn}
//                 onChange={(e) =>
//                   handleNewDeliverableChange("hsn", e.target.value)
//                 }
//                 className="w-full border px-3 py-2 rounded text-sm"
//               />
//             </div>
//             <div>
//               <label className="font-bold block mb-1">GST (%)</label>
//               <input
//                 type="number"
//                 value={newDeliverable.gst}
//                 onChange={(e) =>
//                   handleNewDeliverableChange("gst", +e.target.value)
//                 }
//                 className="w-full border px-3 py-2 rounded text-sm"
//               />
//             </div>
//           </div>

//           {/* Save Button */}
//           <div className="flex justify-end gap-3 pt-4">
//             <Button
//               variant="custom"
//               onClick={() => setShowDeliverableModal(false)}
//               className="px-4 py-2 rounded text-sm border border-gray-400"
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="custom"
//               onClick={handleAddDeliverable}
//               className="px-4 py-2 rounded text-sm bg-red-700 hover:bg-red-900 text-white"
//             >
//               Save
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default QuoteItemizedSection;

// import React, { useState } from "react";
// import AreaDetails from "./AreaDetails";
// import DeliverablesTable from "./DeliverablesTable";
// import DeliverableModal from "./DeliverableModal";
// import DeliverableEditModal from "./DeliverableEditModal";
// import OpeningModal from "./OpeningModal";
// import { initialItems } from "./initialLeads";

// const QuoteItemizedSection = ({ areaName: defaultAreaName }) => {
//   const [areaName, setAreaName] = useState(defaultAreaName || "Master Bedroom Toilet");
//   const [category, setCategory] = useState("Toilet");
//   const [dimensions, setDimensions] = useState([
//     { name: "Door 1", h: 7, w: 2.5 },
//     { name: "Door 2", h: 7, w: 3 },
//     { name: "Window", h: 3, w: 2 },
//   ]);
//   const [unit, setUnit] = useState("Feet");
//   const [length, setLength] = useState(10);
//   const [breadth, setBreadth] = useState(12);
//   const [height, setHeight] = useState(10);

//   const [items, setItems] = useState(initialItems);

//   const [showDeliverableModal, setShowDeliverableModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showOpeningModal, setShowOpeningModal] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);

//   return (
//     <div className="bg-white p-4 rounded shadow space-y-6">
//       <AreaDetails
//         areaName={areaName}
//         setAreaName={setAreaName}
//         category={category}
//         setCategory={setCategory}
//         dimensions={dimensions}
//         setDimensions={setDimensions}
//         unit={unit}
//         setUnit={setUnit}
//         length={length}
//         setLength={setLength}
//         breadth={breadth}
//         setBreadth={setBreadth}
//         height={height}
//         setHeight={setHeight}
//         onAddOpening={() => setShowOpeningModal(true)}
//       />

//       <DeliverablesTable
//         items={items}
//         onRowClick={(item) => {
//           setSelectedItem(item);
//           setShowEditModal(true);
//         }}
//         onDelete={(id) => setItems((prev) => prev.filter((itm) => itm.id !== id))}
//         onAddDeliverable={() => setShowDeliverableModal(true)}
//       />

//       {/* Add Deliverable */}
//       <DeliverableModal
//         isOpen={showDeliverableModal}
//         onClose={() => setShowDeliverableModal(false)}
//         onSave={(newItem) => setItems((prev) => [...prev, newItem])}
//       />

//       {/* Edit Deliverable */}
//       <DeliverableEditModal
//         isOpen={showEditModal}
//         item={selectedItem}
//         onClose={() => setShowEditModal(false)}
//         onSave={(updated) =>
//           setItems((prev) => prev.map((itm) => (itm.id === updated.id ? updated : itm)))
//         }
//       />

//       {/* Add Opening */}
//       <OpeningModal
//         isOpen={showOpeningModal}
//         onClose={() => setShowOpeningModal(false)}
//         onSave={(newOpening) => setDimensions((prev) => [...prev, newOpening])}
//       />
//     </div>
//   );
// };

// export default QuoteItemizedSection;

import React, { useState, useEffect } from "react";
import AreaDetails from "./AreaDetails";
import DeliverablesTable from "./DeliverablesTable";
import DeliverableModal from "./DeliverableModal";
import DeliverableEditModal from "./DeliverableEditModal";
import OpeningModal from "./OpeningModal";
import { initialItems } from "./initialLeads";

const QuoteItemizedSection = ({ spaceRow, quoteId, isHuelip }) => {
  // useEffect so state resets when switching sections
  const [areaName, setAreaName] = useState(spaceRow?.space || "");
  const [category, setCategory] = useState(spaceRow?.category || "");
  const [unit, setUnit] = useState(spaceRow?.unit || "Feet");
  const [length, setLength] = useState(spaceRow?.length || 0);
  const [breadth, setBreadth] = useState(spaceRow?.breadth || 0);
  const [height, setHeight] = useState(spaceRow?.height || 0);
  const [dimensions, setDimensions] = useState(spaceRow?.openings || []);
  const [items, setItems] = useState(spaceRow?.deliverables || initialItems);

  useEffect(() => {
    setAreaName(spaceRow?.space || "");
    setCategory(spaceRow?.category || "");
    setUnit(spaceRow?.unit || "Feet");
    setLength(spaceRow?.length || 0);
    setBreadth(spaceRow?.breadth || 0);
    setHeight(spaceRow?.height || 0);
    setDimensions(spaceRow?.openings || []);
    setItems(spaceRow?.deliverables || []);
  }, [spaceRow]);

  const [showDeliverableModal, setShowDeliverableModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOpeningModal, setShowOpeningModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="bg-white p-4 rounded shadow space-y-6">
      <AreaDetails
        quoteId={quoteId}
        spaceId={spaceRow?._id}
        areaName={areaName}
        setAreaName={setAreaName}
        category={category}
        setCategory={setCategory}
        dimensions={dimensions}
        setDimensions={setDimensions}
        unit={unit}
        setUnit={setUnit}
        length={length}
        setLength={setLength}
        breadth={breadth}
        setBreadth={setBreadth}
        height={height}
        setHeight={setHeight}
        onAddOpening={() => setShowOpeningModal(true)}
      />

      <DeliverablesTable
        quoteId={quoteId}
        spaceId={spaceRow?._id}
        items={items}
        onRowClick={(item) => {
          setSelectedItem(item);
          setShowEditModal(true);
        }}
        onDelete={(id) =>
          setItems((prev) => prev.filter((itm) => itm._id !== id))
        }
        onAddDeliverable={() => setShowDeliverableModal(true)}
      />

      {/* Add Deliverable */}
      <DeliverableModal
        isOpen={showDeliverableModal}
        onClose={() => setShowDeliverableModal(false)}
        onSave={(newItem) => setItems((prev) => [...prev, newItem])}
      />

      {/* Edit Deliverable */}
      <DeliverableEditModal
        isOpen={showEditModal}
        item={selectedItem}
        onClose={() => setShowEditModal(false)}
        onSave={(updated) =>
          setItems((prev) =>
            prev.map((itm) => (itm._id === updated._id ? updated : itm))
          )
        }
      />

      {/* Add Opening */}
      <OpeningModal
        isOpen={showOpeningModal}
        onClose={() => setShowOpeningModal(false)}
        onSave={(newOpening) => setDimensions((prev) => [...prev, newOpening])}
      />
    </div>
  );
};

export default QuoteItemizedSection;
