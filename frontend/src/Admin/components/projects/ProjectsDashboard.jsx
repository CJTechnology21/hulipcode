import React from "react";
import ProjectDetails from "./DashboardComponents/ProjectDetails";
import ProjectHealth from "./DashboardComponents/ProjectHealth";
import TotalExpenses from "./DashboardComponents/TotalExpenses";
import Approvals from "./DashboardComponents/Approvals";
import ProjectUsers from "./DashboardComponents/ProjectUsers";
import OngoingTaskStatus from "./DashboardComponents/OngoingTask";
import ProgressBar from "./DashboardComponents/ProgressBar";

function ProjectsDashboard({ projectId }) {
  return (
    <div className="bg-white w-full m-4 p-4 sm:p-6 min-h-screen rounded-xl">
      {/* Pass projectId here too if ProgressBar needs it */}
      <ProgressBar projectId={projectId} />  

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="flex flex-col gap-6">
          <ProjectDetails projectId={projectId} />
          <OngoingTaskStatus projectId={projectId} />
        </div>
        <div className="flex flex-col gap-6">
          <ProjectHealth projectId={projectId} />
          <TotalExpenses projectId={projectId} />
        </div>
        <div className="flex flex-col gap-6">
          <Approvals projectId={projectId} />
          <ProjectUsers projectId={projectId} />
        </div>
      </div>
    </div>
  );
}

export default ProjectsDashboard;
