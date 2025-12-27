import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { FaChevronDown } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Header = ({ title = "Dashboard", toggleSidebar }) => {
  const navigate = useNavigate();
  const authContext = useAuth();
  const user = authContext?.user || null;
  const [userRole, setUserRole] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get user role from localStorage or user object
  useEffect(() => {
    const role = localStorage.getItem('crm_role') || user?.role || '';
    setUserRole(role);
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Handle logout
  const handleLogout = async () => {
    try {
      if (authContext?.logout) {
        await authContext.logout();
      }
      // Clear localStorage
      localStorage.removeItem('crm_role');
      localStorage.removeItem('token');
      // Navigate to login
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still navigate to login even if logout fails
      localStorage.removeItem('crm_role');
      localStorage.removeItem('token');
      navigate("/login");
    }
  };

  // Format role for display
  const getRoleDisplay = (role) => {
    if (!role) return "";
    const roleMap = {
      'architect': 'Professional',
      'client': 'Client',
      'admin': 'Admin',
      'Site Staff': 'Site Staff',
      'vendor': 'Vendor',
      'Labour Contractor': 'Labour Contractor',
      'Subcon': 'Subcon',
      'Material Supplier': 'Material Supplier',
      'Service Provider': 'Service Provider'
    };
    return roleMap[role] || role;
  };

  return (
    <header className="w-full bg-white border-b px-4 md:px-6 py-4 flex justify-between items-center shadow-sm relative z-50">
      {/* Left Section */}
      <div className="flex items-center gap-3 shrink-0">
        <button className="md:hidden text-blue-600" onClick={toggleSidebar}>
          <HiMenu size={24} />
        </button>

        <h1 className="text-lg font-semibold font-fredoka truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
          {title}
        </h1>
      </div>

      {/* Center: Calgary Logo & Name */}
      <div className="hidden md:flex items-center justify-end gap-2">
        <span className="text-md font-bold text-left text-[#002f5f]">
          Calgary Interiors Pvt. Ltd.
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 md:gap-4 flex-nowrap overflow-x-auto">
        <button className="w-10 h-10 bg-white text-yellow-400 rounded-full flex items-center justify-center shrink-0">
          <FaBell size={20} />
        </button>

        {/* Profile Dropdown Pill */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="flex items-center bg-white text-black border border-gray-300 rounded-full px-3 py-1.5 gap-2 cursor-pointer hover:bg-gray-50 transition-colors focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDropdownOpen(!dropdownOpen);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
          >
            {/* Avatar Circle (first letter of user's name/email) */}
            <div className="w-6 h-6 bg-yellow-400 text-black rounded-full flex items-center justify-center text-sm font-bold shrink-0">
              {user?.name?.charAt(0).toUpperCase() ||
                user?.email?.charAt(0).toUpperCase() ||
                "U"}
            </div>

            {/* Display user's name and role */}
            <div className="flex flex-col items-start min-w-0">
              <span className="text-sm font-semibold truncate">
                {user?.name || user?.email || "User"}
              </span>
              {userRole && (
                <span className="text-xs text-gray-600 font-medium">
                  {getRoleDisplay(userRole)}
                </span>
              )}
            </div>

             <FaChevronDown 
               size={12} 
               className={`text-black shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
             />
           </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div 
              className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] overflow-hidden"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDropdownOpen(false);
                  navigate("/profile");
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                type="button"
              >
                <span>Profile</span>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDropdownOpen(false);
                  handleLogout();
                }}
                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                type="button"
              >
                <FaSignOutAlt size={14} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

// import { useNavigate } from "react-router-dom";
// import { FaBell } from "react-icons/fa";
// import { HiMenu } from "react-icons/hi";
// import { FaChevronDown } from "react-icons/fa";

// const Header = ({ title = "Dashboard", toggleSidebar }) => {
//   const navigate = useNavigate();

//   return (
//     <header className="w-full bg-white border-b px-4 md:px-6 py-4 flex justify-between items-center shadow-sm">
//       {/* Left Section */}
//       <div className="flex items-center gap-3 shrink-0">
//         <button className="md:hidden text-blue-600" onClick={toggleSidebar}>
//           <HiMenu size={24} />
//         </button>

//         <h1 className="text-lg font-semibold font-fredoka truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
//           {title}
//         </h1>
//       </div>

//       {/* Center: Calgary Logo & Name */}
//       <div className="hidden md:flex items-center justify-end gap-2">
//         {/* <img src={logo} alt="Calgary Logo" className="h-8 w-8 object-contain" /> */}
//         <span className="text-md font-bold text-left text-[#002f5f]">
//           Calgary Interiors Pvt. Ltd.
//         </span>
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center gap-3 md:gap-4 flex-nowrap overflow-x-auto">
//         <button className="w-10 h-10 bg-white text-yellow-400 rounded-full flex items-center justify-center shrink-0">
//           <FaBell size={20} />
//         </button>

//         {/* Profile Dropdown Pill */}
//         <div
//           className="flex items-center bg-white text-black border border-gray-300 rounded-full px-3 py-1 gap-2 cursor-pointer"
//           onClick={() => navigate("/profile")}
//         >
//           <div className="w-6 h-6 bg-yellow-400 text-black rounded-full flex items-center justify-center text-sm font-bold">
//             P
//           </div>
//           <span className="text-sm font-semibold">Pradeep</span>
//           <FaChevronDown size={12} className="text-black" />
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
