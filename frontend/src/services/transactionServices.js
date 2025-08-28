import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

// Create axios instance for all requests
const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Fetch all transactions (with optional filters)
export const fetchTransactions = async (filters = {}) => {
  // filters can include projectId and architectId
  const query = new URLSearchParams(filters).toString();
  const res = await axiosInstance.get(`/api/transactions?${query}`);
  return res.data;
};

// Get single transaction by ID
export const fetchTransactionById = async (transactionId) => {
  const res = await axiosInstance.get(`/api/transactions/${transactionId}`);
  return res.data;
};

// Create a new transaction
export const createTransaction = async (transactionData) => {
  const res = await axiosInstance.post("/api/transactions", transactionData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Full update (PUT) an existing transaction
export const updateTransaction = async (transactionId, transactionData) => {
  const res = await axiosInstance.put(
    `/api/transactions/${transactionId}`,
    transactionData,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

// Partial update (PATCH) a transaction
export const patchTransaction = async (transactionId, transactionData) => {
  const res = await axiosInstance.patch(
    `/api/transactions/${transactionId}`,
    transactionData,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

// Delete a transaction
export const deleteTransaction = async (transactionId) => {
  const res = await axiosInstance.delete(`/api/transactions/${transactionId}`);
  return res.data;
};
