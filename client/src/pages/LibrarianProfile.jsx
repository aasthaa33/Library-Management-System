// Profile.jsx
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "Eric Shahi",
    email: "aasthashahi@gmail.com",
    role: "Librarian",
    image: "https://via.placeholder.com/150",
  });

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(profile);

  const [picOpen, setPicOpen] = useState(false);
  const [newImage, setNewImage] = useState(null);

  // Save updated info
  const handleSave = () => {
    setProfile(editData);
    setEditOpen(false);
  };

  // Save updated profile picture
  const handleSavePicture = () => {
    if (newImage) {
      setProfile({ ...profile, image: newImage });
    }
    setPicOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
  
       

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
              <li className="px-3 py-2 bg-gray-200 rounded font-semibold cursor-pointer">
                Profile
              </li>
              <li
                className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => navigate("/borrowers")}
              >
                Borrowers
              </li>
              <li
                className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => navigate("/borrow-records")}
              >
                Borrow Records
              </li>
              <li className="px-3 py-2 hover:bg-gray-100 rounded text-red-600 cursor-pointer">
                Logout
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-8 flex flex-col gap-6">
        <h2 className="text-xl font-bold">Profile</h2>

        <div className="flex gap-10">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <img
              src={profile.image}
              alt="Profile"
              className="w-40 h-40 rounded-lg object-cover shadow"
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
            <div className="border-b pb-2">
              <p className="text-gray-500">Name</p>
              <p className="font-medium">{profile.name}</p>
            </div>
            <div className="border-b pb-2">
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>
            <div className="border-b pb-2">
              <p className="text-gray-500">Role</p>
              <p className="font-medium">{profile.role}</p>
            </div>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-fit"
              onClick={() => {
                setEditData(profile);
                setEditOpen(true);
              }}
            >
              Edit Info
            </button>
          </div>
        </div>

        {/* Back to Dashboard */}
        <button
          onClick={() => navigate("/librarian/dashboard")}
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 w-fit"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Edit Info Modal */}
      {editOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Edit Info</h3>
            <div className="flex flex-col gap-3">
              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Name</span>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="border p-2 rounded"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Email</span>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  className="border p-2 rounded"
                />
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Picture Modal */}
      {picOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h3 className="text-lg font-bold mb-4">Update Profile Picture</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setNewImage(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
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
