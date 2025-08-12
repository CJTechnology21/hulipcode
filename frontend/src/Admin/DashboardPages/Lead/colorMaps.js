// colorMaps.js

export const statusColorMap = {
  "Not Assigned": "bg-gray-300 text-black",
  Assigned: "bg-blue-200 text-blue-800",
  "Requirement Gathered": "bg-yellow-200 text-yellow-800",
  "Estimate Shared": "bg-purple-200 text-purple-800",
  "Visit Planned": "bg-green-200 text-green-800",
  "Pending on Client Decision": "bg-orange-200 text-orange-800",
  "On Hold": "bg-pink-200 text-pink-800",
  "Not Interested": "bg-red-200 text-red-800",
  "Quotation Approved": "bg-green-300 text-green-900",
};

export const categoryColorMap = {
  Commercial: "bg-indigo-200 text-indigo-800",
  Residential: "bg-teal-200 text-teal-800",
  Industrial: "bg-yellow-300 text-yellow-900",
  Retail: "bg-pink-300 text-pink-900",
};


// Tabs
export const tabs = [
  { label: "All Leads", count: 5 },
  { label: "Huelip Leads", count: 2 },
  { label: "Facebook/ Instagram Leads", count: 1 },
  { label: "Google Leads", count: 1 },
  { label: "Self Leads", count: 1 },
];
