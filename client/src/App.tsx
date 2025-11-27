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
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import CategoryProductPage from "./pages/category/CategoryProductPage";
import ProjectDetailPage from "./pages/category/CategoryProductDetail";
import CategoriesPage from "./pages/Admin/CategoriesPage";
import AdminLogin from "./pages/Admin/AdminLogin";

// 🔐 Protected Route Component
const ProtectedRoute = ({ children }: any) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin-login" replace />;
};

// 🧠 Component for conditional layout
const AppContent = () => {
  const location = useLocation();

  // Check if the current path starts with "/admin" (covers /admin, /admin/categories, /admin-login)
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Only show Navbar if NOT an admin route */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products/:categoryId" element={<CategoryProductPage />} />
        <Route path="/products/:category/:id" element={<ProjectDetailPage />} />

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

      {/* Only show Footer if NOT an admin route */}
      {!isAdminRoute && <Footer />}
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