
import axiosInstance from "./axiosInstance"
// -------------------- QUOTE SERVICES -------------------- //

// Fetch all quotes (with optional filters)
export const fetchQuotes = async (filters = {}) => {
  try {
    const query = new URLSearchParams(filters).toString();
    const res = await axiosInstance.get(`/api/quote${query ? `?${query}` : ""}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    // Handle 401 - user not authenticated
    if (error.response?.status === 401) {
      // Return empty array instead of throwing error
      // The interceptor will handle redirect
      return [];
    }
    throw error;
  }
};

// Fetch single quote by ID
export const fetchQuoteById = async (quoteId) => {
  try {
    const res = await axiosInstance.get(`/api/quote/${quoteId}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching quote by ID:', error);
    if (error.response?.status === 401) {
      // Return null or throw to trigger redirect
      throw error;
    }
    throw error;
  }
};

// Create a new quote
export const createQuote = async (quoteData) => {
  const res = await axiosInstance.post("/api/quote", quoteData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Update (PUT – full update) quote
export const updateQuote = async (quoteId, quoteData) => {
  const res = await axiosInstance.put(`/api/quote/${quoteId}`, quoteData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Patch (partial update) quote
export const patchQuote = async (quoteId, quoteData) => {
  const res = await axiosInstance.patch(`/api/quote/${quoteId}`, quoteData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Delete quote
export const deleteQuote = async (quoteId) => {
  const res = await axiosInstance.delete(`/api/quote/${quoteId}`);
  return res.data;
};

// -------------------- SUMMARY SERVICES -------------------- //

// Fetch only the summary of a quote
export const fetchQuoteSummary = async (quoteId) => {
  const res = await axiosInstance.get(`/api/quote/${quoteId}/summary`);
  return res.data;
};

// Add summary rows (single or multiple)
export const addSummaryToQuote = async (quoteId, summary) => {
  const rows = [].concat(summary || []); // ensures it's always a flat array

  const res = await axiosInstance.put(
    `/api/quote/${quoteId}/summary`,
    rows,
    { headers: { "Content-Type": "application/json" } }
  );

  return res.data;
};

// Update a single summary row by spaceId
export const updateSummaryRow = async (quoteId, spaceId, fields) => {
  const res = await axiosInstance.patch(
    `/api/quote/${quoteId}/summary/${spaceId}`,
    { fields }, // match backend controller
    { headers: { "Content-Type": "application/json" } }
  );

  return res.data;
};

// Delete a single summary row by spaceId
export const deleteSummaryRow = async (quoteId, spaceId) => {
  const res = await axiosInstance.delete(
    `/api/quote/${quoteId}/summary/${spaceId}`
  );

  return res.data;
};

// -------------------- SPACES SERVICES -------------------- //

export const fetchSpaces = async (quoteId, spaceId) => {
  const res = await axiosInstance.get(`/api/quote/${quoteId}/summary/${spaceId}/spaces`);
  return res.data;
};

export const fetchSpaceById = async (quoteId, spaceId, itemId) => {
  const res = await axiosInstance.get(`/api/quote/${quoteId}/summary/${spaceId}/spaces/${itemId}`);
  return res.data;
};

export const addSpace = async (quoteId, spaceId, spaceData) => {
  const res = await axiosInstance.post(
    `/api/quote/${quoteId}/summary/${spaceId}/spaces`,
    spaceData,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const updateSpace = async (quoteId, spaceId, itemId, fields) => {
  const res = await axiosInstance.patch(
    `/api/quote/${quoteId}/summary/${spaceId}/spaces/${itemId}`,
    { fields },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const deleteSpace = async (quoteId, spaceId, itemId) => {
  const res = await axiosInstance.delete(
    `/api/quote/${quoteId}/summary/${spaceId}/spaces/${itemId}`
  );
  return res.data;
};

// -------------------- OPENINGS SERVICES -------------------- //

export const fetchOpenings = async (quoteId, spaceId) => {
  const res = await axiosInstance.get(`/api/quote/${quoteId}/summary/${spaceId}/openings`);
  return res.data;
};

export const fetchOpeningById = async (quoteId, spaceId, itemId) => {
  const res = await axiosInstance.get(`/api/quote/${quoteId}/summary/${spaceId}/openings/${itemId}`);
  return res.data;
};

export const addOpening = async (quoteId, spaceId, openingData) => {
  const res = await axiosInstance.post(
    `/api/quote/${quoteId}/summary/${spaceId}/openings`,
    openingData,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const updateOpening = async (quoteId, spaceId, itemId, fields) => {
  const res = await axiosInstance.patch(
    `/api/quote/${quoteId}/summary/${spaceId}/openings/${itemId}`,
    { fields },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const deleteOpening = async (quoteId, spaceId, itemId) => {
  const res = await axiosInstance.delete(
    `/api/quote/${quoteId}/summary/${spaceId}/openings/${itemId}`
  );
  return res.data;
};

// -------------------- DELIVERABLES SERVICES -------------------- //

export const fetchDeliverables = async (quoteId, spaceId) => {
  const res = await axiosInstance.get(`/api/quote/${quoteId}/summary/${spaceId}/deliverables`);
  return res.data;
};

export const fetchDeliverableById = async (quoteId, spaceId, itemId) => {
  const res = await axiosInstance.get(`/api/quote/${quoteId}/summary/${spaceId}/deliverables/${itemId}`);
  return res.data;
};

export const addDeliverable = async (quoteId, spaceId, deliverableData) => {
  // Validate IDs before making the request
  if (!quoteId || quoteId === "undefined" || quoteId === "null") {
    throw new Error("Quote ID is required and cannot be undefined");
  }
  
  if (!spaceId || spaceId === "undefined" || spaceId === "null") {
    throw new Error("Space ID is required and cannot be undefined");
  }

  const res = await axiosInstance.post(
    `/api/quote/${quoteId}/summary/${spaceId}/deliverables`,
    deliverableData,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const updateDeliverable = async (quoteId, spaceId, itemId, fields) => {
  const res = await axiosInstance.patch(
    `/api/quote/${quoteId}/summary/${spaceId}/deliverables/${itemId}`,
    { fields },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const deleteDeliverable = async (quoteId, spaceId, itemId) => {
  const res = await axiosInstance.delete(
    `/api/quote/${quoteId}/summary/${spaceId}/deliverables/${itemId}`
  );
  return res.data;
};

export const createProjectFromQuote = async (quoteId, architectId) => {
  try {
    // console.log("Sending to backend:", { quoteId, architectId });
    const response = await axiosInstance.post(
      `/api/quote/${quoteId}/create-project`,
      { architectId } //  send architectId in request body
    );

    return response.data;
  } catch (error) {
    console.error("Error in createProjectFromQuote service:", error);
    throw error;
  }
};

export const getDeliverablesByQuoteId  = async(quoteId) =>{
  const repsonse = await axiosInstance.get(`/api/quote/${quoteId}/deliverables-by-quote`);
  return repsonse.data; 
}

// -------------------- STANDALONE SPACES SERVICES -------------------- //

// Get all standalone spaces for a quote
export const fetchStandaloneSpaces = async (quoteId) => {
  const res = await axiosInstance.get(`/api/quote/${quoteId}/spaces`);
  return res.data;
};

// Create a standalone space
export const createStandaloneSpace = async (quoteId, spaceData) => {
  const res = await axiosInstance.post(`/api/quote/${quoteId}/spaces`, spaceData);
  return res.data;
};

// Get a single standalone space
export const fetchStandaloneSpaceById = async (quoteId, spaceId) => {
  const res = await axiosInstance.get(`/api/quote/${quoteId}/spaces/${spaceId}`);
  return res.data;
};

// Update a standalone space
export const updateStandaloneSpace = async (quoteId, spaceId, fields) => {
  const res = await axiosInstance.patch(`/api/quote/${quoteId}/spaces/${spaceId}`, { fields });
  return res.data;
};

// Delete a standalone space
export const deleteStandaloneSpace = async (quoteId, spaceId) => {
  const res = await axiosInstance.delete(`/api/quote/${quoteId}/spaces/${spaceId}`);
  return res.data;
};





// export const createProjectFromQuote = async (quoteId) => {
//   const response = await axiosInstance.post(`/api/quote/${quoteId}/create-project`);
//   return response.data;
// };



