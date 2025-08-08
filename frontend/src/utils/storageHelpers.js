// src/utils/storageHelpers.js

export const saveRFQToLocalStorage = (rfq, status = "published") => {
  const existing = JSON.parse(localStorage.getItem("rfqList") || "[]");
  const newRFQ = {
    ...rfq,
    id: Date.now(),
    status,
    createdAt: new Date().toISOString(),
  };
  existing.push(newRFQ);
  localStorage.setItem("rfqList", JSON.stringify(existing));
};
