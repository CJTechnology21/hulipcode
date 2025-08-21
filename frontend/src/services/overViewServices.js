// src/services/apiServices.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

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

export const fetchTasksByProject = async (projectId) => {
  if (!projectId) throw new Error("projectId is required");

  const res = await axiosInstance.get(`/api/tasks`, {
    params: { projectId }
  });

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

/* ---------------- INVOICE SERVICES ---------------- */

// Create new invoice
export const createInvoice = async (invoiceData) => {
  const res = await axiosInstance.post("/api/invoice", invoiceData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Fetch invoices (optional)
export const fetchInvoices = async (projectId) => {
  const res = await axiosInstance.get(`/api/invoice?projectId=${projectId}`);
  return res.data;
}

// Update invoice
export const updateInvoice = async (invoiceId, invoiceData) => {
  const res = await axiosInstance.put(`/api/invoice/${invoiceId}`, invoiceData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Delete invoice
export const deleteInvoice = async (invoiceId) => {
  const res = await axiosInstance.delete(`/api/invoice/${invoiceId}`);
  return res.data;
};


/* ---------------- ATTENDANCE SERVICES ---------------- */

// Fetch all attendance (optional filter by projectId)
export const fetchAttendance = async (projectId) => {
  const res = await axiosInstance.get(`/api/attendance?projectId=${projectId}`);
  return res.data;
};

// Create new attendance record
export const createAttendance = async (attendanceData) => {
  const res = await axiosInstance.post("/api/attendance", attendanceData);
  return res.data;
};

// Update attendance (PUT - full update)
export const updateAttendance = async (attendanceId, attendanceData) => {
  const res = await axiosInstance.put(
    `/api/attendance/${attendanceId}`,
    attendanceData,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

// Delete attendance
export const deleteAttendance = async (attendanceId) => {
  const res = await axiosInstance.delete(`/api/attendance/${attendanceId}`);
  return res.data;
};

/* ---------------- PHOTO / S3 SERVICES ---------------- */

// Generate S3 signed URL
export const generateUploadURL = async (fileName, fileType) => {
  if (!fileName || !fileType) throw new Error("fileName and fileType are required");

  const res = await axiosInstance.post("/api/photos/upload-url", { fileName, fileType });
  return res.data; // { uploadUrl, url }
};

// Add photo record to DB
export const addProjectPhoto = async (projectId, url) => {
  if (!projectId || !url) throw new Error("projectId and url are required");

  const res = await axiosInstance.post("/api/photos", { projectId, url });
  return res.data; // { message, fileUrl, photo }
};

// Get all photos for a project
// Fetch all photos for a project
export const fetchProjectPhotos = async (projectId) => {
  if (!projectId) throw new Error("projectId is required");

  const res = await axiosInstance.get(`/api/photos?projectId=${projectId}`);
  return res.data; // { photos: [url1, url2, ...] }
};
