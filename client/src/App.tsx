import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/Home';
import GalleryPage from './pages/GalleryPage';
import AdminPage from './pages/Admin/AdminPage';
import Navbar from './components/Navbar';

// --- New Component to handle Conditional Rendering ---
const AppContent = () => {
  // Get the current URL location object
  const location = useLocation();

  // Check if the current path is '/admin'
  const isAdminRoute = location.pathname === '/admin';

  return (
    <>
      {/* CONDITIONAL RENDERING: Navbar only renders if it is NOT the admin route */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        {/* The AdminPage will render, but without the Navbar */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
};

// --- Main App component (wraps content in Router) ---
function App() {
  return (
    // The Router component must wrap everything that uses routing hooks (like useLocation)
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;