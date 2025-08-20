import React, { useState } from "react";
import TaskModal from "./OverviewComponents/TaskModal";
import InvoiceModal from "./OverviewComponents/InvoiceModal";
import AttendanceModal from "./OverviewComponents/AttendanceModal";
import PhotoModal from "./OverviewComponents/PhotoModal";
import Button from "../../../components/Button";
import { formatDate } from "../../../utils/dateFormatter";
function ProjectsOverview() {
  // State for data
  const [tasks, setTasks] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [photos, setPhotos] = useState([]);

  const addInvoice = (invoice) => {
    setInvoices((prev) => [...prev, invoice]);
  };

  const addAttendance = (record) => {
    setAttendance((prev) => [...prev, record]); // store objects
  };

  // State for modal visibility
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  return (
    <div className="p-4 md:p-6 w-full space-y-6 bg-gray-50">
      {/* Top Summary Section */}
      <div className="flex flex-wrap justify-between items-start gap-4 w-full">
        {/* Donut Chart + Dates */}
        <div className="flex items-center gap-6">
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
              <span className="text-xs text-gray-600 font-normal">
                Completed
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Start Date:</span>
              <span className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-700 text-xs">
                --NA--
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">End Date:</span>
              <span className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-700 text-xs">
                --NA--
              </span>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="text-sm text-gray-700 font-medium flex items-center gap-2">
          <span>Tasks</span>
          <span className="text-black font-bold text-lg">{tasks.length}</span>
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
          <span className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">
            --NA--
          </span>
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
            <span className="text-gray-400">{">"}</span>
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
        {/* Task Schedule */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between mb-2 items-center">
            <h3 className="font-semibold text-gray-800">Task Schedule</h3>
            <Button
              variant="custom"
              className="text-xs text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
              onClick={() => setShowTaskModal(true)}
            >
              + Add Task
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700 border">
              <thead>
                <tr className="text-gray-500 border-b bg-gray-50">
                  <th className="py-2 px-3 text-left">S.No</th>
                  <th className="py-2 px-3 text-left">Item</th>
                  <th className="py-2 px-3 text-left">Start Date</th>
                  <th className="py-2 px-3 text-left">End Date</th>
                  <th className="py-2 px-3 text-left">Progress</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-400 py-4">
                      No tasks scheduled
                    </td>
                  </tr>
                ) : (
                  tasks.map((task, idx) => (
                    <tr
                      key={idx}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-3 py-2">{idx + 1}</td>
                      <td className="px-3 py-2">{task.item}</td>
                      <td className="px-3 py-2">
                        {formatDate(task.startDate)}
                      </td>
                      <td className="px-3 py-2">{formatDate(task.endDate)}</td>
                      <td className="px-3 py-2">
                        {task.progress ? `${task.progress}%` : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales Invoices */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between mb-2 items-center">
            <h3 className="font-semibold text-gray-800">Sales Invoices</h3>
            <Button
              variant="custom"
              className="text-xs text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600"
              onClick={() => setShowInvoiceModal(true)}
            >
              + Add Invoice
            </Button>
          </div>

          {invoices.length === 0 ? (
            <div className="h-24 text-center text-sm text-gray-400 flex items-center justify-center border rounded">
              No invoices to show
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700 border">
                <thead>
                  <tr className="text-gray-500 border-b bg-gray-50">
                    <th className="py-2 px-3 text-left">ID</th>
                    <th className="py-2 px-3 text-left">Firm</th>
                    <th className="py-2 px-3 text-left">Date</th>
                    <th className="py-2 px-3 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-3 py-2">{inv.id}</td>
                      <td className="px-3 py-2">{inv.firm}</td>
                      <td className="px-3 py-2">{formatDate(inv.date)}</td>
                      <td className="px-3 py-2">₹ {inv.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Labour Attendance & Photos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Attendance */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-800">Labour Attendance</h3>
            <Button
              className="text-xs text-white bg-indigo-500 px-3 py-1 rounded hover:bg-indigo-600"
              onClick={() => setShowAttendanceModal(true)}
            >
              + Mark Attendance
            </Button>
          </div>

          {attendance.length === 0 ? (
            <div className="h-24 text-center text-sm text-gray-400 flex items-center justify-center">
              No attendance records
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-2 border">{record.name}</td>
                      <td className="p-2 border">{record.date}</td>
                      <td
                        className={`p-2 border ${
                          record.status === "Full Day"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {record.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Photos */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-800">Project Photos</h3>
            <Button
              variant="custom"
              className="text-xs text-white bg-gray-700 px-3 py-1 rounded hover:bg-gray-800"
              onClick={() => setShowPhotoModal(true)}
            >
              + Add Photo
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {photos.length === 0
              ? Array(3)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-100 h-24 flex items-center justify-center text-xs text-gray-500 rounded"
                    >
                      No image
                    </div>
                  ))
              : photos.map((p, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-100 h-24 flex items-center justify-center text-xs text-gray-500 rounded"
                  >
                    <img
                      src={p}
                      alt={`Project ${idx}`}
                      className="h-full w-full object-cover rounded"
                    />
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        addTask={(task) => setTasks([...tasks, task])}
      />
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        addInvoice={addInvoice}
        nextId={invoices.length + 1}
      />

      <AttendanceModal
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        addAttendance={addAttendance}
      />
      <PhotoModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        addPhoto={(url) => setPhotos([...photos, url])}
      />
    </div>
  );
}

export default ProjectsOverview;
