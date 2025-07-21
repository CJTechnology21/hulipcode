import React from "react";

function DropDown({ label, name, value, options, onChange }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2.5 rounded-lg border border-gray-300 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        <option value="">All {label}</option>
        {options.map((option, index) => (
          <option key={`${name}-${index}`} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DropDown;
