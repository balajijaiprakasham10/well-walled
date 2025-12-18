import React, { useState, useEffect } from "react";
import axios from "axios";

// NOTE: Ensure your global CSS has this class for video parallax:
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
    mobileMediaUrl?: string;
    mobileMediaType?: "image" | "video";
}

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
    const [isMobile, setIsMobile] = useState(false);

    // 1. Detect Screen Size
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 2. Fetch Banner Data
    useEffect(() => {
        const fetchBanner = async () => {
            setLoading(true);
            const tryFetch = async (key: string) => {
                const res = await axios.get(`${API_BASE}/api/banner?page=${key}`);
                return res.data;
            };

            try {
                const normalizePage = (p: string) => p.replace(/^\/+/, "").toLowerCase();
                const bannerData = await tryFetch(normalizePage(page));
                setBanner(bannerData);
            } catch {
                try {
                    if (page.startsWith("products/")) {
                        const fallback = await tryFetch(DEFAULT_FALLBACK.products);
                        setBanner(fallback);
                        return;
                    }
                    const siteFallback = await tryFetch(DEFAULT_FALLBACK.site);
                    setBanner(siteFallback);
                } catch {
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

    // 3. Determine Active Media
    const hasMobileMedia = !!banner.mobileMediaUrl;
    const showMobile = isMobile && hasMobileMedia;

    const activeUrl = showMobile ? banner.mobileMediaUrl : banner.mediaUrl;
    const activeType = showMobile ? banner.mobileMediaType : banner.mediaType;

    return (
        <div className={`relative w-full overflow-hidden ${className}`}>

            {/* ✅ FIXED PARALLAX LAYER 
               This div stays fixed to the viewport window (z-0) 
               while the content (z-10) scrolls over it.
            */}
            <div className="fixed top-0 left-0 w-full h-full -z-10">
                {activeType === "video" ? (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        src={activeUrl}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center' }}
                    />
                ) : (
                    <img
                        src={activeUrl}
                        alt="Banner"
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center' }}
                    />
                )}
                {/* Dark Overlay inside the fixed layer so it covers the image correctly */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* ✅ CONTENT LAYER
               Relative positioning allows this to scroll normally 
               over the fixed background behind it.
            */}
            <div className="relative z-10 h-full flex items-center justify-center">
                {children ? (
                    children
                ) : (
                    <div className="text-center text-white px-4">
                        {title && (
                            <h1 className="text-5xl md:text-6xl font-serif mb-4 drop-shadow-lg">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className="max-w-2xl mx-auto text-lg text-white/90 drop-shadow-md">
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