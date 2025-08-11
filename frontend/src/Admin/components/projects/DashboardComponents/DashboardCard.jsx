import React from "react";

const DashboardCard = ({ title, children, extraHeader }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4 shadow-lg border border-gray-200 h-80 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        {title && <h2 className="font-bold text-lg">{title}</h2>}
        {extraHeader}
      </div>
      <div className="bg-white rounded-lg p-4 flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
