import React, { useEffect, useState } from "react";

const allSeries = [
  { name: "Plain Solids", count: 255 },
  { name: "Wooden Effect", count: 251 },
  { name: "Marbles & Stones", count: 121 },
  { name: "Wooden Panels", count: 18 },
  { name: "Wood & Laminate", count: 17 },
  { name: "Geometric & Abstracts", count: 12 },
  { name: "Natural Rustic", count: 2 },
  { name: "Terrazzo", count: 1 }
];

const groupedSeries = allSeries.reduce((acc, item) => {
  const letter = item.name[0].toUpperCase();
  if (!acc[letter]) acc[letter] = [];
  acc[letter].push(item);
  return acc;
}, {});

export default function SeriesFilter({ onChange }) {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFilter = (name) => {
    setSelectedFilters((prev) =>
      prev.includes(name)
        ? prev.filter((f) => f !== name)
        : [...prev, name]
    );
  };

  useEffect(() => {
    onChange?.(selectedFilters);
  }, [selectedFilters]);

  const filteredSeries = allSeries.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedFiltered = filteredSeries.reduce((acc, item) => {
    const letter = item.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(item);
    return acc;
  }, {});

  return (
    <div className="mb-6 relative">
      <h3 className="font-medium mb-2">Series Name</h3>
      <input
        type="text"
        placeholder="Search Series Name"
        className="w-full border px-2 py-1 rounded mb-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredSeries.slice(0, 6).map((series) => (
        <label className="block" key={series.name}>
          <input
            type="checkbox"
            className="mr-2"
            checked={selectedFilters.includes(series.name)}
            onChange={() => toggleFilter(series.name)}
          />
          {series.name} 
        </label>
      ))}

      {filteredSeries.length > 6 && (
        <p
          className="text-blue-600 mt-2 cursor-pointer text-sm"
          onClick={() => setShowModal(true)}
        >
          + See more ({filteredSeries.length - 6})
        </p>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-11/12 md:w-3/4 lg:w-1/2 p-6 max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Select Series</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-600 text-lg font-bold">
                ✕
              </button>
            </div>

            <input
              type="text"
              placeholder="Search Series Name"
              className="w-full border px-3 py-2 rounded mb-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {Object.keys(groupedFiltered)
                .sort()
                .map((letter) => (
                  <div key={letter}>
                    <h4 className="font-bold text-gray-700 mb-1">{letter}</h4>
                    {groupedFiltered[letter].map((series) => (
                      <label className="block mb-1" key={series.name}>
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedFilters.includes(series.name)}
                          onChange={() => toggleFilter(series.name)}
                        />
                        {series.name} ({series.count})
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
