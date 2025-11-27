import React, { useEffect, useState } from "react";
import axios from "axios";
import type { Category } from "../../types/CategoryTypes";

const API_BASE = (import.meta as any).env.VITE_API;
const API_URL = `${API_BASE}/api/items`;
const CATEGORIES_URL = `${API_BASE}/api/categories`;

interface Item {
    _id: string;
    title: string;
    description: string;
    category: string;
    images: string[];
}

const AdminItemsPage: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [files, setFiles] = useState<FileList | null>(null);
    const [message, setMessage] =
        useState<{ type: "success" | "error"; text: string } | null>(null);

    const fetchItems = async () => {
        const res = await axios.get(API_URL);
        setItems(res.data);
    };

    const fetchCategories = async () => {
        const res = await axios.get(CATEGORIES_URL);
        setCategories(res.data);
    };

    useEffect(() => {
        fetchCategories();
        fetchItems();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!files || files.length < 5) {
            return setMessage({
                type: "error",
                text: "Please upload at least 5 images",
            });
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);

        Array.from(files).forEach((file) => formData.append("images", file));

        try {
            await axios.post(API_URL, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setMessage({ type: "success", text: "Item added successfully!" });
            setTitle("");
            setDescription("");
            setCategory("");
            setFiles(null);
            fetchItems();
        } catch (err) {
            setMessage({ type: "error", text: "Failed to add item!" });
        }
    };

    const deleteItem = async (id: string) => {
        if (!window.confirm("Delete this item?")) return;
        await axios.delete(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
        });

        fetchItems();
    };

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-6">Manage Items</h1>

            {message && (
                <div
                    className={`p-3 mb-4 rounded text-white ${message.type === "success" ? "bg-green-600" : "bg-red-600"
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Add Item Form */}
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
                <input
                    type="text"
                    placeholder="Item title"
                    className="border p-2 rounded w-full"
                    value={title}
                    required
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    placeholder="Description"
                    className="border p-2 rounded w-full"
                    value={description}
                    required
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/* Dynamic Category Dropdown */}
                <select
                    value={category}
                    required
                    className="border p-2 rounded w-full"
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <div>
                    <label className="font-semibold">Upload Minimum 5 Images</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        required
                        onChange={(e) => setFiles(e.target.files)}
                        className="w-full mt-2"
                    />
                    {files && (
                        <p className="text-sm text-gray-500">
                            Selected: {files.length} files
                        </p>
                    )}
                </div>

                <button className="bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-indigo-700">
                    Add Item
                </button>
            </form>

            {/* Items Table */}
            <table className="w-full mt-8 border-collapse shadow">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-3 text-left">Title</th>
                        <th className="p-3 text-left">Category</th>
                        <th className="p-3">Images</th>
                        <th className="p-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((it) => (
                        <tr key={it._id} className="border-t">
                            <td className="p-3">{it.title}</td>
                            <td className="p-3">{it.category}</td>
                            <td className="p-3">
                                <div className="flex gap-2">
                                    {it.images.slice(0, 3).map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt="Product"
                                            className="w-10 h-10 object-cover rounded"
                                        />
                                    ))}
                                    {it.images.length > 3 && (
                                        <span className="text-sm text-gray-500">+{it.images.length - 3}</span>
                                    )}
                                </div>
                            </td>

                            <td className="p-3 text-right">
                                <button
                                    className="text-red-600 hover:underline"
                                    onClick={() => deleteItem(it._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}

                    {items.length === 0 && (
                        <tr>
                            <td colSpan={4} className="text-center p-4 text-gray-500">
                                No items found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminItemsPage;
