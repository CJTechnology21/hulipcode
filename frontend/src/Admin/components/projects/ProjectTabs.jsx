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
import ProjectSiteMeasurements from "./ProjectSiteMeasurements";
import ProjectsDesign from "./ProjectsDesign";
import ProjectsDashboard from "./ProjectsDashboard";

const tabs = [
  "Overview",
  "Dashboard",
  "Site Measurements",
  "Design",
  "Quotation",
  "Party",
  "Transaction",
  "Task",
  "Attendance",
  "Material",
  "Subcon",
  "Equipment",
  "Files",
];

export default function ProjectTabs() {
  const location = useLocation();
  const projectId = location.state?.projectId;
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
    [activeTab, firstLoad]
    // firstLoad
  );
  const renderContent = () => {
    const commonProps = { projectId, projectName };

    switch (activeTab) {
      case "Overview":
        return <ProjectsOverview {...commonProps} />;
      case "Dashboard":
        return <ProjectsDashboard {...commonProps} />;
      case "Site Measurements":
        return <ProjectSiteMeasurements {...commonProps} />;
      case "Design":
        return <ProjectsDesign {...commonProps} />;
      case "Quotation":
        return <ProjectEstimate {...commonProps} />;
      case "Party":
        return <ProjectParty {...commonProps} />;
      case "Transaction":
        return <ProjectTransaction {...commonProps} />;
      case "Task":
        return <ProjectTodo {...commonProps} />;
      case "Attendance":
        return <ProjectAttendance {...commonProps} />;
      case "Material":
        return <ProjectMaterials {...commonProps} />;
      case "Subcon":
        return <ProjectSubcon {...commonProps} />;
      case "Files":
        return <ProjectFiles {...commonProps} />;
      case "Equipment":
        return <ProjectEquipment {...commonProps} />;
      default:
        return <div className="p-6">{activeTab} content goes here...</div>;
    }
  };

  // const renderContent = () => {
  //   switch (activeTab) {
  //     case "Overview":
  //       return <ProjectsOverview projectId ={projectId} projectName={projectName}/>;
  //     case "Dashboard":
  //       return <ProjectsDashboard projectId= {projectId}/>;
  //     case "Site Measurements":
  //       return <ProjectSiteMeasurements />;
  //     case "Design":
  //       return <ProjectsDesign projectId= {projectId} />;
  //     case "Quotation":
  //       return <ProjectEstimate />;
  //     case "Party":
  //       return <ProjectParty />;
  //     case "Transaction":
  //       return <ProjectTransaction />;
  //     case "Task":
  //       return <ProjectTodo />;
  //     case "Attendance":
  //       return <ProjectAttendance />;
  //     case "Material":
  //       return <ProjectMaterials projectName={projectName} />;
  //     case "Subcon":
  //       return <ProjectSubcon />;
  //     case "Files":
  //       return <ProjectFiles />;
  //     case "Equipment":
  //       return <ProjectEquipment />;
  //     default:
  //       return <div className="p-6">{activeTab} content goes here...</div>;
  //   }
  // };

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
