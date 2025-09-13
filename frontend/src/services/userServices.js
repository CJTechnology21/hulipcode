import axiosInstance from './axiosInstance';


//Get client type
export const getClientType = async (leadId) => {
  const res = await axiosInstance.get(`/api/leads/${leadId}/client-type`)
  return res.data;
}

// Fetch architects
export const fetchArchitects = async () => {
  const res = await axiosInstance.get("/api/user/architects");
  return res.data;
};

//Fetch Vendors
export const fetchVendors = async () => {
  const res = await axiosInstance.get("/api/user/vendors");
  return res.data;
}

//Fetch Material Suppliers 
export const fetchMaterialSuppliers = async () => {
  const res = await axiosInstance.get("/api/user/material-suppliers");
  return res.data;
}

//Fetch Architects and Clients
export const fetchArchandClients = async () => {
  const res = await axiosInstance.get("/api/user/architects-clients");
  return res.data;
}

// ----- Address -----
export const addAddress = async (userId, addressData) => {
  const res = await axiosInstance.post(`/api/user/${userId}/address`, addressData);
  return res.data;
};

export const updateAddress = async (userId, addressId, addressData) => {
  const res = await axiosInstance.put(`/api/user/${userId}/address/${addressId}`, addressData);
  return res.data;
};

// ----- Bank Detail -----
export const addBankDetail = async (userId, bankData) => {
  const res = await axiosInstance.post(`/api/user/${userId}/bank`, bankData);
  return res.data;
};

export const updateBankDetail = async (userId, bankId, bankData) => {
  const res = await axiosInstance.put(`/api/user/${userId}/bank/${bankId}`, bankData);
  return res.data;
};

// ----- Document (Aadhaar/PAN) -----
export const uploadDocument = async (userId, docData) => {
  // docData = { type: "aadhaar" | "pan", fileUrl: "http://..." }
  const res = await axiosInstance.post(`/api/user/${userId}/document`, docData);
  return res.data;
};
