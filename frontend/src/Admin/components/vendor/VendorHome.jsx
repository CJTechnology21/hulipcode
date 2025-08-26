import React, { useState, useMemo, useEffect } from "react";
import { Tab } from "@headlessui/react";
import Layout from "../Layout";
import { FiClipboard, FiPlus, FiCalendar } from "react-icons/fi";

// Components
import SummaryCards from "./SummaryCards";
import POTable from "./POTable";
import PODetailsDrawer from "./PODetailsDrawer";
import AddVendorModal from "./AddVendorModal";
import CalendarModal from "./CalendarModal";
import DetailListModal from "./DetailListModal";
import AddPOModal from "./AddPOModal";
import ReturnItemsModal from "./ReturnedItemsModal";

// Services
import { fetchVendors, fetchArchandClients } from "../../../services/leadServices";
import { fetchProjects } from "../../../services/projectServices";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function VendorHome() {
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPODetailsOpen, setIsPODetailsOpen] = useState(false);
  const [isDetailListOpen, setIsDetailListOpen] = useState(false);
  const [isAddPOOpen, setIsAddPOOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  const [selectedPO, setSelectedPO] = useState(null);
  const [detailListData, setDetailListData] = useState({ title: "", data: [] });

  const [vendorName, setVendorName] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Pending");

  const [vendors, setVendors] = useState([]);
  const [projects, setProjects] = useState([]);
  const [archClients, setArchClients] = useState([]);

  const [purchaseOrders, setPurchaseOrders] = useState([]); 
  const [activeTab, setActiveTab] = useState("All POs");

  // Fetch dropdown data once
  useEffect(() => {
    const loadData = async () => {
      try {
        const [vData, pData, acData] = await Promise.all([
          fetchVendors(),
          fetchProjects(),
          fetchArchandClients(),
        ]);

        setVendors(vData?.map((v) => ({ label: v.name, value: v._id })) || []);
        setProjects(pData?.map((p) => ({ label: p.name, value: p._id })) || []);
        setArchClients(acData?.map((ac) => ({ label: ac.name, value: ac._id })) || []);
      } catch (err) {
        console.error("Failed to fetch dropdown data:", err);
      }
    };
    loadData();
  }, []);

  // Summary cards calculations
  const summary = useMemo(() => {
    const totalPO = purchaseOrders.reduce((sum, po) => sum + (po.amount || 0), 0);
    const paymentsDone = purchaseOrders
      .filter((po) => po.status === "Paid")
      .reduce((sum, po) => sum + (po.amount || 0), 0);
    const paymentsPending = totalPO - paymentsDone;
    const totalVendors = new Set(purchaseOrders.map((po) => po.vendor)).size;
    const pendingCount = purchaseOrders.filter((po) => po.status === "Pending").length;
    return { totalPO, paymentsDone, paymentsPending, totalVendors, pendingCount };
  }, [purchaseOrders]);

  // Add Vendor PO
  const handleAddVendor = () => {
    if (!vendorName || !amount) return;
    const newPO = {
      _id: Date.now().toString(), // temp unique id
      project: null,
      orderedBy: null,
      vendor: vendorName,
      amount: parseFloat(amount),
      date: new Date().toISOString().split("T")[0],
      status,
      paymentTerms: "Net 30",
      deliveryDate: "TBD",
      notes: "",
      items: [],
      returns: [],
    };
    setPurchaseOrders((prev) => [...prev, newPO]);
    setIsAddVendorOpen(false);
    setVendorName("");
    setAmount("");
    setStatus("Pending");
  };

  // Add new PO
  const handleAddPO = (poData) => {
    const newPO = {
      _id: Date.now().toString(), // temp id until backend assigns one
      ...poData,
      returns: [],
    };
    setPurchaseOrders((prev) => [...prev, newPO]);
  };

  // Update PO status from dropdown
  const handleStatusUpdate = (_id, newStatus) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po._id === _id ? { ...po, status: newStatus } : po))
    );
  };

  // Handle Edit PO
  const handleEditPO = (po) => {
    setSelectedPO(po);
    setIsAddPOOpen(true);
  };

  // Handle Delete PO
  const handleDeletePO = (_id) => {
    setPurchaseOrders((prev) => prev.filter((po) => po._id !== _id));
  };

  const handleCardClick = (title, filterFn) => {
    setDetailListData({
      title,
      data: purchaseOrders.filter(filterFn),
    });
    setIsDetailListOpen(true);
  };

  const handleUpdatePO = (updatedPO) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po._id === updatedPO._id ? updatedPO : po))
    );
    setSelectedPO(updatedPO);
  };

  const handleManageReturns = (po) => {
    setSelectedPO(po);
    setIsPODetailsOpen(false);
    setTimeout(() => setIsReturnModalOpen(true), 200);
  };

  // Tab filters
  const tabFilters = {
    "All POs": (po) => true,
    "Payments Done": (po) => po.status === "Paid",
    "Payments Pending": (po) => po.status === "Pending",
    "Orders to Delivery": (po) => po.status === "Pending",
  };

  // Filtered POs for table
  const filteredPOs =
    activeTab in tabFilters
      ? purchaseOrders.filter(tabFilters[activeTab])
      : purchaseOrders;

  return (
    <Layout>
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <FiClipboard className="text-red-500" /> Vendor Management
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition text-sm sm:text-base"
            >
              <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5" /> Deliveries
            </button>
            <button
              onClick={() => setIsAddVendorOpen(true)}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition text-sm sm:text-base"
            >
              <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" /> Add Vendor
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCards summary={summary} onCardClick={handleCardClick} />

        {/* Tabs */}
        <Tab.Group
          onChange={(index) =>
            setActiveTab(Object.keys(tabFilters)[index] || "Pending Orders")
          }
        >
          <Tab.List className="flex flex-wrap sm:flex-nowrap space-x-0 sm:space-x-2 bg-white p-1 rounded-xl shadow mb-4">
            {Object.keys(tabFilters).map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  classNames(
                    "flex-1 rounded-lg py-2 text-xs sm:text-sm font-medium",
                    selected ? "bg-red-500 text-white shadow" : "text-black hover:bg-red-100"
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            {Object.keys(tabFilters).map((tab) => (
              <Tab.Panel key={tab}>
                {tab === "All POs" && (
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => {
                        setSelectedPO(null); // ensure fresh add
                        setIsAddPOOpen(true);
                      }}
                      className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition text-sm sm:text-base"
                    >
                      <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" /> Add PO
                    </button>
                  </div>
                )}
                <POTable
                  purchaseOrders={filteredPOs || []}
                  projects={projects || []}
                  vendors={vendors || []}
                  archClients={archClients || []}
                  onRowClick={handleEditPO}
                  onEdit={handleEditPO}
                  onDelete={handleDeletePO}
                  onstatusUpdate={handleStatusUpdate}
                />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>

        {/* Modals / Drawers */}
        <PODetailsDrawer
          isOpen={isPODetailsOpen}
          onClose={() => setIsPODetailsOpen(false)}
          selectedPO={selectedPO}
          onManageReturns={handleManageReturns}
        />

        <AddVendorModal
          isOpen={isAddVendorOpen}
          onClose={() => setIsAddVendorOpen(false)}
          vendorName={vendorName}
          setVendorName={setVendorName}
          amount={amount}
          setAmount={setAmount}
          status={status}
          setStatus={setStatus}
          handleAddVendor={handleAddVendor}
        />

        <CalendarModal
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          purchaseOrders={purchaseOrders}
        />

        <DetailListModal
          isOpen={isDetailListOpen}
          onClose={() => setIsDetailListOpen(false)}
          title={detailListData.title}
          data={detailListData.data}
        />

        <AddPOModal
          isOpen={isAddPOOpen}
          onClose={() => {
            setIsAddPOOpen(false);
            setSelectedPO(null);
          }}
          onAddPO={handleAddPO}
          onUpdatePO={handleUpdatePO}
          mode={selectedPO ? "edit" : "add"}
          initialData={selectedPO}
        />

        <ReturnItemsModal
          isOpen={isReturnModalOpen}
          onClose={() => setIsReturnModalOpen(false)}
          po={selectedPO}
          onUpdate={handleUpdatePO}
        />
      </div>
    </Layout>
  );
}

// import React, { useState, useMemo, useEffect } from "react";
// import { Tab } from "@headlessui/react";
// import Layout from "../Layout";
// import { FiClipboard, FiPlus, FiCalendar } from "react-icons/fi";

// // Components
// import SummaryCards from "./SummaryCards";
// import POTable from "./POTable";
// import PODetailsDrawer from "./PODetailsDrawer";
// import AddVendorModal from "./AddVendorModal";
// import CalendarModal from "./CalendarModal";
// import DetailListModal from "./DetailListModal";
// import AddPOModal from "./AddPOModal";
// import ReturnItemsModal from "./ReturnedItemsModal";

// // Services
// import { fetchVendors, fetchArchandClients } from "../../../services/leadServices";
// import { fetchProjects } from "../../../services/projectServices";

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// export default function VendorHome() {
//   const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const [isPODetailsOpen, setIsPODetailsOpen] = useState(false);
//   const [isDetailListOpen, setIsDetailListOpen] = useState(false);
//   const [isAddPOOpen, setIsAddPOOpen] = useState(false);
//   const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

//   const [selectedPO, setSelectedPO] = useState(null);
//   const [detailListData, setDetailListData] = useState({ title: "", data: [] });

//   const [vendorName, setVendorName] = useState("");
//   const [amount, setAmount] = useState("");
//   const [status, setStatus] = useState("Pending");

//   const [vendors, setVendors] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [archClients, setArchClients] = useState([]);

//   const [purchaseOrders, setPurchaseOrders] = useState([]); 
//   const [activeTab, setActiveTab] = useState("All POs");

//   // Fetch dropdown data once
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [vData, pData, acData] = await Promise.all([
//           fetchVendors(),
//           fetchProjects(),
//           fetchArchandClients(),
//         ]);

//         setVendors(vData?.map((v) => ({ label: v.name, value: v._id })) || []);
//         setProjects(pData?.map((p) => ({ label: p.name, value: p._id })) || []);
//         setArchClients(acData?.map((ac) => ({ label: ac.name, value: ac._id })) || []);
//       } catch (err) {
//         console.error("Failed to fetch dropdown data:", err);
//       }
//     };
//     loadData();
//   }, []);

//   // Summary cards calculations
//   const summary = useMemo(() => {
//     const totalPO = purchaseOrders.reduce((sum, po) => sum + po.amount, 0);
//     const paymentsDone = purchaseOrders
//       .filter((po) => po.status === "Paid")
//       .reduce((sum, po) => sum + po.amount, 0);
//     const paymentsPending = totalPO - paymentsDone;
//     const totalVendors = new Set(purchaseOrders.map((po) => po.vendor)).size;
//     const pendingCount = purchaseOrders.filter((po) => po.status === "Pending").length;
//     return { totalPO, paymentsDone, paymentsPending, totalVendors, pendingCount };
//   }, [purchaseOrders]);

//   // Add Vendor PO
//   const handleAddVendor = () => {
//     if (!vendorName || !amount) return;
//     const newPO = {
//       id: purchaseOrders.length + 1,
//       project: null,
//       orderedBy: null,
//       vendor: vendorName,
//       amount: parseFloat(amount),
//       date: new Date().toISOString().split("T")[0],
//       status,
//       paymentTerms: "Net 30",
//       deliveryDate: "TBD",
//       notes: "",
//       items: [],
//       returns: [],
//     };
//     setPurchaseOrders((prev) => [...prev, newPO]);
//     setIsAddVendorOpen(false);
//     setVendorName("");
//     setAmount("");
//     setStatus("Pending");
//   };

//   // Add new PO
//   const handleAddPO = (poData) => {
//     const newPO = {
//       id: purchaseOrders.length + 1,
//       ...poData,
//       returns: [],
//     };
//     setPurchaseOrders((prev) => [...prev, newPO]);
//   };

//   // Update PO status from dropdown
//   const handleStatusUpdate = (id, newStatus) => {
//     setPurchaseOrders((prev) =>
//       prev.map((po) => (po.id === id ? { ...po, status: newStatus } : po))
//     );
//   };

//   // Handle Edit PO
//   const handleEditPO = (po) => {
//     setSelectedPO(po);
//     setIsAddPOOpen(true);
//   };

//   // Handle Delete PO
//   const handleDeletePO = (id) => {
//     setPurchaseOrders((prev) => prev.filter((po) => po.id !== id));
//   };

//   const handleCardClick = (title, filterFn) => {
//     setDetailListData({
//       title,
//       data: purchaseOrders.filter(filterFn),
//     });
//     setIsDetailListOpen(true);
//   };

//   const handleUpdatePO = (updatedPO) => {
//     setPurchaseOrders((prev) =>
//       prev.map((po) => (po.id === updatedPO.id ? updatedPO : po))
//     );
//     setSelectedPO(updatedPO);
//   };

//   const handleManageReturns = (po) => {
//     setSelectedPO(po);
//     setIsPODetailsOpen(false);
//     setTimeout(() => setIsReturnModalOpen(true), 200);
//   };

//   // Tab filters
//   const tabFilters = {
//     "All POs": (po) => true,
//     "Payments Done": (po) => po.status === "Paid",
//     "Payments Pending": (po) => po.status === "Pending",
//     "Orders to Delivery":(po) => po.status === "Pending",
//   };

//   // Filtered POs for table
//   const filteredPOs =
//     activeTab in tabFilters
//       ? purchaseOrders.filter(tabFilters[activeTab])
//       : purchaseOrders;

//   return (
//     <Layout>
//       <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
//         {/* Top Bar */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
//           <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
//             <FiClipboard className="text-red-500" /> Vendor Management
//           </h1>
//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => setIsCalendarOpen(true)}
//               className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition text-sm sm:text-base"
//             >
//               <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5" /> Deliveries
//             </button>
//             <button
//               onClick={() => setIsAddVendorOpen(true)}
//               className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition text-sm sm:text-base"
//             >
//               <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" /> Add Vendor
//             </button>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <SummaryCards summary={summary} onCardClick={handleCardClick} />

//         {/* Tabs */}
//         <Tab.Group
//           onChange={(index) =>
//             setActiveTab(Object.keys(tabFilters)[index] || "Pending Orders")
//           }
//         >
//           <Tab.List className="flex flex-wrap sm:flex-nowrap space-x-0 sm:space-x-2 bg-white p-1 rounded-xl shadow mb-4">
//             {Object.keys(tabFilters).map((tab) => (
//               <Tab
//                 key={tab}
//                 className={({ selected }) =>
//                   classNames(
//                     "flex-1 rounded-lg py-2 text-xs sm:text-sm font-medium",
//                     selected ? "bg-red-500 text-white shadow" : "text-black hover:bg-red-100"
//                   )
//                 }
//               >
//                 {tab}
//               </Tab>
//             ))}
//           </Tab.List>

//           <Tab.Panels>
//             {Object.keys(tabFilters).map((tab) => (
//               <Tab.Panel key={tab}>
//                 {tab === "All POs" && (
//                   <div className="flex justify-end mb-4">
//                     <button
//                       onClick={() => setIsAddPOOpen(true)}
//                       className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition text-sm sm:text-base"
//                     >
//                       <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" /> Add PO
//                     </button>
//                   </div>
//                 )}
//                 <POTable
//                   purchaseOrders={filteredPOs ||[]}
//                   projects={projects|| []}
//                   vendors={vendors || []}
//                   archClients={archClients|| []}
//                   onRowClick={(po) => handleEditPO(po)}
//                   onEdit={(po) => handleEditPO(po)}
//                   onDelete={(id) => handleDeletePO(id)}
//                   onstatusUpdate = {handleStatusUpdate}
//                 />
//               </Tab.Panel>
//             ))}
//           </Tab.Panels>
//         </Tab.Group>

//         {/* Modals / Drawers */}
//         <PODetailsDrawer
//           isOpen={isPODetailsOpen}
//           onClose={() => setIsPODetailsOpen(false)}
//           selectedPO={selectedPO}
//           onManageReturns={handleManageReturns}
//         />

//         <AddVendorModal
//           isOpen={isAddVendorOpen}
//           onClose={() => setIsAddVendorOpen(false)}
//           vendorName={vendorName}
//           setVendorName={setVendorName}
//           amount={amount}
//           setAmount={setAmount}
//           status={status}
//           setStatus={setStatus}
//           handleAddVendor={handleAddVendor}
//         />

//         <CalendarModal
//           isOpen={isCalendarOpen}
//           onClose={() => setIsCalendarOpen(false)}
//           purchaseOrders={purchaseOrders}
//         />

//         <DetailListModal
//           isOpen={isDetailListOpen}
//           onClose={() => setIsDetailListOpen(false)}
//           title={detailListData.title}
//           data={detailListData.data}
//         />

//         <AddPOModal
//           isOpen={isAddPOOpen}
//           onClose={() => setIsAddPOOpen(false)}
//           onAddPO={handleAddPO}
//           onUpdatePO={handleUpdatePO}
//         />

//         <ReturnItemsModal
//           isOpen={isReturnModalOpen}
//           onClose={() => setIsReturnModalOpen(false)}
//           po={selectedPO}
//           onUpdate={handleUpdatePO}
//         />
//       </div>
//     </Layout>
//   );
// }
