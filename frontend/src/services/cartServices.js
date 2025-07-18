
// src/services/cartService.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

// Axios instance with credentials enabled
const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // ✅ send cookies automatically
});

// ✅ Get user cart (optional)
export const getCartAPI = async () => {
  const res = await axiosInstance.get("/api/cart");
  return res.data;
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
  return res.data.rewardPoints || 0;
};
// // src/services/cartService.js
// import axios from "axios";

// const API_BASE = process.env.REACT_APP_API_BASE;

// // Get user cart (if needed in future)
// export const getCartAPI = async (token) => {
//   const res = await axios.get(`${API_BASE}/api/cart`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return res.data;
// };

// //  Add item(s) to cart
// export const addToCartAPI = async (items, token) => {
//   const res = await axios.post(
//     `${API_BASE}/api/cart`,
//     { items },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
//   return res.data;
// };

// //  Remove item from cart
// export const removeFromCartAPI = async (id, token) => {
//   return axios.delete(`${API_BASE}/api/cart/${id}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

// // Fetch user reward points
// export const getUserRewardPointsAPI = async (token) => {
//   const res = await axios.get(`${API_BASE}/api/user/me`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return res.data.rewardPoints || 0;
// };
