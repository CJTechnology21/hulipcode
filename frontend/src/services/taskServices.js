// src/services/taskServices.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

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
  const res = await axiosInstance.post("/api/tasks", taskData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Update task (PUT)
export const updateTask = async (taskId, taskData) => {
  const res = await axiosInstance.put(`/api/tasks/${taskId}`, taskData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Patch task (partial update)
export const patchTask = async (taskId, taskData) => {
  const res = await axiosInstance.patch(`/api/tasks/${taskId}`, taskData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Delete task
export const deleteTask = async (taskId) => {
  const res = await axiosInstance.delete(`/api/tasks/${taskId}`);
  return res.data;
};
