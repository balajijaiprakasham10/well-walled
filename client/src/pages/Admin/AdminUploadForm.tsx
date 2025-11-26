import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { Project } from '../../types/ProjectTypes';

const API_BASE = (import.meta as any).env.VITE_API;
const API_URL = `${API_BASE}/api/projects`;

interface FormData {
    title: string;
    description: string;
    location: string;
    showOnHome: boolean;
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
    showOnHome: false,
};

const initialFileState: FileState = {
    before: null,
    cad: null,
    after: null,
};

const AdminProjectForm: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [files, setFiles] = useState<FileState>(initialFileState);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [editProject, setEditProject] = useState<Project | null>(null);

    const getAuthConfig = () => {
        const token = localStorage.getItem("adminToken");
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const fetchProjects = async () => {
        try {
            const res = await axios.get(API_URL, getAuthConfig());
            setProjects(res.data);
        } catch {
            setMessage({ type: 'error', text: 'Failed to load projects.' });
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, showOnHome: e.target.checked });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FileState) => {
        const file = e.target.files?.[0] || null;
        setFiles({ ...files, [field]: file });
    };

    const handleEditClick = (project: Project) => {
        setEditProject(project);
        setFormData({
            title: project.title || '',
            description: project.description || '',
            location: project.location || '',
            showOnHome: Boolean(project.showOnHome),   // ✅ IMPORTANT FIX
        });
        setFiles(initialFileState);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditProject(null);
        setFormData(initialFormData);
        setFiles(initialFileState);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this project?")) return;
        await axios.delete(`${API_URL}/${id}`, getAuthConfig());
        fetchProjects();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('location', formData.location);
        data.append('showOnHome', String(formData.showOnHome));

        if (files.before) data.append('before', files.before);
        if (files.cad) data.append('cad', files.cad);
        if (files.after) data.append('after', files.after);

        try {
            if (editProject) {
                await axios.put(`${API_URL}/${editProject._id}`, data, getAuthConfig());
                setMessage({ type: 'success', text: 'Updated successfully!' });
                handleCancelEdit();
            } else {
                if (!files.before || !files.cad || !files.after) {
                    setMessage({ type: 'error', text: 'All images are required!' });
                    setLoading(false);
                    return;
                }

                await axios.post(API_URL, data, getAuthConfig());
                setMessage({ type: 'success', text: 'Created successfully!' });
                setFormData(initialFormData);
                setFiles(initialFileState);
            }

            fetchProjects();
        } catch {
            setMessage({ type: 'error', text: 'Operation failed.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Project Management</h1>

            {message && (
                <div className={`p-3 mb-4 rounded ${message.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white p-6 rounded shadow mb-10">
                <h2 className="text-xl font-bold mb-4">{editProject ? "Edit Project" : "Create Project"}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="title" value={formData.title} onChange={handleTextChange} required className="w-full border p-2" />
                    <input name="location" value={formData.location} onChange={handleTextChange} required className="w-full border p-2" />
                    <textarea name="description" value={formData.description} onChange={handleTextChange} required rows={4} className="w-full border p-2" />

                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.showOnHome} onChange={handleCheckboxChange} />
                        Homepage Feature
                    </label>

                    {["before", "cad", "after"].map(name => (
                        <input key={name} type="file" required={!editProject} onChange={e => handleFileChange(e, name as keyof FileState)} />
                    ))}

                    <button disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded">
                        {editProject ? "Save Changes" : "Create"}
                    </button>

                    {editProject && (
                        <button type="button" onClick={handleCancelEdit} className="ml-4 bg-gray-300 px-4 py-2 rounded">Cancel</button>
                    )}
                </form>
            </div>

            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Projects ({projects.length})</h2>

                <table className="w-full">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Location</th>
                            <th>Home</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(p => (
                            <tr key={p._id}>
                                <td>{p.title}</td>
                                <td>{p.location}</td>
                                <td>{p.showOnHome ? "✅" : "❌"}</td>
                                <td>
                                    <button onClick={() => handleEditClick(p)} className="text-blue-600">Edit</button>
                                    <button onClick={() => handleDelete(p._id)} className="text-red-600 ml-3">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    );
};

export default AdminProjectForm;
