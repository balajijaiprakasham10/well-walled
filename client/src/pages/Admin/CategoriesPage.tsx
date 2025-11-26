import React, { useEffect, useState } from "react";
import axios from "axios";
import type { Category } from "../../types/CategoryTypes";

const API_BASE = (import.meta as any).env.VITE_API;
const API_URL = `${API_BASE}/api/categories`;


const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState("");
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [message, setMessage] =
        useState<{ type: "success" | "error"; text: string } | null>(null);


    const getAuthConfig = () => {
        const token = localStorage.getItem("adminToken");
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };


    const fetchCategories = async () => {
        try {
            const res = await axios.get(API_URL, getAuthConfig());

            setCategories(res.data);
        } catch (err) {
            setMessage({ type: "error", text: "Failed to load categories" });
        }
    };

    // Load categories when page opens
    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        try {
            if (editCategory) {
                await axios.put(`${API_URL}/${editCategory._id}`, { name }, getAuthConfig());

                setMessage({ type: "success", text: "Category updated!" });
                setEditCategory(null);
            } else {
                await axios.post(API_URL, { name }, getAuthConfig());

                setMessage({ type: "success", text: "Category created!" });
            }

            setName("");
            fetchCategories();
        } catch (err) {
            setMessage({ type: "error", text: "Operation failed" });
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this category?")) return;

        try {
            await axios.delete(`${API_URL}/${id}`, getAuthConfig());

            setMessage({ type: "success", text: "Category deleted!" });
            fetchCategories();
        } catch (err) {
            setMessage({ type: "error", text: "Failed to delete" });
        }
    };

    const handleEdit = (cat: Category) => {
        setEditCategory(cat);
        setName(cat.name);
        setMessage(null);
    };

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-6">Manage Categories</h1>

            {message && (
                <div
                    className={`p-3 mb-4 rounded text-white ${message.type === "success" ? "bg-green-600" : "bg-red-600"
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
                <input
                    type="text"
                    placeholder="Category name"
                    className="border p-2 rounded flex-grow"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded shadow"
                >
                    {editCategory ? "Save" : "Add"}
                </button>
                {editCategory && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditCategory(null);
                            setName("");
                        }}
                        className="bg-gray-400 text-white px-4 py-2 rounded shadow"
                    >
                        Cancel
                    </button>
                )}
            </form>

            {/* Category Table */}
            <table className="w-full border-collapse shadow-md">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left">Category</th>
                        <th className="p-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((cat) => (
                        <tr key={cat._id} className="border-t">
                            <td className="p-3">{cat.name}</td>
                            <td className="p-3 text-right space-x-2">
                                <button
                                    onClick={() => handleEdit(cat)}
                                    className="text-indigo-600 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(cat._id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {categories.length === 0 && (
                        <tr>
                            <td colSpan={2} className="text-center p-4 text-gray-500">
                                No categories found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CategoriesPage;
