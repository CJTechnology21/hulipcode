// src/services/apiServices.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/* ---------------- TASK SERVICES ---------------- */

// Fetch all tasks
export const fetchTasks = async () => {
  const res = await axiosInstance.get("/api/tasks");
  return res.data;
};

// Fetch single task by id
export const fetchTaskById = async (taskId) => {
  const res = await axiosInstance.get(`/api/tasks/${taskId}`);
  return res.data;
};

// Create new task
export const createTask = async (taskData) => {
  const res = await axiosInstance.post("/api/tasks", taskData);
  return res.data;
};

// Update task (PUT)
export const updateTask = async (taskId, taskData) => {
  const res = await axiosInstance.put(`/api/tasks/${taskId}`, taskData);
  return res.data;
};

// Patch task (partial update)
export const patchTask = async (taskId, taskData) => {
  const res = await axiosInstance.patch(`/api/tasks/${taskId}`, taskData);
  return res.data;
};

// Delete task
export const deleteTask = async (taskId) => {
  const res = await axiosInstance.delete(`/api/tasks/${taskId}`);
  return res.data;
};

/* ---------------- ATTENDANCE SERVICES ---------------- */

// Fetch all attendance (optional filter by projectId)
export const fetchAttendance = async (projectId) => {
  const res = await axiosInstance.get("/api/attendance", {
    params: projectId ? { projectId } : {},
  });
  return res.data;
};

// Create new attendance record
export const createAttendance = async (attendanceData) => {
  const res = await axiosInstance.post("/api/attendance", attendanceData);
  return res.data;
};
// Create new invoice
export const createInvoice = async (invoiceData) => {
  const res = await axiosInstance.post("/api/invoices", invoiceData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Fetch invoices (optional)
export const fetchInvoices = async (projectId) => { 
  const res = await axiosInstance.get(`/api/invoices?projectId=${projectId}`);
  return res.data;
}