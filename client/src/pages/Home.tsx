import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, CookingPot, Bed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = (import.meta as any).env.VITE_API;
const PROJECTS_URL = `${API_BASE}/api/projects/home`;
const BANNER_URL = `${API_BASE}/api/banner?page=home`;

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

    // 1. BACKGROUND ONLY (Fixed / Parallax)
    const BannerBackground = () => {
        if (!banner) return null;
        return (
            <div className="fixed top-0 left-0 h-screen w-full overflow-hidden -z-10">
                {banner.mediaUrl.includes("/video/") || banner.mediaType === "video" ? (
                    <video className="absolute inset-0 w-full h-full object-cover scale-105" src={banner.mediaUrl} autoPlay muted loop playsInline />
                ) : (
                    <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url("${banner.mediaUrl}")` }} />
                )}
                {/* Overlay attached to background */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/10"></div>
            </div>
        );
    };

    // 2. CONTENT ONLY (Scrollable)
    // This sits in the flow of the document and scrolls UP, leaving the background behind.
    const BannerContent = () => {
        return (
            <div className="h-screen w-full flex items-center justify-center relative z-0">
                <div className="max-w-7xl mx-auto px-6 w-full flex justify-center">
                    <div className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 p-8 md:p-12 max-w-xl text-center">
                        <p className="text-sm tracking-widest uppercase text-red-400 mb-3">
                            Interior Design Studio
                        </p>
                        <h1 className="text-4xl md:text-6xl font-semibold text-white mb-6">
                            Design that <br /> feels like Home
                        </h1>
                        <p className="text-gray-200 mb-8">
                            Crafted interiors that bring beauty, comfort, and identity into every space.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => navigate('/gallery')}
                                className="bg-white text-black px-6 py-3 rounded-full"
                            >
                                View Projects
                            </button>
                            <button
                                onClick={() => navigate('/contact')}
                                className="border border-white text-white px-6 py-3 rounded-full"
                            >
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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

    const FeaturedProjects = () => {
        const resolveImage = (project: any) => {
            if (project.images?.after && project.images.after.startsWith("http")) return project.images.after;
            if (Array.isArray(project.images) && project.images.length > 0) return project.images[0];
            if (project.image && project.image.startsWith("http")) return project.image;
            if (project.after && project.after.startsWith("http")) return project.after;
            return "https://placehold.co/800x800?text=No+Image";
        };

        return (
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 pt-20 pb-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                        Featured Projects
                    </h2>
                </div>

                <div className="relative">
                    {projects.length === 0 ? (
                        <p className="text-gray-600 text-center py-20">No featured projects yet.</p>
                    ) : (
                        projects.map((project, index) => {
                            const img = resolveImage(project);
                            return (
                                <div
                                    key={project._id}
                                    className="sticky top-0 h-screen flex flex-col md:flex-row bg-white"
                                    style={{ zIndex: index + 1 }}
                                >
                                    <div className="w-full md:w-1/2 flex items-center justify-center p-10 md:p-16 border-r border-gray-100 bg-white">
                                        <div className="max-w-md">
                                            <p className="text-xs tracking-widest text-red-600 uppercase mb-4">Residential</p>
                                            <h3 className="text-4xl md:text-6xl font-light mb-6">{project.title}</h3>
                                            <p className="text-lg text-gray-500 mb-8">{project.description}</p>
                                            <button onClick={() => navigate('/gallery')} className="group text-sm font-bold tracking-widest border-b-2 border-black pb-1">
                                                View Project →
                                            </button>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/2 h-full">
                                        <img src={img} alt={project.title} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        );
    };

    if (loading) return <div className="text-center p-10 text-xl">Loading homepage...</div>;

    return (
        <div className="home-page relative">

            {/* 1. FIXED BACKGROUND (Parallax) - Stays still */}
            <BannerBackground />

            {/* 2. SCROLLABLE CONTENT - Moves Up */}
            {/* The Banner Text Card sits here now, so it scrolls away */}
            <BannerContent />

            {/* 3. WHITE CONTENT LAYER - Slides over the fixed background */}
            <div className="relative z-10 bg-white shadow-2xl">
                <WhatWeDoSection />
                <FeaturedProjects />
            </div>
        </div>
    );
};

export default HomePage;