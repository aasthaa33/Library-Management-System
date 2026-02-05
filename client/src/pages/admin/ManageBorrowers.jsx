import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const ManageBorrowers = () => {
  const [borrowers, setBorrowers] = useState([
    { id: 1, name: "John Doe", email: "john@email.com", status: "Active", joinDate: "2024-01-10", booksBorrowed: 5 },
    { id: 2, name: "Jane Smith", email: "jane@email.com", status: "Active", joinDate: "2024-01-25", booksBorrowed: 3 },
    { id: 3, name: "Mike Johnson", email: "mike@email.com", status: "Inactive", joinDate: "2024-02-05", booksBorrowed: 1 },
  ]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredBorrowers = borrowers.filter(
    (borrower) =>
      borrower.name.toLowerCase().includes(search.toLowerCase()) ||
      borrower.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusToggle = (id) => {
    setBorrowers(borrowers.map(borrower => 
      borrower.id === id 
        ? { ...borrower, status: borrower.status === "Active" ? "Inactive" : "Active" }
        : borrower
    ));
  };

  return (
    <div className="min-h-screen flex flex-col">
    
      <div className="p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Manage Borrowers</h2>
          {/* <button
            onClick={() => navigate("/admin/dashboard")}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Back to Dashboard
          </button> */}
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
                <th className="border px-4 py-2 text-left">Join Date</th>
                <th className="border px-4 py-2 text-center">Books Borrowed</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrowers.map((borrower) => (
                <tr key={borrower.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{borrower.name}</td>
                  <td className="border px-4 py-2">{borrower.email}</td>
                  <td className="border px-4 py-2">{borrower.joinDate}</td>
                  <td className="border px-4 py-2 text-center">{borrower.booksBorrowed}</td>
                  <td className="border px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      borrower.status === "Active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {borrower.status}
                    </span>
                  </td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button 
                      onClick={() => handleStatusToggle(borrower.id)}
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
                  <td colSpan="6" className="text-center p-4 text-gray-500">
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