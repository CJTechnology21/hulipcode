import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { useLocation } from "react-router-dom";
import ProjectsOverview from "./ProjectsOverview";
import Layout from "../Layout";
import ProjectEstimate from "./ProjectEstimate";
import ProjectParty from "./ProjectParty";
import ProjectTransaction from "./ProjectTransaction";
import ProjectTodo from "./ProjectTodo";
import ProjectAttendance from "./ProjectAttendance";
import ProjectMaterials from "./ProjectMaterials";
import ProjectSubcon from "./ProjectSubcon";
import ProjectFiles from "./ProjectFiles";
import ProjectEquipment from "./ProjectEquipment";

const tabs = [
  "Overview",
  "Design",
  "Estimate",
  "Party",
  "Transaction",
  "To Do",
  "Task",
  "Attendance",
  "Material",
  "Subcon",
  "Equipment",
  "Files",
];

export default function ProjectTabs() {
  const location = useLocation();
  const projectName = location.state?.projectName || "Unnamed Project";

  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(
    () => {
      if (firstLoad) {
        setFirstLoad(false);
        return;
      }

      setLoading(true);
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 600);

      return () => clearTimeout(timeout);
    },
    [activeTab],
    firstLoad
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return <ProjectsOverview />;
      case "Estimate":
        return <ProjectEstimate />;
      case "Party":
        return <ProjectParty />;
      case "Transaction":
        return <ProjectTransaction />;
      case "To Do":
        return <ProjectTodo />;
      case "Attendance":
        return <ProjectAttendance />;
      case "Material":
        return <ProjectMaterials />;
      case "Subcon":
        return <ProjectSubcon />;
      case "Files":
        return <ProjectFiles />;
      case "Equipment":
        return <ProjectEquipment />;
      default:
        return <div className="p-6">{activeTab} content goes here...</div>;
    }
  };

  return (
    <Layout title={projectName}>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow px-4 py-3 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`text-sm font-medium px-3 py-1 rounded ${
                  activeTab === tab
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-red-500"
                }`}
                onClick={() => {
                  if (activeTab === tab) return;
                  setActiveTab(tab);
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 min-h-[200px] flex items-center justify-center">
          {loading ? <ClipLoader size={35} color="red" /> : renderContent()}
        </div>
      </div>
    </Layout>
  );
}

// import React, { useState, useEffect } from "react";
// import { ClipLoader } from "react-spinners";
// import ProjectsHome from "./ProjectsHome"; // Overview content
// import Layout from "../Layout";

// const tabs = [
//   "Overview",
//   "Design",
//   "Estimate",
//   "Party",
//   "Transaction",
//   "To Do",
//   "Task",
//   "Attendance",
//   "Material",
//   "Subcon",
//   "Equipment",
//   "Files",
// ];

// export default function ProjectTabs() {
//   const [activeTab, setActiveTab] = useState("Overview");
//   const [loading, setLoading] = useState(false);
//   const [firstLoad, setFirstLoad] = useState(true);

//   useEffect(() => {
//     if (firstLoad) {
//       setFirstLoad(false);
//       return;
//     }

//     setLoading(true);
//     const timeout = setTimeout(() => {
//       setLoading(false);
//     }, 600); // adjust loading duration

//     return () => clearTimeout(timeout);
//   }, [activeTab]);

//   const renderContent = () => {
//     switch (activeTab) {
//       case "Overview":
//         return <ProjectsHome />;
//       case "Design":
//         return <div className="p-6">Design content goes here...</div>;
//       case "Estimate":
//         return <div className="p-6">Estimate content goes here...</div>;
//       case "Party":
//         return <div className="p-6">Party content goes here...</div>;
//       case "Transaction":
//         return <div className="p-6">Transaction content goes here...</div>;
//       case "To Do":
//         return <div className="p-6">To Do content goes here...</div>;
//       case "Task":
//         return <div className="p-6">Task content goes here...</div>;
//       case "Attendance":
//         return <div className="p-6">Attendance content goes here...</div>;
//       case "Material":
//         return <div className="p-6">Material content goes here...</div>;
//       case "Subcon":
//         return <div className="p-6">Subcon content goes here...</div>;
//       case "Equipment":
//         return <div className="p-6">Equipment content goes here...</div>;
//       case "Files":
//         return <div className="p-6">Files content goes here...</div>;
//       default:
//         return <div className="p-6">Select a tab to view content</div>;
//     }
//   };

//   return (
//     <div>
//       <Layout title="Home">
//         <div className="min-h-screen bg-gray-100">
//           <div className="bg-white shadow px-4 py-3 flex flex-wrap gap-4 items-center justify-between">
//             <div className="flex items-center gap-4 flex-wrap">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab}
//                   className={`text-sm font-medium px-3 py-1 rounded ${
//                     activeTab === tab
//                       ? "text-blue-600 border-b-2 border-blue-600"
//                       : "text-gray-600 hover:text-blue-500"
//                   }`}
//                   onClick={() => {
//                     if (activeTab === tab) return;
//                     setActiveTab(tab);
//                   }}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Content or Spinner */}
//           <div className="mt-4 min-h-[200px] flex items-center justify-center">
//             {loading ? (
//               <ClipLoader size={35} color="#3b82f6" />
//             ) : (
//               renderContent()
//             )}
//           </div>
//         </div>
//       </Layout>
//     </div>
//   );
// }
