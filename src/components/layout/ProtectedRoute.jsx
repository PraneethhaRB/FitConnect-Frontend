import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // still checking localStorage, don't flash a redirect

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}