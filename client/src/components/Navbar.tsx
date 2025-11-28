import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import axios from "axios";

// --- Icons ---
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
const ChevronDown = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const API_BASE = (import.meta as any).env.VITE_API;
const API_URL = `${API_BASE}/api/categories`;

const Navbar: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/gallery" },
    { name: "About Us", path: "/about" },
  ];

  // Fetch Categories
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

  // Scroll Logic
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileProductsOpen(false);
  }, [location.pathname]);

  // --- Animation Variants ---

  // 1. Mobile Menu Container (Slide + Stagger Children)
  const mobileMenuContainerVars: Variants = {
    hidden: {
      x: "100%",
      opacity: 0,
      transition: { type: "tween", duration: 0.3 }
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
        staggerChildren: 0.1, // Stagger effect
        delayChildren: 0.1
      }
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: { type: "tween", duration: 0.3 }
    },
  };

  // 2. Mobile Menu Items (Fade + Slide Up)
  const mobileLinkVars: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  // 3. Desktop Dropdown
  const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500
        ${scrolled ? "bg-[#5d8d8d] shadow-lg backdrop-blur-sm" : "bg-transparent"}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-[90px]">

          {/* LOGO */}
          <Link to="/" className="flex items-center -ml-20 mt-4 relative z-50">
            <img
              src="/logo2.png"
              alt="WellWalled Habitat"
              className={`h-[250px] w-auto object-contain transition-all duration-300 
                ${!scrolled ? "brightness-0 invert" : ""}
              `}
            />
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map(item => (
              <Link
                key={item.name}
                to={item.path}
                className="font-medium text-lg text-white border-b-2 border-transparent hover:border-white transition"
              >
                {item.name}
              </Link>
            ))}

            {/* PRODUCTS DROPDOWN (Desktop) */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className="font-medium text-lg text-white border-b-2 border-transparent hover:border-white transition flex items-center gap-1">
                Products <span className="text-xs">▼</span>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={dropdownVariants}
                    className={`absolute top-[50px] left-0 w-48 rounded-lg shadow-xl
                      transition overflow-hidden
                      ${scrolled ? "bg-white" : "bg-black/80 backdrop-blur-md"}
                    `}
                  >
                    {categories.map(cat => (
                      <Link
                        key={cat._id}
                        to={`/products/${cat.name}`}
                        className={`block px-4 py-2 text-sm transition
                          ${scrolled
                            ? "text-gray-800 hover:bg-gray-100"
                            : "text-white hover:bg-white/10"
                          }
                        `}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 🆕 MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center relative z-50">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white focus:outline-none p-2 rounded-full hover:bg-white/10 transition active:scale-95"
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* 🆕 MODERN MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuContainerVars}
            className="md:hidden fixed top-[90px] right-0 bottom-0 w-full sm:w-[400px] 
              bg-[#5d8d8d] backdrop-blur-xl border-t border-white/10 shadow-2xl flex flex-col z-40 overflow-y-auto"
          >
            <div className="flex flex-col px-8 py-10 space-y-6">

              {/* Main Nav Items */}
              {navItems.map(item => (
                <motion.div key={item.name} variants={mobileLinkVars}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-3xl font-light text-white hover:text-red-400 hover:pl-2 transition-all duration-300"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              {/* Products Submenu Wrapper */}
              <motion.div variants={mobileLinkVars} className="pt-4 border-t border-white/10">
                <button
                  onClick={() => setMobileProductsOpen(!isMobileProductsOpen)}
                  className="w-full flex justify-between items-center text-3xl font-light text-white group"
                >
                  <span className="group-hover:text-red-400 transition-colors">Products</span>
                  <motion.div
                    animate={{ rotate: isMobileProductsOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/10 rounded-full p-2 group-hover:bg-red-400/20"
                  >
                    <ChevronDown className="text-white" />
                  </motion.div>
                </button>

                {/* Animated Dropdown List */}
                <AnimatePresence>
                  {isMobileProductsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col space-y-3 pt-6 pb-2 pl-2">
                        {categories.map(cat => (
                          <Link
                            key={cat._id}
                            to={`/products/${cat.name}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-lg text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-3"></span>
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

            </div>

            {/* Decorative / Contact Info Footer */}
            <motion.div variants={mobileLinkVars} className="mt-auto px-8 pb-10 text-white/30 text-sm">
              <p>&copy; 2025 WellWalled Habitat</p>
              <p>Designed for comfort.</p>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;