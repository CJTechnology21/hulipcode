import { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import { FaCheckCircle, FaTimesCircle, FaWallet, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

function AdminTools() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("kyc"); // kyc, disputes, wallets
  const [loading, setLoading] = useState(false);

  // KYC State
  const [pendingKYC, setPendingKYC] = useState([]);
  const [kycPage, setKycPage] = useState(1);
  const [kycTotal, setKycTotal] = useState(0);

  // Disputes State
  const [disputes, setDisputes] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [disputesPage, setDisputesPage] = useState(1);
  const [disputesTotal, setDisputesTotal] = useState(0);

  // Wallets State
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [walletsPage, setWalletsPage] = useState(1);
  const [walletsTotal, setWalletsTotal] = useState(0);

  // Fetch pending KYC
  const fetchPendingKYC = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/admin/kyc/pending`, {
        params: { page: kycPage, limit: 20 },
        withCredentials: true,
      });
      setPendingKYC(response.data.data.users);
      setKycTotal(response.data.data.pagination.total);
    } catch (error) {
      console.error("Error fetching pending KYC:", error);
      toast.error("Failed to load pending KYC");
    } finally {
      setLoading(false);
    }
  };

  // Fetch disputes
  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/admin/disputes`, {
        params: { page: disputesPage, limit: 20 },
        withCredentials: true,
      });
      setDisputes(response.data.data.disputes);
      setDisputesTotal(response.data.data.pagination.total);
    } catch (error) {
      console.error("Error fetching disputes:", error);
      toast.error("Failed to load disputes");
    } finally {
      setLoading(false);
    }
  };

  // Fetch wallets
  const fetchWallets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/admin/wallets`, {
        params: { page: walletsPage, limit: 20 },
        withCredentials: true,
      });
      setWallets(response.data.data.wallets);
      setWalletsTotal(response.data.data.pagination.total);
    } catch (error) {
      console.error("Error fetching wallets:", error);
      toast.error("Failed to load wallets");
    } finally {
      setLoading(false);
    }
  };

  // Approve KYC
  const handleApproveKYC = async (userId) => {
    try {
      setLoading(true);
      await axios.post(
        `${API_BASE}/api/admin/kyc/${userId}/approve`,
        {},
        { withCredentials: true }
      );
      toast.success("KYC approved successfully");
      fetchPendingKYC();
    } catch (error) {
      console.error("Error approving KYC:", error);
      toast.error(error.response?.data?.message || "Failed to approve KYC");
    } finally {
      setLoading(false);
    }
  };

  // Reject KYC
  const handleRejectKYC = async (userId) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason || reason.trim().length === 0) {
      toast.error("Rejection reason is required");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${API_BASE}/api/admin/kyc/${userId}/reject`,
        { reason },
        { withCredentials: true }
      );
      toast.success("KYC rejected");
      fetchPendingKYC();
    } catch (error) {
      console.error("Error rejecting KYC:", error);
      toast.error(error.response?.data?.message || "Failed to reject KYC");
    } finally {
      setLoading(false);
    }
  };

  // Resolve dispute
  const handleResolveDispute = async (disputeId, resolution, resolutionAction) => {
    try {
      setLoading(true);
      await axios.post(
        `${API_BASE}/api/admin/disputes/${disputeId}/resolve`,
        { resolution, resolutionAction },
        { withCredentials: true }
      );
      toast.success("Dispute resolved successfully");
      setSelectedDispute(null);
      fetchDisputes();
    } catch (error) {
      console.error("Error resolving dispute:", error);
      toast.error(error.response?.data?.message || "Failed to resolve dispute");
    } finally {
      setLoading(false);
    }
  };

  // Adjust wallet balance
  const handleAdjustWallet = async () => {
    if (!adjustAmount || !adjustReason) {
      toast.error("Amount and reason are required");
      return;
    }

    try {
      setLoading(true);
      await axios.patch(
        `${API_BASE}/api/admin/wallets/${selectedWallet._id}/adjust`,
        { amount: parseFloat(adjustAmount), reason: adjustReason },
        { withCredentials: true }
      );
      toast.success("Wallet balance adjusted successfully");
      setSelectedWallet(null);
      setAdjustAmount("");
      setAdjustReason("");
      fetchWallets();
    } catch (error) {
      console.error("Error adjusting wallet:", error);
      toast.error(error.response?.data?.message || "Failed to adjust wallet");
    } finally {
      setLoading(false);
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === "kyc") {
      fetchPendingKYC();
    } else if (activeTab === "disputes") {
      fetchDisputes();
    } else if (activeTab === "wallets") {
      fetchWallets();
    }
  }, [activeTab, kycPage, disputesPage, walletsPage]);

  return (
    <div className="flex h-screen overflow-hidden font-fredoka">
      <SideBar />
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Admin Tools"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="p-6 flex-1">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("kyc")}
                className={`px-6 py-3 font-semibold ${
                  activeTab === "kyc"
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                KYC Approval ({kycTotal})
              </button>
              <button
                onClick={() => setActiveTab("disputes")}
                className={`px-6 py-3 font-semibold ${
                  activeTab === "disputes"
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Disputes ({disputesTotal})
              </button>
              <button
                onClick={() => setActiveTab("wallets")}
                className={`px-6 py-3 font-semibold ${
                  activeTab === "wallets"
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Wallet Adjustments
              </button>
            </div>
          </div>

          {/* KYC Tab */}
          {activeTab === "kyc" && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Pending KYC Approvals</h2>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : pendingKYC.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending KYC approvals
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingKYC.map((user) => (
                    <div
                      key={user._id}
                      className="border rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-500">Role: {user.role}</p>
                        <div className="mt-2 flex gap-2">
                          {user.aadhaarFile && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Aadhaar
                            </span>
                          )}
                          {user.panFile && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              PAN
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveKYC(user._id)}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                        >
                          <FaCheckCircle /> Approve
                        </button>
                        <button
                          onClick={() => handleRejectKYC(user._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
                        >
                          <FaTimesCircle /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Disputes Tab */}
          {activeTab === "disputes" && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Disputes</h2>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : disputes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No disputes</div>
              ) : (
                <div className="space-y-4">
                  {disputes.map((dispute) => (
                    <div
                      key={dispute._id}
                      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedDispute(dispute)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{dispute.title}</h3>
                          <p className="text-sm text-gray-600">
                            Project: {dispute.projectId?.name || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Raised by: {dispute.raisedBy?.name || "Unknown"}
                          </p>
                          <span
                            className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                              dispute.status === "OPEN"
                                ? "bg-yellow-100 text-yellow-800"
                                : dispute.status === "RESOLVED"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {dispute.status}
                          </span>
                        </div>
                        <FaExclamationTriangle className="text-yellow-500 text-xl" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Dispute Detail Modal */}
              {selectedDispute && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-bold mb-4">
                      {selectedDispute.title}
                    </h3>
                    <p className="mb-4">{selectedDispute.description}</p>
                    <div className="space-y-2 mb-4">
                      <p>
                        <strong>Status:</strong> {selectedDispute.status}
                      </p>
                      <p>
                        <strong>Category:</strong> {selectedDispute.category}
                      </p>
                      <p>
                        <strong>Raised by:</strong> {selectedDispute.raisedBy?.name}
                      </p>
                      <p>
                        <strong>Project:</strong> {selectedDispute.projectId?.name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleResolveDispute(
                            selectedDispute._id,
                            "Resolved in favor of client",
                            "APPROVED_FOR_CLIENT"
                          )
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Resolve for Client
                      </button>
                      <button
                        onClick={() =>
                          handleResolveDispute(
                            selectedDispute._id,
                            "Resolved in favor of professional",
                            "APPROVED_FOR_PROFESSIONAL"
                          )
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Resolve for Professional
                      </button>
                      <button
                        onClick={() => setSelectedDispute(null)}
                        className="bg-gray-600 text-white px-4 py-2 rounded"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Wallets Tab */}
          {activeTab === "wallets" && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Wallet Adjustments</h2>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : wallets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No wallets</div>
              ) : (
                <div className="space-y-4">
                  {wallets.map((wallet) => (
                    <div
                      key={wallet._id}
                      className="border rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-semibold">
                          {wallet.projectId?.name || "Unknown Project"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Balance: ₹{wallet.balance?.toLocaleString() || 0}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status: {wallet.status}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedWallet(wallet)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                      >
                        <FaWallet /> Adjust
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Wallet Adjustment Modal */}
              {selectedWallet && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <h3 className="text-xl font-bold mb-4">Adjust Wallet Balance</h3>
                    <p className="mb-4">
                      Project: {selectedWallet.projectId?.name}
                    </p>
                    <p className="mb-4">
                      Current Balance: ₹{selectedWallet.balance?.toLocaleString() || 0}
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Amount (positive to add, negative to subtract)
                        </label>
                        <input
                          type="number"
                          value={adjustAmount}
                          onChange={(e) => setAdjustAmount(e.target.value)}
                          className="w-full border rounded px-3 py-2"
                          placeholder="e.g., 1000 or -500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Reason
                        </label>
                        <textarea
                          value={adjustReason}
                          onChange={(e) => setAdjustReason(e.target.value)}
                          className="w-full border rounded px-3 py-2"
                          rows="3"
                          placeholder="Enter reason for adjustment"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleAdjustWallet}
                          className="bg-blue-600 text-white px-4 py-2 rounded flex-1"
                        >
                          Apply Adjustment
                        </button>
                        <button
                          onClick={() => {
                            setSelectedWallet(null);
                            setAdjustAmount("");
                            setAdjustReason("");
                          }}
                          className="bg-gray-600 text-white px-4 py-2 rounded flex-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminTools;

