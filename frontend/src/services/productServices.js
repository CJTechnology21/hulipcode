
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
export const addToCartAPI = async (userId, items) => {
  if (!userId || !items || !items.length || !items[0]._id) {
    throw new Error("Invalid payload: Missing userId or item _id");
  }

  try {
    const res = await axiosInstance.post("/api/cart", {
      userId,
      items,
    });
    return res.data;
  } catch (err) {
    console.error("❌ Cart API error:", JSON.stringify(err?.response?.data || err.message, null, 2));
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

//fetch products by category 
export const fetchProductsByCategory = async (category) => {
  try {
    const res = await axiosInstance.get(`/api/products?category=${encodeURIComponent(category)}`);
    return res.data || [];
  } catch (err) {
    console.error("❌ Failed to fetch products by category:", err.message);
    return [];
  }
};
