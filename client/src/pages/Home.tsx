import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, CookingPot, Bed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = (import.meta as any).env.VITE_API;
const PROJECTS_URL = `${API_BASE}/api/projects/home`;
const BANNER_URL = `${API_BASE}/api/banner`;

interface BannerData {
    _id: string;
    mediaUrl: string;
    mediaType: "image" | "video";
    uploadedAt: string;
}

interface Project {
    _id: string;
    title: string;
    location: string;
    description: string;
    images: {
        after: string;
    };
    showOnHome: boolean;
}

const services = [
    {
        icon: Home,
        title: "Residential Design",
        description: "After carefully assessing the styling and furnishing needs of your house as well as the requirement of each family member, Experts at Homworks will establish a concept and then tailor design the house to suit your needs and requirements."
    },
    {
        icon: CookingPot,
        title: "Modular Kitchen Design",
        description: "We believe that right from the entryway to every corner of your kitchen should be designed with functionality in mind. At Homworks, we partner with the best to bring you high-performance modular kitchens with the widest range of designs & colour options."
    },
    {
        icon: Bed,
        title: "Bedroom & Living Room Design",
        description: "For bedroom & dining room, we understand choosing the correct tone of colours, textures and lights can make all the difference. So whether you are an owner of an apartment or villa, our designers have a lot to offer you."
    },
];

const HomePage: React.FC = () => {
    const [banner, setBanner] = useState<BannerData | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Fetch Data
    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [bannerRes, projectRes] = await Promise.all([
                    axios.get<BannerData>(BANNER_URL),
                    axios.get<Project[]>(PROJECTS_URL),
                ]);

                setBanner(bannerRes.data);
                setProjects(projectRes.data);
            } catch (err) {
                console.error('Homepage API error:', err);
                setError("Failed to load homepage content.");
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    const BannerSection = () => {
        if (!banner) return null;
        return (
            <section className="relative h-screen w-full overflow-hidden">
                {banner.mediaUrl.includes("/video/") || banner.mediaType === "video" ? (
                    <video className="absolute inset-0 w-full h-full object-cover scale-105" src={banner.mediaUrl} autoPlay muted loop playsInline />
                ) : (
                    <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url("${banner.mediaUrl}")` }} />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/10"></div>
                <div className="relative z-10 flex h-full items-center">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 p-8 md:p-12 max-w-xl">
                            <p className="text-sm tracking-widest uppercase text-red-400 mb-3">Interior Design Studio</p>
                            <h1 className="text-4xl md:text-6xl font-semibold text-white mb-6">Design that <br /> feels like Home</h1>
                            <p className="text-gray-200 mb-8">Crafted interiors that bring beauty, comfort, and identity into every space.</p>
                            <div className="flex gap-4">
                                <button onClick={() => navigate('/gallery')} className="bg-white text-black px-6 py-3 rounded-full">View Projects</button>
                                <button onClick={() => navigate('/contact')} className="border border-white text-white px-6 py-3 rounded-full">Contact Us</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    const WhatWeDoSection = () => (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto text-center px-4">
                <h2 className="text-5xl font-bold mb-4">What We Do</h2>
                <p className="text-lg text-gray-600 mb-16">India's Only Truly End To End Interior Design Agency</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {services.map((service, index) => (
                        <div key={index} className="p-6 hover:shadow-lg transition rounded">
                            <service.icon className="w-14 h-14 mx-auto mb-4" />
                            <h3 className="font-semibold mb-3">{service.title}</h3>
                            <p className="text-gray-600">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    // 🌟 UPDATED: STICKY CARD STACKING EFFECT 🌟
    // This creates the "Slide Up / Curtain" effect seen in your reference video.
    const FeaturedProjects = () => {
        const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, _path: string) => {
            e.currentTarget.src = `https://placehold.co/700x700/D1D5DB/4B5563?text=Image+Load+Error`;
        };

        return (
            <div className="bg-white">
                {/* Title Section (Scrolls away normally) */}
                <div className="max-w-7xl mx-auto px-4 pt-20 pb-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center md:text-left">
                        Featured Projects
                    </h2>
                </div>

                {/* Projects Container */}
                <div className="relative">
                    {projects.length === 0 ? (
                        <p className="text-gray-600 text-center py-20">No featured projects yet.</p>
                    ) : (
                        projects.map((project, index) => (
                            // ✅ THE MAGIC: sticky + top-0 + h-screen
                            // This makes each row stick to the top, and the next one slides up OVER it.
                            <div
                                key={project._id}
                                className="sticky top-0 h-screen flex flex-col md:flex-row bg-white overflow-hidden"
                                style={{ zIndex: index + 1 }} // Ensures stacking order is correct
                            >
                                {/* --- LEFT: TEXT CONTENT --- */}
                                <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 border-r border-gray-50 bg-white">
                                    <div className="max-w-md">
                                        <p className="text-xs font-bold tracking-[0.2em] text-red-600 uppercase mb-4">
                                            Residential
                                        </p>
                                        <h3 className="text-4xl md:text-6xl font-light text-gray-900 leading-tight mb-6">
                                            {project.title}
                                        </h3>
                                        <p className="text-lg text-gray-500 leading-relaxed mb-8">
                                            {project.description}
                                        </p>
                                        <button
                                            onClick={() => navigate('/gallery')}
                                            className="group inline-flex items-center text-sm font-bold tracking-widest uppercase border-b-2 border-gray-900 pb-2 hover:text-red-600 hover:border-red-600 transition-colors"
                                        >
                                            View Project
                                            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                        </button>
                                    </div>
                                </div>

                                {/* --- RIGHT: IMAGE --- */}
                                <div className="w-full md:w-1/2 h-full">
                                    <img
                                        src={project.images.after}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => handleImageError(e, project.images.after)}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    if (loading) return <div className="text-center p-10 text-xl">Loading homepage...</div>;

    return (
        <div className="home-page">
            <BannerSection />
            <WhatWeDoSection />
            <FeaturedProjects />
        </div>
    );
};

export default HomePage;