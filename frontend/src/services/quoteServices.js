// src/services/quoteServices.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Fetch all quotes (with optional filters)
export const fetchQuotes = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const res = await axiosInstance.get(`/api/quote${query ? `?${query}` : ""}`);
  return res.data;
};

// Fetch single quote by ID
export const fetchQuoteById = async (quoteId) => {
  const res = await axiosInstance.get(`/api/quote/${quoteId}`);
  return res.data;
};

// Create a new quote
export const createQuote = async (quoteData) => {
  const res = await axiosInstance.post("/api/quote", quoteData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Update (PUT – full update) quote
export const updateQuote = async (quoteId, quoteData) => {
  const res = await axiosInstance.put(`/api/quote/${quoteId}`, quoteData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Patch (partial update) quote
export const patchQuote = async (quoteId, quoteData) => {
  const res = await axiosInstance.patch(`/api/quote/${quoteId}`, quoteData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Delete quote
export const deleteQuote = async (quoteId) => {
  const res = await axiosInstance.delete(`/api/quote/${quoteId}`);
  return res.data;
};
