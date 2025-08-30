// services/projectAttendanceServices.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

// Create axios instance for all requests
const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

//  Fetch all project attendance records (optional filter by projectId)
export const fetchProjectAttendance = async (projectId) => {
  const query = projectId ? `?projectId=${projectId}` : "";
  const res = await axiosInstance.get(`/api/proattendance${query}`);
  return res.data;
};

// Fetch current month's project attendance (optional filter by name)
export const fetchCurrentMonthProjectAttendance = async (name) => {
  const query = name ? `?name=${name}` : "";
  const res = await axiosInstance.get(`/api/proattendance/current-month${query}`);
  return res.data;
};

// Create a new project attendance record
export const createProjectAttendance = async (attendanceData) => {
  const res = await axiosInstance.post("/api/proattendance", attendanceData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

//  Update an existing project attendance record
export const updateProjectAttendance = async (attendanceId, attendanceData) => {
  const res = await axiosInstance.put(`/api/proattendance/${attendanceId}`, attendanceData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

//  Delete a project attendance record
export const deleteProjectAttendance = async (attendanceId) => {
  const res = await axiosInstance.delete(`/api/proattendance/${attendanceId}`);
  return res.data;
};


// Create a new user
export const createUser = async (userData) => {
  const res = await axiosInstance.post("/api/staff", userData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};
