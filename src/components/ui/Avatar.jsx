export default function Avatar({ name, color, size = 36 }) {
    return (
      <div
        className="rounded-full flex items-center justify-center text-white font-semibold shrink-0"
        style={{ backgroundColor: color || "#669bbc", width: size, height: size, fontSize: size * 0.4 }}
      >
        {name?.charAt(0).toUpperCase()}
      </div>
    );
  }