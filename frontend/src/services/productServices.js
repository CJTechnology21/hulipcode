// src/services/productService.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

export const addToCartAPI = (items, token) => {
  return axios.post(
    `${API_BASE}/api/cart`,
    { items },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getFavouritesAPI = (token) => {
  return axios.get(`${API_BASE}/api/favourites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addFavouriteAPI = (productId, token) => {
  return axios.post(
    `${API_BASE}/api/favourites`,
    { productId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const removeFavouriteAPI = (productId, token) => {
  return axios.delete(`${API_BASE}/api/favourites/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
