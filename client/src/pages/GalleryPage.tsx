    import React, { useState, useEffect } from "react";
    import axios from "axios";
    import type { Project } from "../types/ProjectTypes";
    import HeroBanner from "../components/HeroBanner";
    import { useNavigate } from "react-router-dom";


    // @ts-ignore
    const API_BASE = import.meta.env.VITE_API;
    const PROJECT_API = `${API_BASE}/api/projects`;

    const GalleryPage: React.FC = () => {
        // Project State
        const [projects, setProjects] = useState<Project[]>([]);
        const [loading, setLoading] = useState(true);
        const [, setError] = useState<string | null>(null);
        const navigate = useNavigate();

        // Transition State
        const [isLoaded, setIsLoaded] = useState(false);

        // State for Hover Effect
        const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

        // Fetch Projects
        useEffect(() => {
            const fetchProjects = async () => {
                try {
                    const res = await axios.get(PROJECT_API);
                    setProjects(res.data);
                } catch {
                    setError("Failed to load projects.");
                } finally {
                    setLoading(false);
                    // Trigger fade-in
                    setTimeout(() => setIsLoaded(true), 100);
                }
            };
            fetchProjects();
        }, []);

        if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4]">Loading...</div>;

        return (
            <div className="min-h-screen bg-[#f4f4f4] text-black font-sans selection:bg-black selection:text-white overflow-x-hidden">

                {/* HERO BANNER — FULL BLEED */}
                <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden">
                    <HeroBanner
                        page="gallery"
                        title="Gallery"
                        subtitle="A collection of our curated design experiences."
                    />
                </div>


                {/* Main Content Wrapper */}
                <div
                    className={`
                        px-6 md:px-12 py-20 
                        transition-opacity duration-1000 ease-out 
                        ${isLoaded ? 'opacity-100' : 'opacity-0'}
                    `}
                >
                    {projects.map((project, index) => {
                        // Extract first valid image
                        const galleryImages: string[] = (
                            Array.isArray(project.images) ? project.images : Object.values(project.images || {})
                        ).filter((img): img is string => typeof img === "string");

                        const coverImage = galleryImages[0];
                        const projectId = project._id || `project-${index}`; 
                        const isHovered = hoveredProjectId === projectId;

                        // Determine the order and alignment for alternating layout
                        const isEven = index % 2 === 0;
                        const flexDirection = isEven ? 'md:flex-row' : 'md:flex-row-reverse';
                        const alignment = isEven ? 'md:items-start' : 'md:items-end';

                        return (
                            <div key={projectId} className="mb-40 last:mb-0 group">

                                {/* Layout: Alternating Image & Details - CHANGED FROM flex-col TO flex-row */}
                                <div 
                                    className={`
                                        flex flex-col gap-10 md:gap-20 
                                        ${flexDirection} ${alignment}
                                        md:flex-nowrap 
                                        w-full
                                    `}
                                >
                                    {/* 1. Image Container (Takes fixed width/max-width) */}
                                    <div 
                                        className="relative w-full md:w-[60%] lg:w-[50%]"
                                        onMouseEnter={() => setHoveredProjectId(projectId)}
                                        onMouseLeave={() => setHoveredProjectId(null)}
                                        onClick={() => navigate(`/gallery/${projectId}`)}
                                    >
                                        <div className="relative w-full overflow-hidden bg-gray-200 cursor-pointer shadow-sm">
                                            {coverImage && (
                                                <img
                                                    src={coverImage}
                                                    alt={project.title}
                                                    className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out hover:scale-105"
                                                />
                                            )}

                                            {/* Title Overlay */}
                                            <div className={`
                                                absolute bottom-0 right-0 p-4 
                                                bg-black bg-opacity-70 text-white 
                                                transition-opacity duration-300 pointer-events-none
                                                ${isHovered ? 'opacity-100' : 'opacity-0'}
                                            `}>
                                                <span className="text-sm font-semibold tracking-wider uppercase">
                                                    {project.title}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Project Details (Takes remaining space) */}
                                    {/* The `mt-6` is removed and replaced by the container gap */}
                                    <div className="w-full md:w-[40%] lg:w-[50%] flex flex-col justify-center">
                                        <div className="max-w-md">
                                            <div className="flex items-baseline gap-4 mb-2">
                                                <h3 className="text-3xl md:text-4xl font-light">{project.title}</h3>
                                                <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
                                                    {project.location}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                                {project.description}
                                            </p>

                                            <button
                                                onClick={() => navigate(`/gallery/${projectId}`)} // ✅ Added Navigation
                                                className="mt-6 text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 transition-colors"
                                            >
                                                View Case Study
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    export default GalleryPage;