

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaFolder,
  FaUserFriends,
  FaFileInvoiceDollar,
  FaIdBadge,
  FaGift,
  FaMoneyBillWave,
  FaFileContract,
} from "react-icons/fa";
import { LiaClipboardListSolid } from "react-icons/lia";
import { MdSupportAgent } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import logo from "../images/main.png";

// Base Menu Configs
const baseTopMenuItems = [
  { name: "Insights", icon: FaChartBar, path: "/insights", roles: ["admin", "architect"] },
  { name: "Projects", icon: FaFolder, path: "/projects", roles: ["admin", "architect", "client"] },
  { name: "Leads", icon: FaUserFriends, path: "/leadmanagement", roles: ["admin", "architect", "client"] },
  { name: "Quotation", icon: FaFileInvoiceDollar, path: "/quote", roles: ["admin", "architect"] },
  { name: "Quotation Requests", icon: FaFileInvoiceDollar, path: "/client-quotations", roles: ["client"] },
  { name: "Contracts", icon: FaFileContract, path: "/contracts", roles: ["admin", "architect", "client"] },
  { name: "Procurement", icon: LiaClipboardListSolid, path: "/procurement", roles: ["admin", "architect"] },
  { name: "Finance", icon: FaMoneyBillWave, path: "/finance", roles: ["admin", "architect"] },
  { name: "Vendors", icon: FaIdBadge, path: "/vendors", roles: ["admin", "architect"] },
  { name: "Settings", icon: IoIosSettings, path: "/settings", roles: ["admin", "architect", "client"] },
];

const bottomMenuItems = [
  { name: "Help Center", icon: FaGift, path: "/helpcenter" },
  { name: "Support", icon: MdSupportAgent, path: "/support" },
];

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  
  // Get user role from localStorage - initialize immediately to avoid empty menu
  const [userRole, setUserRole] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('crm_role') || '';
    }
    return '';
  });

  useEffect(() => {
    const role = localStorage.getItem('crm_role') || '';
    setUserRole(role);
  }, []);

  // Filter menu items based on user role
  const topMenuItems = baseTopMenuItems.filter(item => {
    if (!item.roles || item.roles.length === 0) return true;
    // If userRole is not set yet, show all items temporarily
    if (!userRole) return true;
    return item.roles.includes(userRole);
  });

  const handleItemClick = (path) => {
    const isSamePath = location.pathname === path;

    if (isSamePath) {
      setCollapsed((prev) => !prev); // Toggle collapse
    } else {
      setCollapsed(false); // Expand for new path
      navigate(path); // Navigate immediately without glitch
    }
  };

  const renderMenuItem = ({ name, icon: Icon, path }) => {
    const isActive = location.pathname === path;
    // Show "Requirement" instead of "Leads" for clients
    const displayName = name === "Leads" && userRole === "client" ? "Requirement" : name;

    return (
      <li key={name}>
        <button
          onClick={() => handleItemClick(path)}
          className={`w-full flex items-center px-4 py-3 rounded-lg 
            transition-colors duration-150
            ${collapsed ? "justify-center" : "justify-start"}
            ${
              isActive
                ? "bg-[#a00000] text-white"
                : "text-black hover:bg-red-100 hover:text-white"
            }`}
        >
          <Icon
            className={`text-xl ${isActive ? "text-white" : "text-black"}`}
          />
          {!collapsed && <span className="ml-3 font-semibold">{displayName}</span>}
        </button>
      </li>
    );
  };

  return (
    <div
      className={`${
        collapsed ? "w-20 p-2" : "w-64 p-4"
      } bg-white h-screen shadow-md transition-all duration-300 flex flex-col justify-between`}
    >
      {/* Logo Section */}
      <div>
        <div className="flex items-center justify-center mb-6">
          {!collapsed ? (
            <div className="flex items-center space-x-3">
              <img
                src={logo}
                alt="Logo"
                className="h-14 w-14 rounded-full object-cover shadow-md"
              />
              <div>
                <h1 className="font-bold text-lg leading-none">HUELIP</h1>
                <p className="text-xs tracking-wide font-semibold">PROJECTS</p>
              </div>
            </div>
          ) : (
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-10 mx-auto rounded-full"
            />
          )}
        </div>

        {/* Top Menu Items */}
        <ul className="space-y-2">{topMenuItems.map(renderMenuItem)}</ul>
      </div>

      {/* Bottom Menu Items */}
      <ul className="space-y-2 mt-4">{bottomMenuItems.map(renderMenuItem)}</ul>
    </div>
  );
};

export default SideBar;
