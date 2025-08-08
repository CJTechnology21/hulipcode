import React from "react";
import { FaEdit } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

function ProjectsDashboard() {
  const progressBars = [
    { label: "Work Completed", percent: 64.5, color: "bg-cyan-500" },
    { label: "Payment Disbursed", percent: 48, color: "bg-green-500" },
    { label: "Payment In Escrow", percent: 85, color: "bg-amber-500" },
  ];

  const approvals = Array(3).fill({
    request: "Mr-035 | Material Request",
    details: "20 bags POP, 20 Pc Channel\n2 Box Screw",
    change: "Quantity Change : Task 791837\nBefore : 50 Sqft Revised : 120 sqft\nRate Change\nBefore : ₹120 / Sqft Revised : ₹145 / Sqft",
  });

  const users = [
    {
      name: "Ravi",
      phone: "+91-98100223423",
      role: "Design head",
    },
    {
      name: "Ravi",
      phone: "+91-98100223423",
      role: "Project Manager",
    },
    {
      name: "Ravi",
      phone: "+91-98100223423",
      role: "Design head",
    },
  ];

  return (
    <div className="p-4 space-y-4 bg-gray-100 min-h-screen">
      {/* Progress Bar Section */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center text-sm font-semibold">
          <div className="w-full h-2 bg-gray-200 rounded-full relative overflow-hidden">
            <div className="absolute left-0 top-0 h-2 w-[0%] bg-blue-400 rounded-full"></div>
          </div>
        </div>
        <div className="flex justify-around text-xs mt-2">
          {progressBars.map((bar, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className={`w-3 h-3 rounded-full ${bar.color}`}></span>
              {bar.label} {bar.percent}%
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Project Details */}
        <div className="col-span-1 bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-lg">Project Details</h2>
            <FaEdit className="text-gray-500 cursor-pointer" />
          </div>
          <div className="text-sm space-y-1">
            <div><strong>Project Name:</strong> Amartya’s Appartment</div>
            <div><strong>Client:</strong> Brijesh Kohli - +91-9810422343</div>
            <div><strong>Address:</strong> 34H resident colony, Ashok Nagar, Delhi - 110019</div>
            <div><strong>Category:</strong> Residential</div>
            <div><strong>Scope:</strong> Turnkey Project</div>
          </div>
        </div>

        {/* Project Health */}
        <div className="col-span-1 bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg mb-2">Project Health</h2>
          <div className="h-40 flex items-center justify-center text-gray-400 text-sm">[Bar Chart Placeholder]</div>
        </div>

        {/* Approvals */}
        <div className="col-span-1 bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg mb-2">Approvals</h2>
          <div className="space-y-3 overflow-y-auto max-h-72">
            {approvals.map((item, i) => (
              <div key={i} className="border p-2 rounded shadow-sm">
                <div className="font-semibold">{item.request}</div>
                <div className="text-xs text-gray-600 whitespace-pre-line">{item.details}</div>
                <div className="text-xs text-gray-600 whitespace-pre-line mt-1">{item.change}</div>
                <button className="mt-2 text-white bg-red-600 hover:bg-red-700 text-xs px-3 py-1 rounded">
                  Approve
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Project Users */}
        <div className="col-span-1 bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-lg">Project Users</h2>
            <button className="text-white bg-red-600 px-2 py-1 text-xs rounded">+ Add Users</button>
          </div>
          <div className="grid grid-cols-2 text-sm font-semibold border-b pb-1">
            <div>My Organisation</div>
            <div>Other Organisation</div>
          </div>
          <div className="divide-y mt-2 text-sm">
            {users.map((user, i) => (
              <div key={i} className="py-2 flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {user.name[0]}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">{user.name}</span>
                  <span className="text-xs text-gray-600">{user.phone}</span>
                </div>
                <span className="ml-auto text-xs">{user.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ongoing Task Status */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg mb-2">Ongoing Task Status</h2>
          <div className="space-y-2 text-sm">
            {["Plumbing", "Electrical", "Plumbing"].map((task, i) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{task} Work</div>
                  <div className="text-xs text-gray-500">Washroom 2</div>
                  <div className="text-xs text-gray-700">Rajesh Sharma</div>
                </div>
                <div className="w-24 bg-gray-200 h-2 rounded">
                  <div className="bg-red-500 h-2 rounded w-[25%]"></div>
                </div>
                <div className="text-xs">25%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg mb-2">Total Expenses</h2>
          <div className="h-40 flex items-center justify-center text-gray-400 text-sm">[Bar Chart Placeholder]</div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsDashboard;

// import React from 'react';
// import DashboardProgressBar from './DashboardProgressbar'; // adjust the path if needed

// const taskItems = Array(6).fill({
//   code: 'L12U38HH',
//   name: 'AAGMAN RESIDENCY',
// });

// const ProjectsDashboard = () => {
//   return (
//     <div className="bg-gray-100 min-h-screen w-full p-4 md:p-6">
//       <div className="bg-white rounded-lg shadow-md p-10 md:p-14 ">
      
//         <DashboardProgressBar />

//         {/* 🟨 Task Cards */}
//         <div className="flex flex-col md:flex-row gap-6">
//           <div className="w-full md:w-72 flex flex-col gap-6">
//             <TaskCard title="Recent Completed Task" color="green" tasks={taskItems} />
//             <TaskCard title="Upcoming Deadlines" color="yellow" tasks={taskItems} />
//             <TaskCard title="Overdue Task" color="red" tasks={taskItems} />
//           </div>
//           <div className="flex-1 hidden md:block" />
//         </div>
//       </div>
//     </div>
//   );
// };

// const TaskCard = ({ title, color, tasks }) => {
//   const colorMap = {
//     green: {
//       border: 'border-green-600',
//       bg: 'bg-green-100',
//       text: 'text-green-800',
//     },
//     yellow: {
//       border: 'border-yellow-500',
//       bg: 'bg-yellow-100',
//       text: 'text-yellow-800',
//     },
//     red: {
//       border: 'border-red-600',
//       bg: 'bg-red-100',
//       text: 'text-red-800',
//     },
//   };

//   return (
//     <div className={`rounded-md border-2 ${colorMap[color].border} overflow-hidden shadow`}>
//       <div className={`${colorMap[color].bg} py-2 text-center font-semibold text-sm ${colorMap[color].text}`}>
//         {title}
//       </div>
//       <div className="bg-white px-3 py-3 space-y-3">
//         {tasks.map((task, index) => (
//           <div key={index} className="text-sm font-medium flex justify-between border-b pb-1">
//             <span className="text-gray-700">• {task.code}</span>
//             <span className="text-gray-900">{task.name}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProjectsDashboard;
