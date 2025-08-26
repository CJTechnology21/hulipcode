import React, { useState, useMemo, useEffect } from "react";
import { Tab } from "@headlessui/react";
import Layout from "../Layout";
import { FiClipboard, FiPlus, FiCalendar } from "react-icons/fi";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
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
import {
  fetchVendors,
  fetchArchandClients,
} from "../../../services/leadServices";
import { fetchProjects } from "../../../services/projectServices";
import {
  fetchVendorOrderByArchitect,
  deleteVendorOrder,
} from "../../../services/vendorOrderServices";

// Auth
import { useAuth } from "../../../context/AuthContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Utility to get label from ID or object
const getLabel = (arr, idOrObj) => {
  if (!arr || arr.length === 0) return "-";
  const id = idOrObj?._id || idOrObj;
  return arr.find((item) => String(item.value) === String(id))?.label || "-";
};

export default function VendorHome() {
  const { user } = useAuth();

  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPODetailsOpen, setIsPODetailsOpen] = useState(false);
  const [isDetailListOpen, setIsDetailListOpen] = useState(false);
  const [isAddPOOpen, setIsAddPOOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [detailListData, setDetailListData] = useState({ title: "", data: [] });
  const [vendorId, setVendorId] = useState(""); // store vendor ID
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Pending");

  const [vendors, setVendors] = useState([]);
  const [projects, setProjects] = useState([]);
  const [archClients, setArchClients] = useState([]);

  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [activeTab, setActiveTab] = useState("All POs");

  // Fetch vendor orders for architect
  useEffect(() => {
    const loadOrders = async () => {
      try {
        if (user?.role === "architect") {
          console.log("Fetching vendor orders for architect:", user._id);
          const data = await fetchVendorOrderByArchitect(user._id);
          setPurchaseOrders(data.orders || []);
        } else {
          setPurchaseOrders([]);
        }
      } catch (err) {
        console.error(" Failed to fetch vendor orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    loadOrders();
  }, [user]);

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
        setArchClients(
          acData?.map((ac) => ({ label: ac.name, value: ac._id })) || []
        );
      } catch (err) {
        console.error("Failed to fetch dropdown data:", err);
      }
    };
    loadData();
  }, []);
  //handle delete
  const handleDelete = async (orderId) => {
    try {
      await deleteVendorOrder(orderId);
      toast.success("Purchase order deleted successfully!");

      // remove from state
      setPurchaseOrders((prev) => prev.filter((po) => po._id !== orderId));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete purchase order.");
    }
  };

  // Summary cards calculations
  const summary = useMemo(() => {
    const totalPO = purchaseOrders.reduce(
      (sum, po) => sum + (po.amount || 0),
      0
    );
    const paymentsDone = purchaseOrders
      .filter((po) => po.status === "Paid")
      .reduce((sum, po) => sum + (po.amount || 0), 0);
    const paymentsPending = totalPO - paymentsDone;
    const totalVendors = new Set(purchaseOrders.map((po) => po.vendor)).size;
    const pendingCount = purchaseOrders.filter(
      (po) => po.status === "Pending"
    ).length;
    return {
      totalPO,
      paymentsDone,
      paymentsPending,
      totalVendors,
      pendingCount,
    };
  }, [purchaseOrders]);

  // Add Vendor PO
  const handleAddVendor = () => {
    if (!vendorId || !amount) return;
    const newPO = {
      _id: Date.now().toString(), // temporary unique ID
      project: null,
      orderedBy: user._id, // architect adding the PO
      vendor: vendorId, // store ID, not name
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
    setVendorId("");
    setAmount("");
    setStatus("Pending");
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
  // open drawer instead of edit modal
  const handleRowClick = (po) => {
    setSelectedPO(po);
    setIsPODetailsOpen(true);
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
                    selected
                      ? "bg-red-500 text-white shadow"
                      : "text-black hover:bg-red-100"
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
                        setSelectedPO(null);
                        setIsAddPOOpen(true);
                      }}
                      className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition text-sm sm:text-base"
                    >
                      <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" /> Add PO
                    </button>
                  </div>
                )}
                {loadingOrders ? (
                  <ClipLoader color="red" size={50} />
                ) : vendors.length && projects.length && archClients.length ? (
                  <POTable
                    purchaseOrders={filteredPOs || []}
                    projects={projects}
                    vendors={vendors}
                    archClients={archClients}
                    onRowClick={handleRowClick}
                    onEdit={handleEditPO}
                    onDelete={handleDelete}
                    onstatusUpdate={handleStatusUpdate}
                    getLabel={getLabel}
                  />
                ) : (
                  <p>Loading dropdown data...</p>
                )}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>

        {/* Modals / Drawers */}
        <PODetailsDrawer
          isOpen={isPODetailsOpen}
          onClose={() => setIsPODetailsOpen(false)}
          selectedPO={selectedPO}
          vendors={vendors}
          projects={projects}
          archClients={archClients}
          getLabel={getLabel}
          onManageReturns={handleManageReturns}
        />

        {/* <PODetailsDrawer
          isOpen={isPODetailsOpen}
          onClose={() => setIsPODetailsOpen(false)}
          selectedPO={selectedPO}
          onManageReturns={handleManageReturns}
        /> */}

        <AddVendorModal
          isOpen={isAddVendorOpen}
          onClose={() => setIsAddVendorOpen(false)}
          vendorId={vendorId}
          setVendorId={setVendorId}
          amount={amount}
          setAmount={setAmount}
          status={status}
          setStatus={setStatus}
          handleAddVendor={handleAddVendor}
          vendors={vendors} // to select vendor in modal
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
          onSuccess={() => {
            if (user?.role === "architect") {
              fetchVendorOrderByArchitect(user._id).then((data) =>
                setPurchaseOrders(data.orders || [])
              );
            }
          }}
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
