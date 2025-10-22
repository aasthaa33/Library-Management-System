import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import toast, { Toaster } from "react-hot-toast";
import loginImg from "../assets/svgs/login.svg";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser(formData);
      login(response.user, response.token);
      toast.success("Login successful!");

      // Redirect based on role
      if (response.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (response.user.role === "librarian") {
        navigate("/librarian/dashboard");
      } else {
        navigate("/borrower/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
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
          <span>Don't have an account?</span>
          <Link to="/register" className="bg-green-600 px-4 py-1 rounded-md hover:bg-green-700">
            Sign Up
          </Link>
        </div>
      </nav>

      <div className="flex flex-1 items-center justify-center px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-5xl w-full">
          <div className="w-full max-w-sm mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
              <p className="text-sm text-center text-gray-500 cursor-pointer hover:underline">
                Forget Password?
              </p>
            </form>
          </div>

          <div className="flex justify-center">
            <img src={loginImg} alt="Login Illustration" className="max-w-md w-full"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
