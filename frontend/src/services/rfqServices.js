import axiosInstance from './axiosInstance';

export const fetchRFQs = async () => {
    const res = await axiosInstance.get('/api/rfq');
    return res.data;
}

export const fetchRFQByID = async (rfqId) => {
    const res = await axiosInstance.get(`/api/rfq/${rfqId}`);
    return res.data;
}

export const updateRFQ = async (rfqId, rfqdata) => {
    const res = await axiosInstance.put(`/api/rfq/${rfqId}`, rfqdata, {
        headers: { "Content-Type": "application/json" }
    });
    return res.data;
}

export const deleteRFQ = async (rfqId) => {
    const res = await axiosInstance.delete(`/api/rfq/${rfqId}`);
    return res.data;
}