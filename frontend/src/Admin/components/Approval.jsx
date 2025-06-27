
import { useState } from "react";
import SideBar from "./SideBar";
import Header from "./Header";

function Approval() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden font-fredoka">
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
          title="Approval"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="p-6 flex-1 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-8">
            {/* Approval Sections */}
            {["Task Rate Revision", "Drawing Approval", "3D Approval"].map((title, index) => (
              <div key={index}>
                <h2 className="font-medium mb-2">{title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="date" className="border rounded-md px-3 py-2" />
                  <input type="time" className="border rounded-md px-3 py-2" />
                </div>
                <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                  APPROVE
                </button>
              </div>
            ))}

            {/* Task Approval */}
            <div>
              <h2 className="font-medium mb-2">Task Approval</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input type="text" placeholder="Enter task name" className="border rounded-md px-3 py-2" />
                <input type="number" placeholder="Enter number" className="border rounded-md px-3 py-2" />
                <div className="w-full flex justify-center items-center">
                  <img
                    src="https://via.placeholder.com/150"
                    alt="room"
                    className="rounded-md border w-40 h-28 object-cover"
                  />
                </div>
              </div>
              <textarea placeholder="Enter reason" className="w-full border rounded-md px-3 py-2 mt-4" />
              <div className="flex items-center gap-2 mt-2">
                <span>Revision in Rate:</span>
                <input type="text" placeholder="Old Rate" className="border rounded-md px-2 py-1 w-32" />
                <span>TO</span>
                <input type="text" placeholder="New Rate" className="border rounded-md px-2 py-1 w-32" />
              </div>
              <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                APPROVE
              </button>
            </div>

            {/* Product Approval */}
            <div>
              <h2 className="font-medium mb-2">Product Approval</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input type="text" placeholder="Enter product name" className="border rounded-md px-3 py-2" />
                <input type="number" placeholder="Enter number" className="border rounded-md px-3 py-2" />
                <div className="w-full flex justify-center items-center">
                  <img
                    src="https://via.placeholder.com/150"
                    alt="room"
                    className="rounded-md border w-40 h-28 object-cover"
                  />
                </div>
              </div>
              <textarea placeholder="Enter reason" className="w-full border rounded-md px-3 py-2 mt-4" />
              <div className="flex items-center gap-2 mt-2">
                <span>Revision in Rate or Product:</span>
                <input type="text" placeholder="Old Rate" className="border rounded-md px-2 py-1 w-32" />
                <span>TO</span>
                <input type="text" placeholder="New Rate" className="border rounded-md px-2 py-1 w-32" />
              </div>
              <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                APPROVE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Approval;