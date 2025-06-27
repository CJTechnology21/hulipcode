import { useState } from "react";
import SideBar from "./SideBar";
import Header from "./Header";
import { FaSearch, FaFilePdf } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

function Contract() {
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

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Contract"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <div className="p-6 flex-1 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow p-4 flex-1 flex flex-col justify-between">
            {/* Top Section: Search bar and Contract row */}
            <div className="flex flex-col gap-4">
              {/* Search bar aligned right */}
              <div className="flex justify-end">
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder="Search"
                    className="border rounded-xl px-3 py-1 w-full pr-9 text-sm"
                  />
                  <FaSearch className="absolute right-3 top-2.5 text-gray-500 text-sm" />
                </div>
              </div>

              {/* Contract row below search */}
              <div className="border rounded-lg p-4 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <FaFilePdf className="text-green-600 text-xl" />
                  <span className="font-medium">P-100/Q-10</span>
                  <span className="bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                    APPROVED
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span>2,00,000 RS</span>
                  <FiChevronDown className="text-gray-500" />
                </div>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex gap-3 mt-6">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Sign Contract
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Auto Contract
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contract;
