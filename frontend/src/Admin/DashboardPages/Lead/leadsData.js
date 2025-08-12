
const leadsData = [
  {
    id: "L000565",
    name: "RAVI KUMAR",
    isHuelip: true,
    budget: "Rs 8,00,000/-",
    contact: "+91-XXXXXXXXXX",
    status: "Pending on Client Decision",
    statusColor: "bg-red-300",
    category: "RESIDENTIAL",
    update: "Client is deciding how to proceed.\nArranging for funds",
    assigned: { name: "Ravi", initial: "R", color: "bg-yellow-300" },
    followup: true,
    source: "pinterest",
    reminder: {
      date: "2025-07-15", // ISO format preferred (yyyy-mm-dd)
      time: "10:30 AM", // 12-hour format
    },
  },
  {
    id: "L000564",
    name: "RISHAB PANT",
    isHuelip: true,
    budget: "Rs 12,00,000/-",
    contact: "+91-9377747883",
    status: "Requirement Gathered",
    statusColor: "bg-blue-300",
    category: "RESIDENTIAL",
    update: "Had a call regarding requirements.",
    assigned: { name: "Vivek", initial: "V", color: "bg-purple-300" },
    followup: true,
    source: "google",
    reminder: {
      date: "2025-07-15", // ISO format preferred (yyyy-mm-dd)
      time: "10:30 AM", // 12-hour format
    },
  },
  {
    id: "L000563",
    name: "SANIA MIRZ",
    isHuelip: false,
    budget: "Rs 50,00,000/-",
    contact: "+91-9944773773",
    status: "Assigned",
    statusColor: "bg-green-300",
    category: "COMMERCIAL",
    update: "Client asked to call tomorrow",
    assigned: { name: "Tanvi Vivek", initial: "T V", color: "bg-pink-300" },
    followup: true,
    source: "instagram",
    reminder: {
      date: "2025-07-15", // ISO format preferred (yyyy-mm-dd)
      time: "10:30 AM", // 12-hour format
    },
  },
  {
    id: "L000562",
    name: "RAJ KAPOOR",
    isHuelip: false,
    budget: "Rs 1,50,00,000/-",
    contact: "+91-XXXXXXXXXX",
    status: "Assigned",
    statusColor: "bg-green-300",
    category: "COMMERCIAL",
    update: "Client asked to call tomorrow",
    assigned: { name: "Babita", initial: "B", color: "bg-blue-300" },
    followup: true,
    source: "pinterest",
    reminder: {
      date: "2025-07-15", // ISO format preferred (yyyy-mm-dd)
      time: "10:30 AM", // 12-hour format
    },
  },
  {
    id: "L000561",
    name: "RAJESH MITTAL",
    isHuelip: true,
    budget: "Rs 65,00,000/-",
    contact: "+91-7648#48578",
    status: "Not Interested",
    statusColor: "bg-red-500",
    category: "RESIDENTIAL",
    update: "Quotation shared too high.",
    assigned: { name: "Ravi", initial: "R", color: "bg-yellow-300" },
    followup: true,
    source: "facebook",
    // reminder: {
    //   date: "2025-07-15", // ISO format preferred (yyyy-mm-dd)
    //   time: "10:30 AM", // 12-hour format
    // },
  },
];

export default leadsData;