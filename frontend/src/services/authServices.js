import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

export const signupUser = (data) =>
  axios.post(`${API_BASE}/api/auth/signup`, data).then(res => res.data);

export const googleSignupInit = (code) =>
  axios.post(`${API_BASE}/api/auth/google`, { code }).then(res => res.data);

export const googleSignupComplete = (data) =>
  axios.post(`${API_BASE}/api/auth/google/details`, data).then(res => res.data);

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_BASE}/api/auth/login`, {
    email,
    password,
  });
  return response.data;
};

export const googleLoginUser = async (code) => {
  const response = await axios.post(`${API_BASE}/api/auth/google`, {
    code,
  });
  return response.data;
};

export const storeVendorToken = async (vendorId, token) => {
  const response = await fetch(`${API_BASE}/api/vendor/store-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vendorId, token }),
  });
  return response.json();
};
