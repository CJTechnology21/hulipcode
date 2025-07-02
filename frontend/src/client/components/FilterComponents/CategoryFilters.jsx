import React, { useState } from "react";

const allFilters = [
  "Abstract Art",
  "Cane Textures",
  "Cement Look",
  "Digital Series",
  "Embossed Pattern",
  "Fabric Textures",
  "Fluted Laminates",
  "Fluted Panels",
  "Geometric & Abstracts",
  "Leather Effect",
  "Marbles & Stones",
  "Metallic Finish",
  "Mirror Look",
  "Natural Rustic",
  "Plain Solids",
  "Shiny Sparkles",
  "Terrazzo",
  "Wave Pattern",
  "Wood & Laminate",
  "Wooden Effect",
];

const groupedFilters = allFilters.reduce((acc, item) => {
  const letter = item[0].toUpperCase();
  if (!acc[letter]) acc[letter] = [];
  acc[letter].push(item);
  return acc;
}, {});

export default function CategoryFilters() {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const toggleFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="mb-6 relative">
      <h3 className="font-medium mb-2">Categories</h3>
      <input
        type="text"
        placeholder="Search"
        className="w-full border px-2 py-1 rounded mb-2"
      />

      {/* First 6 filters */}
      {allFilters.slice(0, 6).map((filter) => (
        <label className="block" key={filter}>
          <input
            type="checkbox"
            className="mr-2"
            checked={selectedFilters.includes(filter)}
            onChange={() => toggleFilter(filter)}
          />
          {filter}
        </label>
      ))}

      <p
        className="text-blue-600 mt-2 cursor-pointer text-sm"
        onClick={() => setShowModal(true)}
      >
        + See {allFilters.length - 6} more
      </p>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-11/12 md:w-3/4 lg:w-1/2 p-6 max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Select Series</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-600 text-lg font-bold">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {Object.keys(groupedFilters)
                .sort()
                .map((letter) => (
                  <div key={letter}>
                    <h4 className="font-bold text-gray-700 mb-1">{letter}</h4>
                    {groupedFilters[letter].map((filter) => (
                      <label className="block mb-1" key={filter}>
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedFilters.includes(filter)}
                          onChange={() => toggleFilter(filter)}
                        />
                        {filter}
                      </label>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
