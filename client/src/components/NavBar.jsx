import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // ✅ define state
  const { user } = useAuth();

  const dashboardPath = user
    ? user.role === "admin"
      ? "/admin/dashboard"
      : user.role === "librarian"
      ? "/librarian/dashboard"
      : "/borrower/dashboard"
    : null;
    

  return (
    <>
      <nav className="bg-blue-800 text-white px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2">
            <Menu size={20} />
          </button>
          <div className="text-xl font-bold">Readish</div>
        </div>

        <div className="flex gap-6 items-center">
          {dashboardPath && <Link to={dashboardPath}>Dashboard</Link>}
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {!user && (
            <>
              <Link to="/">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      {/* ✅ Sidebar, shown only when logged in */}
      {user && (
        <Sidebar
          role={user.role}
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
