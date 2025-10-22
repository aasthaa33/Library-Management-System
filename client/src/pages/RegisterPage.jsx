import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import toast, { Toaster } from 'react-hot-toast';
import Signup from "../assets/svgs/signup.svg";

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "",
    role: "borrower" 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser(formData);
      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Toaster />
      <nav className="bg-blue-900 text-white flex justify-between items-center px-6 py-3">
        <h1 className="text-xl font-semibold">Readish</h1>
        <div className="flex items-center space-x-6">
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/contact" className="hover:underline">Contact us</Link>
          <span>Already have an account?</span>
          <Link to="/" className="bg-green-600 px-4 py-1 rounded-md hover:bg-green-700">
            Log In
          </Link>
        </div>
      </nav>

      <div className="flex flex-1 items-center justify-center px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-5xl w-full">
          <div className="w-full max-w-sm mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Role</label>
                <input
                  type="text"
                  value="Borrower"
                  disabled
                  className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-600"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          </div>

          <div className="flex justify-center">
            <img src={Signup} className="max-w-md w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;