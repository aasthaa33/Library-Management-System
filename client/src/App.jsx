import React , {useState} from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";

// Auth Pages
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";

// Public Pages
import About from "./pages/AboutPage";
import Contact from "./pages/Contactus";

// Borrower Pages
import BorrowerDashboard from "./pages/BorrowerDashboard";
import BorrowerProfile from "./pages/BorrowerProfile";
import BookDetails from "./pages/BookDetails";
import EditProfile from "./pages/EditProfile";

// Librarian Pages
import LibrarianDashboard from "./pages/LibrarianDashboard";
import LibrarianProfile from "./pages/LibrarianProfile";
import BorrowRecords from "./pages/BorrowRecords";
import Borrowers from "./pages/Borrowers";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageLibrarians from "./pages/admin/ManageLibrarians";
import ManageBorrowers from "./pages/admin/ManageBorrowers";

// Components
import NavBar from "./components/NavBar";
import Footer from "./components/footer";
import PrivateRoute from "./components/PrivateRoute";

function App() {
   const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const noNavbarPaths = ["/", "/register"];
  const shouldShowNavbar = !noNavbarPaths.includes(location.pathname);

    const role = sessionStorage.getItem("role") || "public";
  return (
    <div className="min-h-dvh grid grid-rows-[auto,1fr,auto]">
  {shouldShowNavbar && <NavBar onOpenSidebar={() => setSidebarOpen(true)} />}
  <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Borrower Routes */}
        <Route
          path="/borrower/dashboard"
          element={
            <PrivateRoute roles={["borrower"]}>
              <BorrowerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/borrower/profile"
          element={
            <PrivateRoute roles={["borrower"]}>
              <BorrowerProfile />
            </PrivateRoute>
          }
        />
        <Route
  path="/borrower/edit-profile"
  element={<EditProfile />}
/>
        <Route
          path="/book/:id"
          element={
            <PrivateRoute roles={["borrower"]}>
              <BookDetails />
            </PrivateRoute>
          }
        />

        {/* Librarian Routes */}
        <Route
          path="/librarian/dashboard"
          element={
            <PrivateRoute roles={["librarian"]}>
              <LibrarianDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/librarian/profile"
          element={
            <PrivateRoute roles={["librarian"]}>
              <LibrarianProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/librarian/borrow-records"
          element={
            <PrivateRoute roles={["librarian"]}>
              <BorrowRecords />
            </PrivateRoute>
          }
        />
        <Route
          path="/librarian/borrowers"
          element={
            <PrivateRoute roles={["librarian"]}>
              <Borrowers />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/manage-librarians"
          element={
            <PrivateRoute roles={["admin"]}>
              <ManageLibrarians />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/manage-borrowers"
          element={
            <PrivateRoute roles={["admin"]}>
              <ManageBorrowers />
            </PrivateRoute>
          }
        />
      </Routes>
      {shouldShowNavbar && <Footer />}
    </div>
  );
}

export default App;
