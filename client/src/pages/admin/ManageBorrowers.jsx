import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import axios from "axios";

const ManageBorrowers = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBorrowers = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const borrowersOnly = res.data.users.filter((u) => u.role === "borrower");
        setBorrowers(borrowersOnly);
      } catch (error) {
        console.error("Fetch Borrowers Error:", error);
      }
    };
    fetchBorrowers();
  }, []);

  const filteredBorrowers = borrowers.filter(
    (borrower) =>
      borrower.name.toLowerCase().includes(search.toLowerCase()) ||
      borrower.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const token = sessionStorage.getItem("token");
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

      const res = await axios.put(
        `http://localhost:5000/api/users/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBorrowers(borrowers.map((b) => (b._id === id ? res.data.user : b)));
    } catch (error) {
      console.error("Toggle Status Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Manage Borrowers</h2>
        </div>

        <div className="flex items-center w-full max-w-md border rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search borrowers by name or email..."
            className="w-full px-4 py-2 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="px-3 text-gray-500 hover:text-blue-600">
            <Search size={20} />
          </button>
        </div>

        <div className="bg-white shadow rounded">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Joined</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrowers.map((borrower) => (
                <tr key={borrower._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{borrower.name}</td>
                  <td className="border px-4 py-2">{borrower.email}</td>
                  <td className="border px-4 py-2">
                    {new Date(borrower.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        borrower.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {borrower.status || "Active"}
                    </span>
                  </td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleStatusToggle(borrower._id, borrower.status)}
                      className={`px-3 py-1 text-sm text-white rounded ${
                        borrower.status === "Active"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {borrower.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBorrowers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No borrowers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBorrowers;