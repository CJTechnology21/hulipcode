import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../app/features/cart/cartSlice";
import mainLogo from "../Admin/images/main.png"; // ✅ Updated from huelip.png to main.png
import LocationSelector from "../Admin/components/Homecomponents/LocationSelector";
import { FaTimes, FaBars, FaChevronDown, FaSignOutAlt, FaUser, FaTachometerAlt } from "react-icons/fa";
import CategoryBar from "../client/components/CategoryBar";
import { useAuth } from "../context/AuthContext"; 

function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, logout, loading } = useAuth(); 

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

  const handleLogout = async () => {
    await logout(); 
    dispatch(clearCart()); 
    navigate("/login");
  };

  // Get dashboard route based on user role
  const getDashboardRoute = () => {
    if (userRole === 'architect') {
      return '/architectdashboard';
    } else if (userRole === 'vendor') {
      return '/vendordashboard';
    } else if (userRole === 'admin') {
      return '/dashboard/';
    } else if (userRole === 'client') {
      return '/projects';
    }
    return '/dashboard/'; // Default fallback
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
    <div>
      <div className="bg-white font-montreal">
        <header className="px-4 py-4 shadow-sm relative z-50 bg-white md:px-6">
          <div className="flex justify-between items-center md:py-2">
            {/* Left: Logo & Mobile Menu */}
            <div className="flex items-center gap-3">
              <button
                className="text-2xl md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <FaTimes /> : <FaBars />}
              </button>

              <div className="flex items-center gap-2">
                <img src={mainLogo} alt="Logo" className="h-10 w-10 md:h-12 md:w-12" />
                <span className="text-xl md:text-2xl font-bold text-gray-800">HUELIP</span>
              </div>
            </div>

            {/* Center Nav: Only desktop */}
            <nav className="hidden md:flex gap-6 items-center text-gray-700">
              <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
              <a href="/about" className="hover:text-blue-600 transition-colors">About</a>
              <a href="/professional" className="hover:text-blue-600 transition-colors">Professional</a>
              <a href="/ecom" className="hover:text-blue-600 transition-colors">Ecommerce</a>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {!user ? (
                <button
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-600 transition-colors"
                  onClick={() => navigate("/login")}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Login / Signup
                </button>
              ) : (
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
                    <div className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                      {user?.name?.charAt(0).toUpperCase() ||
                        user?.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>

                    {/* Display user's name and role */}
                    <div className="hidden md:flex flex-col items-start min-w-0">
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
                        <FaUser size={14} />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDropdownOpen(false);
                          navigate(getDashboardRoute());
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        type="button"
                      >
                        <FaTachometerAlt size={14} />
                        <span>Dashboard</span>
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
              )}
            </div>
          </div>

          {/* === Location Bar – Mobile ONLY === */}
          <div className="mt-4 flex justify-between items-center text-sm md:hidden">
            <LocationSelector />
          </div>

          {/* === Mobile Menu (Dropdown) === */}
          {menuOpen && (
            <div className="absolute top-full left-0 w-full bg-white shadow-md py-4 px-6 flex flex-col gap-4 md:hidden z-30">
              <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
              <a href="/about" className="hover:text-blue-600 transition-colors">About</a>
              <a href="/professional" className="hover:text-blue-600 transition-colors">Professional</a>
              <a href="/ecom" className="hover:text-blue-600 transition-colors">Ecommerce</a>

              {!user ? (
                <button
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold"
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Login / Signup
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-2 py-2 border-b border-gray-200">
                    <div className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase() ||
                        user?.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        {user?.name || user?.email || "User"}
                      </span>
                      {userRole && (
                        <span className="text-xs text-gray-600">
                          {getRoleDisplay(userRole)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2"
                    onClick={() => {
                      navigate("/profile");
                      setMenuOpen(false);
                    }}
                  >
                    <FaUser size={14} />
                    <span>Profile</span>
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2"
                    onClick={() => {
                      navigate(getDashboardRoute());
                      setMenuOpen(false);
                    }}
                  >
                    <FaTachometerAlt size={14} />
                    <span>Dashboard</span>
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Body Content */}
        <CategoryBar />
        {/* <HomeComponent /> */}
      </div>
    </div>
  );
}

export default HomeHeader;

// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { clearCart } from "../app/features/cart/cartSlice";
// import logo from "../Admin/images/huelip.png";
// import LocationSelector from "../Admin/components/Homecomponents/LocationSelector";
// import { FaTimes, FaBars } from "react-icons/fa";
// import CategoryBar from "../client/components/CategoryBar";
// import { useAuth } from "../context/AuthContext"; 
// import home_logo from "../Admin/images/main.png";
// function HomeHeader() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user, logout, loading } = useAuth(); 

//   const handleLogout = async () => {
//     await logout(); 
//     dispatch(clearCart()); 
//     navigate("/login");
//   };

//   return (
//     <div>
//       <div className="bg-white font-montreal">
        
//         <header className="px-4 py-4 shadow-sm relative z-50 bg-white md:px-6">
         
//           <div className="flex justify-between items-center md:py-2">
     
//             <div className="flex items-center gap-3">
//               <button
//                 className="text-2xl md:hidden"
//                 onClick={() => setMenuOpen(!menuOpen)}
//               >
//                 {menuOpen ? <FaTimes /> : <FaBars />}
//               </button>

     
//               <img src={home_logo} alt="Logo" className="h-10 w-20 md:hidden" />
//               <img src={home_logo} alt="Logo" className="h-10 w-20 hidden md:block" />
//             </div>

//             {/* Center Nav: Only desktop */}
//             <nav className="hidden md:flex gap-6 items-center text-gray-700">
//               <LocationSelector />
//               <a href="/ecom">Ecom</a>
//               <a href="/architectdashboard">Architect Dashboard</a>
//               <a href="/vendordashboard">Vendor Dashboard</a>
//               <a href="/lorem">Lorem Ipsum</a>
//             </nav>

//             {/* Right Actions */}
//             <div className="flex items-center gap-3">
//               <div className="hidden md:flex items-center gap-2">
//                 <input
//                   type="text"
//                   placeholder="Search"
//                   className="px-3 py-1 border rounded-lg text-sm"
//                 />
//                 <select className="text-sm border rounded-lg px-2 py-1">
//                   <option>Talent</option>
//                 </select>
//               </div>

//               {!user ? (
//                 <button
//                   className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm font-semibold"
//                   onClick={() => navigate("/login")}
//                 >
//                   Sign In
//                 </button>
//               ) : (
//                 <button
//                   className="bg-red-500 text-white px-4 py-1 rounded-md text-sm"
//                   onClick={handleLogout}
//                 >
//                   Logout
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* === Location Bar – Mobile ONLY === */}
//           <div className="mt-4 flex justify-between items-center text-sm md:hidden">
//             <LocationSelector />
//           </div>

//           {/* === Mobile Menu (Dropdown) === */}
//           {menuOpen && (
//             <div className="absolute top-full left-0 w-full bg-white shadow-md py-4 px-6 flex flex-col gap-4 md:hidden z-30">
//               <a href="/ecom">Ecom</a>
//               <a href="/architectdashboard">Architect Dashboard</a>
//               <a href="/vendordashboard">Vendor Dashboard</a>
//               <a href="/lorem">Lorem Ipsum</a>

//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="px-3 py-2 border rounded-lg text-sm"
//               />
//               <select className="text-sm border rounded-lg px-2 py-2">
//                 <option>Talent</option>
//               </select>

//               {!user ? (
//                 <>
//                   <button
//                     className="text-sm"
//                     onClick={() => navigate("/login")}
//                   >
//                     Log In
//                   </button>
//                   <button
//                     className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
//                     onClick={() => navigate("/login")}
//                   >
//                     Sign Up
//                   </button>
//                 </>
//               ) : (
//                 <button
//                   className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
//                   onClick={handleLogout}
//                 >
//                   Logout
//                 </button>
//               )}
//             </div>
//           )}
//         </header>

//         {/* Body Content */}
//         <CategoryBar />
//         {/* <HomeComponent /> */}
//       </div>
//     </div>
//   );
// }

// export default HomeHeader;
