import React from 'react';
import type { Project } from '../types/ProjectTypes';

const API_BASE_URL = 'http://localhost:5000';

interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const imageUrl = `${API_BASE_URL}/${project.images.before}`;

    return (
        // 💡 Refined shadow and border for a premium look
        <div className="bg-white rounded-lg shadow-2xl hover:shadow-3xl transition-shadow duration-500 overflow-hidden border border-gray-50">

            {/* Project Image - Increased height to match spacious feel */}
            <div className="h-72 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={`Before image of ${project.title}`}
                    // 💡 Subtle scale effect on hover
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
            </div>

            {/* Project Info - Cleaner typography */}
            <div className="p-6">
                <p className="text-sm text-gray-400 font-semibold uppercase mb-1">{project.location}</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 line-clamp-3 mb-4 text-sm">{project.description}</p>

                {/* Call to Action */}
                <button
                    className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm font-semibold"
                    onClick={() => alert(`Viewing details for: ${project.title}`)}
                >
                    Explore Project
                </button>
            </div>
        </div>
    );
};

export default ProjectCard;