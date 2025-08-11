import React from "react";
import DashboardCard from "./DashboardCard";

function Approvals() {
  const approvals = [
    { title: "Mr-035 | Material Request", details: "20 bags POP, 20 Pc Channel\n2 Box Screw" },
    { title: "Quantity Change : Task 791837", details: "Before : 50 Sqft   Revised : 120 sqft" },
    { title: "Rate Change", details: "Before : Rs 120 / Sqft   Revised : Rs 145 / Sqft" },
    { title: "Mr-035 | Material Request", details: "20 bags POP, 20 Pc Channel\n2 Box Screw" },
  ];

  return (
    <DashboardCard title="Approvals">
      {approvals.map((item, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center border-b border-gray-200 py-2"
        >
          <div>
            <p className="font-bold">{item.title}</p>
            <p className="text-sm whitespace-pre-line">{item.details}</p>
          </div>
          <button className="bg-red-700 text-white text-sm px-3 py-1 rounded-full">
            Approve
          </button>
        </div>
      ))}
    </DashboardCard>
  );
}

export default Approvals;
