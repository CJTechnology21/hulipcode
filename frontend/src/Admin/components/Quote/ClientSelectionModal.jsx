import { useState, useEffect } from "react";
import { FaGoogle, FaInstagram, FaFacebookF, FaFilePdf } from "react-icons/fa";
import { fetchArchitects } from "../../../services/leadServices";

function ClientSelectionModal({
  availableClients,
  selectedClient,
  setSelectedClient,
  onClose,
  onProceed,
}) {
  const [amount, setAmount] = useState("");
  const [architects, setArchitects] = useState([]);
  const [selectedArchitect, setSelectedArchitect] = useState("");

  // Fetch architects when modal opens
  useEffect(() => {
    const loadArchitects = async () => {
      try {
        const data = await fetchArchitects();
        setArchitects(data);
      } catch (err) {
        console.error("Failed to fetch architects:", err);
      }
    };
    loadArchitects();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full p-6 relative">
        <h3 className="text-lg font-semibold mb-4">Select Client</h3>

        {/* Table */}
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">S.no</th>
              <th className="p-2 border">Lead ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Budget</th>
              <th className="p-2 border">Contact no.</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Source</th>
            </tr>
          </thead>
          <tbody>
            {availableClients.map((client) => (
              <tr
                key={client._id || client.leadId}
                onClick={() => setSelectedClient(client)}
                className={`cursor-pointer ${
                  selectedClient?._id === client._id
                    ? "bg-green-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <td className="p-2 border">{client.sno}</td>
                <td className="p-2 border">{client.leadId}</td>
                <td className="p-2 border font-semibold">{client.name}</td>
                <td className="p-2 border">{client.budget}</td>
                <td className="p-2 border">{client.contact}</td>
                <td className="p-2 border">{client.category}</td>
                <td className="p-2 border text-center">
                  {client.source === "Google" && (
                    <FaGoogle className="text-xl text-blue-500 inline" />
                  )}
                  {client.source === "Instagram" && (
                    <FaInstagram className="text-xl text-pink-500 inline" />
                  )}
                  {client.source === "PDF" && (
                    <FaFilePdf className="text-xl text-red-600 inline" />
                  )}
                  {client.source === "Facebook" && (
                    <FaFacebookF className="text-xl text-blue-700 inline" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Quote amount */}
        {selectedClient && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Enter Quote Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="border px-3 py-2 rounded w-full"
              />
            </div>

            {/* Architect selection */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Assign Architect
              </label>
              <select
                value={selectedArchitect}
                onChange={(e) => setSelectedArchitect(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              >
                <option value="">-- Select Architect --</option>
                {architects.map((arch) => (
                  <option key={arch._id} value={arch._id}>
                    {arch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <button
            disabled={!selectedClient || !amount || !selectedArchitect}
            onClick={() => onProceed(amount, selectedArchitect)}
            className={`px-5 py-1.5 rounded-full font-semibold text-white ${
              selectedClient && amount && selectedArchitect
                ? "bg-red-700 hover:bg-red-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Save Quote
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default ClientSelectionModal;
