import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = (import.meta as any).env.VITE_API;
const API_URL = `${API_BASE}/api/banner`;
const CATEGORY_URL = `${API_BASE}/api/categories`;

interface BannerData {
    _id: string;
    page: string;
    // Desktop
    mediaUrl?: string;
    mediaType?: "image" | "video";
    // Mobile
    mobileMediaUrl?: string;
    mobileMediaType?: "image" | "video";

    uploadedAt: string;
}

interface Category {
    _id: string;
    name: string;
}

const STATIC_PAGES = ["home", "gallery", "about"];

const AdminBannerForm: React.FC = () => {
    // Files state
    const [desktopFile, setDesktopFile] = useState<File | null>(null);
    const [mobileFile, setMobileFile] = useState<File | null>(null);

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
            const categoryPages = res.data.map(c => `${c.name}`);
            setAllPages([...STATIC_PAGES, ...categoryPages]);
        } catch (err) {
            console.error("Failed to load categories", err);
        }
    };

    // ================= FETCH BANNER =================
    const fetchBanner = useCallback(async () => {
        setBannerLoading(true);
        setDesktopFile(null); // Reset file inputs on page change
        setMobileFile(null);

        try {
            const res = await axios.get<BannerData>(`${API_URL}?page=${selectedPage}`);
            setCurrentBanner(res.data);
            setBannerMessage(null);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                setCurrentBanner(null);
            } else {
                setBannerMessage({ type: 'error', text: 'Failed to load banner.' });
            }
        } finally {
            setBannerLoading(false);
        }
    }, [selectedPage]);

    useEffect(() => { fetchCategories(); }, []);
    useEffect(() => { fetchBanner(); }, [fetchBanner]);

    // ================= HANDLERS =================

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: ensure at least one file is there
        if (!desktopFile && !mobileFile) {
            return setBannerMessage({ type: 'error', text: 'Select at least one file' });
        }

        const data = new FormData();
        data.append("page", selectedPage);

        // ✅ CRITICAL FIX: Only append if file exists
        if (desktopFile) {
            data.append("bannerFile", desktopFile); // Must match backend name "bannerFile"
        }

        if (mobileFile) {
            data.append("mobileFile", mobileFile); // Must match backend name "mobileFile"
        }

        setBannerLoading(true);
        try {
            await axios.post(API_URL, data, getAuthConfig());
            setBannerMessage({ type: 'success', text: `Updated ${selectedPage}` });

            // Clear inputs
            setDesktopFile(null);
            setMobileFile(null);

            // Refresh view
            fetchBanner();
        } catch (err) {
            console.error(err);
            const msg = axios.isAxiosError(err) ? err.response?.data?.msg : "Upload failed";
            setBannerMessage({ type: 'error', text: msg || "Upload error" });
        } finally {
            setBannerLoading(false);
        }
    };

    // Delete specific type or all
    const handleDelete = async (type?: 'desktop' | 'mobile') => {
        const confirmMsg = type
            ? `Delete ${type} banner for ${selectedPage}?`
            : `Delete ALL banners for ${selectedPage}?`;

        if (!window.confirm(confirmMsg)) return;

        setBannerLoading(true);
        try {
            // Append ?type=mobile or ?type=desktop if specific, else delete entire doc
            const query = type ? `?page=${selectedPage}&type=${type}` : `?page=${selectedPage}`;
            await axios.delete(`${API_URL}${query}`, getAuthConfig());

            setBannerMessage({ type: 'success', text: 'Deleted successfully' });
            fetchBanner(); // Refresh to see changes
        } catch {
            setBannerMessage({ type: 'error', text: 'Delete failed' });
        } finally {
            setBannerLoading(false);
        }
    };

    // ================= UI HELPERS =================
    const renderMedia = (url?: string, type?: string) => {
        if (!url) return <div className="h-32 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">No Media</div>;

        if (type === "video") {
            return <video src={url} controls className="w-full h-auto rounded shadow bg-black max-h-64 object-contain" />;
        }
        return <img src={url} alt="Banner" className="w-full h-auto rounded shadow bg-gray-50 max-h-64 object-contain" />;
    };

    // ================= UI =================
    return (
        <div className="flex-1 p-8 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">Banner Manager</h1>

            <div className="max-w-5xl mx-auto bg-white p-8 shadow-lg rounded-xl">

                {/* STATUS MESSAGE */}
                {bannerMessage && (
                    <div className={`p-4 mb-6 rounded-lg font-medium ${bannerMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {bannerMessage.text}
                    </div>
                )}

                {/* PAGE SELECTOR */}
                <div className="mb-8">
                    <label className="text-gray-700 font-bold mb-2 block">Select Page to Edit</label>
                    <select
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(e.target.value)}
                        className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        {allPages.map(page => (
                            <option key={page} value={page}>{page.toUpperCase()}</option>
                        ))}
                    </select>
                </div>

                <form onSubmit={handleUpload}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

                        {/* --- DESKTOP VIEW --- */}
                        <div className="border p-6 rounded-xl bg-gray-50">
                            <h3 className="font-bold text-lg mb-4 text-gray-700 border-b pb-2">🖥️ Desktop Banner</h3>

                            {/* Preview */}
                            <div className="mb-4 aspect-video bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                                {renderMedia(currentBanner?.mediaUrl, currentBanner?.mediaType)}
                            </div>

                            {currentBanner?.mediaUrl && (
                                <button type="button" onClick={() => handleDelete('desktop')} className="text-red-500 text-sm hover:underline mb-4 block">
                                    Remove Desktop Only
                                </button>
                            )}

                            {/* Input */}
                            <label className="block text-sm font-medium text-gray-700 mb-1">Update Desktop File</label>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(e) => setDesktopFile(e.target.files?.[0] || null)}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                        </div>

                        {/* --- MOBILE VIEW --- */}
                        <div className="border p-6 rounded-xl bg-gray-50">
                            <h3 className="font-bold text-lg mb-4 text-gray-700 border-b pb-2">📱 Mobile Banner (1:1)</h3>

                            {/* Preview */}
                            <div className="mb-4 aspect-square bg-gray-200 rounded overflow-hidden flex items-center justify-center max-w-[300px] mx-auto">
                                {renderMedia(currentBanner?.mobileMediaUrl, currentBanner?.mobileMediaType)}
                            </div>

                            {currentBanner?.mobileMediaUrl && (
                                <button type="button" onClick={() => handleDelete('mobile')} className="text-red-500 text-sm hover:underline mb-4 block text-center">
                                    Remove Mobile Only
                                </button>
                            )}

                            {/* Input */}
                            <label className="block text-sm font-medium text-gray-700 mb-1">Update Mobile File</label>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(e) => setMobileFile(e.target.files?.[0] || null)}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                            />
                        </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={bannerLoading || (!desktopFile && !mobileFile)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {bannerLoading ? "Uploading..." : "Save Changes"}
                    </button>

                    {/* DELETE ALL */}
                    {(currentBanner?.mediaUrl || currentBanner?.mobileMediaUrl) && (
                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={() => handleDelete()}
                                className="text-red-600 text-sm hover:text-red-800 font-medium"
                            >
                                Delete Entire Entry for {selectedPage}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AdminBannerForm;