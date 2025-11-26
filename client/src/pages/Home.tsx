import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Home, CookingPot, Bed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const API_BASE = (import.meta as any).env.VITE_API;
const PROJECTS_URL = `${API_BASE}/api/projects/home`;
const BANNER_URL = `${API_BASE}/api/banner`;

// ... [Keep Interfaces and Services unchanged] ...

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
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();


    const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

    const setProjectRef = useCallback((el: HTMLDivElement | null, index: number) => {
        if (el) {
            projectRefs.current[index] = el;
        }
    }, []);

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


    useEffect(() => {
        if (projects.length === 0 || loading) return;

        const handleScroll = () => {
            const viewportCenter = window.innerHeight / 2;
            let closestIndex = activeIndex;
            let closestDistance = Infinity;

            projectRefs.current.forEach((el, index) => {
                if (!el) return;

                const rect = el.getBoundingClientRect();
                const elementCenter = rect.top + rect.height / 2;
                const distance = Math.abs(viewportCenter - elementCenter);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            setActiveIndex(closestIndex);
        };

        // Initial run
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [projects, loading]);

    const BannerSection = () => {
        if (!banner) return null;

        return (
            <section className="relative h-screen w-full overflow-hidden">

                {/* ✅ RENDER IMAGE OR VIDEO */}
                {banner.mediaUrl.includes("/video/") || banner.mediaType === "video" ? (

                    <video
                        className="absolute inset-0 w-full h-full object-cover scale-105"
                        src={banner.mediaUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                ) : (
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-105"
                        style={{ backgroundImage: `url("${banner.mediaUrl}")` }}
                    />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/10"></div>

                {/* Content */}
                <div className="relative z-10 flex h-full items-center">
                    <div className="max-w-7xl mx-auto px-6">

                        <div className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 p-8 md:p-12 max-w-xl">
                            <p className="text-sm tracking-widest uppercase text-red-400 mb-3">
                                Interior Design Studio
                            </p>
                            <h1 className="text-4xl md:text-6xl font-semibold text-white mb-6">
                                Design that <br /> feels like Home
                            </h1>
                            <p className="text-gray-200 mb-8">
                                Crafted interiors that bring beauty, comfort, and identity into every space.
                            </p>
                            <div className="flex gap-4">
                                <button onClick={() => navigate('/gallery')}
                                    className="bg-white text-black px-6 py-3 rounded-full">
                                    View Projects
                                </button>
                                <button onClick={() => navigate('/contact')}
                                    className="border border-white text-white px-6 py-3 rounded-full">
                                    Contact Us
                                </button>
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
                <p className="text-lg text-gray-600 mb-16">
                    India's Only Truly End To End Interior Design Agency
                </p>

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

    // 🌟 UPDATED FEATURED PROJECTS 🌟
    const FeaturedProjects = () => {
        const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, path: string) => {
            e.currentTarget.src = `https://placehold.co/700x700/D1D5DB/4B5563?text=Image+Load+Error`;
        };

        return (
            <section className="bg-white py-10 md:py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center md:text-left">
                        Featured Projects
                    </h2>

                    {projects.length === 0 ? (
                        <p className="text-gray-600 text-center">No featured projects yet.</p>
                    ) : (
                        <div className="relative">

                            {/* --- RIGHT SIDE: STICKY IMAGES --- */}
                           
                                <div className="hidden md:block sticky top-20 w-1/2 ml-auto h-[80vh] rounded-xl overflow-hidden shadow-2xl bg-gray-100">
                                    {projects.map((project, index) => {
                                        const isVisible = index <= activeIndex;
                                        return (
                                            <div
                                                key={project._id}
                                                className="absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out will-change-transform"
                                                style={{
                                                    zIndex: index,
                                                    // 3. Use translate3d to force GPU Hardware Acceleration
                                                    transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100%, 0)',
                                                    // 4. Ensure the backface is hidden to prevent flickering
                                                    backfaceVisibility: 'hidden',
                                                    WebkitBackfaceVisibility: 'hidden'
                                                }}
                                            >
                                                <img
                                                    src={project.images.after}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => handleImageError(e, project.images.after)}
                                                    // Optional: Add loading="eager" for the first few images to prevent white flashes
                                                    loading={index < 2 ? "eager" : "lazy"}
                                                />
                                                <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
                                            </div>
                                        );
                                    })}
                                </div>
                            {/* --- LEFT SIDE: SCROLLING TEXT --- */}
                            <div className="md:w-1/2 -mt-[10vh] md:-mt-[80vh] pb-24">
                                {projects.map((project, index) => (
                                    <div
                                        key={project._id}
                                        className="relative min-h-[80vh] flex flex-col justify-center px-6 md:px-12 py-24"
                                        ref={(el) => setProjectRef(el, index)}
                                        data-index={index}
                                    >
                                        {/* Mobile Image */}
                                        <img
                                            src={project.images.after}
                                            alt={project.title}
                                            className="md:hidden w-full h-64 object-cover mb-8 rounded-lg shadow-lg"
                                            onError={(e) => handleImageError(e, project.images.after)}
                                        />

                                        {/* Text Content with subtle fade */}
                                        <div className={`transition-opacity duration-500 ${index === activeIndex ? 'opacity-100' : 'opacity-30'}`}>
                                            <p className="text-xs font-bold tracking-[0.2em] text-red-600 uppercase mb-4">
                                                Residential
                                            </p>
                                            <h3 className="text-4xl md:text-6xl font-light text-gray-900 leading-tight mb-6">
                                                {project.title}
                                            </h3>
                                            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-md">
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
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
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