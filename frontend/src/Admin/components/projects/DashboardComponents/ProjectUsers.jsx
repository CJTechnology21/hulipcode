import React, { useState } from "react";
import DashboardCard from "./DashboardCard";

function ProjectUsers() {
  const [tab, setTab] = useState("myOrg");
  const users = [
    { name: "Ravi", phone: "+91-98100223423", role: "Design head", color: "bg-yellow-400" },
    { name: "Ravi", phone: "+91-98100223423", role: "Project Manager", color: "bg-purple-500" },
    { name: "Ravi", phone: "+91-98100223423", role: "Design head", color: "bg-blue-400" },
  ];

  return (
    <DashboardCard
      title="Project Users"
      extraHeader={
        <button className="bg-red-700 text-white text-sm px-3 py-1 rounded">
          + Add Users
        </button>
      }
    >
      <div className="flex border-b mb-2">
        <button
          className={`flex-1 pb-1 border-b-2 ${
            tab === "myOrg" ? "border-red-700 font-bold" : "border-transparent"
          }`}
          onClick={() => setTab("myOrg")}
        >
          My Organisation
        </button>
        <button
          className={`flex-1 pb-1 border-b-2 ${
            tab === "otherOrg" ? "border-red-700 font-bold" : "border-transparent"
          }`}
          onClick={() => setTab("otherOrg")}
        >
          Other Organisation
        </button>
      </div>

      {users.map((user, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center py-2 border-b border-gray-200"
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${user.color}`}
            >
              {user.name.charAt(0)}
            </div>
            <span className="font-bold">{user.name}</span>
          </div>
          <span>{user.phone}</span>
          <span className="text-sm">{user.role}</span>
        </div>
      ))}
    </DashboardCard>
  );
}

export default ProjectUsers;
