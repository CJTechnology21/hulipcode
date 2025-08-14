import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaEdit,
  FaFacebook,
  FaGoogle,
  FaInstagram,
  FaPlus,
  FaTrash,
  FaFileDownload,
  FaEye,
} from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsFilter } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { downloadExpandedRowPDF } from "../../components/PDFExporter";
import { toast } from "react-toastify";
import { statusColorMap, categoryColorMap, tabs } from "./colorMaps";
import {
  fetchLeads,
  updateLead,
  deleteLead,
} from "../../../services/leadServices";
import Button from "../../../components/Button";
import RemainderModal from "./RemainderModal";
import UpdateLeadModal from "./UpdateLeadModal";
import LeadExpandableRow from "./LeadExpandableRow";
import Layout from "../../components/Layout";
import SearchBar from "../../../components/SearchBar";
import ClipLoader from "react-spinners/ClipLoader";
import { formatDateTime } from "../../../utils/dateFormatter";
export default function Leads() {
  const [activeTab, setActiveTab] = useState("All Leads");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    id: "",
    text: "",
    datetime: "",
  });
  const navigate = useNavigate();
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [editRowId, setEditRowId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [reminderModalId, setReminderModalId] = useState(null);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [filters, setFilters] = useState({});
  const [leadList, setLeadList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  //eslint-disable-next-line
  const [selectedLead, setSelectedLead] = useState(null);
  //eslint-disable-next-line
  const [menuOpen, setMenuOpen] = useState(false);

  const fieldMap = {
    1: "id",
    2: "name",
    3: "budget",
    4: "contact",
    5: "status",
    6: "category",
    7: "update",
    8: "assigned.name",
    9: "followUp",
    10: "source",
  };

  // Fetch leads from API
  useEffect(() => {
    const loadLeads = async () => {
      setLoading(true);
      try {
        const leads = await fetchLeads();
        setLeadList(leads);
        setError(null);
      } catch (err) {
        setError(err.message || "Error loading leads");
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, []);
  const filteredLeads = leadList.filter((lead) => {
    return Object.keys(filters).every((key) => {
      if (!filters[key]) return true;
      const fieldPath = fieldMap[key];
      if (!fieldPath) return true;
      const value = fieldPath
        .split(".")
        .reduce((obj, part) => obj?.[part], lead);
      return String(value || "")
        .toLowerCase()
        .includes(filters[key].toLowerCase());
    });
  });

  const toggleMenu = (leadId) => {
    setMenuOpenId((prev) => (prev === leadId ? null : leadId));
  };

  // const openMenu = (lead) => {
  //   setSelectedLead(lead);
  //   setMenuOpen(true);
  // };

  const closeMenu = () => {
    setMenuOpen(false);
    setSelectedLead(null);
  };

  const openModal = (leadId) => {
    setModalData({ id: leadId, text: "", datetime: "" });
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const getSourceIcon = (source) => {
    switch (source) {
      case "facebook":
        return <FaFacebook className="text-blue-600" />;
      case "instagram":
        return <FaInstagram className="text-pink-600" />;
      case "google":
        return <FaGoogle className="text-red-600" />;
      default:
        return <FaInstagram />;
    }
  };

  const toggleRow = (id) => {
    setExpandedRow((prevId) => (prevId === id ? null : id));
  };

  const handleDownloadPDF = async (leadId) => {
    try {
      await downloadExpandedRowPDF({
        elementId: `expandable-row-${leadId}`,
        filename: `Huelip_Report_${leadId}.pdf`,
      });
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Download failed", error);
      toast.error("Failed to download PDF. Please try again.");
    }
  };

  const handleEditChange = (e, field) => {
    setEditFormData({ ...editFormData, [field]: e.target.value });
  };
  const handleSave = async () => {
    try {
      await updateLead(editRowId, editFormData);

      setLeadList((prev) =>
        prev.map((lead) =>
          lead.id === editRowId ? { ...lead, ...editFormData } : lead
        )
      );

      toast.success("Lead updated successfully!");
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update lead.");
    }

    setEditRowId(null);
    setEditFormData({});
  };

  const handleCancel = () => {
    setEditRowId(null);
    setEditFormData({});
  };
  const handleDelete = async (id) => {
    try {
      await deleteLead(id);

      setLeadList((prev) => prev.filter((lead) => lead.id !== id));

      toast.success("Lead deleted successfully!");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete lead.");
    }

    closeMenu();
  };
  const openReminderModal = (id) => {
    const lead = leadList.find((l) => l.id === id);
    if (lead?.reminder) {
      setReminderDate(lead.reminder.date);
      setReminderTime(lead.reminder.time);
    } else {
      setReminderDate("");
      setReminderTime("");
    }
    setReminderModalId(id);
  };

  const handleReminderSave = () => {
    setReminderModalId(null);
    toast.success("Reminder saved successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };
  // Helper at the top of your file
  const getUpdate = (update) => {
    if (!update) return { text: "No updates yet", date: null, time: null };

    let upd = update;

    // If stored as string, parse it
    if (typeof update === "string") {
      try {
        upd = JSON.parse(update);
      } catch {
        upd = { text: update, date: null, time: null };
      }
    }

    return {
      text: upd.text || "No updates yet",
      date: upd.date || null,
      time: upd.time || null,
    };
  };

  return (
    <Layout title="Leads Manager">
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <div className="p-4 space-y-4">
          {/* Tabs */}
          <div className="bg-white p-4 rounded-xl shadow flex flex-wrap items-center gap-3">
            {tabs.map((tab) => (
              <Button
                key={tab.label}
                variant="custom"
                onClick={() => setActiveTab(tab.label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border font-medium ${
                  activeTab === tab.label
                    ? "bg-[#a00000] text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                {tab.label}
                <span className="bg-white text-black rounded-full px-2 py-0.5 text-sm">
                  {tab.count}
                </span>
              </Button>
            ))}
            <div className="ml-auto flex gap-2">
              <Button
                variant="custom"
                className="bg-[#a00000] text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                Leads Config
              </Button>
              <Button
                variant="custom"
                className="bg-[#a00000] text-white px-4 py-2 rounded-md flex items-center gap-2"
                onClick={() => navigate("/leadform")}
              >
                <FaPlus /> Add Leads
              </Button>
            </div>
          </div>

          {/* Loading & Error */}
          {loading && (
            <div className="p-4 text-center">
              <ClipLoader color="#ff0000" loading={loading} size={40} />
            </div>
          )}
          {error && <div className="p-4 text-center text-red-500">{error}</div>}

          {/* Table */}
          {!loading && !error && (
            <div className="overflow-x-auto p-2 bg-white rounded-xl shadow">
              <table className="w-full border-collapse mt-2 text-sm">
                <thead>
                  <tr className="text-left bg-gray-100">
                    {[
                      "S.no",
                      "Lead ID",
                      "Name",
                      "Budget",
                      "Contact no.",
                      "Status",
                      "Category",
                      "Last Update",
                      "Assigned to",
                      "Follow Up",
                      "Source",
                      "",
                    ].map((head, i) => (
                      <th
                        key={i}
                        className="px-3 py-2 font-bold whitespace-nowrap"
                      >
                        {head === "S.no" ? <BsFilter /> : head}
                      </th>
                    ))}
                  </tr>

                  {/* Filters Row */}
                  <tr className="bg-white">
                    {Array.from({ length: 12 }).map((_, idx) => (
                      <td key={idx} className="px-3 py-2">
                        {idx === 5 || idx === 6 ? (
                          <select
                            value={filters[idx] || ""}
                            onChange={(e) =>
                              setFilters({ ...filters, [idx]: e.target.value })
                            }
                            className={`w-full h-9 px-2 border rounded-lg text-xs ${
                              idx === 5
                                ? statusColorMap[filters[idx]] || "bg-gray-100"
                                : categoryColorMap[filters[idx]] ||
                                  "bg-gray-100"
                            }`}
                          >
                            <option value="">Select</option>
                            {idx === 5 &&
                              Object.keys(statusColorMap).map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            {idx === 6 &&
                              Object.keys(categoryColorMap).map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                          </select>
                        ) : idx === 10 || idx === 11 ? null : (
                          <SearchBar
                            value={filters[idx] || ""}
                            onChange={(e) =>
                              setFilters({ ...filters, [idx]: e.target.value })
                            }
                            placeholder="Search"
                            className="h-9 text-xs bg-gray-100"
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {filteredLeads.map((lead, index) => (
                    <React.Fragment key={lead.id}>
                      <tr className="border-b hover:bg-gray-50">
                        <td
                          onClick={() => toggleRow(lead.id)}
                          className="px-3 py-3"
                        >
                          {index + 1}
                        </td>
                        <td
                          onClick={() => toggleRow(lead.id)}
                          className="px-3 py-3"
                        >
                          {lead.id}
                        </td>
                        <td className="px-3 py-3">
                          {editRowId === lead.id ? (
                            <input
                              value={editFormData.name}
                              onChange={(e) => handleEditChange(e, "name")}
                              className="w-full p-2 border border-red-500 rounded-md bg-white text-sm"
                            />
                          ) : (
                            lead.name
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {editRowId === lead.id ? (
                            <input
                              value={editFormData.budget}
                              onChange={(e) => handleEditChange(e, "budget")}
                              className="w-full p-2 border border-red-500 rounded-md bg-white text-sm"
                            />
                          ) : (
                            lead.budget
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {editRowId === lead.id ? (
                            <input
                              value={editFormData.contact}
                              onChange={(e) => handleEditChange(e, "contact")}
                              className="w-full p-2 border border-red-500 rounded-md bg-white text-sm"
                            />
                          ) : (
                            lead.contact
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {editRowId === lead.id ? (
                            <select
                              value={editFormData.status}
                              onChange={(e) => handleEditChange(e, "status")}
                              className={`w-full p-2 border border-red-500 rounded-md text-sm ${
                                statusColorMap[editFormData.status] || ""
                              }`}
                            >
                              <option value="">Select status</option>
                              {Object.keys(statusColorMap).map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span
                              className={`inline-block max-w-[180px] px-2 py-1 rounded-full text-xs text-center truncate ${
                                statusColorMap[lead.status] || ""
                              }`}
                              title={lead.status}
                            >
                              {lead.status}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {editRowId === lead.id ? (
                            <select
                              value={editFormData.category}
                              onChange={(e) => handleEditChange(e, "category")}
                              className={`w-full p-2 border border-red-500 rounded-md text-sm ${
                                categoryColorMap[editFormData.category] || ""
                              }`}
                            >
                              <option value="">Select category</option>
                              {Object.keys(categoryColorMap).map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span
                              className={`inline-block max-w-[180px] px-2 py-1 rounded-full text-xs text-center truncate ${
                                categoryColorMap[lead.category] || ""
                              }`}
                            >
                              {lead.category}
                            </span>
                          )}
                        </td>
                        <td>
                          <div
                            onClick={() => openModal(lead.id)}
                            className="bg-white border px-3 py-2 rounded text-xs cursor-pointer hover:bg-gray-100"
                          >
                            {(() => {
                              const { text, date, time } = getUpdate(
                                lead.update
                              );
                              return (
                                <>
                                  <div className="mb-1">{text}</div>
                                  <div className="text-gray-400 text-[10px]">
                                    DATE:{" "}
                                    {formatDateTime(
                                      { date, time },
                                      lead.createdAt
                                    )}
                                    {lead.updatedAt && text !== "No updates yet"
                                      ? " (Updated)"
                                      : ""}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </td>
                        {/* assigned lead */}
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-6 h-6 text-xs rounded-full text-center font-bold flex items-center justify-center ${
                                lead.assigned?.color || "bg-gray-300"
                              }`}
                            >
                              {lead.assigned?.name
                                ? lead.assigned.name.charAt(0).toUpperCase()
                                : "?"}
                              {/* {lead.assigned?.initial || "?"} */}
                            </div>
                            <span>{lead.assigned?.name || "Unassigned"}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <Button
                            variant="custom"
                            onClick={() => openReminderModal(lead.id)}
                          >
                            <FaCalendarAlt className="text-gray-600 hover:text-red-600 transition text-2xl" />
                          </Button>
                        </td>
                        <td className="px-3 py-3">
                          {getSourceIcon(lead.source)}
                        </td>
                        <td className="px-3 py-3 relative">
                          {editRowId === lead.id ? (
                            <div className="flex gap-2">
                              <Button
                                variant="custom"
                                onClick={handleSave}
                                className="px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md"
                              >
                                Save
                              </Button>
                              <Button
                                variant="custom"
                                onClick={handleCancel}
                                className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md"
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="custom"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMenu(lead.id);
                              }}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <HiOutlineDotsVertical className="text-xl" />
                            </Button>
                          )}

                          {menuOpenId === lead.id && !editRowId && (
                            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50 text-sm">
                              <Button
                                variant="custom"
                                onClick={() => {
                                  navigate("/leadinfo", { state: { lead } });
                                  // onClose();
                                }}
                                className="flex items-center w-full px-3 py-2 hover:bg-blue-50 gap-2 text-sm text-blue-600"
                              >
                                <FaEye className="text-blue-500" />
                                <span>View</span>
                              </Button>
                              <Button
                                variant="custom"
                                onClick={() => {
                                  setEditFormData({ ...lead });
                                  setEditRowId(lead.id);
                                  closeMenu();
                                }}
                                className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2"
                              >
                                <FaEdit className="text-gray-500" />
                                <span>Edit</span>
                              </Button>
                              <Button
                                variant="custom"
                                onClick={() => handleDelete(lead.id)}
                                className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2 text-red-600"
                              >
                                <FaTrash />
                                <span>Delete</span>
                              </Button>
                              <Button
                                variant="custom"
                                onClick={() => {
                                  handleDownloadPDF(lead.id);
                                  closeMenu();
                                }}
                                className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2"
                              >
                                <FaFileDownload className="text-gray-500" />
                                Download PDF
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* Expanded Row */}
                      <LeadExpandableRow
                        lead={lead}
                        expandedRow={expandedRow}
                      />
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modals */}
        <UpdateLeadModal
          showModal={showModal}
          modalData={modalData}
          setModalData={setModalData}
          closeModal={closeModal}
          handleSave={() => closeModal()}
        />
        <RemainderModal
          reminderModalId={reminderModalId}
          leadsData={leadList}
          reminderDate={reminderDate}
          setReminderDate={setReminderDate}
          reminderTime={reminderTime}
          setReminderTime={setReminderTime}
          handleReminderSave={handleReminderSave}
          onClose={() => setReminderModalId(null)}
        />
      </div>
    </Layout>
  );
}

// import React, { useState } from "react";
// import {
//   FaCalendarAlt,
//   FaEdit,
//   FaFacebook,
//   FaGoogle,
//   FaInstagram,
//   FaPlus,
//   FaTrash,
//   FaFileDownload,
// } from "react-icons/fa";
// import { HiOutlineDotsVertical } from "react-icons/hi";
// import { BsFilter } from "react-icons/bs";
// import { useNavigate } from "react-router-dom";
// import { downloadExpandedRowPDF } from "../../components/PDFExporter";
// import { toast } from "react-toastify";
// import Button from "../../../components/Button";
// import RemainderModal from "./RemainderModal";
// import UpdateLeadModal from "./UpdateLeadModal";
// import LeadExpandableRow from "./LeadExpandableRow";
// import leadsData from "./leadsData";
// import Layout from "../../components/Layout";
// import SearchBar from "../../../components/SearchBar";

// // Tabs
// const tabs = [
//   { label: "All Leads", count: 5 },
//   { label: "Huelip Leads", count: 2 },
//   { label: "Facebook/ Instagram Leads", count: 1 },
//   { label: "Google Leads", count: 1 },
//   { label: "Self Leads", count: 1 },
// ];

// // Status color map
// const statusColorMap = {
//   "Not Assigned": "bg-gray-300 text-black",
//   "Assigned": "bg-blue-200 text-blue-800",
//   "Requirement Gathered": "bg-yellow-200 text-yellow-800",
//   "Estimate Shared": "bg-purple-200 text-purple-800",
//   "Visit Planned": "bg-green-200 text-green-800",
//   "Pending on Client Decision": "bg-orange-200 text-orange-800",
//   "On Hold": "bg-pink-200 text-pink-800",
//   "Not Interested": "bg-red-200 text-red-800",
//   "Quotation Approved": "bg-green-300 text-green-900",
// };

// // Category color map
// const categoryColorMap = {
//   Commercial: "bg-indigo-200 text-indigo-800",
//   Residential: "bg-teal-200 text-teal-800",
//   Industrial: "bg-yellow-300 text-yellow-900",
//   Retail: "bg-pink-300 text-pink-900",
// };

// export default function Leads() {
//   const [activeTab, setActiveTab] = useState("All Leads");
//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState({
//     id: "",
//     text: "",
//     datetime: "",
//   });
//   const navigate = useNavigate();
//   const [menuOpenId, setMenuOpenId] = useState(null);
//   const [expandedRow, setExpandedRow] = useState(null);
//   const [editRowId, setEditRowId] = useState(null);
//   const [editFormData, setEditFormData] = useState({});
//   const [reminderModalId, setReminderModalId] = useState(null);
//   const [reminderDate, setReminderDate] = useState("");
//   const [reminderTime, setReminderTime] = useState("");
//   const [filters, setFilters] = useState({});
//   const [leadList, setLeadList] = useState(leadsData);

//   const fieldMap = {
//     1: "id",
//     2: "name",
//     3: "budget",
//     4: "contact",
//     5: "status",
//     6: "category",
//     7: "update",
//     8: "assigned.name",
//     9: "followUp",
//     10: "source",
//   };

//   const filteredLeads = leadList.filter((lead) => {
//     return Object.keys(filters).every((key) => {
//       if (!filters[key]) return true;
//       const fieldPath = fieldMap[key];
//       if (!fieldPath) return true;
//       const value = fieldPath
//         .split(".")
//         .reduce((obj, part) => obj?.[part], lead);
//       return String(value || "")
//         .toLowerCase()
//         .includes(filters[key].toLowerCase());
//     });
//   });

//   const toggleMenu = (leadId) => {
//     setMenuOpenId((prev) => (prev === leadId ? null : leadId));
//   };
//   const closeMenu = () => setMenuOpenId(null);

//   const openModal = (leadId) => {
//     setModalData({ id: leadId, text: "", datetime: "" });
//     setShowModal(true);
//   };
//   const closeModal = () => setShowModal(false);

//   const getSourceIcon = (source) => {
//     switch (source) {
//       case "facebook":
//         return <FaFacebook className="text-blue-600" />;
//       case "instagram":
//         return <FaInstagram className="text-pink-600" />;
//       case "google":
//         return <FaGoogle className="text-red-600" />;
//       default:
//         return <FaInstagram />;
//     }
//   };

//   const toggleRow = (id) => {
//     setExpandedRow((prevId) => (prevId === id ? null : id));
//   };

//   const handleDownloadPDF = async (leadId) => {
//     try {
//       await downloadExpandedRowPDF({
//         elementId: `expandable-row-${leadId}`,
//         filename: `Huelip_Report_${leadId}.pdf`,
//       });
//       toast.success("PDF downloaded successfully!");
//     } catch (error) {
//       console.error("Download failed", error);
//       toast.error("Failed to download PDF. Please try again.");
//     }
//   };

//   const handleEditChange = (e, field) => {
//     setEditFormData({ ...editFormData, [field]: e.target.value });
//   };

//   const handleSave = () => {
//     setLeadList((prev) =>
//       prev.map((lead) =>
//         lead.id === editRowId ? { ...lead, ...editFormData } : lead
//       )
//     );
//     toast.success("Lead updated successfully!");
//     setEditRowId(null);
//     setEditFormData({});
//   };

//   const handleCancel = () => {
//     setEditRowId(null);
//     setEditFormData({});
//   };

//   const handleDelete = (id) => {
//     setLeadList((prev) => prev.filter((lead) => lead.id !== id));
//     toast.success("Lead deleted successfully!");
//     closeMenu();
//   };

//   const openReminderModal = (id) => {
//     const lead = leadList.find((l) => l.id === id);
//     if (lead?.reminder) {
//       setReminderDate(lead.reminder.date);
//       setReminderTime(lead.reminder.time);
//     } else {
//       setReminderDate("");
//       setReminderTime("");
//     }
//     setReminderModalId(id);
//   };

//   const handleReminderSave = () => {
//     setReminderModalId(null);
//     toast.success("Reminder saved successfully!", {
//       position: "top-right",
//       autoClose: 3000,
//     });
//   };

//   return (
//     <Layout title="Leads Manager">
//       <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
//         <div className="p-4 space-y-4">
//           {/* Tabs */}
//           <div className="bg-white p-4 rounded-xl shadow flex flex-wrap items-center gap-3">
//             {tabs.map((tab) => (
//               <Button
//                 key={tab.label}
//                 variant="custom"
//                 onClick={() => setActiveTab(tab.label)}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-full border font-medium ${
//                   activeTab === tab.label
//                     ? "bg-[#a00000] text-white"
//                     : "bg-gray-100 text-black"
//                 }`}
//               >
//                 {tab.label}
//                 <span className="bg-white text-black rounded-full px-2 py-0.5 text-sm">
//                   {tab.count}
//                 </span>
//               </Button>
//             ))}
//             <div className="ml-auto flex gap-2">
//               <Button
//                 variant="custom"
//                 className="bg-[#a00000] text-white px-4 py-2 rounded-md flex items-center gap-2"
//               >
//                 Leads Config
//               </Button>
//               <Button
//                 variant="custom"
//                 className="bg-[#a00000] text-white px-4 py-2 rounded-md flex items-center gap-2"
//                 onClick={() => navigate("/leadform")}
//               >
//                 <FaPlus /> Add Leads
//               </Button>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto p-2 bg-white rounded-xl shadow">
//             <table className="w-full border-collapse mt-2 text-sm">
//               <thead>
//                 <tr className="text-left bg-gray-100">
//                   {[
//                     "S.no",
//                     "Lead ID",
//                     "Name",
//                     "Budget",
//                     "Contact no.",
//                     "Status",
//                     "Category",
//                     "Last Update",
//                     "Assigned to",
//                     "Follow Up",
//                     "Source",
//                     "",
//                   ].map((head, i) => (
//                     <th
//                       key={i}
//                       className="px-3 py-2 font-bold whitespace-nowrap"
//                     >
//                       {head === "S.no" ? <BsFilter /> : head}
//                     </th>
//                   ))}
//                 </tr>

//                 {/* Filters Row */}
//                 <tr className="bg-white">
//                   {Array.from({ length: 12 }).map((_, idx) => (
//                     <td key={idx} className="px-3 py-2">
//                       {idx === 5 || idx === 6 ? (
//                         <select
//                           value={filters[idx] || ""}
//                           onChange={(e) =>
//                             setFilters({ ...filters, [idx]: e.target.value })
//                           }
//                           className={`w-full h-9 px-2 border rounded-lg text-xs ${
//                             idx === 5
//                               ? statusColorMap[filters[idx]] || "bg-gray-100"
//                               : categoryColorMap[filters[idx]] || "bg-gray-100"
//                           }`}
//                         >
//                           <option value="">Select</option>
//                           {idx === 5 &&
//                             Object.keys(statusColorMap).map((status) => (
//                               <option key={status} value={status}>
//                                 {status}
//                               </option>
//                             ))}
//                           {idx === 6 &&
//                             Object.keys(categoryColorMap).map((category) => (
//                               <option key={category} value={category}>
//                                 {category}
//                               </option>
//                             ))}
//                         </select>
//                       ) : idx === 10 || idx === 11 ? null : (
//                         <SearchBar
//                           value={filters[idx] || ""}
//                           onChange={(e) =>
//                             setFilters({ ...filters, [idx]: e.target.value })
//                           }
//                           placeholder="Search"
//                           className="h-9 text-xs bg-gray-100"
//                         />
//                       )}
//                     </td>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody className="text-sm">
//                 {filteredLeads.map((lead, index) => (
//                   <React.Fragment key={lead.id}>
//                     <tr className="border-b hover:bg-gray-50">
//                       <td
//                         onClick={() => toggleRow(lead.id)}
//                         className="px-3 py-3"
//                       >
//                         {index + 1}
//                       </td>
//                       <td
//                         onClick={() => toggleRow(lead.id)}
//                         className="px-3 py-3"
//                       >
//                         {lead.id}
//                       </td>
//                       <td className="px-3 py-3">
//                         {editRowId === lead.id ? (
//                           <input
//                             value={editFormData.name}
//                             onChange={(e) => handleEditChange(e, "name")}
//                             className="w-full p-2 border border-red-500 rounded-md bg-white text-sm"
//                           />
//                         ) : (
//                           lead.name
//                         )}
//                       </td>
//                       <td className="px-3 py-3">
//                         {editRowId === lead.id ? (
//                           <input
//                             value={editFormData.budget}
//                             onChange={(e) => handleEditChange(e, "budget")}
//                             className="w-full p-2 border border-red-500 rounded-md bg-white text-sm"
//                           />
//                         ) : (
//                           lead.budget
//                         )}
//                       </td>
//                       <td className="px-3 py-3">
//                         {editRowId === lead.id ? (
//                           <input
//                             value={editFormData.contact}
//                             onChange={(e) => handleEditChange(e, "contact")}
//                             className="w-full p-2 border border-red-500 rounded-md bg-white text-sm"
//                           />
//                         ) : (
//                           lead.contact
//                         )}
//                       </td>
//                       <td className="px-3 py-3">
//                         {editRowId === lead.id ? (
//                           <select
//                             value={editFormData.status}
//                             onChange={(e) => handleEditChange(e, "status")}
//                             className={`w-full p-2 border border-red-500 rounded-md text-sm ${
//                               statusColorMap[editFormData.status] || ""
//                             }`}
//                           >
//                             <option value="">Select status</option>
//                             {Object.keys(statusColorMap).map((status) => (
//                               <option key={status} value={status}>
//                                 {status}
//                               </option>
//                             ))}
//                           </select>
//                         ) : (
//                           <span
//                             className={`inline-block max-w-[180px] px-2 py-1 rounded-full text-xs text-center truncate ${
//                               statusColorMap[lead.status] || ""
//                             }`}
//                             title={lead.status}
//                           >
//                             {lead.status}
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-3 py-3">
//                         {editRowId === lead.id ? (
//                           <select
//                             value={editFormData.category}
//                             onChange={(e) => handleEditChange(e, "category")}
//                             className={`w-full p-2 border border-red-500 rounded-md text-sm ${
//                               categoryColorMap[editFormData.category] || ""
//                             }`}
//                           >
//                             <option value="">Select category</option>
//                             {Object.keys(categoryColorMap).map((category) => (
//                               <option key={category} value={category}>
//                                 {category}
//                               </option>
//                             ))}
//                           </select>
//                         ) : (
//                           <span
//                             className={`inline-block max-w-[180px] px-2 py-1 rounded-full text-xs text-center truncate ${
//                               categoryColorMap[lead.category] || ""
//                             }`}
//                           >
//                             {lead.category}
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-3 py-3">
//                         <div
//                           onClick={() => openModal(lead.id)}
//                           className="bg-white border px-2 py-1 rounded text-xs cursor-pointer hover:bg-gray-100"
//                         >
//                           {lead.update}
//                           <br />
//                           <span className="text-gray-400">
//                             DATE: 09/07/2025
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-3 py-3">
//                         <div className="flex items-center gap-2">
//                           <div
//                             className={`w-6 h-6 text-xs rounded-full text-center font-bold flex items-center justify-center ${lead.assigned.color}`}
//                           >
//                             {lead.assigned.initial}
//                           </div>
//                           <span>{lead.assigned.name}</span>
//                         </div>
//                       </td>
//                       <td className="px-3 py-3">
//                         <Button
//                           variant="custom"
//                           onClick={() => openReminderModal(lead.id)}
//                         >
//                           <FaCalendarAlt className="text-gray-600 hover:text-red-600 transition text-2xl" />
//                         </Button>
//                       </td>
//                       <td className="px-3 py-3">
//                         {getSourceIcon(lead.source)}
//                       </td>
//                       <td className="px-3 py-3 relative">
//                         {editRowId === lead.id ? (
//                           <div className="flex gap-2">
//                             <Button
//                               variant="custom"
//                               onClick={handleSave}
//                               className="px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md"
//                             >
//                               Save
//                             </Button>
//                             <Button
//                               variant="custom"
//                               onClick={handleCancel}
//                               className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md"
//                             >
//                               Cancel
//                             </Button>
//                           </div>
//                         ) : (
//                           <Button
//                             variant="custom"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               toggleMenu(lead.id);
//                             }}
//                             className="text-gray-600 hover:text-gray-800"
//                           >
//                             <HiOutlineDotsVertical className="text-xl" />
//                           </Button>
//                         )}

//                         {menuOpenId === lead.id && !editRowId && (
//                           <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50 text-sm">
//                             <Button
//                               variant="custom"
//                               onClick={() => {
//                                 setEditFormData({ ...lead });
//                                 setEditRowId(lead.id);
//                                 closeMenu();
//                               }}
//                               className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2"
//                             >
//                               <FaEdit className="text-gray-500" />
//                               <span>Edit</span>
//                             </Button>
//                             <Button
//                               variant="custom"
//                               onClick={() => handleDelete(lead.id)}
//                               className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2 text-red-600"
//                             >
//                               <FaTrash />
//                               <span>Delete</span>
//                             </Button>
//                             <Button
//                               variant="custom"
//                               onClick={() => {
//                                 handleDownloadPDF(lead.id);
//                                 closeMenu();
//                               }}
//                               className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2"
//                             >
//                               <FaFileDownload className="text-gray-500" />
//                               Download PDF
//                             </Button>
//                           </div>
//                         )}
//                       </td>
//                     </tr>

//                     {/* Expanded Row */}
//                     <LeadExpandableRow lead={lead} expandedRow={expandedRow} />
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Modals */}
//         <UpdateLeadModal
//           showModal={showModal}
//           modalData={modalData}
//           setModalData={setModalData}
//           closeModal={closeModal}
//           handleSave={() => closeModal()}
//         />
//         <RemainderModal
//           reminderModalId={reminderModalId}
//           leadsData={leadList}
//           reminderDate={reminderDate}
//           setReminderDate={setReminderDate}
//           reminderTime={reminderTime}
//           setReminderTime={setReminderTime}
//           handleReminderSave={handleReminderSave}
//           onClose={() => setReminderModalId(null)}
//         />
//       </div>
//     </Layout>
//   );
// }
