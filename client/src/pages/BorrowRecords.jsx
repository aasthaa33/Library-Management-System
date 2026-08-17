import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBorrows } from "../services/bookService";

export default function BorrowRecords() {
  const [search, setSearch] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllBorrows();
      setRecords(res?.borrows || []);
    } catch (err) {
      console.error("Fetch Borrow Records Error:", err);
      setError("Failed to load borrow records");
    } finally {
      setLoading(false);
    }
  };

  const filtered = records.filter((r) => {
    const borrowerName = r.userId?.name?.toLowerCase() || "";
    const bookTitle = r.bookId?.title?.toLowerCase() || "";
    const q = search.toLowerCase();
    return borrowerName.includes(q) || bookTitle.includes(q);
  });

  const isOverdue = (borrowDate, returnDate) => {
    if (returnDate) return false;
    const daysSince = (Date.now() - new Date(borrowDate)) / (1000 * 60 * 60 * 24);
    return daysSince > 14;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="p-6 flex flex-col gap-6">
        <h2 className="text-xl font-semibold">Borrow Records</h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search Borrower/Books..."
          className="border px-3 py-2 rounded w-2/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {error && <div className="text-red-600">{error}</div>}

        {/* Records Table */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-white shadow rounded">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Borrower</th>
                  <th className="border px-4 py-2 text-left">Email</th>
                  <th className="border px-4 py-2 text-left">Book Title</th>
                  <th className="border px-4 py-2 text-left">Borrow Date</th>
                  <th className="border px-4 py-2 text-left">Return Date</th>
                  <th className="border px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const overdue = isOverdue(r.borrowDate, r.returnDate);
                  return (
                    <tr key={r._id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{r.userId?.name || "Unknown"}</td>
                      <td className="border px-4 py-2">{r.userId?.email || "-"}</td>
                      <td className="border px-4 py-2">{r.bookId?.title || "Unknown"}</td>
                      <td className="border px-4 py-2">
                        {new Date(r.borrowDate).toLocaleDateString()}
                      </td>
                      <td className="border px-4 py-2">
                        {r.returnDate ? new Date(r.returnDate).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            r.returnDate
                              ? "bg-green-100 text-green-800"
                              : overdue
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {r.returnDate ? "Returned" : overdue ? "Overdue" : "Borrowed"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-gray-500">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      
      </div>
    </div>
  );
}