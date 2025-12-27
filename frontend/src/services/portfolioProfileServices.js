import axiosInstance from "./axiosInstance";

// Get portfolio profile for current user
export const getPortfolioProfile = async () => {
  const res = await axiosInstance.get("/api/portfolio-profile");
  return res.data;
};

// Save portfolio profile (create or update)
export const savePortfolioProfile = async (profileData) => {
  const res = await axiosInstance.post("/api/portfolio-profile", profileData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Update portfolio profile
export const updatePortfolioProfile = async (profileData) => {
  const res = await axiosInstance.put("/api/portfolio-profile", profileData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Get all portfolio profiles (public - for Professional section)
export const getAllPortfolioProfiles = async () => {
  const res = await axiosInstance.get("/api/portfolio-profile/all");
  return res.data;
};

// Get portfolio profile by architect ID (public)
export const getPortfolioProfileByArchitectId = async (architectId) => {
  const res = await axiosInstance.get(`/api/portfolio-profile/architect/${architectId}`);
  return res.data;
};

