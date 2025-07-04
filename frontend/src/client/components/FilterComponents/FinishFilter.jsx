import React, { useEffect, useState } from "react";

const allFinishes = ["Suede", "PU", "Seude", "Texture"]; // add all finish types here

export default function FinishFilter({ selectedFinishes = [], onChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState(selectedFinishes);

  const handleToggle = (value) => {
    const updated =
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];
    setSelected(updated);
  };

  useEffect(() => {
    onChange(selected);
  }, [selected]);

  const filteredFinishes = allFinishes.filter((f) =>
    f.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-2">Finish</h3>
      <input
        type="text"
        placeholder="Search Finish"
        className="w-full border px-2 py-1 rounded mb-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredFinishes.map((finish) => (
        <label key={finish} className="block">
          <input
            type="checkbox"
            className="mr-2"
            checked={selected.includes(finish)}
            onChange={() => handleToggle(finish)}
          />
          {finish}
        </label>
      ))}
    </div>
  );
}
