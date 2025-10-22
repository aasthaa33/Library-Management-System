import React, { useState, useEffect } from "react";

export default function LibrarianDashboard() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    publisher: "",
    quantity: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadBooks();
    
  }, []);

  const api = (path, opts = {}) =>
    fetch(path, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...opts,
    });

  const loadBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api("/api/books");
      if (!res.ok) throw new Error("Failed to load books");
      const data = await res.json();
      setBooks(data.books || data || []);
    } catch (err) {
      console.error(err);
      setError("Could not load books");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async () => {
    if (
      !newBook.title.trim() ||
      !newBook.author.trim() ||
      !newBook.isbn.trim() ||
      !newBook.publisher.trim()
    ) {
      setError("Title, Author, ISBN and Publisher are required");
      return;
    }
    setError("");
    try {
      const payload = {
        title: newBook.title.trim(),
        author: newBook.author.trim(),
        isbn: newBook.isbn.trim(),
        publisher: newBook.publisher.trim() || "Unknown",
        quantity: Number(newBook.quantity) || 0,
        available: Number(newBook.quantity) || 0, 
      };

      const res = await api("/api/books", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "Create failed");
        throw new Error(txt);
      }
      await loadBooks();
      setShowModal(false);
      setNewBook({ title: "", author: "", isbn: "", publisher: "", quantity: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to create book");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      const res = await api(`/api/books/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setBooks((p) => p.filter((b) => String(b._id || b.id) !== String(id)));
    } catch (err) {
      console.error(err);
      setError("Failed to delete");
    }
  };

  const handleEdit = async (book) => {
    const title = prompt("Title", book.title);
    if (title == null) return;
    const author = prompt("Author", book.author);
    if (author == null) return;
    const isbn = prompt("ISBN", book.isbn);
    if (isbn == null) return;
    const publisher = prompt("Publisher", book.publisher || "");
    if (publisher == null) return;
    const quantity = prompt("Quantity", String(book.quantity || 0));
    if (quantity == null) return;

    try {
      const payload = {
        title,
        author,
        isbn,
        publisher,
        quantity: Number(quantity) || 0,
        available: Number(quantity) || 0, 
      };
      const id = book._id || book.id;
      const res = await api(`/api/books/${id}`, {
        method: "PUT", 
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      await loadBooks();
    } catch (err) {
      console.error(err);
      setError("Failed to update");
    }
  };

  const filtered = books.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.title?.toLowerCase().includes(q) ||
      b.author?.toLowerCase().includes(q) ||
      b.publisher?.toLowerCase().includes(q) ||
      String(b.isbn || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Librarian Dashboard</h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search books by title, author, publisher or ISBN..."
              className="border px-3 py-2 rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={() => setShowModal(true)}
              className="ml-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Book
            </button>
          </div>
        </div>

        {error && <div className="text-red-600">{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-white shadow rounded overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Title</th>
                  <th className="border px-4 py-2 text-left">Author</th>
                  <th className="border px-4 py-2 text-left">ISBN</th>
                  <th className="border px-4 py-2 text-left">Publisher</th>
                  <th className="border px-4 py-2 text-left">Quantity</th>
                  <th className="border px-4 py-2 text-left">Available</th>
                  <th className="border px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((book) => {
                  const id = book._id || book.id;
                  const qty = Number(book.quantity || 0);
                  return (
                    <tr key={id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{book.title}</td>
                      <td className="border px-4 py-2">{book.author}</td>
                      <td className="border px-4 py-2">{book.isbn}</td>
                      <td className="border px-4 py-2">{book.publisher}</td>
                      <td className="border px-4 py-2">{qty}</td>
                      <td className="border px-4 py-2">{qty > 0 ? "Yes" : "No"}</td>
                      <td className="border px-4 py-2 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(book)}
                          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center p-4 text-gray-500">
                      No books found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Book Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add New Book</h2>
            <input
              type="text"
              placeholder="Title"
              className="border w-full px-3 py-2 mb-2 rounded"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Author"
              className="border w-full px-3 py-2 mb-2 rounded"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            />
            <input
              type="text"
              placeholder="ISBN"
              className="border w-full px-3 py-2 mb-2 rounded"
              value={newBook.isbn}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
            />
            <input
              type="text"
              placeholder="Publisher"
              className="border w-full px-3 py-2 mb-2 rounded"
              value={newBook.publisher}
              onChange={(e) =>
                setNewBook({ ...newBook, publisher: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Quantity"
              className="border w-full px-3 py-2 mb-4 rounded"
              value={newBook.quantity}
              onChange={(e) =>
                setNewBook({ ...newBook, quantity: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleAddBook}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
