// src/services/staffServices.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Fetch all staff for a project
export const fetchStaffByProject = async (projectId) => {
  const res = await axiosInstance.get(`/api/staff?projectId=${projectId}`);
  return res.data.staff || [];
};

// Fetch single staff by ID
  export const fetchStaffById = async (staffId) => {
    const res = await axiosInstance.get(`/api/staff/${staffId}`);
    return res.data;
  };

// Create new staff
export const createStaff = async (staffData) => {
  const res = await axiosInstance.post("/api/staff", staffData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Update staff (PUT - full update)
export const updateStaff = async (staffId, staffData) => {
  const res = await axiosInstance.put(`/api/staff/${staffId}`, staffData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Delete staff
export const deleteStaff = async (staffId) => {
  const res = await axiosInstance.delete(`/api/staff/${staffId}`);
  return res.data;
};
