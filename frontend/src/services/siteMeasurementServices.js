import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Fetch all site measurements for a project
export const fetchSiteMeasurementsByProject = async (projectId) => {
  const res = await axiosInstance.get(`/api/site?projectId=${projectId}`);
  return res.data;
};

// Fetch single site measurement by ID
export const fetchSiteMeasurementById = async (measurementId) => {
  const res = await axiosInstance.get(`/api/site/${measurementId}`);
  return res.data;
};

// Create new site measurement
export const createSiteMeasurement = async (measurementData) => {
  const res = await axiosInstance.post("/api/site", measurementData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Update site measurement (PUT - full update)
export const updateSiteMeasurement = async (measurementId, measurementData) => {
  const res = await axiosInstance.put(`/api/site/${measurementId}`, measurementData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Delete site measurement
export const deleteSiteMeasurement = async (measurementId) => {
  const res = await axiosInstance.delete(`/api/site/${measurementId}`);
  return res.data;
};
