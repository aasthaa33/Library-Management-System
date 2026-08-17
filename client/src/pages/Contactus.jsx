// Contact.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Contact() {
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem("role");

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userRole) {
      navigate("/register");
    } else if (userRole === "borrower") {
      navigate("/borrower/dashboard");
    } else if (userRole === "librarian") {
      navigate("/librarian/dashboard");
    } else if (userRole === "admin") {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <header
        className="relative h-56 bg-cover bg-center"
        style={{ backgroundImage: "url('/contact-banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white">
          <h2 className="text-3xl font-bold">Contact Us</h2>
        </div>
      </header>

      {/* Contact Form */}
      <section className="p-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
          <p className="text-gray-700">
            We would love to hear from you: whether you’re browsing our catalog,
            curious about a title or just want to share your favorite quote – we’re here for it.
          </p>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <textarea
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={handleChange}
            rows="4"
            className="border p-2 rounded"
            required
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Send Message
          </button>
        </form>

        {/* Contact Info */}
        <div className="flex-1 text-gray-700">
          <p>You can always reach us at:</p>
          <p className="font-medium mt-2">hello@readish.com</p>
          <p className="mt-4">Prefer Social? Catch us on:</p>
          <p className="mt-1">@readishlibrary on Instagram, Twitter, Threads</p>
        </div>
      </section>
    </div>
  );
}
