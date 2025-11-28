import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

interface Project {
    _id: string;
    title: string;
    description: string;
    images: string[];
    location?: string;
}

const API_BASE = import.meta.env.VITE_API;

// 1. EXTRACT THE UI & ANIMATION LOGIC INTO A SEPARATE COMPONENT
// This component is only rendered when 'project' exists, ensuring the ref is always valid.
const ProjectView = ({ project }: { project: Project }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const remainingImages = project.images.slice(1);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 50]);
    const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* HERO */}
            <header ref={containerRef} className="relative h-[200vh]">
                <div className="sticky top-0 h-screen overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={project.images[0]}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>

                    <motion.div
                        style={{ opacity }}
                        className="absolute inset-0 bg-white mix-blend-screen flex items-center justify-center z-10"
                    >
                        <motion.div
                            style={{ scale }}
                            className="text-center origin-center"
                        >
                            <h1 className="text-7xl md:text-9xl font-black text-black uppercase tracking-tighter leading-none px-4">
                                {project.title}
                            </h1>
                            {project.location && (
                                <p className="text-black text-xs md:text-sm tracking-[0.5em] mt-4 font-bold uppercase">
                                    {project.location}
                                </p>
                            )}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
                        className="absolute bottom-10 left-0 right-0 text-center z-20 pointer-events-none mix-blend-difference text-white"
                    >
                        <p className="text-xs tracking-[0.3em] uppercase animate-bounce">Scroll to Explore</p>
                    </motion.div>
                </div>
            </header>

            {/* DETAILS */}
            <main className="relative z-10 bg-white">
                <div className="max-w-6xl mx-auto px-6 py-24">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        <div className="md:col-span-4 space-y-8 border-t border-gray-200 pt-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6">Details</h3>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</p>
                                <p className="text-sm text-gray-900 mt-1 uppercase">{project.location || "—"}</p>
                            </div>
                        </div>

                        <div className="md:col-span-8 border-t border-gray-200 pt-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6">Description</h3>
                            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light">{project.description}</p>
                        </div>
                    </div>
                </div>

                {/* IMAGES */}
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
                                        alt={`${project.title} ${index + 1}`}
                                        onClick={() => setSelectedImage(img)}
                                        className="w-full h-auto object-cover transition-all duration-700 hover:scale-[1.02] cursor-zoom-in"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* LIGHTBOX */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 cursor-zoom-out"
                    >
                        <button className="absolute top-5 right-5 text-white text-4xl font-light hover:text-gray-300 z-[70]" onClick={() => setSelectedImage(null)}>×</button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            src={selectedImage}
                            alt="Preview"
                            className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-sm"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// 2. MAIN PARENT COMPONENT - Handles only Data Fetching
const GalleryDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/projects/${id}`);
                setProject(res.data);
            } catch (err) {
                console.error("❌ Failed:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProject();
    }, [id]);

    if (loading)
        return (
            <div className="h-screen flex items-center justify-center text-gray-500 uppercase">
                Loading...
            </div>
        );

    if (!project)
        return <div className="h-screen flex items-center justify-center">Project not found</div>;

    // 3. Render the ProjectView ONLY when we have data. 
    // This ensures useScroll finds its target immediately on mount.
    return <ProjectView project={project} />;
};

export default GalleryDetail;