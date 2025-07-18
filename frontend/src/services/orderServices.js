// src/services/orderServices.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// ✅ Place Order
export const placeOrderAPI = async (orderData) => {
  const res = await axiosInstance.post("/api/orders", orderData);
  return res.data;
};

// ✅ Clear Cart
export const clearCartAPI = async () => {
  return axiosInstance.delete("/api/cart/clear");
};
