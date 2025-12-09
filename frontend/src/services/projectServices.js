// src/services/projectServices.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

// Create axios instance

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, 
});

// Fetch all projects
export const fetchProjects = async () => {
  try {
    const res = await axiosInstance.get("/api/projects");
    return res.data;
  } catch (error) {
    // Handle 401 - user not authenticated
    if (error.response?.status === 401) {
      // Return empty array instead of throwing error
      // The interceptor will handle redirect
      return [];
    }
    throw error;
  }
};

// Create a new project
export const createProject = async (projectData) => {
  const res = await axiosInstance.post("/api/projects", projectData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Update (PUT) an entire project
export const updateProject = async (projectId, projectData) => {
  const res = await axiosInstance.put(`/api/projects/${projectId}`, projectData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Patch (partial update) project
export const patchProject = async (projectId, projectData) => {
  const res = await axiosInstance.patch(`/api/projects/${projectId}`, projectData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Delete project
export const deleteProject = async (projectId) => {
  const res = await axiosInstance.delete(`/api/projects/${projectId}`);
  return res.data;
};

// Fetch project by ID
export const fetchProjectById = async (projectId) => {
  const res = await axiosInstance.get(`/api/projects/${projectId}`);
  return res.data;
};

export const fetchProjectsByArchitect = async (architectId) => {
  const res = await axiosInstance.get(`/api/projects/architect/${architectId}`);
  return res.data;
};

