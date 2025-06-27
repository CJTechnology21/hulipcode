import { useState } from "react";
import Header from "../Header";
import SideBar from "../SideBar";
import FirmDetails from "./FirmDetails";
import TeamMember from "./TeamMember";
import Portfolio from "./Portfolio";
import Review from "./Review";
import Charges from "./Charges";
// Import other components as needed

const tabs = [
  "Firm Details",
  "Team member",
  "Portfolio",
  "Review",
  "Charges",
  "Logout",
];

function SettingsDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tabMenuOpen, setTabMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Firm Details");

  const renderRightPanel = () => {
    switch (activeSection) {
      case "Firm Details":
        return <FirmDetails />;
      case "Team member":
        return <TeamMember />;
      case "Portfolio":
        return <Portfolio />;
      case "Review":
        return <Review />;
    case "Charges":
        return <Charges/>
      default:
        return (
          <div className="text-gray-500">Select a section to view content.</div>
        );
    }
  };

  return (
    <div className="flex h-screen font-fredoka overflow-hidden">
      {/* Sidebar (main navigation) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-300 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
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
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Settings"
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="m-4 md:m-6 rounded-2xl shadow bg-white flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Tab Hamburger (for mobile) */}
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
            } md:block w-full md:w-1/4 border-b md:border-b-0 md:border-r border-gray-300 p-4 md:p-6`}
          >
            <ul className="space-y-4 text-gray-700 text-base">
              {tabs.map((tab) => (
                <li
                  key={tab}
                  onClick={() => {
                    setActiveSection(tab);
                    setTabMenuOpen(false); // close on mobile
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
          <div className="flex-1 p-4 md:p-6">{renderRightPanel()}</div>
        </div>
      </div>
    </div>
  );
}

export default SettingsDashboard;
// import { useState } from "react";
// import Header from "../Header";
// import SideBar from "../SideBar";
// import FirmDetails from "./FirmDetails";
// import TeamMember from "./TeamMember";
// // import other tabs as needed

// const tabs = ["Firm Details", "Team member", "Portfolio", "Review", "Charges", "Logout"];

// function SettingsDashboard() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [activeSection, setActiveSection] = useState("Firm Details");

//   const renderRightPanel = () => {
//     switch (activeSection) {
//       case "Firm Details":
//         return <FirmDetails />;
//       case "Team member":
//         return <TeamMember />;
//       // case "Portfolio":
//       //   return <Portfolio />;
//       default:
//         return <div className="text-gray-500">Select a section to view content.</div>;
//     }
//   };

//   return (
//     <div className="flex h-screen font-fredoka overflow-hidden">
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-300 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:relative md:block`}
//       >
//         <SideBar />
//       </div>

//       {sidebarOpen && (
//         <div className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden" onClick={() => setSidebarOpen(false)} />
//       )}

//       <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
//         <Header title="Settings" toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

//         <div className="m-6 rounded-2xl shadow bg-white flex flex-1 overflow-hidden">
//           <div className="w-1/4 border-r border-gray-300 p-6">
//             <ul className="space-y-5 text-gray-700 text-base">
//               {tabs.map((tab) => (
//                 <li
//                   key={tab}
//                   onClick={() => setActiveSection(tab)}
//                   className={`cursor-pointer font-medium ${
//                     activeSection === tab ? "text-blue-600" : "text-gray-600"
//                   }`}
//                 >
//                   {tab}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="flex-1 p-6">{renderRightPanel()}</div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SettingsDashboard;
