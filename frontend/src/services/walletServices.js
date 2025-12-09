// services/walletServices.js
import axiosInstance from "./axiosInstance";

/**
 * Get wallet balance for a project
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Wallet balance data
 */
export const getWalletBalance = async (projectId) => {
  try {
    const res = await axiosInstance.get(`/api/wallet/balance/${projectId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    throw error;
  }
};

/**
 * Get wallet details for a project
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Wallet details
 */
export const getWalletByProject = async (projectId) => {
  try {
    const res = await axiosInstance.get(`/api/wallet/project/${projectId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching wallet:", error);
    throw error;
  }
};

/**
 * Create wallet for a project (admin only)
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Created wallet
 */
export const createWallet = async (projectId) => {
  try {
    const res = await axiosInstance.post("/api/wallet", { projectId });
    return res.data;
  } catch (error) {
    console.error("Error creating wallet:", error);
    throw error;
  }
};

/**
 * Get all wallets (admin only)
 * @returns {Promise<Object>} All wallets
 */
export const getAllWallets = async () => {
  try {
    const res = await axiosInstance.get("/api/wallet");
    return res.data;
  } catch (error) {
    console.error("Error fetching wallets:", error);
    throw error;
  }
};






