// src/services/subconServices.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

const axiosInstance = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
});

// Fetch subcon orders by project
export const fetchSubconByProject = async (projectId) => {
    const res = await axiosInstance.get(`/api/subcon?projectId=${projectId}`);
    return res.data;
};


// Fetch subcon orders by architect
export const fetchSubconByArchitect = async (architectId) => {
    const res = await axiosInstance.get(`/api/subcon/architect?architectId=${architectId}`);
    return res.data;
};

// Fetch single subcon order by ID
export const fetchSubconById = async (subconId) => {
    const res = await axiosInstance.get(`/api/subcon/${subconId}`);
    return res.data;
};


// Create new subcon order
export const createSubcon = async (subconData) => {
    const res = await axiosInstance.post("/api/subcon", subconData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
};


// Update subcon order (full update)
export const updateSubcon = async (subconId, subconData) => {
    const res = await axiosInstance.put(`/api/subcon/${subconId}`, subconData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
};

// Patch subcon order (partial update)
export const patchSubcon = async (subconId, subconData) => {
    const res = await axiosInstance.patch(`/api/subcon/${subconId}`, subconData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
};


// Delete subcon order
export const deleteSubcon = async (subconId) => {
    const res = await axiosInstance.delete(`/api/subcon/${subconId}`);
    return res.data;
};
