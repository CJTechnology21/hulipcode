import React, { useEffect, useState } from "react";

const allApplications = [
  "Balcony", "Bathroom", "Bedroom", "Cafe", "Doors", "Hotel", "Kitchen",
  "Living Room", "Office", "Pillar", "Railings", "Restaurant",
  "Showroom", "TV Cabinet", "Wardrobe"
];

const groupedApplications = allApplications.reduce((acc, app) => {
  const letter = app[0].toUpperCase();
  if (!acc[letter]) acc[letter] = [];
  acc[letter].push(app);
  return acc;
}, {});

export default function ApplicationFilter({ onChange }) {
  const [selected, setSelected] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggle = (item) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  useEffect(() => {
    onChange(selected);
  }, [selected]);

  const filtered = allApplications.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-6 relative">
      <h3 className="font-medium mb-2">Application</h3>
      <input
        type="text"
        placeholder="Search Application"
        className="w-full border px-2 py-1 rounded mb-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filtered.slice(0, 6).map((item) => (
        <label key={item} className="block">
          <input
            type="checkbox"
            className="mr-2"
            checked={selected.includes(item)}
            onChange={() => toggle(item)}
          />
          {item}
        </label>
      ))}

      {filtered.length > 6 && (
        <p
          className="text-blue-600 text-sm mt-1 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          + See more ({filtered.length - 6})
        </p>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-11/12 md:w-3/4 lg:w-1/2 p-6 max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Select Application</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {Object.keys(groupedApplications)
                .sort()
                .map((letter) => (
                  <div key={letter}>
                    <h4 className="font-bold text-gray-700 mb-1">{letter}</h4>
                    {groupedApplications[letter].map((item) => (
                      <label key={item} className="block mb-1">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selected.includes(item)}
                          onChange={() => toggle(item)}
                        />
                        {item}
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
