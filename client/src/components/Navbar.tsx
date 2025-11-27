import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API_BASE = (import.meta as any).env.VITE_API;
const API_URL = `${API_BASE}/api/categories`;

const Navbar: React.FC = () => {
  const location = useLocation();

  const isTransparentPage =
    location.pathname === "/" ||
    (location.pathname.startsWith("/products") && location.pathname.split("/").length >= 4) ||
    location.pathname.startsWith("/project/");

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/gallery" },
    { name: "About Us", path: "/about" },
  ];

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

  useEffect(() => {
    if (!isTransparentPage) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isTransparentPage, location.pathname]);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <nav
      className={`${isTransparentPage ? "fixed" : "sticky"
        } top-0 left-0 w-full z-50 transition-all duration-300 ${isTransparentPage
          ? scrolled
            ? "bg-[#5d8d8d] shadow-md"
            : "bg-transparent"
        : "bg-[#5d8d8d] shadow-md"
        }`}
    >

      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        {/* 👇 1. ALIGNMENT FIX: Used 'items-center' and removed top padding */}
        <div className="flex justify-between items-center h-[90px]">

          <Link to="/" className="flex items-center -ml-20">
            <img
              src="/logo.png"
              alt="WellWalled Habitat"
              /* 👇 2. SIZE FIX: Increased height to 70px (nav is 95px, so this fills it well) */
              /* Removed translate-y to keep it perfectly centered */
              className={`h-[200px] w-auto object-contain transition-all duration-300  ${isTransparentPage && !scrolled ? "brightness-0 invert" : ""
                }`}
            />
          </Link>

          {/* NAV ITEMS */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                /* 👇 3. TEXT ALIGNMENT: Removed pb-1 to ensure text is truly centered vertically */
                className={`font-medium text-lg border-b-2 transition ${location.pathname === item.path
                  ? "border-white"
                  : "border-transparent hover:border-white"
                  } ${isTransparentPage && !scrolled ? "text-white" : "text-white"}`}
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
                className={`font-medium text-lg border-b-2 transition border-transparent hover:border-gray-400 ${isTransparentPage && !scrolled ? "text-white" : "text-white"
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
                    // Adjusted top position slightly to align with center
                    className={`absolute top-[50px] left-0 w-48 rounded-lg shadow-xl transition ${isTransparentPage
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
                          className={`block px-4 py-2 text-sm transition ${isTransparentPage && !scrolled
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