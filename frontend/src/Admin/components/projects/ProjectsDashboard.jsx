import React from 'react';
import DashboardProgressBar from './DashboardProgressbar'; // adjust the path if needed

const taskItems = Array(6).fill({
  code: 'L12U38HH',
  name: 'AAGMAN RESIDENCY',
});

const ProjectsDashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen w-full p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-md p-10 md:p-14 ">
      
        <DashboardProgressBar />

        {/* 🟨 Task Cards */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-72 flex flex-col gap-6">
            <TaskCard title="Recent Completed Task" color="green" tasks={taskItems} />
            <TaskCard title="Upcoming Deadlines" color="yellow" tasks={taskItems} />
            <TaskCard title="Overdue Task" color="red" tasks={taskItems} />
          </div>
          <div className="flex-1 hidden md:block" />
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ title, color, tasks }) => {
  const colorMap = {
    green: {
      border: 'border-green-600',
      bg: 'bg-green-100',
      text: 'text-green-800',
    },
    yellow: {
      border: 'border-yellow-500',
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
    },
    red: {
      border: 'border-red-600',
      bg: 'bg-red-100',
      text: 'text-red-800',
    },
  };

  return (
    <div className={`rounded-md border-2 ${colorMap[color].border} overflow-hidden shadow`}>
      <div className={`${colorMap[color].bg} py-2 text-center font-semibold text-sm ${colorMap[color].text}`}>
        {title}
      </div>
      <div className="bg-white px-3 py-3 space-y-3">
        {tasks.map((task, index) => (
          <div key={index} className="text-sm font-medium flex justify-between border-b pb-1">
            <span className="text-gray-700">• {task.code}</span>
            <span className="text-gray-900">{task.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsDashboard;

// import React from 'react';

// const taskItems = Array(6).fill({
//   code: 'L12U38HH',
//   name: 'AAGMAN RESIDENCY',
// });

// const ProjectsDashboard = () => {
//   return (
//     <div className="bg-gray-100 min-h-screen w-full p-4 md:p-6">
//       <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
//         {/* Progress Bar */}
//         <div className="relative w-full h-6 mb-12">
//           <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-300 rounded-full transform -translate-y-1/2 z-0" />
//           {/* Segments */}
//           <div className="absolute top-1/2 left-0 h-2 bg-cyan-600 z-10 rounded-l-full" style={{ width: '48%' }} />
//           <div className="absolute top-1/2 left-[48%] h-2 bg-green-500 z-10" style={{ width: '16.5%' }} />
//           <div className="absolute top-1/2 left-[64.5%] h-2 bg-yellow-400 z-10" style={{ width: '20.5%' }} />
//           <div className="absolute top-1/2 left-[85%] h-2 bg-gray-400 z-10 rounded-r-full" style={{ width: '15%' }} />

//           {/* Markers */}
//           <Marker position="0%" labelTop="0%" labelBottom="Work Progress" color="bg-cyan-600" />
//           <Marker position="48%" labelBottom="Payment Disbursed 48%" color="bg-cyan-700" />
//           <Marker position="64.5%" labelBottom="Work Completed 64.5%" color="bg-green-500" />
//           <Marker position="85%" labelBottom="Payment In Escrow 85%" color="bg-yellow-400" />
//           <Marker position="100%" labelTop="100%" color="bg-gray-400" />
//         </div>

//         {/* Task Cards */}
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

// const Marker = ({ position, labelTop, labelBottom, color }) => (
//   <div
//     className="absolute transform -translate-x-1/2 flex flex-col items-center text-center"
//     style={{ left: position, top: '-24px' }}
//   >
//     {labelTop && <span className="text-xs font-bold text-black mb-1">{labelTop}</span>}
//     <div className={`w-5 h-5 rounded-full border-2 border-white shadow-md ${color} z-20`} />
//     {labelBottom && (
//       <span className="text-xs font-semibold text-black mt-2 leading-tight w-28">
//         {labelBottom}
//       </span>
//     )}
//   </div>
// );

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
//       <div
//         className={`${colorMap[color].bg} py-2 text-center font-semibold text-sm ${colorMap[color].text}`}
//       >
//         {title}
//       </div>
//       <div className="bg-white px-3 py-3 space-y-3">
//         {tasks.map((task, index) => (
//           <div
//             key={index}
//             className="text-sm font-medium flex justify-between border-b pb-1"
//           >
//             <span className="text-gray-700">• {task.code}</span>
//             <span className="text-gray-900">{task.name}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProjectsDashboard;
