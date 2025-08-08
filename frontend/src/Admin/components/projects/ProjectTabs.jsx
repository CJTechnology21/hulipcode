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
      case "Dashboard":
        return <ProjectsDashboard />;
      case "Site Measurements":
        return <ProjectSiteMeasurements />;
      case "Design":
        return <ProjectsDesign />;
      case "Quotation":
        return <ProjectEstimate />;
      case "Party":
        return <ProjectParty />;
      case "Transaction":
        return <ProjectTransaction />;
      case "Task":
        return <ProjectTodo />;
      case "Attendance":
        return <ProjectAttendance />;
      case "Material":
        return <ProjectMaterials projectName={projectName} />;
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