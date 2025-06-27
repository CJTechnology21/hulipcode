import React, { useState } from "react";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import TopCards from "../components/MainDhasboard/Topcards";
import PieCharts from "../components/MainDhasboard/PieCharts";
import BarCharts from "../components/MainDhasboard/BarChart";
import TotalRevenue from "../components/MainDhasboard/TotalRevenue";
import TopOwners from "../components/MainDhasboard/TopOwners";
import CustomerReviews from "../components/MainDhasboard/CustomerReview";

export default function Dashboard() {
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

        <main className="p-4 md:p-6 space-y-6">
          <TopCards />

          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Pie + Bar Charts */}
            <div className="flex flex-col gap-6 lg:flex-[2]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PieCharts />
                <BarCharts />
              </div>
              <TotalRevenue />
            </div>

            {/* Top Owners */}
            <div className="flex-1">
              <TopOwners />
            </div>
          </div>

          <div className="bg-white shadow-md rounded p-4">
            <CustomerReviews />
          </div>
        </main>
      </div>
    </div>
  );
}

// import React, { useState } from "react";
// import SideBar from "../components/SideBar";
// import Header from "../components/Header";
// import TopCards from "../components/MainDhasboard/Topcards";
// import PieCharts from "../components/MainDhasboard/PieCharts";
// import BarCharts from "../components/MainDhasboard/BarChart";
// import TotalRevenue from "../components/MainDhasboard/TotalRevenue";
// import TopOwners from "../components/MainDhasboard/TopOwners";
// import CustomerReviews from "../components/MainDhasboard/CustomerReview";
// import { HiMenu } from "react-icons/hi";

// export default function Dashboard() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="min-h-screen flex flex-col bg-white md:flex-row">
//       {/* Sidebar */}
//       <div
//         className={`fixed z-50 md:relative md:translate-x-0 transition-transform duration-300 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:block`}
//       >
//         <SideBar />
//       </div>

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main Content */}
//       <div className="flex-1 md:ml-64 flex flex-col min-h-screen bg-gray-100">
//         {/* Topbar with hamburger */}
//         <div className="md:hidden p-4 flex items-center justify-between bg-white shadow-sm border-b">
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="text-blue-600"
//           >
//             <HiMenu size={24} />
//           </button>
//           <h1 className="text-lg font-semibold">Dashboard</h1>
//         </div>

//         {/* Main Header (only on md+) */}
//         <div className="hidden md:block">
//           <Header title="Dashboard" />
//         </div>

//         <main className="p-4 md:p-6 flex-1 space-y-6">
//           {/* Top Cards */}
//           <TopCards />

//           {/* Pie + Bar Charts + Top Owners */}
//           <div className="flex flex-col gap-6 lg:flex-row">
//             {/* Pie + Bar Charts */}
//             <div className="flex flex-col gap-6 lg:flex-[2]">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <PieCharts />
//                 <BarCharts />
//               </div>
//               <TotalRevenue />
//             </div>

//             {/* Top Owners */}
//             <div className="flex-1">
//               <TopOwners />
//             </div>
//           </div>

//           {/* Customer Reviews */}
//           <div className="bg-white shadow-md rounded p-4">
//             <CustomerReviews />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
