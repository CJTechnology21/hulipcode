import React, { useState } from "react";
import { FiEye, FiMessageSquare } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import SearchBar from "../../../components/SearchBar";
import DropDown from "../../../components/DropDown";
import Button from "../../../components/Button";
import { FaSearch } from "react-icons/fa";
import DesignPreviewModal from "./DesignPreviewModal";
import designData from "./DesignData";
import AddDesignModal from "./AddDesignModal";

const statusColors = {
  Approved: "bg-green-200 text-green-700",
  Rejected: "bg-red-200 text-red-700",
  Draft: "bg-yellow-200 text-yellow-700",
  Review: "bg-blue-200 text-blue-700",
};

const fileTypes = ["Flooring", "Electrical", "Plumbing"];
const statuses = ["Approved", "Rejected", "Draft", "Review"];
const versions = ["V1", "V2", "V3", "V4"];

function TwoDLayouts() {
  const [filters, setFilters] = useState({
    name: "",
    area: "",
    type: "",
    version: "",
    assigned: "",
    uploaded: "",
    status: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [localData, setLocalData] = useState(designData);
  const [editRowId, setEditRowId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const handleChange = (field) => (e) =>
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));

  const filteredData = localData.filter((item) => {
    const match = (value, filter) =>
      value.toLowerCase().includes(filter.toLowerCase());
    return (
      match(item.name, filters.name) &&
      match(item.area, filters.area) &&
      (!filters.type || item.fileTypes.includes(filters.type)) &&
      (!filters.version || item.versions.includes(filters.version)) &&
      match(item.assigned.name, filters.assigned) &&
      match(item.uploaded, filters.uploaded) &&
      (!filters.status || item.status === filters.status)
    );
  });

  const openModal = (file) => {
    setSelectedFile(file);
    setModalOpen(true);
  };

  const handleAddFile = (newItem) => {
    setLocalData((prev) => [...prev, newItem]);
  };

  const handleEditClick = (item) => {
    setEditRowId(item.sno);
    setEditValues({ ...item });
  };

  const handleEditChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setLocalData((prev) =>
      prev.map((item) =>
        item.sno === editRowId ? { ...editValues, sno: item.sno } : item
      )
    );
    setEditRowId(null);
    setEditValues({});
  };

  const handleDelete = (sno) => {
    setLocalData((prev) => prev.filter((item) => item.sno !== sno));
    if (editRowId === sno) {
      setEditRowId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-medium text-gray-800 border-collapse">
        <thead>
          <tr className="bg-gray-100 text-black text-[14px]">
            <th className="px-4 py-3 text-left w-[4%]">S.no</th>
            <th className="px-4 py-3 text-left w-[20%]">Name of File</th>
            <th className="px-4 py-3 text-left w-[10%]">Area</th>
            <th className="px-4 py-3 text-left w-[15%]">File Type</th>
            <th className="px-4 py-3 text-left w-[15%]">Version</th>
            <th className="px-4 py-3 text-left w-[15%]">Assigned to</th>
            <th className="px-4 py-3 text-left w-[15%]">Uploaded On</th>
            <th className="px-4 py-3 text-left w-[10%]">Status</th>
            <th className="px-4 py-3 text-left w-[6%]"></th>
          </tr>

          <tr className="bg-white border-b">
            <td className="px-4 py-2">
              <FaSearch className="text-gray-500" />
            </td>
            <td className="px-4 py-2">
              <SearchBar value={filters.name} onChange={handleChange("name")} />
            </td>
            <td className="px-4 py-2">
              <SearchBar value={filters.area} onChange={handleChange("area")} />
            </td>
            <td className="px-4 py-2">
              <DropDown
                name="type"
                value={filters.type}
                onChange={handleChange("type")}
                options={fileTypes}
              />
            </td>
            <td className="px-4 py-2">
              <DropDown
                name="version"
                value={filters.version}
                onChange={handleChange("version")}
                options={versions}
              />
            </td>
            <td className="px-4 py-2">
              <SearchBar
                value={filters.assigned}
                onChange={handleChange("assigned")}
              />
            </td>
            <td className="px-4 py-2">
              <SearchBar
                value={filters.uploaded}
                onChange={handleChange("uploaded")}
              />
            </td>
            <td className="px-4 py-2">
              <DropDown
                name="status"
                value={filters.status}
                onChange={handleChange("status")}
                options={statuses}
              />
            </td>
            <td></td>
          </tr>
        </thead>

        <tbody>
          {filteredData.map((item) => (
            <tr key={item.sno} className="border-b hover:bg-gray-50 align-top">
              <td className="px-4 py-3">{item.sno}</td>
              <td className="px-4 py-3">
                {editRowId === item.sno ? (
                  <input
                    value={editValues.name}
                    onChange={(e) => handleEditChange("name", e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                ) : (
                  item.name
                )}
              </td>
              <td className="px-4 py-3">
                {editRowId === item.sno ? (
                  <input
                    value={editValues.area}
                    onChange={(e) => handleEditChange("area", e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                ) : (
                  item.area
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2 flex-wrap">
                  {item.fileTypes.map((f, idx) => (
                    <span
                      key={idx}
                      className="border border-black rounded-full px-2 py-0.5 text-xs font-semibold"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1 flex-wrap">
                  {item.versions.map((v, idx) => (
                    <span
                      key={v.label || v}
                      className="bg-red-700 text-white px-2 py-0.5 text-xs rounded-full"
                      style={{ opacity: 1 - idx * 0.2 }}
                    >
                      {v.label || v}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full text-white text-xs font-bold ${item.assigned.color} flex items-center justify-center`}
                >
                  {item.assigned.name[0]}
                </div>
                <span>{item.assigned.name}</span>
              </td>
              <td className="px-4 py-3">{item.uploaded}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[item.status]}`}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 text-xl text-gray-700">
                  <FiMessageSquare />
                  <FiEye
                    onClick={() => openModal(item)}
                    className="cursor-pointer hover:text-black"
                  />
                  {editRowId === item.sno ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="text-green-600 text-xs"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditRowId(null)}
                        className="text-yellow-600 text-xs"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <BsThreeDotsVertical
                        className="cursor-pointer"
                        onClick={() => handleEditClick(item)}
                      />
                      <button
                        onClick={() => handleDelete(item.sno)}
                        className="text-red-600 text-xs"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end gap-4">
        <Button
          variant="custom"
          className="bg-red-700 text-white px-4 py-1 rounded text-sm font-bold"
        >
          + Add Folder
        </Button>
        <Button
          variant="custom"
          onClick={() => setShowAddModal(true)}
          className="bg-red-700 text-white px-4 py-1 rounded text-sm font-bold"
        >
          + Add File
        </Button>
      </div>

      <DesignPreviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={selectedFile}
        type="2d"
      />

      <AddDesignModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddFile}
      />
    </div>
  );
}

export default TwoDLayouts;

// import React, { useState } from "react";
// import { FiEye, FiMessageSquare } from "react-icons/fi";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import SearchBar from "../../../components/SearchBar";
// import DropDown from "../../../components/DropDown";
// import Button from "../../../components/Button";
// import { FaSearch } from "react-icons/fa";
// import DesignPreviewModal from "./DesignPreviewModal";
// import designData from "./DesignData";
// import AddDesignModal from "./AddDesignModal";

// const statusColors = {
//   Approved: "bg-green-200 text-green-700",
//   Rejected: "bg-red-200 text-red-700",
//   Draft: "bg-yellow-200 text-yellow-700",
//   Review: "bg-blue-200 text-blue-700",
// };

// const fileTypes = ["Flooring", "Electrical", "Plumbing"];
// const statuses = ["Approved", "Rejected", "Draft", "Review"];
// const versions = ["V1", "V2", "V3", "V4"];

// function TwoDLayouts() {
//   const [filters, setFilters] = useState({
//     name: "",
//     area: "",
//     type: "",
//     version: "",
//     assigned: "",
//     uploaded: "",
//     status: "",
//   });

//   const [selectedFile, setSelectedFile] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [localData, setLocalData] = useState(designData); // ✅ store data locally

//   const handleChange = (field) => (e) =>
//     setFilters((prev) => ({ ...prev, [field]: e.target.value }));

//   const filteredData = localData.filter((item) => {
//     const match = (value, filter) =>
//       value.toLowerCase().includes(filter.toLowerCase());
//     return (
//       match(item.name, filters.name) &&
//       match(item.area, filters.area) &&
//       (!filters.type || item.fileTypes.includes(filters.type)) &&
//       (!filters.version || item.versions.includes(filters.version)) &&
//       match(item.assigned.name, filters.assigned) &&
//       match(item.uploaded, filters.uploaded) &&
//       (!filters.status || item.status === filters.status)
//     );
//   });

//   const openModal = (file) => {
//     setSelectedFile(file);
//     setModalOpen(true);
//   };

//   const handleAddFile = (newItem) => {
//     setLocalData((prev) => [...prev, newItem]);
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full text-sm font-medium text-gray-800 border-collapse">
//         <thead>
//           <tr className="bg-gray-100 text-black text-[14px]">
//             <th className="px-4 py-3 text-left w-[4%]">S.no</th>
//             <th className="px-4 py-3 text-left w-[20%]">Name of File</th>
//             <th className="px-4 py-3 text-left w-[10%]">Area</th>
//             <th className="px-4 py-3 text-left w-[15%]">File Type</th>
//             <th className="px-4 py-3 text-left w-[15%]">Version</th>
//             <th className="px-4 py-3 text-left w-[15%]">Assigned to</th>
//             <th className="px-4 py-3 text-left w-[15%]">Uploaded On</th>
//             <th className="px-4 py-3 text-left w-[10%]">Status</th>
//             <th className="px-4 py-3 text-left w-[6%]"></th>
//           </tr>

//           <tr className="bg-white border-b">
//             <td className="px-4 py-2">
//               <FaSearch className="text-gray-500" />
//             </td>
//             <td className="px-4 py-2">
//               <SearchBar value={filters.name} onChange={handleChange("name")} />
//             </td>
//             <td className="px-4 py-2">
//               <SearchBar value={filters.area} onChange={handleChange("area")} />
//             </td>
//             <td className="px-4 py-2">
//               <DropDown
//                 name="type"
//                 value={filters.type}
//                 onChange={handleChange("type")}
//                 options={fileTypes}
//               />
//             </td>
//             <td className="px-4 py-2">
//               <DropDown
//                 name="version"
//                 value={filters.version}
//                 onChange={handleChange("version")}
//                 options={versions}
//               />
//             </td>
//             <td className="px-4 py-2">
//               <SearchBar
//                 value={filters.assigned}
//                 onChange={handleChange("assigned")}
//               />
//             </td>
//             <td className="px-4 py-2">
//               <SearchBar
//                 value={filters.uploaded}
//                 onChange={handleChange("uploaded")}
//               />
//             </td>
//             <td className="px-4 py-2">
//               <DropDown
//                 name="status"
//                 value={filters.status}
//                 onChange={handleChange("status")}
//                 options={statuses}
//               />
//             </td>
//             <td></td>
//           </tr>
//         </thead>

//         <tbody>
//           {filteredData.map((item, i) => (
//             <tr key={i} className="border-b hover:bg-gray-50 align-top">
//               <td className="px-4 py-3">{item.sno}</td>
//               <td className="px-4 py-3">{item.name}</td>
//               <td className="px-4 py-3">{item.area}</td>
//               <td className="px-4 py-3">
//                 <div className="flex gap-2 flex-wrap">
//                   {item.fileTypes.map((f, idx) => (
//                     <span
//                       key={idx}
//                       className="border border-black rounded-full px-2 py-0.5 text-xs font-semibold"
//                     >
//                       {f}
//                     </span>
//                   ))}
//                 </div>
//               </td>
//               <td className="px-4 py-3">
//                 <div className="flex gap-1 flex-wrap">
//                   {item.versions.map((v, idx) => (
//                     <span
//                       key={v.label || v} // support both object or string
//                       className="bg-red-700 text-white px-2 py-0.5 text-xs rounded-full"
//                       style={{ opacity: 1 - idx * 0.2 }}
//                     >
//                       {v.label || v}
//                     </span>
//                   ))}
//                 </div>
//               </td>
//               <td className="px-4 py-3 flex items-center gap-2">
//                 <div
//                   className={`w-6 h-6 rounded-full text-white text-xs font-bold ${item.assigned.color} flex items-center justify-center`}
//                 >
//                   {item.assigned.name[0]}
//                 </div>
//                 <span>{item.assigned.name}</span>
//               </td>
//               <td className="px-4 py-3">{item.uploaded}</td>
//               <td className="px-4 py-3">
//                 <span
//                   className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                     statusColors[item.status]
//                   }`}
//                 >
//                   {item.status}
//                 </span>
//               </td>
//               <td className="px-4 py-3">
//                 <div className="flex items-center gap-3 text-xl text-gray-700">
//                   <FiMessageSquare />
//                   <FiEye
//                     onClick={() => openModal(item)}
//                     className="cursor-pointer hover:text-black"
//                   />
//                   <BsThreeDotsVertical />
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Bottom Buttons */}
//       <div className="mt-4 flex justify-end gap-4">
//         <Button
//           variant="custom"
//           className="bg-red-700 text-white px-4 py-1 rounded text-sm font-bold"
//         >
//           + Add Folder
//         </Button>
//         <Button
//           variant="custom"
//           onClick={() => setShowAddModal(true)} // ✅ ensures modal opens
//           className="bg-red-700 text-white px-4 py-1 rounded text-sm font-bold"
//         >
//           + Add File
//         </Button>
//       </div>

//       <DesignPreviewModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         data={selectedFile}
//         type="2d"
//       />

//       <AddDesignModal
//         isOpen={showAddModal}
//         onClose={() => setShowAddModal(false)}
//         onAdd={handleAddFile}
//       />
//     </div>
//   );
// }

// export default TwoDLayouts;
