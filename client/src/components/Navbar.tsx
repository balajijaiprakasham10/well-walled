import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import axios from "axios";

/* ---------- ICONS ---------- */
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/* ---------- API ---------- */
const API_BASE = (import.meta as any).env.VITE_API;
const API_URL = `${API_BASE}/api/categories`;

const Navbar: React.FC = () => {
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileProductsPageOpen, setMobileProductsPageOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/gallery" },
    { name: "About Us", path: "/about" },
  ];

  /* ---------- FETCH CATEGORIES ---------- */
  useEffect(() => {
    axios.get(API_URL)
      .then(res => setCategories(res.data))
      .catch(() => console.error("Category loading failed"));
  }, []);

  /* ---------- SCROLL EFFECT ---------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------- AUTO CLOSE ON ROUTE CHANGE ---------- */
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileProductsPageOpen(false);
  }, [location.pathname]);

  /* ---------- ANIMATIONS ---------- */
  const mobileMenuVariants: Variants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 220, damping: 26 } },
    exit: { x: "100%", transition: { duration: 0.25 } }
  };

  const mobileProductsVariants: Variants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 220, damping: 26 } },
    exit: { x: "100%", transition: { duration: 0.25 } }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-30 transition-all ${scrolled ? "bg-[#5d8d8d] shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-[90px]">

          {/* LOGO */}
          <Link to="/" className="flex items-center -ml-20 mt-4">
            <img src="/logo2.png" alt="WellWalled Habitat"
              className={`h-[250px] transition ${!scrolled ? "brightness-0 invert" : ""}`} />
          </Link>

          {/* DESKTOP */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map(item => (
              <Link key={item.name} to={item.path} className="text-white text-lg hover:border-b-2">
                {item.name}
              </Link>
            ))}

            {/* PRODUCTS DESKTOP */}
            <div onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)} className="relative">
              <button className="text-white text-lg">Products ▾</button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute top-12 w-48 rounded overflow-hidden shadow-lg 
                      ${scrolled ? "bg-white" : "bg-black/80 backdrop-blur"}`}
                  >
                    {categories.map(cat => (
                      <Link key={cat._id} to={`/products/${cat.name}`}
                        className={`block px-4 py-2 
                          ${scrolled ? "text-black hover:bg-gray-100" : "text-white hover:bg-white/10"}`}>
                        {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* MOBILE BUTTON */}
          <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white z-50">
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

        </div>
      </div>

      {/* -------- MOBILE MENU -------- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 w-full h-screen bg-[#5d8d8d] z-40 flex flex-col p-8"

          >
            {navItems.map(item => (
              <Link key={item.name} to={item.path}
                className="text-3xl text-white my-4"
                onClick={() => setMobileMenuOpen(false)}>
                {item.name}
              </Link>
            ))}

            {/* PRODUCTS FULL PAGE BUTTON */}
            <button
              className="text-3xl text-white mt-6 text-left"
              onClick={() => {
                setMobileProductsPageOpen(true);
                setMobileMenuOpen(false);
              }}
            >
              Products →
            </button>

            <div className="mt-auto text-white/40 text-sm">
              <p>© 2025 WellWalled Habitat</p>
              <p>Designed for comfort.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------- FULL SCREEN PRODUCTS -------- */}
      <AnimatePresence>
        {isMobileProductsPageOpen && (
          <motion.div
            variants={mobileProductsVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-[#5d8d8d] flex flex-col"
          >
            {/* HEADER */}
            <div className="h-[90px] flex items-center px-6 border-b border-white/10">
              <button onClick={() => setMobileProductsPageOpen(false)} className="text-white text-xl">
                ← Back
              </button>
              <h2 className="mx-auto text-white text-2xl">Products</h2>
            </div>

            {/* LIST */}
            <div className="flex-1 overflow-y-auto px-6 py-10 space-y-6">
              {categories.map(cat => (
                <Link
                  key={cat._id}
                  to={`/products/${cat.name}`}
                  onClick={() => setMobileProductsPageOpen(false)}
                  className="block text-2xl text-white hover:text-red-400 transition"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* FOOTER */}
            <div className="px-6 pb-8 text-white/40 text-sm">
              <p>© 2025 WellWalled Habitat</p>
              <p>Designed for comfort.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
};

export default Navbar;
