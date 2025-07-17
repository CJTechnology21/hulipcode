// src/services/cartService.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

// Get user cart (if needed in future)
export const getCartAPI = async (token) => {
  const res = await axios.get(`${API_BASE}/api/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

//  Add item(s) to cart
export const addToCartAPI = async (items, token) => {
  const res = await axios.post(
    `${API_BASE}/api/cart`,
    { items },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

//  Remove item from cart
export const removeFromCartAPI = async (id, token) => {
  return axios.delete(`${API_BASE}/api/cart/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Fetch user reward points
export const getUserRewardPointsAPI = async (token) => {
  const res = await axios.get(`${API_BASE}/api/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.rewardPoints || 0;
};
