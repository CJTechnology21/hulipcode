import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { FaChevronDown } from "react-icons/fa";

const Header = ({ title = "Dashboard", toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white border-b px-4 md:px-6 py-4 flex justify-between items-center shadow-sm">
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
        {/* <img src={logo} alt="Calgary Logo" className="h-8 w-8 object-contain" /> */}
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
        <div
          className="flex items-center bg-white text-black border border-gray-300 rounded-full px-3 py-1 gap-2 cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <div className="w-6 h-6 bg-yellow-400 text-black rounded-full flex items-center justify-center text-sm font-bold">
            P
          </div>
          <span className="text-sm font-semibold">Pradeep</span>
          <FaChevronDown size={12} className="text-black" />
        </div>
      </div>
    </header>
  );
};

export default Header;
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { FaSearch, FaBell, FaBackward } from "react-icons/fa";
// import { BsChatText } from "react-icons/bs";
// import { HiMenu } from "react-icons/hi";
// import User from "../images/user.png";

// const Header = ({ title = "Dashboard", toggleSidebar }) => {
//   const navigate = useNavigate();

//   return (
//     <header className="w-full bg-white border-b px-4 md:px-6 py-4 flex justify-between items-center shadow-sm">
//       {/* Left Section */}
//       <div className="flex items-center gap-3 shrink-0">
//         <button className="md:hidden text-blue-600" onClick={toggleSidebar}>
//           <HiMenu size={24} />
//         </button>

//         <button
//           onClick={() => navigate(-1)}
//           className="w-10 h-10 bg-white text-blue-500 border border-blue-500 rounded-full items-center justify-center hidden md:flex"
//         >
//           <FaBackward size={20} />
//         </button>

//         <h1 className="text-lg font-semibold font-fredoka truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
//           {title}
//         </h1>
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center gap-3 md:gap-4 flex-nowrap overflow-x-auto">
//         {/* Search: Input on md+, button on small */}
//         <div className="relative hidden md:block">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="border border-blue-500 rounded-full px-4 py-2 text-sm w-48 md:w-64 outline-none"
//           />
//           <FaSearch className="absolute right-3 top-2.5 text-blue-500 text-sm" />
//         </div>

//         <button className="md:hidden w-10 h-10 bg-white text-blue-500 rounded-full flex items-center justify-center">
//           <FaSearch size={18} />
//         </button>

//         <button className="w-10 h-10 bg-white text-blue-500 rounded-full flex items-center justify-center shrink-0">
//           <BsChatText size={20} />
//         </button>

//         <button className="w-10 h-10 bg-white text-blue-500 rounded-full flex items-center justify-center shrink-0">
//           <FaBell size={20} />
//         </button>

//         <img
//           src={User}
//           alt="User Avatar"
//           className="w-9 h-9 rounded-full object-cover cursor-pointer shrink-0"
//           onClick={() => navigate("/profile")}
//         />
//       </div>
//     </header>
//   );
// };

// export default Header;
