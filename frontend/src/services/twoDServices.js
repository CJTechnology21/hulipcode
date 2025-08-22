/* ---------------- 2D LAYOUT SERVICES ---------------- */

import axiosInstance from './axiosInstance'
// Use axiosInstance if available, otherwise fallback to default axios with localhost
// const axiosClient =  axios.create({ baseURL: 'http://localhost:5000' });

// Fetch all layouts OR by projectId
export const fetchLayouts = async (projectId) => {
  const res = await axiosInstance.get(`/api/2dlayout?projectId=${projectId}`, {
  });
  return res.data;
};

// Fetch single layout by id
export const fetchLayoutById = async (layoutId) => {
  if (!layoutId) throw new Error("layoutId is required");
  const res = await axiosInstance.get(`/api/2dlayout/${layoutId}`);
  return res.data;
};

// Create new layout (supports file upload via FormData)
export const createLayout = async (formData) => {
  const res = await axiosInstance.post(`/api/2dlayout`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Update layout (PUT - full replace)
export const updateLayout = async (layoutId, data) => {
  if (!layoutId) throw new Error("layoutId is required");
  const res = await axiosInstance.put(`/api/2dlayout/${layoutId}`, data);
  return res.data;
};

// Patch layout (partial update or add new version)
export const patchLayout = async (layoutId, formData) => {
  if (!layoutId) throw new Error("layoutId is required");
  const res = await axiosInstance.patch(`/api/2dlayout/${layoutId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Delete layout
export const deleteLayout = async (layoutId) => {
  if (!layoutId) throw new Error("layoutId is required");
  const res = await axiosInstance.delete(`/api/2dlayout/${layoutId}`);
  return res.data;
};

/* ---------------- 2D LAYOUT COMMENTS SERVICES ---------------- */

// Add a comment to a specific layout
export const addComment = async (layoutId, text) => {
  if (!layoutId) throw new Error("layoutId is required");
  if (!text) throw new Error("comment text is required");

  const res = await axiosInstance.post(`/api/2dlayout/comment`, {
    layoutId,
    text,
  });
  return res.data; // returns the newly created comment
};

// Fetch all comments for a project
export const fetchCommentsByProject = async (projectId) => {
  if (!projectId) throw new Error("projectId is required");

  const res = await axiosInstance.get(
    `/api/2dlayout/comment?projectId=${projectId}`
  );
  return res.data; // returns array of comments
};
