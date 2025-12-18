import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, CookingPot, Bed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';

const API_BASE = (import.meta as any).env.VITE_API;
const PROJECTS_URL = `${API_BASE}/api/projects/home`;

interface Project {
    _id: string;
    title: string;
    location: string;
    description: string;
    images: {
        after: string;
    };
    showOnHome: boolean;
    // Fallback fields if your API returns flat structure
    image?: string;
    after?: string;
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
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Fetch Projects Data (Banner is now handled by HeroBanner component)
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get<Project[]>(PROJECTS_URL);
                setProjects(res.data);
            } catch (err) {
                console.error('Homepage API error:', err);
                setError("Failed to load projects.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const WhatWeDoSection = () => (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto text-center px-4">
                <h2 className="text-5xl font-bold mb-4">What We Do</h2>
                <p className="text-lg text-gray-600 mb-16">India's Only Truly End To End Interior Design Agency</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {services.map((service, index) => (
                        <div key={index} className="p-6 hover:shadow-lg transition rounded-lg border border-transparent hover:border-gray-100">
                            <service.icon className="w-14 h-14 mx-auto mb-4 text-gray-800" />
                            <h3 className="font-semibold mb-3 text-xl">{service.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    // Stacked Cards Project Section
    const FeaturedProjects = () => {
        const resolveImage = (project: Project) => {
            if (project.images?.after && project.images.after.startsWith("http")) return project.images.after;
            if (Array.isArray(project.images) && project.images.length > 0) return project.images[0];
            if (project.image && project.image.startsWith("http")) return project.image;
            if (project.after && project.after.startsWith("http")) return project.after;
            return "https://placehold.co/800x800?text=No+Image";
        };

        return (
            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 pt-10 pb-4 lg:pt-20 lg:pb-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                        Featured Projects
                    </h2>
                    <p className="text-gray-500">Explore our finest transformations.</p>
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
                                    className={`
                                        sticky top-0 
                                        h-screen 
                                        flex flex-col lg:flex-row 
                                        bg-white 
                                        overflow-hidden
                                        lg:rounded-none 
                                        shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:shadow-none
                                        border-t border-gray-100 lg:border-none
                                    `}
                                    style={{ zIndex: index + 1 }}
                                >
                                    {/* IMAGE SECTION */}
                                    <div className="w-full h-[55%] lg:h-full lg:w-1/2 order-1 lg:order-2 relative">
                                        <img
                                            src={img}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-20"></div>
                                    </div>

                                    {/* TEXT SECTION */}
                                    <div className="w-full h-[45%] lg:h-full lg:w-1/2 flex flex-col justify-center p-6 md:p-12 lg:p-16 bg-white order-2 lg:order-1 relative z-10">
                                        <div className="max-w-md mx-auto lg:mx-0 text-center lg:text-left overflow-y-auto lg:overflow-visible">
                                            <p className="text-xs tracking-widest text-red-600 uppercase mb-2 lg:mb-4 font-bold">Residential</p>

                                            <h3 className="text-2xl md:text-4xl lg:text-6xl font-light mb-3 lg:mb-6 leading-tight">
                                                {project.title}
                                            </h3>

                                            <p className="text-sm md:text-lg text-gray-500 mb-6 lg:mb-8 line-clamp-3 md:line-clamp-none">
                                                {project.description}
                                            </p>

                                            <button
                                                onClick={() => navigate('/gallery')}
                                                className="inline-block text-xs md:text-sm font-bold tracking-widest border-b-2 border-black pb-1 hover:text-red-600 hover:border-red-600 transition-colors uppercase"
                                            >
                                                View Project
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                <div className="h-20 bg-white"></div>
            </div>
        );
    };

    if (loading) return <div className="text-center p-10 text-xl">Loading homepage...</div>;

    return (
        <div className="home-page relative">

            {/* ✅ NEW: HeroBanner Component handles fetching, mobile view, and parallax */}
            <HeroBanner page="home" className="h-screen">
                <div className="max-w-7xl mx-auto px-6 w-full flex justify-center">
                    <div className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 p-8 md:p-12 max-w-xl text-center">
                        <p className="text-sm tracking-widest uppercase text-red-400 mb-3 font-bold">
                            Interior Design Studio
                        </p>
                        <h1 className="text-4xl md:text-6xl font-semibold text-white mb-6 drop-shadow-md">
                            Design that <br /> feels like Home
                        </h1>
                        <p className="text-gray-100 mb-8 text-lg">
                            Crafted interiors that bring beauty, comfort, and identity into every space.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => navigate('/gallery')}
                                className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition font-medium"
                            >
                                View Projects
                            </button>
                            <button
                                onClick={() => navigate('/contact')}
                                className="border border-white text-white px-6 py-3 rounded-full hover:bg-white/10 transition font-medium"
                            >
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </HeroBanner>

            {/* Main Content */}
            <div className="relative z-10 bg-white shadow-2xl">
                <WhatWeDoSection />
                <FeaturedProjects />
            </div>
        </div>
    );
};

export default HomePage;