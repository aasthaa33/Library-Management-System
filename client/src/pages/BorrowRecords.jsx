import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function BorrowRecords() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Function to determine if the current path matches the menu item
  const isActive = (path) => location.pathname === path;

  const records = [
    { id: 1, borrower: "Name 1", book: "Book 1", borrowDate: "2 Dec", returnDate: "N/A" },
    { id: 2, borrower: "Name 2", book: "Book 2", borrowDate: "4 Dec", returnDate: "10 Dec" },
    { id: 3, borrower: "Name 3", book: "Book 3", borrowDate: "4 Dec", returnDate: "N/A" },
    { id: 4, borrower: "Name 4", book: "Book 4", borrowDate: "2 Aug", returnDate: "10 Aug" },
    { id: 5, borrower: "Name 5", book: "Book 5", borrowDate: "16 Aug", returnDate: "20 Aug" },
  ];

  const filtered = records.filter(
    (r) =>
      r.borrower.toLowerCase().includes(search.toLowerCase()) ||
      r.book.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sidebar Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 flex justify-end z-50">
          <div
            className="flex-1 bg-black bg-opacity-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="w-64 bg-white h-full shadow-lg flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={() => setMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <ul className="flex flex-col p-4 gap-2">
              <li
                onClick={() => navigate("/librarian/profile")}
                className={`px-3 py-2 rounded cursor-pointer ${
                  isActive("/librarian/profile") ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
                }`}
              >
                Profile
              </li>

              <li
                onClick={() => navigate("/librarian/borrowers")}
                className={`px-3 py-2 rounded cursor-pointer ${
                  isActive("/librarian/borrowers") ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
                }`}
              >
                Borrowers
              </li>

              <li
                onClick={() => navigate("/librarian/borrow-records")}
                className={`px-3 py-2 rounded cursor-pointer ${
                  isActive("/librarian/borrow-records") ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
                }`}
              >
                Borrow Records
              </li>

              <li className="px-3 py-2 rounded text-red-600 hover:bg-gray-100 cursor-pointer">
                Logout
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6 flex flex-col gap-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search Borrower/Books..."
          className="border px-3 py-2 rounded w-2/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Records Table */}
        <div className="bg-white shadow rounded">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Borrower</th>
                <th className="border px-4 py-2 text-left">Book Title</th>
                <th className="border px-4 py-2 text-left">Borrow Date</th>
                <th className="border px-4 py-2 text-left">Return Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{r.borrower}</td>
                  <td className="border px-4 py-2">{r.book}</td>
                  <td className="border px-4 py-2">{r.borrowDate}</td>
                  <td className="border px-4 py-2">{r.returnDate}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Back to Dashboard */}
        <button
          onClick={() => navigate("/librarian/dashboard")}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-fit"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
