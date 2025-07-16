export default function Button({ type = "button", onClick, loading, disabled, children }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 text-sm ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
