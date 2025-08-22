
import React, { useEffect, useState } from "react";
import { FiEye, FiMessageSquare } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import SearchBar from "../../../components/SearchBar";
import DropDown from "../../../components/DropDown";
import Button from "../../../components/Button";
import DesignPreviewModal from "./DesignPreviewModal";
// import designData from "./DesignData";
import AddDesignModal from "./AddDesignModal";
import { toast } from "react-toastify";
import { formatDate } from "../../../utils/dateFormatter";
import {
  fetchLayouts,
  patchLayout,
  updateLayout,
  deleteLayout,
} from "../../../services/twoDServices";
import { fetchArchitects } from "../../../services/leadServices";

const statusColors = {
  Approved: "bg-green-200 text-green-700",
  Rejected: "bg-red-200 text-red-700",
  Draft: "bg-yellow-200 text-yellow-700",
  Review: "bg-blue-200 text-blue-700",
};

const fileTypes = ["Flooring", "Electrical", "Plumbing"];
const statuses = ["Approved", "Rejected", "Draft", "Review"];
const versions = ["V1", "V2", "V3", "V4"];

function TwoDLayouts({ projectId }) {
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
  // const [localData, setLocalData] = useState(designData);
  const [layouts, setLayouts] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [newVersionFile, setNewVersionFile] = useState(null);
  const [assignees, setAssignees] = useState([]); // <-- Add this line
  useEffect(() => {
    const loadArchitects = async () => {
      try {
        const data = await fetchArchitects();
        // Assign a color randomly (or based on yellow hues)
        const colors = [
          "bg-yellow-400",
          "bg-yellow-500",
          "bg-yellow-600",
          "bg-yellow-700",
          "bg-yellow-800",
        ];
        const dataWithColors = data.map((a) => ({
          ...a,
          color: colors[Math.floor(Math.random() * colors.length)],
        }));
        setAssignees(dataWithColors);
      } catch (err) {
        console.error("Failed to fetch architects:", err);
      }
    };
    loadArchitects();
  }, []);

  // Fetch layouts from API on mount or when projectId changes
  useEffect(() => {
    const loadLayouts = async () => {
      try {
        const data = await fetchLayouts(projectId);
        console.log("projectId is found", projectId);
        // Ensure each item has a unique `sno` for table rendering
        const dataWithSno = data.map((item, index) => ({
          ...item,
          sno: index + 1,
        }));
        setLayouts(dataWithSno);
      } catch (err) {
        console.error("Failed to fetch layouts:", err);
      }
    };
    loadLayouts();
  }, [projectId]);

  const handleChange = (field) => (e) =>
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));

  const filteredData = layouts.filter((item) => {
    const match = (value = "", filter = "") =>
      value?.toLowerCase?.().includes(filter?.toLowerCase?.());

    const matchVersion =
      !filters.version ||
      (item.versions || []).some((v) => v.label === filters.version);

    return (
      match(item.name, filters.name) &&
      match(item.area, filters.area) &&
      (!filters.type || (item.fileTypes || []).includes(filters.type)) &&
      matchVersion &&
      match(item.assigned?.name, filters.assigned) &&
      match(item.uploaded, filters.uploaded) &&
      (!filters.status || item.status === filters.status)
    );
  });

  const openModal = (file) => {
    setSelectedFile(file);
    setModalOpen(true);
  };

  const handleAddFile = (newItem) => {
    setLayouts((prev) => [...prev, newItem]);
    setShowAddModal(false);
  };

  const handleEditClick = (item) => {
    setEditRowId(item.sno);
    setEditValues({ ...item });
    setNewVersionFile(null);
  };

  const handleEditChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleFileType = (type) => {
    setEditValues((prev) => {
      let updated = (prev.fileTypes || []).includes(type)
        ? prev.fileTypes.filter((t) => t !== type)
        : [...(prev.fileTypes || []), type];
      return { ...prev, fileTypes: updated };
    });
  };
 const handleSave = async () => {
  try {
    if (!editValues._id) throw new Error("Layout ID missing");

    // Prepare FormData
    const formData = new FormData();
    formData.append("name", editValues.name);
    formData.append("area", editValues.area);
    formData.append("status", editValues.status || "Draft");

    // Append file if a new version is uploaded
    if (newVersionFile) {
      formData.append("file", newVersionFile); // actual file sent to backend
    }

    // Call backend PATCH endpoint
    const updatedLayout = await patchLayout(editValues._id, formData);

    // Update state
    setLayouts((prev) =>
      prev.map((item) =>
        item.sno === editRowId ? { ...updatedLayout, sno: item.sno } : item
      )
    );

    toast.success("Layout updated successfully!");
    setEditRowId(null);
    setEditValues({});
    setNewVersionFile(null);
  } catch (err) {
    console.error(err);
    toast.error("Failed to update layout.");
  }
};

  const handleDelete = async (sno, layoutId) => {
    try {
      await deleteLayout(layoutId);
      setLayouts((prev) => prev.filter((item) => item.sno !== sno));
      if (editRowId === sno) setEditRowId(null);

      toast.success("Layout deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete layout.");
    }
  };

  return (
    <div className="overflow-x-auto">
      {/* ✅ TABLE for md+ screens */}
      <table className="hidden md:table w-full text-sm font-medium text-gray-800 border-collapse">
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

          {/* Filters Row */}
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

              {/* Editable File Types */}
              <td className="px-4 py-3">
                {editRowId === item.sno ? (
                  <div className="flex gap-2 flex-wrap">
                    {fileTypes.map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-1 text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={(editValues.fileTypes || []).includes(type)}
                          onChange={() => handleToggleFileType(type)}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {(item.fileTypes || []).map((f, idx) => (
                      <span
                        key={idx}
                        className="border border-black rounded-full px-2 py-0.5 text-xs font-semibold"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </td>

              {/* Versions */}
              <td className="px-4 py-3">
                {editRowId === item.sno ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-1 flex-wrap">
                      {(editValues.versions || []).map((v, idx) => (
                        <span
                          key={idx}
                          className="bg-red-700 text-white px-2 py-0.5 text-xs rounded-full"
                          style={{ opacity: 1 - idx * 0.2 }}
                        >
                          {v.label}
                        </span>
                      ))}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewVersionFile(e.target.files[0])}
                      className="text-xs"
                    />
                    {newVersionFile && (
                      <p className="text-xs text-gray-600">
                        New version ready to upload: {newVersionFile.name}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-1 flex-wrap">
                    {(item.versions || []).map((v, idx) => (
                      <span
                        key={v.label || v}
                        className="bg-red-700 text-white px-2 py-0.5 text-xs rounded-full"
                        style={{ opacity: 1 - idx * 0.2 }}
                      >
                        {v.label || v}
                      </span>
                    ))}
                  </div>
                )}
              </td>

              {/* Assigned */}
              <td className="px-4 py-3 flex items-center gap-2">
                {editRowId === item.sno ? (
                  <select
                    value={editValues.assigned?.name || ""}
                    onChange={(e) => {
                      const person = assignees.find(
                        (a) => a.name === e.target.value
                      );
                      handleEditChange("assigned", person);
                    }}
                    className="border px-2 py-1 rounded text-sm"
                  >
                    <option value="">Select Architect</option>
                    {assignees.map((a) => (
                      <option key={a._id} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    <div
                      className={`w-6 h-6 rounded-full text-white text-xs font-bold ${item.assigned?.color} flex items-center justify-center`}
                    >
                      {item.assigned?.name?.[0]}
                    </div>
                    <span>{item.assigned?.name}</span>
                  </>
                )}
              </td>

              <td className="px-4 py-3">{formatDate(item.uploaded)}</td>

              {/* Status */}
              <td className="px-4 py-3">
                {editRowId === item.sno ? (
                  <select
                    value={editValues.status}
                    onChange={(e) => handleEditChange("status", e.target.value)}
                    className="border px-2 py-1 rounded text-sm"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[item.status]
                    }`}
                  >
                    {item.status}
                  </span>
                )}
              </td>

              {/* Actions */}
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
                        onClick={() => handleDelete(item.sno, item._id)}
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

      {/* ✅ CARD layout for small screens */}
      {/* CARD layout for small screens */}
      <div className="block md:hidden space-y-4">
        {filteredData.map((item) => (
          <div
            key={item.sno}
            className="bg-white p-4 rounded-lg shadow border text-sm"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              {editRowId === item.sno ? (
                <input
                  value={editValues.name}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
              ) : (
                <h3 className="font-bold">{item.name}</h3>
              )}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  statusColors[item.status]
                }`}
              >
                {item.status}
              </span>
            </div>

            {/* Body */}
            {editRowId === item.sno ? (
              <>
                <div className="mb-2">
                  <span className="font-semibold">Area: </span>
                  <input
                    value={editValues.area}
                    onChange={(e) => handleEditChange("area", e.target.value)}
                    className="border px-2 py-1 rounded w-full text-sm"
                  />
                </div>

                {/* File Types */}
                <div className="mb-2">
                  <span className="font-semibold">File Types: </span>
                  <div className="flex gap-2 flex-wrap">
                    {fileTypes.map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-1 text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={(editValues.fileTypes || []).includes(type)}
                          onChange={() => handleToggleFileType(type)}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Versions */}
                <div className="mb-2">
                  <span className="font-semibold">Versions: </span>
                  <div className="flex gap-1 flex-wrap">
                    {(editValues.versions || []).map((v, idx) => (
                      <span
                        key={idx}
                        className="bg-red-700 text-white px-2 py-0.5 text-xs rounded-full"
                        style={{ opacity: 1 - idx * 0.2 }}
                      >
                        {v.label}
                      </span>
                    ))}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewVersionFile(e.target.files[0])}
                    className="text-xs mt-1"
                  />
                </div>

                {/* Assigned */}
                <div className="mb-2">
                  <span className="font-semibold">Assigned: </span>
                  <select
                    value={editValues.assigned?.name || ""}
                    onChange={(e) => {
                      const person = assignees.find(
                        (a) => a.name === e.target.value
                      );
                      handleEditChange("assigned", person);
                    }}
                    className="border px-2 py-1 rounded text-sm w-full"
                  >
                    <option value="">Select Architect</option>
                    {assignees.map((a) => (
                      <option key={a._id} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="mb-2">
                  <span className="font-semibold">Status: </span>
                  <select
                    value={editValues.status}
                    onChange={(e) => handleEditChange("status", e.target.value)}
                    className="border px-2 py-1 rounded text-sm w-full"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <p>
                  <span className="font-semibold">Area:</span> {item.area}
                </p>
                <p>
                  <span className="font-semibold">File Types:</span>{" "}
                  {(item.fileTypes || []).join(", ")}
                </p>
                <p>
                  <span className="font-semibold">Versions:</span>{" "}
                  {(item.versions || []).map((v) => v.label || v).join(", ")}
                </p>
                <p>
                  <span className="font-semibold">Assigned:</span>{" "}
                  {item.assigned?.name}
                </p>
                <p>
                  <span className="font-semibold">Uploaded:</span>{" "}
                  {item.uploaded}
                </p>
              </>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-3 text-lg text-gray-700 items-center">
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
                    onClick={() => handleDelete(item.sno, item._id)}
                    className="text-red-600 text-xs"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

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

      {/* Modals */}
      <DesignPreviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={selectedFile}
        type="2d"
      />

      <AddDesignModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddFile}
        projectId={projectId}
      />
    </div>
  );
}

export default TwoDLayouts;

// import React, { useEffect, useState } from "react";
// import { FiEye, FiMessageSquare } from "react-icons/fi";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { FaSearch } from "react-icons/fa";
// import SearchBar from "../../../components/SearchBar";
// import DropDown from "../../../components/DropDown";
// import Button from "../../../components/Button";
// import DesignPreviewModal from "./DesignPreviewModal";
// // import designData from "./DesignData";
// import AddDesignModal from "./AddDesignModal";
// import { toast } from "react-toastify";
// import { formatDate } from "../../../utils/dateFormatter";
// import {
//   fetchLayouts,
//   updateLayout,
//   deleteLayout,
// } from "../../../services/twoDServices";
// import { fetchArchitects } from "../../../services/leadServices";

// const statusColors = {
//   Approved: "bg-green-200 text-green-700",
//   Rejected: "bg-red-200 text-red-700",
//   Draft: "bg-yellow-200 text-yellow-700",
//   Review: "bg-blue-200 text-blue-700",
// };

// const fileTypes = ["Flooring", "Electrical", "Plumbing"];
// const statuses = ["Approved", "Rejected", "Draft", "Review"];
// const versions = ["V1", "V2", "V3", "V4"];

// function TwoDLayouts({ projectId }) {
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
//   // const [localData, setLocalData] = useState(designData);
//   const [layouts, setLayouts] = useState([]);
//   const [editRowId, setEditRowId] = useState(null);
//   const [editValues, setEditValues] = useState({});
//   const [newVersionFile, setNewVersionFile] = useState(null);
//   const [assignees, setAssignees] = useState([]); // <-- Add this line
//   useEffect(() => {
//     const loadArchitects = async () => {
//       try {
//         const data = await fetchArchitects();
//         // Assign a color randomly (or based on yellow hues)
//         const colors = [
//           "bg-yellow-400",
//           "bg-yellow-500",
//           "bg-yellow-600",
//           "bg-yellow-700",
//           "bg-yellow-800",
//         ];
//         const dataWithColors = data.map((a) => ({
//           ...a,
//           color: colors[Math.floor(Math.random() * colors.length)],
//         }));
//         setAssignees(dataWithColors);
//       } catch (err) {
//         console.error("Failed to fetch architects:", err);
//       }
//     };
//     loadArchitects();
//   }, []);

//   // Fetch layouts from API on mount or when projectId changes
//   useEffect(() => {
//     const loadLayouts = async () => {
//       try {
//         const data = await fetchLayouts(projectId);
//         console.log("projectId is found", projectId);
//         // Ensure each item has a unique `sno` for table rendering
//         const dataWithSno = data.map((item, index) => ({
//           ...item,
//           sno: index + 1,
//         }));
//         setLayouts(dataWithSno);
//       } catch (err) {
//         console.error("Failed to fetch layouts:", err);
//       }
//     };
//     loadLayouts();
//   }, [projectId]);

//   const handleChange = (field) => (e) =>
//     setFilters((prev) => ({ ...prev, [field]: e.target.value }));

//   const filteredData = layouts.filter((item) => {
//     const match = (value = "", filter = "") =>
//       value?.toLowerCase?.().includes(filter?.toLowerCase?.());

//     const matchVersion =
//       !filters.version ||
//       (item.versions || []).some((v) => v.label === filters.version);

//     return (
//       match(item.name, filters.name) &&
//       match(item.area, filters.area) &&
//       (!filters.type || (item.fileTypes || []).includes(filters.type)) &&
//       matchVersion &&
//       match(item.assigned?.name, filters.assigned) &&
//       match(item.uploaded, filters.uploaded) &&
//       (!filters.status || item.status === filters.status)
//     );
//   });

//   const openModal = (file) => {
//     setSelectedFile(file);
//     setModalOpen(true);
//   };

//   const handleAddFile = (newItem) => {
//     setLayouts((prev) => [...prev, newItem]);
//     setShowAddModal(false);
//   };

//   const handleEditClick = (item) => {
//     setEditRowId(item.sno);
//     setEditValues({ ...item });
//     setNewVersionFile(null);
//   };

//   const handleEditChange = (field, value) => {
//     setEditValues((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleToggleFileType = (type) => {
//     setEditValues((prev) => {
//       let updated = (prev.fileTypes || []).includes(type)
//         ? prev.fileTypes.filter((t) => t !== type)
//         : [...(prev.fileTypes || []), type];
//       return { ...prev, fileTypes: updated };
//     });
//   };
//   const handleSave = async () => {
//     try {
//       let updatedItem = { ...editValues };

//       // Append new version if uploaded
//       if (newVersionFile) {
//         const newLabel = `V${(editValues.versions?.length || 0) + 1}`;
//         const newVersion = {
//           label: newLabel,
//           image: URL.createObjectURL(newVersionFile),
//         };
//         updatedItem.versions = [...(editValues.versions || []), newVersion];
//       }

//       await updateLayout(editValues._id, updatedItem); // Use MongoDB _id
//       setLayouts((prev) =>
//         prev.map((item) =>
//           item.sno === editRowId ? { ...updatedItem, sno: item.sno } : item
//         )
//       );

//       toast.success("Layout updated successfully!");
//       setEditRowId(null);
//       setEditValues({});
//       setNewVersionFile(null);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update layout.");
//     }
//   };

//   const handleDelete = async (sno, layoutId) => {
//     try {
//       await deleteLayout(layoutId);
//       setLayouts((prev) => prev.filter((item) => item.sno !== sno));
//       if (editRowId === sno) setEditRowId(null);

//       toast.success("Layout deleted successfully!");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete layout.");
//     }
//   };

//   return (
//     <div className="overflow-x-auto">
//       {/* ✅ TABLE for md+ screens */}
//       <table className="hidden md:table w-full text-sm font-medium text-gray-800 border-collapse">
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

//           {/* Filters Row */}
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
//           {filteredData.map((item) => (
//             <tr key={item.sno} className="border-b hover:bg-gray-50 align-top">
//               <td className="px-4 py-3">{item.sno}</td>
//               <td className="px-4 py-3">
//                 {editRowId === item.sno ? (
//                   <input
//                     value={editValues.name}
//                     onChange={(e) => handleEditChange("name", e.target.value)}
//                     className="border px-2 py-1 rounded w-full"
//                   />
//                 ) : (
//                   item.name
//                 )}
//               </td>
//               <td className="px-4 py-3">
//                 {editRowId === item.sno ? (
//                   <input
//                     value={editValues.area}
//                     onChange={(e) => handleEditChange("area", e.target.value)}
//                     className="border px-2 py-1 rounded w-full"
//                   />
//                 ) : (
//                   item.area
//                 )}
//               </td>

//               {/* Editable File Types */}
//               <td className="px-4 py-3">
//                 {editRowId === item.sno ? (
//                   <div className="flex gap-2 flex-wrap">
//                     {fileTypes.map((type) => (
//                       <label
//                         key={type}
//                         className="flex items-center gap-1 text-xs"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={(editValues.fileTypes || []).includes(type)}
//                           onChange={() => handleToggleFileType(type)}
//                         />
//                         {type}
//                       </label>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="flex gap-2 flex-wrap">
//                     {(item.fileTypes || []).map((f, idx) => (
//                       <span
//                         key={idx}
//                         className="border border-black rounded-full px-2 py-0.5 text-xs font-semibold"
//                       >
//                         {f}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//               </td>

//               {/* Versions */}
//               <td className="px-4 py-3">
//                 {editRowId === item.sno ? (
//                   <div className="flex flex-col gap-2">
//                     <div className="flex gap-1 flex-wrap">
//                       {(editValues.versions || []).map((v, idx) => (
//                         <span
//                           key={idx}
//                           className="bg-red-700 text-white px-2 py-0.5 text-xs rounded-full"
//                           style={{ opacity: 1 - idx * 0.2 }}
//                         >
//                           {v.label}
//                         </span>
//                       ))}
//                     </div>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => setNewVersionFile(e.target.files[0])}
//                       className="text-xs"
//                     />
//                     {newVersionFile && (
//                       <p className="text-xs text-gray-600">
//                         New version ready to upload: {newVersionFile.name}
//                       </p>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="flex gap-1 flex-wrap">
//                     {(item.versions || []).map((v, idx) => (
//                       <span
//                         key={v.label || v}
//                         className="bg-red-700 text-white px-2 py-0.5 text-xs rounded-full"
//                         style={{ opacity: 1 - idx * 0.2 }}
//                       >
//                         {v.label || v}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//               </td>

//               {/* Assigned */}
//               <td className="px-4 py-3 flex items-center gap-2">
//                 {editRowId === item.sno ? (
//                   <select
//                     value={editValues.assigned?.name || ""}
//                     onChange={(e) => {
//                       const person = assignees.find(
//                         (a) => a.name === e.target.value
//                       );
//                       handleEditChange("assigned", person);
//                     }}
//                     className="border px-2 py-1 rounded text-sm"
//                   >
//                     <option value="">Select Architect</option>
//                     {assignees.map((a) => (
//                       <option key={a._id} value={a.name}>
//                         {a.name}
//                       </option>
//                     ))}
//                   </select>
//                 ) : (
//                   <>
//                     <div
//                       className={`w-6 h-6 rounded-full text-white text-xs font-bold ${item.assigned?.color} flex items-center justify-center`}
//                     >
//                       {item.assigned?.name?.[0]}
//                     </div>
//                     <span>{item.assigned?.name}</span>
//                   </>
//                 )}
//               </td>

//               <td className="px-4 py-3">{formatDate(item.uploaded)}</td>

//               {/* Status */}
//               <td className="px-4 py-3">
//                 {editRowId === item.sno ? (
//                   <select
//                     value={editValues.status}
//                     onChange={(e) => handleEditChange("status", e.target.value)}
//                     className="border px-2 py-1 rounded text-sm"
//                   >
//                     {statuses.map((s) => (
//                       <option key={s} value={s}>
//                         {s}
//                       </option>
//                     ))}
//                   </select>
//                 ) : (
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                       statusColors[item.status]
//                     }`}
//                   >
//                     {item.status}
//                   </span>
//                 )}
//               </td>

//               {/* Actions */}
//               <td className="px-4 py-3">
//                 <div className="flex items-center gap-2 text-xl text-gray-700">
//                   <FiMessageSquare />
//                   <FiEye
//                     onClick={() => openModal(item)}
//                     className="cursor-pointer hover:text-black"
//                   />
//                   {editRowId === item.sno ? (
//                     <>
//                       <button
//                         onClick={handleSave}
//                         className="text-green-600 text-xs"
//                       >
//                         Save
//                       </button>
//                       <button
//                         onClick={() => setEditRowId(null)}
//                         className="text-yellow-600 text-xs"
//                       >
//                         Cancel
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <BsThreeDotsVertical
//                         className="cursor-pointer"
//                         onClick={() => handleEditClick(item)}
//                       />
//                       <button
//                         onClick={() => handleDelete(item.sno, item._id)}
//                         className="text-red-600 text-xs"
//                       >
//                         Delete
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* ✅ CARD layout for small screens */}
//       {/* CARD layout for small screens */}
//       <div className="block md:hidden space-y-4">
//         {filteredData.map((item) => (
//           <div
//             key={item.sno}
//             className="bg-white p-4 rounded-lg shadow border text-sm"
//           >
//             {/* Header */}
//             <div className="flex justify-between items-center mb-2">
//               {editRowId === item.sno ? (
//                 <input
//                   value={editValues.name}
//                   onChange={(e) => handleEditChange("name", e.target.value)}
//                   className="border px-2 py-1 rounded w-full"
//                 />
//               ) : (
//                 <h3 className="font-bold">{item.name}</h3>
//               )}
//               <span
//                 className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
//                   statusColors[item.status]
//                 }`}
//               >
//                 {item.status}
//               </span>
//             </div>

//             {/* Body */}
//             {editRowId === item.sno ? (
//               <>
//                 <div className="mb-2">
//                   <span className="font-semibold">Area: </span>
//                   <input
//                     value={editValues.area}
//                     onChange={(e) => handleEditChange("area", e.target.value)}
//                     className="border px-2 py-1 rounded w-full text-sm"
//                   />
//                 </div>

//                 {/* File Types */}
//                 <div className="mb-2">
//                   <span className="font-semibold">File Types: </span>
//                   <div className="flex gap-2 flex-wrap">
//                     {fileTypes.map((type) => (
//                       <label
//                         key={type}
//                         className="flex items-center gap-1 text-xs"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={(editValues.fileTypes || []).includes(type)}
//                           onChange={() => handleToggleFileType(type)}
//                         />
//                         {type}
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Versions */}
//                 <div className="mb-2">
//                   <span className="font-semibold">Versions: </span>
//                   <div className="flex gap-1 flex-wrap">
//                     {(editValues.versions || []).map((v, idx) => (
//                       <span
//                         key={idx}
//                         className="bg-red-700 text-white px-2 py-0.5 text-xs rounded-full"
//                         style={{ opacity: 1 - idx * 0.2 }}
//                       >
//                         {v.label}
//                       </span>
//                     ))}
//                   </div>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setNewVersionFile(e.target.files[0])}
//                     className="text-xs mt-1"
//                   />
//                 </div>

//                 {/* Assigned */}
//                 <div className="mb-2">
//                   <span className="font-semibold">Assigned: </span>
//                   <select
//                     value={editValues.assigned?.name || ""}
//                     onChange={(e) => {
//                       const person = assignees.find(
//                         (a) => a.name === e.target.value
//                       );
//                       handleEditChange("assigned", person);
//                     }}
//                     className="border px-2 py-1 rounded text-sm w-full"
//                   >
//                     <option value="">Select Architect</option>
//                     {assignees.map((a) => (
//                       <option key={a._id} value={a.name}>
//                         {a.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Status */}
//                 <div className="mb-2">
//                   <span className="font-semibold">Status: </span>
//                   <select
//                     value={editValues.status}
//                     onChange={(e) => handleEditChange("status", e.target.value)}
//                     className="border px-2 py-1 rounded text-sm w-full"
//                   >
//                     {statuses.map((s) => (
//                       <option key={s} value={s}>
//                         {s}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <p>
//                   <span className="font-semibold">Area:</span> {item.area}
//                 </p>
//                 <p>
//                   <span className="font-semibold">File Types:</span>{" "}
//                   {(item.fileTypes || []).join(", ")}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Versions:</span>{" "}
//                   {(item.versions || []).map((v) => v.label || v).join(", ")}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Assigned:</span>{" "}
//                   {item.assigned?.name}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Uploaded:</span>{" "}
//                   {item.uploaded}
//                 </p>
//               </>
//             )}

//             {/* Actions */}
//             <div className="flex gap-3 mt-3 text-lg text-gray-700 items-center">
//               <FiMessageSquare />
//               <FiEye
//                 onClick={() => openModal(item)}
//                 className="cursor-pointer hover:text-black"
//               />

//               {editRowId === item.sno ? (
//                 <>
//                   <button
//                     onClick={handleSave}
//                     className="text-green-600 text-xs"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={() => setEditRowId(null)}
//                     className="text-yellow-600 text-xs"
//                   >
//                     Cancel
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <BsThreeDotsVertical
//                     className="cursor-pointer"
//                     onClick={() => handleEditClick(item)}
//                   />
//                   <button
//                     onClick={() => handleDelete(item.sno, item._id)}
//                     className="text-red-600 text-xs"
//                   >
//                     Delete
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-4 flex justify-end gap-4">
//         <Button
//           variant="custom"
//           className="bg-red-700 text-white px-4 py-1 rounded text-sm font-bold"
//         >
//           + Add Folder
//         </Button>
//         <Button
//           variant="custom"
//           onClick={() => setShowAddModal(true)}
//           className="bg-red-700 text-white px-4 py-1 rounded text-sm font-bold"
//         >
//           + Add File
//         </Button>
//       </div>

//       {/* Modals */}
//       <DesignPreviewModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         data={selectedFile}
//         type="2d"
//       />

//       <AddDesignModal
//         isOpen={showAddModal}
//         onClose={() => setShowAddModal(false)}
//         onSave={handleAddFile}
//         projectId={projectId}
//       />
//     </div>
//   );
// }

// export default TwoDLayouts;

