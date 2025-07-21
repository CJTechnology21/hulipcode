export default function Button({
  type = "button",
  onClick,
  loading,
  disabled,
  children,
  color = "blue",
  size = "md",
  fullWidth = false,
  className = "",
}) {
  const colorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700 text-white",
    red: "bg-red-600 hover:bg-red-700 text-white",
    green: "bg-green-600 hover:bg-green-700 text-white",
    gray: "bg-gray-600 hover:bg-gray-700 text-white",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2 text-base",
    xl: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${fullWidth ? "w-full" : "w-fit"}
        ${colorClasses[color] || colorClasses.blue}
        ${sizeClasses[size] || sizeClasses.md}
        rounded-md
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
