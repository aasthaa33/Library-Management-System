// BookDetails.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function BookDetails() {
  const navigate = useNavigate();

  // Example book data (this can come from props or API call using bookId)
  const [book, setBook] = useState({
    title: "The Alchemist",
    author: "PAULO COELHO",
    isbn: "978-0061122415",
    publisher: "HarperCollins",
    category: "Philosophical Fiction / Adventure / Inspirational",
    synopsis: `The Alchemist is a philosophical novel that follows Santiago, 
      a young Andalusian shepherd, on his journey to discover a hidden treasure near the Egyptian pyramids. 
      Along the way, he meets a series of mentors — including a mysterious alchemist — who teach him about listening to his heart, 
      reading the omens of life, and pursuing his Personal Legend. 
      The story is a metaphor for following your dreams, embracing the journey, and finding meaning in life’s challenges.`,
    borrowDuration: "14 days",
    availability: true,
    img: "/alchemist.jpg",
  });

  // Borrow handler (API call can be plugged here)
  const handleBorrow = () => {
    alert(`You borrowed "${book.title}"`);
    // Example API call:
    // fetch("/api/borrow/borrow", { method: "POST", headers: {Authorization: `Bearer ${token}`}, body: JSON.stringify({ bookId })})
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex gap-6">
          <a href="#" className="hover:underline">Dashboard</a>
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Contact us</a>
        </div>
      </nav>

      {/* Book Details */}
      <div className="p-6 flex flex-col md:flex-row gap-8">
        {/* Left: Book Image */}
        <div className="w-full md:w-1/3 flex justify-center">
          <img
            src={book.img}
            alt={book.title}
            className="w-64 h-80 object-cover border shadow-md"
          />
        </div>

        {/* Right: Book Info */}
        <div className="w-full md:w-2/3 space-y-4">
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p><span className="font-semibold">Author:</span> {book.author}</p>
          <p><span className="font-semibold">ISBN:</span> {book.isbn}</p>
          <p><span className="font-semibold">Publisher:</span> {book.publisher}</p>

          <div>
            <h2 className="font-semibold text-lg">Synopsis</h2>
            <p className="text-gray-700 text-justify">{book.synopsis}</p>
          </div>

          <p><span className="font-semibold">Category:</span> {book.category}</p>
          <p><span className="font-semibold">Borrow duration:</span> {book.borrowDuration}</p>

          <div>
            <span className="font-semibold">Availability:</span>{" "}
            <span
              className={`px-3 py-1 rounded text-white ${
                book.availability ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {book.availability ? "Available" : "Unavailable"}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleBorrow}
              disabled={!book.availability}
              className={`px-6 py-2 rounded text-white ${
                book.availability
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Borrow
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
