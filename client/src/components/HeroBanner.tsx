import React, { useState, useEffect } from "react";
import axios from "axios";

// NOTE: We need a custom CSS class for the 3D Parallax parent
// You will need to add these styles to your main CSS file (e.g., index.css or global.css):
/*
.parallax-scene-video {
    perspective: 1px;
    transform-style: preserve-3d;
}
*/

const API_BASE = (import.meta as any).env.VITE_API;

interface HeroBannerProps {
    page: string;
    title?: string;
    subtitle?: string;
    children?: React.ReactNode;
    className?: string;
}

interface BannerData {
    mediaUrl: string;
    mediaType: "image" | "video";
}

// ✅ FALLBACK KEYS
const DEFAULT_FALLBACK = {
    products: "products/default",
    site: "site/default"
};

const HeroBanner: React.FC<HeroBannerProps> = ({
    page,
    title,
    subtitle,
    children,
    className = "h-screen"

}) => {
    const [banner, setBanner] = useState<BannerData | null>(null);
    const [loading, setLoading] = useState(true);

    // ... (fetchBanner useEffect remains the same)
    useEffect(() => {
        const fetchBanner = async () => {
            setLoading(true);

            const tryFetch = async (key: string) => {
                const res = await axios.get(`${API_BASE}/api/banner?page=${key}`);
                return res.data;
            };

            try {
                // 1. Try exact match
                const normalizePage = (p: string) =>
                    p.replace(/^\/+/, "").toLowerCase();

                const bannerData = await tryFetch(normalizePage(page));

                setBanner(bannerData);
            } catch {
                try {
                    // 2. Try fallback category banner
                    if (page.startsWith("products/")) {
                        const fallback = await tryFetch(DEFAULT_FALLBACK.products);
                        setBanner(fallback);
                        return;
                    }

                    // 3. Site-wide fallback
                    const siteFallback = await tryFetch(DEFAULT_FALLBACK.site);
                    setBanner(siteFallback);

                } catch {
                    // 4. Final fail → show nothing
                    setBanner(null);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBanner();
    }, [page]);

    if (loading) {
        return <div className={`${className} w-full bg-gray-200 animate-pulse`} />;
    }

    if (!banner) return null;

    // Determine if it's an image banner for the simple background parallax
    const isImage = banner.mediaType === "image";

    // Determine container classes and styles based on media type
    const containerClasses = isImage
        ? `${className} bg-cover bg-center bg-no-repeat` // Image Parallax
        : `${className} parallax-scene-video`;           // Video Parallax (requires custom CSS)

    const containerStyle = isImage
        ? { backgroundImage: `url('${banner.mediaUrl}')`, backgroundAttachment: 'fixed' } // Image Parallax Style
        : {};

    return (
        <div
            className={`relative w-full overflow-hidden ${containerClasses}`}
            style={containerStyle}
        >

            {/* MEDIA - Render only if it's a video (since image is handled by background-image/style) */}
            {banner.mediaType === "video" && (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    src={banner.mediaUrl}
                    // ✅ 3D Transform Hack for Parallax
                    style={{
                        transform: 'translateZ(-1px) scale(2)' // Pushes video back and scales it up
                    }}
                    className="absolute inset-0 w-full h-full object-cover origin-top"
                />
            )}

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/40" />

            {/* CONTENT */}
            <div className="relative z-10 h-full flex items-center justify-center">
                {children ? (
                    children
                ) : (
                    <div className="text-center text-white px-4">
                        {title && (
                            <h1 className="text-5xl md:text-6xl font-serif mb-4">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className="max-w-2xl mx-auto text-lg text-white/90">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeroBanner;  