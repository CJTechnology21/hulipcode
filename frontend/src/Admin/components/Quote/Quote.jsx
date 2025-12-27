import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaWhatsapp } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";
import Button from "../../../components/Button";
import ClientSelectionModal from "./ClientSelectionModal";
import {
  fetchQuotes,
  createQuote,
  updateQuote,
  deleteQuote,
} from "../../../services/quoteServices";
import { fetchArchitects } from "../../../services/leadServices";
import { fetchLeads } from "../../../services/leadServices";
import { MdMail } from "react-icons/md";

const statusOptions = ["In Review", "Shortlisted", "Approved", "Rejected"];

function Quote() {
  const [leads, setLeads] = useState([]);
  const [availableClients, setAvailableClients] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  //eslint-disable-next-line
  const [filters, setFilters] = useState({});
  const [architects, setArchitects] = useState([]);
  const [showSendOptions, setShowSendOptions] = useState(false);
  const navigate = useNavigate();

  //  central load function (reusable after every update)
  const loadQuotes = async () => {
    try {
      const data = await fetchQuotes(filters);
      const normalized = data.map((item, index) => ({
        sno: index + 1,
        qid: item.qid,
        id: item._id,
        leadId: item.leadId?.id || "",
        leadIdMongo: item.leadId?._id,
        name: item.leadId?.name || item.leadId?.createdBy?.name || `Client - ${item.leadId?.id || ""}`,
        createdByName: item.leadId?.createdBy?.name || "",
        budget: item.leadId?.budget || "",
        contact: item.leadId?.contact || "",
        quoteAmount: item.quoteAmount,
        city: item.location || "",
        // New lead fields
        propertyDetails: item.leadId?.propertyDetails || "",
        style: item.leadId?.style || "",
        requirements: item.leadId?.requirements || "",
        address: item.leadId?.address || "",
        assigned:
          item.assigned?.map((a) => ({
            _id: a?._id,
            name: a?.name || "",
          })) || [],
        status: item.status || "",
      }));
      setLeads(normalized);
    } catch (error) {
      toast.error("Failed to load quotes");
      console.error(error);
    }
  };

  // Fetch quotes on mount / filter change
  useEffect(() => {
    //eslint-disable-next-line
    loadQuotes();
    //eslint-disable-next-line
  }, [filters]);

  // Fetch clients
  useEffect(() => {
    const loadClients = async () => {
      try {
        const allLeads = await fetchLeads();
        const quotedClientIds = new Set(leads.map((q) => q.leadIdMongo));
        const filtered = allLeads
          .map((lead, idx) => ({
            sno: idx + 1,
            _id: lead._id,
            leadId: lead.id,
            name: lead.name,
            budget: lead.budget,
            contact: lead.contact,
            category: lead.category,
            source: lead.source,
            propertyDetails: lead.propertyDetails,
            style: lead.style,
            requirements: lead.requirements,
            address: lead.address,
            assigned: lead.assigned, // Include assigned professional from lead
          }))
          .filter((lead) => !quotedClientIds.has(lead._id));
        setAvailableClients(filtered);
      } catch (error) {
        toast.error("Failed to load leads");
        console.error(error);
      }
    };
    loadClients();
  }, [leads]);

  // Fetch architects
  useEffect(() => {
    const loadArchitects = async () => {
      try {
        const data = await fetchArchitects();
        setArchitects(data || []);
        console.log("Architects loaded:", data);
      } catch (err) {
        console.error("Failed to fetch architects:", err);
      }
    };
    loadArchitects();
  }, []);

  const startEditing = (index) => {
    const lead = leads[index];
    setEditingIndex(index);
    setEditedData({
      ...lead,
      assignedIds: lead.assigned?.map((a) => a._id) || [],
    });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditedData({});
  };

  const saveEdit = async () => {
    try {
      const payload = {
        leadId: editedData.leadIdMongo,
        quoteAmount: editedData.quoteAmount,
        status: editedData.status,
        contact: editedData.contact,
        city: editedData.city,
        name: editedData.name,
        assigned: editedData.assignedIds,
      };

      await updateQuote(editedData.id, payload);
      toast.success("Quote updated successfully!");
      setEditingIndex(null);

      //  reload data from backend
      loadQuotes();
    } catch (err) {
      toast.error("Failed to update quote");
      console.error("Update error:", err.response || err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuote(id);
      toast.success("Quote deleted successfully!");

      //  reload data
      loadQuotes();
    } catch (err) {
      toast.error("Failed to delete quote");
      console.error(err);
    }
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

  // Send via Email/WhatsApp
  const handleSendQuote = async (method, newQuoteData, selectedClient) => {
    try {
      await createQuote({
        ...newQuoteData,
        status: "In Review", // ✅ status set to In Review
      });

      toast.success(
        `Quote sent to ${selectedClient.name} via ${
          method === "email" ? "Email" : "WhatsApp"
        } and marked as In Review`
      );

      if (method === "email") {
        window.open(
          `mailto:${selectedClient.email}?subject=Huelip Constructions&body=Hello ${selectedClient.name},%0D%0A%0D%0A` +
            `Here are the details of your quote:%0D%0A` +
            `Quote Amount: ${newQuoteData.quoteAmount}%0D%0A` +
            `Project Location: ${newQuoteData.city}%0D%0A` +
            `Status: In Review%0D%0A%0D%0A` +
            `Thanks & Regards,%0D%0AHuelip Constructions`,
          "_blank"
        );
      } else if (method === "whatsapp") {
        window.open(
          `https://wa.me/${selectedClient.contact}?text=` +
            `Hello ${selectedClient.name},%0A%0A` +
            `Here are the details of your quote:%0A` +
            `Quote Amount: ${newQuoteData.quoteAmount}%0A` +
            `Project Location: ${newQuoteData.city}%0A` +
            `Status: In Review%0A%0A` +
            `Thanks & Regards,%0AHuelip Constructions`,
          "_blank"
        );
      }

      setShowModal(false);
      setShowSendOptions(false);
      setSelectedClient(null);

      //  reload latest quotes
      loadQuotes();
    } catch (err) {
      toast.error("Failed to send quote");
      console.error(err);
    }
  };

  return (
    <Layout title="Quotation">
      <ToastContainer />
        <div className="bg-white shadow px-6 py-4 flex justify-end items-center gap-3">
        <button
          className="bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-red-800"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Add Quote
        </button>
      </div>

      <div className="p-4 sm:p-6 flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow overflow-x-auto p-4">
          <table className="min-w-[1200px] w-full text-sm text-left">
            <thead className="bg-gray-100 text-xs text-gray-600">
              <tr>
                {[
                  "S.no",
                  "Q-ID",
                  "Name",
                  "Lead ID",
                  "Property Details",
                  "Budget",
                  "Style",
                  "Requirements",
                  "Address",
                  "Status",
                  "Action",
                ].map((head, i) => (
                  <th key={i} className="px-3 py-2">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => (
                <tr key={lead.id || i} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2">{lead.sno}</td>
                  <td
                    className="px-3 py-2 cursor-pointer"
                    onClick={() => {
                      const firstArchitectId = lead.assigned?.[0]?._id || null;

                      console.log("🔗 Navigating to Quote Details with:");
                      console.log("• Quote ID:", lead.id);
                      console.log("• QID:", lead.qid);
                      console.log("• Lead Mongo ID:", lead.leadIdMongo);
                      console.log(
                        "• Architect ID (first assigned):",
                        firstArchitectId
                      );

                      navigate("/quotedetails", {
                        state: {
                          qid: lead.qid,
                          clientName: lead.name,
                          leadMongoId: lead.leadIdMongo,
                          quoteId: lead.id,
                         architectId: firstArchitectId,

                        },
                      });
                    }}
                  >
                    {lead.qid}
                  </td>

                  {/* <td
                    className="px-3 py-2 cursor-pointer"
                    onClick={() =>
                      navigate("/quotedetails", {
                        state: {
                          qid: lead.qid,
                          clientName: lead.name,
                          leadMongoId: lead.leadIdMongo,
                          quoteId: lead.id,
                        },
                      })
                    }
                  >
                    {lead.qid}
                  </td> */}
                  <td className="px-3 py-2">
                    {editingIndex === i ? (
                      <input
                        value={editedData.name || ""}
                        onChange={(e) =>
                          setEditedData({ ...editedData, name: e.target.value })
                        }
                        className="border border-red-500 px-2 py-1 rounded w-full text-sm"
                      />
                    ) : (
                      <span className="font-bold">{lead.name || lead.createdByName || "Unnamed Client"}</span>
                    )}
                  </td>
                  <td className="px-3 py-2">{lead.leadId || ""}</td>
                  <td className="px-3 py-2 max-w-xs truncate" title={lead.propertyDetails || ""}>
                    {lead.propertyDetails || "-"}
                  </td>
                  <td className="px-3 py-2">{lead.budget || ""}</td>
                  <td className="px-3 py-2">{lead.style || "-"}</td>
                  <td className="px-3 py-2 max-w-xs truncate" title={lead.requirements || ""}>
                    {lead.requirements || "-"}
                  </td>
                  <td className="px-3 py-2 max-w-xs truncate" title={lead.address || ""}>
                    {lead.address || "-"}
                  </td>
                  <td className="px-3 py-2">
                    {editingIndex === i ? (
                      <select
                        value={editedData.status || ""}
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
                        {lead.status || ""}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 flex gap-2">
                    {editingIndex === i ? (
                      <>
                        <Button
                          variant="custom"
                          className="bg-green-600 text-white text-xs px-3 py-1 rounded"
                          onClick={saveEdit}
                        >
                          Save
                        </Button>
                        <Button
                          variant="custom"
                          className="bg-red-600 text-white text-xs px-3 py-1 rounded"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="custom"
                          onClick={() => startEditing(i)}
                        >
                          <FaEdit className="text-gray-600 hover:text-blue-600 cursor-pointer" />
                        </Button>
                        <Button
                          variant="custom"
                          onClick={() => handleDelete(lead.id)}
                        >
                          <FaTrash className="text-red-600 hover:text-red-800 cursor-pointer" />
                        </Button>
                      </>
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
        <ClientSelectionModal
          availableClients={availableClients}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          onClose={() => setShowModal(false)}
          onProceed={() => {
            if (selectedClient && selectedClient.assigned) {
              // Use the lead's assigned professional automatically
              // Handle both populated object and ObjectId string
              const assignedProfessionalId = selectedClient.assigned._id 
                ? selectedClient.assigned._id 
                : (typeof selectedClient.assigned === 'string' 
                    ? selectedClient.assigned 
                    : null);
              
              if (!assignedProfessionalId) {
                toast.error("This lead has no assigned professional. Please assign a professional to the lead first.");
                return;
              }
              
              const newQuoteData = {
                leadId: selectedClient._id,
                quoteAmount: 0, // Will be set later in the quote detail
                city: "N/A",
                assigned: [assignedProfessionalId], // Use lead's assigned professional
              };
              setShowSendOptions({ newQuoteData, selectedClient });
            }
          }}
        />
      )}

      {/* Send options */}
      {showSendOptions && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-72">
            <h3 className="text-lg font-semibold mb-4">Send Quote via:</h3>
            <div className="flex flex-col gap-3">
              <button
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 justify-center"
                onClick={() =>
                  handleSendQuote(
                    "email",
                    showSendOptions.newQuoteData,
                    showSendOptions.selectedClient
                  )
                }
              >
                <MdMail /> Email
              </button>
              <button
                className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 justify-center"
                onClick={() =>
                  handleSendQuote(
                    "whatsapp",
                    showSendOptions.newQuoteData,
                    showSendOptions.selectedClient
                  )
                }
              >
                <FaWhatsapp /> WhatsApp
              </button>
              <button
                className="bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                onClick={() => setShowSendOptions(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Quote;

// import { useState, useEffect } from "react";
// import { FaPlus, FaEdit, FaTrash, FaWhatsapp } from "react-icons/fa";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import Layout from "../Layout";
// import Button from "../../../components/Button";
// import ClientSelectionModal from "./ClientSelectionModal";
// import {
//   fetchQuotes,
//   createQuote,
//   updateQuote,
//   deleteQuote,
// } from "../../../services/quoteServices";
// import { fetchArchitects, fetchLeads } from "../../../services/leadServices";
// import { MdMail } from "react-icons/md";

// const statusOptions = ["In Review", "Shortlisted", "Approved", "Rejected"];

// function Quote() {
//   const [leads, setLeads] = useState([]);
//   const [availableClients, setAvailableClients] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [showModal, setShowModal] = useState(false);
//   const [selectedClient, setSelectedClient] = useState(null);
//   //eslint-disable-next-line
//   const [filters, setFilters] = useState({});
//   const [architects, setArchitects] = useState([]);
//   const [showSendOptions, setShowSendOptions] = useState(false);
//   const navigate = useNavigate();

//   // Fetch quotes
//   useEffect(() => {
//     const loadQuotes = async () => {
//       try {
//         const data = await fetchQuotes(filters);
//         const normalized = data.map((item, index) => ({
//           sno: index + 1,
//           qid: item.qid,
//           id: item._id,
//           leadId: item.leadId?.id || "",
//           leadIdMongo: item.leadId?._id,
//           name: item.leadId?.name || "",
//           budget: item.leadId?.budget || "",
//           contact: item.leadId?.contact || "",
//           quoteAmount: item.quoteAmount,
//           city: item.location || "",
//           assigned:
//             item.assigned?.map((a) => ({
//               _id: a?._id,
//               name: a?.name || "",
//             })) || [],
//           status: item.status || "",
//         }));
//         setLeads(normalized);
//       } catch (error) {
//         toast.error("Failed to load quotes");
//         console.error(error);
//       }
//     };
//     loadQuotes();
//   }, [filters]);

//   // Fetch clients for modal
//   useEffect(() => {
//     const loadClients = async () => {
//       try {
//         const allLeads = await fetchLeads();
//         const quotedClientIds = new Set(leads.map((q) => q.leadIdMongo));
//         const filtered = allLeads
//           .map((lead, idx) => ({
//             sno: idx + 1,
//             _id: lead._id,
//             leadId: lead.id, // display ID
//             name: lead.name,
//             budget: lead.budget,
//             contact: lead.contact,
//             category: lead.category,
//             source: lead.source,
//           }))
//           .filter((lead) => !quotedClientIds.has(lead._id));
//         setAvailableClients(filtered);
//       } catch (error) {
//         toast.error("Failed to load leads");
//         console.error(error);
//       }
//     };
//     loadClients();
//   }, [leads]);

//   // Fetch architects
//   useEffect(() => {
//     const loadArchitects = async () => {
//       try {
//         const data = await fetchArchitects();
//         setArchitects(data || []);
//       } catch (err) {
//         console.error("Failed to fetch architects:", err);
//       }
//     };
//     loadArchitects();
//   }, []);

//   const startEditing = (index) => {
//     const lead = leads[index];
//     setEditingIndex(index);
//     setEditedData({
//       ...lead,
//       assignedIds: lead.assigned?.map((a) => a._id) || [],
//     });
//   };

//   const cancelEdit = () => {
//     setEditingIndex(null);
//     setEditedData({});
//   };

//   const saveEdit = async () => {
//     try {
//       const payload = {
//         leadId: editedData.leadIdMongo,
//         quoteAmount: editedData.quoteAmount,
//         status: editedData.status,
//         contact: editedData.contact,
//         city: editedData.city,
//         name: editedData.name,
//         assigned: editedData.assignedIds, // array of architect _ids
//       };

//       const updatedQuote = await updateQuote(editedData.id, payload);

//       const updatedLeads = [...leads];
//       updatedLeads[editingIndex] = {
//         ...updatedQuote,
//         sno: editedData.sno,
//         leadId: editedData.leadId,
//         leadIdMongo: updatedQuote.leadId?._id,
//         assigned:
//           updatedQuote.assigned?.map((a) => ({
//             _id: a?._id,
//             name: a?.name || "",
//           })) || [],
//       };

//       setLeads(updatedLeads);
//       setEditingIndex(null);
//       toast.success("Quote updated successfully!");
//     } catch (err) {
//       toast.error("Failed to update quote");
//       console.error("Update error:", err.response || err);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteQuote(id);
//       setLeads((prev) => prev.filter((q) => q.id !== id));
//       toast.success("Quote deleted successfully!");
//     } catch (err) {
//       toast.error("Failed to delete quote");
//       console.error(err);
//     }
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

//   // Handle sending quote via email or WhatsApp
//   const handleSendQuote = async (method, newQuoteData, selectedClient) => {
//     try {
//       const savedQuote = await createQuote({
//         ...newQuoteData,
//         status: "Sent",
//       });

//       const formatted = {
//         sno: leads.length + 1,
//         qid: savedQuote.qid,
//         id: savedQuote._id,
//         name: selectedClient.name || "",
//         leadId: selectedClient.id || "",
//         leadIdMongo: savedQuote.leadId,
//         budget: selectedClient.budget || "",
//         contact: selectedClient.contact || "",
//         quoteAmount: savedQuote.quoteAmount || "",
//         city: savedQuote.city || "N/A",
//         assigned:
//           savedQuote.assigned?.map((a) => ({
//             _id: a?._id,
//             name: a?.name || "",
//           })) || [],
//         status: savedQuote.status || "",
//       };

//       setLeads((prev) => [...prev, formatted]);

//       if (method === "email") {
//         toast.success(`Quote sent to ${selectedClient.name} via Email`);
//         window.open(
//           `mailto:${selectedClient.email}?subject=Huelip Constructions&body=Hello ${selectedClient.name},%0D%0A%0D%0A` +
//             `Here are the details of your quote:%0D%0A` +
//             `------------------------------------%0D%0A` +
//             `Quote Amount: ${savedQuote.quoteAmount}%0D%0A` +
//             `Project Location: ${savedQuote.location}%0D%0A` +
//             `Status: ${savedQuote.status}%0D%0A` +
//             `------------------------------------%0D%0A%0D%0A` +
//             `If you have any questions, feel free to contact me:%0D%0A` +
//             `Phone: +91-9876543210%0D%0A` +
//             `Email: support@huelipconstructions.com%0D%0A%0D%0A` +
//             `Thanks & Regards,%0D%0A` +
//             `Huelip Constructions`,
//           "_blank"
//         );
//       } else if (method === "whatsapp") {
//         toast.success(`Quote sent to ${selectedClient.name} via WhatsApp`);
//         window.open(
//           `https://wa.me/${selectedClient.contact}?text=` +
//             `Huelip Constructions`+
//             `Hello ${selectedClient.name},%0A%0A` +
//             `Here are the details of your quote:%0A` +
//             `------------------------------------%0A` +
//             `Quote Amount: ${savedQuote.quoteAmount}%0A` +
//             `Project Location: ${savedQuote.location}%0A` +
//             `Status: ${savedQuote.status}%0A` +
//             `------------------------------------%0A%0A` +
//             `If you have any questions, feel free to contact me:%0A` +
//             `Phone: +91-9876543210%0A` +
//             `Email: support@huelipconstructions.com%0A%0A` +
//             `Thanks & Regards,%0A` +
//             `Huelip Constructions`,
//           "_blank"
//         );
//       }
//       setShowModal(false);
//       setShowSendOptions(false);
//       setSelectedClient(null);
//     } catch (err) {
//       toast.error("Failed to send quote");
//       console.error(err);
//     }
//   };

//   return (
//     <Layout title="Quotation">
//       <ToastContainer />
//       <div className="bg-white shadow px-6 py-4 flex justify-end items-center">
//         <button
//           className="bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-red-800"
//           onClick={() => setShowModal(true)}
//         >
//           <FaPlus /> Add Quote
//         </button>
//       </div>

//       <div className="p-4 sm:p-6 flex-1 flex flex-col gap-6">
//         <div className="bg-white rounded-xl shadow overflow-x-auto p-4">
//           <table className="min-w-[1000px] w-full text-sm text-left">
//             <thead className="bg-gray-100 text-xs text-gray-600">
//               <tr>
//                 {[
//                   "S.no",
//                   "Q-ID",
//                   "Name",
//                   "Lead ID",
//                   "Budget",
//                   "Contact no.",
//                   "Quote Amount",
//                   "City/ Area",
//                   "Assigned to",
//                   "Status",
//                   "Action",
//                 ].map((head, i) => (
//                   <th key={i} className="px-3 py-2">
//                     {head}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {leads.map((lead, i) => (
//                 <tr key={lead.id || i} className="border-t hover:bg-gray-50">
//                   <td className="px-3 py-2">{lead.sno}</td>
//                   <td
//                     className="px-3 py-2 cursor-pointer"
//                     onClick={() =>
//                       navigate("/quotedetails", {
//                         state: {
//                           qid: lead.qid,
//                           clientName: lead.name,
//                           leadMongoId: lead.leadIdMongo,
//                           quoteId: lead.id,
//                         },
//                       })
//                     }
//                   >
//                     {lead.qid}
//                   </td>
//                   <td className="px-3 py-2">
//                     {editingIndex === i ? (
//                       <input
//                         value={editedData.name || ""}
//                         onChange={(e) =>
//                           setEditedData({ ...editedData, name: e.target.value })
//                         }
//                         className="border border-red-500 px-2 py-1 rounded w-full text-sm"
//                       />
//                     ) : (
//                       <span className="font-bold">{lead.name || ""}</span>
//                     )}
//                   </td>
//                   <td className="px-3 py-2">{lead.leadId || ""}</td>
//                   <td className="px-3 py-2">{lead.budget || ""}</td>
//                   <td className="px-3 py-2">
//                     {editingIndex === i ? (
//                       <input
//                         value={editedData.contact || ""}
//                         onChange={(e) =>
//                           setEditedData({
//                             ...editedData,
//                             contact: e.target.value,
//                           })
//                         }
//                         className="border border-red-500 px-2 py-1 rounded w-full text-sm"
//                       />
//                     ) : (
//                       lead.contact || ""
//                     )}
//                   </td>
//                   <td className="px-3 py-2">
//                     {editingIndex === i ? (
//                       <input
//                         value={editedData.quoteAmount || ""}
//                         onChange={(e) =>
//                           setEditedData({
//                             ...editedData,
//                             quoteAmount: e.target.value,
//                           })
//                         }
//                         className="border border-red-500 px-2 py-1 rounded w-full text-sm"
//                       />
//                     ) : (
//                       lead.quoteAmount || ""
//                     )}
//                   </td>
//                   <td className="px-3 py-2">
//                     {editingIndex === i ? (
//                       <input
//                         value={editedData.city || ""}
//                         onChange={(e) =>
//                           setEditedData({ ...editedData, city: e.target.value })
//                         }
//                         className="border border-red-500 px-2 py-1 rounded w-full text-sm"
//                       />
//                     ) : (
//                       lead.city || ""
//                     )}
//                   </td>
//                   <td className="px-3 py-2">
//                     {editingIndex === i ? (
//                       <select
//                         multiple
//                         value={editedData.assignedIds || []}
//                         onChange={(e) => {
//                           const options = Array.from(
//                             e.target.selectedOptions
//                           ).map((opt) => opt.value);
//                           setEditedData({
//                             ...editedData,
//                             assignedIds: options,
//                           });
//                         }}
//                         className="border border-red-500 px-2 py-1 rounded text-sm w-full"
//                       >
//                         {architects.map((arch) => (
//                           <option key={arch._id} value={arch._id}>
//                             {arch.name || ""}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       <div className="flex gap-1">
//                         {lead.assigned?.map((a, idx) => (
//                           <div
//                             key={idx}
//                             className="w-6 h-6 rounded-full bg-yellow-400 text-xs flex items-center justify-center font-bold"
//                           >
//                             {a?.name?.[0] || ""}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-3 py-2">
//                     {editingIndex === i ? (
//                       <select
//                         value={editedData.status || ""}
//                         onChange={(e) =>
//                           setEditedData({
//                             ...editedData,
//                             status: e.target.value,
//                           })
//                         }
//                         className="border border-red-500 px-2 py-1 rounded text-sm"
//                       >
//                         {statusOptions.map((opt) => (
//                           <option key={opt} value={opt}>
//                             {opt}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusStyle(
//                           lead.status
//                         )}`}
//                       >
//                         {lead.status || ""}
//                       </span>
//                     )}
//                   </td>
//                   <td className="px-3 py-2 flex gap-2">
//                     {editingIndex === i ? (
//                       <>
//                         <Button
//                           variant="custom"
//                           className="bg-green-600 text-white text-xs px-3 py-1 rounded"
//                           onClick={saveEdit}
//                         >
//                           Save
//                         </Button>
//                         <Button
//                           variant="custom"
//                           className="bg-red-600 text-white text-xs px-3 py-1 rounded"
//                           onClick={cancelEdit}
//                         >
//                           Cancel
//                         </Button>
//                       </>
//                     ) : (
//                       <>
//                         <Button
//                           variant="custom"
//                           onClick={() => startEditing(i)}
//                         >
//                           <FaEdit className="text-gray-600 hover:text-blue-600 cursor-pointer" />
//                         </Button>
//                         <Button
//                           variant="custom"
//                           onClick={() => handleDelete(lead.id)}
//                         >
//                           <FaTrash className="text-red-600 hover:text-red-800 cursor-pointer" />
//                         </Button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <ClientSelectionModal
//           availableClients={availableClients}
//           selectedClient={selectedClient}
//           setSelectedClient={setSelectedClient}
//           onClose={() => setShowModal(false)}
//           onProceed={(amount, architectId) => {
//             if (selectedClient && amount && architectId) {
//               const newQuoteData = {
//                 leadId: selectedClient._id, // MongoDB _id
//                 quoteAmount: amount,
//                 city: "N/A",
//                 assigned: [architectId],
//               };
//               setShowSendOptions({ newQuoteData, selectedClient });
//             }
//           }}
//         />
//       )}

//       {/* Send options popup */}
//       {showSendOptions && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
//           <div className="bg-white rounded-xl shadow-lg p-6 w-72">
//             <h3 className="text-lg font-semibold mb-4">Send Quote via:</h3>
//             <div className="flex flex-col gap-3">
//               <button
//                 className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//                 onClick={() =>
//                   handleSendQuote(
//                     "email",
//                     showSendOptions.newQuoteData,
//                     showSendOptions.selectedClient
//                   )
//                 }
//               >
//                 <MdMail /> Email
//               </button>
//               <button
//                 className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
//                 onClick={() =>
//                   handleSendQuote(
//                     "whatsapp",
//                     showSendOptions.newQuoteData,
//                     showSendOptions.selectedClient
//                   )
//                 }
//               >
//                 <FaWhatsapp/> WhatsApp
//               </button>
//               <button
//                 className="bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
//                 onClick={() => setShowSendOptions(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </Layout>
//   );
// }

// export default Quote;

// import { useState, useEffect } from "react";
// import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import Layout from "../Layout";
// import Button from "../../../components/Button";
// import ClientSelectionModal from "./ClientSelectionModal";
// import {
//   fetchQuotes,
//   createQuote,
//   updateQuote,
//   deleteQuote,
// } from "../../../services/quoteServices";
// import { fetchArchitects, fetchLeads } from "../../../services/leadServices";

// const statusOptions = ["In Review", "Shortlisted", "Approved", "Rejected"];

// function Quote() {
//   const [leads, setLeads] = useState([]);
//   const [availableClients, setAvailableClients] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [showModal, setShowModal] = useState(false);
//   const [selectedClient, setSelectedClient] = useState(null);
//   //eslint-disable-next-line
//   const [filters, setFilters] = useState({});
//   const [architects, setArchitects] = useState([]);
//   const navigate = useNavigate();

//   // Fetch quotes
//   useEffect(() => {
//     const loadQuotes = async () => {
//       try {
//         const data = await fetchQuotes(filters);
//         const normalized = data.map((item, index) => ({
//           sno: index + 1,
//           qid: item.qid,
//           id: item._id,
//           leadId: item.leadId?.id || "",
//           leadIdMongo: item.leadId?._id,
//           name: item.leadId?.name || "",
//           budget: item.leadId?.budget || "",
//           contact: item.leadId?.contact || "",
//           quoteAmount: item.quoteAmount,
//           city: item.city || "",
//           assigned:
//             item.assigned?.map((a) => ({
//               _id: a?._id,
//               name: a?.name || "",
//             })) || [],
//           status: item.status || "",
//         }));
//         setLeads(normalized);
//       } catch (error) {
//         toast.error("Failed to load quotes");
//         console.error(error);
//       }
//     };
//     loadQuotes();
//   }, [filters]);

//   // Fetch clients for modal
//   useEffect(() => {
//     const loadClients = async () => {
//       try {
//         const allLeads = await fetchLeads();
//         const quotedClientIds = new Set(leads.map((q) => q.leadIdMongo));
//         const filtered = allLeads
//           .map((lead, idx) => ({
//             sno: idx + 1,
//             _id: lead._id,
//             leadId: lead.id, // display ID
//             name: lead.name,
//             budget: lead.budget,
//             contact: lead.contact,
//             category: lead.category,
//             source: lead.source,
//           }))
//           .filter((lead) => !quotedClientIds.has(lead._id));
//         setAvailableClients(filtered);
//       } catch (error) {
//         toast.error("Failed to load leads");
//         console.error(error);
//       }
//     };
//     loadClients();
//   }, [leads]);

//   // Fetch architects
//   useEffect(() => {
//     const loadArchitects = async () => {
//       try {
//         const data = await fetchArchitects();
//         setArchitects(data || []);
//       } catch (err) {
//         console.error("Failed to fetch architects:", err);
//       }
//     };
//     loadArchitects();
//   }, []);

//   const startEditing = (index) => {
//     const lead = leads[index];
//     setEditingIndex(index);
//     setEditedData({
//       ...lead,
//       assignedIds: lead.assigned?.map((a) => a._id) || [],
//     });
//   };

//   const cancelEdit = () => {
//     setEditingIndex(null);
//     setEditedData({});
//   };

//   const saveEdit = async () => {
//     try {
//       const payload = {
//         leadId: editedData.leadIdMongo,
//         quoteAmount: editedData.quoteAmount,
//         status: editedData.status,
//         contact: editedData.contact,
//         city: editedData.city,
//         name: editedData.name,
//         assigned: editedData.assignedIds, // array of architect _ids
//       };

//       const updatedQuote = await updateQuote(editedData.id, payload);

//       const updatedLeads = [...leads];
//       updatedLeads[editingIndex] = {
//         ...updatedQuote,
//         sno: editedData.sno,
//         leadId: editedData.leadId,
//         leadIdMongo: updatedQuote.leadId?._id,
//         assigned:
//           updatedQuote.assigned?.map((a) => ({
//             _id: a?._id,
//             name: a?.name || "",
//           })) || [],
//       };

//       setLeads(updatedLeads);
//       setEditingIndex(null);
//       toast.success("Quote updated successfully!");
//     } catch (err) {
//       toast.error("Failed to update quote");
//       console.error("Update error:", err.response || err);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteQuote(id);
//       setLeads((prev) => prev.filter((q) => q.id !== id));
//       toast.success("Quote deleted successfully!");
//     } catch (err) {
//       toast.error("Failed to delete quote");
//       console.error(err);
//     }
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

//   return (
//     <Layout title="Quotation">
//       <ToastContainer />
//       <div className="bg-white shadow px-6 py-4 flex justify-end items-center">
//         <button
//           className="bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-red-800"
//           onClick={() => setShowModal(true)}
//         >
//           <FaPlus /> Add Quote
//         </button>
//       </div>

//       <div className="p-4 sm:p-6 flex-1 flex flex-col gap-6">
//         <div className="bg-white rounded-xl shadow overflow-x-auto p-4">
//           <table className="min-w-[1000px] w-full text-sm text-left">
//             <thead className="bg-gray-100 text-xs text-gray-600">
//               <tr>
//                 {[
//                   "S.no",
//                   "Q-ID",
//                   "Name",
//                   "Lead ID",
//                   "Budget",
//                   "Contact no.",
//                   "Quote Amount",
//                   "City/ Area",
//                   "Assigned to",
//                   "Status",
//                   "Action",
//                 ].map((head, i) => (
//                   <th key={i} className="px-3 py-2">
//                     {head}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {leads.map((lead, i) => (
//                 <tr key={lead.id || i} className="border-t hover:bg-gray-50">
//                   <td className="px-3 py-2">{lead.sno}</td>
//                   <td
//                     className="px-3 py-2 cursor-pointer"
//                     onClick={() =>
//                       navigate("/quotedetails", {
//                         state: {
//                           qid: lead.qid,
//                           clientName: lead.name,
//                           leadMongoId: lead.leadIdMongo,
//                           quoteId: lead.id,
//                         },
//                       })
//                     }
//                   >
//                     {lead.qid}
//                   </td>
//                   <td className="px-3 py-2">
//                     {editingIndex === i ? (
//                       <input
//                         value={editedData.name || ""}
//                         onChange={(e) =>
//                           setEditedData({ ...editedData, name: e.target.value })
//                         }
//                         className="border border-red-500 px-2 py-1 rounded w-full text-sm"
//                       />
//                     ) : (
//                       <span className="font-bold">{lead.name || ""}</span>
//                     )}
//                   </td>
//                   <td className="px-3 py-2">{lead.leadId || ""}</td>
//                   <td className="px-3 py-2">{lead.budget || ""}</td>
//                   <td className="px-3 py-2">
//                     {editingIndex === i ? (
//                       <input
//                         value={editedData.contact || ""}
//                         onChange={(e) =>
//                           setEditedData({
//                             ...editedData,
//                             contact: e.target.value,
//                           })
//                         }
//                         className="border border-red-500 px-2 py-1 rounded w-full text-sm"
//                       />
//                     ) : (
//                       lead.contact || ""
//                     )}
//                   </td>
//                   <td className="px-3 py-2">
//                     {editingIndex === i ? (
//                       <input
//                         value={editedData.quoteAmount || ""}
//                         onChange={(e) =>
//                           setEditedData({
//                             ...editedData,
//                             quoteAmount: e.target.value,
//                           })
//                         }
//                         className="border border-red-500 px-2 py-1 rounded w-full text-sm"
//                       />
//                     ) : (
//                       lead.quoteAmount || ""
//                     )}
//                   </td>
//                   <td className="px-3 py-2">
//                     {editingIndex === i ? (
//                       <input
//                         value={editedData.city || ""}
//                         onChange={(e) =>
//                           setEditedData({ ...editedData, city: e.target.value })
//                         }
//                         className="border border-red-500 px-2 py-1 rounded w-full text-sm"
//                       />
//                     ) : (
//                       lead.city || ""
//                     )}
//                   </td>
//                   <td className="px-3 py-2">
//                     {editingIndex === i ? (
//                       <select
//                         multiple
//                         value={editedData.assignedIds || []}
//                         onChange={(e) => {
//                           const options = Array.from(
//                             e.target.selectedOptions
//                           ).map((opt) => opt.value);
//                           setEditedData({
//                             ...editedData,
//                             assignedIds: options,
//                           });
//                         }}
//                         className="border border-red-500 px-2 py-1 rounded text-sm w-full"
//                       >
//                         {architects.map((arch) => (
//                           <option key={arch._id} value={arch._id}>
//                             {arch.name || ""}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       <div className="flex gap-1">
//                         {lead.assigned?.map((a, idx) => (
//                           <div
//                             key={idx}
//                             className="w-6 h-6 rounded-full bg-yellow-400 text-xs flex items-center justify-center font-bold"
//                           >
//                             {a?.name?.[0] || ""}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-3 py-2">
//                     {editingIndex === i ? (
//                       <select
//                         value={editedData.status || ""}
//                         onChange={(e) =>
//                           setEditedData({
//                             ...editedData,
//                             status: e.target.value,
//                           })
//                         }
//                         className="border border-red-500 px-2 py-1 rounded text-sm"
//                       >
//                         {statusOptions.map((opt) => (
//                           <option key={opt} value={opt}>
//                             {opt}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusStyle(
//                           lead.status
//                         )}`}
//                       >
//                         {lead.status || ""}
//                       </span>
//                     )}
//                   </td>
//                   <td className="px-3 py-2 flex gap-2">
//                     {editingIndex === i ? (
//                       <>
//                         <Button
//                           variant="custom"
//                           className="bg-green-600 text-white text-xs px-3 py-1 rounded"
//                           onClick={saveEdit}
//                         >
//                           Save
//                         </Button>
//                         <Button
//                           variant="custom"
//                           className="bg-red-600 text-white text-xs px-3 py-1 rounded"
//                           onClick={cancelEdit}
//                         >
//                           Cancel
//                         </Button>
//                       </>
//                     ) : (
//                       <>
//                         <Button
//                           variant="custom"
//                           onClick={() => startEditing(i)}
//                         >
//                           <FaEdit className="text-gray-600 hover:text-blue-600 cursor-pointer" />
//                         </Button>
//                         <Button
//                           variant="custom"
//                           onClick={() => handleDelete(lead.id)}
//                         >
//                           <FaTrash className="text-red-600 hover:text-red-800 cursor-pointer" />
//                         </Button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <ClientSelectionModal
//           availableClients={availableClients}
//           selectedClient={selectedClient}
//           setSelectedClient={setSelectedClient}
//           onClose={() => setShowModal(false)}
//           onProceed={async (amount, architectId) => {
//             if (selectedClient && amount && architectId) {
//               try {
//                 const newQuoteData = {
//                   leadId: selectedClient._id, // MongoDB _id
//                   quoteAmount: amount,
//                   status: "Send",
//                   city: "N/A",
//                   assigned: [architectId],
//                 };

//                 const savedQuote = await createQuote(newQuoteData);

//                 const formatted = {
//                   sno: leads.length + 1,
//                   qid: savedQuote.qid,
//                   id: savedQuote._id,
//                   name: selectedClient.name || "",
//                   leadId: selectedClient.id || "",
//                   leadIdMongo: savedQuote.leadId,
//                   budget: selectedClient.budget || "",
//                   contact: selectedClient.contact || "",
//                   quoteAmount: savedQuote.quoteAmount || "",
//                   city: savedQuote.city || "N/A",
//                   assigned:
//                     savedQuote.assigned?.map((a) => ({
//                       _id: a?._id,
//                       name: a?.name || "",
//                     })) || [],
//                   status: savedQuote.status || "",
//                 };

//                 setLeads((prev) => [...prev, formatted]);
//                 toast.success(`Quote added for ${selectedClient.name}`);
//                 setShowModal(false);
//                 setSelectedClient(null);
//               } catch (err) {
//                 toast.error("Failed to create quote");
//                 console.error(err);
//               }
//             }
//           }}
//         />
//       )}
//     </Layout>
//   );
// }

// export default Quote;
