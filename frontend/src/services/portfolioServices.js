import axiosInstance from "./axiosInstance";

// Create a new portfolio project
export const createPortfolio = async (portfolioData) => {
  const res = await axiosInstance.post("/api/portfolio", portfolioData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Get all portfolio projects for the current user
export const getPortfolios = async () => {
  const res = await axiosInstance.get("/api/portfolio");
  return res.data;
};

// Get a single portfolio project by ID
export const getPortfolioById = async (id) => {
  const res = await axiosInstance.get(`/api/portfolio/${id}`);
  return res.data;
};

// Update a portfolio project
export const updatePortfolio = async (id, portfolioData) => {
  const res = await axiosInstance.put(`/api/portfolio/${id}`, portfolioData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Delete a portfolio project
export const deletePortfolio = async (id) => {
  const res = await axiosInstance.delete(`/api/portfolio/${id}`);
  return res.data;
};

// Get portfolios by architect ID (public)
export const getPortfoliosByArchitectId = async (architectId) => {
  const res = await axiosInstance.get(`/api/portfolio/architect/${architectId}`);
  return res.data;
};

