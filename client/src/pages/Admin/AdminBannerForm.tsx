import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = (import.meta as any).env.VITE_API;
const API_URL = `${API_BASE}/api/banner`;
const CATEGORY_URL = `${API_BASE}/api/categories`;

interface BannerData {
    _id: string;
    page: string;
    mediaUrl: string;
    mediaType: "image" | "video";
    uploadedAt: string;
}

interface Category {
    _id: string;
    name: string;
}

// ✅ STATIC PAGES
const STATIC_PAGES = [
    "home",
    "gallery",
    "about",
    
];

const AdminBannerForm: React.FC = () => {
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [currentBanner, setCurrentBanner] = useState<BannerData | null>(null);
    const [, setCategories] = useState<Category[]>([]);
    const [allPages, setAllPages] = useState<string[]>(STATIC_PAGES);

    const [selectedPage, setSelectedPage] = useState<string>(STATIC_PAGES[0]);
    const [bannerLoading, setBannerLoading] = useState(false);
    const [bannerMessage, setBannerMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const getAuthConfig = () => {
        const token = localStorage.getItem("adminToken");
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    // ================= FETCH CATEGORIES =================
    const fetchCategories = async () => {
        try {
            const res = await axios.get<Category[]>(CATEGORY_URL);
            setCategories(res.data);

            // ✅ Merge static pages + dynamic category pages
            const categoryPages = res.data.map(c => `${c.name}`);
            setAllPages([...STATIC_PAGES, ...categoryPages]);

        } catch (err) {
            console.error("Failed to load categories", err);
        }
    };

    // ================= FETCH BANNER =================
    const fetchBanner = useCallback(async () => {
        setBannerLoading(true);
        try {
            const res = await axios.get<BannerData>(`${API_URL}?page=${selectedPage}`);
            setCurrentBanner(res.data);
            setBannerMessage(null);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                setCurrentBanner(null);
            } else {
                console.error(err);
                setBannerMessage({ type: 'error', text: 'Failed to load banner.' });
            }
        } finally {
            setBannerLoading(false);
        }
    }, [selectedPage]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchBanner();
    }, [fetchBanner]);

    // ================= HANDLERS =================
    const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setBannerFile(file);
    };

    const handleBannerUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bannerFile) return setBannerMessage({ type: 'error', text: 'Select a file' });

        const data = new FormData();
        data.append("page", selectedPage); // IMPORTANT FIRST
        data.append("bannerFile", bannerFile);

        setBannerLoading(true);
        try {
            await axios.post(API_URL, data, getAuthConfig());
            setBannerMessage({ type: 'success', text: `Banner uploaded for ${selectedPage}` });
            setBannerFile(null);
            fetchBanner();
        } catch (err) {
            const msg = axios.isAxiosError(err) ? err.response?.data?.msg : "Upload failed";
            setBannerMessage({ type: 'error', text: msg || "Upload error" });
        } finally {
            setBannerLoading(false);
        }
    };

    const handleBannerDelete = async () => {
        if (!window.confirm(`Delete banner for ${selectedPage}?`)) return;
        setBannerLoading(true);
        try {
            await axios.delete(`${API_URL}?page=${selectedPage}`, getAuthConfig());
            setCurrentBanner(null);
            setBannerMessage({ type: 'success', text: 'Banner deleted' });
        } catch {
            setBannerMessage({ type: 'error', text: 'Delete failed' });
        } finally {
            setBannerLoading(false);
        }
    };

    // ================= UI =================
    return (
        <div className="flex-1 p-8 bg-gray-100">
            <h1 className="text-4xl font-bold mb-6">Banner Manager</h1>

            <div className="max-w-4xl mx-auto bg-white p-8 shadow rounded">

                {/* STATUS */}
                {bannerMessage && (
                    <div className={`p-3 mb-4 rounded ${bannerMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {bannerMessage.text}
                    </div>
                )}

                {/* PAGE SELECT */}
                <div className="mb-6">
                    <label className="font-semibold block mb-2">Select Page</label>
                    <select
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(e.target.value)}
                        className="w-full border p-3 rounded"
                    >
                        {allPages.map(page => (
                            <option key={page} value={page}>
                                {page}
                            </option>
                        ))}
                    </select>
                </div>

                {/* CURRENT BANNER */}
                {currentBanner ? (
                    <div className="border p-4 rounded mb-6 bg-indigo-50">
                        <h3 className="font-semibold mb-3">Current Banner</h3>

                        {currentBanner.mediaType === "image" ? (
                            <img src={currentBanner.mediaUrl} className="rounded shadow max-h-72 w-full object-cover" />
                        ) : (
                            <video src={currentBanner.mediaUrl} controls className="rounded shadow max-h-72 w-full object-cover" />
                        )}

                        <button
                            onClick={handleBannerDelete}
                            className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Delete Banner
                        </button>
                    </div>
                ) : (
                    <p className="mb-6 bg-yellow-100 p-3 rounded">
                        No banner for this page.
                    </p>
                )}

                {/* UPLOAD */}
                <form onSubmit={handleBannerUpload} className="space-y-4 border-t pt-6">
                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleBannerFileChange}
                        className="border w-full p-2"
                    />

                    <button
                        disabled={bannerLoading || !bannerFile}
                        className="w-full bg-indigo-600 text-white py-3 rounded disabled:opacity-40"
                    >
                        {bannerLoading ? "Uploading..." : "Upload Banner"}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default AdminBannerForm;
