import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

interface Item {
    _id: string;
    title: string;
    category: string;
    description: string;
    images: string[];
}

const API_BASE = (import.meta as any).env.VITE_API;
const API_URL = `${API_BASE}/api/items/category/`;


const CategoryProductPage = () => {
    const { categoryId } = useParams();
    const [items, setItems] = useState<Item[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        try {
            const res = await axios.get(API_URL + categoryId);
            setItems(res.data);
        } catch (err) {
            console.error("❌ Failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (categoryId) fetchItems();
    }, [categoryId]);

    if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
    if (items.length === 0) return <p className="p-6 text-gray-500">No items found.</p>;

    const item = items[0];

    const nextImage = () =>
        setCurrentIndex((prev) => (prev + 1) % item.images.length);
    const prevImage = () =>
        setCurrentIndex((prev) => (prev - 1 + item.images.length) % item.images.length);

    return (
        <div className="bg-white">
            <main className="max-w-7xl mx-auto pt-16 pb-10 px-6">

                {/* Title + Description Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                    <h2 className="text-6xl font-light text-gray-900 capitalize md:col-span-1">
                        {item.category}
                    </h2>

                    <p className="text-lg text-gray-600 leading-relaxed border-l-4 pl-4 border-indigo-500 md:col-span-2">
                        {item.description}
                    </p>
                </div>

                {/* Image Slider */}
                <div className="relative w-full flex justify-center items-center mt-6">
                    <motion.img
                        key={currentIndex}
                        src={item.images[currentIndex]}
                        alt="Preview"
                        className="rounded-lg shadow-lg object-cover w-full max-h-[500px]"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    />

                    {/* Arrows */}
                    <button
                        onClick={prevImage}
                        className="absolute left-4 text-3xl bg-white shadow-lg rounded-full px-2 py-1"
                    >
                        ❮
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-4 text-3xl bg-white shadow-lg rounded-full px-2 py-1"
                    >
                        ❯
                    </button>
                </div>

                {/* Thumbnails Strip */}
                <div className="flex gap-4 overflow-x-auto mt-6 pb-3">
                    {item.images.map((img, index) => (
                        <motion.img
                            key={index}
                            src={img}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-32 rounded-lg cursor-pointer object-cover transition border-2 ${currentIndex === index
                                    ? "border-indigo-600"
                                    : "border-transparent opacity-70 hover:opacity-100"
                                }`}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default CategoryProductPage;
