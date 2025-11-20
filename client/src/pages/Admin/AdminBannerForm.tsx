import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BANNER_API_URL = 'http://localhost:5000/api/banner'; // BANNER API URL

interface BannerData { // Interface for Banner Image
    _id: string;
    imagePath: string;
    uploadedAt: string;
}

const AdminBannerForm: React.FC = () => {
    const [bannerImage, setBannerImage] = useState<File | null>(null);
    const [currentBanner, setCurrentBanner] = useState<BannerData | null>(null);
    const [bannerLoading, setBannerLoading] = useState(false);
    const [bannerMessage, setBannerMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // --- Data Fetching (Banner) ---
    const fetchBanner = useCallback(async () => {
        setBannerLoading(true);
        try {
            const response = await axios.get<BannerData>(BANNER_API_URL);
            setCurrentBanner(response.data);
            setBannerMessage(null);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                setCurrentBanner(null); // No banner found
            } else {
                console.error('Error fetching banner:', err);
                setBannerMessage({ type: 'error', text: 'Failed to load banner image.' });
            }
        } finally {
            setBannerLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBanner();
    }, [fetchBanner]);

    // --- BANNER HANDLERS ---
    const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setBannerImage(file);
    };

    const handleBannerUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setBannerLoading(true);
        setBannerMessage(null);

        if (!bannerImage) {
            setBannerMessage({ type: 'error', text: 'Please select an image to upload as banner.' });
            setBannerLoading(false);
            return;
        }

        const data = new FormData();
        data.append('bannerImage', bannerImage); // Must match Multer field name

        try {
            await axios.post(BANNER_API_URL, data);
            setBannerMessage({ type: 'success', text: 'Banner image uploaded/updated successfully!' });
            setBannerImage(null); // Clear selected file
            fetchBanner(); // Refresh current banner
        } catch (error) {
            console.error('Banner upload failed:', error);
            const errorMsg = axios.isAxiosError(error)
                ? error.response?.data?.msg || 'An unknown error occurred during banner upload.'
                : 'Server error.';
            setBannerMessage({ type: 'error', text: errorMsg });
        } finally {
            setBannerLoading(false);
        }
    };

    const handleBannerDelete = async () => {
        if (!window.confirm("Are you sure you want to delete the banner image?")) {
            return;
        }
        setBannerLoading(true);
        setBannerMessage(null);
        try {
            await axios.delete(BANNER_API_URL);
            setBannerMessage({ type: 'success', text: 'Banner image deleted successfully!' });
            fetchBanner(); // Refresh banner state (should become null)
        } catch (error) {
            console.error('Banner deletion failed:', error);
            const errorMsg = axios.isAxiosError(error)
                ? error.response?.data?.msg || 'An unknown error occurred during banner deletion.'
                : 'Server error.';
            setBannerMessage({ type: 'error', text: errorMsg });
        } finally {
            setBannerLoading(false);
        }
    };

    // --- Component JSX (Moved directly from the old file) ---
    return (
        <div className="flex-1 p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">
                Banner Management
            </h1>
            <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-xl mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Manage Homepage Banner</h2>
                {bannerMessage && (
                    <div className={`p-4 mb-4 rounded-lg text-sm ${bannerMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {bannerMessage.text}
                    </div>
                )}

                {currentBanner ? (
                    <div className="mb-6 border p-4 rounded-lg bg-indigo-50">
                        <h3 className="text-xl font-semibold text-indigo-700 mb-3">Current Banner Image:</h3>
                        <img
                            src={`http://localhost:5000/${currentBanner.imagePath}`} // Assuming static 'uploads' path
                            alt="Current Homepage Banner"
                            className="max-w-full h-auto rounded-md shadow-md mb-4"
                            style={{ maxHeight: '300px', objectFit: 'cover' }}
                        />
                        <p className="text-sm text-gray-600 mb-3">Uploaded: {new Date(currentBanner.uploadedAt).toLocaleString()}</p>
                        <button
                            onClick={handleBannerDelete}
                            disabled={bannerLoading}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            {bannerLoading ? 'Deleting...' : 'Delete Current Banner'}
                        </button>
                    </div>
                ) : (
                    <p className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800">No banner image currently uploaded. Please upload one below.</p>
                )}

                <form onSubmit={handleBannerUpload} className="space-y-4 border-t pt-6">
                    <div>
                        <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700">Upload New Banner Image (replaces existing)</label>
                        <input
                            type="file"
                            name="bannerImage"
                            id="bannerImage"
                            accept="image/*"
                            onChange={handleBannerFileChange}
                            required={!currentBanner} // Required if no banner exists
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        {bannerImage && <p className="text-xs text-gray-500 mt-1">Selected: {bannerImage.name}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={bannerLoading || !bannerImage}
                        className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {bannerLoading ? 'Uploading Banner...' : (currentBanner ? 'Update Banner' : 'Upload Banner')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminBannerForm;