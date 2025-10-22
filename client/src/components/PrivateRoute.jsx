import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    // Not logged in → send to login
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Logged in but wrong role → send to their dashboard
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "librarian") return <Navigate to="/librarian/dashboard" replace />;
    return <Navigate to="/borrower/dashboard" replace />;
  }

  return children;
}
