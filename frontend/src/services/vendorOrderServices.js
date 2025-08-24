// src/services/vendorOrderServices.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// ==============================
// Fetch all vendor orders (optional project filter)
// ==============================
export const fetchVendorOrders = async (projectId = null) => {
  const url = projectId ? `/api/vendorOrders?projectId=${projectId}` : "/api/vendorOrders";
  const res = await axiosInstance.get(url);
  return res.data;
};

// ==============================
// Fetch single vendor order by ID
// ==============================
export const fetchVendorOrderById = async (orderId) => {
  const res = await axiosInstance.get(`/api/vendorOrders/${orderId}`);
  return res.data;
};

// ==============================
// Create a new vendor order
// ==============================
export const createVendorOrder = async (orderData) => {
  const res = await axiosInstance.post("/api/vendorOrders", orderData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// ==============================
// Update vendor order (PUT)
// ==============================
export const updateVendorOrder = async (orderId, orderData) => {
  const res = await axiosInstance.put(`/api/vendorOrders/${orderId}`, orderData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// ==============================
// Patch vendor order (partial update)
// ==============================
export const patchVendorOrder = async (orderId, orderData) => {
  const res = await axiosInstance.patch(`/api/vendorOrders/${orderId}`, orderData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// ==============================
// Delete vendor order
// ==============================
export const deleteVendorOrder = async (orderId) => {
  const res = await axiosInstance.delete(`/api/vendorOrders/${orderId}`);
  return res.data;
};
