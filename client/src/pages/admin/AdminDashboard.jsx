import { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";


export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newLibrarian, setNewLibrarian] = useState({
    name: "",
    email: "",
    password: "",
  });

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(Array.isArray(res.data.users) ? res.data.users : []);
      } catch (error) {
        console.error("Fetch Users Error:", error);
      }
    };
    fetchUsers();
  }, []);

  //  Stats
  const totalUsers = users.length;
  const totalLibrarians = users.filter((u) => u.role === "librarian").length;
  const totalBorrowers = users.filter((u) => u.role === "borrower").length;

  //  Filtered users
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  //  Create Librarian
  const handleCreateLibrarian = async () => {
    if (!newLibrarian.name || !newLibrarian.email || !newLibrarian.password) {
      console.error("Please fill all fields");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/auth/register-librarian",
        newLibrarian,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers([...users, res.data.user]);
      setNewLibrarian({ name: "", email: "", password: "" });
      setShowModal(false);

    } catch (error) {
      console.error("Create Librarian Error:", error);
      toast.error(error.response?.data?.message || "Failed to create librarian");
    }
  };

  //  Delete User
  //  Delete User
const handleDeleteUser = async (id) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  try {
    const token = sessionStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsers(users.filter((u) => u._id !== id));
    toast.success("User deleted successfully!");
  } catch (error) {
    console.error("Delete User Error:", error);
    toast.error(error.response?.data?.message || "Failed to delete user");
  }
};

//  Edit / Toggle Status
const handleToggleStatus = async (id, currentStatus) => {
  try {
    const token = sessionStorage.getItem("token");
    const updatedStatus = currentStatus === "Active" ? "Inactive" : "Active";

    const res = await axios.put(
      `http://localhost:5000/api/users/${id}/status`,
      { status: updatedStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUsers(users.map((u) => (u._id === id ? res.data.user : u)));
    toast.success(`User status updated to ${updatedStatus}!`);
  } catch (error) {
    console.error("Update User Error:", error);
    toast.error(error.response?.data?.message || "Failed to update user");
  }
};

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-6 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-center">Admin Dashboard</h2>

        {/*  Stats */}
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

        {/*  Search */}
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

        {/*  User Table */}
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
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                  <td className="border px-4 py-2">{user.status || "Active"}</td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() =>
                        handleToggleStatus(user._id, user.status || "Active")
                      }
                      className="px-4 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      {user.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
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

        {/* ✅ Create Librarian */}
        <div className="flex justify-end space-x-4">
          <button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            onClick={() => setShowModal(true)}
          >
            Create Librarian
          </button>
        </div>
      </div>

      {/* ✅ Modal */}
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

      {/* ✅ Toast Container */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          success: {
            style: {
              background: "#f0fdf4",
              color: "#166534",
              border: "1px solid #22c55e",
              fontWeight: "500",
            },
            iconTheme: { primary: "#22c55e", secondary: "#f0fdf4" },
          },
          error: {
            style: {
              background: "#fef2f2",
              color: "#991b1b",
              border: "1px solid #ef4444",
              fontWeight: "500",
            },
            iconTheme: { primary: "#ef4444", secondary: "#fef2f2" },
          },
        }}
      /> 
    </div>
  );
}
