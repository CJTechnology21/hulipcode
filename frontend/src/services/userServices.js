import axios from "axios";
const API_BASE = process.env.REACT_APP_API_BASE;

// Create axios instance for all requests
const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// -------------------- USER --------------------
export const createUser = async (userData) => {
  const res = await axiosInstance.post("/api/user", userData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const updateUser = async (userId, userData) => {
  const res = await axiosInstance.put(`/api/user/${userId}`, userData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// -------------------- ADDRESS --------------------
export const fetchAddresses = async (userId) => {
  const res = await axiosInstance.get(`/api/user/${userId}/address`);
  return res.data;
};

export const addAddress = async (userId, addressData) => {
  const res = await axiosInstance.post(`/api/user/${userId}/address`, addressData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const updateAddress = async (userId, addressId, addressData) => {
  const res = await axiosInstance.put(`/api/user/${userId}/address/${addressId}`, addressData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const deleteAddress = async (userId, addressId) => {
  const res = await axiosInstance.delete(`/api/user/${userId}/address/${addressId}`);
  return res.data;
};

// -------------------- BANK DETAILS --------------------
export const fetchBankDetails = async (userId) => {
  const res = await axiosInstance.get(`/api/user/${userId}/bank`);
  return res.data;
};

export const addBankDetail = async (userId, bankData) => {
  const res = await axiosInstance.post(`/api/user/${userId}/bank`, bankData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const updateBankDetail = async (userId, bankId, bankData) => {
  const res = await axiosInstance.put(`/api/user/${userId}/bank/${bankId}`, bankData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const deleteBankDetail = async (userId, bankId) => {
  const res = await axiosInstance.delete(`/api/user/${userId}/bank/${bankId}`);
  return res.data;
};

// -------------------- DOCUMENTS (Aadhaar/PAN) --------------------
export const uploadDocument = async (userId, docData) => {
  // docData = { type: "aadhaar" | "pan", fileUrl: "http://..." }
  const res = await axiosInstance.put(`/api/user/${userId}/document`, docData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};
