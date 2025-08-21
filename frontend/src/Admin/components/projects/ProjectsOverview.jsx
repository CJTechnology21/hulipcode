import React, { useState, useEffect } from "react";
import TaskModal from "./OverviewComponents/TaskModal";
import InvoiceModal from "./OverviewComponents/InvoiceModal";
import AttendanceModal from "./OverviewComponents/AttendanceModal";
import PhotoModal from "./OverviewComponents/PhotoModal";
import Button from "../../../components/Button";
import { formatDate } from "../../../utils/dateFormatter";
import {
  fetchTasksByProject,
  fetchInvoices,
  fetchAttendance,
  fetchProjectPhotos,
} from "../../../services/overViewServices";
import TaskSchedule from "./OverviewComponents/TaskShedule";
import InvoiceTable from "./OverviewComponents/InvoiceTable";
import AttendanceTable from "./OverviewComponents/AttendanceTable";
function ProjectsOverview({ projectId, projectName }) {
  // State for data
  const [tasks, setTasks] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const addInvoice = (invoice) => {
    setInvoices((prev) => [...prev, invoice]);
  };

  const addAttendance = (record) => {
    setAttendance((prev) => [...prev, record]);
  };

  useEffect(() => {
    if (!projectId) return;

    const loadTasks = async () => {
      try {
        setLoading(true);
        const data = await fetchTasksByProject(projectId);
        setTasks(data.tasks || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [projectId]);
  useEffect(() => {
    if (!projectId) return;

    const loadInvoices = async () => {
      try {
        setLoadingInvoices(true);
        const data = await fetchInvoices(projectId);
        // console.log("Fetched invoices:", data);

        // Handle different API response shapes
        if (Array.isArray(data)) {
          setInvoices(data);
        } else if (data.invoices) {
          setInvoices(data.invoices);
        } else if (data.data) {
          setInvoices(data.data);
        } else {
          setInvoices([]);
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setInvoices([]);
      } finally {
        setLoadingInvoices(false);
      }
    };

    loadInvoices();
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;

    const loadAttendance = async () => {
      try {
        setLoading(true); // or make a new loadingAttendance state if needed
        const data = await fetchAttendance(projectId);

        if (Array.isArray(data)) {
          setAttendance(data);
        } else if (data.attendance) {
          setAttendance(data.attendance);
        } else if (data.data) {
          setAttendance(data.data);
        } else {
          setAttendance([]);
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setAttendance([]);
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, [projectId]);

  // Fetch photos from backend
  // const fetchPhotos = async () => {
  //   try {
  //     const { data } = await axios.get(
  //       `http://localhost:5000/api/photo/get-photos/${projectId}`
  //     );
  //     setPhotos(data.photos);
  //   } catch (error) {
  //     console.error("Error fetching photos:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (projectId) fetchPhotos();
  // }, [projectId]);

  // Fetch photos from backend
  const loadPhotos = async () => {
    if (!projectId) return;
    try {
      const data = await fetchProjectPhotos(projectId);
      // data should be { photos: [...] } based on backend response
      setPhotos(data.photos || []);
    } catch (error) {
      console.error("Failed to load project photos:", error);
    }
  };

  // Load photos on mount and whenever projectId changes
  useEffect(() => {
    loadPhotos();
  }, [projectId]);

  // State for modal visibility
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  //loading modals
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  // eslint-disable-next-line
  const [loadingAttendance, setLoadingAttendance] = useState(false);
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
        <TaskSchedule
          tasks={tasks}
          loading={loading}
          setTasks={setTasks}
          setShowTaskModal={setShowTaskModal}
          formatDate={formatDate}
        />
        {/* Sales Invoices */}
        <InvoiceTable
          invoices={invoices}
          loadingInvoices={loadingInvoices}
          setInvoices={setInvoices}
          setShowInvoiceModal={setShowInvoiceModal}
          formatDate={formatDate}
        />
      </div>

      {/* Labour Attendance & Photos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Attendance */}
        <AttendanceTable
          attendance={attendance}
          loading={loadingAttendance}
          setAttendance={setAttendance}
          setShowAttendanceModal={setShowAttendanceModal}
          formatDate={formatDate}
        />
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
                      src={p.url} // <-- use p.url here
                      alt={`Project ${idx}`}
                      className="h-full w-full object-cover rounded"
                    />
                  </div>
                ))}
          </div>
        </div>

        {/* <div className="bg-white p-4 rounded-xl shadow">
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
        </div> */}
      </div>

      {/* Modals */}

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        addTask={(task) => {
          const taskWithProject = { ...task, project: projectId };
          setTasks([...tasks, taskWithProject]);
        }}
        projectId={projectId} // <-- missing earlier
      />

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        addInvoice={addInvoice}
        nextId={invoices.length + 1}
        projectId={projectId}
      />

      <AttendanceModal
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        addAttendance={addAttendance}
        projectId={projectId}
      />
      <PhotoModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        addPhoto={(url) => setPhotos([...photos, url])}
        projectId={projectId}
      />
    </div>
  );
}

export default ProjectsOverview;
