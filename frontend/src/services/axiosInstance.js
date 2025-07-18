// services/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
  withCredentials: true, // Always send cookies
});

export default axiosInstance;
