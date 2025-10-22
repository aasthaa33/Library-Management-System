import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();
  const [name, setName] = useState(""); // Fetch the user name initially if needed
  const [email, setEmail] = useState(""); // Fetch the user email initially if needed

  const handleSave = () => {
    // You can handle API call here to save the edited information to the backend

    // After saving, navigate back to the profile page
    navigate("/borrower/profile");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-6">
      <h2 className="text-xl font-semibold">Edit Profile</h2>

      <div className="mt-6 flex flex-col gap-4 w-80">
        <label className="flex flex-col">
          <span className="text-sm text-gray-600">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-600">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
          />
        </label>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => navigate("/borrower/profile")}
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
  );
}
