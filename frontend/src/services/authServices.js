import axios from "axios";

// Base URL from environment
const API_BASE = process.env.REACT_APP_API_BASE;

// Axios instance with cookie support
const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // ✅ include cookies in every request
});

// ─────── AUTH ───────

export const signupUser = (data) =>
  axiosInstance.post("/api/auth/signup", data).then(res => res.data);

export const loginUser = async (email, password) => {
  const response = await axiosInstance.post("/api/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post("/api/auth/logout");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/api/auth/me");
  return response.data;
};

// ─────── GOOGLE AUTH ───────

export const googleLoginUser = async (code) => {
  const response = await axiosInstance.post("/api/auth/google", { code });
  return response.data;
};

export const googleSignupInit = (code) => {
  return axiosInstance.post("/api/auth/google", { code }).then(res => res.data);
};

export const googleSignupComplete = (data) => {
  return axiosInstance.post("/api/auth/google/details", data).then(res => res.data);
};

// ─────── VENDOR ───────

export const storeVendorToken = async (vendorId, token) => {
  const response = await axiosInstance.post("/api/vendor/store-token", {
    vendorId,
    token,
  });
  return response.data;
};

// import axios from "axios";

// const API_BASE = process.env.REACT_APP_API_BASE;

// export const signupUser = (data) =>
//   axios.post(`${API_BASE}/api/auth/signup`, data).then(res => res.data);

// export const googleSignupInit = (code) =>
//   axios.post(`${API_BASE}/api/auth/google`, { code }).then(res => res.data);

// export const googleSignupComplete = (data) =>
//   axios.post(`${API_BASE}/api/auth/google/details`, data).then(res => res.data);

// export const loginUser = async (email, password) => {
//   const response = await axios.post(`${API_BASE}/api/auth/login`, {
//     email,
//     password,
//   });
//   return response.data;
// };

// export const googleLoginUser = async (code) => {
//   const response = await axios.post(`${API_BASE}/api/auth/google`, {
//     code,
//   });
//   return response.data;
// };

// export const storeVendorToken = async (vendorId, token) => {
//   const response = await fetch(`${API_BASE}/api/vendor/store-token`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ vendorId, token }),
//   });
//   return response.json();
// };
