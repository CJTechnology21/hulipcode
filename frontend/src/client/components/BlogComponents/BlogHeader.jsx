import React, { useState } from "react";
import { FaFacebookF, FaPinterestP, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";

function BlogHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Social Icons */}
        <div className="hidden md:flex items-center gap-4">
          <FaFacebookF className="text-black text-lg cursor-pointer" />
          <FaXTwitter className="text-black text-lg cursor-pointer" />
          <FaPinterestP className="text-black text-lg cursor-pointer" />
          <FaInstagram className="text-black text-lg cursor-pointer" />
        </div>

        {/* Logo */}
        <div className="text-2xl font-bold">Huelip</div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          {/* Light/Dark toggle */}
          <div className="flex items-center gap-2">
            <span>Light</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-black transition-colors"></div>
              <div className="absolute left-1 top-0.5 w-4 h-4 bg-black rounded-full peer-checked:translate-x-5 peer-checked:bg-white transition-transform"></div>
            </label>
            <span className="text-gray-500">Dark</span>
          </div>

          {/* Button */}
          <button className="bg-black text-white px-4 py-2 rounded-full font-semibold">
            Let’s talk!
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Second Navigation Row */}
      <nav className="flex items-center justify-between px-6 py-3 border-t bg-white relative">
        {/* Nav Links */}
        <ul className="hidden md:flex items-center gap-6 font-semibold text-black relative">
          {/* Home */}
          <li className="relative group cursor-pointer">
            <div className="flex items-center gap-1">
              Home <FaChevronDown className="text-gray-500 text-xs" />
            </div>
            <ul className="absolute left-0 mt-2 bg-white border rounded shadow-lg hidden group-hover:block">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Homepage 1</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Homepage 2</li>
            </ul>
          </li>

          <span className="text-gray-300">/</span>

          {/* Post Styles */}
          <li className="relative group cursor-pointer">
            <div className="flex items-center gap-1">
              Post Styles <FaChevronDown className="text-gray-500 text-xs" />
            </div>
            <ul className="absolute left-0 mt-2 bg-white border rounded shadow-lg hidden group-hover:block">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">PostStyle 1</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">PostStyle 2</li>
            </ul>
          </li>

          <span className="text-gray-300">/</span>

          {/* Categories */}
          <li className="relative group cursor-pointer">
            <div className="flex items-center gap-1">
              Categories <FaChevronDown className="text-gray-500 text-xs" />
            </div>
            <ul className="absolute left-0 mt-2 bg-white border rounded shadow-lg hidden group-hover:block">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Category 1</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Category 2</li>
            </ul>
          </li>

          <span className="text-gray-300">/</span>

          <li className="cursor-pointer">About</li>
          <span className="text-gray-300">/</span>
          <li className="cursor-pointer">Contact Us</li>
        </ul>

        {/* Search Icon */}
        <FiSearch className="text-black text-lg cursor-pointer" />
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-4 bg-white border-t">
          {/* Social icons */}
          <div className="flex gap-4">
            <FaFacebookF className="text-black text-lg cursor-pointer" />
            <FaXTwitter className="text-black text-lg cursor-pointer" />
            <FaPinterestP className="text-black text-lg cursor-pointer" />
            <FaInstagram className="text-black text-lg cursor-pointer" />
          </div>

          {/* Nav links */}
          <ul className="space-y-2 font-semibold text-black">
            <li>Home</li>
            <li>Post Styles</li>
            <li>Categories</li>
            <li>About</li>
            <li>Contact Us</li>
          </ul>

          {/* Light/Dark toggle */}
          <div className="flex items-center gap-2">
            <span>Light</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-black transition-colors"></div>
              <div className="absolute left-1 top-0.5 w-4 h-4 bg-black rounded-full peer-checked:translate-x-5 peer-checked:bg-white transition-transform"></div>
            </label>
            <span className="text-gray-500">Dark</span>
          </div>

          {/* Button */}
          <button className="bg-black text-white px-4 py-2 rounded-full font-semibold w-full">
            Let’s talk!
          </button>
        </div>
      )}
    </header>
  );
}

export default BlogHeader;
