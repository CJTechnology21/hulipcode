import React, { useState, useEffect } from "react";
import SearchBar from "../../../components/SearchBar";
import Button from "../../../components/Button";
import MaterialRequestModal from "./MaterialRequestModal";
import CreateRFQModal from "./CreateRFQModal";
import RFQDrawer from "./RFQDrawer";

export default function RfqHome() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRFQModalOpen, setIsRFQModalOpen] = useState(false);
  const [rfqDrafts, setRfqDrafts] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("rfqDrafts");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRfqDrafts(parsed);
      } catch (err) {
        console.error("Error parsing RFQ drafts from localStorage:", err);
      }
    }
  }, []);

  const filteredRFQs = rfqDrafts.filter(
    (rfq) =>
      (rfq?.project?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (rfq?.rfqNo || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (rfq, index) => {
    setSelectedRFQ({
      ...rfq,
      suppliers: rfq?.suppliers || [],
    });
  };

  return (
    <>
      <MaterialRequestModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedMaterials={selectedMaterials}
        setSelectedMaterials={setSelectedMaterials}
      />

      <CreateRFQModal
        open={isRFQModalOpen}
        onClose={() => setIsRFQModalOpen(false)}
      />

      <div className="flex flex-col gap-4 p-2">
        {/* Top Toolbar */}
        <div className="flex justify-between items-center">
          <div className="w-72">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search By RFQ Number or Project"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button
              color="black"
              variant="custom"
              className="text-sm font-medium text-gray-800 relative"
              onClick={() => setIsModalOpen(true)}
            >
              Open Material Request
              {selectedMaterials.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {selectedMaterials.length}
                </span>
              )}
            </Button>

            <Button
              color="red"
              className="text-white bg-red-600 hover:bg-red-700 text-sm px-4 py-2 rounded-lg font-semibold"
              variant="custom"
              onClick={() => setIsRFQModalOpen(true)}
            >
              + New RFQ
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-md text-sm bg-white">
            <thead className="bg-gray-400 text-black">
              <tr>
                <th className="px-4 py-2 text-left">RFQ No</th>
                <th className="px-4 py-2 text-left">Supplier</th>
                <th className="px-4 py-2 text-left">Materials</th>
                <th className="px-4 py-2 text-left">Delivery Location</th>
                <th className="px-4 py-2 text-left">Bidding Dates</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRFQs.length > 0 ? (
                filteredRFQs.map((rfq, index) => (
                  <React.Fragment key={index}>
                    <tr
                      className="border-t border-gray-200 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleRowClick(rfq, index)}
                    >
                      <td className="px-4 py-2">{`#RFQ-${index + 1}`}</td>
                      <td className="px-4 py-2">{rfq?.supplier?.name || "--"}</td>
                      <td className="px-4 py-2">{rfq?.materials?.length || 0}</td>
                      <td className="px-4 py-2">{rfq?.deliveryLocation || "--"}</td>
                      <td className="px-4 py-2">
                        <div className="text-xs">
                          <div>Start: {rfq?.biddingStartDate?.slice(0, 10)}</div>
                          <div>End: {rfq?.biddingEndDate?.slice(0, 10)}</div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-md text-xs font-medium">
                          {rfq.status || "Draft"}
                        </span>
                      </td>
                    </tr>
                    {expandedIndex === index && (
                      <tr className="bg-gray-50 border-t border-gray-200">
                        <td colSpan={6} className="px-4 py-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Document ID:</strong> {rfq?.rfqNo || "--"}
                            </div>
                            <div>
                              <strong>Document Date:</strong> {rfq?.createdAt?.slice(0, 10) || "--"}
                            </div>
                            <div>
                              <strong>Delivery Location:</strong> {rfq?.deliveryLocation || "--"}
                            </div>
                            <div>
                              <strong>Project:</strong> {rfq?.project?.name || "--"}
                            </div>
                            <div className="col-span-2 mt-2">
                              <strong>Materials:</strong>
                              <ul className="list-disc list-inside mt-1 text-gray-700">
                                {(rfq?.materials || []).map((mat, i) => (
                                  <li key={i}>
                                    {mat.name} - {mat.quantity} {mat.unit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center px-4 py-6 text-gray-500">
                    No RFQ drafts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Right Drawer */}
        <RFQDrawer rfq={selectedRFQ} onClose={() => setSelectedRFQ(null)} />
      </div>
    </>
  );
}
