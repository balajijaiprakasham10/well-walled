import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { Project } from '../../types/ProjectTypes';

// The API endpoint for projects
const API_URL = 'http://localhost:5000/api/projects';

// TypeScript interfaces
interface FormData {
    title: string;
    description: string;
    location: string;
}
interface FileState {
    before: File | null;
    cad: File | null;
    after: File | null;
}

const initialFormData: FormData = {
    title: '',
    description: '',
    location: '',
};
const initialFileState: FileState = {
    before: null,
    cad: null,
    after: null,
};


const AdminProjectForm: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]); // State for the list of projects
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [files, setFiles] = useState<FileState>(initialFileState);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [editProject, setEditProject] = useState<Project | null>(null); // State for the project being edited

    // --- Data Fetching ---
    const fetchProjects = async () => {
        try {
            const response = await axios.get<Project[]>(API_URL);
            setProjects(response.data);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setMessage({ type: 'error', text: 'Failed to load projects list.' });
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // --- Form Handlers ---
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof FileState) => {
        const file = e.target.files ? e.target.files[0] : null;
        setFiles({ ...files, [fieldName]: file });
    };

    // --- CRUD Operations ---
    const handleEditClick = (project: Project) => {
        setEditProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            location: project.location,
        });
        setFiles(initialFileState);
        setMessage(null);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
    };

    const handleDelete = async (projectId: string) => {
        if (!window.confirm("Are you sure you want to delete this project?")) {
            return;
        }
        try {
            await axios.delete(`${API_URL}/${projectId}`);
            setMessage({ type: 'success', text: 'Project deleted successfully!' });
            fetchProjects(); // Refresh the list
        } catch (error) {
            console.error('Delete failed:', error);
            setMessage({ type: 'error', text: 'Failed to delete project.' });
        }
    };

    const handleCancelEdit = () => {
        setEditProject(null);
        setFormData(initialFormData);
        setFiles(initialFileState);
        setMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('location', formData.location);

        if (files.before) data.append('before', files.before);
        if (files.cad) data.append('cad', files.cad);
        if (files.after) data.append('after', files.after);

        try {
            if (editProject) {
                // UPDATE OPERATION
                await axios.put(`${API_URL}/${editProject._id}`, data);
                setMessage({ type: 'success', text: 'Project updated successfully!' });
                handleCancelEdit(); // Reset form after successful update
            } else {
                // CREATE OPERATION (Requires all files)
                if (!files.before || !files.cad || !files.after) {
                    setMessage({ type: 'error', text: 'Please upload all three required images for creation.' });
                    setLoading(false);
                    return;
                }
                await axios.post(API_URL, data);
                setMessage({ type: 'success', text: 'Project created successfully!' });
                setFormData(initialFormData);
                setFiles(initialFileState);
            }
            fetchProjects(); // Refresh the list
        } catch (error) {
            console.error('Operation failed:', error);
            const errorMsg = axios.isAxiosError(error)
                ? error.response?.data?.msg || 'An unknown error occurred during upload.'
                : 'Server error.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    // --- Component JSX (Moved directly from the old file) ---
    return (
        <div className="flex-1 p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">
                Project Management
            </h1>

            {/* Success/Error Message Display */}
            {message && (
                <div
                    className={`p-4 mb-6 rounded-lg text-sm ${message.type === 'success'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* --- Project Creation/Editing Form --- */}
            <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-xl mb-12">
                <h2 className={`text-3xl font-bold mb-6 ${editProject ? 'text-indigo-600' : 'text-gray-900'}`}>
                    {editProject ? `Edit Project: ${editProject.title}` : 'Create New Project'}
                </h2>

                {editProject && (
                    <p className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 text-sm text-yellow-800">
                        *Note: When editing, only upload new images if you want to replace the existing ones.
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Details (Title, Location, Description) */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Title Input */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Project Title</label>
                            <input
                                type="text" name="title" id="title" value={formData.title} onChange={handleTextChange} required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        {/* Location Input */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location (City, State/Country)</label>
                            <input
                                type="text" name="location" id="location" value={formData.location} onChange={handleTextChange} required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    {/* Description Textarea */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description" id="description" rows={4} value={formData.description} onChange={handleTextChange} required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* File Uploads */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Images ({editProject ? 'Optional update' : 'Required'})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Before Image Input */}
                            <div className='space-y-2'>
                                <label htmlFor="before" className="block text-sm font-medium text-gray-700">Image: Before {editProject && !files.before && <span className='text-xs text-indigo-500'>(Existing file)</span>}</label>
                                <input
                                    type="file" name="before" id="before" accept="image/*" onChange={(e) => handleFileChange(e, 'before')}
                                    required={!editProject} // Only required for creation
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                {files.before && <p className="text-xs text-gray-500">Selected: {files.before.name}</p>}
                            </div>

                            {/* CAD Image Input */}
                            <div className='space-y-2'>
                                <label htmlFor="cad" className="block text-sm font-medium text-gray-700">Image: CAD/Blueprint {editProject && !files.cad && <span className='text-xs text-indigo-500'>(Existing file)</span>}</label>
                                <input
                                    type="file" name="cad" id="cad" accept="image/*" onChange={(e) => handleFileChange(e, 'cad')}
                                    required={!editProject}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                {files.cad && <p className="text-xs text-gray-500">Selected: {files.cad.name}</p>}
                            </div>

                            {/* After Image Input */}
                            <div className='space-y-2'>
                                <label htmlFor="after" className="block text-sm font-medium text-gray-700">Image: After {editProject && !files.after && <span className='text-xs text-indigo-500'>(Existing file)</span>}</label>
                                <input
                                    type="file" name="after" id="after" accept="image/*" onChange={(e) => handleFileChange(e, 'after')}
                                    required={!editProject}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                {files.after && <p className="text-xs text-gray-500">Selected: {files.after.name}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Submit and Cancel Buttons */}
                    <div className="flex space-x-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? (editProject ? 'Saving Changes...' : 'Uploading Project...') : (editProject ? 'Save Changes' : 'Create Project')}
                        </button>
                        {editProject && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="w-1/4 flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* --- Project List Section --- */}
            <div className="bg-white shadow-xl rounded-xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Existing Projects ({projects.length})</h2>

                {projects.length === 0 ? (
                    <p className="text-gray-500 italic">No projects found. Use the form above to create one.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {projects.map((project) => (
                                    <tr key={project._id} className={editProject?._id === project._id ? 'bg-indigo-50/50' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {project.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {project.location}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                                            {project._id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                            <button
                                                onClick={() => handleEditClick(project)}
                                                className="text-indigo-600 hover:text-indigo-900 font-semibold disabled:opacity-50"
                                                disabled={loading}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project._id)}
                                                className="text-red-600 hover:text-red-900 font-semibold disabled:opacity-50"
                                                disabled={loading}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProjectForm;