import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import Button from "../../../components/Button";
import DropDown from "../../../components/DropDown";

const tabs = ["All", "Site Staff", "Labour Contractor"];

const ProjectAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("Site Staff");

  const handlePrevDay = () => {
    setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() + 1)));
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

  return (
    <div className="p-4 md:p-6 space-y-4 bg-white w-full">
      {/* Top Row: Tabs + DropDown + Button */}
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
            value="Active"
            onChange={() => {}}
            options={["Active", "Inactive"]}
            className="text-sm"
          />
        </div>

        <Button
          color="red"
          variant="custom"
          size="sm"
          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md"
        >
          <FiPlus />
          Add Site Staff
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

          {/* Custom Month Picker (Styled Card) */}
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

          {/* Search */}
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-300 px-3 py-1.5 text-sm rounded-md w-60"
          />
        </div>

        {/* Attendance Summary */}
        <div className="text-sm text-gray-600 space-x-3 text-right">
          <span className="font-semibold text-black">0 Present</span>
          <span className="text-gray-400">0 Absent</span>
          <span className="text-gray-400">0 Paid Leave</span>
          <span className="text-gray-400">0 Week Off</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-red-50 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Attendance status</th>
            </tr>
          </thead>
          <tbody>
            {activeTab === "Site Staff" ? (
              <tr>
                <td colSpan="2" className="text-center text-gray-400 py-8">
                  No site staff added
                </td>
              </tr>
            ) : activeTab === "Labour Contractor" ? (
              <tr>
                <td colSpan="2" className="text-center text-gray-400 py-8">
                  No contractors added
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan="2" className="text-center text-gray-400 py-8">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectAttendance;

// import React, { useState } from "react";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { FiPlus } from "react-icons/fi";
// import Button from "../../../components/Button";
// import DropDown from "../../../components/DropDown";

// const ProjectAttendance = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   const handlePrevDay = () => {
//     setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
//   };

//   const handleNextDay = () => {
//     setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() + 1)));
//   };

//   const formatDay = (date) => {
//     const options = { weekday: "short" };
//     return new Intl.DateTimeFormat("en-US", options).format(date);
//   };

//   const formatDate = (date) => {
//     return date.getDate();
//   };

//   return (
//     <div className="p-4 md:p-6 space-y-4 bg-white w-full">
//       {/* Top Row: Tabs + Status + Add */}
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <div className="flex flex-wrap items-center gap-2">
//           <button className="px-4 py-1.5 text-sm rounded-full bg-red-100 hover:bg-red-200 text-red-700">
//             All
//           </button>
//           <button className="px-4 py-1.5 text-sm rounded-full bg-red-600 hover:bg-red-700 text-white">
//             Site Staff
//           </button>
//           <button className="px-4 py-1.5 text-sm rounded-full bg-red-100 hover:bg-red-200 text-red-700">
//             Labour Contractor
//           </button>
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

//       {/* Date Nav + Calendar + Search + Summary */}
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <div className="flex items-center gap-2">
//           {/* Left button */}
//           <Button className="p-2 bg-gray-100 rounded hover:bg-gray-200" onClick={handlePrevDay}>
//             <FaChevronLeft size={12} />
//           </Button>

//           {/* Day display */}
//           <div className="px-3 py-1 bg-green-600 text-white rounded text-sm font-semibold text-center">
//             {formatDate(selectedDate)}
//             <br />
//             {formatDay(selectedDate)}
//           </div>

//           {/* Right button */}
//           <Button className="p-2 bg-gray-100 rounded hover:bg-gray-200" onClick={handleNextDay}>
//             <FaChevronRight size={12} />
//           </Button>

//           {/* Month picker */}
//           <input
//             type="month"
//             className="border border-gray-300 px-3 py-1.5 text-sm rounded-md"
//             value={selectedDate.toISOString().slice(0, 7)}
//             onChange={(e) => {
//               const [year, month] = e.target.value.split("-");
//               setSelectedDate(new Date(year, month - 1, selectedDate.getDate()));
//             }}
//           />

//           {/* Search bar */}
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
//             <tr>
//               <td colSpan="2" className="text-center text-gray-400 py-8">
//                 No site staff added
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ProjectAttendance;
