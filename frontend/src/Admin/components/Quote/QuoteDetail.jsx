import React, { useState, useEffect } from "react";
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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "../Header";
import SideBar from "../SideBar";
import QuoteSummary from "./QuoteSummary";
import QuoteItemizedSection from "./QuoteOptimizedSection";
import Modal from "../Modal";
import AddSectionModal from "./AddSectionModal";
import {
  fetchQuotes,
  addSummaryToQuote,
  fetchQuoteSummary,
} from "../../../services/quoteServices";
import Button from "../../../components/Button";
import { getClientType } from "../../../services/userServices";

function QuoteDetail() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { qid, clientName, leadMongoId, quoteId } = location.state || {};
  const [activeSection, setActiveSection] = useState("Summary");

  // modals
  //eslint-disable-next-line
  const [showAddSpaceModal, setShowAddSpaceModal] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showImportTemplateModal, setShowImportTemplateModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);

  const [isHuelip, setIsHuelip] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);

  // summary state
  const [summary, setSummary] = useState([]);
  const [sections, setSections] = useState(["Summary"]); // dynamic

  // form state for Add Section
  // const [sectionForm, setSectionForm] = useState({
  //   space: "",
  //   workPackages: "",
  //   items: "",
  //   amount: "",
  //   tax: "",
  //   total: "",
  // });

  // const handleSectionChange = (e) => {
  //   const { name, value } = e.target;
  //   setSectionForm((prev) => ({ ...prev, [name]: value }));
  // };
  // const handleAddSection = () => {
  //   if (!sectionForm.space) {
  //     toast.error("Space name is required");
  //     return;
  //   }

  //   const newSection = { ...sectionForm };

  //   // Update summary locally
  //   setSummary((prev) => [...prev, newSection]);

  //   // Update sections list dynamically
  //   setSections((prev) => [...prev, sectionForm.space]);

  //   setShowAddSectionModal(false);

  //   // Reset form
  //   setSectionForm({
  //     space: "",
  //     workPackages: "",
  //     items: "",
  //     amount: "",
  //     tax: "",
  //   });
  // };

  // --- Fetch client type using leadMongoId ---
  useEffect(() => {
    const fetchClientTypeData = async () => {
      if (!leadMongoId) return;
      try {
        const data = await getClientType(leadMongoId);
        if (data) setIsHuelip(data.isHuelip);
      } catch (err) {
        console.error("Error fetching client type:", err);
        toast.error("Failed to fetch client type");
      }
    };
    fetchClientTypeData();
  }, [leadMongoId]);

  // --- Fetch templates when Import Modal opens ---
  useEffect(() => {
    if (showImportTemplateModal) {
      const loadQuotes = async () => {
        setLoadingQuotes(true);
        try {
          const data = await fetchQuotes();
          setQuotes(data);
        } catch (err) {
          console.error("Error fetching quotes:", err);
          toast.error("Failed to fetch quotes");
        } finally {
          setLoadingQuotes(false);
        }
      };
      loadQuotes();
    }
  }, [showImportTemplateModal]);

  // Fetch Quote Summary initially
  useEffect(() => {
    const loadSummary = async () => {
      try {
        if (!quoteId) {
          console.error("No quoteId passed from parent");
          return;
        }
        const data = await fetchQuoteSummary(quoteId);
        setSummary(Array.isArray(data) ? data : []);

        //  Dynamically build sections from spaces
        const dynamicSpaces = (Array.isArray(data) ? data : []).map(
          (s) => s.space
        );
        setSections(["Summary", ...dynamicSpaces]);
      } catch (err) {
        console.error("Error fetching summary:", err);
      }
    };

    loadSummary();
  }, [quoteId]);

  // --- Save Summary Handler ---
  const handleSaveSummary = async () => {
    if (!quoteId) {
      toast.error("No Quote ID found");
      return;
    }

    try {
      // Only take unsaved rows (no _id yet)
      const newSections = summary.filter((s) => !s._id);

      if (newSections.length === 0) {
        toast.info("No new sections to save");
        return;
      }

      console.log("Saving summary for:", quoteId, newSections);

      // Always send array to backend
      await addSummaryToQuote(
        quoteId,
        Array.isArray(newSections) ? newSections : [newSections]
      );

      // Re-fetch latest summary from backend
      const updated = await fetchQuoteSummary(quoteId);
      setSummary(Array.isArray(updated) ? updated : []);

      // Update dynamic sections properly
      const dynamicSpaces = (Array.isArray(updated) ? updated : []).map(
        (s) => s.space
      );
      setSections(["Summary", ...dynamicSpaces]);
      toast.success("Summary saved successfully");
    } catch (err) {
      console.error("Error saving summary:", err);
      toast.error("Failed to save summary");
    }
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

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden bg-gray-100">
        <Header
          title={`Quotations - QID: ${qid || "N/A"} - ${
            clientName || "Unknown Client"
          }`}
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Client Type */}
        <div className="bg-white px-4 py-1 border-b text-sm text-gray-700">
          <strong>Client Type:</strong>{" "}
          <span
            className={`font-semibold ${
              isHuelip ? "text-green-600" : "text-gray-500"
            }`}
          >
            {isHuelip ? "Huelip" : "Non-Huelip"}
          </span>
        </div>

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
          <span className="text-red-800 font-bold text-xl ml-2">»</span>

          {/* Action Buttons */}
          <div className="ml-auto flex space-x-2">
            <Button
              variant="custom"
              className="flex items-center gap-1 bg-red-700 text-white text-sm px-3 py-1 rounded-full"
              onClick={() => setShowAddSectionModal(true)}
            >
              <FaPlus className="text-xs" /> Add Section
            </Button>
            <Button
              variant="custom"
              className="flex items-center gap-1 bg-red-700 text-white text-sm px-3 py-1 rounded-full"
              onClick={() => setShowAddSpaceModal(true)}
            >
              <FaPlus className="text-xs" /> Add Space
            </Button>

            <Button
              variant="custom"
              className="bg-red-700 hover:bg-red-800 text-white text-sm px-3 py-1 rounded flex items-center gap-1"
              onClick={() => setShowImportTemplateModal(true)}
            >
              <FaFileImport /> Import Template
            </Button>
            <Button
              variant="custom"
              className="bg-red-700 hover:bg-red-800 text-white text-sm px-4 py-1 rounded flex items-center gap-1"
              onClick={() => setShowActionModal(true)}
            >
              Action
            </Button>
            <Button
              variant="custom"
              className="bg-green-700 hover:bg-green-800 text-white text-sm px-4 py-1 rounded flex items-center gap-1"
              onClick={handleSaveSummary}
            >
              <FaSave /> Save Summary
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {activeSection === "Summary" ? (
            <QuoteSummary
              activeSection="Summary"
              isHuelip={isHuelip}
              summary={summary}
              setSummary={setSummary}
              quoteId={quoteId}
            />
          ) : (
            <QuoteItemizedSection
              spaceRow={summary.find((s) => s.space === activeSection)}
              isHuelip={isHuelip}
              quoteId={quoteId}
              summaryId= {summary.find((s) =>s.space === activeSection)?._id}
            />
          )}
        </div>
      </div>

      {/* Add Space Modal */}
      <AddSectionModal
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        onAddSection={(newSection) => {
          setSummary((prev) => [...prev, newSection]);
          setSections((prev) => [...prev, newSection.space]);
        }}
      />

      {/* Import Template Modal */}
      <Modal
        isOpen={showImportTemplateModal}
        onClose={() => setShowImportTemplateModal(false)}
        title=""
        size="4xl"
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
                {loadingQuotes ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : quotes.length > 0 ? (
                  quotes.map((row, index) => (
                    <tr key={row._id} className="hover:bg-gray-100">
                      <td className="border px-2 py-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border px-2 py-2">
                        {row.leadId?.name || "-"}
                      </td>
                      <td className="border px-2 py-2">
                        {row.leadId?.id || "-"}
                      </td>
                      <td className="border px-2 py-2">
                        {row.leadId?.budget || "-"}
                      </td>
                      <td className="border px-2 py-2">
                        {row.leadId?.contact || "-"}
                      </td>
                      <td className="border px-2 py-2">
                        {row.quoteAmount || "-"}
                      </td>
                      <td className="border px-2 py-2">{row.city || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No quotes found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-center mt-4">
          <Button
            className="bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full"
            onClick={() => setShowImportTemplateModal(false)}
          >
            Add Item
          </Button>
        </div>
      </Modal>

      {/* Action Modal */}
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

// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import {
//   FaPlus,
//   FaFileImport,
//   FaEdit,
//   FaSave,
//   FaTrash,
//   FaDownload,
//   FaFileExcel,
// } from "react-icons/fa";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import Header from "../Header";
// import SideBar from "../SideBar";
// import QuoteSummary from "./QuoteSummary";
// import QuoteItemizedSection from "./QuoteOptimizedSection";
// import Modal from "../Modal";
// import {
//   fetchQuotes,
//   addSummaryToQuote,
//   fetchQuoteSummary,
// } from "../../../services/quoteServices";
// import Button from "../../../components/Button";
// import { getClientType } from "../../../services/leadServices";

// function QuoteDetail() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const location = useLocation();
//   const { qid, clientName, leadMongoId, quoteId } = location.state || {};
//   const [activeSection, setActiveSection] = useState("Summary");

//   // modals
//   const [showAddSpaceModal, setShowAddSpaceModal] = useState(false);
//   const [showAddSectionModal, setShowAddSectionModal] = useState(false);
//   const [showImportTemplateModal, setShowImportTemplateModal] = useState(false);
//   const [showActionModal, setShowActionModal] = useState(false);

//   const [isHuelip, setIsHuelip] = useState(false);
//   const [quotes, setQuotes] = useState([]);
//   const [loadingQuotes, setLoadingQuotes] = useState(false);

//   // summary state
//   const [summary, setSummary] = useState([]);
//   const [sections, setSections] = useState(["Summary"]); // dynamic

//   // form state for Add Section
//   const [sectionForm, setSectionForm] = useState({
//     space: "",
//     workPackages: "",
//     items: "",
//     amount: "",
//     tax: "",
//     total: "",
//   });

//   const handleSectionChange = (e) => {
//     const { name, value } = e.target;
//     setSectionForm((prev) => ({ ...prev, [name]: value }));
//   };
//   const handleAddSection = () => {
//     if (!sectionForm.space) {
//       toast.error("Space name is required");
//       return;
//     }

//     const newSection = { ...sectionForm };

//     // Update summary locally
//     setSummary((prev) => [...prev, newSection]);

//     // Update sections list dynamically
//     setSections((prev) => [...prev, sectionForm.space]);

//     setShowAddSectionModal(false);

//     // Reset form
//     setSectionForm({
//       space: "",
//       workPackages: "",
//       items: "",
//       amount: "",
//       tax: "",
//     });
//   };

//   // --- Fetch client type using leadMongoId ---
//   useEffect(() => {
//     const fetchClientTypeData = async () => {
//       if (!leadMongoId) return;
//       try {
//         const data = await getClientType(leadMongoId);
//         if (data) setIsHuelip(data.isHuelip);
//       } catch (err) {
//         console.error("Error fetching client type:", err);
//         toast.error("Failed to fetch client type");
//       }
//     };
//     fetchClientTypeData();
//   }, [leadMongoId]);

//   // --- Fetch templates when Import Modal opens ---
//   useEffect(() => {
//     if (showImportTemplateModal) {
//       const loadQuotes = async () => {
//         setLoadingQuotes(true);
//         try {
//           const data = await fetchQuotes();
//           setQuotes(data);
//         } catch (err) {
//           console.error("Error fetching quotes:", err);
//           toast.error("Failed to fetch quotes");
//         } finally {
//           setLoadingQuotes(false);
//         }
//       };
//       loadQuotes();
//     }
//   }, [showImportTemplateModal]);

//   // Fetch Quote Summary initially
//   useEffect(() => {
//     const loadSummary = async () => {
//       try {
//         if (!quoteId) {
//           console.error("No quoteId passed from parent");
//           return;
//         }
//         const data = await fetchQuoteSummary(quoteId);
//         setSummary(Array.isArray(data) ? data : []);

//         //  Dynamically build sections from spaces
//         const dynamicSpaces = (Array.isArray(data) ? data : []).map(
//           (s) => s.space
//         );
//         setSections(["Summary", ...dynamicSpaces]);
//       } catch (err) {
//         console.error("Error fetching summary:", err);
//       }
//     };

//     loadSummary();
//   }, [quoteId]);

//   // --- Save Summary Handler ---
//   const handleSaveSummary = async () => {
//     if (!quoteId) {
//       toast.error("No Quote ID found");
//       return;
//     }

//     try {
//       // Only take unsaved rows (no _id yet)
//       const newSections = summary.filter((s) => !s._id);

//       if (newSections.length === 0) {
//         toast.info("No new sections to save");
//         return;
//       }

//       console.log("Saving summary for:", quoteId, newSections);

//       // Always send array to backend
//       await addSummaryToQuote(
//         quoteId,
//         Array.isArray(newSections) ? newSections : [newSections]
//       );

//       // Re-fetch latest summary from backend
//       const updated = await fetchQuoteSummary(quoteId);
//       setSummary(Array.isArray(updated) ? updated : []);

//       // Update dynamic sections properly
//       const dynamicSpaces = (Array.isArray(updated) ? updated : []).map(
//         (s) => s.space
//       );
//       setSections(["Summary", ...dynamicSpaces]);

//       toast.success("Summary saved successfully");
//     } catch (err) {
//       console.error("Error saving summary:", err);
//       toast.error("Failed to save summary");
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

//       {/* Main Content */}
//       <div className="flex flex-col flex-1 overflow-hidden bg-gray-100">
//         <Header
//           title={`Quotations - QID: ${qid || "N/A"} - ${
//             clientName || "Unknown Client"
//           }`}
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />

//         {/* Client Type */}
//         <div className="bg-white px-4 py-1 border-b text-sm text-gray-700">
//           <strong>Client Type:</strong>{" "}
//           <span
//             className={`font-semibold ${
//               isHuelip ? "text-green-600" : "text-gray-500"
//             }`}
//           >
//             {isHuelip ? "Huelip" : "Non-Huelip"}
//           </span>
//         </div>

//         {/* Section Tabs */}
//         <div className="bg-white border-b shadow px-4 py-2 flex items-center overflow-x-auto whitespace-nowrap space-x-4">
//           {sections.map((section, index) => (
//             <React.Fragment key={section}>
//               <button
//                 onClick={() => setActiveSection(section)}
//                 className={`text-sm font-semibold ${
//                   activeSection === section
//                     ? "text-red-800 underline"
//                     : "text-gray-700"
//                 }`}
//               >
//                 {section}
//               </button>
//               {index < sections.length - 1 && (
//                 <span className="text-red-800">|</span>
//               )}
//             </React.Fragment>
//           ))}
//           <span className="text-red-800 font-bold text-xl ml-2">»</span>

//           {/* Action Buttons */}
//           <div className="ml-auto flex space-x-2">
//             <Button
//               variant="custom"
//               className="flex items-center gap-1 bg-red-700 text-white text-sm px-3 py-1 rounded-full"
//               onClick={() => setShowAddSectionModal(true)}
//             >
//               <FaPlus className="text-xs" /> Add Section
//             </Button>
//             <Button
//               variant="custom"
//               className="flex items-center gap-1 bg-red-700 text-white text-sm px-3 py-1 rounded-full"
//               onClick={() => setShowAddSpaceModal(true)}
//             >
//               <FaPlus className="text-xs" /> Add Space
//             </Button>

//             <Button
//               variant="custom"
//               className="bg-red-700 hover:bg-red-800 text-white text-sm px-3 py-1 rounded flex items-center gap-1"
//               onClick={() => setShowImportTemplateModal(true)}
//             >
//               <FaFileImport /> Import Template
//             </Button>
//             <Button
//               variant="custom"
//               className="bg-red-700 hover:bg-red-800 text-white text-sm px-4 py-1 rounded flex items-center gap-1"
//               onClick={() => setShowActionModal(true)}
//             >
//               Action
//             </Button>
//             <Button
//               variant="custom"
//               className="bg-green-700 hover:bg-green-800 text-white text-sm px-4 py-1 rounded flex items-center gap-1"
//               onClick={handleSaveSummary}
//             >
//               <FaSave /> Save Summary
//             </Button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-4 overflow-y-auto flex-1">
//           {activeSection === "Summary" ? (
//             <QuoteSummary
//               activeSection="Summary"
//               isHuelip={isHuelip}
//               summary={summary}
//               setSummary={setSummary}
//               quoteId={quoteId}
//             />
//           ) : (
//             <QuoteItemizedSection
//               spaceRow={summary.find((s) => s.space === activeSection)}
//               isHuelip={isHuelip}
//               quoteId={quoteId}
//             />
//           )}
//         </div>
//       </div>

//       {/* Add Space Modal */}
//       <Modal
//         isOpen={showAddSpaceModal}
//         onClose={() => setShowAddSpaceModal(false)}
//         title=""
//         size="sm"
//       >
//         <h2 className="text-lg font-extrabold text-center text-red-700 mb-2">
//           Add New Space
//         </h2>
//         <div className="border-2 border-black rounded-2xl px-4 py-3 space-y-4">
//           {[
//             "Bedroom",
//             "Living Room",
//             "Toilet",
//             "Pantry",
//             "Store",
//             "Balcony",
//           ].map((space) => (
//             <div key={space} className="flex justify-between items-center">
//               <label className="font-extrabold text-[16px]">{space}</label>
//               <input
//                 type="checkbox"
//                 className="w-5 h-5 border-2 border-black rounded-sm accent-red-700"
//               />
//             </div>
//           ))}
//           <div className="text-center">
//             <button
//               className="bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full"
//               onClick={() => setShowAddSpaceModal(false)}
//             >
//               Add Item
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* Add Section Modal */}
//       <Modal
//         isOpen={showAddSectionModal}
//         onClose={() => setShowAddSectionModal(false)}
//         title="Add Section"
//         size="md"
//       >
//         <form className="space-y-4">
//           {["space", "workPackages", "items", "amount", "tax"].map((field) => (
//             <div key={field}>
//               <label className="block font-semibold capitalize mb-1">
//                 {field}
//               </label>
//               <input
//                 type={
//                   field === "items" ||
//                   field === "amount" ||
//                   field === "tax" ||
//                   field === "total"
//                     ? "number"
//                     : "text"
//                 }
//                 name={field}
//                 value={sectionForm[field]}
//                 onChange={handleSectionChange}
//                 className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700"
//               />
//             </div>
//           ))}
//           <div className="flex justify-end space-x-2">
//             <Button
//               className="bg-gray-300 text-black px-4 py-1 rounded-full"
//               onClick={(e) => {
//                 e.preventDefault();
//                 setShowAddSectionModal(false);
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               className="bg-red-700 hover:bg-red-900 text-white px-4 py-1 rounded-full"
//               onClick={(e) => {
//                 e.preventDefault();
//                 handleAddSection();
//               }}
//             >
//               Save
//             </Button>
//           </div>
//         </form>
//       </Modal>

//       {/* Import Template Modal */}
//       <Modal
//         isOpen={showImportTemplateModal}
//         onClose={() => setShowImportTemplateModal(false)}
//         title=""
//         size="4xl"
//       >
//         <div className="text-lg font-extrabold text-red-700 text-center mb-3">
//           Import Template
//         </div>
//         <div className="px-4">
//           <div className="overflow-x-auto border border-gray-300 rounded-xl">
//             <table className="min-w-full text-sm text-left">
//               <thead className="bg-gray-100 text-gray-800 font-bold">
//                 <tr>
//                   <th className="border px-2 py-2 text-center">S.No</th>
//                   <th className="border px-2 py-2">Name</th>
//                   <th className="border px-2 py-2">Level ID</th>
//                   <th className="border px-2 py-2">Budget</th>
//                   <th className="border px-2 py-2">Contact No.</th>
//                   <th className="border px-2 py-2">Quote Amount</th>
//                   <th className="border px-2 py-2">City / Area</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loadingQuotes ? (
//                   <tr>
//                     <td colSpan="7" className="text-center py-4 text-gray-500">
//                       Loading...
//                     </td>
//                   </tr>
//                 ) : quotes.length > 0 ? (
//                   quotes.map((row, index) => (
//                     <tr key={row._id} className="hover:bg-gray-100">
//                       <td className="border px-2 py-2 text-center">
//                         {index + 1}
//                       </td>
//                       <td className="border px-2 py-2">
//                         {row.leadId?.name || "-"}
//                       </td>
//                       <td className="border px-2 py-2">
//                         {row.leadId?.id || "-"}
//                       </td>
//                       <td className="border px-2 py-2">
//                         {row.leadId?.budget || "-"}
//                       </td>
//                       <td className="border px-2 py-2">
//                         {row.leadId?.contact || "-"}
//                       </td>
//                       <td className="border px-2 py-2">
//                         {row.quoteAmount || "-"}
//                       </td>
//                       <td className="border px-2 py-2">{row.city || "-"}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="text-center py-4 text-gray-500">
//                       No quotes found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <div className="text-center mt-4">
//           <Button
//             className="bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full"
//             onClick={() => setShowImportTemplateModal(false)}
//           >
//             Add Item
//           </Button>
//         </div>
//       </Modal>

//       {/* Action Modal */}
//       <Modal
//         isOpen={showActionModal}
//         onClose={() => setShowActionModal(false)}
//         title=""
//         size="sm"
//       >
//         <h2 className="text-lg font-bold text-center text-red-700 mb-2">
//           Actions
//         </h2>
//         <div className="border border-black rounded-xl px-6 py-5 space-y-4 text-left">
//           {[
//             { label: "Edit", icon: <FaEdit className="text-black text-lg" /> },
//             { label: "Save", icon: <FaSave className="text-black text-lg" /> },
//             {
//               label: "Delete",
//               icon: <FaTrash className="text-black text-lg" />,
//             },
//             {
//               label: "Download",
//               icon: <FaDownload className="text-black text-lg" />,
//             },
//             {
//               label: "Export to Excel",
//               icon: <FaFileExcel className="text-black text-lg" />,
//             },
//           ].map((item, idx) => (
//             <div key={idx} className="flex items-center gap-4">
//               <span className="w-5">{item.icon}</span>
//               <span className="font-extrabold text-[15px]">{item.label}</span>
//             </div>
//           ))}
//         </div>
//       </Modal>
//     </div>
//   );
// }

// export default QuoteDetail;
