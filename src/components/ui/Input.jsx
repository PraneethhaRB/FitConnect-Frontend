export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-text mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 rounded-lg border border-border bg-white text-text
          focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
          transition-all duration-150 ${error ? "border-error" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
}