// src/services/quoteServices.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// -------------------- QUOTE SERVICES -------------------- //

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

// -------------------- SUMMARY SERVICES -------------------- //

// Add or replace summary array for a quote
export const addSummaryToQuote = async (quoteId, summary) => {
  if (!Array.isArray(summary)) {
    throw new Error("Summary must be an array");
  }
  const res = await axiosInstance.put(
    `/api/quote/${quoteId}/summary`,
    { summary },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

// Fetch only the summary of a quote
export const fetchQuoteSummary = async (quoteId) => {
  const res = await axiosInstance.get(`/api/quote/${quoteId}/summary`);
  return res.data;
};

// Update a single summary row (by space)
// api service
// services/quoteServices.js


export const updateSummaryRow = async (quoteId, spaceId, fields) => {
  console.log("PATCH URL:", `/api/quote/${quoteId}/summary/${spaceId}`);
  console.log("PATCH body:", fields);

  const res = await axiosInstance.patch(
    `/api/quote/${quoteId}/summary/${spaceId}`,
    fields, // ✅ send fields directly
    { headers: { "Content-Type": "application/json" } }
  );

  return res.data;
};


// export const updateSummaryRow = async (quoteId, spaceId, fields) => {
//   const res = await axiosInstance.patch(
//     `/api/quote/${quoteId}/summary/${spaceId}`,
//      {fields} ,
//     { headers: { "Content-Type": "application/json" } }
//   );
//   return res.data;
// };

// Delete a single summary row (by space)
export const deleteSummaryRow = async (quoteId, spaceId) => {
  const res = await axiosInstance.delete(
    `/api/quote/${quoteId}/summary/${spaceId}`
  );
  return res.data;
};

// export const deleteSummaryRow = async (quoteId, spaceId) => {
//   const res = await axiosInstance.delete(
//     `/api/quote/${quoteId}/summary/${spaceId}`,
//     {
//       data: { spaceId },
//       headers: { "Content-Type": "application/json" },
//     }
//   );
//   return res.data;
// };

// export const deleteSummaryRow = async (quoteId, space, spaceId) => {
//   const res = await axiosInstance.delete(`/api/quote/${quoteId}/summary/${spaceId}`, {
//     data: { space }, // axios requires `data` for DELETE body
//     headers: { "Content-Type": "application/json" },
//   });
//   return res.data;
// };
