export default function Button({
  type = "button",
  onClick,
  loading,
  disabled,
  children,
  color = "blue",
  size = "md",
  fullWidth = false,
  variant = "filled", // "filled", "outlined", or "icon"
  className = "",
}) {
  const colorMap = {
    blue: "text-blue-600",
    red: "text-red-600",
    green: "text-green-600",
    gray: "text-gray-600",
    black: "text-black",
    gold: "text-yellow-500",
  };

  const sizeMap = {
    sm: "p-1 text-sm",
    md: "p-2 text-base",
    lg: "p-3 text-lg",
    xl: "p-4 text-xl",
  };

  const variantClasses = {
    filled: "bg-gray-100 hover:bg-gray-200 text-black",
    outlined: "border border-gray-300 bg-transparent",
    icon: "bg-transparent border-0 shadow-none",
  };

  const colorClass = colorMap[color] || colorMap.blue;
  const sizeClass = sizeMap[size] || sizeMap.md;
  const variantClass = variantClasses[variant] || "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${fullWidth ? "w-full" : "w-fit"}
        ${variantClass}
        ${colorClass}
        ${sizeClass}
        rounded-md
        flex items-center justify-center
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

// export default function Button({
//   type = "button",
//   onClick,
//   loading,
//   disabled,
//   children,
//   color = "blue",
//   size = "md",
//   fullWidth = false,
//   className = "",
// }) {
//   const colorClasses = {
//     blue: "bg-blue-600 hover:bg-blue-700 text-white",
//     red: "bg-red-600 hover:bg-red-700 text-white",
//     green: "bg-green-600 hover:bg-green-700 text-white",
//     gray: "bg-gray-600 hover:bg-gray-700 text-white",
//   };

//   const sizeClasses = {
//     sm: "px-3 py-1 text-xs",
//     md: "px-4 py-2 text-sm",
//     lg: "px-5 py-2 text-base",
//     xl: "px-6 py-3 text-lg",
//   };

//   return (
//     <button
//       type={type}
//       onClick={onClick}
//       disabled={disabled || loading}
//       className={`
//         ${fullWidth ? "w-full" : "w-fit"}
//         ${colorClasses[color] || colorClasses.blue}
//         ${sizeClasses[size] || sizeClasses.md}
//         rounded-md
//         ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
//         ${className}
//       `}
//     >
//       {loading ? "Loading..." : children}
//     </button>
//   );
// }
