import React, { useState, useMemo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import Button from "../../../components/Button";
import DropDown from "../../../components/DropDown";

const tabs = ["All", "Site Staff", "Labour Contractor"];
const attendanceOptions = ["Present", "Absent", "Paid Leave", "Week Off"];

const ProjectAttendance = ({ projectId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("Site Staff");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Staff master list
  const [staff, setStaff] = useState([
    { id: 1, name: "John Doe", type: "Site Staff", status: "Active" },
    { id: 2, name: "Jane Smith", type: "Labour Contractor", status: "Inactive" },
    { id: 3, name: "Alex Lee", type: "Site Staff", status: "Active" },
  ]);

  // Attendance records by date
  const [attendanceRecords, setAttendanceRecords] = useState({
    // Example: "2025-08-28": { 1: "Present", 2: "Absent" }
  });

  // Get current date string
  const currentDateKey = selectedDate.toISOString().slice(0, 10);

  // Filtering logic
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      if (activeTab !== "All" && s.type !== activeTab) return false;
      if (statusFilter && s.status !== statusFilter) return false;
      if (searchTerm && !s.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [staff, activeTab, statusFilter, searchTerm]);

  // Summary counts
  const summary = useMemo(() => {
    const todayRecords = attendanceRecords[currentDateKey] || {};
    return {
      present: filteredStaff.filter((s) => todayRecords[s.id] === "Present").length,
      absent: filteredStaff.filter((s) => todayRecords[s.id] === "Absent").length,
      paidLeave: filteredStaff.filter((s) => todayRecords[s.id] === "Paid Leave").length,
      weekOff: filteredStaff.filter((s) => todayRecords[s.id] === "Week Off").length,
    };
  }, [filteredStaff, attendanceRecords, currentDateKey]);

  // Date navigation
  const handlePrevDay = () => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const formatDay = (date) =>
    new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);

  const formatDate = (date) => date.getDate();

  const formatMonth = (date) =>
    new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split("-");
    setSelectedDate(new Date(year, month - 1, 1));
  };

  // Add Staff
  const handleAddStaff = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newStaff = {
      id: Date.now(),
      name: formData.get("name"),
      type: formData.get("type"),
      status: "Active",
    };
    setStaff([...staff, newStaff]);
    setIsModalOpen(false);
  };

  // Change attendance for a staff on selected date
  const handleAttendanceChange = (staffId, value) => {
    setAttendanceRecords((prev) => {
      const updated = { ...(prev[currentDateKey] || {}) };
      updated[staffId] = value;
      return { ...prev, [currentDateKey]: updated };
    });
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
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md"
        >
          <FiPlus />
          Add Staff
        </Button>
      </div>

      {/* Date Nav + Month + Search + Summary */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            className="p-2 bg-gray-100 rounded hover:bg-gray-200"
            onClick={handlePrevDay}
          >
            <FaChevronLeft size={12} />
          </Button>

          <div className="px-3 py-1 bg-green-600 text-white rounded text-sm font-semibold text-center">
            {formatDate(selectedDate)}
            <br />
            {formatDay(selectedDate)}
          </div>

          <Button
            className="p-2 bg-gray-100 rounded hover:bg-gray-200"
            onClick={handleNextDay}
          >
            <FaChevronRight size={12} />
          </Button>

          <label className="relative cursor-pointer text-sm font-medium">
            <div className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
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
            className="border border-gray-300 px-3 py-1.5 text-sm rounded-md w-60"
          />
        </div>

        <div className="text-sm text-gray-600 space-x-3 text-right">
          <span className="font-semibold text-black">{summary.present} Present</span>
          <span className="text-gray-400">{summary.absent} Absent</span>
          <span className="text-gray-400">{summary.paidLeave} Paid Leave</span>
          <span className="text-gray-400">{summary.weekOff} Week Off</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-red-50 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-gray-400 py-8">
                  No data available
                </td>
              </tr>
            ) : (
              filteredStaff.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.type}</td>
                  <td className="px-4 py-2">
                    <select
                      value={attendanceRecords[currentDateKey]?.[s.id] || ""}
                      onChange={(e) => handleAttendanceChange(s.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="">-- Select --</option>
                      {attendanceOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-lg font-semibold mb-4">Add Staff</h2>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Enter name"
                required
                className="w-full border px-3 py-2 rounded-md"
              />
              <select
                name="type"
                required
                className="w-full border px-3 py-2 rounded-md"
              >
                <option value="Site Staff">Site Staff</option>
                <option value="Labour Contractor">Labour Contractor</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAttendance;

// import React, { useState } from "react";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { FiPlus } from "react-icons/fi";
// import Button from "../../../components/Button";
// import DropDown from "../../../components/DropDown";

// const tabs = ["All", "Site Staff", "Labour Contractor"];

// const ProjectAttendance = ({ projectId }) => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [activeTab, setActiveTab] = useState("Site Staff");

//   const handlePrevDay = () => {
//     setSelectedDate((prev) => {
//       const newDate = new Date(prev); // copy
//       newDate.setDate(newDate.getDate() - 1);
//       return newDate;
//     });
//   };

//   const handleNextDay = () => {
//     setSelectedDate((prev) => {
//       const newDate = new Date(prev); // copy
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

//   return (
//     <div className="p-4 md:p-6 space-y-4 bg-white w-full m-4 rounded-xl">
//       {/* Top Row: Tabs + DropDown + Button */}
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
//             value="Active"
//             onChange={() => {}}
//             options={["Active", "Inactive"]}
//             className="text-sm"
//           />
//         </div>

//         <Button
//           color="red"
//           variant="custom"
//           size="sm"
//           className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md"
//         >
//           <FiPlus />
//           Add Site Staff
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

//           {/* Custom Month Picker (Styled Card) */}
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

//           {/* Search */}
//           <input
//             type="text"
//             placeholder="Search"
//             className="border border-gray-300 px-3 py-1.5 text-sm rounded-md w-60"
//           />
//         </div>

//         {/* Attendance Summary */}
//         <div className="text-sm text-gray-600 space-x-3 text-right">
//           <span className="font-semibold text-black">0 Present</span>
//           <span className="text-gray-400">0 Absent</span>
//           <span className="text-gray-400">0 Paid Leave</span>
//           <span className="text-gray-400">0 Week Off</span>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-auto rounded-xl border border-gray-200">
//         <table className="min-w-full text-sm text-gray-700">
//           <thead className="bg-red-50 text-left">
//             <tr>
//               <th className="px-4 py-2">Name</th>
//               <th className="px-4 py-2">Attendance status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {activeTab === "Site Staff" ? (
//               <tr>
//                 <td colSpan="2" className="text-center text-gray-400 py-8">
//                   No site staff added
//                 </td>
//               </tr>
//             ) : activeTab === "Labour Contractor" ? (
//               <tr>
//                 <td colSpan="2" className="text-center text-gray-400 py-8">
//                   No contractors added
//                 </td>
//               </tr>
//             ) : (
//               <tr>
//                 <td colSpan="2" className="text-center text-gray-400 py-8">
//                   No data available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ProjectAttendance;
