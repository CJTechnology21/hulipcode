import axiosInstance from './axiosInstance';

//  RFQ SERVICES 

// Fetch all RFQs
export const fetchRFQs = async () => {
  const res = await axiosInstance.get('/api/rfq');
  return res.data;
};

// Fetch single RFQ by ID
export const fetchRFQByID = async (rfqId) => {
  const res = await axiosInstance.get(`/api/rfq/${rfqId}`);
  return res.data;
};

// Create new RFQ
export const createRFQ = async (rfqData) => {
  const res = await axiosInstance.post('/api/rfq', rfqData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Update RFQ
export const updateRFQ = async (rfqId, rfqData) => {
  const res = await axiosInstance.put(`/api/rfq/${rfqId}`, rfqData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Delete RFQ
export const deleteRFQ = async (rfqId) => {
  const res = await axiosInstance.delete(`/api/rfq/${rfqId}`);
  return res.data;
};

//  MATERIAL SERVICES 

// Add materials to an RFQ
export const addMaterialsToRFQ = async (rfqId, materials) => {
  const res = await axiosInstance.post(`/api/rfq/${rfqId}/materials`, materials, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Update a specific material in RFQ
export const updateMaterialInRFQ = async (rfqId, materialId, materialData) => {
  const res = await axiosInstance.put(`/api/rfq/${rfqId}/materials/${materialId}`, materialData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Delete a specific material from RFQ
export const deleteMaterialFromRFQ = async (rfqId, materialId) => {
  const res = await axiosInstance.delete(`/api/rfq/${rfqId}/materials/${materialId}`);
  return res.data;
};

// Get all materials of a specific RFQ
export const getMaterialsOfRFQ = async (rfqId) => {
  const res = await axiosInstance.get(`/api/rfq/${rfqId}/materials`);
  return res.data;
};
