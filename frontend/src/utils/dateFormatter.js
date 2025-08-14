// utils/dateFormatter.js
export const formatDateTime = (updateObj, createdAt) => {
  if (!updateObj && !createdAt) return "N/A";

  let dateStr = updateObj?.date || createdAt;
  let timeStr = updateObj?.time || createdAt;

  const dateObj = new Date(dateStr);
  const timeObj = new Date(timeStr);

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = String(dateObj.getFullYear()).slice(-2);

  const hours = String(timeObj.getHours()).padStart(2, "0");
  const minutes = String(timeObj.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
