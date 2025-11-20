import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { Project } from '../types/ProjectTypes';

// Base URLs
const API_URL = 'http://localhost:5000/api/projects';
const API_BASE_URL = 'http://localhost:5000';

const GalleryPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // ... useEffect, loading, and error states remain the same ...
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get<Project[]>(API_URL);
                setProjects(response.data);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError('Failed to load projects. Please check the server connection.');
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // ... loading and error states remain the same ...
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-xl text-gray-700">Loading Projects...</div>
        );
    }
    if (error) {
        return (
            <div className="text-center p-10 bg-red-100 text-red-700 border border-red-400 m-10 rounded-lg">{error}</div>
        );
    }

    // --- RENDER LOGIC STARTS HERE ---
    return (
        <div className="min-h-screen bg-white">
            {/* Header (Assuming Navbar is rendered outside, as per App.tsx) */}

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

                {projects.length > 0 ? (
                    <div className="space-y-20">
                        {projects.map((project) => (
                            <div key={project._id} className="w-full">

                                {/* 1. Title and Description Section */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">

                                    {/* Project Title (Occupies 1 column) */}
                                    <div className="md:col-span-1">
                                        <h2 className="text-5xl font-light text-gray-900 mb-2 tracking-tight">
                                            {project.title}
                                        </h2>
                                        <p className="text-lg text-gray-500 font-medium">{project.location}</p>
                                    </div>

                                    {/* Project Description (Occupies 2 columns) */}
                                    <div className="md:col-span-2 flex items-start">
                                        <p className="text-lg text-gray-600 border-l-4 border-indigo-500 pl-4 py-1">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Horizontal Rule for Visual Separation */}
                                <hr className="mb-8" />


                                {/* 2. Image Gallery Section (Now Three Images in a Grid) */}
                                {/* 💡 Changed to a 3-column grid on medium and larger screens */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                    {/* Before Image */}
                                    <div className="relative overflow-hidden group">
                                        <img
                                            src={`${API_BASE_URL}/${project.images.before}`}
                                            alt={`${project.title} - Before View`}
                                            className="w-full h-auto object-cover rounded-lg shadow-lg transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">BEFORE</div>
                                    </div>

                                    {/* 💡 CAD Image - Added to the grid */}
                                    <div className="relative overflow-hidden group">
                                        <img
                                            src={`${API_BASE_URL}/${project.images.cad}`}
                                            alt={`${project.title} - CAD View`}
                                            className="w-full h-auto object-cover rounded-lg shadow-lg transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 bg-yellow-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded">CAD</div>
                                    </div>

                                    {/* After Image */}
                                    <div className="relative overflow-hidden group">
                                        <img
                                            src={`${API_BASE_URL}/${project.images.after}`}
                                            alt={`${project.title} - After View`}
                                            className="w-full h-auto object-cover rounded-lg shadow-lg transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 bg-indigo-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded">AFTER</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // No projects message
                    <div className="text-center p-10 bg-white rounded-xl shadow-lg">
                        <p className="text-xl text-gray-500">No projects found. Please upload projects via the admin panel.</p>
                    </div>
                )}
            </main>

            <footer className="p-4 bg-gray-800 text-white text-center mt-10">
                &copy; {new Date().getFullYear()} Architect Firm. All rights reserved.
            </footer>
        </div>
    );
};

export default GalleryPage;