import React from "react";
import { NavLink } from "react-router-dom";
import {
  // FaTasks,
  FaUserFriends,
  FaComments,
  FaFileAlt,
  FaMoneyBill,
  FaClipboardList,
  FaIdBadge,
  FaThLarge,
  FaProjectDiagram,
} from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import logo from "../images/logo.jpg";
// Store the icon component, not the element
const menuItems = [
  { name: "Dashboard", icon: FaThLarge, path: "/dashboard" },
  // { name: "Task Management", icon: FaTasks, path: "/task" },
  { name: "Project Management", icon: FaProjectDiagram, path: "/projects" },
  { name: "Lead Management", icon: FaUserFriends, path: "/leadmanagement" },
  { name: "Client Communication", icon: FaComments, path: "/client" },
  { name: "Document Storage", icon: FaFileAlt, path: "/documents" },
  { name: "Payment Management", icon: FaMoneyBill, path: "/payments" },
  { name: "Attendance", icon: FaClipboardList, path: "/attendance" },
  { name: "Customer Detail", icon: FaIdBadge, path: "/customers" },
  { name: "Settings", icon: IoIosSettings, path: "/settings" },
];

const SideBar = ({ toggleSidebar }) => {
  const handleClick = () => {
    if (window.innerWidth < 768 && toggleSidebar) {
      toggleSidebar(false);
    }
  };

  return (
    <div className="w-64 bg-white h-full p-4 shadow-md z-50">
      <div className="flex justify-center items-center mb-4">
        <img
          src={logo}
          alt=""
          className="h-14 w-32 flex justify-center items-center"
        />
      </div>
      <ul className="space-y-2">
        {menuItems.map(({ name, icon: Icon, path }) => (
          <li key={name}>
            <NavLink
              to={path}
              onClick={handleClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-100 transition-all ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700"
                }`
              }
            >
              <Icon />
              {name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;

// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FaTasks,
//   FaUserFriends,
//   FaComments,
//   FaFileAlt,
//   FaMoneyBill,
//   FaClipboardList,
//   FaIdBadge,
//   FaThLarge,
// } from "react-icons/fa";

// const menuItems = [
//   { name: "Dashboard", icon: <FaThLarge />, path: "/dashboard" },
//   { name: "Task Management", icon: <FaTasks />, path: "/dashboard/task" },
//   { name: "Lead Management", icon: <FaUserFriends />, path: "/dashboard/leadmanagement" },
//   { name: "Client Communication", icon: <FaComments />, path: "/dashboard/client" },
//   { name: "Document Storage", icon: <FaFileAlt />, path: "/dashboard/documents" },
//   { name: "Payment Management", icon: <FaMoneyBill />, path: "/dashboard/payments" },
//   { name: "Attendance", icon: <FaClipboardList />, path: "/dashboard/attendance" },
//   { name: "Customer Detail", icon: <FaIdBadge />, path: "/dashboard/customers" },
// ];

// const SideBar = ({ toggleSidebar }) => {
//   const handleClick = () => {
//     // Auto close only on mobile
//     if (window.innerWidth < 768 && toggleSidebar) {
//       toggleSidebar(false);
//     }
//   };

//   return (
//     <div className="w-64 bg-white h-full p-4 shadow-md z-50">
//       <h2 className="text-xl font-bold mb-6">Your Logo</h2>
//       <ul className="space-y-2">
//         {menuItems.map((item) => (
//           <li key={item.name}>
//             <NavLink
//               to={item.path}
//               onClick={handleClick}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-100 ${
//                   isActive ? "bg-blue-100 text-blue-700 font-semibold" : ""
//                 }`
//               }
//             >
//               {item.icon}
//               {item.name}
//             </NavLink>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SideBar;
