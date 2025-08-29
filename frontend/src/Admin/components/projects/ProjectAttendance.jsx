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
import { createUser } from "../../../services/leadServices";
import { toast } from "react-toastify";

const tabs = ["All", "Site Staff", "Labour Contractor"];
const attendanceOptions = ["Present", "Absent", "Paid Leave", "Week Off"];

const ProjectAttendance = ({ projectId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("Site Staff");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

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
        setStaff(data.staff || []);
        setAttendanceRecords(data.records || {});
      } catch (err) {
        console.error("Error fetching project attendance:", err);
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
      if (
        searchTerm &&
        !s.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    });
  }, [staff, activeTab, statusFilter, searchTerm]);

  // 📌 Summary
  const summary = useMemo(() => {
    const todayRecords = attendanceRecords[currentDateKey] || {};
    return {
      present: filteredStaff.filter((s) => todayRecords[s._id] === "Present")
        .length,
      absent: filteredStaff.filter((s) => todayRecords[s._id] === "Absent")
        .length,
      paidLeave: filteredStaff.filter(
        (s) => todayRecords[s._id] === "Paid Leave"
      ).length,
      weekOff: filteredStaff.filter((s) => todayRecords[s._id] === "Week Off")
        .length,
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
        // Ideally you should call an updateUser API here
        setStaff((prev) =>
          prev.map((s) => (s._id === editingStaff._id ? { ...s, ...staffData } : s))
        );
        toast.success("Staff updated successfully");
      } else {
        const saved = await createUser(staffData);
        setStaff([...staff, saved]); // backend returns {_id, name, type, status}
        toast.success("Staff added successfully");
      }
    } catch (err) {
      console.error("Error saving staff:", err);
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
    } catch (err) {
      console.error("Error updating attendance:", err);
      toast.error("Failed to update attendance");
    }
  };

  // 📌 Delete Staff
  const handleDeleteStaff = async (_id) => {
    try {
      await deleteProjectAttendance(_id);
      setStaff((prev) => prev.filter((s) => s._id !== _id));
      toast.success("Staff deleted successfully");
    } catch (err) {
      console.error("Error deleting staff:", err);
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
            {summary.present} Present
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
                  </td>
                  <td className="px-4 py-2">
                    <div className="relative group inline-block">
                      <FiMoreVertical className="cursor-pointer" />
                      <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg hidden group-hover:block z-10">
                        <button
                          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                          onClick={() => {
                            setEditingStaff(s);
                            setIsModalOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-600"
                          onClick={() => handleDeleteStaff(s._id)}
                        >
                          Delete
                        </button>
                      </div>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
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

// import React, { useState, useMemo } from "react";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { FiPlus } from "react-icons/fi";
// import Button from "../../../components/Button";
// import DropDown from "../../../components/DropDown";
// import { createUser } from "../../../services/leadServices";
// const tabs = ["All", "Site Staff", "Labour Contractor"];
// const attendanceOptions = ["Present", "Absent", "Paid Leave", "Week Off"];

// const ProjectAttendance = ({ projectId }) => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [activeTab, setActiveTab] = useState("Site Staff");
//   const [statusFilter, setStatusFilter] = useState("Active");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Staff master list
//   const [staff, setStaff] = useState([
//     { id: 1, name: "John Doe", type: "Site Staff", status: "Active" },
//     {
//       id: 2,
//       name: "Jane Smith",
//       type: "Labour Contractor",
//       status: "Inactive",
//     },
//     { id: 3, name: "Alex Lee", type: "Site Staff", status: "Active" },
//   ]);

//   // Attendance records by date
//   const [attendanceRecords, setAttendanceRecords] = useState({
//     // Example: "2025-08-28": { 1: "Present", 2: "Absent" }
//   });

//   // Get current date string
//   const currentDateKey = selectedDate.toISOString().slice(0, 10);

//   // Filtering logic
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

//   // Summary counts
//   const summary = useMemo(() => {
//     const todayRecords = attendanceRecords[currentDateKey] || {};
//     return {
//       present: filteredStaff.filter((s) => todayRecords[s.id] === "Present")
//         .length,
//       absent: filteredStaff.filter((s) => todayRecords[s.id] === "Absent")
//         .length,
//       paidLeave: filteredStaff.filter(
//         (s) => todayRecords[s.id] === "Paid Leave"
//       ).length,
//       weekOff: filteredStaff.filter((s) => todayRecords[s.id] === "Week Off")
//         .length,
//     };
//   }, [filteredStaff, attendanceRecords, currentDateKey]);

//   // Date navigation
//   const handlePrevDay = () => {
//     setSelectedDate((prev) => {
//       const newDate = new Date(prev);
//       newDate.setDate(newDate.getDate() - 1);
//       return newDate;
//     });
//   };

//   const handleNextDay = () => {
//     setSelectedDate((prev) => {
//       const newDate = new Date(prev);
//       newDate.setDate(newDate.getDate() + 1);
//       return newDate;
//     });
//   };

//   const formatDay = (date) =>
//     new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);

//   const formatDate = (date) => date.getDate();

//   const formatMonth = (date) =>
//     new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);

//   const handleMonthChange = (e) => {
//     const [year, month] = e.target.value.split("-");
//     setSelectedDate(new Date(year, month - 1, 1));
//   };

//   // Add Staff
//   const handleAddStaff = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const newStaff = {
//       id: Date.now(),
//       name: formData.get("name"),
//       type: formData.get("type"),
//       status: "Active",
//     };
//     setStaff([...staff, newStaff]);
//     setIsModalOpen(false);
//   };

//   // Change attendance for a staff on selected date
//   const handleAttendanceChange = (staffId, value) => {
//     setAttendanceRecords((prev) => {
//       const updated = { ...(prev[currentDateKey] || {}) };
//       updated[staffId] = value;
//       return { ...prev, [currentDateKey]: updated };
//     });
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
//           onClick={() => setIsModalOpen(true)}
//           className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md"
//         >
//           <FiPlus />
//           Add Staff
//         </Button>
//       </div>

//       {/* Date Nav + Month + Search + Summary */}
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <div className="flex items-center gap-2 flex-wrap">
//           <Button
//             className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//             onClick={handlePrevDay}
//           >
//             <FaChevronLeft size={12} />
//           </Button>

//           <div className="px-3 py-1 bg-green-600 text-white rounded text-sm font-semibold text-center">
//             {formatDate(selectedDate)}
//             <br />
//             {formatDay(selectedDate)}
//           </div>

//           <Button
//             className="p-2 bg-gray-100 rounded hover:bg-gray-200"
//             onClick={handleNextDay}
//           >
//             <FaChevronRight size={12} />
//           </Button>

//           <label className="relative cursor-pointer text-sm font-medium">
//             <div className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
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
//             className="border border-gray-300 px-3 py-1.5 text-sm rounded-md w-60"
//           />
//         </div>

//         <div className="text-sm text-gray-600 space-x-3 text-right">
//           <span className="font-semibold text-black">
//             {summary.present} Present
//           </span>
//           <span className="text-gray-400">{summary.absent} Absent</span>
//           <span className="text-gray-400">{summary.paidLeave} Paid Leave</span>
//           <span className="text-gray-400">{summary.weekOff} Week Off</span>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-auto rounded-xl border border-gray-200">
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
//             {filteredStaff.length === 0 ? (
//               <tr>
//                 <td colSpan="3" className="text-center text-gray-400 py-8">
//                   No data available
//                 </td>
//               </tr>
//             ) : (
//               filteredStaff.map((s) => (
//                 <tr key={s.id}>
//                   <td className="px-4 py-2">{s.name}</td>
//                   <td className="px-4 py-2">{s.type}</td>
//                   <td className="px-4 py-2">
//                     <select
//                       value={attendanceRecords[currentDateKey]?.[s.id] || ""}
//                       onChange={(e) =>
//                         handleAttendanceChange(s.id, e.target.value)
//                       }
//                       className="border border-gray-300 rounded px-2 py-1 text-sm"
//                     >
//                       <option value="">-- Select --</option>
//                       {attendanceOptions.map((opt) => (
//                         <option key={opt} value={opt}>
//                           {opt}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Add Staff Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl w-96">
//             <h2 className="text-lg font-semibold mb-4">Add Staff</h2>
//             <form onSubmit={handleAddStaff} className="space-y-4">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Enter name"
//                 required
//                 className="w-full border px-3 py-2 rounded-md"
//               />
//               <select
//                 name="type"
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
//                   onClick={() => setIsModalOpen(false)}
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
