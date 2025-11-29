import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

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

// --- 1. CHILD COMPONENT: Handles the UI & Animation ---
// We separate this so 'useScroll' only runs AFTER the data exists.
const ItemView = ({ item }: { item: Item }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const remainingImages = item.images.slice(1);

    // Scroll Animation Hooks
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // Scale text from 1 to 50 (zoom through effect)
    const scale = useTransform(scrollYProgress, [0, 1], [1, 50]);
    // Fade out the white mask at the end so the image is fully visible
    const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white min-h-screen font-sans">

            {/* === HERO: KNOCKOUT SCROLL REVEAL === */}
            <header ref={containerRef} className="relative h-[200vh]">
                <div className="sticky top-0 h-screen overflow-hidden">

                    {/* Background Layer: The Image */}
                    <div className="absolute inset-0">
                        <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Foreground Layer: The White Mask with Text Hole */}
                    <motion.div
                        style={{ opacity }}
                        className="absolute inset-0 bg-white mix-blend-screen flex items-center justify-center z-10"
                    >
                        <motion.div
                            style={{ scale }}
                            className="text-center origin-center w-full"
                        >
                            <h1 className="text-7xl md:text-9xl font-black text-black uppercase tracking-tighter leading-none px-4 break-words">
                                {item.title}
                            </h1>
                            <p className="text-black text-xs md:text-sm tracking-[0.5em] mt-4 font-bold uppercase">
                                {item.category} {item.year ? `— ${item.year}` : ""}
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
                        className="absolute bottom-10 left-0 right-0 text-center z-20 pointer-events-none mix-blend-difference text-white"
                    >
                        <p className="text-xs tracking-[0.3em] uppercase animate-bounce">Scroll to Explore</p>
                    </motion.div>
                </div>
            </header>

            {/* === DETAILS SECTION === */}
            <main className="relative z-10 bg-white">
                <div className="max-w-6xl mx-auto px-6 py-24">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

                        {/* Details Column */}
                        <div className="md:col-span-4 space-y-8 border-t border-gray-200 pt-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6">Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Type</p>
                                    <p className="text-sm text-gray-900 mt-1 uppercase">{item.category}</p>
                                </div>
                                {item.location && (
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</p>
                                        <p className="text-sm text-gray-900 mt-1 uppercase">{item.location}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description Column */}
                        <div className="md:col-span-8 border-t border-gray-200 pt-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6">Brief</h3>
                            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light">
                                {item.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* === IMAGE GALLERY === */}
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
            </main>

            {/* === LIGHTBOX MODAL === */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 cursor-zoom-out"
                    >
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
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- 2. PARENT COMPONENT: Handles Data Fetching ---
const ProjectDetailPage = () => {
    const { id } = useParams();
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
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

    // We render the View component only when data is ready
    return <ItemView item={item} />;
};

export default ProjectDetailPage;