import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, useScroll, useTransform } from "framer-motion";

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

// 1. UPDATE INTERFACE to include mobile fields
interface BannerData {
    _id: string;
    page: string;
    mediaUrl: string;
    mediaType: "image" | "video";
    mobileMediaUrl?: string;       // Added
    mobileMediaType?: "image" | "video"; // Added
    uploadedAt: string;
}

// @ts-ignore
const API_BASE = import.meta.env.VITE_API;

const ALL_ITEMS_URL = `${API_BASE}/api/items`;
const CATEGORY_ITEMS_URL = `${API_BASE}/api/items/category/`;
const CATEGORIES_LIST_URL = `${API_BASE}/api/categories`;
const BANNER_URL = `${API_BASE}/api/banner`;

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

    // 2. ADD MOBILE STATE
    const [isMobile, setIsMobile] = useState(false);

    const { scrollY } = useScroll();
    const yParallax = useTransform(scrollY, [0, 1000], [0, 200]);
    const textY = useTransform(scrollY, [0, 500], [0, 150]);
    const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);

    // 3. DETECT SCREEN SIZE
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize(); // Run immediately
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categoryId) {
            fetchItems();
            fetchBanner();
        }
    }, [categoryId]);

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

    const fetchCategories = async () => {
        try {
            const res = await axios.get(CATEGORIES_LIST_URL);
            setCategories(res.data);
        } catch (err) {
            console.error("❌ Failed to fetch categories:", err);
        }
    };

    const fetchBanner = async () => {
        try {
            const normalizePage = (p: string) => p.replace(/^\/+/, "").toLowerCase();
            const pageKey = categoryId === "all" ? "bed" : normalizePage(categoryId!);
            const res = await axios.get(`${BANNER_URL}?page=${pageKey}`);
            setBanner(res.data);
        } catch {
            setBanner(null);
        }
    };

    // 4. DETERMINE ACTIVE MEDIA
    const activeUrl = (isMobile && banner?.mobileMediaUrl) ? banner.mobileMediaUrl : banner?.mediaUrl;
    const activeType = (isMobile && banner?.mobileMediaUrl) ? banner.mobileMediaType : banner?.mediaType;

    return (
        <div className="min-h-screen">

            {/* ===================== BANNER (FIXED LAYER) ===================== */}
            {banner && activeUrl && (
                <>
                    <motion.div
                        style={{ y: yParallax }}
                        className="fixed top-0 left-0 w-full h-[100dvh] -z-10" // h-[100dvh] fixes mobile browser bar issues
                    >
                        {activeType === "video" ? (
                            <video
                                key={activeUrl} // Key ensures video reloads when switching mobile/desktop
                                src={activeUrl}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                key={activeUrl}
                                src={activeUrl}
                                alt="Banner"
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-black/40" />
                    </motion.div>

                    <div className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
                        <motion.div
                            style={{ opacity: textOpacity, y: textY }}
                            className="text-center px-4"
                        >
                            <h1 className="text-white text-4xl md:text-6xl uppercase tracking-widest font-serif drop-shadow-lg">
                                {categoryId === "all" ? "All Projects" : normalizeCategory(categoryId!)}
                            </h1>
                        </motion.div>
                    </div>
                </>
            )}

            {/* ===================== FALLBACK TITLE ===================== */}
            {!banner && (
                <div className="pt-32 pb-10 max-w-[1400px] mx-auto px-6 bg-white">
                    <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest">
                        {categoryId === "all" ? "All Projects" : normalizeCategory(categoryId!)}
                    </h1>
                </div>
            )}

            {/* ===================== MAIN CONTENT ===================== */}
            <div className="relative z-10 bg-white min-h-screen shadow-2xl">

                {/* Category Menu */}
                <div className="max-w-[1400px] mx-auto px-6 py-8">
                    <div className="flex flex-wrap gap-8 border-b border-gray-200 pb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
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

                {/* Grid */}
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
                                    className="cursor-pointer group"
                                    onClick={() => navigate(`/products/${item.category}/${item._id}`)}
                                >
                                    <div className="overflow-hidden mb-5">
                                        <img
                                            src={item.images[0]}
                                            alt={item.title}
                                            className="h-[300px] md:h-[450px] w-full object-cover group-hover:scale-105 transition-transform duration-700"
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
        </div>
    );
};

export default CategoryProductPage;