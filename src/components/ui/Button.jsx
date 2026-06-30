export default function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "px-5 py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary text-white hover:bg-accent hover:shadow-lg hover:-translate-y-0.5",
    secondary: "bg-secondary/30 text-primary hover:bg-secondary/50",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    danger: "bg-error/10 text-error hover:bg-error hover:text-white",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}