import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LogOut, Dumbbell, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
<nav className="bg-card px-6 py-4 shadow-sm border-b border-border">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-primary font-heading font-bold text-lg">
      <Dumbbell size={22} className="text-accent" />
      FitConnect
    </div>

    <div className="hidden sm:flex items-center gap-6">
      <Link to="/dashboard" className="text-text text-sm hover:text-primary transition-colors">Dashboard</Link>
      <Link to="/communities" className="text-text text-sm hover:text-primary transition-colors">Communities</Link>
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
          style={{ backgroundColor: user?.avatarColor || "#26A69A" }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <button onClick={handleLogout} className="text-text hover:text-error transition-colors" title="Log out">
          <LogOut size={20} />
        </button>
      </div>
    </div>

    <button className="sm:hidden text-text" onClick={() => setMenuOpen(!menuOpen)}>
      {menuOpen ? <X size={22} /> : <Menu size={22} />}
    </button>
  </div>

  {menuOpen && (
    <div className="sm:hidden mt-4 flex flex-col gap-3 pb-2">
      <Link to="/dashboard" className="text-text text-sm" onClick={() => setMenuOpen(false)}>Dashboard</Link>
      <Link to="/communities" className="text-text text-sm" onClick={() => setMenuOpen(false)}>Communities</Link>
      <button onClick={handleLogout} className="text-error text-sm text-left">Log out</button>
    </div>
  )}
</nav>
  );
}