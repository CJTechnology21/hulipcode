import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Add a pending material

export const addPendingMaterialAPI = async (materialData) => {
  const res = await axiosInstance.post("/api/pending-materials", materialData);
  return res.data;
};


//  Get all pending materials for a specific project

export const getPendingMaterialsByProjectAPI = async (projectId) => {
  const res = await axiosInstance.get(`/api/pending-materials/project/${projectId}`);
  return res.data;
};


//   Move pending materials into a RFQ

export const movePendingMaterialsToRFQAPI = async (rfqId, projectId) => {
  const res = await axiosInstance.post(`/api/pending-materials/move/${rfqId}`, {
    projectId,
  });
  return res.data;
};


//   Delete a pending material by ID

export const deletePendingMaterialAPI = async (materialId) => {
  const res = await axiosInstance.delete(`/api/pending-materials/${materialId}`);
  return res.data;
};
