// src/services/partyServices.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// ✅ Fetch all party for a project
export const fetchpartyByProject = async (projectId) => {
  const res = await axiosInstance.get(`/api/party/project/${projectId}`);
  return res.data;
};

// ✅ Fetch single party by ID
export const fetchPartyById = async (partyId) => {
  const res = await axiosInstance.get(`/api/party/${partyId}`);
  return res.data;
};

// ✅ Create new party
export const createParty = async (partyData) => {
  const res = await axiosInstance.post("/api/party", partyData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// ✅ Update party (PATCH - partial update)
export const updateParty = async (partyId, partyData) => {
  const res = await axiosInstance.patch(`/api/party/${partyId}`, partyData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// ✅ Delete party
export const deleteParty = async (partyId) => {
  const res = await axiosInstance.delete(`/api/party/${partyId}`);
  return res.data;
};
