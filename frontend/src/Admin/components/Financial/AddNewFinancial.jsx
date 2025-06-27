
import { useState } from "react";
import Header from "../Header";
import SideBar from "../SideBar";

function AddNewFinancial() {
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

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Financial Margin"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Form Container */}
        <div className="p-6 flex flex-col gap-6 w-full">
          <form className="bg-white p-6 rounded-xl w-full shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Amount */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                required
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Date */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Date</label>
              <input
                type="date"
                required
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Reference Number */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Reference Number</label>
              <input
                type="text"
                placeholder="Enter number"
                required
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Type */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Type</label>
              <select
                required
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select</option>
                <option value="paid">Paid</option>
                <option value="received">Received</option>
              </select>
            </div>

            {/* Channel */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Channel</label>
              <input
                type="text"
                placeholder="Enter channel name"
                required
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Vendor */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Vendor</label>
              <select
                required
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select</option>
                <option value="vendor-a">Vendor A</option>
                <option value="vendor-b">Vendor B</option>
              </select>
            </div>

            {/* Remark */}
            <div className="flex flex-col md:col-span-1">
              <label className="mb-1 font-medium">Remark</label>
              <textarea
                placeholder="Write here..."
                required
                className="border border-gray-300 rounded-md px-3 py-2 h-24"
              ></textarea>
            </div>

            {/* Receipt Upload */}
            <div className="flex flex-col md:col-span-1">
              <label className="mb-1 font-medium">Receipt</label>
              <input
                type="file"
                required
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              >
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewFinancial;
