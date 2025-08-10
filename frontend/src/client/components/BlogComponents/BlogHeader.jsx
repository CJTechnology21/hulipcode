import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaPinterestP, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import Button from "../../../components/Button";

function BlogHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <header className="border-b">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="hidden md:flex items-center gap-4">
          <FaFacebookF className="text-black text-lg cursor-pointer" />
          <FaXTwitter className="text-black text-lg cursor-pointer" />
          <FaPinterestP className="text-black text-lg cursor-pointer" />
          <FaInstagram className="text-black text-lg cursor-pointer" />
        </div>

        <div className="text-2xl font-bold">Huelip</div>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Light</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-black transition-colors"></div>
              <div className="absolute left-1 top-0.5 w-4 h-4 bg-black rounded-full peer-checked:translate-x-5 peer-checked:bg-white transition-transform"></div>
            </label>
            <span className="text-gray-500">Dark</span>
          </div>

          <Button
            variant="custom"
            className="bg-black text-white px-4 py-2 rounded-full font-semibold"
          >
            Let’s talk!
          </Button>
        </div>

        <Button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-3 border-t bg-white relative">
        <ul className="hidden md:flex items-center gap-6 font-semibold text-black relative">
          {/* Home */}
          <li className="relative">
            <button
              className="flex items-center gap-1"
              onClick={() => toggleDropdown("home")}
            >
              Home <FaChevronDown className="text-gray-500 text-xs" />
            </button>
            {openDropdown === "home" && (
              <ul className="absolute left-0 mt-2 min-w-[160px] bg-white border rounded shadow-lg whitespace-nowrap z-50">
                <li>
                  <Link
                    to="/"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpenDropdown(null)}
                  >
                    Homepage 1
                  </Link>
                </li>
                <li>
                  <Link
                    to="/home2"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpenDropdown(null)}
                  >
                    Homepage 2
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <span className="text-gray-300">/</span>

          {/* Post Styles */}
          <li className="relative">
            <button
              className="flex items-center gap-1"
              onClick={() => toggleDropdown("postStyles")}
            >
              Post Styles <FaChevronDown className="text-gray-500 text-xs" />
            </button>
            {openDropdown === "postStyles" && (
              <ul className="absolute left-0 mt-2 min-w-[160px] bg-white border rounded shadow-lg whitespace-nowrap z-50">
                <li>
                  <Link
                    to="/poststyleone"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpenDropdown(null)}
                  >
                    PostStyle 1
                  </Link>
                </li>
                <li>
                  <Link
                    to="/poststyletwo"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpenDropdown(null)}
                  >
                    PostStyle 2
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <span className="text-gray-300">/</span>

          {/* Categories */}
          <li className="relative">
            <button
              className="flex items-center gap-1"
              onClick={() => toggleDropdown("categories")}
            >
              Categories <FaChevronDown className="text-gray-500 text-xs" />
            </button>
            {openDropdown === "categories" && (
              <ul className="absolute left-0 mt-2 min-w-[160px] bg-white border rounded shadow-lg whitespace-nowrap z-50">
                <li>
                  <Link
                    to="/categoryone"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpenDropdown(null)}
                  >
                    Category 1
                  </Link>
                </li>
                <li>
                  <Link
                    to="/categorytwo"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpenDropdown(null)}
                  >
                    Category 2
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <span className="text-gray-300">/</span>

          <li>
            <Link to="/about">About</Link>
          </li>
          <span className="text-gray-300">/</span>
          <li>
            <Link to="/contact">Contact Us</Link>
          </li>
        </ul>

        <FiSearch className="text-black text-lg cursor-pointer" />
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-4 bg-white border-t">
          <div className="flex gap-4">
            <FaFacebookF className="text-black text-lg cursor-pointer" />
            <FaXTwitter className="text-black text-lg cursor-pointer" />
            <FaPinterestP className="text-black text-lg cursor-pointer" />
            <FaInstagram className="text-black text-lg cursor-pointer" />
          </div>

          <ul className="space-y-2 font-semibold text-black">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/poststyleone">PostStyle 1</Link></li>
            <li><Link to="/poststyletwo">PostStyle 2</Link></li>
            <li><Link to="/categoryone">Category 1</Link></li>
            <li><Link to="/categorytwo">Category 2</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>

          <div className="flex items-center gap-2">
            <span>Light</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-black transition-colors"></div>
              <div className="absolute left-1 top-0.5 w-4 h-4 bg-black rounded-full peer-checked:translate-x-5 peer-checked:bg-white transition-transform"></div>
            </label>
            <span className="text-gray-500">Dark</span>
          </div>

          <Button
            variant="custom"
            className="bg-black text-white px-4 py-2 rounded-full font-semibold w-full"
          >
            Let's talk!
          </Button>
        </div>
      )}
    </header>
  );
}

export default BlogHeader;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { FaFacebookF, FaPinterestP, FaInstagram } from "react-icons/fa";
// import { FaXTwitter } from "react-icons/fa6";
// import { FiMenu, FiX, FiSearch } from "react-icons/fi";
// import { FaChevronDown } from "react-icons/fa";
// import Button from "../../../components/Button";

