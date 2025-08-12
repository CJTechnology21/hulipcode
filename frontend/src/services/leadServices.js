// src/services/leadServices.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/leads";

export const fetchLeads = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};
