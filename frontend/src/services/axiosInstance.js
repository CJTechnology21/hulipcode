// services/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
  withCredentials: true,
});

// Add response interceptor to handle 401 errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if it's a true authentication error (not ACL)
      // Check if user data exists in localStorage (means they were logged in)
      const hasUserData = localStorage.getItem('crm_user_id') || localStorage.getItem('crm_role');
      
      if (hasUserData) {
        // User was logged in but token expired/invalid - clear and redirect
        localStorage.removeItem('crm_user_id');
        localStorage.removeItem('crm_role');
        localStorage.removeItem('crm_token');
        
        // Only redirect if not already on login/signup page
        const currentPath = window.location.pathname;
        const authPaths = ['/login', '/signup', '/'];
        
        if (!authPaths.includes(currentPath)) {
          // Redirect to login page
          window.location.href = '/login';
        }
      }
      // If no user data, might be a first-time access - don't redirect aggressively
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
