
import React, { useState, useMemo, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiPlus, FiMoreVertical } from "react-icons/fi";
import Button from "../../../components/Button";
import DropDown from "../../../components/DropDown";
import {
  createStaff,
  updateStaff,
  fetchStaffByProject,
} from "../../../services/staffServices";
import { markStaffAttendance } from "../../../services/staffServices"; // New API
import { toast } from "react-toastify";

const tabs = ["All", "Site Staff", "Labour Contractor"];
const attendanceOptions = [
  "Full Day",
  "Half Day",
  "Absent",
  "Paid Leave",
  "Week Off",
];

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

  // Fetch staff & attendance (attendance from staff records)
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const staffData = await fetchStaffByProject(projectId);
        setStaff(staffData);

        // Load existing attendance from staff records if present
        const records = {};
        staffData.forEach((s) => {
          if (s.attendance?.length > 0) {
            s.attendance.forEach((entry) => {
              const dateKey = new Date(entry.date).toISOString().slice(0, 10);
              if (!records[dateKey]) records[dateKey] = {};
              records[dateKey][s._id] = {
                _id: entry._id,
                status: entry.status,
              };
            });
          }
        });
        setAttendanceRecords(records);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load staff or attendance");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [projectId]);

  // Filter staff
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      if (activeTab !== "All" && s.personType !== activeTab) return false;
      if (statusFilter && s.status !== statusFilter) return false;
      if (searchTerm && !s.name.toLowerCase().includes(searchTerm.toLowerCase()))
        return false;
      return true;
    });
  }, [staff, activeTab, statusFilter, searchTerm]);

  // Summary
  const summary = useMemo(() => {
    const todayRecords = attendanceRecords[currentDateKey] || {};
    return {
      present: filteredStaff.filter(
        (s) => todayRecords[s._id]?.status === "Full Day"
      ).length,
      absent: filteredStaff.filter(
        (s) => todayRecords[s._id]?.status === "Absent"
      ).length,
      paidLeave: filteredStaff.filter(
        (s) => todayRecords[s._id]?.status === "Paid Leave"
      ).length,
      weekOff: filteredStaff.filter(
        (s) => todayRecords[s._id]?.status === "Week Off"
      ).length,
    };
  }, [filteredStaff, attendanceRecords, currentDateKey]);

  // Date navigation
  const handlePrevDay = () =>
    setSelectedDate((prev) => new Date(prev.getTime() - 24 * 60 * 60 * 1000));
  const handleNextDay = () =>
    setSelectedDate((prev) => new Date(prev.getTime() + 24 * 60 * 60 * 1000));

  const formatDay = (date) =>
    new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
  const formatDate = (date) => date.getDate();
  const formatMonth = (date) =>
    new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split("-");
    setSelectedDate(new Date(year, month - 1, 1));
  };

  // Add / Edit Staff
  const handleAddStaff = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const staffData = {
      name: formData.get("name"),
      personType: formData.get("personType"),
      projectId,
    };
    try {
      if (editingStaff) {
        setStaff((prev) =>
          prev.map((s) => (s._id === editingStaff._id ? { ...s, ...staffData } : s))
        );
        await updateStaff(editingStaff._id, staffData);
        toast.success("Staff updated successfully");
      } else {
        const saved = await createStaff(staffData);
        setStaff((prev) => [...prev, saved]);
        toast.success("Staff added successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save staff");
    } finally {
      setIsModalOpen(false);
      setEditingStaff(null);
    }
  };

  // Mark Attendance
  const handleAttendanceChange = async (staffId, value) => {
    try {
      const staffMember = staff.find((s) => s._id === staffId);
      if (!staffMember) return;

      const record = {
        date: currentDateKey,
        status: value,
        projectId,
      };

      const updatedRecord = await markStaffAttendance(staffId, record);

      setAttendanceRecords((prev) => {
        const updated = { ...(prev[currentDateKey] || {}) };
        updated[staffId] = {
          _id: updatedRecord._id,
          status: updatedRecord.status,
        };
        return { ...prev, [currentDateKey]: updated };
      });

      toast.success("Attendance updated successfully");
    } catch (err) {
      console.error("Mark Attendance Error:", err);
      toast.error("Failed to update attendance");
    }
  };

  // Delete Staff
  const handleDeleteStaff = async (_id) => {
    try {
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
          <span className="font-semibold text-black">
            {summary.present} Full Day
          </span>
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
              <th className="px-4 py-2">Person Type</th>
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
                  No staff found
                </td>
              </tr>
            ) : (
              filteredStaff.map((s) => (
                <tr key={s._id}>
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.personType}</td>
                  <td className="px-4 py-2">
                    {attendanceRecords[currentDateKey]?.[s._id]?.status ? (
                      <span className="text-gray-800 font-medium">
                        {attendanceRecords[currentDateKey][s._id].status}
                      </span>
                    ) : (
                      <select
                        value=""
                        onChange={(e) =>
                          handleAttendanceChange(s._id, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="">-- Select --</option>
                        {attendanceOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}
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
                name="personType"
                defaultValue={editingStaff?.personType || "Site Staff"}
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
// import {
//   createStaff,
//   updateStaff,
//   fetchStaffByProject,
// } from "../../../services/staffServices";
// import { toast } from "react-toastify";

// const tabs = ["All", "Site Staff", "Labour Contractor"];
// const attendanceOptions = [
//   "Full Day",
//   "Half Day",
//   "Absent",
//   "Paid Leave",
//   "Week Off",
// ];

// const ProjectAttendance = ({ projectId }) => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [activeTab, setActiveTab] = useState("Site Staff");
//   const [statusFilter, setStatusFilter] = useState("Active");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingStaff, setEditingStaff] = useState(null);
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const [staff, setStaff] = useState([]);
//   const [attendanceRecords, setAttendanceRecords] = useState({});
//   const [loading, setLoading] = useState(true);

//   const currentDateKey = selectedDate.toISOString().slice(0, 10);

//   // Fetch staff & attendance
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);

//         // 1. Staff
//         const staffData = await fetchStaffByProject(projectId);
//         setStaff(staffData);


//         // 2. Attendance
//         const attendanceData = await fetchProjectAttendance(projectId);
//         const records = {};
//         attendanceData.attendance?.forEach((entry) => {
//           const staffId = entry.staffId || entry._id;
//           if (!entry.date || !staffId) return;

//           const dateKey = new Date(entry.date?.$date || entry.date)
//             .toISOString()
//             .slice(0, 10);

//           if (!records[dateKey]) records[dateKey] = {};
//           records[dateKey][staffId] = {
//             _id: entry._id,
//             status: entry.status,
//           };
//         });

//         setAttendanceRecords(records);
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load staff or attendance");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [projectId]);

//   // Filter staff
//   const filteredStaff = useMemo(() => {
//     return staff.filter((s) => {
//       if (activeTab !== "All" && s.personType !== activeTab) return false;
//       if (statusFilter && s.status !== statusFilter) return false;
//       if (
//         searchTerm &&
//         !s.name.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//         return false;
//       return true;
//     });
//   }, [staff, activeTab, statusFilter, searchTerm]);

//   // Summary
//   const summary = useMemo(() => {
//     const todayRecords = attendanceRecords[currentDateKey] || {};
//     return {
//       present: filteredStaff.filter(
//         (s) => todayRecords[s._id]?.status === "Full Day"
//       ).length,
//       absent: filteredStaff.filter(
//         (s) => todayRecords[s._id]?.status === "Absent"
//       ).length,
//       paidLeave: filteredStaff.filter(
//         (s) => todayRecords[s._id]?.status === "Paid Leave"
//       ).length,
//       weekOff: filteredStaff.filter(
//         (s) => todayRecords[s._id]?.status === "Week Off"
//       ).length,
//     };
//   }, [filteredStaff, attendanceRecords, currentDateKey]);

//   // Date navigation
//   const handlePrevDay = () =>
//     setSelectedDate((prev) => new Date(prev.getTime() - 24 * 60 * 60 * 1000));
//   const handleNextDay = () =>
//     setSelectedDate((prev) => new Date(prev.getTime() + 24 * 60 * 60 * 1000));

//   const formatDay = (date) =>
//     new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
//   const formatDate = (date) => date.getDate();
//   const formatMonth = (date) =>
//     new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);

//   const handleMonthChange = (e) => {
//     const [year, month] = e.target.value.split("-");
//     setSelectedDate(new Date(year, month - 1, 1));
//   };

//   // Add / Edit Staff
//   const handleAddStaff = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);

//     const staffData = {
//       name: formData.get("name"),
//       personType: formData.get("personType"),
//       projectId,
//     };

//     try {
//       if (editingStaff) {
//         setStaff((prev) =>
//           prev.map((s) =>
//             s._id === editingStaff._id ? { ...s, ...staffData } : s
//           )
//         );
//         await updateStaff(editingStaff._id, staffData);
//         toast.success("Staff updated successfully");
//       } else {
//         const saved = await createStaff(staffData);
//         setStaff((prev) => [...prev, saved]);
//         toast.success("Staff added successfully");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to save staff");
//     } finally {
//       setIsModalOpen(false);
//       setEditingStaff(null);
//     }
//   };

//   // Change Attendance
//   const handleAttendanceChange = async (staffId, value) => {
//     try {
//       const staffMember = staff.find((s) => s._id === staffId);
//       if (!staffMember) return;

//       const existingRecord = attendanceRecords[currentDateKey]?.[staffId];

//       const record = {
//         staffId,
//         name: staffMember.name,
//         personType: staffMember.personType,
//         date: currentDateKey,
//         status: value,
//         projectId,
//       };

//       if (existingRecord?._id) {
//         await updateProjectAttendance(existingRecord._id, record);
//         record._id = existingRecord._id;
//       } else {
//         const created = await createProjectAttendance(record);
//         record._id = created._id;
//       }

//       setAttendanceRecords((prev) => {
//         const updated = { ...(prev[currentDateKey] || {}) };
//         updated[staffId] = record;
//         return { ...prev, [currentDateKey]: updated };
//       });

//       toast.success("Attendance updated");
//     } catch (err) {
//       console.error("Create/Update Project Attendance Error:", err);
//       toast.error("Failed to update attendance");
//     }
//   };

//   // Delete Staff
//   const handleDeleteStaff = async (_id) => {
//     try {
//       await deleteProjectAttendance(_id);
//       setStaff((prev) => prev.filter((s) => s._id !== _id));
//       toast.success("Staff deleted successfully");
//     } catch {
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
//           <span className="font-semibold text-black">
//             {summary.present} Full Day
//           </span>
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
//               <th className="px-4 py-2">Person Type</th>
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
//                   No staff found
//                 </td>
//               </tr>
//             ) : (
//               filteredStaff.map((s) => (
//                 <tr key={s._id}>
//                   <td className="px-4 py-2">{s.name}</td>
//                   <td className="px-4 py-2">{s.personType}</td>
//                   <td className="px-4 py-2">
//                     <select
//                       value={
//                         attendanceRecords[currentDateKey]?.[s._id]?.status || ""
//                       }
//                       onChange={(e) =>
//                         handleAttendanceChange(s._id, e.target.value)
//                       }
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
//                     <div className="relative inline-block">
//                       <FiMoreVertical
//                         className="cursor-pointer"
//                         onClick={() =>
//                           setOpenMenuId(openMenuId === s._id ? null : s._id)
//                         }
//                       />
//                       {openMenuId === s._id && (
//                         <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg z-10">
//                           <button
//                             className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
//                             onClick={() => {
//                               setEditingStaff(s);
//                               setIsModalOpen(true);
//                               setOpenMenuId(null);
//                             }}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-600"
//                             onClick={() => {
//                               handleDeleteStaff(s._id);
//                               setOpenMenuId(null);
//                             }}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       )}
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
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
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
//                 name="personType"
//                 defaultValue={editingStaff?.personType || "Site Staff"}
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
// import {
//   createStaff,
//   updateStaff,
//   fetchStaffByProject,
// } from "../../../services/staffServices";
// import { toast } from "react-toastify";

// const tabs = ["All", "Site Staff", "Labour Contractor"];
// const attendanceOptions = [
//   "Full Day",
//   "Half Day",
//   "Absent",
//   "Paid Leave",
//   "Week Off",
// ];

// const ProjectAttendance = ({ projectId }) => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [activeTab, setActiveTab] = useState("Site Staff");
//   const [statusFilter, setStatusFilter] = useState("Active");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingStaff, setEditingStaff] = useState(null);
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const [staff, setStaff] = useState([]);
//   const [attendanceRecords, setAttendanceRecords] = useState({});
//   const [loading, setLoading] = useState(true);

//   const currentDateKey = selectedDate.toISOString().slice(0, 10);

//   // // Fetch project attendance
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);

//         // 1. Fetch staff for this project
//         const staffData = await fetchStaffByProject(projectId);
//         setStaff(staffData.staff || []); // use the array inside response

//         // const staffData = await fetchStaffByProject (projectId); // returns array of staff
//         // setStaff(staffData);

//         // 2. Fetch attendance for this project
//         const attendanceData = await fetchProjectAttendance(projectId);
//         const records = {};
//         attendanceData.attendance?.forEach((entry) => {
//           const staffId = entry.staffId || entry._id;
//           if (!entry.date || !staffId) return;

//           const dateKey = new Date(entry.date?.$date || entry.date)
//             .toISOString()
//             .slice(0, 10);

//           if (!records[dateKey]) records[dateKey] = {};
//           records[dateKey][staffId] = {
//             _id: entry._id,
//             status: entry.status,
//           };
//         });

//         setAttendanceRecords(records);
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load staff or attendance");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [projectId]);

//   // Filter staff
//   const filteredStaff = useMemo(() => {
//     return staff.filter((s) => {
//       if (activeTab !== "All" && s.type !== activeTab) return false;
//       if (statusFilter && s.status !== statusFilter) return false;
//       if (
//         searchTerm &&
//         !s.name.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//         return false;
//       return true;
//     });
//   }, [staff, activeTab, statusFilter, searchTerm]);

//   // Summary
//   const summary = useMemo(() => {
//     const todayRecords = attendanceRecords[currentDateKey] || {};
//     return {
//       present: filteredStaff.filter(
//         (s) => todayRecords[s._id]?.status === "Full Day"
//       ).length,
//       absent: filteredStaff.filter(
//         (s) => todayRecords[s._id]?.status === "Absent"
//       ).length,
//       paidLeave: filteredStaff.filter(
//         (s) => todayRecords[s._id]?.status === "Paid Leave"
//       ).length,
//       weekOff: filteredStaff.filter(
//         (s) => todayRecords[s._id]?.status === "Week Off"
//       ).length,
//     };
//   }, [filteredStaff, attendanceRecords, currentDateKey]);

//   // Date navigation
//   const handlePrevDay = () =>
//     setSelectedDate((prev) => new Date(prev.getTime() - 24 * 60 * 60 * 1000));
//   const handleNextDay = () =>
//     setSelectedDate((prev) => new Date(prev.getTime() + 24 * 60 * 60 * 1000));

//   const formatDay = (date) =>
//     new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
//   const formatDate = (date) => date.getDate();
//   const formatMonth = (date) =>
//     new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);

//   const handleMonthChange = (e) => {
//     const [year, month] = e.target.value.split("-");
//     setSelectedDate(new Date(year, month - 1, 1));
//   };

//   // Add / Edit Staff
//   const handleAddStaff = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);

//     const staffData = {
//       name: formData.get("name"),
//       personType: formData.get("type"),
//       projectId,
//     };

//     try {
//       if (editingStaff) {
//         setStaff((prev) =>
//           prev.map((s) =>
//             s._id === editingStaff._id ? { ...s, ...staffData } : s
//           )
//         );
//         await updateStaff(editingStaff._id, staffData);
//         toast.success("Staff updated successfully");
//       } else {
//         const saved = await createStaff(staffData);
//         setStaff((prev) => [...prev, saved]);
//         toast.success("Staff added successfully");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to save staff");
//     } finally {
//       setIsModalOpen(false);
//       setEditingStaff(null);
//     }
//   };

//   // // Change Attendance
//   const handleAttendanceChange = async (staffId, value) => {
//     try {
//       const staffMember = staff.find((s) => s._id === staffId);
//       if (!staffMember) return;

//       const existingRecord = attendanceRecords[currentDateKey]?.[staffId];

//       const record = {
//         staffId,
//         name: staffMember.name,
//         personType: staffMember.type,
//         date: currentDateKey,
//         status: value,
//         projectId,
//       };

//       if (existingRecord?._id) {
//         await updateProjectAttendance(existingRecord._id, record);
//         record._id = existingRecord._id;
//       } else {
//         const created = await createProjectAttendance(record);
//         record._id = created._id;
//       }

//       setAttendanceRecords((prev) => {
//         const updated = { ...(prev[currentDateKey] || {}) };
//         updated[staffId] = record;
//         return { ...prev, [currentDateKey]: updated };
//       });

//       toast.success("Attendance updated");
//     } catch (err) {
//       console.error("Create/Update Project Attendance Error:", err);
//       toast.error("Failed to update attendance");
//     }
//   };

//   // Delete Staff
//   const handleDeleteStaff = async (_id) => {
//     try {
//       await deleteProjectAttendance(_id);
//       setStaff((prev) => prev.filter((s) => s._id !== _id));
//       toast.success("Staff deleted successfully");
//     } catch {
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
//           <span className="font-semibold text-black">
//             {summary.present} Full Day
//           </span>
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
//                       value={
//                         attendanceRecords[currentDateKey]?.[s._id]?.status || ""
//                       }
//                       onChange={(e) =>
//                         handleAttendanceChange(s._id, e.target.value)
//                       }
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
//                     <div className="relative inline-block">
//                       <FiMoreVertical
//                         className="cursor-pointer"
//                         onClick={() =>
//                           setOpenMenuId(openMenuId === s._id ? null : s._id)
//                         }
//                       />
//                       {openMenuId === s._id && (
//                         <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg z-10">
//                           <button
//                             className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
//                             onClick={() => {
//                               setEditingStaff(s);
//                               setIsModalOpen(true);
//                               setOpenMenuId(null);
//                             }}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-600"
//                             onClick={() => {
//                               handleDeleteStaff(s._id);
//                               setOpenMenuId(null);
//                             }}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       )}
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
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
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
