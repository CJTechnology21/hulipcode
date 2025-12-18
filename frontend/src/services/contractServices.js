import axiosInstance from "./axiosInstance";

// Get all contracts
export const fetchContracts = async () => {
  try {
    const res = await axiosInstance.get("/api/contracts");
    return res.data.contracts || [];
  } catch (error) {
    console.error("Error fetching contracts:", error);
    throw error;
  }
};

// Get single contract by ID
export const fetchContractById = async (contractId) => {
  try {
    const res = await axiosInstance.get(`/api/contracts/${contractId}`);
    return res.data.contract;
  } catch (error) {
    console.error("Error fetching contract:", error);
    throw error;
  }
};

// Get signed contract PDF (as blob)
export const fetchSignedContractPdf = async (contractId) => {
  try {
    const res = await axiosInstance.get(
      `/api/contracts/${contractId}/signed-document`,
      { responseType: "blob" }
    );
    return res.data; // Blob
  } catch (error) {
    console.error("Error fetching signed contract PDF:", error);
    throw error;
  }
};

// Create contract from quote
export const createContractFromQuote = async (quoteId) => {
  try {
    const res = await axiosInstance.post("/api/contracts/create-from-quote", {
      quoteId
    });
    return res.data.contract;
  } catch (error) {
    console.error("Error creating contract:", error);
    throw error;
  }
};

