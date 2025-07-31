import React from "react";

function ProjectsOverview() {
  return (
    <div className="p-4 md:p-6 w-full space-y-6 bg-gray-50">
      {/* Top Summary Section */}
      <div className="flex flex-wrap justify-between items-start gap-4 w-full">
        {/* Donut Chart + Dates */}
        <div className="flex items-center gap-6">
          {/* Semi Donut Chart */}
          <div className="relative w-24 h-12">
            <svg viewBox="0 0 36 18" className="w-full h-full">
              <path
                d="M2,18 A16,16 0 0,1 34,18"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="4"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-2 text-sm font-semibold">
              <span>0%</span>
              <span className="text-xs text-gray-600 font-normal">Completed</span>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Start Date:</span>
              <span className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-700 text-xs">--NA--</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">End Date:</span>
              <span className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-700 text-xs">--NA--</span>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="text-sm text-gray-700 font-medium flex items-center gap-2">
          <span>Tasks</span>
          <span className="text-black font-bold text-lg">0</span>
        </div>

        {/* Status Summary */}
        <div className="text-sm flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span className="text-gray-700">Not Started 0 | Delayed 0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-gray-700">In Progress 0 | Delayed 0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-gray-700">Completed 0</span>
          </div>
        </div>

        {/* Client Info */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="font-medium">Client:</span>
          <span className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">--NA--</span>
        </div>
      </div>

      {/* Financial Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Financial Health */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-4 text-gray-800">Financial Health</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between text-orange-500">
              <span>Project Value</span>
              <span>₹ 0</span>
            </div>
            <div className="flex justify-between text-yellow-500">
              <span>Total Expense</span>
              <span>₹ 0</span>
            </div>
            <div className="flex justify-between text-purple-500">
              <span>Total Sales Invoice</span>
              <span>₹ 0</span>
            </div>
            <div className="flex justify-between text-blue-500">
              <span>Total BOQ Value</span>
              <span>₹ 0</span>
            </div>
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-800">Total Expense</h3>
            <span className="text-gray-400">{'>'}</span>
          </div>
          <div className="h-32 flex items-center justify-center text-sm text-gray-400">
            No data to display
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
            <span>Material</span>
            <span>Salary</span>
            <span>Debit</span>
            <span>Other</span>
            <span>Site</span>
            <span>Subcon</span>
          </div>
        </div>

        {/* Expense by Cost Code */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2 text-gray-800">
            Expense Analysis by Cost Code
          </h3>
          <div className="h-32 flex items-center justify-center text-sm text-gray-400">
            No data to display
          </div>
        </div>
      </div>

      {/* Task Schedule + Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Task Schedule with Add */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between mb-2 items-center">
            <h3 className="font-semibold text-gray-800">Task Schedule</h3>
            <button className="text-xs text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">+ Add Task</button>
          </div>
          <table className="w-full text-sm text-gray-700">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-1 text-left">Item</th>
                <th className="py-1 text-left">Start Date</th>
                <th className="py-1 text-left">End Date</th>
                <th className="py-1 text-left">Progress</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="4" className="text-center text-gray-400 py-3">
                  No tasks scheduled
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Sales Invoices */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between mb-2 items-center">
            <h3 className="font-semibold text-gray-800">Sales Invoices</h3>
            <button className="text-xs text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600">+ Add Invoice</button>
          </div>
          <div className="h-24 text-center text-sm text-gray-400 flex items-center justify-center">
            No invoices to show
          </div>
        </div>
      </div>

      {/* Labour Attendance & Photo Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Labour Attendance */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-800">Labour Attendance</h3>
            <button className="text-xs text-white bg-indigo-500 px-3 py-1 rounded hover:bg-indigo-600">+ Mark Attendance</button>
          </div>
          <div className="h-24 text-center text-sm text-gray-400 flex items-center justify-center">
            No attendance records
          </div>
        </div>

        {/* Photo Preview */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-800">Project Photos</h3>
            <button className="text-xs text-white bg-gray-700 px-3 py-1 rounded hover:bg-gray-800">+ Add Photo</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-100 h-24 flex items-center justify-center text-xs text-gray-500 rounded">
              No image
            </div>
            <div className="bg-gray-100 h-24 flex items-center justify-center text-xs text-gray-500 rounded">
              No image
            </div>
            <div className="bg-gray-100 h-24 flex items-center justify-center text-xs text-gray-500 rounded">
              No image
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsOverview;
