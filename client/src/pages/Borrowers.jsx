import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getAllBorrows } from "../services/bookService";

const Borrowers = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [borrowers, setBorrowers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBorrowers();
  }, []);

  const fetchBorrowers = async () => {
    try {
      const data = await getAllBorrows();
      const uniqueBorrowers = [];
      const borrowerMap = new Map();

      data.borrows.forEach(borrow => {
        if (!borrowerMap.has(borrow.userId._id)) {
          borrowerMap.set(borrow.userId._id, {
            id: borrow.userId._id,
            name: borrow.userId.name,
            email: borrow.userId.email,
            booksBorrowed: 0,
            activeBorrows: 0
          });
        }
        
        const borrower = borrowerMap.get(borrow.userId._id);
        borrower.booksBorrowed++;
        
        if (!borrow.returnDate) {
          borrower.activeBorrows++;
        }
      });

      setBorrowers(Array.from(borrowerMap.values()));
    } catch (error) {
      console.error("Error fetching borrowers:", error);
    }
  };

  const filteredBorrowers = borrowers.filter(
    (borrower) =>
      borrower.name.toLowerCase().includes(search.toLowerCase()) ||
      borrower.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="p-6 flex flex-col gap-6">
        <h2 className="text-xl font-semibold">Borrowers Management</h2>
        
        <input
          type="text"
          placeholder="Search borrowers by name or email..."
          className="border px-3 py-2 rounded w-2/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-white shadow rounded">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-center">Total Books Borrowed</th>
                <th className="border px-4 py-2 text-center">Active Borrows</th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrowers.map((borrower) => (
                <tr key={borrower.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{borrower.name}</td>
                  <td className="border px-4 py-2">{borrower.email}</td>
                  <td className="border px-4 py-2 text-center">{borrower.booksBorrowed}</td>
                  <td className="border px-4 py-2 text-center">{borrower.activeBorrows}</td>
                </tr>
              ))}
              {filteredBorrowers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No borrowers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => navigate("/librarian/dashboard")}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-fit"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Borrowers;