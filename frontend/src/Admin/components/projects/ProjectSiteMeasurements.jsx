import React, { useState, useEffect } from "react";
import { FiEdit2, FiPlus } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import AddRoomModal from "./SiteMeasurements/AddRoomModal";
import {
  fetchSiteMeasurementsByProject,
  createSiteMeasurement,
  updateSiteMeasurement,
  deleteSiteMeasurement,
} from "../../../services/siteMeasurementServices";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

const ProjectSiteMeasurements = ({ projectId }) => {
  const { user } = useAuth();
  const architectId = user?._id || user?.id || null;

  const [expandedRow, setExpandedRow] = useState(null);
  const [spaceList, setSpaceList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [unit, setUnit] = useState("ft"); // default unit
  const [loading, setLoading] = useState(false);

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

  // Calculate perimeter, floor area, and wall area
  const calculateValues = (space) => {
    const { length = 0, breadth = 0, height = 0, openings = [] } = space || {};
    const perimeter = 2 * (Number(length) + Number(breadth));
    const floorArea = Number(length) * Number(breadth);
    const openingsArea = Array.isArray(openings)
      ? openings.reduce(
          (sum, op) => sum + Number(op.height || 0) * Number(op.width || 0),
          0
        )
      : 0;
    const wallArea =
      2 * (Number(length) + Number(breadth)) * Number(height) - openingsArea;
    return { perimeter, floorArea, wallArea };
  };

  // Convert units (ft <-> m) for display when needed
  const convertValue = (value) => {
    if (value === null || value === undefined || value === "") return value;
    const num = Number(value);
    if (Number.isNaN(num)) return value;
    if (unit === "m") return (num * 0.3048).toFixed(2);
    return num;
  };

  // Fetch from DB on mount or when projectId changes
  useEffect(() => {
    const loadData = async () => {
      if (!projectId) {
        setSpaceList([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetchSiteMeasurementsByProject(projectId);

        if (Array.isArray(response) && response.length > 0) {
          // take the first measurement document
          const measurementDoc = response[0];
          // get its spaces array safely
          const spaces = Array.isArray(measurementDoc.spaces)
            ? measurementDoc.spaces
            : [];
          // calculate values for each space if not custom
          const updatedSpaces = spaces.map((space) => ({
            ...space,
            ...(!space.custom ? calculateValues(space) : {}),
          }));

          setSpaceList(updatedSpaces);
          toast.success("Site measurements loaded");
        } else {
          setSpaceList([]);
          toast.info("No site measurements found");
        }
      } catch (err) {
        console.error("Error fetching site measurements:", err);
        toast.error("Failed to load site measurements");
        setSpaceList([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId]);
  // Add a new room (calculate values, include projectId & architectId)
  //eslint-disable-next-line
  const addNewRoom = async () => {
    if (!projectId) {
      toast.error("Project ID missing");
      return;
    }
    if (
      !newRoom.name ||
      !newRoom.length ||
      !newRoom.breadth ||
      !newRoom.height
    ) {
      toast.error("Please fill required fields");
      return;
    }

    const calculated = calculateValues(newRoom);
    const payload = {
      ...newRoom,
      ...calculated,
      projectId,
      architectId,
    };

    try {
      const created = await createSiteMeasurement(payload);
      // prefer server response, but if server returns minimal object, merge calculated values
      const toPush = created
        ? { ...created, ...(!created.custom ? calculateValues(created) : {}) }
        : { ...payload };
      setSpaceList((prev) => [...prev, toPush]);
      setShowModal(false);
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
      toast.success("Room created");
    } catch (err) {
      console.error("createSiteMeasurement error:", err);
      toast.error("Failed to create room");
    }
  };

  // Update a field in spaceList & persist if record has id/_id
  const updateField = async (index, field, value) => {
    const updatedList = [...spaceList];
    updatedList[index] = { ...(updatedList[index] || {}), [field]: value };

    // recalc if not custom
    if (!updatedList[index].custom) {
      const calculated = calculateValues(updatedList[index]);
      updatedList[index] = { ...updatedList[index], ...calculated };
    }

    setSpaceList(updatedList);

    // persist to server if we have an id
    const recordId = updatedList[index]._id || updatedList[index].id;
    if (!recordId) return;

    try {
      await updateSiteMeasurement(recordId, updatedList[index]);
      toast.success("Updated");
    } catch (err) {
      console.error("updateSiteMeasurement error:", err);
      toast.error("Failed to save update");
    }
  };

  // Update opening (door/window) and persist
  const updateOpening = async (spaceIndex, openingIndex, field, value) => {
    const updatedList = [...spaceList];
    const openings = Array.isArray(updatedList[spaceIndex].openings)
      ? [...updatedList[spaceIndex].openings]
      : [];
    openings[openingIndex] = {
      ...(openings[openingIndex] || {}),
      [field]: value,
    };
    updatedList[spaceIndex] = { ...updatedList[spaceIndex], openings };

    if (!updatedList[spaceIndex].custom) {
      const calculated = calculateValues(updatedList[spaceIndex]);
      updatedList[spaceIndex] = { ...updatedList[spaceIndex], ...calculated };
    }

    setSpaceList(updatedList);

    const recordId = updatedList[spaceIndex]._id || updatedList[spaceIndex].id;
    if (!recordId) return;

    try {
      await updateSiteMeasurement(recordId, updatedList[spaceIndex]);
      toast.success("Opening updated");
    } catch (err) {
      console.error("updateSiteMeasurement (opening) error:", err);
      toast.error("Failed to update opening");
    }
  };

  // Enable custom override (allows manual editing of calculated fields)
  const enableCustom = (index) => {
    const updatedList = [...spaceList];
    updatedList[index] = { ...(updatedList[index] || {}), custom: true };
    setSpaceList(updatedList);
    // Persist this change if record exists on server
    const recordId = updatedList[index]._id || updatedList[index].id;
    if (!recordId) {
      toast.info("Custom enabled locally");
      return;
    }
    updateSiteMeasurement(recordId, updatedList[index])
      .then(() => toast.info("Custom override enabled"))
      .catch((err) => {
        console.error("enableCustom save error:", err);
        toast.error("Failed to enable custom on server");
      });
  };

  // Delete a measurement (server + state)
  const handleDelete = async (space) => {
    const idToDelete = space._id || space.id;
    if (!idToDelete) {
      // local-only entry
      setSpaceList((prev) => prev.filter((s) => s !== space));
      toast.info("Removed local entry");
      return;
    }
    try {
      await deleteSiteMeasurement(idToDelete);
      setSpaceList((prev) =>
        prev.filter((s) => (s._id || s.id) !== idToDelete)
      );
      toast.success("Deleted");
    } catch (err) {
      console.error("deleteSiteMeasurement error:", err);
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="w-full px-4 bg-white p-4 md:p-8 rounded-md shadow overflow-x-auto md:m-2">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Site Measurements</h2>
        <div className="flex items-center gap-3">
          {/* Unit toggle (uses unit & setUnit so no eslint warning) */}
          <button
            onClick={() => setUnit((u) => (u === "ft" ? "m" : "ft"))}
            className="text-sm px-2 py-1 border rounded bg-red-600 text-white"
            title="Toggle unit"
          >
            {unit}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold"
          >
            <FiPlus /> Add New Room
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold">
              <th className="p-2">S.no</th>
              <th className="p-2">Space Name</th>
              <th className="p-2">Category</th>
              <th className="p-2">Length</th>
              <th className="p-2">Breadth</th>
              <th className="p-2">Height</th>
              <th className="p-2">Opening Area</th>
              <th className="p-2">Perimeter</th>
              <th className="p-2">Floor Area</th>
              <th className="p-2">Wall Area</th>
              <th className="p-2">Edit</th>
              <th className="p-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {spaceList.map((space, index) => (
              <React.Fragment key={space._id || space.id || index}>
                <tr className="hover:bg-gray-50 border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{space.name}</td>
                  <td className="p-2">{space.category}</td>
                  <td className="p-2">{space.length}</td>
                  <td className="p-2">{space.breadth}</td>
                  <td className="p-2">{space.height}</td>
                  <td className="p-2">
                    {(Array.isArray(space.openings)
                      ? space.openings
                      : []
                    ).reduce(
                      (sum, op) =>
                        sum + Number(op.height || 0) * Number(op.width || 0),
                      0
                    )}{" "}
                    sqft
                  </td>
                  <td className="p-2">{space.perimeter}</td>
                  <td className="p-2">{space.floorArea}</td>
                  <td className="p-2">{space.wallArea}</td>
                  <td className="p-2">
                    <FiEdit2
                      className="inline-block cursor-pointer text-red-600"
                      onClick={() =>
                        setExpandedRow(expandedRow === index ? null : index)
                      }
                    />
                  </td>
                  <td className="p-2">
                    <MdDelete
                      className="text-red-600 cursor-pointer"
                      onClick={() => handleDelete(space)}
                    />
                  </td>
                </tr>

                {/* Expanded Row */}
                {expandedRow === index && (
                  <tr>
                    <td colSpan="11" className="bg-white py-6 px-6">
                      <div className="grid grid-cols-[1fr_1fr_1.5fr_1fr_0.8fr] gap-6 text-sm text-red-800 w-full">
                        {/* Column 1: Name & Category */}
                        <div className="space-y-4">
                          <div>
                            <label className="font-bold block">Area Name</label>
                            <input
                              value={space.name}
                              onChange={(e) =>
                                updateField(index, "name", e.target.value)
                              }
                              className="w-full border p-2 rounded"
                            />
                          </div>
                          <div>
                            <label className="font-bold block">
                              Select Category
                            </label>
                            <select
                              value={space.category}
                              onChange={(e) =>
                                updateField(index, "category", e.target.value)
                              }
                              className="w-full border p-2 rounded"
                            >
                              {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Column 2: Dimensions */}
                        <div className="space-y-4">
                          <label className="font-bold block">Dimensions</label>
                          {["length", "breadth", "height"].map((dim) => (
                            <div key={dim} className="flex items-center gap-2">
                              <label className="font-bold min-w-[70px]">
                                {dim.charAt(0).toUpperCase() + dim.slice(1)}
                              </label>
                              <input
                                type="number"
                                value={space[dim]}
                                onChange={(e) =>
                                  updateField(index, dim, e.target.value)
                                }
                                className="w-full max-w-[180px] border p-2 rounded"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Column 3: Openings */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <label className="font-bold">Doors & Windows</label>
                            <button
                              className="bg-red-700 text-white text-xs px-2 py-1 rounded flex items-center gap-1"
                              onClick={() =>
                                updateField(index, "openings", [
                                  ...(Array.isArray(space.openings)
                                    ? space.openings
                                    : []),
                                  { type: "Door", height: 0, width: 0 },
                                ])
                              }
                            >
                              <span className="text-lg font-bold">+</span> Add
                            </button>
                          </div>

                          {(Array.isArray(space.openings)
                            ? space.openings
                            : []
                          ).map((op, opIdx) => (
                            <div
                              key={opIdx}
                              className="flex items-center flex-wrap gap-2"
                            >
                              <select
                                className="font-bold border p-1 rounded w-24"
                                value={op.type}
                                onChange={(e) =>
                                  updateOpening(
                                    index,
                                    opIdx,
                                    "type",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="Door">Door</option>
                                <option value="Window">Window</option>
                              </select>
                              <input
                                type="number"
                                className="border p-1 rounded w-16"
                                value={op.height}
                                onChange={(e) =>
                                  updateOpening(
                                    index,
                                    opIdx,
                                    "height",
                                    e.target.value
                                  )
                                }
                              />
                              <input
                                type="number"
                                className="border p-1 rounded w-16"
                                value={op.width}
                                onChange={(e) =>
                                  updateOpening(
                                    index,
                                    opIdx,
                                    "width",
                                    e.target.value
                                  )
                                }
                              />
                              <button
                                className="text-red-600 font-bold"
                                onClick={() => {
                                  // remove opening
                                  const updatedOpenings = (
                                    space.openings || []
                                  ).filter((_, i) => i !== opIdx);
                                  updateField(
                                    index,
                                    "openings",
                                    updatedOpenings
                                  );
                                }}
                              >
                                X
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Column 4: Calculated Values */}
                        <div className="space-y-4">
                          <h3 className="font-bold mb-2">Calculated Values</h3>
                          <div className="flex justify-between mb-2">
                            <span>Unit:</span>
                            <button
                              className="px-2 py-1 border rounded bg-red-600 hover:bg-red-700 cursor-pointer text-white"
                              onClick={() =>
                                setUnit((u) => (u === "ft" ? "m" : "ft"))
                              }
                            >
                              {unit}
                            </button>
                          </div>
                          {[
                            { label: "Perimeter", key: "perimeter" },
                            { label: "Floor Area", key: "floorArea" },
                            { label: "Wall Area", key: "wallArea" },
                          ].map(({ label, key }) => (
                            <div key={key}>
                              <label className="font-bold block">{label}</label>
                              <input
                                value={convertValue(space[key]) ?? ""}
                                readOnly={!space.custom}
                                onChange={(e) =>
                                  updateField(index, key, e.target.value)
                                }
                                className={`w-full border p-2 rounded ${
                                  space.custom
                                    ? "bg-white"
                                    : "bg-gray-100 cursor-not-allowed"
                                }`}
                              />
                            </div>
                          ))}
                        </div>

                        {/* Column 5: Custom Button */}
                        <div className="space-y-4">
                          <h3 className="font-bold text-red-700">
                            Override Calculations
                          </h3>
                          <button
                            className="border bg-red-600 hover:bg-red-700 text-white cursor-pointer rounded p-2 font-bold"
                            onClick={() => enableCustom(index)}
                          >
                            Custom
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Room Modal */}
      <AddRoomModal
        show={showModal}
        onClose={() => setShowModal(false)}
        categories={categories}
        projectId={projectId}
        architectId={architectId}
        calculateValues={calculateValues}
        onSave={async (payload, resetForm) => {
          try {
            const created = await createSiteMeasurement(payload);
            const toPush = created
              ? {
                  ...created,
                  ...(!created.custom ? calculateValues(created) : {}),
                }
              : { ...payload };
            setSpaceList((prev) => [...prev, toPush]);
            toast.success("Room created");
            resetForm();
            setShowModal(false);
          } catch (err) {
            console.error("createSiteMeasurement error:", err);
            toast.error("Failed to create room");
          }
        }}
      />
    </div>
  );
};

export default ProjectSiteMeasurements;

// import React, { useState, useEffect } from "react";
// import { FiEdit2, FiPlus } from "react-icons/fi";
// import { FaRegWindowClose } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import AddRoomModal from "./SiteMeasurements/AddRoomModal";
// import {
//   fetchSiteMeasurementsByProject,
//   createSiteMeasurement,
//   updateSiteMeasurement,
//   deleteSiteMeasurement,
// } from "../../../services/siteMeasurementServices";
// import { toast } from "react-toastify";
// import { useAuth } from "../../../context/AuthContext";

// const ProjectSiteMeasurements = ({ projectId }) => {
//   const { user } = useAuth(); // expects a hook that returns { user }
//   const architectId = user?._id || user?.id || null;

//   const [expandedRow, setExpandedRow] = useState(null);
//   const [spaceList, setSpaceList] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [unit, setUnit] = useState("ft"); // default unit
//   const [loading, setLoading] = useState(false);

//   const [newRoom, setNewRoom] = useState({
//     name: "",
//     category: "",
//     length: "",
//     breadth: "",
//     height: "",
//     openings: [],
//     custom: false,
//     perimeter: null,
//     floorArea: null,
//     wallArea: null,
//   });

//   const categories = [
//     "Living Room",
//     "Bedroom",
//     "Kitchen",
//     "Bathroom",
//     "Dining Room",
//     "Hall",
//     "Study Room",
//     "Balcony",
//     "Toilet",
//   ];

//   // Calculate perimeter, floor area, and wall area
//   const calculateValues = (space) => {
//     const { length = 0, breadth = 0, height = 0, openings = [] } = space || {};
//     const perimeter = 2 * (Number(length) + Number(breadth));
//     const floorArea = Number(length) * Number(breadth);
//     const openingsArea = Array.isArray(openings)
//       ? openings.reduce(
//           (sum, op) => sum + Number(op.height || 0) * Number(op.width || 0),
//           0
//         )
//       : 0;
//     const wallArea =
//       2 * (Number(length) + Number(breadth)) * Number(height) - openingsArea;
//     return { perimeter, floorArea, wallArea };
//   };

//   // Convert units (ft <-> m) for display when needed
//   const convertValue = (value) => {
//     if (value === null || value === undefined || value === "") return value;
//     const num = Number(value);
//     if (Number.isNaN(num)) return value;
//     if (unit === "m") return (num * 0.3048).toFixed(2);
//     return num;
//   };

//   // Fetch from DB on mount or when projectId changes
//   // Fetch from DB on mount or when projectId changes
//   useEffect(() => {
//     const loadData = async () => {
//       if (!projectId) {
//         setSpaceList([]);
//         return;
//       }
//       setLoading(true);
//       try {
//         const response = await fetchSiteMeasurementsByProject(projectId);

//         if (Array.isArray(response) && response.length > 0) {
//           // take the first measurement document
//           const measurementDoc = response[0];

//           // get its spaces array safely
//           const spaces = Array.isArray(measurementDoc.spaces)
//             ? measurementDoc.spaces
//             : [];

//           // calculate values for each space if not custom
//           const updatedSpaces = spaces.map((space) => ({
//             ...space,
//             ...(!space.custom ? calculateValues(space) : {}),
//           }));

//           setSpaceList(updatedSpaces);
//           toast.success("Site measurements loaded");
//         } else {
//           setSpaceList([]);
//           toast.info("No site measurements found");
//         }
//       } catch (err) {
//         console.error("Error fetching site measurements:", err);
//         toast.error("Failed to load site measurements");
//         setSpaceList([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [projectId]);
//   // Add a new room (calculate values, include projectId & architectId)
//   const addNewRoom = async () => {
//     if (!projectId) {
//       toast.error("Project ID missing");
//       return;
//     }
//     if (
//       !newRoom.name ||
//       !newRoom.length ||
//       !newRoom.breadth ||
//       !newRoom.height
//     ) {
//       toast.error("Please fill required fields");
//       return;
//     }

//     const calculated = calculateValues(newRoom);
//     const payload = {
//       ...newRoom,
//       ...calculated,
//       projectId,
//       architectId,
//     };

//     try {
//       const created = await createSiteMeasurement(payload);
//       // prefer server response, but if server returns minimal object, merge calculated values
//       const toPush = created
//         ? { ...created, ...(!created.custom ? calculateValues(created) : {}) }
//         : { ...payload };
//       setSpaceList((prev) => [...prev, toPush]);
//       setShowModal(false);
//       setNewRoom({
//         name: "",
//         category: "",
//         length: "",
//         breadth: "",
//         height: "",
//         openings: [],
//         custom: false,
//         perimeter: null,
//         floorArea: null,
//         wallArea: null,
//       });
//       toast.success("Room created");
//     } catch (err) {
//       console.error("createSiteMeasurement error:", err);
//       toast.error("Failed to create room");
//     }
//   };

//   // Update a field in spaceList & persist if record has id/_id
//   const updateField = async (index, field, value) => {
//     const updatedList = [...spaceList];
//     updatedList[index] = { ...(updatedList[index] || {}), [field]: value };

//     // recalc if not custom
//     if (!updatedList[index].custom) {
//       const calculated = calculateValues(updatedList[index]);
//       updatedList[index] = { ...updatedList[index], ...calculated };
//     }

//     setSpaceList(updatedList);

//     // persist to server if we have an id
//     const recordId = updatedList[index]._id || updatedList[index].id;
//     if (!recordId) return;

//     try {
//       await updateSiteMeasurement(recordId, updatedList[index]);
//       toast.success("Updated");
//     } catch (err) {
//       console.error("updateSiteMeasurement error:", err);
//       toast.error("Failed to save update");
//     }
//   };

//   // Update opening (door/window) and persist
//   const updateOpening = async (spaceIndex, openingIndex, field, value) => {
//     const updatedList = [...spaceList];
//     const openings = Array.isArray(updatedList[spaceIndex].openings)
//       ? [...updatedList[spaceIndex].openings]
//       : [];
//     openings[openingIndex] = {
//       ...(openings[openingIndex] || {}),
//       [field]: value,
//     };
//     updatedList[spaceIndex] = { ...updatedList[spaceIndex], openings };

//     if (!updatedList[spaceIndex].custom) {
//       const calculated = calculateValues(updatedList[spaceIndex]);
//       updatedList[spaceIndex] = { ...updatedList[spaceIndex], ...calculated };
//     }

//     setSpaceList(updatedList);

//     const recordId = updatedList[spaceIndex]._id || updatedList[spaceIndex].id;
//     if (!recordId) return;

//     try {
//       await updateSiteMeasurement(recordId, updatedList[spaceIndex]);
//       toast.success("Opening updated");
//     } catch (err) {
//       console.error("updateSiteMeasurement (opening) error:", err);
//       toast.error("Failed to update opening");
//     }
//   };

//   // Enable custom override (allows manual editing of calculated fields)
//   const enableCustom = (index) => {
//     const updatedList = [...spaceList];
//     updatedList[index] = { ...(updatedList[index] || {}), custom: true };
//     setSpaceList(updatedList);
//     // Persist this change if record exists on server
//     const recordId = updatedList[index]._id || updatedList[index].id;
//     if (!recordId) {
//       toast.info("Custom enabled locally");
//       return;
//     }
//     updateSiteMeasurement(recordId, updatedList[index])
//       .then(() => toast.info("Custom override enabled"))
//       .catch((err) => {
//         console.error("enableCustom save error:", err);
//         toast.error("Failed to enable custom on server");
//       });
//   };

//   // Delete a measurement (server + state)
//   const handleDelete = async (space) => {
//     const idToDelete = space._id || space.id;
//     if (!idToDelete) {
//       // local-only entry
//       setSpaceList((prev) => prev.filter((s) => s !== space));
//       toast.info("Removed local entry");
//       return;
//     }
//     try {
//       await deleteSiteMeasurement(idToDelete);
//       setSpaceList((prev) =>
//         prev.filter((s) => (s._id || s.id) !== idToDelete)
//       );
//       toast.success("Deleted");
//     } catch (err) {
//       console.error("deleteSiteMeasurement error:", err);
//       toast.error("Failed to delete");
//     }
//   };

//   return (
//     <div className="w-full px-4 bg-white p-4 md:p-8 rounded-md shadow overflow-x-auto md:m-2">
//       {/* Top Bar */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-bold text-gray-800">Site Measurements</h2>
//         <div className="flex items-center gap-3">
//           {/* Unit toggle (uses unit & setUnit so no eslint warning) */}
//           <button
//             onClick={() => setUnit((u) => (u === "ft" ? "m" : "ft"))}
//             className="text-sm px-2 py-1 border rounded bg-red-600 text-white"
//             title="Toggle unit"
//           >
//             {unit}
//           </button>
//           <button
//             onClick={() => setShowModal(true)}
//             className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold"
//           >
//             <FiPlus /> Add New Room
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <p className="text-center text-gray-500">Loading...</p>
//       ) : (
//         <table className="w-full border-collapse table-auto">
//           <thead>
//             <tr className="bg-gray-100 text-left text-sm font-semibold">
//               <th className="p-2">S.no</th>
//               <th className="p-2">Space Name</th>
//               <th className="p-2">Category</th>
//               <th className="p-2">Length</th>
//               <th className="p-2">Breadth</th>
//               <th className="p-2">Height</th>
//               <th className="p-2">Opening Area</th>
//               <th className="p-2">Perimeter</th>
//               <th className="p-2">Floor Area</th>
//               <th className="p-2">Wall Area</th>
//               <th className="p-2">Edit</th>
//               <th className="p-2">Delete</th>
//             </tr>
//           </thead>
//           <tbody>
//             {spaceList.map((space, index) => (
//               <React.Fragment key={space._id || space.id || index}>
//                 <tr className="hover:bg-gray-50 border-b">
//                   <td className="p-2">{index + 1}</td>
//                   <td className="p-2">{space.name}</td>
//                   <td className="p-2">{space.category}</td>
//                   <td className="p-2">{space.length}</td>
//                   <td className="p-2">{space.breadth}</td>
//                   <td className="p-2">{space.height}</td>
//                   <td className="p-2">
//                     {(Array.isArray(space.openings)
//                       ? space.openings
//                       : []
//                     ).reduce(
//                       (sum, op) =>
//                         sum + Number(op.height || 0) * Number(op.width || 0),
//                       0
//                     )}{" "}
//                     sqft
//                   </td>
//                   <td className="p-2">{space.perimeter}</td>
//                   <td className="p-2">{space.floorArea}</td>
//                   <td className="p-2">{space.wallArea}</td>
//                   <td className="p-2">
//                     <FiEdit2
//                       className="inline-block cursor-pointer text-red-600"
//                       onClick={() =>
//                         setExpandedRow(expandedRow === index ? null : index)
//                       }
//                     />
//                   </td>
//                   <td className="p-2">
//                     <MdDelete
//                       className="text-red-600 cursor-pointer"
//                       onClick={() => handleDelete(space)}
//                     />
//                   </td>
//                 </tr>

//                 {/* Expanded Row */}
//                 {expandedRow === index && (
//                   <tr>
//                     <td colSpan="11" className="bg-white py-6 px-6">
//                       <div className="grid grid-cols-[1fr_1fr_1.5fr_1fr_0.8fr] gap-6 text-sm text-red-800 w-full">
//                         {/* Column 1: Name & Category */}
//                         <div className="space-y-4">
//                           <div>
//                             <label className="font-bold block">Area Name</label>
//                             <input
//                               value={space.name}
//                               onChange={(e) =>
//                                 updateField(index, "name", e.target.value)
//                               }
//                               className="w-full border p-2 rounded"
//                             />
//                           </div>
//                           <div>
//                             <label className="font-bold block">
//                               Select Category
//                             </label>
//                             <select
//                               value={space.category}
//                               onChange={(e) =>
//                                 updateField(index, "category", e.target.value)
//                               }
//                               className="w-full border p-2 rounded"
//                             >
//                               {categories.map((cat) => (
//                                 <option key={cat} value={cat}>
//                                   {cat}
//                                 </option>
//                               ))}
//                             </select>
//                           </div>
//                         </div>

//                         {/* Column 2: Dimensions */}
//                         <div className="space-y-4">
//                           <label className="font-bold block">Dimensions</label>
//                           {["length", "breadth", "height"].map((dim) => (
//                             <div key={dim} className="flex items-center gap-2">
//                               <label className="font-bold min-w-[70px]">
//                                 {dim.charAt(0).toUpperCase() + dim.slice(1)}
//                               </label>
//                               <input
//                                 type="number"
//                                 value={space[dim]}
//                                 onChange={(e) =>
//                                   updateField(index, dim, e.target.value)
//                                 }
//                                 className="w-full max-w-[180px] border p-2 rounded"
//                               />
//                             </div>
//                           ))}
//                         </div>

//                         {/* Column 3: Openings */}
//                         <div className="space-y-4">
//                           <div className="flex justify-between items-center">
//                             <label className="font-bold">Doors & Windows</label>
//                             <button
//                               className="bg-red-700 text-white text-xs px-2 py-1 rounded flex items-center gap-1"
//                               onClick={() =>
//                                 updateField(index, "openings", [
//                                   ...(Array.isArray(space.openings)
//                                     ? space.openings
//                                     : []),
//                                   { type: "Door", height: 0, width: 0 },
//                                 ])
//                               }
//                             >
//                               <span className="text-lg font-bold">+</span> Add
//                             </button>
//                           </div>

//                           {(Array.isArray(space.openings)
//                             ? space.openings
//                             : []
//                           ).map((op, opIdx) => (
//                             <div
//                               key={opIdx}
//                               className="flex items-center flex-wrap gap-2"
//                             >
//                               <select
//                                 className="font-bold border p-1 rounded w-24"
//                                 value={op.type}
//                                 onChange={(e) =>
//                                   updateOpening(
//                                     index,
//                                     opIdx,
//                                     "type",
//                                     e.target.value
//                                   )
//                                 }
//                               >
//                                 <option value="Door">Door</option>
//                                 <option value="Window">Window</option>
//                               </select>
//                               <input
//                                 type="number"
//                                 className="border p-1 rounded w-16"
//                                 value={op.height}
//                                 onChange={(e) =>
//                                   updateOpening(
//                                     index,
//                                     opIdx,
//                                     "height",
//                                     e.target.value
//                                   )
//                                 }
//                               />
//                               <input
//                                 type="number"
//                                 className="border p-1 rounded w-16"
//                                 value={op.width}
//                                 onChange={(e) =>
//                                   updateOpening(
//                                     index,
//                                     opIdx,
//                                     "width",
//                                     e.target.value
//                                   )
//                                 }
//                               />
//                               <button
//                                 className="text-red-600 font-bold"
//                                 onClick={() => {
//                                   // remove opening
//                                   const updatedOpenings = (
//                                     space.openings || []
//                                   ).filter((_, i) => i !== opIdx);
//                                   updateField(
//                                     index,
//                                     "openings",
//                                     updatedOpenings
//                                   );
//                                 }}
//                               >
//                                 X
//                               </button>
//                             </div>
//                           ))}
//                         </div>

//                         {/* Column 4: Calculated Values */}
//                         <div className="space-y-4">
//                           <h3 className="font-bold mb-2">Calculated Values</h3>
//                           <div className="flex justify-between mb-2">
//                             <span>Unit:</span>
//                             <button
//                               className="px-2 py-1 border rounded bg-red-600 hover:bg-red-700 cursor-pointer text-white"
//                               onClick={() =>
//                                 setUnit((u) => (u === "ft" ? "m" : "ft"))
//                               }
//                             >
//                               {unit}
//                             </button>
//                           </div>
//                           {[
//                             { label: "Perimeter", key: "perimeter" },
//                             { label: "Floor Area", key: "floorArea" },
//                             { label: "Wall Area", key: "wallArea" },
//                           ].map(({ label, key }) => (
//                             <div key={key}>
//                               <label className="font-bold block">{label}</label>
//                               <input
//                                 value={convertValue(space[key]) ?? ""}
//                                 readOnly={!space.custom}
//                                 onChange={(e) =>
//                                   updateField(index, key, e.target.value)
//                                 }
//                                 className={`w-full border p-2 rounded ${
//                                   space.custom
//                                     ? "bg-white"
//                                     : "bg-gray-100 cursor-not-allowed"
//                                 }`}
//                               />
//                             </div>
//                           ))}
//                         </div>

//                         {/* Column 5: Custom Button */}
//                         <div className="space-y-4">
//                           <h3 className="font-bold text-red-700">
//                             Override Calculations
//                           </h3>
//                           <button
//                             className="border bg-red-600 hover:bg-red-700 text-white cursor-pointer rounded p-2 font-bold"
//                             onClick={() => enableCustom(index)}
//                           >
//                             Custom
//                           </button>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Add Room Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-md w-96 relative max-h-[90vh] overflow-y-auto">
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-2 right-2 text-red-600 text-lg"
//             >
//               <FaRegWindowClose />
//             </button>
//             <h2 className="text-lg font-bold mb-4">Add New Room</h2>

//             {/* Room Basic Info */}
//             <div className="mb-3">
//               <label className="block font-bold">Room Name</label>
//               <input
//                 type="text"
//                 value={newRoom.name}
//                 onChange={(e) =>
//                   setNewRoom((s) => ({ ...s, name: e.target.value }))
//                 }
//                 className="w-full border p-2 rounded mb-3"
//               />

//               <label className="block font-bold">Category</label>
//               <select
//                 value={newRoom.category}
//                 onChange={(e) =>
//                   setNewRoom((s) => ({ ...s, category: e.target.value }))
//                 }
//                 className="w-full border p-2 rounded mb-3"
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </select>

//               {["length", "breadth", "height"].map((field) => (
//                 <div key={field} className="mb-3">
//                   <label className="block font-bold capitalize">{field}</label>
//                   <input
//                     type="number"
//                     value={newRoom[field]}
//                     onChange={(e) =>
//                       setNewRoom((s) => ({ ...s, [field]: e.target.value }))
//                     }
//                     className="w-full border p-2 rounded"
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* Openings */}
//             <div className="mb-3">
//               <div className="flex justify-between items-center mb-2">
//                 <label className="font-bold">Doors & Windows</label>
//                 <button
//                   className="bg-red-700 text-white text-xs px-2 py-1 rounded flex items-center gap-1"
//                   onClick={() =>
//                     setNewRoom((s) => ({
//                       ...s,
//                       openings: [
//                         ...(Array.isArray(s.openings) ? s.openings : []),
//                         { type: "Door", height: 0, width: 0 },
//                       ],
//                     }))
//                   }
//                 >
//                   <span className="text-lg font-bold">+</span> Add
//                 </button>
//               </div>

//               {(Array.isArray(newRoom.openings) ? newRoom.openings : []).map(
//                 (op, idx) => (
//                   <div key={idx} className="flex items-center gap-2 mb-2">
//                     <select
//                       className="font-bold border p-1 rounded w-24"
//                       value={op.type}
//                       onChange={(e) => {
//                         const updated = [...newRoom.openings];
//                         updated[idx] = {
//                           ...updated[idx],
//                           type: e.target.value,
//                         };
//                         setNewRoom((s) => ({ ...s, openings: updated }));
//                       }}
//                     >
//                       <option value="Door">Door</option>
//                       <option value="Window">Window</option>
//                     </select>
//                     <input
//                       type="number"
//                       className="border p-1 rounded w-16"
//                       placeholder="Height"
//                       value={op.height}
//                       onChange={(e) => {
//                         const updated = [...newRoom.openings];
//                         updated[idx] = {
//                           ...updated[idx],
//                           height: e.target.value,
//                         };
//                         setNewRoom((s) => ({ ...s, openings: updated }));
//                       }}
//                     />
//                     <input
//                       type="number"
//                       className="border p-1 rounded w-16"
//                       placeholder="Width"
//                       value={op.width}
//                       onChange={(e) => {
//                         const updated = [...newRoom.openings];
//                         updated[idx] = {
//                           ...updated[idx],
//                           width: e.target.value,
//                         };
//                         setNewRoom((s) => ({ ...s, openings: updated }));
//                       }}
//                     />
//                     <button
//                       className="text-red-600 font-bold"
//                       onClick={() => {
//                         const updated = newRoom.openings.filter(
//                           (_, i) => i !== idx
//                         );
//                         setNewRoom((s) => ({ ...s, openings: updated }));
//                       }}
//                     >
//                       X
//                     </button>
//                   </div>
//                 )
//               )}
//             </div>

//             <button
//               onClick={addNewRoom}
//               className="bg-red-700 text-white px-4 py-2 rounded mt-2 w-full"
//             >
//               Add Room
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectSiteMeasurements;
