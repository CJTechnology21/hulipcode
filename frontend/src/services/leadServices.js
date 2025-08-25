import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

// Create axios instance for all requests
const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Fetch all leads
export const fetchLeads = async () => {
  const res = await axiosInstance.get("/api/leads");
  return res.data;
};

// Create a new lead
export const createLead = async (leadData) => {
  const res = await axiosInstance.post("/api/leads", leadData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Update (PUT) an existing lead
export const updateLead = async (leadId, leadData) => {
  const res = await axiosInstance.put(`/api/leads/${leadId}`, leadData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Patch (partial update) a lead
export const patchLead = async (leadId, leadData) => {
  const res = await axiosInstance.patch(`/api/leads/${leadId}`, leadData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Delete a lead
export const deleteLead = async (leadId) => {
  const res = await axiosInstance.delete(`/api/leads/${leadId}`);
  return res.data;
};

// Fetch architects
export const fetchArchitects = async () => {
  const res = await axiosInstance.get("/api/user/architects");
  return res.data;
};

//Fetch Vendors
export const fetchVendors = async ()=>{
  const res = await axiosInstance.get("/api/user/vendors");
  return res.data;
}
//Fetch Architects and Clients
export const fetchArchandClients = async ()=>{
  const res = await axiosInstance.get("/api/user/architects-clients");
  return res.data;
}