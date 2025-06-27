import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaBell, FaBackward } from "react-icons/fa";
import { BsChatText } from "react-icons/bs";
import { HiMenu } from "react-icons/hi";
import User from "../images/user.png";

const Header = ({ title = "Dashboard", toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white border-b px-4 md:px-6 py-4 flex justify-between items-center shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-3 shrink-0">
        <button className="md:hidden text-blue-600" onClick={toggleSidebar}>
          <HiMenu size={24} />
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white text-blue-500 border border-blue-500 rounded-full items-center justify-center hidden md:flex"
        >
          <FaBackward size={20} />
        </button>

        <h1 className="text-lg font-semibold font-fredoka truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
          {title}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 md:gap-4 flex-nowrap overflow-x-auto">
        {/* Search: Input on md+, button on small */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="border border-blue-500 rounded-full px-4 py-2 text-sm w-48 md:w-64 outline-none"
          />
          <FaSearch className="absolute right-3 top-2.5 text-blue-500 text-sm" />
        </div>

        <button className="md:hidden w-10 h-10 bg-white text-blue-500 rounded-full flex items-center justify-center">
          <FaSearch size={18} />
        </button>

        <button className="w-10 h-10 bg-white text-blue-500 rounded-full flex items-center justify-center shrink-0">
          <BsChatText size={20} />
        </button>

        <button className="w-10 h-10 bg-white text-blue-500 rounded-full flex items-center justify-center shrink-0">
          <FaBell size={20} />
        </button>

        <img
          src={User}
          alt="User Avatar"
          className="w-9 h-9 rounded-full object-cover cursor-pointer shrink-0"
          onClick={() => navigate("/profile")}
        />
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
//       {/* Left Section: Hamburger + Back (hidden on small) + Title */}
//       <div className="flex items-center gap-3 shrink-0">
//         <button className="md:hidden text-blue-600" onClick={toggleSidebar}>
//           <HiMenu size={24} />
//         </button>

//         <button
//           onClick={() => navigate(-1)}
//           className="w-10 h-10 bg-white text-blue-500 border border-blue-500 rounded-full flex items-center justify-center hidden md:flex"
//         >
//           <FaBackward size={20} />
//         </button>

//         <h1 className="text-lg font-semibold font-fredoka truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
//           {title}
//         </h1>
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center gap-3 md:gap-4 flex-nowrap overflow-x-auto">
//         {/* Search: Icon only on small, full input on md+ */}
//         <div className="relative">
//           {/* Full Input on md+ */}
//           <input
//             type="text"
//             placeholder="Search..."
//             className="hidden md:block border border-blue-500 rounded-full px-4 py-2 text-sm w-48 md:w-64 outline-none"
//           />
//           {/* Search Icon always visible */}
//           <button className="absolute right-3 top-2.5 text-blue-500 md:hidden">
//             <FaSearch size={18} />
//           </button>
//           {/* On md+, the icon is decorative inside input */}
//           <FaSearch className="absolute right-3 top-2.5 text-blue-500 text-sm hidden md:block" />
//         </div>

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
