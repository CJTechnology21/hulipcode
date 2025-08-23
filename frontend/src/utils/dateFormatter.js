// utils/dateFormatter.js
export const formatDateTime = (dateInput) => {
  if (!dateInput) return "N/A";

  // Handle MongoDB date object like { $date: "..." }
  const dateStr = typeof dateInput === "object" && dateInput.$date 
    ? dateInput.$date 
    : dateInput;

  const dateObj = new Date(dateStr);
  if (isNaN(dateObj)) return "Invalid Date";

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";

  const dateObj = new Date(dateStr);

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear(); // full year, not last 2 digits

  return `${day}-${month}-${year}`;
};