import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Create axios instance for all requests
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ send cookies with requests
});

// ─────── LEADS ───────

// Fetch all leads
export const fetchLeads = async () => {
  const res = await axiosInstance.get("/leads");
  return res.data;
};

// Create a new lead
export const createLead = async (leadData) => {
  const res = await axiosInstance.post("/leads", leadData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// ─────── ARCHITECTS ───────

// Fetch architects
export const fetchArchitects = async () => {
  const res = await axiosInstance.get("/user/architects");
  return res.data;
};

// // src/services/leadServices.js
// import axios from "axios";

// const API_URL = "http://localhost:5000/api/leads";

// export const fetchLeads = async () => {
//   try {
//     const response = await axios.get(API_URL);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// // Create a new lead
// export const createLead = async (leadData) => {
//   try {
//     const response = await axios.post(API_URL, leadData, {
//       withCredentials: true, // ✅ ensures cookies are sent
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
// export const fetchArchitects = async () => {
//   const res = await axiosInstance.get("/user/architects");
//   return res.data;
// };

