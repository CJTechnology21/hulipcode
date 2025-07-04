import React, { useEffect, useState } from "react";

// Add static sizes with optional count values
const allSizes = [
  { label: "8x4", count: 658 },
  { label: "10x4", count: 22 },
  { label: "12x4", count: 6 },
  { label: "50x50", count: 2 },
];

export default function SizeFilter({ selectedSizes = [], onChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState(selectedSizes);

  const handleToggle = (value) => {
    const updated = selected.includes(value)
      ? selected.filter((s) => s !== value)
      : [...selected, value];
    setSelected(updated);
  };

  useEffect(() => {
    onChange(selected);
  }, [selected]);

  const filteredSizes = allSizes.filter((s) =>
    s.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-2">Approx Size (ft)</h3>
      <input
        type="text"
        placeholder="Search Approx Size"
        className="w-full border px-2 py-1 rounded mb-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredSizes.map((size) => (
        <label key={size.label} className="block">
          <input
            type="checkbox"
            className="mr-2"
            checked={selected.includes(size.label)}
            onChange={() => handleToggle(size.label)}
          />
          {size.label} ({size.count})
        </label>
      ))}
    </div>
  );
}
