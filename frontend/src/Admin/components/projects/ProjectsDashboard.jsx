import React from "react";
import ProjectDetails from "./DashboardComponents/ProjectDetails";
import ProjectHealth from "./DashboardComponents/ProjectHealth";
import TotalExpenses from "./DashboardComponents/TotalExpenses";
import Approvals from "./DashboardComponents/Approvals";
import ProjectUsers from "./DashboardComponents/ProjectUsers";
import OngoingTaskStatus from "./DashboardComponents/OngoingTask";
import ProgressBar from "./DashboardComponents/ProgressBar";

function ProjectsDashboard() {
  return (
    <div className="bg-white w-full m-4 p-4 sm:p-6 min-h-screen rounded-xl">
      <ProgressBar />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="flex flex-col gap-6">
          <ProjectDetails />
          <OngoingTaskStatus />
        </div>
        <div className="flex flex-col gap-6">
          <ProjectHealth />
          <TotalExpenses />
        </div>
        <div className="flex flex-col gap-6">
          <Approvals />
          <ProjectUsers />
        </div>
      </div>
    </div>
  );
}

export default ProjectsDashboard;

// import React from "react";
// import ProjectDetails from "./DashboardComponents/ProjectDetails";
// import ProjectHealth from "./DashboardComponents/ProjectHealth";
// import TotalExpenses from "./DashboardComponents/TotalExpenses";
// import Approvals from "./DashboardComponents/Approvals";
// import ProjectUsers from "./DashboardComponents/ProjectUsers";
// import OngoingTaskStatus from "./DashboardComponents/OngoingTask";
// import ProgressBar from "./DashboardComponents/ProgressBar";

// function ProjectsDashboard() {
//   return (
//     <div className="bg-white w-full m-4 p-6 min-h-screen rounded-xl">
//       <ProgressBar />
//       <div className="grid grid-cols-3 gap-6">
//         <div className="flex flex-col gap-6">
//           <ProjectDetails />
//           <OngoingTaskStatus />
//         </div>
//         <div className="flex flex-col gap-6">
//           <ProjectHealth />
//           <TotalExpenses />
//         </div>
//         <div className="flex flex-col gap-6">
//           <Approvals />
//           <ProjectUsers />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProjectsDashboard;
