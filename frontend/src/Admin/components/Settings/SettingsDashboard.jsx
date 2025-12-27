import { useState, useEffect } from "react";
import Header from "../Header";
import SideBar from "../SideBar";
import FirmDetails from "./FirmDetails";
import TeamMember from "./TeamMember";
import Portfolio from "./Portfolio";
import Review from "./Review";
import Charges from "./Charges";
import ProjectProtfolio from "./ProjectPortfolio";
import Profile from "./Profile";

const professionalTabs = [
  "Profile",
  "Firm Details",
  "Project Portfolio",
  "Team member",
  "Portfolio",
  "Review",
  "Charges",
];

const clientTabs = [
  "Profile",
];

function SettingsDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tabMenuOpen, setTabMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [activeSection, setActiveSection] = useState("Profile");

  useEffect(() => {
    const role = localStorage.getItem('crm_role') || '';
    setUserRole(role);
    // Set default section based on role
    if (role === 'client') {
      setActiveSection("Profile");
    } else {
      setActiveSection("Profile");
    }
  }, []);

  const tabs = userRole === 'client' ? clientTabs : professionalTabs;

  const renderRightPanel = () => {
    switch (activeSection) {
      case "Profile":
        return <Profile />;
      case "Firm Details":
        return <FirmDetails />;
      case "Project Portfolio":
        return <ProjectProtfolio />;
      case "Team member":
        return <TeamMember />;
      case "Portfolio":
        return <Portfolio />;
      case "Review":
        return <Review />;
      case "Charges":
        return <Charges />;
      default:
        return (
          <div className="text-gray-500">Select a section to view content.</div>
        );
    }
  };

  return (
    <div className="flex h-screen font-fredoka overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-20 bg-white border-r border-gray-300 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:block`}
      >
        <SideBar />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden bg-gray-100">
        <Header
          title="Settings"
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="m-4 md:m-6 rounded-2xl shadow bg-white flex flex-1 overflow-hidden md:flex-row flex-col">
          {/* Mobile Tab Header */}
          <div className="flex justify-between items-center md:hidden p-4 border-b border-gray-300">
            <h2 className="text-lg font-semibold">{activeSection}</h2>
            <button
              className="text-gray-700 focus:outline-none"
              onClick={() => setTabMenuOpen(!tabMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Tab List */}
          <div
            className={`${
              tabMenuOpen ? "block" : "hidden"
            } md:block w-full md:w-1/4 border-b md:border-b-0 md:border-r border-gray-300 p-6`}
          >
            <ul className="space-y-4 text-gray-700 text-base">
              {tabs.map((tab) => (
                <li
                  key={tab}
                  onClick={() => {
                    setActiveSection(tab);
                    setTabMenuOpen(false);
                  }}
                  className={`cursor-pointer font-medium ${
                    activeSection === tab ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Panel Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 h-full">
            {renderRightPanel()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsDashboard;
