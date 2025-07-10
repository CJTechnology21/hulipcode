import { useState } from "react";
import Header from "../Header";
import SideBar from "../SideBar";
import {
  FaPlus,
  FaEdit,
  FaGoogle,
  FaInstagram,
  FaFacebookF,
  FaFilePdf,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const initialLeads = [
  {
    sno: 1,
    qid: "PQ001/1",
    name: "RAVI KUMAR",
    leadId: "L000565",
    budget: "RS 8,00,000/-",
    contact: "+91-XXXXXXXXXX",
    quoteAmount: "RS 8,00,000/-",
    city: "DELHI / KALKAJI",
    assigned: ["R"],
    status: "Approved",
  },
  {
    sno: 2,
    qid: "PQ001/2",
    name: "RISHAB PANT",
    leadId: "L000564",
    budget: "RS 12,00,000/-",
    contact: "+91-9377474883",
    quoteAmount: "RS 12,00,000/-",
    city: "DELHI / RANI BAGH",
    assigned: ["V"],
    status: "In Review",
  },
  {
    sno: 3,
    qid: "PQ02/1",
    name: "SANIA MIRZ",
    leadId: "L000563",
    budget: "RS 50,00,000/-",
    contact: "+91-9944773773",
    quoteAmount: "RS 50,00,000/-",
    city: "DELHI / SAKET",
    assigned: ["T", "V"],
    status: "Send",
  },
  {
    sno: 4,
    qid: "PQ043/1",
    name: "RAJ KAPOOR",
    leadId: "L000562",
    budget: "RS 1,50,00,000/-",
    contact: "+91-XXXXXXXXXX",
    quoteAmount: "RS 1,50,00,000/-",
    city: "JAIPUR / C SCHEME",
    assigned: ["B"],
    status: "Shortlisted",
  },
  {
    sno: 5,
    qid: "PQ034/1",
    name: "RAJESH MITTAL",
    leadId: "L000561",
    budget: "RS 65,00,000/-",
    contact: "+91-7648448578",
    quoteAmount: "RS 65,00,000/-",
    city: "RANCHI / KATATOLI",
    assigned: ["R", "V"],
    status: "Rejected",
  },
];

const clientLeads = [
  {
    sno: 1,
    leadId: "L000565",
    name: "RAVI KUMAR",
    budget: "RS 8,00,000/-",
    contact: "+91-XXXXXXXXXX",
    category: "RESIDENTIAL",
    source: "PDF",
  },
  {
    sno: 2,
    leadId: "L000564",
    name: "RISHAB PANT",
    budget: "RS 12,00,000/-",
    contact: "+91-9377474883",
    category: "RESIDENTIAL",
    source: "Google",
  },
  {
    sno: 3,
    leadId: "L000563",
    name: "SANIA MIRZ",
    budget: "RS 50,00,000/-",
    contact: "+91-9944773773",
    category: "COMMERCIAL",
    source: "Instagram",
  },
  {
    sno: 4,
    leadId: "L000562",
    name: "RAJ KAPOOR",
    budget: "RS 1,50,00,000/-",
    contact: "+91-XXXXXXXXXX",
    category: "COMMERCIAL",
    source: "PDF",
  },
  {
    sno: 5,
    leadId: "L000561",
    name: "RAJESH MITTAL",
    budget: "RS 65,00,000/-",
    contact: "+91-7648448578",
    category: "RESIDENTIAL",
    source: "Facebook",
  },
];

// Your initialLeads & clientLeads arrays remain unchanged
// Add your existing initialLeads and clientLeads here...

const statusOptions = ["In Review", "Shortlisted", "Approved", "Rejected"];

function Quote() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leads, setLeads] = useState(initialLeads);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [sendingIndex, setSendingIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [filters, setFilters] = useState({
    sno: "",
    qid: "",
    name: "",
    leadId: "",
    budget: "",
    contact: "",
    quoteAmount: "",
    city: "",
    assigned: "",
    status: "",
  });
  const navigate = useNavigate();

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditedData({ ...leads[index] });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditedData({});
  };

  const saveEdit = () => {
    const updated = [...leads];
    updated[editingIndex] = { ...editedData };
    setLeads(updated);
    setEditingIndex(null);
    toast.success("Quote updated successfully!");
  };

  const handleSendOption = (index, method) => {
    const updated = [...leads];
    updated[index].status = "In Review";
    setLeads(updated);
    setSendingIndex(null);
    toast.success(`Quote sent via ${method}`);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "In Review":
        return "bg-yellow-100 text-yellow-800";
      case "Shortlisted":
        return "bg-blue-100 text-blue-800";
      case "Rejected":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setShowModal(false);
    toast.success(`Client ${client.name} selected!`);
  };

  const filteredLeads = leads.filter((lead) =>
    Object.keys(filters).every((key) =>
      lead[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-20 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:block`}
      >
        <SideBar />
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Quote"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <button
            className="bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-red-800"
            onClick={() => setShowModal(true)}
          >
            <FaPlus /> Add Quote
          </button>
        </div>

        <div className="p-4 sm:p-6 flex-1 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow overflow-x-auto p-4">
            <table className="min-w-[1000px] w-full text-sm text-left">
              <thead className="bg-gray-100 text-xs text-gray-600">
                <tr>
                  {[
                    "S.no",
                    "Q-ID",
                    "Name",
                    "Lead ID",
                    "Budget",
                    "Contact no.",
                    "Quote Amount",
                    "City/ Area",
                    "Assigned to",
                    "Status",
                    "Action",
                  ].map((head, i) => (
                    <th key={i} className="px-3 py-2">
                      {head}
                    </th>
                  ))}
                </tr>
                <tr>
                  {Object.keys(filters).map((key, i) => (
                    <td key={i} className="px-3 py-1">
                      <input
                        type="text"
                        value={filters[key]}
                        onChange={(e) =>
                          setFilters({ ...filters, [key]: e.target.value })
                        }
                        className="w-full px-2 py-1 text-xs border rounded"
                        placeholder="Search"
                      />
                    </td>
                  ))}
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2">{lead.sno}</td>
                    <td
                      className="px-3 py-2 cursor-pointer"
                      onClick={() =>
                        navigate("/quotedetails", {
                          state: { qid: lead.qid, clientName: lead.name },
                        })
                      }
                    >
                      {lead.qid}
                    </td>
                    <td className="px-3 py-2">
                      {editingIndex === i ? (
                        <input
                          value={editedData.name}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              name: e.target.value,
                            })
                          }
                          className="border border-red-500 px-2 py-1 rounded w-full text-sm"
                        />
                      ) : (
                        <span className="font-bold">{lead.name}</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{lead.leadId}</td>
                    <td className="px-3 py-2">
                      {editingIndex === i ? (
                        <input
                          value={editedData.budget}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              budget: e.target.value,
                            })
                          }
                          className="border border-red-500 px-2 py-1 rounded w-full text-sm"
                        />
                      ) : (
                        lead.budget
                      )}
                    </td>
                    <td className="px-3 py-2 text-blue-700 font-semibold">
                      {editingIndex === i ? (
                        <input
                          value={editedData.contact}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              contact: e.target.value,
                            })
                          }
                          className="border border-red-500 px-2 py-1 rounded w-full text-sm"
                        />
                      ) : (
                        lead.contact
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editingIndex === i ? (
                        <input
                          value={editedData.quoteAmount}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              quoteAmount: e.target.value,
                            })
                          }
                          className="border border-red-500 px-2 py-1 rounded w-full text-sm"
                        />
                      ) : (
                        lead.quoteAmount
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {editingIndex === i ? (
                        <input
                          value={editedData.city}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              city: e.target.value,
                            })
                          }
                          className="border border-red-500 px-2 py-1 rounded w-full text-sm"
                        />
                      ) : (
                        lead.city
                      )}
                    </td>
                    <td className="px-3 py-2 flex gap-1">
                      {lead.assigned.map((char, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full bg-yellow-400 text-xs flex items-center justify-center font-bold"
                        >
                          {char}
                        </div>
                      ))}
                    </td>
                    <td className="px-3 py-2 relative">
                      {lead.status === "Send" && editingIndex !== i ? (
                        <div>
                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold"
                            onClick={() =>
                              setSendingIndex(sendingIndex === i ? null : i)
                            }
                          >
                            Send
                          </button>
                          {sendingIndex === i && (
                            <div className="absolute z-50 mt-2 bg-white border rounded shadow w-40 right-0">
                              <button
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                                onClick={() => handleSendOption(i, "WhatsApp")}
                              >
                                Send via WhatsApp
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                                onClick={() => handleSendOption(i, "Email")}
                              >
                                Send via Email
                              </button>
                            </div>
                          )}
                        </div>
                      ) : editingIndex === i ? (
                        <select
                          value={editedData.status}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              status: e.target.value,
                            })
                          }
                          className="border border-red-500 px-2 py-1 rounded text-sm"
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                            lead.status
                          )}`}
                        >
                          {lead.status}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right flex gap-2">
                      {editingIndex === i ? (
                        <>
                          <button
                            className="bg-green-600 text-white text-xs px-3 py-1 rounded"
                            onClick={saveEdit}
                          >
                            Save
                          </button>
                          <button
                            className="bg-red-600 text-white text-xs px-3 py-1 rounded"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button onClick={() => startEditing(i)}>
                          <FaEdit className="text-gray-600 hover:text-blue-600 cursor-pointer" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full p-6 relative">
              <h3 className="text-lg font-semibold mb-4">Select Client</h3>

              {/* Filter row */}
              <div className="grid grid-cols-7 gap-2 mb-3">
                {[
                  "Search",
                  "Search",
                  "Search",
                  "Select",
                  "Search",
                  "Select",
                  "Select",
                ].map((placeholder, idx) => (
                  <input
                    key={idx}
                    placeholder={placeholder}
                    className="border px-3 py-1 text-xs rounded bg-gray-50 placeholder-gray-500"
                  />
                ))}
              </div>

              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">S.no</th>
                    <th className="p-2 border">Lead ID</th>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Budget</th>
                    <th className="p-2 border">Contact no.</th>
                    <th className="p-2 border">Category</th>
                    <th className="p-2 border">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {clientLeads.map((client) => (
                    <tr
                      key={client.leadId}
                      onClick={() => setSelectedClient(client)}
                      className={`cursor-pointer ${
                        selectedClient?.leadId === client.leadId
                          ? "bg-green-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="p-2 border">{client.sno}</td>
                      <td className="p-2 border">{client.leadId}</td>
                      <td className="p-2 border font-semibold">
                        {client.name}
                      </td>
                      <td className="p-2 border">{client.budget}</td>
                      <td className="p-2 border">{client.contact}</td>
                      <td className="p-2 border">{client.category}</td>
                      <td className="p-2 border text-center">
                        {client.source === "Google" && (
                          <FaGoogle className="text-xl text-blue-500 inline" />
                        )}
                        {client.source === "Instagram" && (
                          <FaInstagram className="text-xl text-pink-500 inline" />
                        )}
                        {client.source === "PDF" && (
                          <FaFilePdf className="text-xl text-red-600 inline" />
                        )}
                        {client.source === "Facebook" && (
                          <FaFacebookF className="text-xl text-blue-700 inline" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-center mt-4">
                <p className="font-medium text-sm mb-2">Select Client</p>
                <button
                  disabled={!selectedClient}
                  onClick={() => {
                    if (selectedClient) {
                      const newQuote = {
                        sno: leads.length + 1,
                        qid: `PQ00${leads.length + 1}/1`,
                        name: selectedClient.name,
                        leadId: selectedClient.leadId,
                        budget: selectedClient.budget,
                        contact: selectedClient.contact,
                        quoteAmount: selectedClient.budget,
                        city: "N/A", // Replace with actual data if available
                        assigned: ["R"], // or however you determine this
                        status: "Send", // default status
                      };

                      setLeads((prev) => [...prev, newQuote]);
                      toast.success(`Quote added for ${selectedClient.name}`);
                      setShowModal(false);
                      setSelectedClient(null);
                    }
                  }}
                  className={`px-5 py-1.5 rounded-full font-semibold text-white ${
                    selectedClient
                      ? "bg-red-700 hover:bg-red-800"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Proceed
                </button>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-4 text-xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quote;

// import { useState } from "react";
// import Header from "../Header";
// import SideBar from "../SideBar";
// import {
//   FaPlus,
//   FaEdit,
//   FaGoogle,
//   FaInstagram,
//   FaFacebookF,
//   FaFilePdf,
// } from "react-icons/fa";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const initialLeads = [
//   {
//     sno: 1,
//     qid: "PQ001/1",
//     name: "RAVI KUMAR",
//     leadId: "L000565",
//     budget: "RS 8,00,000/-",
//     contact: "+91-XXXXXXXXXX",
//     quoteAmount: "RS 8,00,000/-",
//     city: "DELHI / KALKAJI",
//     assigned: ["R"],
//     status: "Approved",
//   },
//   {
//     sno: 2,
//     qid: "PQ001/2",
//     name: "RISHAB PANT",
//     leadId: "L000564",
//     budget: "RS 12,00,000/-",
//     contact: "+91-9377474883",
//     quoteAmount: "RS 12,00,000/-",
//     city: "DELHI / RANI BAGH",
//     assigned: ["V"],
//     status: "In Review",
//   },
//   {
//     sno: 3,
//     qid: "PQ02/1",
//     name: "SANIA MIRZ",
//     leadId: "L000563",
//     budget: "RS 50,00,000/-",
//     contact: "+91-9944773773",
//     quoteAmount: "RS 50,00,000/-",
//     city: "DELHI / SAKET",
//     assigned: ["T", "V"],
//     status: "Send",
//   },
//   {
//     sno: 4,
//     qid: "PQ043/1",
//     name: "RAJ KAPOOR",
//     leadId: "L000562",
//     budget: "RS 1,50,00,000/-",
//     contact: "+91-XXXXXXXXXX",
//     quoteAmount: "RS 1,50,00,000/-",
//     city: "JAIPUR / C SCHEME",
//     assigned: ["B"],
//     status: "Shortlisted",
//   },
//   {
//     sno: 5,
//     qid: "PQ034/1",
//     name: "RAJESH MITTAL",
//     leadId: "L000561",
//     budget: "RS 65,00,000/-",
//     contact: "+91-7648448578",
//     quoteAmount: "RS 65,00,000/-",
//     city: "RANCHI / KATATOLI",
//     assigned: ["R", "V"],
//     status: "Rejected",
//   },
// ];

// const clientLeads = [
//   {
//     sno: 1,
//     leadId: "L000565",
//     name: "RAVI KUMAR",
//     budget: "RS 8,00,000/-",
//     contact: "+91-XXXXXXXXXX",
//     category: "RESIDENTIAL",
//     source: "PDF",
//   },
//   {
//     sno: 2,
//     leadId: "L000564",
//     name: "RISHAB PANT",
//     budget: "RS 12,00,000/-",
//     contact: "+91-9377474883",
//     category: "RESIDENTIAL",
//     source: "Google",
//   },
//   {
//     sno: 3,
//     leadId: "L000563",
//     name: "SANIA MIRZ",
//     budget: "RS 50,00,000/-",
//     contact: "+91-9944773773",
//     category: "COMMERCIAL",
//     source: "Instagram",
//   },
//   {
//     sno: 4,
//     leadId: "L000562",
//     name: "RAJ KAPOOR",
//     budget: "RS 1,50,00,000/-",
//     contact: "+91-XXXXXXXXXX",
//     category: "COMMERCIAL",
//     source: "PDF",
//   },
//   {
//     sno: 5,
//     leadId: "L000561",
//     name: "RAJESH MITTAL",
//     budget: "RS 65,00,000/-",
//     contact: "+91-7648448578",
//     category: "RESIDENTIAL",
//     source: "Facebook",
//   },
// ];

// const statusOptions = ["In Review", "Shortlisted", "Approved", "Rejected"];

// function Quote() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [leads, setLeads] = useState(initialLeads);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [sendingIndex, setSendingIndex] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedClient, setSelectedClient] = useState(null);

//   const startEditing = (index) => {
//     setEditingIndex(index);
//     setEditedData({ ...leads[index] });
//   };

//   const cancelEdit = () => {
//     setEditingIndex(null);
//     setEditedData({});
//   };

//   const saveEdit = () => {
//     const updated = [...leads];
//     updated[editingIndex] = { ...editedData };
//     setLeads(updated);
//     setEditingIndex(null);
//     toast.success("Quote updated successfully!");
//   };

//   const handleSendOption = (index, method) => {
//     const updated = [...leads];
//     updated[index].status = "In Review";
//     setLeads(updated);
//     setSendingIndex(null);
//     toast.success(`Quote sent via ${method}`);
//   };

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case "Approved":
//         return "bg-green-100 text-green-800";
//       case "In Review":
//         return "bg-yellow-100 text-yellow-800";
//       case "Shortlisted":
//         return "bg-blue-100 text-blue-800";
//       case "Rejected":
//         return "bg-red-200 text-red-800";
//       default:
//         return "bg-gray-200 text-gray-800";
//     }
//   };

//   const handleSelectClient = (client) => {
//     setSelectedClient(client);
//     setShowModal(false);
//     toast.success(`Client ${client.name} selected!`);
//   };

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-20 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:relative md:block`}
//       >
//         <SideBar />
//       </div>

//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main content */}
//       <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
//         <Header
//           title="Quote"
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />

//         <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
//           <h2 className="text-xl font-semibold text-gray-800">
//             Quotation Dashboard
//           </h2>
//           <button
//             className="bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-red-800"
//             onClick={() => setShowModal(true)}
//           >
//             <FaPlus /> Add Quote
//           </button>
//         </div>

//         {selectedClient && (
//           <div className="px-6 pt-2 text-sm text-gray-700">
//             Selected Client: <strong>{selectedClient.name}</strong> (
//             {selectedClient.leadId})
//           </div>
//         )}

//         <div className="p-4 sm:p-6 flex-1 flex flex-col gap-6">
//           <div className="bg-white rounded-xl shadow overflow-x-auto p-4">
//             <table className="min-w-[1000px] w-full text-sm text-left">
//               <thead className="bg-gray-100 text-xs text-gray-600">
//                 <tr>
//                   {[
//                     "S.no",
//                     "Q-ID",
//                     "Name",
//                     "Lead ID",
//                     "Budget",
//                     "Contact no.",
//                     "Quote Amount",
//                     "City/ Area",
//                     "Assigned to",
//                     "Status",
//                     "Action",
//                   ].map((head, i) => (
//                     <th key={i} className="px-3 py-2">
//                       {head}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {leads.map((lead, i) => (
//                   <tr key={i} className="border-t hover:bg-gray-50">
//                     <td className="px-3 py-2">{lead.sno}</td>
//                     <td className="px-3 py-2">{lead.qid}</td>
//                     <td className="px-3 py-2">
//                       {editingIndex === i ? (
//                         <input
//                           value={editedData.name}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               name: e.target.value,
//                             })
//                           }
//                           className="border border-red-500 px-2 py-1 rounded w-full text-sm"
//                         />
//                       ) : (
//                         <span className="font-bold">{lead.name}</span>
//                       )}
//                     </td>
//                     <td className="px-3 py-2">{lead.leadId}</td>
//                     <td className="px-3 py-2">
//                       {editingIndex === i ? (
//                         <input
//                           value={editedData.budget}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               budget: e.target.value,
//                             })
//                           }
//                           className="border border-red-500 px-2 py-1 rounded w-full text-sm"
//                         />
//                       ) : (
//                         lead.budget
//                       )}
//                     </td>
//                     <td className="px-3 py-2 text-blue-700 font-semibold">
//                       {editingIndex === i ? (
//                         <input
//                           value={editedData.contact}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               contact: e.target.value,
//                             })
//                           }
//                           className="border border-red-500 px-2 py-1 rounded w-full text-sm"
//                         />
//                       ) : (
//                         lead.contact
//                       )}
//                     </td>
//                     <td className="px-3 py-2">
//                       {editingIndex === i ? (
//                         <input
//                           value={editedData.quoteAmount}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               quoteAmount: e.target.value,
//                             })
//                           }
//                           className="border border-red-500 px-2 py-1 rounded w-full text-sm"
//                         />
//                       ) : (
//                         lead.quoteAmount
//                       )}
//                     </td>
//                     <td className="px-3 py-2">
//                       {editingIndex === i ? (
//                         <input
//                           value={editedData.city}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               city: e.target.value,
//                             })
//                           }
//                           className="border border-red-500 px-2 py-1 rounded w-full text-sm"
//                         />
//                       ) : (
//                         lead.city
//                       )}
//                     </td>

//                     {/* <td className="px-3 py-2">{lead.city}</td> */}
//                     <td className="px-3 py-2 flex gap-1">
//                       {lead.assigned.map((char, idx) => (
//                         <div
//                           key={idx}
//                           className="w-6 h-6 rounded-full bg-yellow-400 text-xs flex items-center justify-center font-bold"
//                         >
//                           {char}
//                         </div>
//                       ))}
//                     </td>
//                     <td className="px-3 py-2 relative">
//                       {lead.status === "Send" && editingIndex !== i ? (
//                         <div>
//                           <button
//                             className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold"
//                             onClick={() =>
//                               setSendingIndex(sendingIndex === i ? null : i)
//                             }
//                           >
//                             Send
//                           </button>
//                           {sendingIndex === i && (
//                             <div className="absolute z-50 mt-2 bg-white border rounded shadow w-40 right-0">
//                               <button
//                                 className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
//                                 onClick={() => handleSendOption(i, "WhatsApp")}
//                               >
//                                 Send via WhatsApp
//                               </button>
//                               <button
//                                 className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
//                                 onClick={() => handleSendOption(i, "Email")}
//                               >
//                                 Send via Email
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       ) : editingIndex === i ? (
//                         <select
//                           value={editedData.status}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               status: e.target.value,
//                             })
//                           }
//                           className="border border-red-500 px-2 py-1 rounded text-sm"
//                         >
//                           {statusOptions.map((opt) => (
//                             <option key={opt} value={opt}>
//                               {opt}
//                             </option>
//                           ))}
//                         </select>
//                       ) : (
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusStyle(
//                             lead.status
//                           )}`}
//                         >
//                           {lead.status}
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-3 py-2 text-right flex gap-2">
//                       {editingIndex === i ? (
//                         <>
//                           <button
//                             className="bg-green-600 text-white text-xs px-3 py-1 rounded"
//                             onClick={saveEdit}
//                           >
//                             Save
//                           </button>
//                           <button
//                             className="bg-red-600 text-white text-xs px-3 py-1 rounded"
//                             onClick={cancelEdit}
//                           >
//                             Cancel
//                           </button>
//                         </>
//                       ) : (
//                         <button onClick={() => startEditing(i)}>
//                           <FaEdit className="text-gray-600 hover:text-blue-600 cursor-pointer" />
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Modal */}
//         {showModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//             <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full p-6 relative">
//               <h3 className="text-lg font-semibold mb-4">Select Client</h3>

//               {/* Filter row */}
//               <div className="grid grid-cols-7 gap-2 mb-3">
//                 {[
//                   "Search",
//                   "Search",
//                   "Search",
//                   "Select",
//                   "Search",
//                   "Select",
//                   "Select",
//                 ].map((placeholder, idx) => (
//                   <input
//                     key={idx}
//                     placeholder={placeholder}
//                     className="border px-3 py-1 text-xs rounded bg-gray-50 placeholder-gray-500"
//                   />
//                 ))}
//               </div>

//               <table className="w-full text-sm border">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="p-2 border">S.no</th>
//                     <th className="p-2 border">Lead ID</th>
//                     <th className="p-2 border">Name</th>
//                     <th className="p-2 border">Budget</th>
//                     <th className="p-2 border">Contact no.</th>
//                     <th className="p-2 border">Category</th>
//                     <th className="p-2 border">Source</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {clientLeads.map((client) => (
//                     <tr
//                       key={client.leadId}
//                       onClick={() => setSelectedClient(client)}
//                       className={`cursor-pointer ${
//                         selectedClient?.leadId === client.leadId
//                           ? "bg-green-100"
//                           : "hover:bg-gray-50"
//                       }`}
//                     >
//                       <td className="p-2 border">{client.sno}</td>
//                       <td className="p-2 border">{client.leadId}</td>
//                       <td className="p-2 border font-semibold">
//                         {client.name}
//                       </td>
//                       <td className="p-2 border">{client.budget}</td>
//                       <td className="p-2 border">{client.contact}</td>
//                       <td className="p-2 border">{client.category}</td>
//                       <td className="p-2 border text-center">
//                         {client.source === "Google" && (
//                           <FaGoogle className="text-xl text-blue-500 inline" />
//                         )}
//                         {client.source === "Instagram" && (
//                           <FaInstagram className="text-xl text-pink-500 inline" />
//                         )}
//                         {client.source === "PDF" && (
//                           <FaFilePdf className="text-xl text-red-600 inline" />
//                         )}
//                         {client.source === "Facebook" && (
//                           <FaFacebookF className="text-xl text-blue-700 inline" />
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               <div className="text-center mt-4">
//                 <p className="font-medium text-sm mb-2">Select Client</p>
//                 <button
//                   disabled={!selectedClient}
//                   onClick={() => {
//                     if (selectedClient) {
//                       const newQuote = {
//                         sno: leads.length + 1,
//                         qid: `PQ00${leads.length + 1}/1`,
//                         name: selectedClient.name,
//                         leadId: selectedClient.leadId,
//                         budget: selectedClient.budget,
//                         contact: selectedClient.contact,
//                         quoteAmount: selectedClient.budget,
//                         city: "N/A", // Replace with actual data if available
//                         assigned: ["R"], // or however you determine this
//                         status: "Send", // default status
//                       };

//                       setLeads((prev) => [...prev, newQuote]);
//                       toast.success(`Quote added for ${selectedClient.name}`);
//                       setShowModal(false);
//                       setSelectedClient(null);
//                     }
//                   }}
//                   className={`px-5 py-1.5 rounded-full font-semibold text-white ${
//                     selectedClient
//                       ? "bg-red-700 hover:bg-red-800"
//                       : "bg-gray-400 cursor-not-allowed"
//                   }`}
//                 >
//                   Proceed
//                 </button>
//               </div>

//               <button
//                 onClick={() => setShowModal(false)}
//                 className="absolute top-3 right-4 text-xl font-bold"
//               >
//                 ×
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Quote;
