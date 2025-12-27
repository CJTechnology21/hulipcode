import axiosInstance from "./axiosInstance";

// Add a professional to shortlist
export const addToShortlist = async (professionalId, portfolioProfileId) => {
  try {
    const response = await axiosInstance.post("/api/shortlist", {
      professionalId,
      portfolioProfileId
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to shortlist:", error);
    throw error;
  }
};

// Remove a professional from shortlist
export const removeFromShortlist = async (professionalId) => {
  try {
    const response = await axiosInstance.delete("/api/shortlist", {
      data: { professionalId }
    });
    return response.data;
  } catch (error) {
    console.error("Error removing from shortlist:", error);
    throw error;
  }
};

// Get all shortlisted professionals
export const getShortlistedProfessionals = async () => {
  try {
    const response = await axiosInstance.get("/api/shortlist");
    return response.data;
  } catch (error) {
    console.error("Error fetching shortlisted professionals:", error);
    throw error;
  }
};

// Check if a professional is shortlisted
export const checkShortlisted = async (professionalId) => {
  try {
    const response = await axiosInstance.get(`/api/shortlist/check/${professionalId}`);
    return response.data;
  } catch (error) {
    console.error("Error checking shortlist status:", error);
    throw error;
  }
};

// Check multiple professionals at once
export const checkMultipleShortlisted = async (professionalIds) => {
  try {
    const response = await axiosInstance.post("/api/shortlist/check-multiple", {
      professionalIds
    });
    return response.data;
  } catch (error) {
    console.error("Error checking multiple shortlist status:", error);
    throw error;
  }
};



