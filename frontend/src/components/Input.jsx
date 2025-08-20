import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";

export default function Input({
  name,
  type = "text",
  placeholder,
  register,
  error,
  showToggle = false,
  value,
  onChange,
  className = "",
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showToggle ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative">
      <input
        {...(typeof register === "function" ? register(name) : {})}
        name={name}
        type={inputType}
        placeholder={placeholder}
        autoComplete={name}
        value={value}        // ✅ allow controlled inputs
        onChange={onChange}  // ✅ handle changes
        className={`w-full p-3 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
        {...rest}
      />
      {showToggle && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible size={20} />
          ) : (
            <AiOutlineEye size={20} />
          )}
        </button>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// import { useState } from "react";

// export default function Input({
//   name,
//   type = "text",
//   placeholder,
//   register,
//   error,
//   showToggle = false,
// }) {
//   const [showPassword, setShowPassword] = useState(false);

//   const inputType = showToggle ? (showPassword ? "text" : "password") : type;

//   return (
//     <div className="relative">
//       <input
//         {...(typeof register === "function" ? register(name) : {})}
//         type={inputType}
//         placeholder={placeholder}
//         autoComplete={name}
//         className={`w-full p-3 border ${
//           error ? "border-red-500" : "border-gray-300"
//         } rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
//       />
//       {showToggle && (
//         <button
//           type="button"
//           onClick={() => setShowPassword((prev) => !prev)}
//           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//         >
//           {showPassword ? (
//             <AiOutlineEyeInvisible size={20} />
//           ) : (
//             <AiOutlineEye size={20} />
//           )}
//         </button>
//       )}
//       {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
//     </div>
//   );
// }

