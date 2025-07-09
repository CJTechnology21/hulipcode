import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaFolder,
  FaUserFriends,
  FaFileInvoiceDollar,
  FaIdBadge,
  FaGift,
} from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import logo from "../images/heulip.png";

const topMenuItems = [
  { name: "Insights", icon: FaChartBar, path: "/insights" },
  { name: "Projects", icon: FaFolder, path: "/projects" },
  { name: "Leads", icon: FaUserFriends, path: "/leadmanagement" },
  { name: "Quotation", icon: FaFileInvoiceDollar, path: "/payments" },
  { name: "Vendors", icon: FaIdBadge, path: "/vendors" },
  { name: "Settings", icon: IoIosSettings, path: "/settings" },
];

const bottomMenuItems = [
  { name: "Help Center", icon: FaGift, path: "/helpcennter" },
  { name: "Support", icon: MdSupportAgent, path: "/support" },
];

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Collapse by default
  const [collapsed, setCollapsed] = useState(true);

  const handleItemClick = (path) => {
    // 🔹 Expand sidebar on click
    setCollapsed(false);

    // 🔹 Delay navigation for smooth UI transition
    setTimeout(() => {
      navigate(path);
    }, 100);
  };

  const renderMenuItem = ({ name, icon: Icon, path }) => {
    const isActive = location.pathname === path;

    return (
      <li key={name}>
        <button
          onClick={() => handleItemClick(path)}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300
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
      {/* Logo + HUELIP PROJECTS */}
      <div>
        <div className="flex items-center justify-center mb-6">
          {!collapsed ? (
            <div className="flex items-center space-x-3">
              <img
                src={logo}
                alt="Logo"
                className="h-14 w-14 rounded-full object-cover shadow-md"
              />

              {/* <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" /> */}
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

        {/* Top Menu */}
        <ul className="space-y-2">{topMenuItems.map(renderMenuItem)}</ul>
      </div>

      {/* Bottom Menu */}
      <ul className="space-y-2 mt-4">{bottomMenuItems.map(renderMenuItem)}</ul>
    </div>
  );
};

export default SideBar;

// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   FaChartBar,
//   FaFolder,
//   FaUserFriends,
//   FaFileInvoiceDollar,
//   FaIdBadge,
//   FaGift,
// } from "react-icons/fa";
// import { MdSupportAgent } from "react-icons/md";
// import { IoIosSettings } from "react-icons/io";
// import logo from "../images/logo.jpg";

// const topMenuItems = [
//   { name: "Insights", icon: FaChartBar, path: "/insights" },
//   { name: "Projects", icon: FaFolder, path: "/projects" },
//   { name: "Leads", icon: FaUserFriends, path: "/leadmanagement" },
//   { name: "Quotation", icon: FaFileInvoiceDollar, path: "/payments" },
//   { name: "Vendors", icon: FaIdBadge, path: "/vendors" },
//   { name: "Settings", icon: IoIosSettings, path: "/settings" },
// ];

// const bottomMenuItems = [
//   { name: "Help Center", icon: FaGift, path: "/helpcennter" },
//   { name: "Support", icon: MdSupportAgent, path: "/support" },
// ];

// const SideBar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [collapsed, setCollapsed] = useState(true);

//   const handleItemClick = (path) => {
//     // Toggle collapsed state on every item click
//     setCollapsed(prev => !prev);

//     // Wait a tick for UI to update, then navigate
//     setTimeout(() => {
//       navigate(path);
//     }, 100);
//   };

//   const renderMenuItem = ({ name, icon: Icon, path }) => {
//     const isActive = location.pathname === path;

//     return (
//       <li key={name}>
//         <button
//           onClick={() => handleItemClick(path)}
//           className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300
//             ${collapsed ? "justify-center" : "justify-start"}
//             ${
//               isActive
//                 ? "bg-[#a00000] text-white"
//                 : "text-black hover:bg-red-100 hover:text-white"
//             }`}
//         >
//           <Icon className={`text-xl ${isActive ? "text-white" : "text-black"}`} />
//           {!collapsed && <span className="ml-3 font-semibold">{name}</span>}
//         </button>
//       </li>
//     );
//   };

//   return (
//     <div
//       className={`${
//        collapsed ? "w-20 p-2" : "w-64 p-4"
//       } bg-white h-screen p-4 shadow-md transition-all duration-300 flex flex-col justify-between`}
//     >
//       {/* Logo + HUELIP PROJECTS */}
//       <div>
//         <div className="flex items-center justify-center mb-6">
//           {!collapsed ? (
//             <div className="flex items-center space-x-3">
//               <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
//               <div>
//                 <h1 className="font-bold text-lg leading-none">HUELIP</h1>
//                 <p className="text-xs tracking-wide font-semibold">PROJECTS</p>
//               </div>
//             </div>
//           ) : (
//             <img
//               src={logo}
//               alt="Logo"
//               className="h-10 w-10 mx-auto rounded-full"
//             />
//           )}
//         </div>

//         {/* Top Menu */}
//         <ul className="space-y-2">{topMenuItems.map(renderMenuItem)}</ul>
//       </div>

//       {/* Bottom Menu */}
//       <ul className="space-y-2 mt-4">{bottomMenuItems.map(renderMenuItem)}</ul>
//     </div>
//   );
// };

// export default SideBar;

// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   FaChartBar,
//   FaFolder,
//   FaUserFriends,
//   FaFileInvoiceDollar,
//   FaIdBadge,
//   FaGift,
// } from "react-icons/fa";
// import { MdSupportAgent } from "react-icons/md";
// import { IoIosSettings } from "react-icons/io";
// import logo from "../images/heulip.png"; // Replace if needed

// const topMenuItems = [
//   { name: "Insights", icon: FaChartBar, path: "/insights" },
//   { name: "Projects", icon: FaFolder, path: "/projects" },
//   { name: "Leads", icon: FaUserFriends, path: "/leadmanagement" },
//   { name: "Quotation", icon: FaFileInvoiceDollar, path: "/payments" },
//   { name: "Vendors", icon: FaIdBadge, path: "/vendors" },
//   { name: "Settings", icon: IoIosSettings, path: "/settings" },
// ];

// const bottomMenuItems = [
//   { name: "Help Center", icon: FaGift, path: "/helpcennter" },
//   { name: "Support", icon: MdSupportAgent, path: "/support" },
// ];

// const SideBar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [collapsed, setCollapsed] = useState(false);

//   const handleItemClick = (path) => {
//     // First, toggle sidebar
//     setCollapsed((prev) => !prev);

//     // Then, wait a tick and navigate
//     setTimeout(() => {
//       navigate(path);
//     }, 100); // delay to let UI update
//   };

//   const renderMenuItem = ({ name, icon: Icon, path }) => {
//     const isActive = location.pathname === path;

//     return (
//       <li key={name}>
//         <button
//           onClick={() => handleItemClick(path)}
//           className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300
//             ${collapsed ? "justify-center" : "justify-start"}
//             ${
//               isActive
//                 ? "bg-[#a00000] text-white"
//                 : "text-black hover:bg-red-100 hover:text-white"
//             }`}
//         >
//           <Icon className={`text-xl ${isActive ? "text-white" : "text-black"}`} />
//           {!collapsed && <span className="ml-3 font-semibold">{name}</span>}
//         </button>
//       </li>
//     );
//   };

//   return (
//     <div
//       className={`${
//         collapsed ? "w-20" : "w-64"
//       } bg-white h-screen p-4 shadow-md transition-all duration-300 flex flex-col justify-between`}
//     >
//       {/* Logo + Title */}
//       <div>
//         <div className="flex items-center justify-center mb-6">
//           {!collapsed ? (
//             <div className="flex items-center space-x-3">
//               <img src={logo} alt="" className="h-10 w-10 rounded-full" />
//               <div>
//                 <h1 className="font-bold text-lg leading-none">HUELIP</h1>
//                 <p className="text-xs tracking-wide font-semibold">PROJECTS</p>
//               </div>
//             </div>
//           ) : (
//             <img
//               src={logo}
//               alt="Logo"
//               className="h-10 w-10 mx-auto rounded-full"
//             />
//           )}
//         </div>

//         {/* Top Menu Items */}
//         <ul className="space-y-2">{topMenuItems.map(renderMenuItem)}</ul>
//       </div>

//       {/* Bottom Menu Items */}
//       <ul className="space-y-2 mt-4">{bottomMenuItems.map(renderMenuItem)}</ul>
//     </div>
//   );
// };

// export default SideBar;

// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   // FaTasks,
//   FaUserFriends,
//   FaComments,
//   FaFileAlt,
//   FaMoneyBill,
//   FaClipboardList,
//   FaIdBadge,
//   FaThLarge,
//   FaProjectDiagram,
// } from "react-icons/fa";
// import { IoIosSettings } from "react-icons/io";
// import logo from "../images/logo.jpg";
// // Store the icon component, not the element
// const menuItems = [
//   { name: "Dashboard", icon: FaThLarge, path: "/dashboard" },
//   { name: "Project Management", icon: FaProjectDiagram, path: "/projects" },
//   { name: "Lead Management", icon: FaUserFriends, path: "/leadmanagement" },
//   { name: "Client Communication", icon: FaComments, path: "/client" },
//   { name: "Document Storage", icon: FaFileAlt, path: "/documents" },
//   { name: "Payment Management", icon: FaMoneyBill, path: "/payments" },
//   { name: "Attendance", icon: FaClipboardList, path: "/attendance" },
//   { name: "Customer Detail", icon: FaIdBadge, path: "/customers" },
//   { name: "Settings", icon: IoIosSettings, path: "/settings" },
// ];

// const SideBar = ({ toggleSidebar }) => {
//   const handleClick = () => {
//     if (window.innerWidth < 768 && toggleSidebar) {
//       toggleSidebar(false);
//     }
//   };

//   return (
//     <div className="w-64 bg-white h-full p-4 shadow-md z-50">
//       <div className="flex justify-center items-center mb-4">
//         <img
//           src={logo}
//           alt=""
//           className="h-14 w-32 flex justify-center items-center"
//         />
//       </div>
//       <ul className="space-y-2">
//         {menuItems.map(({ name, icon: Icon, path }) => (
//           <li key={name}>
//             <NavLink
//               to={path}
//               onClick={handleClick}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-100 transition-all ${
//                   isActive
//                     ? "bg-blue-100 text-blue-700 font-semibold"
//                     : "text-gray-700"
//                 }`
//               }
//             >
//               <Icon />
//               {name}
//             </NavLink>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SideBar;
