import React from "react";
import { FiFileText, FiCheckCircle, FiAlertTriangle, FiUsers } from "react-icons/fi";

export default function SummaryCards({ summary, onCardClick }) {
  const cards = [
    {
      label: "Total PO Value",
      value: `₹${summary.totalPO.toLocaleString()}`,
      color: "bg-white",
      icon: <FiFileText className="text-blue-500" />,
      filter: () => true,
    },
    {
      label: "Payments Done",
      value: `₹${summary.paymentsDone.toLocaleString()}`,
      color: "bg-green-50",
      icon: <FiCheckCircle className="text-green-500" />,
      filter: (po) => po.status === "Paid",
    },
    {
      label: "Payments Pending",
      value: `₹${summary.paymentsPending.toLocaleString()}`,
      color: "bg-red-50",
      icon: <FiAlertTriangle className="text-red-500" />,
      filter: (po) => po.status === "Pending",
    },
    {
      label: "Total Vendors",
      value: summary.totalVendors,
      color: "bg-yellow-50",
      icon: <FiUsers className="text-yellow-500" />,
      filter: () => true,
    },
    {
      label: "Pending Orders",
      value: summary.pendingCount,
      color: "bg-orange-50",
      icon: <FiAlertTriangle className="text-orange-500" />,
      filter: (po) => po.status === "Pending",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      {cards.map((card, idx) => (
        <div
          key={idx}
          onClick={() => onCardClick(card.label, card.filter)}
          className={`${card.color} rounded-xl shadow p-4 cursor-pointer hover:scale-105 transition-transform`}
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">{card.icon}</div>
            <div>
              <h2 className="text-gray-500 text-sm">{card.label}</h2>
              <p className="text-2xl font-semibold">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
