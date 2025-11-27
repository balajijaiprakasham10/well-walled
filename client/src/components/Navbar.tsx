import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API_BASE = (import.meta as any).env.VITE_API;
const API_URL = `${API_BASE}/api/categories`;

const Navbar: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/gallery" },
    { name: "About Us", path: "/about" },
  ];

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(API_URL);
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Scroll behavior only for Home
  useEffect(() => {
    if (!isHomePage) {
      setScrolled(true); // Always solid for other pages
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 80);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHomePage]);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isHomePage
          ? scrolled
            ? "bg-white shadow-md"
            : "bg-transparent"
          : "bg-white shadow-md"
        }`}
    >


      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link
            to="/"
            className={`text-2xl font-bold transition ${
              isHomePage && !scrolled ? "text-white" : "text-gray-900"
            }`}
          >
            WELLWALLED HABITAT
          </Link>

          {/* NAV ITEMS */}
          <div className="hidden md:flex space-x-8 items-center">

            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium text-lg pb-1 border-b-2 transition ${
                  location.pathname === item.path
                    ? "border-indigo-600"
                    : "border-transparent hover:border-gray-400"
                } ${isHomePage && !scrolled ? "text-white" : "text-gray-900"}`}
              >
                {item.name}
              </Link>
            ))}

            {/* PRODUCTS DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                className={`font-medium text-lg pb-1 border-b-2 transition border-transparent hover:border-gray-400 ${
                  isHomePage && !scrolled ? "text-white" : "text-gray-900"
                }`}
              >
                Products ▾
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={dropdownVariants}
                    className={`absolute top-10 left-0 w-48 rounded-lg shadow-xl transition ${
                      isHomePage
                        ? scrolled
                          ? "bg-white"
                          : "bg-black/80 backdrop-blur-md"
                        : "bg-white"
                    }`}
                  >
                    {categories.length === 0 ? (
                      <p className="px-4 py-2 text-sm text-gray-400">
                        No categories
                      </p>
                    ) : (
                      categories.map((cat) => (
                        <Link
                          key={cat._id}
                          to={`/products/${cat.name}`}
                          className={`block px-4 py-2 text-sm transition ${
                            isHomePage && !scrolled
                              ? "text-white hover:bg-white/10"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {cat.name}
                        </Link>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
