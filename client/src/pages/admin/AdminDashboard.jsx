// AdminDashboard.jsx
import { useState } from "react";
  import axios from "axios";
import { Search } from "lucide-react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([
    { id: 1, name: "Name 1", email: "Email 1", role: "Librarian", status: "Active" },
    { id: 2, name: "Name 2", email: "Email 2", role: "Borrower", status: "Inactive" },
    { id: 3, name: "Name 3", email: "Email 3", role: "Borrower", status: "Inactive" },
    { id: 4, name: "Name 4", email: "Email 4", role: "Borrower", status: "Active" },
    { id: 5, name: "Name 5", email: "Email 5", role: "Borrower", status: "Active" },
  ]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [newLibrarian, setNewLibrarian] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Stats
  const totalUsers = users.length;
  const totalLibrarians = users.filter((u) => u.role === "Librarian").length;
  const totalBorrowers = users.filter((u) => u.role === "Borrower").length;

  // Filtered users
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

 

const handleCreateLibrarian = async () => {
  if (!newLibrarian.name || !newLibrarian.email || !newLibrarian.password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const token = localStorage.getItem("token"); // Admin’s JWT from login

    const res = await axios.post(
      "http://localhost:5000/api/auth/register-librarian",
      {
        name: newLibrarian.name,
        email: newLibrarian.email,
        password: newLibrarian.password,
        phone: newLibrarian.phone || "", // optional
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Update state with the new librarian from backend
    setUsers([...users, res.data.user]);

    setNewLibrarian({ name: "", email: "", password: "" });
    setShowModal(false);

    alert("Librarian created successfully!");
  } catch (error) {
    console.error("Create Librarian Error:", error);
    alert(error.response?.data?.message || "Failed to create librarian");
  }
};


  return (
    <div className="min-h-screen flex flex-col">

      <div className="p-6 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-center">Admin Dashboard</h2>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-6 shadow rounded">
            <p className="font-bold text-xl">{totalUsers}</p>
            <p>Total Users</p>
          </div>
          <div className="bg-white p-6 shadow rounded">
            <p className="font-bold text-xl">{totalLibrarians}</p>
            <p>Total Librarians</p>
          </div>
          <div className="bg-white p-6 shadow rounded">
            <p className="font-bold text-xl">{totalBorrowers}</p>
            <p>Total Borrowers</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center w-full max-w-md border rounded-lg overflow-hidden mb-4">
          <input
            type="text"
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 focus:outline-none"
          />
        <button className="px-3 text-gray-500 hover:text-blue-600">
          <Search size={20} />
        </button>
        </div>

        {/* User Table */}
        <div className="bg-white shadow rounded">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Role</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                  <td className="border px-4 py-2">{user.status}</td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button className="px-4 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">
                      Edit
                    </button>
                    <button className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Create Librarian */}
        <div className="flex justify-end">
          <button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            onClick={() => setShowModal(true)}
          >
            Create Librarian
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Create Librarian</h3>

            <input
              type="text"
              placeholder="Name"
              className="w-full border px-3 py-2 rounded mb-3"
              value={newLibrarian.name}
              onChange={(e) =>
                setNewLibrarian({ ...newLibrarian, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border px-3 py-2 rounded mb-3"
              value={newLibrarian.email}
              onChange={(e) =>
                setNewLibrarian({ ...newLibrarian, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border px-3 py-2 rounded mb-4"
              value={newLibrarian.password}
              onChange={(e) =>
                setNewLibrarian({ ...newLibrarian, password: e.target.value })
              }
            />

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleCreateLibrarian}
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
