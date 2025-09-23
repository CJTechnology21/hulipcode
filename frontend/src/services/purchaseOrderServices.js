import axiosInstance from './axiosInstance'

//  Punch quotation → Create PO
export const punchQuotation = async (rfqId, responseId) => {
    const res = await axiosInstance.post(`/api/purchase-orders/punch/${rfqId}/${responseId}`);
    return res.data;
};

//  Fetch all purchase orders
export const fetchAllPOs = async () => {
    const res = await axiosInstance.get("/api/purchase-orders");
    return res.data;
};

//  Fetch purchase order by ID
export const fetchPOById = async (poId) => {
    const res = await axiosInstance.get(`/api/purchase-orders/${poId}`);
    return res.data;
};

//  Fetch purchase orders by Supplier
export const fetchPOsBySupplier = async (supplierId) => {
    const res = await axiosInstance.get(`/api/purchase-orders/supplier/${supplierId}`);
    return res.data;
};

//  Fetch purchase orders by Architect
export const fetchPOsByArchitect = async (architectId) => {
    const res = await axiosInstance.get(`/api/purchase-orders/architect/${architectId}`);
    return res.data;
};

//  Fetch purchase orders by Project
export const fetchPOsByProject = async (projectId) => {
    const res = await axiosInstance.get(`/api/purchase-orders/project/${projectId}`);
    return res.data;
};

// Update purchase order
export const updatePO = async (poId, poData) => {
    const res = await axiosInstance.put(`/api/purchase-orders/${poId}`, poData, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
};

//  Delete purchase order
export const deletePO = async (poId) => {
    const res = await axiosInstance.delete(`/api/purchase-orders/${poId}`);
    return res.data;
};
