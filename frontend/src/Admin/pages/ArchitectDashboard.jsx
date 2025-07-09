import React, { useState } from "react";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
// import TopItems from "../components/ArchitechDashboard/TopItems";
import BarGraph from "../components/ArchitechDashboard/BarGraph";
import ExpensePieChart from "../components/ArchitechDashboard/ExpenseChart";
import Activitytable from "../components/ArchitechDashboard/Activitytable";
import ArchitectExpense from "../components/ArchitechDashboard/ArchitectExpense";
import TopOwners from "../components/MainDhasboard/TopOwners";

export default function ArchitectDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
  

       <div
        className={`fixed inset-y-0 left-0 z-50  bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
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

        <main className="p-4 sm:p-6 space-y-6">
          {/* Top Cards */}
          {/* <TopItems /> */}

          {/* Responsive Layout Grid */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column */}
            <div className="flex flex-col gap-6 flex-[2]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BarGraph />
                <ExpensePieChart />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* On small screens, order ArchitectExpense after Activitytable */}
                <div className="order-1 md:order-none">
                  <Activitytable />
                </div>
                <div className="order-2 md:order-none">
                  <ArchitectExpense />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-[320px]">
              <TopOwners />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
