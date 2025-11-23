import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import HomePage from "./pages/Home";
import GalleryPage from "./pages/GalleryPage";
import AdminPage from "./pages/Admin/AdminPage";
import Navbar from "./components/Navbar";
import AboutPage from "./pages/AboutPage";
import CategoryProductPage from "./pages/category/CategoryProductPage";
import CategoriesPage from "./pages/Admin/CategoriesPage";
import AdminLogin from "./pages/Admin/AdminLogin"; // ⬅ NEW

// 🔐 Protected Route Component
const ProtectedRoute = ({ children }: any) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin-login" replace />;
};

// 🧠 Component for conditional layout (Navbar hide logic)
const AppContent = () => {
  const location = useLocation();

  // Hide Navbar on ALL admin pages — not just /admin
  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products/:categoryId" element={<CategoryProductPage />} />

        <Route path="/admin-login" element={<AdminLogin />} />

        {/* PROTECTED ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
