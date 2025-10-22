import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const role = localStorage.getItem("role");

  // If no role (public), redirect to register
  if (!role) {
    return <Navigate to="/register" replace />;
  }

  // If role is not allowed, redirect to dashboard
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // If everything is fine, show the page
  return children;
}
