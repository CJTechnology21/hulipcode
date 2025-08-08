import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaFolder,
  FaUserFriends,
  FaFileInvoiceDollar,
  FaIdBadge,
  FaGift,
  FaMoneyBillWave,
} from "react-icons/fa";
import { LiaClipboardListSolid } from "react-icons/lia";
import { MdSupportAgent } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import logo from "../images/main.png";

// Menu Configs
const topMenuItems = [
  { name: "Insights", icon: FaChartBar, path: "/insights" },
  { name: "Projects", icon: FaFolder, path: "/projects" },
  { name: "Leads", icon: FaUserFriends, path: "/leadmanagement" },
  { name: "Quotation", icon: FaFileInvoiceDollar, path: "/quote" },
  { name: "Procurement", icon: LiaClipboardListSolid, path: "/procurement" },
  { name: "Finance", icon: FaMoneyBillWave, path: "/finance" },
  { name: "Vendors", icon: FaIdBadge, path: "/vendors" },
  { name: "Settings", icon: IoIosSettings, path: "/settings" },
];

const bottomMenuItems = [
  { name: "Help Center", icon: FaGift, path: "/helpcenter" },
  { name: "Support", icon: MdSupportAgent, path: "/support" },
];

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);

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
          {!collapsed && <span className="ml-3 font-semibold">{name}</span>}
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
