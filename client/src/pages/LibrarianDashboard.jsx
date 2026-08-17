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
    quantity: "",
    image: null,  
  });
  const [imagePreview, setImagePreview] = useState(null); 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    loadBooks();
  }, []);

  const [showEditModal, setShowEditModal] = useState(false);
const [editBook, setEditBook] = useState({
  id: "",
  title: "",
  author: "",
  isbn: "",
  publisher: "",
  quantity: "",
  image: null,       
  currentImage: "",   
});
const [editImagePreview, setEditImagePreview] = useState(null);

 
  const api = (path, opts = {}) => {
    const isFormData = opts.body instanceof FormData;
    return fetch(`http://localhost:5000${path}`, {
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...opts,
    });
  };

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewBook({ ...newBook, image: file });
    setImagePreview(URL.createObjectURL(file));   
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
    
      const formData = new FormData();
      formData.append("title", newBook.title.trim());
      formData.append("author", newBook.author.trim());
      formData.append("isbn", newBook.isbn.trim());
      formData.append("publisher", newBook.publisher.trim() || "Unknown");
      formData.append("quantity", Number(newBook.quantity) || 0);
      if (newBook.image) {
        formData.append("image", newBook.image);   
      }

      const res = await api("/api/books", {
        method: "POST",
        body: formData, 
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "Create failed");
        throw new Error(txt);
      }
      await loadBooks();
      setShowModal(false);
      setNewBook({ title: "", author: "", isbn: "", publisher: "", quantity: "", image: null });
      setImagePreview(null);
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

  const openEditModal = (book) => {
  setEditBook({
    id: book._id || book.id,
    title: book.title || "",
    author: book.author || "",
    isbn: book.isbn || "",
    publisher: book.publisher || "",
    quantity: String(book.quantity || 0),
    image: null,
    currentImage: book.image || "",
  });
  setEditImagePreview(null);
  setShowEditModal(true);
};

const handleEditImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setEditBook({ ...editBook, image: file });
  setEditImagePreview(URL.createObjectURL(file));
};

const handleEditSubmit = async () => {
  if (
    !editBook.title.trim() ||
    !editBook.author.trim() ||
    !editBook.isbn.trim() ||
    !editBook.publisher.trim()
  ) {
    setError("Title, Author, ISBN and Publisher are required");
    return;
  }
  setError("");
  try {
    const formData = new FormData();
    formData.append("title", editBook.title.trim());
    formData.append("author", editBook.author.trim());
    formData.append("isbn", editBook.isbn.trim());
    formData.append("publisher", editBook.publisher.trim());
    formData.append("quantity", Number(editBook.quantity) || 0);
    formData.append("available", Number(editBook.quantity) || 0);
    if (editBook.image) {
      formData.append("image", editBook.image);   // नयाँ image थियो भने मात्र पठाउने
    }

    const res = await api(`/api/books/${editBook.id}`, {
      method: "PUT",
      body: formData,
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "Update failed");
      throw new Error(txt);
    }
    await loadBooks();
    setShowEditModal(false);
    setEditImagePreview(null);
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
                  <th className="border px-4 py-2 text-left">Image</th>
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
                      <td className="border px-4 py-2">
                        {book.image ? (
                          <img
                            src={`http://localhost:5000${book.image}`}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                            No image
                          </div>
                        )}
                      </td>
                      <td className="border px-4 py-2">{book.title}</td>
                      <td className="border px-4 py-2">{book.author}</td>
                      <td className="border px-4 py-2">{book.isbn}</td>
                      <td className="border px-4 py-2">{book.publisher}</td>
                      <td className="border px-4 py-2">{qty}</td>
                      <td className="border px-4 py-2">{qty > 0 ? "Yes" : "No"}</td>
                      <td className="border px-4 py-2 text-center space-x-2">
                        <button
                          onClick={() => openEditModal(book)}
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
                    <td colSpan="8" className="text-center p-4 text-gray-500">
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
              className="border w-full px-3 py-2 mb-2 rounded"
              value={newBook.quantity}
              onChange={(e) =>
                setNewBook({ ...newBook, quantity: e.target.value })
              }
            />

            
            <label className="block text-sm text-gray-600 mb-1">Book Cover Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="border w-full px-3 py-2 mb-2 rounded"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-28 object-cover rounded mb-4 border"
              />
            )}

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => {
                  setShowModal(false);
                  setImagePreview(null);
                }}
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
      {/* Edit Book Modal */}
{showEditModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
    <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Edit Book</h2>
      <input
        type="text"
        placeholder="Title"
        className="border w-full px-3 py-2 mb-2 rounded"
        value={editBook.title}
        onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Author"
        className="border w-full px-3 py-2 mb-2 rounded"
        value={editBook.author}
        onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
      />
      <input
        type="text"
        placeholder="ISBN"
        className="border w-full px-3 py-2 mb-2 rounded"
        value={editBook.isbn}
        onChange={(e) => setEditBook({ ...editBook, isbn: e.target.value })}
      />
      <input
        type="text"
        placeholder="Publisher"
        className="border w-full px-3 py-2 mb-2 rounded"
        value={editBook.publisher}
        onChange={(e) => setEditBook({ ...editBook, publisher: e.target.value })}
      />
      <input
        type="number"
        placeholder="Quantity"
        className="border w-full px-3 py-2 mb-2 rounded"
        value={editBook.quantity}
        onChange={(e) => setEditBook({ ...editBook, quantity: e.target.value })}
      />

      <label className="block text-sm text-gray-600 mb-1">Book Cover Image</label>

      {/* अहिलेको image देखाउने (नयाँ select नगरेसम्म) */}
      {!editImagePreview && editBook.currentImage && (
        <img
          src={`http://localhost:5000${editBook.currentImage}`}
          alt="Current"
          className="w-20 h-28 object-cover rounded mb-2 border"
        />
      )}

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="border w-full px-3 py-2 mb-2 rounded"
        onChange={handleEditImageChange}
      />

      {editImagePreview && (
        <img
          src={editImagePreview}
          alt="New preview"
          className="w-20 h-28 object-cover rounded mb-4 border"
        />
      )}

      <div className="flex justify-end gap-2 mt-2">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={() => {
            setShowEditModal(false);
            setEditImagePreview(null);
          }}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={handleEditSubmit}
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}