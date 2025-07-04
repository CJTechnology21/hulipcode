import React, { useEffect, useState } from "react";

const allBaseMaterials = ["WPC"]; // You can expand this list

export default function BaseMaterialFilter({ selected = [], onChange }) {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFilter = (filter) => {
    if (selected.includes(filter)) {
      onChange(selected.filter((f) => f !== filter));
    } else {
      onChange([...selected, filter]);
    }
  };

  const filtered = allBaseMaterials.filter((f) =>
    f.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-6 relative">
      <h3 className="font-medium mb-2">Base Material</h3>
      <input
        type="text"
        placeholder="Search Base Material"
        className="w-full border px-2 py-1 rounded mb-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filtered.slice(0, 6).map((filter) => (
        <label className="block" key={filter}>
          <input
            type="checkbox"
            className="mr-2"
            checked={selected.includes(filter)}
            onChange={() => toggleFilter(filter)}
          />
          {filter} (1)
        </label>
      ))}

      {filtered.length > 6 && (
        <p
          className="text-blue-600 mt-2 cursor-pointer text-sm"
          onClick={() => setShowModal(true)}
        >
          + See more ({filtered.length - 6})
        </p>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-11/12 md:w-3/4 lg:w-1/2 p-6 max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Select Base Material</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {filtered.map((filter) => (
                <label className="block mb-1" key={filter}>
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selected.includes(filter)}
                    onChange={() => toggleFilter(filter)}
                  />
                  {filter} (1)
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
