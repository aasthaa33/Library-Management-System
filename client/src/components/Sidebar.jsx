import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({
  isOpen = false,
  onClose = () => {},
  role = null,
  className = "",
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  // ✅ Define links per role
  let links = [];

  if (role === "admin") {
  links = [
    { to: "/admin/manage-librarians", label: "Manage Librarians" },
    { to: "/admin/manage-borrowers", label: "Manage Borrowers" },
  ];
} else if (role === "librarian") {
  links = [
    { to: "/librarian/profile", label: "Profile" },
    { to: "/librarian/borrow-records", label: "borrow records" },
    { to: "/librarian/borrowers", label: "Borrowers" },
  ];
} else if (role === "borrower") {
  links = [
    { to: "/borrower/profile", label: "Profile" },
  ];
}

  const handleLogout = () => {
    try {
      logout && logout();
      onClose && onClose();
      navigate("/"); // SPA redirect
      setTimeout(() => {
        if (window.location.pathname !== "/") window.location.href = "/";
      }, 150);
    } catch (e) {
      console.error("Logout error", e);
      window.location.href = "/";
    }
  };

  return (
    <div className={`fixed inset-0 z-40 ${className}`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <aside className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-lg transform transition-transform duration-200 ease-in-out">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Menu</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="px-2 py-1 rounded hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={onClose}
              className="block px-3 py-2 rounded hover:bg-gray-100"
            >
              {l.label}
            </Link>
          ))}

          <div className="mt-4 border-t pt-4">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </nav>
      </aside>
    </div>
  );
}
