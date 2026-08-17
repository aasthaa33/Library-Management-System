// About.jsx
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  const userRole = sessionStorage.getItem("role"); 

  const handleLearnMore = () => {
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
      <header
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: "url('/library.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white">
          <h2 className="text-3xl font-bold">Readish</h2>
          <p className="mt-2">Where curiosity meets clarity</p>
        </div>
      </header>

      {/* About Section */}
      <section className="p-8 flex flex-col gap-10 max-w-5xl mx-auto">
        <div>
          <h3 className="text-xl font-bold mb-2">About Us</h3>
          <p className="text-gray-700">
            Our platform is designed to simplify discovery, with smart navigation,
            personalized recommendations, and a vast, evolving collection of resources.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">Our Mission</h3>
          <p className="text-gray-700">
            To transform information into experience, creating spaces for learning,
            discovery, and inspiration. We believe discovery isn’t just about storing
            information—it’s about creating relevance, fostering community, and engaging
            better ways to learn.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">What we offer?</h3>
          <p className="text-gray-700">
            We offer more than just books—from fiction to academic texts. Each book opens
            a doorway to discovery, learning, and endless exploration.
          </p>
        </div>

        {/* Learn More Button */}
        <div className="text-center">
          <button
            onClick={handleLearnMore}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Learn More
          </button>
        </div>
      </section>
    </div>
  );
}
