import React, { useState } from "react";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import Top from "../components/VendorDashboard/Top";
import Activity from "../components/VendorDashboard/Activity";
import MonthlySales from "../components/VendorDashboard/MonthlySales";
import CustomerDetails from "../components/VendorDashboard/CustomerDetails";

function VendorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:block`}
      >
        <SideBar />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Dashboard"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="p-4 sm:p-6 flex-1 space-y-6">
          {/* Top summary cards */}
          <Top />

          {/* Charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <Activity />
            <MonthlySales />
          </div>

          {/* Customer details or bottom section */}
          <CustomerDetails />
        </main>
      </div>
    </div>
  );
}

export default VendorDashboard;

// import React from "react";
// import { useState } from "react";
// import SideBar from "../components/SideBar";
// import Header from "../components/Header";
// import Top from "../components/VendorDashboard/Top";
// import Activity from "../components/VendorDashboard/Activity";
// import MonthlySales from "../components/VendorDashboard/MonthlySales";
// import CustomerDetails from "../components/VendorDashboard/CustomerDetails";
// function VendorDashboard() {
//    const [sidebarOpen, setSidebarOpen] = useState(false);
//   return (
//   <div className="flex h-screen overflow-hidden">
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:relative md:block`}
//       >
//         <SideBar />
//       </div>

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main content */}
//       <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
//         <Header
//           title="Dashboard"
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />
//         <main className="p-6 flex-1 space-y-6">
//           <Top />
//           <div className="flex flex-col flex-[2] gap-4">
//             <div className="grid grid-cols-2 mr-0">
//               <Activity />
//               <MonthlySales />
//             </div>
//             <div className="flex flex-col flex-[2] gap-4">
//               <CustomerDetails/>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default VendorDashboard;
