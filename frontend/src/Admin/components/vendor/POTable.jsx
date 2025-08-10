import React from "react";

export default function POTable({ purchaseOrders, onRowClick }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="p-2">Vendor</th>
            <th className="p-2">Project</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Date</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {purchaseOrders.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No purchase orders found.
              </td>
            </tr>
          )}
          {purchaseOrders.map((po) => (
            <tr
              key={po.id}
              className="border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => onRowClick(po)}
            >
              <td className="p-2">{po.vendor}</td>
              <td className="p-2">{po.project}</td>
              <td className="p-2">₹{po.amount.toLocaleString()}</td>
              <td className="p-2">{po.date}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    po.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {po.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
