// src/services/todoServices.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

//  Fetch all todos for a project
export const fetchTodosByProject = async (projectId) => {
  const res = await axiosInstance.get(`/api/todo?projectId=${projectId}`);
  return res.data;
};

//  Fetch single todo by ID
export const fetchTodoById = async (todoId) => {
  const res = await axiosInstance.get(`/api/todo/${todoId}`);
  return res.data;
};

//  Create new todo
export const createTodo = async (todoData) => {
  const res = await axiosInstance.post("/api/todo", todoData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

//  Update todo (PUT - full update)
export const updateTodo = async (todoId, todoData) => {
  const res = await axiosInstance.put(`/api/todo/${todoId}`, todoData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

//  Delete todo
export const deleteTodo = async (todoId) => {
  const res = await axiosInstance.delete(`/api/todo/${todoId}`);
  return res.data;
};

//Get TodoName
export const getTodoName = async (projectId) => {
  const res = await axiosInstance.get(`/api/todo?projectId${projectId}`)
  return res.data;
}
