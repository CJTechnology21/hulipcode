import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaEdit,
  FaFacebook,
  FaGoogle,
  FaInstagram,
  FaPlus,
} from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsFilter } from "react-icons/bs";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useNavigate } from "react-router-dom";
import { downloadExpandedRowPDF } from "../../components/PDFExporter";
import { toast } from "react-toastify";

const tabs = [
  { label: "All Leads", count: 5 },
  { label: "Huelip Leads", count: 2 },
  { label: "Facebook/ Instagram Leads", count: 1 },
  { label: "Google Leads", count: 1 },
  { label: "Self Leads", count: 1 },
];

const leadsData = [
  {
    id: "L000565",
    name: "RAVI KUMAR",
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

export default function Leads() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All Leads");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    id: "",
    text: "",
    datetime: "",
  });
  const navigate = useNavigate();
  // menu modal
  const [menuOpenId, setMenuOpenId] = useState(null);

  const handleMenuClick = (leadId) => {
    setMenuOpenId((prev) => (prev === leadId ? null : leadId));
  };

  const closeMenu = () => setMenuOpenId(null);
  const openModal = (leadId) => {
    setModalData({ id: leadId, text: "", datetime: "" });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);
  //getting source icon
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

  //Expanding row
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (id) => {
    setExpandedRow((prevId) => (prevId === id ? null : id));
  };

  //Download Pdf
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

  //editing row
  const [editRowId, setEditRowId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const handleEditChange = (e, field) => {
    setEditFormData({ ...editFormData, [field]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // TODO: Replace with your real update logic
      // await api.updateLead(editFormData);

      toast.success("Lead updated successfully!");
      setEditRowId(null);
    } catch (error) {
      toast.error("Failed to update lead.");
    }
  };

  const handleCancel = () => {
    setEditRowId(null);
    setEditFormData({});
  };

  const [editedLead, setEditedLead] = useState({});
  //reminder modal states
  const [reminderModalId, setReminderModalId] = useState(null);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const openReminderModal = (id) => {
    const lead = leadsData.find((l) => l.id === id);
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
    const updated = leadsData.map((lead) => {
      if (lead.id === reminderModalId) {
        return {
          ...lead,
          reminder: {
            date: reminderDate,
            time: formatTo12Hour(reminderTime),
          },
        };
      }
      return lead;
    });

    // setLeadsData(updated);
    setReminderModalId(null);

    toast.success("Reminder saved successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };
  const formatTo12Hour = (time24) => {
    const [hour, minute] = time24.split(":");
    const h = parseInt(hour);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minute} ${suffix}`;
  };

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

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Leads Manager"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="p-4 space-y-4 ">
          {/* Tabs */}
          <div className="bg-white p-4 rounded-xl shadow flex flex-wrap items-center gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.label}
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
              </button>
            ))}

      
            <div className="ml-auto flex gap-2">
              <button className="bg-[#a00000] text-white px-4 py-2 rounded-md flex items-center gap-2">
                Leads Config
              </button>
              <button
                className="bg-[#a00000] text-white px-4 py-2 rounded-md flex items-center gap-2"
                onClick={() => navigate("/leadform")}
              >
                <FaPlus /> Add Leads
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto p-6 bg-white rounded-xl shadow ">
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
                  ].map((head, i) => (
                    <th
                      key={i}
                      className="px-3 py-2 font-bold whitespace-nowrap"
                    >
                      {head === "S.no" ? <BsFilter /> : head}
                    </th>
                  ))}
                </tr>
                {/* Search Row */}
                <tr className="text-xs bg-white">
                  {[...Array(11)].map((_, idx) => (
                    <td key={idx} className="px-3 py-1">
                      {idx === 5 || idx === 6 ? (
                        <select className="w-full p-2 border rounded-lg bg-gray-100 text-xs">
                          <option>Select</option>
                        </select>
                      ) : idx === 10 ? null : (
                        <input
                          className="w-full p-2 border rounded-lg bg-gray-100 text-xs mt-4"
                          placeholder="Search"
                        />
                      )}
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {leadsData.map((lead, index) => (
                  <React.Fragment key={lead.id}>
                    <tr
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      // onClick={() => toggleRow(lead.id)}
                    >
                      <td
                        className="px-3 py-3"
                        onClick={() => toggleRow(lead.id)}
                      >
                        {index + 1}
                      </td>
                      <td
                        className="px-3 py-3"
                        onClick={() => toggleRow(lead.id)}
                      >
                        {lead.id}
                      </td>
                      <td className="px-3 py-3">
                        {editRowId === lead.id ? (
                          <input
                            value={editFormData.name}
                            onChange={(e) => handleEditChange(e, "name")}
                            className="w-full p-2 border border-red-500 rounded-md bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
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
                            className="w-full p-2 border border-red-500 rounded-md bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        ) : (
                          lead.budget
                        )}
                      </td>

                      {/* <td className="px-3 py-3">{lead.budget}</td> */}
                      <td className="px-3 py-3">
                        {editRowId === lead.id ? (
                          <input
                            value={editFormData.contact}
                            onChange={(e) => handleEditChange(e, "contact")}
                            className="w-full p-2 border border-red-500 rounded-md bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        ) : (
                          lead.contact
                        )}
                      </td>

                      {/* <td className="px-3 py-3">{lead.contact}</td> */}
                      <td className="px-3 py-3">
                        {editRowId === lead.id ? (
                          <select
                            value={editedLead.status}
                            onChange={(e) =>
                              setEditedLead((prev) => ({
                                ...prev,
                                status: e.target.value,
                              }))
                            }
                            className="w-full p-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-sm"
                          >
                            <option value="">Select status</option>
                            <option value="Not Assigned">Not Assigned</option>
                            <option value="Assigned">Assigned</option>
                            <option value="Requirement Gathered ">
                              Requirement Gathered{" "}
                            </option>
                            <option value="Estimate Shared">
                              Estimate Shared
                            </option>
                            <option value="Visit Planned">Visit Planned</option>
                            <option value="Pending on Client Decision">
                              Pending on Client Decision
                            </option>
                            <option value="Visit Planned">on Hold</option>
                            <option value="Not Interested">
                              Not Interested
                            </option>
                            <option value="Quotation Approved">
                              Quotation Approved
                            </option>
                          </select>
                        ) : (
                          <span
                            className={`inline-block max-w-[180px] px-2 py-1 rounded-full text-xs text-center whitespace-nowrap truncate ${lead.statusColor}`}
                            title={lead.status}
                          >
                            {lead.status}
                          </span>
                        )}
                      </td>

                      {/* <td className="px-3 py-3">
                        <span
                          className={`inline-block max-w-[180px] px-2 py-1 rounded-full text-xs text-center whitespace-nowrap truncate ${lead.statusColor}`}
                          title={lead.status}
                        >
                          {lead.status}
                        </span>
                      </td> */}
                      <td className="px-3 py-3">
                        {editRowId === lead.id ? (
                          <select
                            value={editedLead.category}
                            onChange={(e) =>
                              setEditedLead((prev) => ({
                                ...prev,
                                category: e.target.value,
                              }))
                            }
                            className="w-full p-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-sm"
                          >
                            <option value="">Select category</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Residential">Residential</option>
                            <option value="Industrial">Industrial</option>
                            <option value="Retail">Retail</option>
                          </select>
                        ) : (
                          lead.category
                        )}
                      </td>

                      {/* <td className="px-3 py-3">{lead.category}</td> */}
                      <td className="px-3 py-3">
                        <td className="px-3 py-3">
                          <div
                            onClick={() => openModal(lead.id)}
                            className="bg-white border px-2 py-1 rounded text-xs whitespace-pre-line cursor-pointer hover:bg-gray-100 transition"
                          >
                            {lead.update}
                            <br />
                            <span className="text-gray-400">
                              DATE: 09/07/2025
                            </span>
                          </div>
                        </td>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 text-xs rounded-full text-center font-bold flex items-center justify-center ${lead.assigned.color}`}
                          >
                            {lead.assigned.initial}
                          </div>
                          <span>{lead.assigned.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="relative inline-block">
                          <button onClick={() => openReminderModal(lead.id)}>
                            {/* Larger calendar icon */}
                            <FaCalendarAlt className="text-gray-600 hover:text-red-600 transition text-2xl" />
                          </button>

                          {/* Positioned badge with better spacing */}
                          {lead.reminder && lead.reminder.date && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full z-10 shadow">
                              1
                            </span>
                          )}
                        </div>
                      </td>

                      {/* <td className="px-3 py-3 relative">
                        <button onClick={() => openReminderModal(lead.id)}>
                          <FaCalendarAlt className="text-gray-600 hover:text-red-600 transition text-lg" />
                          {lead.reminder && lead.reminder.date && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                              1
                            </span>
                          )}
                        </button>
                      </td> */}

                      {/* <td className="px-3 py-3">
                        <FaCalendarAlt className="text-gray-600" />
                      </td> */}
                      <td className="px-3 py-3">
                        {getSourceIcon(lead.source)}
                      </td>
                      <td className="px-3 py-3 relative">
                        {editRowId === lead.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={handleSave}
                              className="px-3 py-1 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="px-3 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuClick(lead.id);
                            }}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <HiOutlineDotsVertical className="text-xl" />
                          </button>
                        )}

                        {menuOpenId === lead.id && !editRowId && (
                          <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50 text-sm">
                            <button
                              onClick={() => {
                                closeMenu();
                                setEditRowId(lead.id); // <-- this sets the row into edit mode
                              }}
                              className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2"
                            >
                              <FaEdit className="text-gray-500 text-base" />
                              <span>Edit</span>
                            </button>
                            <button
                              className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2"
                              onClick={() => {
                                handleDownloadPDF(lead.id);
                                closeMenu();
                              }}
                            >
                              <FaFileDownload className="text-gray-500 text-base" />
                              Download PDF
                            </button>
                          </div>
                        )}
                      </td>

                      {/* <td className="px-3 py-3 relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // prevent global click handler if any
                            handleMenuClick(lead.id);
                          }}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <HiOutlineDotsVertical className="text-xl" />
                        </button>

                        {menuOpenId === lead.id && (
                          <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50 text-sm">
                            <button
                              onClick={() => {
                                closeMenu();
                                setEditRowId(lead.id);
                                setEditFormData({ ...lead }); // prefill form with current row data
                              }}
                              className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2"
                            >
                              <FaEdit className="text-gray-500 text-base" />
                              <span>Edit</span>
                            </button>

                            <button
                              className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2"
                              onClick={() => {
                                handleDownloadPDF(lead.id);
                                closeMenu();
                              }}
                            >
                              <FaFileDownload className="text-gray-500 text-base" />
                              Download PDF
                            </button>
                          </div>
                        )}
                      </td> */}
                    </tr>

                    {/* Expanded Row */}

                    {expandedRow === lead.id && (
                      <tr>
                        <td colSpan="12" className="bg-white p-4">
                          <div id={`expandable-row-${lead.id}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="text-sm font-semibold text-black">
                                <h2 className="bg-red-600 text-white px-3 py-1 rounded-full inline-block mb-3">
                                  Site Details
                                </h2>
                                <ul className="space-y-1">
                                  <li>
                                    <strong>Location</strong> : South Ex Part 2
                                    , Delhi
                                  </li>
                                  <li>
                                    <strong>Pincode</strong> : 110066
                                  </li>
                                  <li>
                                    <strong>Project Type</strong> : 1BHK Floor
                                  </li>
                                  <li>
                                    <strong>Project Floor</strong> : 3rd Floor
                                  </li>
                                  <li>
                                    <strong>Current Condition</strong> : Needs
                                    renovation , Pipes are all damaged ,
                                    Electrical Failures, Client feels Old
                                  </li>
                                  <li>
                                    <strong>Requirements</strong> : Old but new,
                                    kids room, fancy toilet, modular kitchen
                                  </li>
                                  <li>
                                    <strong>Duration of Project</strong> : 6
                                    months
                                  </li>
                                </ul>
                              </div>

                              <div className="space-y-6">
                                {[
                                  {
                                    name: "Bedroom 1",
                                    length: "15ft",
                                    breadth: "12ft",
                                    height: "9ft",
                                    images: [
                                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgLITjr8hsJKugu9L1AWXL6dNCivvJkyBBng&s",
                                      "https://www.bocadolobo.com/en/inspiration-and-ideas/wp-content/uploads/2023/09/Indulge-In-Opulence-50-Luxurious-Bedroom-Decor-Ideas-1-1024x788.jpg",
                                      "https://blog.displate.com/wp-content/uploads/2022/02/Aesthetic-Bedroom-Ideas_65.jpg",
                                    ],
                                  },
                                  {
                                    name: "Bedroom 2",
                                    length: "15ft",
                                    breadth: "12ft",
                                    height: "9ft",
                                    images: [
                                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgLITjr8hsJKugu9L1AWXL6dNCivvJkyBBng&s",
                                      "https://www.bocadolobo.com/en/inspiration-and-ideas/wp-content/uploads/2023/09/Indulge-In-Opulence-50-Luxurious-Bedroom-Decor-Ideas-1-1024x788.jpg",
                                      "https://blog.displate.com/wp-content/uploads/2022/02/Aesthetic-Bedroom-Ideas_65.jpg",
                                    ],
                                  },
                                  {
                                    name: "Toilet",
                                    length: "6ft",
                                    breadth: "8ft",
                                    height: "9ft",
                                    images: [
                                      "https://assets-news.housing.com/news/wp-content/uploads/2022/06/06030504/bidet-toilets-feature-compressed.jpg",
                                      "https://www.health.com/thmb/MnccL5eKVNvGuk5l32Gq9zcACqI=/723x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1052952224-08aeddea3bae4dce835bc3a48d14d676.jpg",
                                    ],
                                  },
                                ].map((room, i) => (
                                  <div key={i}>
                                    <h3 className="bg-red-700 text-white text-xs px-3 py-1 rounded-full inline-block mb-2">
                                      {room.name}
                                    </h3>

                                    <div className="flex justify-between text-xs font-bold text-black mb-2">
                                      <span>Length</span>
                                      <span>{room.length}</span>
                                      <span>Breadth</span>
                                      <span>{room.breadth}</span>
                                      <span>Height</span>
                                      <span>{room.height}</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                      {room.images.map((img, j) => (
                                        <img
                                          key={j}
                                          src={img}
                                          alt={`${room.name} ${j + 1}`}
                                          className="w-24 h-24 object-cover rounded-md border"
                                        />
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Update Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-xl">
              <h2 className="text-lg font-bold">
                Update Lead - {modalData.id}
              </h2>
              <textarea
                rows={4}
                className="w-full p-2 border rounded"
                placeholder="Enter update details"
                value={modalData.text}
                onChange={(e) =>
                  setModalData({ ...modalData, text: e.target.value })
                }
              />
              <input
                type="datetime-local"
                className="w-full p-2 border rounded"
                value={modalData.datetime}
                onChange={(e) =>
                  setModalData({ ...modalData, datetime: e.target.value })
                }
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={closeModal}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {/* remainder modal */}
        {reminderModalId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">Set Reminder</h2>

              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">Time</label>
                <input
                  type="time"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>

              {/* Past Notification Display */}
              <div className="text-xs text-gray-600 mb-4">
                {(() => {
                  const lead = leadsData.find((l) => l.id === reminderModalId);
                  if (lead?.reminder?.date) {
                    return (
                      <div className="bg-gray-100 p-2 rounded text-sm">
                        Existing Reminder:{" "}
                        <span className="font-medium text-black">
                          {lead.reminder.date} at {lead.reminder.time}
                        </span>
                      </div>
                    );
                  }
                  return "No previous reminder.";
                })()}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setReminderModalId(null)}
                  className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReminderSave}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* {reminderModalId && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Set Reminder</h3>

              <label className="block text-sm mb-2">Date</label>
              <input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />

              <label className="block text-sm mb-2">Time</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setReminderModalId(null)}
                  className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReminderSave}
                  className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}

// export default function Leads() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("All Leads");
//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState({
//     id: "",
//     text: "",
//     datetime: "",
//   });

//   const openModal = (leadId) => {
//     setModalData({ id: leadId, text: "", datetime: "" });
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//   };

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

//       {/* Overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main Content */}
//       <div className="flex flex-col flex-1 overflow-y-auto bg-white">
//         <Header
//           title="Leads Manager"
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />

//         <div className="p-4 space-y-4">
//           {/* Tabs */}
//           <div className="flex gap-3 flex-wrap">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.label}
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
//               </button>
//             ))}
//             <div className="ml-auto flex gap-2">
//               <button className="bg-[#a00000] text-white px-4 py-2 rounded-md flex items-center gap-2">
//                 Leads Config
//               </button>
//               <button className="bg-[#a00000] text-white px-4 py-2 rounded-md flex items-center gap-2">
//                 <FaPlus /> Add Leads
//               </button>
//             </div>
//           </div>

//           {/* Lead Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse mt-2">
//               <thead>
//                 <tr className="text-left bg-gray-100 text-sm">
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
//                   ].map((head, i) => (
//                     <th
//                       key={i}
//                       className="px-3 py-2 font-bold whitespace-nowrap"
//                     >
//                       {head === "S.no" ? <BsFilter /> : head}
//                     </th>
//                   ))}
//                 </tr>
//                 <tr className="text-xs bg-white">
//                   <td className="px-3 py-1"><FaFilter className="h-4 w-4" /></td>
//                   <td className="px-3 py-3">
//                     <input
//                       className="w-full p-2 border rounded-lg bg-gray-100"
//                       placeholder="Search"
//                     />
//                   </td>
//                   <td className="px-3 py-1">
//                     <input
//                       className="w-full p-2 border rounded-lg bg-gray-100"
//                       placeholder="Search"
//                     />
//                   </td>
//                   <td className="px-3 py-1">
//                     <select className="w-full p-2 border rounded-lg bg-gray-100">
//                       <option>Select</option>
//                     </select>
//                   </td>
//                   <td className="px-3 py-1">
//                     <input
//                       className="w-full p-2 border rounded-lg bg-gray-100"
//                       placeholder="Search"
//                     />
//                   </td>
//                   <td className="px-3 py-1">
//                     <select className="w-full p-2 border rounded-lg bg-gray-100">
//                       <option value="">Select</option>
//                       <option>Pending on Client Decision</option>
//                       <option>Requirement Gathered</option>
//                       <option>Assigned</option>
//                       <option>Not Interested</option>
//                     </select>
//                   </td>
//                   <td className="px-3 py-1">
//                     <select className="w-full p-2 border rounded-lg bg-gray-100">
//                       <option value="">Select</option>
//                       <option>RESIDENTIAL</option>
//                       <option>COMMERCIAL</option>
//                     </select>
//                   </td>
//                   <td className="px-3 py-1">
//                     <input
//                       className="w-full p-2 border rounded-lg bg-gray-100"
//                       placeholder="Search"
//                     />
//                   </td>
//                   <td className="px-3 py-1">
//                     <input
//                       className="w-full p-2 border rounded-lg bg-gray-100"
//                       placeholder="Search"
//                     />
//                   </td>
//                   <td className="px-3 py-1">
//                     <input
//                       className="w-full p-2 border rounded-lg bg-gray-100"
//                       placeholder="Search"
//                     />
//                   </td>
//                   <td className="px-3 py-1"></td>
//                 </tr>
//               </thead>

//               <tbody className="text-sm">
//                 {leadsData.map((lead, index) => (
//                   <tr key={lead.id} className="border-b hover:bg-gray-50">
//                     <td className="px-3 py-3">{index + 1}</td>
//                     <td className="px-3 py-3">{lead.id}</td>
//                     <td className="px-3 py-3">{lead.name}</td>
//                     <td className="px-3 py-3">{lead.budget}</td>
//                     <td className="px-3 py-3">{lead.contact}</td>
//                     <td className="px-3 py-3">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs ${lead.statusColor}`}
//                       >
//                         {lead.status}
//                       </span>
//                     </td>
//                     <td className="px-3 py-3">{lead.category}</td>
//                     <td
//                       className="px-3 py-3 cursor-pointer"
//                       onClick={() => openModal(lead.id)}
//                     >
//                       <div className="bg-white border px-2 py-1 rounded text-xs whitespace-pre-line hover:bg-gray-100">
//                         {lead.update}
//                         <br />
//                         <span className="text-gray-400">DATE: 09/07/2025</span>
//                       </div>
//                     </td>

//                     <td className="px-3 py-3">
//                       <div className={`flex items-center gap-2`}>
//                         <div
//                           className={`w-6 h-6 text-xs rounded-full text-center font-bold flex items-center justify-center ${lead.assigned.color}`}
//                         >
//                           {lead.assigned.initial}
//                         </div>
//                         <span>{lead.assigned.name}</span>
//                       </div>
//                     </td>
//                     <td className="px-3 py-3">
//                       {lead.followup && (
//                         <FaCalendar className="text-gray-600 h-6 w-6" />
//                       )}
//                     </td>
//                     <td className="px-3 py-3">{getSourceIcon(lead.source)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         {showModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//             <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-xl">
//               <h2 className="text-lg font-bold">
//                 Update Lead - {modalData.id}
//               </h2>
//               <textarea
//                 rows={4}
//                 className="w-full p-2 border rounded"
//                 placeholder="Enter update details"
//                 value={modalData.text}
//                 onChange={(e) =>
//                   setModalData({ ...modalData, text: e.target.value })
//                 }
//               />
//               <input
//                 type="datetime-local"
//                 className="w-full p-2 border rounded"
//                 value={modalData.datetime}
//                 onChange={(e) =>
//                   setModalData({ ...modalData, datetime: e.target.value })
//                 }
//               />
//               <div className="flex justify-end gap-2">
//                 <button
//                   className="px-4 py-2 bg-gray-300 rounded"
//                   onClick={closeModal}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="px-4 py-2 bg-blue-600 text-white rounded"
//                   onClick={() => {
//                     // Save logic here
//                     closeModal();
//                   }}
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// import { useState } from "react";

// import Header from "../../components/Header";
// import {
//   FaAddressCard,
//   FaClipboardList,
//   FaLightbulb,
//   FaFileAlt,
//   FaMoneyBillWave,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import SideBar from "../../components/SideBar";

// function Leads() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const navigate = useNavigate();

//   const leadModules = [
//     {
//       title: "Basic Details",
//       subtitle: "Manage contact details etc.",
//       icon: <FaAddressCard className="text-3xl" />,
//       path: "/leads/leaddetails",
//     },
//     {
//       title: "Quotations & Site Details",
//       subtitle: "Generate BoQs and Capture Site Details",
//       icon: <FaClipboardList className="text-3xl" />,
//       path: "/quote",
//     },
//     {
//       title: "Inspirations",
//       subtitle: "View Images Liked by Client",
//       icon: <FaLightbulb className="text-3xl" />,
//       path: "/leads/inspirations",
//     },
//     {
//       title: "Designs & Documents",
//       subtitle: "Store All Your Artefacts",
//       icon: <FaFileAlt className="text-3xl" />,
//       path: "/leads/documents",
//     },
//     {
//       title: "Financial Planning",
//       subtitle: "Manage your cashflow",
//       icon: <FaMoneyBillWave className="text-3xl" />,
//       path: "/project/finance",
//     },
//   ];

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

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main content */}
//       <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
//         <Header
//           title="Lead Manager"
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />

//         <div className="p-6 space-y-6">
//           {/* Top Info (optional buttons can go here) */}
//           <div className="flex items-center justify-end flex-wrap gap-4">
//             {/* Example button (optional) */}
//             {/* <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm shadow">Export</button> */}
//           </div>

//           {/* Lead Module Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {leadModules.map((mod, idx) => (
//               <div
//                 key={idx}
//                 onClick={() => navigate(mod.path)}
//                 className="cursor-pointer bg-white border border-blue-200 hover:shadow-md transition-all rounded-xl p-5 flex flex-col items-center text-center hover:border-blue-400"
//               >
//                 <div className="text-blue-500 mb-3">{mod.icon}</div>
//                 <h3 className="font-semibold text-gray-800">{mod.title}</h3>
//                 <p className="text-xs text-gray-500 mt-1">{mod.subtitle}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Leads;
