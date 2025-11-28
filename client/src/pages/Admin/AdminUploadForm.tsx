import React, { useState, useEffect } from "react";
import axios from "axios";
import type { Project } from "../../types/ProjectTypes";

const API_BASE = (import.meta as any).env.VITE_API;
const API_URL = `${API_BASE}/api/projects`;

interface FormData {
    title: string;
    description: string;
    location: string;
    showOnHome: boolean;
}

const initialFormData: FormData = {
    title: "",
    description: "",
    location: "",
    showOnHome: false,
};

const AdminProjectForm: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [images, setImages] = useState<File[]>([]);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
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
            setMessage({ type: "error", text: "Failed to load projects." });
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleEditClick = (project: Project) => {
        setEditProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            location: project.location,
            showOnHome: Boolean(project.showOnHome),
        });
        setImages([]); // reset images on edit
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelEdit = () => {
        setEditProject(null);
        setFormData(initialFormData);
        setImages([]);
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
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("location", formData.location);
        data.append("showOnHome", String(formData.showOnHome));

        images.forEach(img => data.append("images", img));

        // ✅ validation
        if (!editProject && images.length === 0) {
            setMessage({ type: "error", text: "Upload at least one image!" });
            setLoading(false);
            return;
        }

        try {
            if (editProject) {
                await axios.put(`${API_URL}/${editProject._id}`, data, getAuthConfig());
                setMessage({ type: "success", text: "Updated successfully!" });
                handleCancelEdit();
            } else {
                await axios.post(API_URL, data, getAuthConfig());
                setMessage({ type: "success", text: "Created successfully!" });
                setFormData(initialFormData);
                setImages([]);
            }

            fetchProjects();
        } catch {
            setMessage({ type: "error", text: "Operation failed." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Project Management</h1>

            {message && (
                <div className={`p-3 mb-4 rounded ${message.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white p-6 rounded shadow mb-10">
                <h2 className="text-xl font-bold mb-4">
                    {editProject ? "Edit Project" : "Create Project"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleTextChange}
                        required
                        className="w-full border p-2"
                    />

                    <input
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleTextChange}
                        required
                        className="w-full border p-2"
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleTextChange}
                        rows={4}
                        required
                        className="w-full border p-2"
                    />

                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.showOnHome} onChange={handleCheckboxChange} />
                        Show on Homepage
                    </label>

                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        required={!editProject}
                    />

                    {editProject && (
                        <p className="text-sm text-gray-500">
                            Uploading new images will replace existing ones.
                        </p>
                    )}

                    <button disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded">
                        {editProject ? "Save Changes" : "Create Project"}
                    </button>

                    {editProject && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="ml-4 bg-gray-300 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    )}
                </form>
            </div>

            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Projects ({projects.length})</h2>

                <table className="w-full border">
                    <thead>
                        <tr>
                            <th className="border p-2">Title</th>
                            <th className="border p-2">Location</th>
                            <th className="border p-2">Home</th>
                            <th className="border p-2">Images</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(p => (
                            <tr key={p._id}>
                                <td className="border p-2">{p.title}</td>
                                <td className="border p-2">{p.location}</td>
                                <td className="border p-2">{p.showOnHome ? "✅" : "❌"}</td>
                                <td className="border p-2">{p.images.length}</td>
                                <td className="border p-2">
                                    <button onClick={() => handleEditClick(p)} className="text-blue-600">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(p._id)} className="text-red-600 ml-3">
                                        Delete
                                    </button>
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
