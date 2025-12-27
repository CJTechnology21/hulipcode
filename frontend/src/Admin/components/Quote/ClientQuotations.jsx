import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../Layout";
import Button from "../../../components/Button";
import { fetchQuotes, approveQuote, rejectQuote } from "../../../services/quoteServices";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";

function ClientQuotations() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // Load quotes for the logged-in client
  const loadQuotes = async () => {
    try {
      setLoading(true);
      const data = await fetchQuotes();
      console.log("📋 All quotes fetched:", data.length, data);
      
      // Filter quotes that are "In Review" (sent to client) or "Approved" or "Rejected"
      const clientQuotes = data.filter(
        (quote) => 
          quote.status === "In Review" || 
          quote.status === "Approved" || 
          quote.status === "Rejected"
      );
      
      console.log("✅ Filtered client quotes:", clientQuotes.length);
      setQuotes(clientQuotes);
    } catch (error) {
      console.error("Error loading quotes:", error);
      toast.error("Failed to load quotations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  // Handle accept quote
  const handleAccept = async (quoteId, qid) => {
    try {
      setProcessingId(quoteId);
      await approveQuote(quoteId);
      toast.success(`Quote ${qid} accepted successfully!`);
      await loadQuotes(); // Refresh the list
    } catch (error) {
      console.error("Error accepting quote:", error);
      toast.error(error.response?.data?.message || "Failed to accept quote");
    } finally {
      setProcessingId(null);
    }
  };

  // Handle reject quote
  const handleReject = async (quoteId, qid) => {
    try {
      setProcessingId(quoteId);
      await rejectQuote(quoteId);
      toast.success(`Quote ${qid} rejected`);
      await loadQuotes(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting quote:", error);
      toast.error(error.response?.data?.message || "Failed to reject quote");
    } finally {
      setProcessingId(null);
    }
  };

  // Get status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-300";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "In Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (loading) {
    return (
      <Layout title="Quotation Requests">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading quotations...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Quotation Requests">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quotation Requests</h1>
        </div>

        {quotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No quotation requests found</p>
            <p className="text-gray-400 text-sm mt-2">
              Quotations sent by professionals will appear here
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quote ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Professional
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotes.map((quote) => (
                  <tr key={quote._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {quote.qid || quote._id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {quote.sentByProfessional?.name || 
                         (quote.assigned && quote.assigned.length > 0
                          ? quote.assigned.map((a) => a?.name || "Unknown").filter(Boolean).join(", ")
                          : "Unassigned")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {(() => {
                          // Calculate total from summary (this is the correct total)
                          let totalAmount = 0;
                          if (quote.summary && quote.summary.length > 0) {
                            totalAmount = quote.summary.reduce((sum, item) => {
                              const itemAmount = Number(item.amount || 0);
                              const itemTax = Number(item.tax || 0);
                              return sum + itemAmount + itemTax;
                            }, 0);
                          } else {
                            // Fallback to quoteAmount if no summary
                            totalAmount = Number(quote.quoteAmount || 0);
                          }
                          return `₹${(Math.round(totalAmount * 100) / 100).toLocaleString("en-IN")}`;
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(
                          quote.status
                        )}`}
                      >
                        {quote.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quote.sentToClientAt
                        ? new Date(quote.sentToClientAt).toLocaleDateString("en-IN")
                        : quote.createdAt
                        ? new Date(quote.createdAt).toLocaleDateString("en-IN")
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {quote.status === "In Review" && (
                          <>
                            <Button
                              variant="custom"
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                              onClick={() => handleAccept(quote._id, quote.qid)}
                              disabled={processingId === quote._id}
                            >
                              <FaCheck /> Accept
                            </Button>
                            <Button
                              variant="custom"
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                              onClick={() => handleReject(quote._id, quote.qid)}
                              disabled={processingId === quote._id}
                            >
                              <FaTimes /> Reject
                            </Button>
                          </>
                        )}
                        <Button
                          variant="custom"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                          onClick={() =>
                            navigate("/quotedetails", {
                              state: {
                                quoteId: quote._id,
                                qid: quote.qid,
                                clientName: quote.leadId?.name,
                                leadMongoId: quote.leadId?._id,
                                architectId: quote.assigned?.[0]?._id,
                              },
                            })
                          }
                        >
                          <FaEye /> View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ClientQuotations;

