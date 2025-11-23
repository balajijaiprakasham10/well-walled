import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API_URL = "http://localhost:5000/api/categories";

const Navbar: React.FC = () => {
    const location = useLocation();

    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Gallery", path: "/gallery" },
        { name: "About Us", path: "/about" },
    ];

    // Fetch categories from backend
    const fetchCategories = async () => {
        try {
            const res = await axios.get(API_URL);
            setCategories(res.data);
        } catch (err) {
            console.error("Failed to load categories", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-gray-800">
                        WELLWALLED HABITAT
                    </Link>

                    {/* Nav Items */}
                    <div className="hidden md:flex space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`text-gray-800 font-medium text-lg pb-1 border-b-2 ${location.pathname === item.path
                                        ? "border-indigo-600"
                                        : "border-transparent hover:border-gray-300"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* Products Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setDropdownOpen(true)}
                            onMouseLeave={() => setDropdownOpen(false)}
                        >
                            <button className="text-gray-800 font-medium text-lg pb-1 border-b-2 border-transparent hover:border-gray-300">
                                Products ▾
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={dropdownVariants}
                                        className="absolute top-10 left-0 bg-white shadow-xl rounded-lg py-2 w-48"
                                    >
                                        {categories.length === 0 ? (
                                            <p className="px-4 py-2 text-gray-500 text-sm">No categories</p>
                                        ) : (
                                            categories.map((cat) => (
                                                <Link
                                                    key={cat._id}
                                                    to={`/products/${cat.name}`}
                                                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
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
