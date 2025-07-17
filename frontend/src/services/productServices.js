import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

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

// 🛒 Add items to cart
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

// ❤️ Get user's favourite products
export const getFavouritesAPI = (token) => {
  return axios.get(`${API_BASE}/api/favourites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ❤️ Add a product to favourites
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

// ❌ Remove a product from favourites
export const removeFavouriteAPI = (productId, token) => {
  return axios.delete(`${API_BASE}/api/favourites/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// // src/services/productService.js
// import axios from "axios";

// const API_BASE = process.env.REACT_APP_API_BASE;

// export const addToCartAPI = (items, token) => {
//   return axios.post(
//     `${API_BASE}/api/cart`,
//     { items },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
// };

// export const getFavouritesAPI = (token) => {
//   return axios.get(`${API_BASE}/api/favourites`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

// export const addFavouriteAPI = (productId, token) => {
//   return axios.post(
//     `${API_BASE}/api/favourites`,
//     { productId },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
// };

// export const removeFavouriteAPI = (productId, token) => {
//   return axios.delete(`${API_BASE}/api/favourites/${productId}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };
