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
import { fetchVendorOrders } from "../../../services/vendorOrderServices";

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

  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==============================
  // Fetch orders from backend
  // ==============================
  const loadVendorOrders = async () => {
    try {
      setLoading(true);
      const response = await fetchVendorOrders();
      // Assuming response.orders is the array from backend
      setPurchaseOrders(response.orders || []);
    } catch (err) {
      console.error("Error fetching vendor orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendorOrders();
  }, []);

  // ==============================
  // Summary Cards
  // ==============================
  const summary = useMemo(() => {
    const totalPO = purchaseOrders.reduce((sum, po) => sum + po.amount, 0);
    const paymentsDone = purchaseOrders
      .filter((po) => po.status === "Paid")
      .reduce((sum, po) => sum + po.amount, 0);
    const paymentsPending = totalPO - paymentsDone;
    const totalVendors = new Set(purchaseOrders.map((po) => po.vendor)).size;
    const pendingCount = purchaseOrders.filter((po) => po.status === "Pending").length;
    return { totalPO, paymentsDone, paymentsPending, totalVendors, pendingCount };
  }, [purchaseOrders]);

  // ==============================
  // Add Vendor / Add PO (local for now)
  // ==============================
  const handleAddVendor = (newPO) => {
    setPurchaseOrders((prev) => [...prev, newPO]);
    setIsAddVendorOpen(false);
  };

  const handleAddPO = (poData) => {
    setPurchaseOrders((prev) => [...prev, poData]);
  };

  const handleStatusUpdate = (id, newStatus) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status: newStatus } : po))
    );
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
      prev.map((po) => (po.id === updatedPO.id ? updatedPO : po))
    );
    setSelectedPO(updatedPO);
  };

  const handleManageReturns = (po) => {
    setSelectedPO(po);
    setIsPODetailsOpen(false);
    setTimeout(() => setIsReturnModalOpen(true), 200);
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FiClipboard className="text-red-500" /> Vendor Management
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition"
            >
              <FiCalendar className="w-5 h-5" /> Deliveries
            </button>
            <button
              onClick={() => setIsAddVendorOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition"
            >
              <FiPlus className="w-5 h-5" /> Add Vendor
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCards summary={summary} onCardClick={handleCardClick} />

        {/* Tabs */}
        <Tab.Group>
          <Tab.List className="flex space-x-2 bg-white p-1 rounded-xl shadow mb-4">
            {["All POs", "Payments Done", "Payments Pending", "Pending Orders"].map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                    selected ? "bg-red-500 text-white shadow" : "text-black hover:bg-red-100"
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            {/* All POs */}
            <Tab.Panel>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setIsAddPOOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition"
                >
                  <FiPlus className="w-5 h-5" /> Add PO
                </button>
              </div>
              <POTable
                purchaseOrders={purchaseOrders}
                onRowClick={(po) => {
                  setSelectedPO(po);
                  setIsPODetailsOpen(true);
                }}
                loading={loading}
              />
            </Tab.Panel>

            {/* Payments Done */}
            <Tab.Panel>
              <POTable
                purchaseOrders={purchaseOrders.filter((po) => po.status === "Paid")}
                onRowClick={(po) => {
                  setSelectedPO(po);
                  setIsPODetailsOpen(true);
                }}
              />
            </Tab.Panel>

            {/* Payments Pending */}
            <Tab.Panel>
              <POTable
                purchaseOrders={purchaseOrders.filter((po) => po.status === "Pending")}
                onRowClick={(po) => {
                  setSelectedPO(po);
                  setIsPODetailsOpen(true);
                }}
              />
            </Tab.Panel>

            {/* Pending Orders Editable */}
            <Tab.Panel className="bg-white p-4 rounded-xl shadow">
              {purchaseOrders
                .filter((po) => po.status === "Pending")
                .map((po) => (
                  <div key={po.id} className="flex justify-between items-center border-b py-2">
                    <span>
                      {po.vendor} - ₹{po.amount.toLocaleString()}
                    </span>
                    <select
                      value={po.status}
                      onChange={(e) => handleStatusUpdate(po.id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                ))}
            </Tab.Panel>
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
          onClose={() => setIsAddPOOpen(false)}
          onAddPO={handleAddPO}
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

// import React, { useState, useMemo } from "react";
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

//   const [purchaseOrders, setPurchaseOrders] = useState([
//     {
//       id: 1,
//       project: "Sunshine Residency",
//       orderedBy: "John Doe",
//       vendor: "ABC Cement",
//       amount: 25000,
//       date: "2025-08-01",
//       status: "Pending",
//       paymentTerms: "Net 30",
//       deliveryDate: "2025-08-08",
//       notes: "Urgent delivery required",
//       items: [
//         { name: "Cement Bags", qty: 50, price: 500 },
//         { name: "White Cement", qty: 20, price: 700 },
//       ],
//       returns: [],
//     },
//     {
//       id: 2,
//       project: "Metro Mall Expansion",
//       orderedBy: "Sarah Lee",
//       vendor: "XYZ Steel",
//       amount: 40000,
//       date: "2025-07-20",
//       status: "Paid",
//       paymentTerms: "Net 15",
//       deliveryDate: "2025-08-09",
//       notes: "Deliver during morning hours",
//       items: [
//         { name: "TMT Bars", qty: 100, price: 400 },
//         { name: "Binding Wire", qty: 30, price: 200 },
//       ],
//       returns: [],
//     },
//   ]);

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

//   const handleAddVendor = () => {
//     if (!vendorName || !amount) return;
//     const newPO = {
//       id: purchaseOrders.length + 1,
//       project: "New Project",
//       orderedBy: "Project Manager",
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

//   const handleAddPO = (poData) => {
//     const newPO = {
//       id: purchaseOrders.length + 1,
//       ...poData,
//       returns: [],
//     };
//     setPurchaseOrders((prev) => [...prev, newPO]);
//   };

//   const handleStatusUpdate = (id, newStatus) => {
//     setPurchaseOrders((prev) =>
//       prev.map((po) => (po.id === id ? { ...po, status: newStatus } : po))
//     );
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

//   return (
//     <Layout>
//       <div className="p-6 bg-gray-100 min-h-screen">
//         {/* Top Bar */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold flex items-center gap-2">
//             <FiClipboard className="text-red-500" /> Vendor Management
//           </h1>
//           <div className="flex gap-3">
//             <button
//               onClick={() => setIsCalendarOpen(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition"
//             >
//               <FiCalendar className="w-5 h-5" /> Deliveries
//             </button>
//             <button
//               onClick={() => setIsAddVendorOpen(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition"
//             >
//               <FiPlus className="w-5 h-5" /> Add Vendor
//             </button>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <SummaryCards summary={summary} onCardClick={handleCardClick} />

//         {/* Tabs */}
//         <Tab.Group>
//           <Tab.List className="flex space-x-2 bg-white p-1 rounded-xl shadow mb-4">
//             {["All POs", "Payments Done", "Payments Pending", "Pending Orders"].map((tab) => (
//               <Tab
//                 key={tab}
//                 className={({ selected }) =>
//                   classNames(
//                     "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
//                     selected ? "bg-red-500 text-white shadow" : "text-black hover:bg-red-100"
//                   )
//                 }
//               >
//                 {tab}
//               </Tab>
//             ))}
//           </Tab.List>

//           <Tab.Panels>
//             {/* All POs */}
//             <Tab.Panel>
//               <div className="flex justify-end mb-4">
//                 <button
//                   onClick={() => setIsAddPOOpen(true)}
//                   className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition"
//                 >
//                   <FiPlus className="w-5 h-5" /> Add PO
//                 </button>
//               </div>
//               <POTable
//                 purchaseOrders={purchaseOrders}
//                 onRowClick={(po) => {
//                   setSelectedPO(po);
//                   setIsPODetailsOpen(true);
//                 }}
//               />
//             </Tab.Panel>

//             {/* Payments Done */}
//             <Tab.Panel>
//               <POTable
//                 purchaseOrders={purchaseOrders.filter((po) => po.status === "Paid")}
//                 onRowClick={(po) => {
//                   setSelectedPO(po);
//                   setIsPODetailsOpen(true);
//                 }}
//               />
//             </Tab.Panel>

//             {/* Payments Pending */}
//             <Tab.Panel>
//               <POTable
//                 purchaseOrders={purchaseOrders.filter((po) => po.status === "Pending")}
//                 onRowClick={(po) => {
//                   setSelectedPO(po);
//                   setIsPODetailsOpen(true);
//                 }}
//               />
//             </Tab.Panel>

//             {/* Pending Orders Editable */}
//             <Tab.Panel className="bg-white p-4 rounded-xl shadow">
//               {purchaseOrders
//                 .filter((po) => po.status === "Pending")
//                 .map((po) => (
//                   <div key={po.id} className="flex justify-between items-center border-b py-2">
//                     <span>
//                       {po.vendor} - ₹{po.amount.toLocaleString()}
//                     </span>
//                     <select
//                       value={po.status}
//                       onChange={(e) => handleStatusUpdate(po.id, e.target.value)}
//                       className="border rounded p-1"
//                     >
//                       <option value="Pending">Pending</option>
//                       <option value="Paid">Paid</option>
//                     </select>
//                   </div>
//                 ))}
//             </Tab.Panel>
//           </Tab.Panels>
//         </Tab.Group>

//         {/* Modals / Drawers */}
//         <PODetailsDrawer
//           isOpen={isPODetailsOpen}
//           onClose={() => setIsPODetailsOpen(false)}
//           selectedPO={selectedPO}
//           onManageReturns={handleManageReturns} // ✅ Fixed
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
