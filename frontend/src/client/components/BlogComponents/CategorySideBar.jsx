import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import SearchBar from "../../../components/SearchBar"; 

function CategorySidebar() {
  const categories = [
    { name: "Fashion", count: 1 },
    { name: "Fitness", count: 1 },
    { name: "Food", count: 1 },
    { name: "Home Decor", count: 1 },
    { name: "Life Style", count: 13 },
    { name: "Mindfulness", count: 1 },
    { name: "Skin Care", count: 1 },
    { name: "Travel", count: 1 },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  // Optional: You can filter categories by searchTerm
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Search Box */}
      <div className="relative mb-6">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="pr-12"
        />
        <button className="absolute top-1/2 -translate-y-1/2 right-2 bg-black text-white p-2 rounded-full">
          <FaSearch size={14} />
        </button>
      </div>

      {/* Categories */}
      <h3 className="font-bold text-lg mb-4">Categories</h3>
      <ul className="space-y-4">
        {filteredCategories.map((cat, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center border-b pb-2"
          >
            <div className="flex items-center gap-2">
              <FiChevronRight className="text-gray-600" />
              <span>{cat.name}</span>
            </div>
            <span className="text-sm text-gray-600 border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center">
              {cat.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategorySidebar;
