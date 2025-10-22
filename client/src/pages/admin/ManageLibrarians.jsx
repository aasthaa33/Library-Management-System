import { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";

export default function ManageLibrarians() {
  const [librarians, setLibrarians] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // currently editing librarian
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "librarian" });

  // fetch librarians
  useEffect(() => {
    fetchLibrarians();
  }, []);

  const fetchLibrarians = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users?role=librarian", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLibrarians(res.data.users || res.data);
    } catch (err) {
      console.error("Error fetching librarians", err);
    }
  };

  // search filter
  const filteredLibrarians = librarians.filter((lib) =>
    lib.name.toLowerCase().includes(search.toLowerCase())
  );

  // delete librarian
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this librarian?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLibrarians(librarians.filter((lib) => lib._id !== id));
    } catch (err) {
      console.error("Failed to delete librarian", err);
    }
  };

  // start editing
  const handleEdit = (librarian) => {
    setEditing(librarian._id);
    setForm({
      name: librarian.name,
      email: librarian.email,
      phone: librarian.phone || "",
      role: librarian.role,
    });
  };

  // save edited librarian
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/users/${editing}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLibrarians();
      setEditing(null);
    } catch (err) {
      console.error("Failed to update librarian", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Manage Librarians</h1>

      {/* search bar */}
       <div className="flex items-center w-full max-w-md border rounded-lg overflow-hidden mb-4">
  <input
    type="text"
    placeholder="Search librarians..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full px-4 py-2 focus:outline-none"
  />
  <button className="px-3 text-gray-500 hover:text-blue-600">
    <Search size={20} />
  </button>
</div>


      {filteredLibrarians.length === 0 ? (
        <p>No librarians found.</p>
      ) : (
        <ul className="space-y-2">
          {filteredLibrarians.map((lib) => (
            <li key={lib._id} className="p-3 border rounded shadow flex justify-between items-center">
              {editing === lib._id ? (
                // Editing form
                <div className="space-y-2 w-full">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border p-1 w-full"
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="border p-1 w-full"
                  />
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="border p-1 w-full"
                  />
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="border p-1 w-full"
                  >
                    <option value="librarian">Librarian</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="flex gap-2 mt-2">
                    <button onClick={handleSave} className="bg-green-500 text-white px-3 py-1 rounded">
                      Save
                    </button>
                    <button onClick={() => setEditing(null)} className="bg-gray-400 text-white px-3 py-1 rounded">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Normal view
                <div className="flex justify-between items-center w-full">
                  <div>
                    <div className="font-semibold">{lib.name}</div>
                    <div className="text-sm">{lib.email}</div>
                    <div className="text-xs text-gray-600">Role: {lib.role}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(lib)} className="bg-blue-500 text-white px-3 py-1 rounded">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(lib._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
