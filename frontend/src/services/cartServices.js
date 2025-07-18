
// src/services/cartServices.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // ✅ Send cookies
});

// ✅ Get user cart
export const getCartAPI = async () => {
  const res = await axiosInstance.get("/api/cart");
  // console.log("🛒 Cart API response:", res.data);

  // ✅ FIX: Accept both { items: [...] } or direct array []
  if (Array.isArray(res.data)) {
    return res.data;
  }

  return res.data?.items || [];
};

// ✅ Add item(s) to cart
export const addToCartAPI = async (items) => {
  const res = await axiosInstance.post("/api/cart", { items });
  return res.data;
};

// ✅ Remove item from cart
export const removeFromCartAPI = async (id) => {
  return axiosInstance.delete(`/api/cart/${id}`);
};

// ✅ Fetch user reward points
export const getUserRewardPointsAPI = async () => {
  const res = await axiosInstance.get("/api/user/me");
  return res.data?.rewardPoints || 0;
};
// ✅ Update cart item quantity
export const updateCartItemAPI = async (id, quantity) => {
  return axiosInstance.put(`/api/cart/${id}`, { quantity });
};
