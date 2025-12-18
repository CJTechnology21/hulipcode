import React, { useState, useEffect } from "react";
import { FaPlus, FaEye, FaFileContract } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsFilter } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchContracts,
  fetchSignedContractPdf,
} from "../../../services/contractServices";
import Button from "../../../components/Button";
import Layout from "../../components/Layout";
import SearchBar from "../../../components/SearchBar";
import ClipLoader from "react-spinners/ClipLoader";

export default function ContractManagement() {
  const [activeTab, setActiveTab] = useState("All Contracts");
  const navigate = useNavigate();
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [contractList, setContractList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [viewer, setViewer] = useState({
    open: false,
    loading: false,
    pdfUrl: null,
    error: null,
    contract: null,
  });

  // Fetch contracts from API
  const loadContracts = async () => {
    setLoading(true);
    try {
      const contracts = await fetchContracts();
      setContractList(contracts);
      setError(null);
    } catch (err) {
      setError(err.message || "Error loading contracts");
      toast.error("Failed to load contracts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  // Cleanup any allocated blob URL
  useEffect(() => {
    return () => {
      if (viewer.pdfUrl) {
        URL.revokeObjectURL(viewer.pdfUrl);
      }
    };
  }, [viewer.pdfUrl]);

  // Filter contracts based on active tab
  const getFilteredContracts = () => {
    let filtered = contractList;

    // Apply tab filter
    if (activeTab === "Self") {
      filtered = filtered.filter((c) => !c.quoteId?.leadId?.isHuelip);
    } else if (activeTab === "Huelip") {
      filtered = filtered.filter((c) => c.quoteId?.leadId?.isHuelip);
    }

    // Apply search filters
    return filtered.filter((contract) => {
      return Object.keys(filters).every((key) => {
        if (!filters[key]) return true;
        const searchTerm = filters[key].toLowerCase();
        
        switch (parseInt(key)) {
          case 1: // C-ID
            return contract._id?.toString().toLowerCase().includes(searchTerm);
          case 2: // Name
            return contract.quoteId?.leadId?.name?.toLowerCase().includes(searchTerm);
          case 3: // Q-ID
            return contract.quoteId?.qid?.toLowerCase().includes(searchTerm);
          case 4: // Contact
            return contract.quoteId?.leadId?.contact?.toLowerCase().includes(searchTerm);
          case 5: // Quote Amount
            return contract.metadata?.totalAmount?.toString().includes(searchTerm);
          case 6: // City/Area
            return contract.quoteId?.leadId?.city?.toLowerCase().includes(searchTerm);
          case 7: // Assigned to
            return contract.quoteId?.assigned?.[0]?.name?.toLowerCase().includes(searchTerm);
          default:
            return true;
        }
      });
    });
  };

  const filteredContracts = getFilteredContracts();

  const toggleMenu = (contractId) => {
    setMenuOpenId((prev) => (prev === contractId ? null : contractId));
  };

  const closeViewer = () => {
    if (viewer.pdfUrl) {
      URL.revokeObjectURL(viewer.pdfUrl);
    }
    setViewer({
      open: false,
      loading: false,
      pdfUrl: null,
      error: null,
      contract: null,
    });
  };

  const openSignedContract = async (contract) => {
    if (!contract?._id) return;

    if (viewer.pdfUrl) {
      URL.revokeObjectURL(viewer.pdfUrl);
    }

    setViewer({
      open: true,
      loading: true,
      pdfUrl: null,
      error: null,
      contract,
    });

    try {
      const pdfBlob = await fetchSignedContractPdf(contract._id);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setViewer({
        open: true,
        loading: false,
        pdfUrl,
        error: null,
        contract,
      });
    } catch (err) {
      console.error("Failed to load signed contract:", err);
      const notSigned =
        err?.response?.status === 404 ||
        err?.message?.toLowerCase?.().includes("not available");
      setViewer({
        open: true,
        loading: false,
        pdfUrl: null,
        error: notSigned
          ? "You haven't signed the contract yet. Please sign the contract."
          : "Failed to load signed contract. Please try again.",
        contract,
      });
    }
  };

  // Get status badge for Own signature
  const getOwnStatusBadge = (contract) => {
    if (contract.signed_by_professional) {
      return (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          Signed
        </span>
      );
    }
    return (
      <Button
        variant="custom"
        onClick={() => {
          // Navigate to sign contract page with contract data
          navigate("/sign-contract", {
            state: {
              contractId: contract._id,
              quoteId: contract.quoteId?._id,
              qid: contract.quoteId?.qid,
              totalAmount: contract.metadata?.totalAmount || contract.quoteId?.quoteAmount,
              architectId: contract.quoteId?.assigned?.[0]?._id,
              clientName: contract.quoteId?.leadId?.name,
            },
          });
        }}
        className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded-full text-xs font-semibold"
      >
        Sign Contract
      </Button>
    );
  };

  // Get status badge for Client signature
  const getClientStatusBadge = (contract) => {
    if (contract.signed_by_client) {
      return (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          Signed
        </span>
      );
    }
    return (
      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
        Waiting
      </span>
    );
  };

  // Get Huelip Protect badge
  const getHuelipProtectBadge = (contract) => {
    if (contract.quoteId?.leadId?.isHuelip) {
      return (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
          Protected
        </span>
      );
    }
    return null;
  };

  // Get assigned user badge
  const getAssignedBadge = (contract) => {
    const assigned = contract.quoteId?.assigned?.[0];
    if (!assigned) return <span>-</span>;
    
    const initials = assigned.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

    const colors = ["bg-yellow-500", "bg-purple-500", "bg-pink-500", "bg-blue-500"];
    const colorIndex = assigned._id?.toString().charCodeAt(0) % colors.length || 0;

    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-6 h-6 ${colors[colorIndex]} text-white text-xs rounded-full flex items-center justify-center font-bold`}
        >
          {initials}
        </div>
        <span className="text-sm">{assigned.name}</span>
      </div>
    );
  };

  // Generate Contract ID (C-ID)
  const getContractId = (contract) => {
    // Use first 6 chars of _id + first letter of quote ID
    const id = contract._id?.toString().slice(-6).toUpperCase() || "N/A";
    const quotePrefix = contract.quoteId?.qid?.charAt(0) || "";
    return quotePrefix + id;
  };

  return (
    <Layout title="Contracts">
      <div className="p-4 overflow-y-auto flex-1">
        {/* Header with Tabs and Actions */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            {/* Tabs */}
            <div className="flex gap-2">
              {["All Contracts", "Self", "Huelip"].map((tab) => (
                <Button
                  key={tab}
                  variant="custom"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === tab
                      ? "bg-[#a00000] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                  {tab === "All Contracts" && (
                    <span className="ml-2 bg-white text-[#a00000] px-2 py-0.5 rounded-full text-xs">
                      {contractList.length}
                    </span>
                  )}
                  {tab === "Self" && (
                    <span className="ml-2 bg-white text-[#a00000] px-2 py-0.5 rounded-full text-xs">
                      {contractList.filter((c) => !c.quoteId?.leadId?.isHuelip).length}
                    </span>
                  )}
                  {tab === "Huelip" && (
                    <span className="ml-2 bg-white text-[#a00000] px-2 py-0.5 rounded-full text-xs">
                      {contractList.filter((c) => c.quoteId?.leadId?.isHuelip).length}
                    </span>
                  )}
                </Button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              <Button
                variant="custom"
                className="bg-[#a00000] text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <FaPlus /> Contract Template
              </Button>
              <Button
                variant="custom"
                className="bg-[#a00000] text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <FaPlus /> Create Contract
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
            <div className="overflow-x-auto bg-white rounded-xl shadow">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-left bg-gray-100">
                    {[
                      "S.no",
                      "C-ID",
                      "Name",
                      "Q-ID",
                      "Huelip Protect",
                      "Contact no.",
                      "Quote Amount",
                      "City/Area",
                      "Assigned to",
                      "Signed Status",
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
                    {Array.from({ length: 11 }).map((_, idx) => (
                      <td key={idx} className="px-3 py-2">
                        {idx === 9 || idx === 10 ? null : (
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
                  {filteredContracts.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="px-3 py-8 text-center text-gray-500">
                        No contracts found
                      </td>
                    </tr>
                  ) : (
                    filteredContracts.map((contract, index) => (
                      <tr key={contract._id} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-3">{index + 1}</td>
                        <td className="px-3 py-3 font-semibold">
                          {getContractId(contract)}
                        </td>
                        <td className="px-3 py-3">
                          {contract.quoteId?.leadId?.name || "N/A"}
                        </td>
                        <td className="px-3 py-3">
                          {contract.quoteId?.qid || "N/A"}
                        </td>
                        <td className="px-3 py-3">
                          {getHuelipProtectBadge(contract)}
                        </td>
                        <td className="px-3 py-3">
                          {contract.quoteId?.leadId?.contact || "N/A"}
                        </td>
                        <td className="px-3 py-3 font-semibold">
                          ₹{Number(contract.metadata?.totalAmount || contract.quoteId?.quoteAmount || 0).toLocaleString("en-IN")}/-
                        </td>
                        <td className="px-3 py-3">
                          {contract.quoteId?.leadId?.city || "N/A"}
                        </td>
                        <td className="px-3 py-3">
                          {getAssignedBadge(contract)}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-2">
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500 mb-1">Own</span>
                              {getOwnStatusBadge(contract)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500 mb-1">Client</span>
                              {getClientStatusBadge(contract)}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 relative">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="custom"
                              onClick={() => openSignedContract(contract)}
                              className="p-2 hover:bg-gray-100 rounded"
                            >
                              <FaEye className="text-blue-500" />
                            </Button>
                            <Button
                              variant="custom"
                              onClick={() => toggleMenu(contract._id)}
                              className="p-2 hover:bg-gray-100 rounded relative"
                            >
                              <HiOutlineDotsVertical className="text-gray-600" />
                              {menuOpenId === contract._id && (
                                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50 text-sm">
                                  <Button
                                    variant="custom"
                                    onClick={() => {
                                      openSignedContract(contract);
                                      toggleMenu(null);
                                    }}
                                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2"
                                  >
                                    <FaEye className="text-blue-500" />
                                    <span>View</span>
                                  </Button>
                                </div>
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {viewer.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Signed Contract
                </h3>
                {viewer.contract && (
                  <p className="text-sm text-gray-500">
                    C-ID: {getContractId(viewer.contract)}
                  </p>
                )}
              </div>
              <button
                onClick={closeViewer}
                className="text-gray-500 hover:text-gray-700 text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              {viewer.loading && (
                <div className="h-full flex items-center justify-center">
                  <ClipLoader color="#a00000" loading size={48} />
                </div>
              )}

              {!viewer.loading && viewer.error && (
                <div className="h-full flex items-center justify-center p-6 text-center text-gray-700">
                  {viewer.error}
                </div>
              )}

              {!viewer.loading && !viewer.error && viewer.pdfUrl && (
                <iframe
                  src={viewer.pdfUrl}
                  title="Signed Contract"
                  className="w-full h-full"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

