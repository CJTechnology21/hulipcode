import React, { useState } from "react";
import Header from "./Header";
import SideBar from "./SideBar";

function Layout({ title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:block ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SideBar />
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title={title}
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        {children}
      </div>
    </div>
  );
}

export default Layout;
