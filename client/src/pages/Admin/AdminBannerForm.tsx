import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = (import.meta as any).env.VITE_API;
const API_URL = `${API_BASE}/api/banner`;

// ✅ Updated interface to support image OR video
interface BannerData {
    _id: string;
    mediaUrl: string;
    mediaType: "image" | "video";
    uploadedAt: string;
}

const AdminBannerForm: React.FC = () => {
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [currentBanner, setCurrentBanner] = useState<BannerData | null>(null);
    const [bannerLoading, setBannerLoading] = useState(false);
    const [bannerMessage, setBannerMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const getAuthConfig = () => {
        const token = localStorage.getItem("adminToken");
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    // --- FETCH BANNER ---
    const fetchBanner = useCallback(async () => {
        setBannerLoading(true);
        try {
            const response = await axios.get<BannerData>(API_URL);
            setCurrentBanner(response.data);
            setBannerMessage(null);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                setCurrentBanner(null);
            } else {
                console.error('Error fetching banner:', err);
                setBannerMessage({ type: 'error', text: 'Failed to load banner.' });
            }
        } finally {
            setBannerLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBanner();
    }, [fetchBanner]);

    // --- FILE CHANGE ---
    const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setBannerFile(file);
    };

    // --- UPLOAD ---
    const handleBannerUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setBannerLoading(true);
        setBannerMessage(null);

        if (!bannerFile) {
            setBannerMessage({ type: 'error', text: 'Please select a banner image or video.' });
            setBannerLoading(false);
            return;
        }

        const data = new FormData();
        data.append('bannerFile', bannerFile); // ✅ MUST MATCH BACKEND

        try {
            await axios.post(API_URL, data, getAuthConfig());
            setBannerMessage({ type: 'success', text: 'Banner uploaded successfully!' });
            setBannerFile(null);
            fetchBanner();
        } catch (error) {
            console.error('Banner upload failed:', error);
            const errorMsg = axios.isAxiosError(error)
                ? error.response?.data?.msg || 'Upload failed.'
                : 'Server error.';
            setBannerMessage({ type: 'error', text: errorMsg });
        } finally {
            setBannerLoading(false);
        }
    };

    // --- DELETE ---
    const handleBannerDelete = async () => {
        if (!window.confirm("Are you sure you want to delete the banner?")) return;

        setBannerLoading(true);
        setBannerMessage(null);
        try {
            await axios.delete(API_URL, getAuthConfig());
            setBannerMessage({ type: 'success', text: 'Banner deleted successfully!' });
            setCurrentBanner(null);
        } catch (error) {
            console.error('Banner deletion failed:', error);
            const errorMsg = axios.isAxiosError(error)
                ? error.response?.data?.msg || 'Delete failed.'
                : 'Server error.';
            setBannerMessage({ type: 'error', text: errorMsg });
        } finally {
            setBannerLoading(false);
        }
    };

    return (
        <div className="flex-1 p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">
                Banner Management
            </h1>

            <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-xl mb-12">

                <h2 className="text-3xl font-bold text-gray-900 mb-6">Homepage Banner</h2>

                {bannerMessage && (
                    <div className={`p-4 mb-4 rounded-lg text-sm 
          ${bannerMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {bannerMessage.text}
                    </div>
                )}

                {/* ✅ DISPLAY CURRENT BANNER */}
                {currentBanner ? (
                    <div className="mb-6 border p-4 rounded-lg bg-indigo-50">
                        <h3 className="text-xl font-semibold text-indigo-700 mb-3">Current Banner</h3>

                        {currentBanner.mediaType === "video" ? (
                            <video
                                src={currentBanner.mediaUrl}
                                controls
                                autoPlay
                                muted
                                loop
                                className="max-w-full rounded-md shadow-md mb-4"
                                style={{ maxHeight: '300px', objectFit: 'cover' }}
                            />
                        ) : (
                            <img
                                src={currentBanner.mediaUrl}
                                alt="Current Banner"
                                className="max-w-full h-auto rounded-md shadow-md mb-4"
                                style={{ maxHeight: '300px', objectFit: 'cover' }}
                            />
                        )}

                        <p className="text-sm text-gray-600 mb-3">
                            Uploaded: {new Date(currentBanner.uploadedAt).toLocaleString()}
                        </p>

                        <button
                            onClick={handleBannerDelete}
                            disabled={bannerLoading}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            {bannerLoading ? 'Deleting…' : 'Delete Banner'}
                        </button>
                    </div>
                ) : (
                    <p className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800">
                        No banner uploaded.
                    </p>
                )}

                {/* ✅ UPLOAD FORM */}
                <form onSubmit={handleBannerUpload} className="space-y-4 border-t pt-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Upload Image OR Video
                        </label>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleBannerFileChange}
                            required={!currentBanner}
                            className="mt-1 block w-full text-sm file:rounded-full file:bg-indigo-50"
                        />
                        {bannerFile && (
                            <p className="text-xs text-gray-500 mt-1">
                                Selected: {bannerFile.name}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={bannerLoading || !bannerFile}
                        className="w-full py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {bannerLoading ? 'Uploading…' : currentBanner ? 'Update Banner' : 'Upload Banner'}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default AdminBannerForm;
