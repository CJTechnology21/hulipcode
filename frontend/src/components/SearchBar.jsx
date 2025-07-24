import React from "react";
import clsx from "clsx"; // Optional: use if you want cleaner conditional class merging

function SearchBar({ value, onChange, placeholder = "Search...", onFocus, onBlur, className = "" }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      className={clsx(
        "w-full p-2.5 rounded-lg border border-gray-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition",
        className
      )}
    />
  );
}

export default SearchBar;
