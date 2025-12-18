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

  // Mobile/Tablet states
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileProductsOpen, setMobileProductsOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/gallery" },
    { name: "About Us", path: "/about" },
  ];

  useEffect(() => {
    axios.get(API_URL)
      .then(res => setCategories(res.data))
      .catch(() => console.error("Category loading failed"));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileProductsOpen(false);
  }, [location.pathname]);

  const slideVariants: Variants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 220, damping: 26 } },
    exit: { x: "100%", transition: { duration: 0.25 } },
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-30 transition-all ${scrolled ? "bg-[#5d8d8d] shadow-lg" : "bg-transparent"}`}>
      <div className="relative w-full">



        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-[90px]">

            {/* TEXT LOGO — FIXED FOR MOBILE/TABLET */}
            <Link
              to="/"
              className="
              
                text-base md:text-2xl lg:text-3xl
                font-semibold
                uppercase text-white
                transition-colors duration-300 hover:text-gray-300
                tracking-widest lg:tracking-[0.2em]
                ml-0 lg:-ml-20
              "
            >
              WELLWALLED HABITAT
            </Link>


            {/* DESKTOP MENU (Hidden on Tablet & Mobile) */}
            <div className="hidden lg:flex space-x-14  items-center">
              {navItems.map(item => (
                <Link key={item.name} to={item.path} className="text-white text-xl hover:border-b-2">
                  {item.name}
                </Link>
              ))}

              <div
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
                className="relative"
              >
                <button className="text-white text-xl">Products ▾</button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute top-12 w-48 rounded shadow-lg ${scrolled ? "bg-white" : "bg-black/80 backdrop-blur"}`}
                    >
                      {categories.map(cat => (
                        <Link
                          key={cat._id}
                          to={`/products/${cat.name}`}
                          className={`block px-4 py-2 ${scrolled ? "text-black hover:bg-gray-100" : "text-white hover:bg-white/10"}`}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* HAMBURGER BUTTON (Visible on Mobile & Tablet) */}
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-white z-50">
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE & TABLET SLIDE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-[#5d8d8d] z-40 flex flex-col p-8 overflow-y-auto"
          >
            {navItems.map(item => (
              <Link key={item.name} to={item.path} className="text-3xl text-white my-4 font-light">
                {item.name}
              </Link>
            ))}

            <div className="my-4">
              <button
                onClick={() => setMobileProductsOpen(!isMobileProductsOpen)}
                className="flex items-center justify-between w-full text-3xl text-white font-light"
              >
                <span>Products</span>
                <span className="text-2xl">{isMobileProductsOpen ? "−" : "+"}</span>
              </button>

              <AnimatePresence>
                {isMobileProductsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden flex flex-col pl-6 mt-2 border-l border-white/30"
                  >
                    {categories.map(cat => (
                      <Link
                        key={cat._id}
                        to={`/products/${cat.name}`}
                        className="text-xl text-white/90 py-2 hover:text-white"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;