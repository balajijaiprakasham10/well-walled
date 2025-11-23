import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { Project } from '../types/ProjectTypes';

const API_URL = 'http://localhost:5000/api/projects';
const API_BASE_URL = 'http://localhost:5000';

const GalleryPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(API_URL);
                setProjects(response.data);
            } catch (err) {
                setError('Failed to load projects.');
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const openPreview = (url: string) => {
        setPreviewImage(url);
        setZoom(1);
        setDragPos({ x: 0, y: 0 });
    };

    if (loading) return <p className="text-center mt-20 text-xl">Loading...</p>;
    if (error) return <p className="text-center mt-20 text-xl text-red-600">{error}</p>;

    return (
        <div className="min-h-screen bg-white max-w-7xl mx-auto py-10 px-4">
            {projects.map((project) => (
                <div key={project._id} className="space-y-6 mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h2 className="text-5xl font-light">{project.title}</h2>
                            <p className="text-lg text-gray-500">{project.location}</p>
                        </div>
                        <div className="md:col-span-2 border-l-4 border-indigo-500 pl-4">
                            <p>{project.description}</p>
                        </div>
                    </div>

                    <hr />

                    {/* Images */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(["before", "cad", "after"] as const).map((view) => (
                            <div key={view} className="relative group cursor-pointer">
                                <img
                                    src={`${API_BASE_URL}/${project.images[view]}`}
                                    onClick={() =>
                                        openPreview(`${API_BASE_URL}/${project.images[view]}`)
                                    }
                                    className="rounded-lg shadow-lg w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <span className="absolute top-3 left-3 bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded">
                                    {view.toUpperCase()}
                                </span>
                            </div>
                        ))}

                    </div>
                </div>
            ))}

            {/* ---------- IMAGE PREVIEW MODAL ---------- */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative" onClick={(e) => e.stopPropagation()}>

                        {/* Close Btn */}
                        <button
                            className="absolute top-3 right-3 bg-white px-3 py-1 rounded shadow"
                            onClick={() => setPreviewImage(null)}
                        >
                            ✕
                        </button>

                        {/* Zoom Controls */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                            <button
                                className="bg-white px-3 py-1 rounded shadow font-bold"
                                onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
                            >
                                ➕
                            </button>
                            <button
                                className="bg-white px-3 py-1 rounded shadow font-bold"
                                onClick={() => setZoom((z) => Math.max(z - 0.25, 1))}
                            >
                                ➖
                            </button>
                        </div>

                        {/* Draggable Image */}
                        <img
                            src={previewImage}
                            className="max-h-[80vh] max-w-[90vw] select-none cursor-grab"
                            style={{
                                transform: `scale(${zoom}) translate(${dragPos.x}px, ${dragPos.y}px)`,
                                transition: isDragging ? "none" : "transform .25s ease",
                            }}
                            onMouseDown={(e) => {
                                setIsDragging(true);
                                setDragStart({ x: e.clientX - dragPos.x, y: e.clientY - dragPos.y });
                            }}
                            onMouseMove={(e) => {
                                if (!isDragging) return;
                                setDragPos({
                                    x: e.clientX - dragStart.x,
                                    y: e.clientY - dragStart.y,
                                });
                            }}
                            onMouseUp={() => setIsDragging(false)}
                            onMouseLeave={() => setIsDragging(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryPage;
