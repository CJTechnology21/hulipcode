
import axiosInstance from "./axiosInstance";

// Fetch a single product by ID
export const fetchProductById = async (id) => {
  const res = await axiosInstance.get(`/api/products/${id}`);
  return res.data;
};

// Fetch related products by category
export const fetchRelatedProducts = async (category, currentProductId) => {
  const res = await axiosInstance.get(`/api/products?category=${category}`);
  return res.data.filter((p) => p._id !== currentProductId).slice(0, 4);
};

// ✅ Add items to cart (auth via HTTP-only cookie)
export const addToCartAPI = async (items) => {
  try {
    const res = await axiosInstance.post("/api/cart", { items });
    return res.data;
  } catch (err) {
    console.error("❌ addToCartAPI failed:", err?.response?.data || err.message);
    throw err;
  }
};

// Favourites
export const getFavouritesAPI = () => {
  return axiosInstance.get("/api/favourites");
};

export const addFavouriteAPI = (productId) => {
  return axiosInstance.post("/api/favourites", { productId });
};

export const removeFavouriteAPI = (productId) => {
  return axiosInstance.delete(`/api/favourites/${productId}`);
};

// import axiosInstance from "./axiosInstance";

// // 🆕 Fetch a single product by ID
// export const fetchProductById = async (id) => {
//   const res = await axiosInstance.get(`/api/products/${id}`);
//   return res.data;
// };

// // 🆕 Fetch related products by category, excluding current product
// export const fetchRelatedProducts = async (category, currentProductId) => {
//   const res = await axiosInstance.get(`/api/products?category=${category}`);
//   return res.data.filter((p) => p._id !== currentProductId).slice(0, 4);
// };

// // 🛒 Add items to cart (auth via HTTP-only cookie)
// export const addToCartAPI = async (items) => {
//   try {
//     const res = await axiosInstance.post("/api/cart", { items });
//     return res.data;
//   } catch (err) {
//     console.error("❌ addToCartAPI failed:", err?.response?.data || err.message);
//     throw err;
//   }
// };

// // ❤️ Get user's favourite products
// export const getFavouritesAPI = () => {
//   return axiosInstance.get("/api/favourites");
// };

// // ❤️ Add a product to favourites
// export const addFavouriteAPI = (productId) => {
//   return axiosInstance.post("/api/favourites", { productId });
// };

// // ❌ Remove a product from favourites
// export const removeFavouriteAPI = (productId) => {
//   return axiosInstance.delete(`/api/favourites/${productId}`);
// };
