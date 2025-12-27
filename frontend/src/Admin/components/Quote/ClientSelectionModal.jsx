import { useState } from "react";
import { FaGoogle, FaInstagram, FaFacebookF, FaFilePdf } from "react-icons/fa";

function ClientSelectionModal({
  availableClients,
  selectedClient,
  setSelectedClient,
  onClose,
  onProceed,
}) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl max-w-7xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Select Client</h3>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border min-w-[1200px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">S.no</th>
                <th className="p-2 border">Lead ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Property Details</th>
                <th className="p-2 border">Budget</th>
                <th className="p-2 border">Style</th>
                <th className="p-2 border">Requirements</th>
                <th className="p-2 border">Address</th>
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
                  <td className="p-2 border font-semibold">{client.name || "-"}</td>
                  <td className="p-2 border max-w-xs truncate" title={client.propertyDetails || ""}>
                    {client.propertyDetails || "-"}
                  </td>
                  <td className="p-2 border">{client.budget}</td>
                  <td className="p-2 border">{client.style || "-"}</td>
                  <td className="p-2 border max-w-xs truncate" title={client.requirements || ""}>
                    {client.requirements || "-"}
                  </td>
                  <td className="p-2 border max-w-xs truncate" title={client.address || ""}>
                    {client.address || "-"}
                  </td>
                  <td className="p-2 border">{client.category || "-"}</td>
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
                    {!client.source && "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-6">
          {(() => {
            // Check if assigned professional exists (handle both populated object and ObjectId)
            const hasAssigned = selectedClient && (
              selectedClient.assigned?._id || 
              selectedClient.assigned || 
              (typeof selectedClient.assigned === 'string' && selectedClient.assigned)
            );
            
            return (
              <>
                <button
                  disabled={!selectedClient || !hasAssigned}
                  onClick={() => onProceed()}
                  className={`px-5 py-1.5 rounded-full font-semibold text-white ${
                    selectedClient && hasAssigned
                      ? "bg-red-700 hover:bg-red-800"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Save Quote
                </button>
                {selectedClient && !hasAssigned && (
                  <p className="text-red-500 text-sm mt-2">
                    This lead has no assigned professional. Please assign a professional to the lead first.
                  </p>
                )}
              </>
            );
          })()}
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
