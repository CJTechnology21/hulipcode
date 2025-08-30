import React, { useState, useMemo, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiPlus, FiMoreVertical } from "react-icons/fi";
import Button from "../../../components/Button";
import DropDown from "../../../components/DropDown";
import {
  fetchProjectAttendance,
  createProjectAttendance,
  updateProjectAttendance,
  deleteProjectAttendance,
} from "../../../services/projectAttendanceServices";
import { createUser } from "../../../services/projectAttendanceServices";
import { toast } from "react-toastify";

const tabs = ["All", "Site Staff", "Labour Contractor"];
const attendanceOptions = ["Full Day", "Half Day", "Absent", "Paid Leave", "Week Off"];

const ProjectAttendance = ({ projectId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("Site Staff");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const [staff, setStaff] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [loading, setLoading] = useState(true);

  const currentDateKey = selectedDate.toISOString().slice(0, 10);

  // 📌 Fetch project attendance
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchProjectAttendance(projectId);

        if (!data || !Array.isArray(data.attendance)) {
          setStaff([]);
          setAttendanceRecords({});
          return;
        }

        // Normalize staff
        const staffMap = {};
        data.attendance.forEach((entry) => {
          const staffId = entry._id?.$oid || entry._id;
          if (staffId) {
            staffMap[staffId] = {
              _id: staffId,
              name: entry.name || "Unnamed",
              type: entry.personType || "Site Staff",
              status: "Active",
            };
          }
        });
        const normalizedStaff = Object.values(staffMap);

        // Normalize attendance
        const records = {};
        data.attendance.forEach((entry) => {
          const staffId = entry._id?.$oid || entry._id;
          if (!entry.date || !staffId) return;

          const dateKey = new Date(entry.date?.$date || entry.date)
            .toISOString()
            .slice(0, 10);

          if (!records[dateKey]) records[dateKey] = {};
          records[dateKey][staffId] = entry.status;
        });

        setStaff(normalizedStaff);
        setAttendanceRecords(records);
      } catch (err) {
        toast.error("Failed to load attendance records");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [projectId]);

  // 📌 Filter staff
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      if (activeTab !== "All" && s.type !== activeTab) return false;
      if (statusFilter && s.status !== statusFilter) return false;
      if (searchTerm && !s.name.toLowerCase().includes(searchTerm.toLowerCase()))
        return false;
      return true;
    });
  }, [staff, activeTab, statusFilter, searchTerm]);

  // 📌 Summary
  const summary = useMemo(() => {
    const todayRecords = attendanceRecords[currentDateKey] || {};
    return {
      present: filteredStaff.filter((s) => todayRecords[s._id] === "Full Day").length,
      absent: filteredStaff.filter((s) => todayRecords[s._id] === "Absent").length,
      paidLeave: filteredStaff.filter((s) => todayRecords[s._id] === "Paid Leave").length,
      weekOff: filteredStaff.filter((s) => todayRecords[s._id] === "Week Off").length,
    };
  }, [filteredStaff, attendanceRecords, currentDateKey]);

  // 📌 Date navigation
  const handlePrevDay = () =>
    setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
  const handleNextDay = () =>
    setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() + 1)));

  const formatDay = (date) =>
    new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
  const formatDate = (date) => date.getDate();
  const formatMonth = (date) =>
    new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split("-");
    setSelectedDate(new Date(year, month - 1, 1));
  };

  // 📌 Add / Edit Staff
  const handleAddStaff = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const staffData = {
      name: formData.get("name"),
      type: formData.get("type"),
      status: "Active",
    };

    try {
      if (editingStaff) {
        setStaff((prev) =>
          prev.map((s) => (s._id === editingStaff._id ? { ...s, ...staffData } : s))
        );
        toast.success("Staff updated successfully");
      } else {
        const saved = await createUser(staffData);
        setStaff((prev) => [...prev, saved]);
        toast.success("Staff added successfully");
      }
    } catch {
      toast.error("Failed to save staff");
    } finally {
      setIsModalOpen(false);
      setEditingStaff(null);
    }
  };

  // 📌 Change Attendance
  const handleAttendanceChange = async (staffId, value) => {
    try {
      const record = { staffId, date: currentDateKey, status: value, projectId };

      if (attendanceRecords[currentDateKey]?.[staffId]) {
        await updateProjectAttendance(staffId, record);
      } else {
        await createProjectAttendance(record);
      }

      setAttendanceRecords((prev) => {
        const updated = { ...(prev[currentDateKey] || {}) };
        updated[staffId] = value;
        return { ...prev, [currentDateKey]: updated };
      });
      toast.success("Attendance updated");
    } catch {
      toast.error("Failed to update attendance");
    }
  };

  // 📌 Delete Staff
  const handleDeleteStaff = async (_id) => {
    try {
      await deleteProjectAttendance(_id);
      setStaff((prev) => prev.filter((s) => s._id !== _id));
      toast.success("Staff deleted successfully");
    } catch {
      toast.error("Failed to delete staff");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 bg-white w-full m-4 rounded-xl">
      {/* Tabs + Dropdown + Add Button */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-sm rounded-full ${
                activeTab === tab
                  ? "bg-red-600 text-white"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              {tab}
            </button>
          ))}

          <DropDown
            name="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={["Active", "Inactive"]}
            className="text-sm"
          />
        </div>

        <Button
          color="red"
          variant="custom"
          size="sm"
          onClick={() => {
            setEditingStaff(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md"
        >
          <FiPlus />
          Add Staff
        </Button>
      </div>

      {/* Date Nav + Month + Search + Summary */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Button className="p-2 bg-gray-100 rounded" onClick={handlePrevDay}>
            <FaChevronLeft size={12} />
          </Button>
          <div className="px-3 py-1 bg-green-600 text-white rounded text-sm font-semibold text-center">
            {formatDate(selectedDate)}
            <br />
            {formatDay(selectedDate)}
          </div>
          <Button className="p-2 bg-gray-100 rounded" onClick={handleNextDay}>
            <FaChevronRight size={12} />
          </Button>

          <label className="relative cursor-pointer text-sm font-medium">
            <div className="px-3 py-1.5 bg-gray-100 border rounded-md">
              {formatMonth(selectedDate)}
            </div>
            <input
              type="month"
              value={selectedDate.toISOString().slice(0, 7)}
              onChange={handleMonthChange}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>

          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-1.5 text-sm rounded-md w-60"
          />
        </div>

        <div className="text-sm text-gray-600 space-x-3 text-right">
          <span className="font-semibold text-black">{summary.present} Full Day</span>
          <span className="text-gray-400">{summary.absent} Absent</span>
          <span className="text-gray-400">{summary.paidLeave} Paid Leave</span>
          <span className="text-gray-400">{summary.weekOff} Week Off</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-xl border">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-red-50 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Attendance</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filteredStaff.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-gray-400 py-8">
                  No data available
                </td>
              </tr>
            ) : (
              filteredStaff.map((s) => (
                <tr key={s._id}>
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.type}</td>
                  <td className="px-4 py-2">
                    <select
                      value={attendanceRecords[currentDateKey]?.[s._id] || ""}
                      onChange={(e) => handleAttendanceChange(s._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="">-- Select --</option>
                      {attendanceOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <div className="relative inline-block">
                      <FiMoreVertical
                        className="cursor-pointer"
                        onClick={() =>
                          setOpenMenuId(openMenuId === s._id ? null : s._id)
                        }
                      />
                      {openMenuId === s._id && (
                        <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg z-10">
                          <button
                            className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                            onClick={() => {
                              setEditingStaff(s);
                              setIsModalOpen(true);
                              setOpenMenuId(null);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-600"
                            onClick={() => {
                              handleDeleteStaff(s._id);
                              setOpenMenuId(null);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-lg font-semibold mb-4">
              {editingStaff ? "Edit Staff" : "Add Staff"}
            </h2>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <input
                type="text"
                name="name"
                defaultValue={editingStaff?.name || ""}
                placeholder="Enter name"
                required
                className="w-full border px-3 py-2 rounded-md"
              />
              <select
                name="type"
                defaultValue={editingStaff?.type || "Site Staff"}
                required
                className="w-full border px-3 py-2 rounded-md"
              >
                <option value="Site Staff">Site Staff</option>
                <option value="Labour Contractor">Labour Contractor</option>
              </select>
              <div className="flex justify-end gap-2">
                <Button
                  variant="custom"
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingStaff(null);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </Button>
                <Button
                  variant="custom"
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAttendance;

// import React, { useState, useMemo, useEffect } from "react";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { FiPlus, FiMoreVertical } from "react-icons/fi";
// import Button from "../../../components/Button";
// import DropDown from "../../../components/DropDown";
// import {
//   fetchProjectAttendance,
//   createProjectAttendance,
//   updateProjectAttendance,
//   deleteProjectAttendance,
// } from "../../../services/projectAttendanceServices";
// import { createUser } from "../../../services/leadServices";
// import { toast } from "react-toastify";

// const tabs = ["All", "Site Staff", "Labour Contractor"];
// const attendanceOptions = ["Full Day", "Half Day", "Absent", "Paid Leave", "Week Off"];

// const ProjectAttendance = ({ projectId }) => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [activeTab, setActiveTab] = useState("Site Staff");
//   const [statusFilter, setStatusFilter] = useState("Active");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingStaff, setEditingStaff] = useState(null);

//   const [staff, setStaff] = useState([]);
//   const [attendanceRecords, setAttendanceRecords] = useState({});
//   const [loading, setLoading] = useState(true);

//   const currentDateKey = selectedDate.toISOString().slice(0, 10);

//   // 📌 Fetch project attendance
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         const data = await fetchProjectAttendance(projectId);

//         // console.log("Fetched attendance raw data:", JSON.stringify(data, null, 2));

//         if (!data || !Array.isArray(data.attendance)) {
//           setStaff([]);
//           setAttendanceRecords({});
//           return;
//         }

//         // ✅ Normalize staff (unique by _id)
//         const staffMap = {};
//         data.attendance.forEach((entry) => {
//           const staffId = entry._id?.$oid || entry._id;
//           if (staffId) {
//             staffMap[staffId] = {
//               _id: staffId,
//               name: entry.name || "Unnamed",
//               type: entry.personType || "Site Staff",
//               status: "Active", // no explicit staff status in your schema
//             };
//           }
//         });
//         const normalizedStaff = Object.values(staffMap);

//         // ✅ Normalize attendance records { date: { staffId: status } }
//         const records = {};
//         data.attendance.forEach((entry) => {
//           const staffId = entry._id?.$oid || entry._id;
//           if (!entry.date || !staffId) return;

//           const dateKey = new Date(entry.date?.$date || entry.date)
//             .toISOString()
//             .slice(0, 10);

//           if (!records[dateKey]) records[dateKey] = {};
//           records[dateKey][staffId] = entry.status;
//         });

//         setStaff(normalizedStaff);
//         setAttendanceRecords(records);

//         // console.log("Normalized staff:", normalizedStaff);
//         // console.log("Normalized attendance records:", records);
//       } catch (err) {
//         console.error("Error fetching project attendance:", err);
//         toast.error("Failed to load attendance records");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, [projectId]);

//   // 📌 Filter staff
//   const filteredStaff = useMemo(() => {
//     const result = staff.filter((s) => {
//       if (activeTab !== "All" && s.type !== activeTab) return false;
//       if (statusFilter && s.status !== statusFilter) return false;
//       if (searchTerm && !s.name.toLowerCase().includes(searchTerm.toLowerCase()))
//         return false;
//       return true;
//     });

//     // console.log("Filtering staff:", {
//     //   activeTab,
//     //   statusFilter,
//     //   searchTerm,
//     //   staff,
//     //   filteredResult: result,
//     // });

//     return result;
//   }, [staff, activeTab, statusFilter, searchTerm]);

//   // 📌 Summary
//   const summary = useMemo(() => {
//     const todayRecords = attendanceRecords[currentDateKey] || {};
//     const sum = {
//       present: filteredStaff.filter((s) => todayRecords[s._id] === "Full Day").length,
//       absent: filteredStaff.filter((s) => todayRecords[s._id] === "Absent").length,
//       paidLeave: filteredStaff.filter((s) => todayRecords[s._id] === "Paid Leave").length,
//       weekOff: filteredStaff.filter((s) => todayRecords[s._id] === "Week Off").length,
//     };

//     // console.log("Summary calculation:", { currentDateKey, todayRecords, sum });

//     return sum;
//   }, [filteredStaff, attendanceRecords, currentDateKey]);

//   // 📌 Date navigation
//   const handlePrevDay = () =>
//     setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
//   const handleNextDay = () =>
//     setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() + 1)));

//   const formatDay = (date) =>
//     new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
//   const formatDate = (date) => date.getDate();
//   const formatMonth = (date) =>
//     new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);

//   const handleMonthChange = (e) => {
//     const [year, month] = e.target.value.split("-");
//     setSelectedDate(new Date(year, month - 1, 1));
//   };

//   // 📌 Add / Edit Staff
//   const handleAddStaff = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);

//     const staffData = {
//       name: formData.get("name"),
//       type: formData.get("type"),
//       status: "Active",
//     };

//     console.log("Submitting staff data:", staffData);

//     try {
//       if (editingStaff) {
//         setStaff((prev) =>
//           prev.map((s) => (s._id === editingStaff._id ? { ...s, ...staffData } : s))
//         );
//         toast.success("Staff updated successfully");
//       } else {
//         const saved = await createUser(staffData);
//         console.log("Saved staff returned from backend:", saved);
//         setStaff([...staff, saved]);
//         toast.success("Staff added successfully");
//       }
//     } catch (err) {
//       console.error("Error saving staff:", err);
//       toast.error("Failed to save staff");
//     } finally {
//       setIsModalOpen(false);
//       setEditingStaff(null);
//     }
//   };

//   // 📌 Change Attendance
//   const handleAttendanceChange = async (staffId, value) => {
//     try {
//       const record = { staffId, date: currentDateKey, status: value, projectId };
//       console.log("Updating attendance:", record);

//       if (attendanceRecords[currentDateKey]?.[staffId]) {
//         await updateProjectAttendance(staffId, record);
//       } else {
//         await createProjectAttendance(record);
//       }

//       setAttendanceRecords((prev) => {
//         const updated = { ...(prev[currentDateKey] || {}) };
//         updated[staffId] = value;
//         const newRecords = { ...prev, [currentDateKey]: updated };

//         console.log("Updated attendance records state:", newRecords);

//         return newRecords;
//       });
//       toast.success("Attendance updated");
//     } catch (err) {
//       console.error("Error updating attendance:", err);
//       toast.error("Failed to update attendance");
//     }
//   };

//   // 📌 Delete Staff
//   const handleDeleteStaff = async (_id) => {
//     try {
//       console.log("Deleting staff with id:", _id);
//       await deleteProjectAttendance(_id);
//       setStaff((prev) => prev.filter((s) => s._id !== _id));
//       toast.success("Staff deleted successfully");
//     } catch (err) {
//       console.error("Error deleting staff:", err);
//       toast.error("Failed to delete staff");
//     }
//   };

//   return (
//     <div className="p-4 md:p-6 space-y-4 bg-white w-full m-4 rounded-xl">
//       {/* Tabs + Dropdown + Add Button */}
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <div className="flex items-center gap-2 flex-wrap">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-4 py-1.5 text-sm rounded-full ${
//                 activeTab === tab
//                   ? "bg-red-600 text-white"
//                   : "bg-red-100 text-red-700 hover:bg-red-200"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}

//           <DropDown
//             name="status"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             options={["Active", "Inactive"]}
//             className="text-sm"
//           />
//         </div>

//         <Button
//           color="red"
//           variant="custom"
//           size="sm"
//           onClick={() => {
//             setEditingStaff(null);
//             setIsModalOpen(true);
//           }}
//           className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md"
//         >
//           <FiPlus />
//           Add Staff
//         </Button>
//       </div>

//       {/* Date Nav + Month + Search + Summary */}
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <div className="flex items-center gap-2 flex-wrap">
//           <Button className="p-2 bg-gray-100 rounded" onClick={handlePrevDay}>
//             <FaChevronLeft size={12} />
//           </Button>
//           <div className="px-3 py-1 bg-green-600 text-white rounded text-sm font-semibold text-center">
//             {formatDate(selectedDate)}
//             <br />
//             {formatDay(selectedDate)}
//           </div>
//           <Button className="p-2 bg-gray-100 rounded" onClick={handleNextDay}>
//             <FaChevronRight size={12} />
//           </Button>

//           <label className="relative cursor-pointer text-sm font-medium">
//             <div className="px-3 py-1.5 bg-gray-100 border rounded-md">
//               {formatMonth(selectedDate)}
//             </div>
//             <input
//               type="month"
//               value={selectedDate.toISOString().slice(0, 7)}
//               onChange={handleMonthChange}
//               className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
//             />
//           </label>

//           <input
//             type="text"
//             placeholder="Search"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="border px-3 py-1.5 text-sm rounded-md w-60"
//           />
//         </div>

//         <div className="text-sm text-gray-600 space-x-3 text-right">
//           <span className="font-semibold text-black">{summary.present} Full Day</span>
//           <span className="text-gray-400">{summary.absent} Absent</span>
//           <span className="text-gray-400">{summary.paidLeave} Paid Leave</span>
//           <span className="text-gray-400">{summary.weekOff} Week Off</span>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-auto rounded-xl border">
//         <table className="min-w-full text-sm text-gray-700">
//           <thead className="bg-red-50 text-left">
//             <tr>
//               <th className="px-4 py-2">Name</th>
//               <th className="px-4 py-2">Type</th>
//               <th className="px-4 py-2">Attendance</th>
//               <th className="px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="4" className="text-center py-6">
//                   Loading...
//                 </td>
//               </tr>
//             ) : filteredStaff.length === 0 ? (
//               <tr>
//                 <td colSpan="4" className="text-center text-gray-400 py-8">
//                   No data available
//                 </td>
//               </tr>
//             ) : (
//               filteredStaff.map((s) => (
//                 <tr key={s._id}>
//                   <td className="px-4 py-2">{s.name}</td>
//                   <td className="px-4 py-2">{s.type}</td>
//                   <td className="px-4 py-2">
//                     <select
//                       value={attendanceRecords[currentDateKey]?.[s._id] || ""}
//                       onChange={(e) => handleAttendanceChange(s._id, e.target.value)}
//                       className="border rounded px-2 py-1 text-sm"
//                     >
//                       <option value="">-- Select --</option>
//                       {attendanceOptions.map((opt) => (
//                         <option key={opt} value={opt}>
//                           {opt}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   <td className="px-4 py-2">
//                     <div className="relative group inline-block">
//                       <FiMoreVertical className="cursor-pointer" />
//                       <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg hidden group-hover:block z-10">
//                         <button
//                           className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
//                           onClick={() => {
//                             setEditingStaff(s);
//                             setIsModalOpen(true);
//                           }}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-600"
//                           onClick={() => handleDeleteStaff(s._id)}
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Add/Edit Staff Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl w-96">
//             <h2 className="text-lg font-semibold mb-4">
//               {editingStaff ? "Edit Staff" : "Add Staff"}
//             </h2>
//             <form onSubmit={handleAddStaff} className="space-y-4">
//               <input
//                 type="text"
//                 name="name"
//                 defaultValue={editingStaff?.name || ""}
//                 placeholder="Enter name"
//                 required
//                 className="w-full border px-3 py-2 rounded-md"
//               />
//               <select
//                 name="type"
//                 defaultValue={editingStaff?.type || "Site Staff"}
//                 required
//                 className="w-full border px-3 py-2 rounded-md"
//               >
//                 <option value="Site Staff">Site Staff</option>
//                 <option value="Labour Contractor">Labour Contractor</option>
//               </select>
//               <div className="flex justify-end gap-2">
//                 <Button
//                   variant="custom"
//                   type="button"
//                   onClick={() => {
//                     setIsModalOpen(false);
//                     setEditingStaff(null);
//                   }}
//                   className="px-4 py-2 bg-gray-200 rounded-md"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="custom"
//                   type="submit"
//                   className="px-4 py-2 bg-red-600 text-white rounded-md"
//                 >
//                   Save
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectAttendance;

// import React, { useState, useMemo, useEffect } from "react";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { FiPlus, FiMoreVertical } from "react-icons/fi";
// import Button from "../../../components/Button";
// import DropDown from "../../../components/DropDown";
// import {
//   fetchProjectAttendance,
//   createProjectAttendance,
//   updateProjectAttendance,
//   deleteProjectAttendance,
// } from "../../../services/projectAttendanceServices";
// import { createUser } from "../../../services/leadServices";
// import { toast } from "react-toastify";

// const tabs = ["All", "Site Staff", "Labour Contractor"];
// const attendanceOptions = ["Present", "Absent", "Paid Leave", "Week Off"];

// const ProjectAttendance = ({ projectId }) => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [activeTab, setActiveTab] = useState("Site Staff");
//   const [statusFilter, setStatusFilter] = useState("Active");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingStaff, setEditingStaff] = useState(null);

//   const [staff, setStaff] = useState([]);
//   const [attendanceRecords, setAttendanceRecords] = useState({});
//   const [loading, setLoading] = useState(true);

//   const currentDateKey = selectedDate.toISOString().slice(0, 10);

//   // 📌 Fetch project attendance
//   useEffect(() => {
//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const data = await fetchProjectAttendance(projectId);

//       console.log("Fetched attendance raw data:", data);

//       if (!data || !Array.isArray(data.attendance)) {
//         setStaff([]);
//         setAttendanceRecords({});
//         return;
//       }

//       // ✅ Normalize staff (unique by _id)
//       const staffMap = {};
//       data.attendance.forEach((entry) => {
//         if (entry.staff?._id) {
//           staffMap[entry.staff._id] = entry.staff;
//         }
//       });
//       const normalizedStaff = Object.values(staffMap);

//       // ✅ Normalize attendance records { date: { staffId: status } }
//       const records = {};
//       data.attendance.forEach((entry) => {
//         if (!entry.date || !entry.staff?._id) return;
//         const dateKey = entry.date.slice(0, 10); // YYYY-MM-DD
//         if (!records[dateKey]) records[dateKey] = {};
//         records[dateKey][entry.staff._id] = entry.status;
//       });

//       setStaff(normalizedStaff);
//       setAttendanceRecords(records);

//       console.log("Normalized staff:", normalizedStaff);
//       console.log("Normalized attendance records:", records);
//     } catch (err) {
//       console.error("Error fetching project attendance:", err);
//       toast.error("Failed to load attendance records");
//     } finally {
//       setLoading(false);
//     }
//   };
//   loadData();
// }, [projectId]);

//   // useEffect(() => {
//   //   const loadData = async () => {
//   //     try {
//   //       setLoading(true);
//   //       const data = await fetchProjectAttendance(projectId);

//   //       console.log("Fetched attendance raw data:", data);

//   //       // ✅ Normalize backend response
//   //       if (data?.attendance) {
//   //         const staffList = data.attendance.map((item) => ({
//   //           _id: item.staffId?._id || item._id,
//   //           name: item.staffId?.name || item.name || "Unnamed",
//   //           type: item.staffId?.type || item.type || "Site Staff",
//   //           status: item.staffId?.status || "Active",
//   //         }));

//   //         const recordsMap = {};
//   //         data.attendance.forEach((item) => {
//   //           const dateKey = item.date?.slice(0, 10);
//   //           if (!recordsMap[dateKey]) recordsMap[dateKey] = {};
//   //           recordsMap[dateKey][item.staffId?._id || item._id] = item.status;
//   //         });

//   //         setStaff(staffList);
//   //         setAttendanceRecords(recordsMap);

//   //         console.log("Normalized staff:", staffList);
//   //         console.log("Normalized attendance records:", recordsMap);
//   //       } else {
//   //         setStaff(data.staff || []);
//   //         setAttendanceRecords(data.records || {});
//   //       }
//   //     } catch (err) {
//   //       console.error("Error fetching project attendance:", err);
//   //       toast.error("Failed to load attendance records");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
//   //   loadData();
//   // }, [projectId]);

//   // 📌 Filter staff
//   const filteredStaff = useMemo(() => {
//     const result = staff.filter((s) => {
//       if (activeTab !== "All" && s.type !== activeTab) return false;
//       if (statusFilter && s.status !== statusFilter) return false;
//       if (searchTerm && !s.name.toLowerCase().includes(searchTerm.toLowerCase()))
//         return false;
//       return true;
//     });

//     console.log("Filtering staff:", {
//       activeTab,
//       statusFilter,
//       searchTerm,
//       staff,
//       filteredResult: result,
//     });

//     return result;
//   }, [staff, activeTab, statusFilter, searchTerm]);

//   // 📌 Summary
//   const summary = useMemo(() => {
//     const todayRecords = attendanceRecords[currentDateKey] || {};
//     const sum = {
//       present: filteredStaff.filter((s) => todayRecords[s._id] === "Present").length,
//       absent: filteredStaff.filter((s) => todayRecords[s._id] === "Absent").length,
//       paidLeave: filteredStaff.filter((s) => todayRecords[s._id] === "Paid Leave").length,
//       weekOff: filteredStaff.filter((s) => todayRecords[s._id] === "Week Off").length,
//     };

//     console.log("Summary calculation:", { currentDateKey, todayRecords, sum });

//     return sum;
//   }, [filteredStaff, attendanceRecords, currentDateKey]);

//   // 📌 Date navigation
//   const handlePrevDay = () =>
//     setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
//   const handleNextDay = () =>
//     setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() + 1)));

//   const formatDay = (date) =>
//     new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
//   const formatDate = (date) => date.getDate();
//   const formatMonth = (date) =>
//     new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);

//   const handleMonthChange = (e) => {
//     const [year, month] = e.target.value.split("-");
//     setSelectedDate(new Date(year, month - 1, 1));
//   };

//   // 📌 Add / Edit Staff
//   const handleAddStaff = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);

//     const staffData = {
//       name: formData.get("name"),
//       type: formData.get("type"),
//       status: "Active",
//     };

//     console.log("Submitting staff data:", staffData);

//     try {
//       if (editingStaff) {
//         setStaff((prev) =>
//           prev.map((s) => (s._id === editingStaff._id ? { ...s, ...staffData } : s))
//         );
//         toast.success("Staff updated successfully");
//       } else {
//         const saved = await createUser(staffData);
//         console.log("Saved staff returned from backend:", saved);
//         setStaff([...staff, saved]);
//         toast.success("Staff added successfully");
//       }
//     } catch (err) {
//       console.error("Error saving staff:", err);
//       toast.error("Failed to save staff");
//     } finally {
//       setIsModalOpen(false);
//       setEditingStaff(null);
//     }
//   };

//   // 📌 Change Attendance
//   const handleAttendanceChange = async (staffId, value) => {
//     try {
//       const record = { staffId, date: currentDateKey, status: value, projectId };
//       console.log("Updating attendance:", record);

//       if (attendanceRecords[currentDateKey]?.[staffId]) {
//         await updateProjectAttendance(staffId, record);
//       } else {
//         await createProjectAttendance(record);
//       }

//       setAttendanceRecords((prev) => {
//         const updated = { ...(prev[currentDateKey] || {}) };
//         updated[staffId] = value;
//         const newRecords = { ...prev, [currentDateKey]: updated };

//         console.log("Updated attendance records state:", newRecords);

//         return newRecords;
//       });
//       toast.success("Attendance updated");
//     } catch (err) {
//       console.error("Error updating attendance:", err);
//       toast.error("Failed to update attendance");
//     }
//   };

//   // 📌 Delete Staff
//   const handleDeleteStaff = async (_id) => {
//     try {
//       console.log("Deleting staff with id:", _id);
//       await deleteProjectAttendance(_id);
//       setStaff((prev) => prev.filter((s) => s._id !== _id));
//       toast.success("Staff deleted successfully");
//     } catch (err) {
//       console.error("Error deleting staff:", err);
//       toast.error("Failed to delete staff");
//     }
//   };

//   return (
//     <div className="p-4 md:p-6 space-y-4 bg-white w-full m-4 rounded-xl">
//       {/* Tabs + Dropdown + Add Button */}
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <div className="flex items-center gap-2 flex-wrap">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-4 py-1.5 text-sm rounded-full ${
//                 activeTab === tab
//                   ? "bg-red-600 text-white"
//                   : "bg-red-100 text-red-700 hover:bg-red-200"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}

//           <DropDown
//             name="status"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             options={["Active", "Inactive"]}
//             className="text-sm"
//           />
//         </div>

//         <Button
//           color="red"
//           variant="custom"
//           size="sm"
//           onClick={() => {
//             setEditingStaff(null);
//             setIsModalOpen(true);
//           }}
//           className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md"
//         >
//           <FiPlus />
//           Add Staff
//         </Button>
//       </div>

//       {/* Date Nav + Month + Search + Summary */}
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <div className="flex items-center gap-2 flex-wrap">
//           <Button className="p-2 bg-gray-100 rounded" onClick={handlePrevDay}>
//             <FaChevronLeft size={12} />
//           </Button>
//           <div className="px-3 py-1 bg-green-600 text-white rounded text-sm font-semibold text-center">
//             {formatDate(selectedDate)}
//             <br />
//             {formatDay(selectedDate)}
//           </div>
//           <Button className="p-2 bg-gray-100 rounded" onClick={handleNextDay}>
//             <FaChevronRight size={12} />
//           </Button>

//           <label className="relative cursor-pointer text-sm font-medium">
//             <div className="px-3 py-1.5 bg-gray-100 border rounded-md">
//               {formatMonth(selectedDate)}
//             </div>
//             <input
//               type="month"
//               value={selectedDate.toISOString().slice(0, 7)}
//               onChange={handleMonthChange}
//               className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
//             />
//           </label>

//           <input
//             type="text"
//             placeholder="Search"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="border px-3 py-1.5 text-sm rounded-md w-60"
//           />
//         </div>

//         <div className="text-sm text-gray-600 space-x-3 text-right">
//           <span className="font-semibold text-black">{summary.present} Present</span>
//           <span className="text-gray-400">{summary.absent} Absent</span>
//           <span className="text-gray-400">{summary.paidLeave} Paid Leave</span>
//           <span className="text-gray-400">{summary.weekOff} Week Off</span>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-auto rounded-xl border">
//         <table className="min-w-full text-sm text-gray-700">
//           <thead className="bg-red-50 text-left">
//             <tr>
//               <th className="px-4 py-2">Name</th>
//               <th className="px-4 py-2">Type</th>
//               <th className="px-4 py-2">Attendance</th>
//               <th className="px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="4" className="text-center py-6">
//                   Loading...
//                 </td>
//               </tr>
//             ) : filteredStaff.length === 0 ? (
//               <tr>
//                 <td colSpan="4" className="text-center text-gray-400 py-8">
//                   No data available
//                 </td>
//               </tr>
//             ) : (
//               filteredStaff.map((s) => (
//                 <tr key={s._id}>
//                   <td className="px-4 py-2">{s.name}</td>
//                   <td className="px-4 py-2">{s.type}</td>
//                   <td className="px-4 py-2">
//                     <select
//                       value={attendanceRecords[currentDateKey]?.[s._id] || ""}
//                       onChange={(e) => handleAttendanceChange(s._id, e.target.value)}
//                       className="border rounded px-2 py-1 text-sm"
//                     >
//                       <option value="">-- Select --</option>
//                       {attendanceOptions.map((opt) => (
//                         <option key={opt} value={opt}>
//                           {opt}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   <td className="px-4 py-2">
//                     <div className="relative group inline-block">
//                       <FiMoreVertical className="cursor-pointer" />
//                       <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg hidden group-hover:block z-10">
//                         <button
//                           className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
//                           onClick={() => {
//                             setEditingStaff(s);
//                             setIsModalOpen(true);
//                           }}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-600"
//                           onClick={() => handleDeleteStaff(s._id)}
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Add/Edit Staff Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl w-96">
//             <h2 className="text-lg font-semibold mb-4">
//               {editingStaff ? "Edit Staff" : "Add Staff"}
//             </h2>
//             <form onSubmit={handleAddStaff} className="space-y-4">
//               <input
//                 type="text"
//                 name="name"
//                 defaultValue={editingStaff?.name || ""}
//                 placeholder="Enter name"
//                 required
//                 className="w-full border px-3 py-2 rounded-md"
//               />
//               <select
//                 name="type"
//                 defaultValue={editingStaff?.type || "Site Staff"}
//                 required
//                 className="w-full border px-3 py-2 rounded-md"
//               >
//                 <option value="Site Staff">Site Staff</option>
//                 <option value="Labour Contractor">Labour Contractor</option>
//               </select>
//               <div className="flex justify-end gap-2">
//                 <Button
//                   variant="custom"
//                   type="button"
//                   onClick={() => {
//                     setIsModalOpen(false);
//                     setEditingStaff(null);
//                   }}
//                   className="px-4 py-2 bg-gray-200 rounded-md"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="custom"
//                   type="submit"
//                   className="px-4 py-2 bg-red-600 text-white rounded-md"
//                 >
//                   Save
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectAttendance;
