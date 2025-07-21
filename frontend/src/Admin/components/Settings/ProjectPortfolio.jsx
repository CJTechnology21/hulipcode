import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Corrected import
import Button from "../../../components/Button"; // ✅ Adjust path as needed

const projectData = [
  {
    id: 1,
    code: "SLX0810H",
    name: "RATLAN B 1H02",
    client: "SANDEEP BAKSHI",
    location: "DELHI / KALKAJI",
    type: "RESIDENTIAL",
    status: "EXECUTION IN PROGRESS",
    statusColor: "bg-green-500",
  },
  {
    id: 2,
    code: "SPV5730W",
    name: "SHALIMAR TOWER 23 B",
    client: "RAHUL GUPTA",
    location: "DELHI / RANI BAGH",
    type: "RESIDENTIAL",
    status: "SITE MEASUREMENTS",
    statusColor: "bg-yellow-400",
  },
  {
    id: 3,
    code: "DJC9846J",
    name: "CAFE ZUZU",
    client: "UTKARSH VIJAY",
    location: "DELHI / SAKET",
    type: "COMMERCIAL",
    status: "DESIGNING IN PROCESS",
    statusColor: "bg-indigo-500",
  },
];

function ProjectPortfolio() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate(); // ✅ Hook

  const handleOrderClick = () => {
    navigate("/orders"); // ✅ Navigate to orders
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Your Projects</h1>

      {/* Project cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {projectData.map((proj) => (
          <div
            key={proj.id}
            onClick={() => setSelected(proj)}
            className="bg-white rounded-xl p-4 shadow hover:shadow-md cursor-pointer transition"
          >
            <h2 className="text-lg font-semibold">{proj.name}</h2>
            <p className="text-sm text-gray-500">{proj.location}</p>
            <p className="text-sm mt-1">{proj.type}</p>
            <span
              className={`inline-block mt-2 text-white text-xs px-2 py-1 rounded-full ${proj.statusColor}`}
            >
              {proj.status}
            </span>
          </div>
        ))}
      </div>

      {/* Details panel */}
      {selected && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{selected.name}</h2>
            <button
              onClick={() => setSelected(null)}
              className="text-sm text-red-500 hover:underline"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Project ID:</strong> {selected.code}</p>
              <p><strong>Client:</strong> {selected.client}</p>
              <p><strong>Location:</strong> {selected.location}</p>
            </div>
            <div>
              <p><strong>Type:</strong> {selected.type}</p>
              <p><strong>Status:</strong> <span className={`text-white px-2 py-1 rounded ${selected.statusColor}`}>{selected.status}</span></p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-4">
            <Button color="blue">View Report</Button>
            <Button color="green">Mark as Complete</Button>
            <Button color="gray">Edit Project</Button>
            <Button color="red" onClick={handleOrderClick}>
              Order Materials
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectPortfolio;

// import { useState } from "react";
// import Button from "../../../components/Button"; // Make sure the path matches your file structure
// import useNavigate from "react-router-dom"
// const projectData = [
//   {
//     id: 1,
//     code: "SLX0810H",
//     name: "RATLAN B 1H02",
//     client: "SANDEEP BAKSHI",
//     location: "DELHI / KALKAJI",
//     type: "RESIDENTIAL",
//     status: "EXECUTION IN PROGRESS",
//     statusColor: "bg-green-500",
//   },
//   {
//     id: 2,
//     code: "SPV5730W",
//     name: "SHALIMAR TOWER 23 B",
//     client: "RAHUL GUPTA",
//     location: "DELHI / RANI BAGH",
//     type: "RESIDENTIAL",
//     status: "SITE MEASUREMENTS",
//     statusColor: "bg-yellow-400",
//   },
//   {
//     id: 3,
//     code: "DJC9846J",
//     name: "CAFE ZUZU",
//     client: "UTKARSH VIJAY",
//     location: "DELHI / SAKET",
//     type: "COMMERCIAL",
//     status: "DESIGNING IN PROCESS",
//     statusColor: "bg-indigo-500",
//   },
// ];

// function ProjectPortfolio() {
//   const [selected, setSelected] = useState(null);
//   const navigate = useNavigate();
//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold mb-6">Your Projects</h1>

//       {/* Project cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//         {projectData.map((proj) => (
//           <div
//             key={proj.id}
//             onClick={() => setSelected(proj)}
//             className="bg-white rounded-xl p-4 shadow hover:shadow-md cursor-pointer transition"
//           >
//             <h2 className="text-lg font-semibold">{proj.name}</h2>
//             <p className="text-sm text-gray-500">{proj.location}</p>
//             <p className="text-sm mt-1">{proj.type}</p>
//             <span
//               className={`inline-block mt-2 text-white text-xs px-2 py-1 rounded-full ${proj.statusColor}`}
//             >
//               {proj.status}
//             </span>
//           </div>
//         ))}
//       </div>

//       {/* Details panel */}
//       {selected && (
//         <div className="bg-white rounded-xl shadow p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-semibold">{selected.name}</h2>
//             <button
//               onClick={() => setSelected(null)}
//               className="text-sm text-red-500 hover:underline"
//             >
//               Close
//             </button>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//             <div>
//               <p><strong>Project ID:</strong> {selected.code}</p>
//               <p><strong>Client:</strong> {selected.client}</p>
//               <p><strong>Location:</strong> {selected.location}</p>
//             </div>
//             <div>
//               <p><strong>Type:</strong> {selected.type}</p>
//               <p><strong>Status:</strong> <span className={`text-white px-2 py-1 rounded ${selected.statusColor}`}>{selected.status}</span></p>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="mt-6 flex flex-wrap gap-4">
//             <Button color="blue">View Report</Button>
//             <Button color="green">Mark as Complete</Button>
//             <Button color="gray">Edit Project</Button>
//             <Button color="red">Order Materials</Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ProjectPortfolio;
