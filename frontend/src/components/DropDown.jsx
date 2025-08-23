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
        <option value="">Select {label}</option>
        {options.map((option, index) => {
          // if option is an object → { value, label }
          if (typeof option === "object" && option !== null) {
            return (
              <option key={`${name}-${index}`} value={option.value}>
                {option.label}
              </option>
            );
          }
          // fallback: option is a string
          return (
            <option key={`${name}-${index}`} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default DropDown;

// import React from "react";

// function DropDown({ label, name, value, options, onChange }) {
//   return (
//     <div className="w-full">
//       {label && (
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           {label}
//         </label>
//       )}
//       <select
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="w-full p-2.5 rounded-lg border border-gray-300 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//       >
//         <option value="">All {label}</option>
//         {options.map((option, index) => (
//           <option key={`${name}-${index}`} value={option}>
//             {option}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// export default DropDown;
