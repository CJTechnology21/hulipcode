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
//publish an RFQ
export const publishRFQ = async (rfqData) => {
  const res = await axiosInstance.post('/api/rfq/publish', rfqData, {
    headers: {
      "Content-Type": "application/json"
    },
  });
  return res.data.data;
}

// Update RFQ
export const updateRFQ = async (rfqId, rfqData) => {
  const res = await axiosInstance.put(`/api/rfq/${rfqId}`, rfqData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

//publish Exisiting RFQ
export const publishExistingRFQ = async (rfqId, data = {}) => {
  const res = await axiosInstance.put(`/api/rfq/${rfqId}/publish`, data, {
    headers: {
      "Content-Type": "application/json",
    },
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

// ---------------- RESPONSE SERVICES ----------------

// Add response(s) to an RFQ
// Add response to RFQ
export const addResponseToRFQ = async (rfqId, supplierId, items) => {
  const responses = items.map(item => ({
    ...item,
    totalAmount: Number(item.price) * Number(item.quantity), // ✅ required by backend schema
  }));

  const payload = {
    supplierId,
    responses,
  };

  console.log("📦 Service payload being sent:", payload);

  const res = await axiosInstance.post(
    `/api/rfq/${rfqId}/responses`,
    payload,
    { headers: { "Content-Type": "application/json" } }
  );

  return res.data;
};

// export const addResponseToRFQ = async (rfqId, responses) => {
//   const res = await axiosInstance.post(`/api/rfq/${rfqId}/responses`, responses, {
//     headers: { "Content-Type": "application/json" },
//   });
//   return res.data;
// };

// Get all responses of a specific RFQ
export const getResponsesOfRFQ = async (rfqId) => {
  const res = await axiosInstance.get(`/api/rfq/${rfqId}/responses`);
  return res.data;
};