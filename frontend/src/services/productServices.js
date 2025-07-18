
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

// ✅ Global axios config to always send cookies
axios.defaults.withCredentials = true;

// 🆕 Fetch a single product by ID
export const fetchProductById = async (id) => {
  const res = await axios.get(`${API_BASE}/api/products/${id}`);
  return res.data;
};

// 🆕 Fetch related products by category, excluding current product
export const fetchRelatedProducts = async (category, currentProductId) => {
  const res = await axios.get(`${API_BASE}/api/products?category=${category}`);
  return res.data.filter((p) => p._id !== currentProductId).slice(0, 4);
};

// 🛒 Add items to cart (auth via HTTP-only cookie)
export const addToCartAPI = async (items) => {
  try {
    const res = await axios.post(`${API_BASE}/api/cart`, { items });
    if (res.status !== 200 && res.status !== 201) {
      throw new Error(`Server error: ${res.status}`);
    }
    return res.data;
  } catch (err) {
    console.error("addToCartAPI failed:", err.response?.data || err.message);
    throw err;
  }
};


// ❤️ Get user's favourite products
export const getFavouritesAPI = () => {
  return axios.get(`${API_BASE}/api/favourites`);
};

// ❤️ Add a product to favourites
export const addFavouriteAPI = (productId) => {
  return axios.post(`${API_BASE}/api/favourites`, { productId });
};

// ❌ Remove a product from favourites
export const removeFavouriteAPI = (productId) => {
  return axios.delete(`${API_BASE}/api/favourites/${productId}`);
};