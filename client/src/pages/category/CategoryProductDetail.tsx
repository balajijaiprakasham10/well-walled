import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // 1. Import AnimatePresence

interface Item {
    _id: string;
    title: string;
    category: string;
    description: string;
    images: string[];
    location?: string;
    year?: string;
}

const API_BASE = (import.meta as any).env.VITE_API;
const API_URL = `${API_BASE}/api/items/`;

const ProjectDetailPage = () => {
    const { id } = useParams();

    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);

    // 2. New State for Lightbox
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await axios.get(`${API_URL}${id}`);
                setItem(res.data);
            } catch (err) {
                console.error("❌ Failed:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchItem();
    }, [id]);

    if (loading) return <div className="h-screen flex items-center justify-center text-gray-500 uppercase">Loading...</div>;
    if (!item) return <div className="h-screen flex items-center justify-center">Project not found</div>;

    const remainingImages = item.images.slice(1);

    return (
        <div className="bg-white min-h-screen font-sans">

            {/* 1. HERO SECTION */}
            <header className="relative w-full h-[85vh]">
                <div className="absolute inset-0 group overflow-hidden">
                    {/* Added onClick and cursor-zoom-in to Hero Image */}
                    <img
                        src={item.images[0]}
                        alt={item.title}
                        onClick={() => setSelectedImage(item.images[0])}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
                    />
                    <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-serif text-white uppercase tracking-widest leading-tight"
                    >
                        {item.title}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-12 animate-bounce text-white text-xs tracking-[0.3em] uppercase"
                    >
                        Scroll Down
                    </motion.div>
                </div>
            </header>

            {/* 2. DETAILS & BRIEF SECTION */}
            <main className="max-w-6xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Left Column: Details */}
                    <div className="md:col-span-4 space-y-8 border-t border-gray-200 pt-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6">Details</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Type</p>
                                <p className="text-sm text-gray-900 mt-1 uppercase">{item.category}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Brief */}
                    <div className="md:col-span-8 border-t border-gray-200 pt-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6">Brief</h3>
                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light">
                            {item.description}
                        </p>
                    </div>
                </div>
            </main>

            {/* 3. IMAGE GALLERY SECTION */}
            {remainingImages.length > 0 && (
                <section className="max-w-[1400px] mx-auto px-6 pb-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {remainingImages.map((img, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="w-full overflow-hidden"
                            >
                                {/* Added onClick and cursor-zoom-in to Gallery Images */}
                                <img
                                    src={img}
                                    alt={`${item.title} detail ${index + 1}`}
                                    onClick={() => setSelectedImage(img)}
                                    className="w-full h-auto object-cover grayscale-0 hover:grayscale-[10%] transition-all duration-700 hover:scale-[1.02] cursor-zoom-in"
                                />
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* 4. LIGHTBOX MODAL (Full Screen View) */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)} // Close on background click
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 cursor-zoom-out"
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-5 right-5 text-white text-4xl font-light hover:text-gray-300 z-[70]"
                            onClick={() => setSelectedImage(null)}
                        >
                            &times;
                        </button>

                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            src={selectedImage}
                            alt="Full Screen View"
                            className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-sm"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
                        />
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default ProjectDetailPage;