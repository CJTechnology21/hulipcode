
import axios from "axios";
const API_BASE = process.env.REACT_APP_API_BASE;

// Create axios instance for all requests
const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});


//  Address 
export const fetchAddresses = async (userId) => {
  const res = await axiosInstance.get(`/api/user/${userId}/address`);
  return res.data;
};

export const addAddress = async (userId, addressData) => {
  const res = await axiosInstance.post(`/api/user/${userId}/address`, addressData);
  return res.data;
};

export const updateAddress = async (userId, addressId, addressData) => {
  const res = await axiosInstance.put(`/api/user/${userId}/address/${addressId}`, addressData);
  return res.data;
};

//  Bank Detail 
export const fetchBankDetails = async (userId) => {
  const res = await axiosInstance.get(`/api/user/${userId}/bank`);
  return res.data;
};

export const addBankDetail = async (userId, bankData) => {
  const res = await axiosInstance.post(`/api/user/${userId}/bank`, bankData);
  return res.data;
};

export const updateBankDetail = async (userId, bankId, bankData) => {
  const res = await axiosInstance.put(`/api/user/${userId}/bank/${bankId}`, bankData);
  return res.data;
};

// ----- Document (Aadhaar/PAN) -----
export const uploadDocument = async (userId, docData) => {
  // docData = { type: "aadhaar" | "pan", fileUrl: "http://..." }
  const res = await axiosInstance.post(`/api/user/${userId}/document`, docData);
  return res.data;
};
