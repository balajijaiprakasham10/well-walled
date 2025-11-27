import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

interface Item {
    _id: string;
    title: string;
    category: string;
    description: string;
    images: string[];
}

interface Category {
    _id: string;
    name: string;
}

const API_BASE = (import.meta as any).env.VITE_API;

// Define both endpoints
const ALL_ITEMS_URL = `${API_BASE}/api/items`; // Endpoint for "Show All"
const CATEGORY_ITEMS_URL = `${API_BASE}/api/items/category/`; // Endpoint for specific category
const CATEGORIES_LIST_URL = `${API_BASE}/api/categories`;

const CategoryProductPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const [items, setItems] = useState<Item[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Updated Fetch Logic
    const fetchItems = async () => {
        setLoading(true);
        try {
            let response;

            // CHECK: Is the user asking for "all"?
            if (categoryId === "all") {
                // Fetch ALL items from the main items endpoint
                response = await axios.get(ALL_ITEMS_URL);
            } else {
                // Fetch specific category items
                response = await axios.get(CATEGORY_ITEMS_URL + categoryId);
            }

            setItems(response.data);
        } catch (err) {
            console.error("❌ Failed to load items:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get(CATEGORIES_LIST_URL);
            setCategories(res.data);
        } catch (err) {
            console.error("❌ Failed to load categories:", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categoryId) fetchItems();
    }, [categoryId]);

    return (
        <div className="bg-white min-h-screen">

            <div className="pt-24 pb-10 px-6 max-w-[1400px] mx-auto text-center md:text-left">

                {/* Dynamic Title: Show "Selected Category" or "All Projects" */}
                <h1 className="text-4xl md:text-5xl font-serif text-gray-900 uppercase tracking-widest mb-8">
                    {categoryId === "all" ? "All Projects" : categoryId}
                </h1>

                {/* Categories Menu */}
                <div className="flex flex-wrap gap-8 items-center border-b border-gray-200 pb-4">

                    {/* SHOW ALL BUTTON */}
                    <span
                        onClick={() => navigate('/products/all')}
                        className={`text-xs font-bold uppercase tracking-[0.2em] cursor-pointer transition-colors ${categoryId === "all"
                                ? "text-black border-b-2 border-black pb-4 -mb-4.5" // Active State
                                : "text-gray-400 hover:text-black"
                            }`}
                    >
                        Show All
                    </span>

                    {/* Category Buttons */}
                    {categories.map((cat) => (
                        <span
                            key={cat._id}
                            onClick={() => navigate(`/products/${cat.name}`)}
                            className={`text-xs font-bold uppercase tracking-[0.2em] cursor-pointer transition-colors ${categoryId === cat.name
                                    ? "text-black border-b-2 border-black pb-4 -mb-4.5" // Active State
                                    : "text-gray-400 hover:text-black"
                                }`}
                        >
                            {cat.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="h-64 flex items-center justify-center text-gray-500 uppercase tracking-widest">
                    Loading projects...
                </div>
            ) : items.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-gray-500 uppercase tracking-widest">
                    No projects found.
                </div>
            ) : (
                <main className="max-w-[1400px] mx-auto px-6 pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                        {items.map((item, index) => (
                            <motion.div
                                key={item._id}
                                // Pass the actual category of the item, or "all" if you prefer the URL to stay "all"
                                onClick={() => navigate(`/products/${item.category}/${item._id}`)}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <div className="overflow-hidden mb-5">
                                    <img
                                        src={item.images[0]}
                                        alt={item.title}
                                        className="w-full h-[450px] object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                    />
                                </div>

                                <div className="flex items-center space-x-2 text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase">
                                    <h3 className="text-gray-900 group-hover:text-black transition-colors">
                                        {item.title}
                                    </h3>
                                    <span className="text-amber-500">•</span>
                                    <span className="text-gray-400">{item.category}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </main>
            )}
        </div>
    );
};

export default CategoryProductPage;