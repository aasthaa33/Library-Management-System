import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBooks, borrowBook, returnBook, getUserBorrows } from "../services/bookService";
import { useAuth } from "../context/AuthContext";
import { Search } from "lucide-react";

export default function BorrowerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchBooks();
    fetchUserBorrows();
 
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res?.books || []);
    } catch (err) {
      console.error("fetchBooks error", err);
      setMessage("Failed to load books");
    }
  };

  const fetchUserBorrows = async () => {
    try {
      const res = await getUserBorrows();
      setBorrowedBooks(res?.borrows || []);
    } catch (err) {
      console.error("fetchUserBorrows error", err);
    }
  };

  const handleBorrow = async (bookId) => {
    setLoading(true);
    try {
      await borrowBook(bookId);
      await fetchBooks();
      await fetchUserBorrows();
      setMessage("Book borrowed successfully");
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Failed to borrow");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleReturn = async (bookId) => {
    if (!window.confirm("Return this book?")) return;
    setLoading(true);
    try {
      await returnBook(bookId);
      await fetchBooks();
      await fetchUserBorrows();
      setMessage("Book returned");
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Failed to return");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const recentlyBorrowed = [...borrowedBooks]
    .filter(b => b.bookId)
    .sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate))
    .slice(0, 5);

  const availableBooks = books.filter(b => b.available > 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-semibold">Welcome to Borrower Dashboard!</h1>
        <div className="flex items-center w-full max-w-md border rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search books by title, author...."
            className="w-full px-4 py-2 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="px-3 text-gray-500 hover:text-blue-600">
            <Search size={20} />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {message && (
          <div className="p-3 bg-green-100 text-green-800 rounded">{message}</div>
        )}

        <section>
          <h2 className="text-lg font-semibold mb-4">Recently Borrowed</h2>
          {recentlyBorrowed.length === 0 ? (
            <p className="text-gray-500">You haven't borrowed anything recently.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recentlyBorrowed.map((rec) => {
                const b = rec.bookId;
                const borrowDate = new Date(rec.borrowDate).toLocaleDateString();
                return (
                  <div key={rec._id} className="bg-white p-4 rounded shadow">
                    <div className="flex items-start gap-4">
                      <img
                        src={b?.image ? `http://localhost:5000${b.image}` : "/book-placeholder.jpg"}
                        alt={b?.title}
                        className="w-20 h-28 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{b?.title || "Unknown"}</h3>
                        <p className="text-sm text-gray-600">{b?.author}</p>
                        <p className="text-xs text-gray-500 mt-2">Borrowed on: {borrowDate}</p>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => navigate(`/book/${b?._id}`)}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleReturn(b?._id)}
                            disabled={loading}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm disabled:opacity-50"
                          >
                            Return
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Available Books</h2>
          {availableBooks.length === 0 ? (
            <p className="text-gray-500">No books available right now.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {availableBooks.map((book) => (
                <div key={book._id} className="bg-white p-4 rounded shadow flex flex-col items-center">
                  <img
                    src={book.image ? `http://localhost:5000${book.image}` : "/book-placeholder.jpg"}
                    alt={book.title}
                    className="w-28 h-36 object-cover rounded mb-3"
                  />
                  <h3 className="font-medium text-center">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{book.author}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/book/${book._id}`)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleBorrow(book._id)}
                      disabled={loading}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm disabled:opacity-50"
                    >
                      Borrow
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}