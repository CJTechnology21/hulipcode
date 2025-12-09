import React, { useState, useEffect } from "react";
import DashboardCard from "./DashboardCard";
import { getWalletBalance, createWallet } from "../../../../services/walletServices";
import { FaWallet, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

function EscrowBalance({ projectId }) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    const loadBalance = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getWalletBalance(projectId);
        setBalance(data);
      } catch (err) {
        console.error("Error loading escrow balance:", err);
        setError("Failed to load balance");
        // Set default values on error
        setBalance({
          balance: 0,
          currency: "INR",
          status: "error",
          exists: false,
        });
      } finally {
        setLoading(false);
      }
    };

    loadBalance();
    
    // Refresh balance every 30 seconds
    const interval = setInterval(loadBalance, 30000);
    return () => clearInterval(interval);
  }, [projectId]);

  const handleCreateWallet = async () => {
    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }

    try {
      setIsCreating(true);
      await createWallet(projectId);
      toast.success("Wallet created successfully!");
      // Reload balance
      const data = await getWalletBalance(projectId);
      setBalance(data);
    } catch (err) {
      console.error("Error creating wallet:", err);
      toast.error(
        err.response?.data?.message || "Failed to create wallet. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  };

  const formatCurrency = (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "frozen":
        return "text-red-600";
      case "closed":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      frozen: "bg-red-100 text-red-800",
      closed: "bg-gray-100 text-gray-800",
      not_created: "bg-gray-100 text-gray-800",
      error: "bg-red-100 text-red-800",
    };
    return colors[status] || colors.error;
  };

  if (loading) {
    return (
      <DashboardCard title="Escrow Balance">
        <div className="flex items-center justify-center h-full">
          <FaSpinner className="animate-spin text-2xl text-gray-400" />
        </div>
      </DashboardCard>
    );
  }

  if (error && !balance) {
    return (
      <DashboardCard title="Escrow Balance">
        <div className="text-red-600 text-center">{error}</div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Escrow Balance">
      <div className="space-y-4">
        {/* Balance Display */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <FaWallet className="text-3xl text-blue-600 mr-2" />
            <div>
              <div className="text-3xl font-bold text-gray-800">
                {formatCurrency(balance?.balance || 0, balance?.currency)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Available Balance
              </div>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
              balance?.status
            )}`}
          >
            {balance?.status === "not_created"
              ? "Not Created"
              : balance?.status?.toUpperCase() || "UNKNOWN"}
          </span>
        </div>

        {/* Additional Info */}
        {balance?.exists && balance?.metadata && (
          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Deposited:</span>
              <span className="font-semibold">
                {formatCurrency(
                  balance.metadata.totalDeposited || 0,
                  balance.currency
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Withdrawn:</span>
              <span className="font-semibold">
                {formatCurrency(
                  balance.metadata.totalWithdrawn || 0,
                  balance.currency
                )}
              </span>
            </div>
            {balance?.quoteAmount && (
              <div className="flex justify-between">
                <span className="text-gray-600">Project Value:</span>
                <span className="font-semibold">
                  {formatCurrency(balance.quoteAmount, balance.currency)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Wallet Not Created Message */}
        {!balance?.exists && (
          <div className="text-center space-y-2 pt-2">
            <p className="text-sm text-gray-500">
              Wallet will be created automatically when contract is signed
            </p>
            <button
              onClick={handleCreateWallet}
              disabled={isCreating}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isCreating ? "Creating..." : "Create Wallet Now"}
            </button>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}

export default EscrowBalance;

