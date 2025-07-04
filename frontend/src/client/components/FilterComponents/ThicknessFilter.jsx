import React, { useEffect, useState } from "react";

const allThicknesses = [
  { label: "6", count: 301 },
  { label: "4", count: 173 },
  { label: "5", count: 170 },
  { label: "8", count: 39 },
  { label: "3", count: 3 },
  { label: "12", count: 2 },
  { label: "10", count: 1 },
];

export default function ThicknessFilter({ selected = [], onChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState(selected);
  const [showAll, setShowAll] = useState(false);

  const handleToggle = (value) => {
    const updated = selectedItems.includes(value)
      ? selectedItems.filter((t) => t !== value)
      : [...selectedItems, value];
    setSelectedItems(updated);
  };

  useEffect(() => {
    onChange(selectedItems);
  }, [selectedItems]);

  const filtered = allThicknesses.filter((t) =>
    t.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleItems = showAll ? filtered : filtered.slice(0, 6);
  const hiddenCount = filtered.length - 6;

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-2">Approx Thickness (mm)</h3>
      <input
        type="text"
        placeholder="Search Approx Thickness (mm)"
        className="w-full border px-2 py-1 rounded mb-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {visibleItems.map((thickness) => (
        <label key={thickness.label} className="block">
          <input
            type="checkbox"
            className="mr-2"
            checked={selectedItems.includes(thickness.label)}
            onChange={() => handleToggle(thickness.label)}
          />
          {thickness.label}
        </label>
      ))}

      {!showAll && hiddenCount > 0 && (
        <p
          className="text-blue-600 mt-1 text-sm cursor-pointer"
          onClick={() => setShowAll(true)}
        >
          + See more ({hiddenCount})
        </p>
      )}
    </div>
  );
}
