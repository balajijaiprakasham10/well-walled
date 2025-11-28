import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API_BASE = (import.meta as any).env.VITE_API;
const API_URL = `${API_BASE}/api/categories`;

const Navbar: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/gallery" },
    { name: "About Us", path: "/about" },
  ];

  // ✅ Fetch categories
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

  // ✅ Transparency scroll logic (NO route conditions anymore)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${scrolled ? "bg-[#5d8d8d] shadow-md" : "bg-transparent"}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        <div className="flex justify-between items-center h-[90px]">

          {/* LOGO */}
          <Link to="/" className="flex items-center -ml-20 mt-4">
            <img
              src="/logo2.png"
              alt="WellWalled Habitat"
              className={`h-[250px] w-auto object-contain transition-all duration-300 
                ${!scrolled ? "brightness-0 invert" : ""}
              `}
            />
          </Link>

          {/* NAV LINKS */}
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

            {/* PRODUCTS DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className="font-medium text-lg text-white border-b-2 border-transparent hover:border-white transition">
                Products ▾
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
