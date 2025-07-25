import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import Button from "../../../components/Button";
import { FiDownload, FiSend } from "react-icons/fi";

export default function RFQDetailDrawer({ rfq, onClose }) {
  const [activeTab, setActiveTab] = useState("detail");

  if (!rfq) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full max-w-4xl h-full shadow-lg overflow-y-auto animate-slide-in-right">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <button onClick={onClose}>
              <MdClose className="text-xl" />
            </button>
            <div className="flex border border-purple-200 rounded-full overflow-hidden">
              <button
                className={`px-6 py-1.5 text-sm font-medium ${
                  activeTab === "detail"
                    ? "bg-purple-600 text-white"
                    : "text-purple-700"
                }`}
                onClick={() => setActiveTab("detail")}
              >
                Detail
              </button>
              <button
                className={`px-6 py-1.5 text-sm font-medium ${
                  activeTab === "supplier"
                    ? "bg-purple-600 text-white"
                    : "text-purple-700"
                }`}
                onClick={() => setActiveTab("supplier")}
              >
                Supplier Entries
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-1 text-purple-700 border-purple-700">
              <FiDownload className="text-lg" />
              Download
            </Button>
            <Button variant="outline" className="gap-1 text-purple-700 border-purple-700">
              <FiSend className="text-lg" />
              Send
            </Button>
            <Button variant="solid" color="purple">
              Edit
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {activeTab === "detail" && (
            <>
              {/* Document Info */}
              <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-md text-sm">
                <div>
                  <strong>Document ID:</strong> {rfq?.rfqNo || "--"}
                </div>
                <div>
                  <strong>Delivery Location:</strong>{" "}
                  {rfq?.deliveryLocation || "--"}
                </div>
                <div>
                  <strong>Document Date:</strong>{" "}
                  {rfq?.createdAt?.slice(0, 10) || "--"}
                </div>
                <div>
                  <strong>Bidding Start Date:</strong>{" "}
                  {rfq?.biddingStartDate?.slice(0, 10) || "--"}
                </div>
                <div>
                  <strong>Bidding End Date:</strong>{" "}
                  {rfq?.biddingEndDate?.slice(0, 10) || "--"}
                </div>
              </div>

              {/* Item Table */}
              <div>
                <h3 className="font-semibold text-base mb-2">Item Details</h3>
                <table className="w-full text-sm border rounded">
                  <thead className="bg-purple-100 text-left">
                    <tr>
                      <th className="p-2">S.N.</th>
                      <th className="p-2">Item</th>
                      <th className="p-2">HSN Code</th>
                      <th className="p-2">QTY</th>
                      <th className="p-2">Delivery Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rfq?.materials?.length > 0 ? (
                      rfq.materials.map((item, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="p-2">{idx + 1}</td>
                          <td className="p-2">{item.name}</td>
                          <td className="p-2">{item.hsnCode || "--"}</td>
                          <td className="p-2">
                            {item.quantity} {item.unit || ""}
                          </td>
                          <td className="p-2">{item.deliveryDate || "--"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center p-4 text-gray-500"
                        >
                          No RFQ Item Available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Terms & Conditions */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border text-sm text-gray-700 leading-relaxed">
                <h4 className="font-semibold text-base mb-2">
                  Terms & Conditions
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>All items must be delivered on or before the specified delivery date.</li>
                  <li>Prices quoted must include all applicable taxes and duties.</li>
                  <li>Any delay in delivery without prior notice may result in cancellation of the order.</li>
                  <li>Payment terms are net 30 days unless otherwise agreed upon.</li>
                  <li>The supplier must ensure all goods meet the specified standards and quality.</li>
                </ul>
              </div>
            </>
          )}

          {activeTab === "supplier" && (
            <div className="text-gray-600 italic text-sm text-center py-10">
              Supplier Entries section is under development.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
