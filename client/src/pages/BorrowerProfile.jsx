import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function BorrowerProfile() {
  const navigate = useNavigate();

  // Example static data (replace with API fetch)
  const user = {
    name: "Ashwin Shahi",
    email: "asathashahi@gmail.com",
    role: "Borrower",
    profilePic: "/profile.jpg",
  };

  const favoriteBooks = [
    { title: "The Alchemist", author: "Paulo Coelho", img: "/alchemist.jpg" },
    { title: "1984", author: "George Orwell", img: "/1984.jpg" },
    { title: "Atomic Habits", author: "James Clear", img: "/atomic.jpg" },
  ];

  const borrowHistory = [
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      borrowDate: "12 Aug 2025",
      returnDate: "20 Aug 2025",
      status: "Returned",
    },
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      borrowDate: "15 Aug 2025",
      returnDate: null,
      status: "Borrowed",
    },
  ];

  // State for image update
  const [picOpen, setPicOpen] = useState(false);
  const [newImage, setNewImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result);  // Set the preview image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePicture = () => {
    if (newImage) {
      user.profilePic = newImage;
    }
    setPicOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <div className="p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Profile</h1>

        <div className="flex gap-10">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <img
              src={newImage || user.profilePic}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-2 border-gray-300 shadow-lg"
            />
            <button
              onClick={() => setPicOpen(true)}
              className="mt-3 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Edit Profile Picture
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex flex-col gap-4 w-80">
            <div>
              <p className="text-sm font-semibold">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Role</p>
              <p className="font-medium">{user.role}</p>
            </div>

            {/* Edit Profile Button */}
            <button
  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
  onClick={() => navigate("/borrower/edit-profile")}
>
  Edit Profile Info
</button>


          </div>
        </div>

        {/* Favorite Books */}
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h2 className="font-semibold text-lg mb-4">Favorite Books</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {favoriteBooks.map((book, idx) => (
              <div
                key={idx}
                className="min-w-[150px] border rounded-lg p-3 flex-shrink-0"
              >
                <div className="h-40 bg-gray-200 flex items-center justify-center mb-2">
                  <img
                    src={book.img}
                    alt={book.title}
                    className="h-full object-cover"
                  />
                </div>
                <p className="font-medium">{book.title}</p>
                <p className="text-sm text-gray-600">{book.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Borrow History */}
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h2 className="font-semibold text-lg mb-4">Borrow History</h2>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Author</th>
                <th className="border px-4 py-2">Borrowed On</th>
                <th className="border px-4 py-2">Returned On</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {borrowHistory.map((item, idx) => (
                <tr key={idx}>
                  <td className="border px-4 py-2">{item.title}</td>
                  <td className="border px-4 py-2">{item.author}</td>
                  <td className="border px-4 py-2">{item.borrowDate}</td>
                  <td className="border px-4 py-2">
                    {item.returnDate || "Not Returned"}
                  </td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        item.status === "Returned"
                          ? "bg-green-600"
                          : "bg-yellow-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Back Button */}
        <div className="flex justify-end">
        <button
          onClick={() => navigate("/borrower/dashboard")}
          className="px-6 py-2 rounded  bg-gray-600 text-white hover:bg-gray-700"
        >
          Back to Dashboard
        </button>
      </div>
      </div>

      {/* Modal to Edit Profile Picture */}
      {picOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h3 className="text-lg font-bold mb-4">Update Profile Picture</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-4"
            />
            {newImage && (
              <img
                src={newImage}
                alt="Preview"
                className="w-32 h-32 rounded-lg object-cover mx-auto mb-4"
              />
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPicOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePicture}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
