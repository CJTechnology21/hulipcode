 function Button({
  type = "button",
  onClick,
  loading,
  disabled,
  children,
  color = "blue",
  size = "md",
  fullWidth = false,
  variant = "filled", // "filled", "outlined", "icon", "custom"
  borderStyle = "solid", // "solid" or "dashed"
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

  const borderColorMap = {
    blue: "border-blue-600",
    red: "border-red-600",
    green: "border-green-600",
    gray: "border-gray-600",
    black: "border-black",
    gold: "border-yellow-500",
  };

  const sizeMap = {
    sm: "p-1 text-sm",
    md: "p-2 text-base",
    lg: "p-3 text-lg",
    xl: "p-4 text-xl",
  };

  const variantClasses = {
    filled: "bg-gray-100 hover:bg-gray-200 text-black",
    outlined: "bg-transparent",
    icon: "bg-transparent border-0 shadow-none",
    custom: "",
  };

  const colorClass = colorMap[color] || colorMap.blue;
  const sizeClass = sizeMap[size] || sizeMap.md;
  const variantClass = variantClasses[variant] || "";
  const borderColorClass = borderColorMap[color] || "border-gray-300";

  const borderClass =
    variant === "outlined"
      ? `border ${borderStyle === "dashed" ? "border-dashed" : "border-solid"} ${borderColorClass}`
      : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${fullWidth ? "w-full" : "w-fit"}
        ${variantClass}
        ${borderClass}
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
export default Button;