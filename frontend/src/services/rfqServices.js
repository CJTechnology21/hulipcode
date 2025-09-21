import axiosInstance from './axiosInstance';

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

//Fetch rfqs based on architectID
export const fetchRFQByArchitect = async (architectId) => {
  const res = await axiosInstance.get(`/api/rfq/architect/${architectId}`);
  return res.data;
}
//Fetch rfqs based on projectId
export const fetchRFQByProject = async (projectId) => {
  const res = await axiosInstance.get(`/api/rfq/project/${projectId}`);
  return res.data;
}
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
  //  unwrap response so component gets the actual RFQ object
  return res.data.data;
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
// 0Add response to RFQ
import { axiosInstance } from "./axiosInstance";

export const addResponseToRFQ = async (rfqId, supplierId, items, tax = 0) => {
  const payload = {
    supplierId,
    responses: items.map(item => ({
      materialId: item.materialId,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      remarks: item.remarks || ""
    })),
    tax: Number(tax)
  };

  console.log("Sending payload to backend:", payload); // debug

  const res = await axiosInstance.post(`/api/rfq/${rfqId}/responses`, payload, {
    headers: { "Content-Type": "application/json" }
  });

  console.log("Backend returned:", res.data); // debug

  return res.data;
};

// export const addResponseToRFQ = async (rfqId, supplierId, items, tax = 0) => {
//   // Each item must have: materialId, name, price, quantity
//   const payload = {
//     supplierId,
//     responses: items.map(item => ({
//       materialId: item.materialId,
//       name: item.name,
//       price: Number(item.price),
//       quantity: Number(item.quantity),
//       remarks: item.remarks || ""
//     })),
//     tax: Number(tax) // ✅ include tax (percentage) here
//   };

//   const res = await axiosInstance.post(
//     `/api/rfq/${rfqId}/responses`,
//     payload,
//     { headers: { "Content-Type": "application/json" } }
//   );

//   return res.data;
// };

// export const addResponseToRFQ = async (rfqId, supplierId, items) => {
//   // Each item must have: materialId, name, price, quantity
//   const payload = {
//     supplierId,
//     responses: items.map(item => ({
//       materialId: item.materialId,
//       name: item.name,
//       price: Number(item.price),
//       quantity: Number(item.quantity),
//       remarks: item.remarks || ""
//     }))
//   };

//   // console.log("📦 Payload being sent:", payload);

//   const res = await axiosInstance.post(
//     `/api/rfq/${rfqId}/responses`,
//     payload,
//     { headers: { "Content-Type": "application/json" } }
//   );

//   return res.data;
// };

// Get all responses of a specific RFQ
export const getResponsesOfRFQ = async (rfqId) => {
  const res = await axiosInstance.get(`/api/rfq/${rfqId}/responses`);
  return res.data;
};