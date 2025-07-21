import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaPlus,
  FaFileImport,
  FaEdit,
  FaSave,
  FaTrash,
  FaDownload,
  FaFileExcel,
} from "react-icons/fa";

import Header from "../Header";
import SideBar from "../SideBar";
import QuoteSummary from "./QuoteSummary";
import QuoteItemizedSection from "./QuoteOptimizedSection";
import Modal from "../Modal";

const sections = [
  "Summary",
  "Design & Consultation",
  "Bedroom 1",
  "Master Bedroom",
  "Master Bedroom Toilet",
  "Living Room",
  "Kitchen",
  "Powder Washroom",
  "Store Room",
];

function QuoteDetail() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { qid, clientName } = location.state || {};
  const [activeSection, setActiveSection] = useState("Summary");
  const [showAddSpaceModal, setShowAddSpaceModal] = useState(false);
  const [showImportTemplateModal, setShowImportTemplateModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);

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

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden bg-gray-100">
        <Header
          title={`Quotations - QID: ${qid || "N/A"} - ${
            clientName || "Unknown Client"
          }`}
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Section Tabs */}
        <div className="bg-white border-b shadow px-4 py-2 flex items-center overflow-x-auto whitespace-nowrap space-x-4">
          {sections.map((section, index) => (
            <React.Fragment key={section}>
              <button
                onClick={() => setActiveSection(section)}
                className={`text-sm font-semibold ${
                  activeSection === section
                    ? "text-red-800 underline"
                    : "text-gray-700"
                }`}
              >
                {section}
              </button>
              {index < sections.length - 1 && (
                <span className="text-red-800">|</span>
              )}
            </React.Fragment>
          ))}
          <span className="text-red-800 font-bold text-xl ml-2">{`»`}</span>

          {/* Action Buttons */}
          <div className="ml-auto flex space-x-2">
            <button
              className="flex items-center gap-1 bg-red-700 text-white text-sm px-3 py-1 rounded-full"
              onClick={() => setShowAddSpaceModal(true)}
            >
              <FaPlus className="text-xs" /> Add
            </button>

            <button
              className="bg-red-700 hover:bg-red-800 text-white text-sm px-3 py-1 rounded flex items-center gap-1"
              onClick={() => setShowImportTemplateModal(true)}
            >
              <FaFileImport /> Import Template
            </button>
            <button
              className="bg-red-700 hover:bg-red-800 text-white text-sm px-4 py-1 rounded flex items-center gap-1"
              onClick={() => setShowActionModal(true)}
            >
              Action
            </button>
            {/* <button className="bg-red-700 hover:bg-red-800 text-white text-sm px-4 py-1 rounded flex items-center gap-1">
               Action
            </button> */}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {activeSection === "Summary" ? (
            <QuoteSummary activeSection="Summary" />
          ) : (
            <QuoteItemizedSection areaName={activeSection} />
          )}
        </div>
      </div>

      {/* Add Space Modal */}
      <Modal
        isOpen={showAddSpaceModal}
        onClose={() => setShowAddSpaceModal(false)}
        title=""
        size="sm"
      >
        <h2 className="text-lg font-extrabold text-center text-red-700 mb-2">
          Add New Space
        </h2>
        <div className="border-2 border-black rounded-2xl px-4 py-3 space-y-4">
          {[
            "Bedroom",
            "Living Room",
            "Toilet",
            "Pantry",
            "Store",
            "Balcony",
          ].map((space, idx) => (
            <div key={space} className="flex justify-between items-center">
              <label className="font-extrabold text-[16px]">{space}</label>
              <input
                type="checkbox"
                className="w-5 h-5 border-2 border-black rounded-sm accent-red-700"
              />
            </div>
          ))}

          <div className="text-center">
            <button
              className="bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full"
              onClick={() => setShowAddSpaceModal(false)}
            >
              Add Item
            </button>
          </div>
        </div>
      </Modal>

      {/* Import Template Modal */}
      <Modal
        isOpen={showImportTemplateModal}
        onClose={() => setShowImportTemplateModal(false)}
        title=""
        size="4xl"
        className="p-4"
      >
        <div className="text-lg font-extrabold text-red-700 text-center mb-3">
          Import Template
        </div>
        <div className="px-4">
          <div className="overflow-x-auto border border-gray-300 rounded-xl">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-800 font-bold">
                <tr>
                  <th className="border px-2 py-2 text-center">S.No</th>
                  <th className="border px-2 py-2">Name</th>
                  <th className="border px-2 py-2">Level ID</th>
                  <th className="border px-2 py-2">Budget</th>
                  <th className="border px-2 py-2">Contact No.</th>
                  <th className="border px-2 py-2">Quote Amount</th>
                  <th className="border px-2 py-2">City / Area</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "RAKHI KUMAR",
                    "L000556",
                    "₹1,00,000",
                    "+91-7000000000",
                    "DELHI / KAKALA",
                  ],
                  [
                    "RISHAB PANT",
                    "L000556",
                    "₹90,000",
                    "+91-7000000001",
                    "DELHI / RANI BAGH",
                  ],
                  [
                    "SANA MIRZ",
                    "L000556",
                    "₹1,20,000",
                    "+91-7000000002",
                    "DELHI / NARET",
                  ],
                  [
                    "RAJ KATOOR",
                    "L000556",
                    "₹85,000",
                    "+91-7000000003",
                    "JAIPUR / C SCHEME",
                  ],
                  [
                    "RAJESH MITTAL",
                    "L000556",
                    "₹70,000",
                    "+91-7000000004",
                    "RANCHI / KADRU",
                  ],
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border px-2 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border px-2 py-2">{row[0]}</td>
                    <td className="border px-2 py-2">{row[1]}</td>
                    <td className="border px-2 py-2">{row[2]}</td>
                    <td className="border px-2 py-2">{row[3]}</td>
                    <td className="border px-2 py-2">{row[2]}</td>
                    <td className="border px-2 py-2">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            className="bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full"
            onClick={() => setShowImportTemplateModal(false)}
          >
            Add Item
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title=""
        size="sm"
      >
        <h2 className="text-lg font-bold text-center text-red-700 mb-2">
          Actions
        </h2>
        <div className="border border-black rounded-xl px-6 py-5 space-y-4 text-left">
          {[
            { label: "Edit", icon: <FaEdit className="text-black text-lg" /> },
            { label: "Save", icon: <FaSave className="text-black text-lg" /> },
            {
              label: "Delete",
              icon: <FaTrash className="text-black text-lg" />,
            },
            {
              label: "Download",
              icon: <FaDownload className="text-black text-lg" />,
            },
            {
              label: "Export to Excel",
              icon: <FaFileExcel className="text-black text-lg" />,
            },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="w-5">{item.icon}</span>
              <span className="font-extrabold text-[15px]">{item.label}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default QuoteDetail;