// function BlogHeader() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <header className="border-b">
//       {/* Top social & logo */}
//       <div className="flex items-center justify-between px-6 py-4">
//         <div className="hidden md:flex items-center gap-4">
//           <FaFacebookF className="text-black text-lg cursor-pointer" />
//           <FaXTwitter className="text-black text-lg cursor-pointer" />
//           <FaPinterestP className="text-black text-lg cursor-pointer" />
//           <FaInstagram className="text-black text-lg cursor-pointer" />
//         </div>

//         <div className="text-2xl font-bold">Huelip</div>

//         <div className="hidden md:flex items-center gap-4">
//           <div className="flex items-center gap-2">
//             <span>Light</span>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input type="checkbox" className="sr-only peer" />
//               <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-black transition-colors"></div>
//               <div className="absolute left-1 top-0.5 w-4 h-4 bg-black rounded-full peer-checked:translate-x-5 peer-checked:bg-white transition-transform"></div>
//             </label>
//             <span className="text-gray-500">Dark</span>
//           </div>

//           <Button
//             variant="custom"
//             className="bg-black text-white px-4 py-2 rounded-full font-semibold"
//           >
//             Let’s talk!
//           </Button>
//         </div>

//         <Button
//           className="md:hidden text-2xl"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           {menuOpen ? <FiX /> : <FiMenu />}
//         </Button>
//       </div>

//       {/* Main nav */}
//       <nav className="flex items-center justify-between px-6 py-3 border-t bg-white relative">
//         <ul className="hidden md:flex items-center gap-6 font-semibold text-black relative">
//           {/* Home */}
//           <li className="relative group cursor-pointer">
//             <div className="flex items-center gap-1">
//               Home <FaChevronDown className="text-gray-500 text-xs" />
//             </div>
//             <ul className="absolute left-0 mt-2 min-w-[160px] bg-white border rounded shadow-lg hidden group-hover:block whitespace-nowrap">
//               <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
//                 <Link to="/">Homepage 1</Link>
//               </li>
//               <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
//                 <Link to="/home2">Homepage 2</Link>
//               </li>
//             </ul>
//           </li>

//           <span className="text-gray-300">/</span>

//           {/* Post Styles */}
//           <li className="relative group cursor-pointer">
//             <div className="flex items-center gap-1">
//               Post Styles <FaChevronDown className="text-gray-500 text-xs" />
//             </div>
//             <ul className="absolute left-0 mt-2 min-w-[160px] bg-white border rounded shadow-lg hidden group-hover:block whitespace-nowrap">
//               <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
//                 <Link to="/poststyleone">PostStyle 1</Link>
//               </li>
//               <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
//                 <Link to="/poststyletwo">PostStyle 2</Link>
//               </li>
//             </ul>
//           </li>

//           <span className="text-gray-300">/</span>

//           {/* Categories */}
//           <li className="relative group cursor-pointer">
//             <div className="flex items-center gap-1">
//               Categories <FaChevronDown className="text-gray-500 text-xs" />
//             </div>
//             <ul className="absolute left-0 mt-2 min-w-[160px] bg-white border rounded shadow-lg hidden group-hover:block whitespace-nowrap">
//               <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
//                 <Link to="/category1">Category 1</Link>
//               </li>
//               <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
//                 <Link to="/category2">Category 2</Link>
//               </li>
//             </ul>
//           </li>

//           <span className="text-gray-300">/</span>

//           <li className="cursor-pointer">
//             <Link to="/about">About</Link>
//           </li>
//           <span className="text-gray-300">/</span>
//           <li className="cursor-pointer">
//             <Link to="/contact">Contact Us</Link>
//           </li>
//         </ul>

//         <FiSearch className="text-black text-lg cursor-pointer" />
//       </nav>

//       {/* Mobile menu */}
//       {menuOpen && (
//         <div className="md:hidden px-6 pb-4 space-y-4 bg-white border-t">
//           <div className="flex gap-4">
//             <FaFacebookF className="text-black text-lg cursor-pointer" />
//             <FaXTwitter className="text-black text-lg cursor-pointer" />
//             <FaPinterestP className="text-black text-lg cursor-pointer" />
//             <FaInstagram className="text-black text-lg cursor-pointer" />
//           </div>

//           <ul className="space-y-2 font-semibold text-black">
//             <li>
//               <Link to="/">Home</Link>
//             </li>
//             <li>
//               <Link to="/poststyleone">PostStyle 1</Link>
//             </li>
//             <li>
//               <Link to="/poststyletwo">PostStyle 2</Link>
//             </li>
//             <li>
//               <Link to="/category1">Category 1</Link>
//             </li>
//             <li>
//               <Link to="/category2">Category 2</Link>
//             </li>
//             <li>
//               <Link to="/about">About</Link>
//             </li>
//             <li>
//               <Link to="/contact">Contact Us</Link>
//             </li>
//           </ul>

//           <div className="flex items-center gap-2">
//             <span>Light</span>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input type="checkbox" className="sr-only peer" />
//               <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-black transition-colors"></div>
//               <div className="absolute left-1 top-0.5 w-4 h-4 bg-black rounded-full peer-checked:translate-x-5 peer-checked:bg-white transition-transform"></div>
//             </label>
//             <span className="text-gray-500">Dark</span>
//           </div>

//           <Button
//             variant="custom"
//             className="bg-black text-white px-4 py-2 rounded-full font-semibold w-full"
//           >
//             Let's talk!
//           </Button>
//         </div>
//       )}
//     </header>
//   );
// }

// export default BlogHeader;
