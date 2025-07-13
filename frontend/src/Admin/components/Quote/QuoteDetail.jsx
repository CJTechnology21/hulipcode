import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaPlus, FaFileImport, FaSave } from "react-icons/fa";
import Header from "../Header";
import SideBar from "../SideBar";
import QuoteSummary from "./QuoteSummary";
import QuoteItemizedSection from "./QuoteOptimizedSection";

const sections = [
  "Summary",
  "Design & Consultation",
  "Bedroom 1",
  "Master Bedroom",
  "Master Bedroom Toilet",
  "Living Room",
  "Kitchen",
  "Powder Washroom",
  "Store Room",
];

function QuoteDetail() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { qid, clientName } = location.state || {};
  const [activeSection, setActiveSection] = useState("Summary");

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-20 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:block`}
      >
        <SideBar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden bg-gray-100">
        <Header
          title={`Quotations - QID: ${qid || "N/A"} - ${
            clientName || "Unknown Client"
          }`}
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Section Tabs */}
        <div className="bg-white border-b shadow px-4 py-2 flex items-center overflow-x-auto whitespace-nowrap space-x-4">
          {sections.map((section, index) => (
            <React.Fragment key={section}>
              <button
                onClick={() => setActiveSection(section)}
                className={`text-sm font-semibold ${
                  activeSection === section
                    ? "text-red-800 underline"
                    : "text-gray-700"
                }`}
              >
                {section}
              </button>
              {index < sections.length - 1 && (
                <span className="text-red-800">|</span>
              )}
            </React.Fragment>
          ))}
          <span className="text-red-800 font-bold text-xl ml-2">{`»`}</span>

          {/* Action Buttons */}
          <div className="ml-auto flex space-x-2">
            <button className="bg-red-700 hover:bg-red-800 text-white text-sm px-3 py-1 rounded flex items-center gap-1">
              <FaPlus /> Add Space
            </button>
            <button className="bg-red-700 hover:bg-red-800 text-white text-sm px-3 py-1 rounded flex items-center gap-1">
              <FaFileImport /> Import Template
            </button>
            <button className="bg-red-700 hover:bg-red-800 text-white text-sm px-4 py-1 rounded flex items-center gap-1">
              <FaSave /> Save
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {activeSection === "Summary" ? (
            <QuoteSummary activeSection="Summary" />
          ) : (
            <QuoteItemizedSection areaName={activeSection} />
          )}
        </div>
      </div>
    </div>
  );
}

export default QuoteDetail;

// import React, { useState } from "react";
// import { useLocation } from "react-router-dom";
// import { FaPlus, FaFileImport, FaSave } from "react-icons/fa";
// import Header from "../Header";
// import SideBar from "../SideBar";
// import QuoteSummary from "./QuoteSummary";

// function QuoteDetail() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const location = useLocation();
//   const { qid, clientName } = location.state || {};

//   const sections = [
//     "Summary",
//     "Design & Consultation",
//     "Bedroom 1",
//     "Master Bedroom",
//     "Master Bedroom Toilet",
//     "Living Room",
//     "Kitchen",
//     "Powder Washroom",
//     "Store Room",
//   ];

//   const [activeSection, setActiveSection] = useState("Summary");

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-20 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:relative md:block`}
//       >
//         <SideBar />
//       </div>

//       {/* Main */}
//       <div className="flex flex-col flex-1 overflow-hidden bg-gray-100">
//         <Header
//           title={`Quotations - QID: ${qid || "N/A"} - ${
//             clientName || "Unknown Client"
//           }`}
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />

//         {/* Tab Bar */}
//         <div className="bg-white border-b shadow px-4 py-2 flex items-center overflow-x-auto whitespace-nowrap space-x-4">
//           {sections.map((section, index) => (
//             <React.Fragment key={section}>
//               <button
//                 onClick={() => setActiveSection(section)}
//                 className={`text-sm font-semibold ${
//                   activeSection === section
//                     ? "text-red-800 underline"
//                     : "text-gray-700"
//                 }`}
//               >
//                 {section}
//               </button>
//               {index < sections.length - 1 && (
//                 <span className="text-red-800">|</span>
//               )}
//             </React.Fragment>
//           ))}

//           <span className="text-red-800 font-bold text-xl ml-2">{`»`}</span>

//           {/* Buttons */}
//           <div className="ml-auto flex space-x-2">
//             <button className="bg-red-700 hover:bg-red-800 text-white text-sm px-3 py-1 rounded flex items-center gap-1">
//               <FaPlus /> Add Space
//             </button>
//             <button className="bg-red-700 hover:bg-red-800 text-white text-sm px-3 py-1 rounded flex items-center gap-1">
//               <FaFileImport /> Import Template
//             </button>
//             <button className="bg-red-700 hover:bg-red-800 text-white text-sm px-4 py-1 rounded flex items-center gap-1">
//               <FaSave /> Save
//             </button>
//           </div>
//         </div>

//         {/* Section Content */}
//         <div className="p-4 overflow-y-auto flex-1">
//           <QuoteSummary activeSection={activeSection} />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default QuoteDetail;
