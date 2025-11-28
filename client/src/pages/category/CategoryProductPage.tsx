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

interface BannerData {
    _id: string;
    page: string;
    mediaUrl: string;
    mediaType: "image" | "video";
    uploadedAt: string;
}

const API_BASE = (import.meta as any).env.VITE_API;

const ALL_ITEMS_URL = `${API_BASE}/api/items`;
const CATEGORY_ITEMS_URL = `${API_BASE}/api/items/category/`;
const CATEGORIES_LIST_URL = `${API_BASE}/api/categories`;
const BANNER_URL = `${API_BASE}/api/banner`;

// ✅ Normalize Category Name ("bed" → "Bed", "living-room" → "LivingRoom")
const normalizeCategory = (name: string) => {
    return name
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join("");
};

const CategoryProductPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const [items, setItems] = useState<Item[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [banner, setBanner] = useState<BannerData | null>(null);
    const [loading, setLoading] = useState(true);

    // ===================== FETCH ITEMS =====================
    const fetchItems = async () => {
        setLoading(true);
        try {
            let response;
            if (categoryId === "all") {
                response = await axios.get(ALL_ITEMS_URL);
            } else {
                response = await axios.get(CATEGORY_ITEMS_URL + categoryId);
            }
            setItems(response.data);
        } catch (err) {
            console.error("❌ Failed to fetch items:", err);
        } finally {
            setLoading(false);
        }
    };

    // ===================== FETCH CATEGORIES =====================
    const fetchCategories = async () => {
        try {
            const res = await axios.get(CATEGORIES_LIST_URL);
            setCategories(res.data);
        } catch (err) {
            console.error("❌ Failed to fetch categories:", err);
        }
    };

    // ===================== FETCH BANNER =====================
    const fetchBanner = async () => {
        try {
            const normalizePage = (p: string) =>
                p.replace(/^\/+/, "").toLowerCase();

            const pageKey =
                categoryId === "all"
                    ? "bed"  // or "all" if you want all page banner
                    : normalizePage(categoryId!);


            const res = await axios.get(`${BANNER_URL}?page=${pageKey}`);
            setBanner(res.data);
        } catch {
            setBanner(null); // silent fail
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categoryId) {
            fetchItems();
            fetchBanner();
        }
    }, [categoryId]);

    return (
        <div className="bg-white min-h-screen">

            {/* ===================== BANNER ===================== */}
            {banner && (
                <div className="relative h-screen w-full overflow-hidden">

                    {banner.mediaType === "video" ? (
                        <video
                            src={banner.mediaUrl}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 object-cover w-full h-full"
                        />
                    ) : (
                        <img
                            src={banner.mediaUrl}
                            alt="Banner"
                            className="absolute inset-0 object-cover w-full h-full"
                        />
                    )}

                    <div className="absolute inset-0 bg-black/40" />

                    <div className="relative z-10 flex items-center justify-center h-full">
                        <h1 className="text-white text-5xl md:text-6xl uppercase tracking-widest font-serif">
                            {categoryId === "all" ? "All Projects" : normalizeCategory(categoryId!)}
                        </h1>
                    </div>
                </div>
            )}

            {/* ===================== TITLE FALLBACK ===================== */}
            {!banner && (
                <div className="pt-24 pb-10 max-w-[1400px] mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest">
                        {categoryId === "all" ? "All Projects" : normalizeCategory(categoryId!)}
                    </h1>
                </div>
            )}

            {/* ===================== CATEGORY MENU ===================== */}
            <div className="max-w-[1400px] mx-auto px-6 py-8">
                <div className="flex flex-wrap gap-8 border-b border-gray-200 pb-4 ">

                    <span
                        onClick={() => navigate("/products/all")}
                        className={`cursor-pointer uppercase tracking-widest text-xs font-bold ${categoryId === "all"
                            ? "text-black border-b-2 border-black pb-4 -mb-4.5"
                            : "text-gray-400 hover:text-black"
                            }`}
                    >
                        Show All
                    </span>

                    {categories.map(cat => (
                        <span
                            key={cat._id}
                            onClick={() => navigate(`/products/${cat.name}`)}
                            className={`cursor-pointer uppercase tracking-widest text-xs font-bold ${categoryId === cat.name
                                ? "text-black border-b-2 border-black pb-4 -mb-4.5"
                                : "text-gray-400 hover:text-black"
                                }`}
                        >
                            {cat.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* ===================== GRID ===================== */}
            {loading ? (
                <div className="h-64 flex justify-center items-center">Loading...</div>
            ) : items.length === 0 ? (
                <div className="h-64 flex justify-center items-center">No projects found.</div>
            ) : (
                <main className="max-w-[1400px] mx-auto px-6 py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                        {items.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="cursor-pointer"
                                onClick={() => navigate(`/products/${item.category}/${item._id}`)}

                            >
                                <div className="overflow-hidden mb-5">
                                    <img
                                        src={item.images[0]}
                                        alt={item.title}
                                        className="h-[450px] w-full object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </div>

                                <div className="uppercase tracking-widest text-xs font-semibold">
                                    <span>{item.title}</span>
                                    <span className="mx-2 text-amber-500">•</span>
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
