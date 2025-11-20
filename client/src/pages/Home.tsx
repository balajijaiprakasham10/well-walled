import React, { useState, useEffect } from 'react';
import axios from 'axios';
// You might need to install 'lucide-react' if you haven't already: npm install lucide-react
import { Home, CookingPot, Bed } from 'lucide-react';

const BANNER_API_URL = 'http://localhost:5000/api/banner';

interface BannerData {
    _id: string;
    imagePath: string;
    uploadedAt: string;
}

// Data for the "What We Do" section
const services = [
    {
        icon: Home,
        title: "Residential Design",
        description: "After carefully assessing the styling and furnishing needs of your house as well as the requirement of each family member, Experts at Homworks will establish a concept and then tailor design the house to suit your needs and requirements."
    },
    {
        icon: CookingPot,
        title: "Modular Kitchen Design",
        description: "We believe that right from the entryway to every corner of your kitchen should be designed with functionality in mind. At Homworks, we partner with the best to bring you high-performance modular kitchens with the widest range of designs & colour options."
    },
    {
        icon: Bed,
        title: "Bedroom & Living Room Design",
        description: "For bedroom & dining room, we understand choosing the correct tone of colours, textures and lights can make all the difference. So whether you are an owner of an apartment or villa, our designers have a lot to offer you."
    },
];

const HomePage: React.FC = () => {
    const [banner, setBanner] = useState<BannerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const response = await axios.get<BannerData>(BANNER_API_URL);
                setBanner(response.data);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    setError('No banner image set yet.');
                } else {
                    console.error('Error fetching banner:', err);
                    setError('Failed to load banner image.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBanner();
    }, []);

    const BannerSection = () => (
        <div className="relative w-full overflow-hidden" style={{ height: '800px' }}>
            <img
                src={banner ? `http://localhost:5000/${banner.imagePath}` : `https://placehold.co/1920x800/2F305E/FFFFFF?text=Set+Your+Homepage+Banner`}
                alt="Homepage Banner"
                className="w-full h-full object-cover"
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://placehold.co/1920x800/E5E7EB/6B7280?text=Banner+Image+Failed+to+Load`;
                }}
            />
            {/* You can add a hero overlay here if needed */}
        </div>
    );

    const WhatWeDoSection = () => (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-5xl font-extrabold text-gray-800 tracking-tight mb-4">
                    What We Do
                </h2>
                <p className="mt-2 text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
                    India's Only Truly End To End Interior Design Agency Bringing Your Dream Home in Reality
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {services.map((service, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-6 border-b-2 border-transparent hover:border-indigo-400 transition-all duration-300">
                            {/* Icon */}
                            <div className="mb-4">
                                <service.icon className="w-16 h-16 text-gray-800 stroke-1" />
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2 w-3/4 mx-auto">
                                {service.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    if (loading) {
        return <div className="text-center p-8 text-xl font-medium text-indigo-600">Loading banner and homepage content...</div>;
    }

    return (
        <div className="home-page">
            {/* 1. Banner Section */}
            {banner || error ? (
                <BannerSection />
            ) : (
                <div className="bg-gray-100 text-center py-12">
                    <p className="text-gray-600">{error || 'No banner image available.'}</p>
                </div>
            )}

            {/* 2. Main Content / What We Do Section */}
            <main>
                <WhatWeDoSection />

                {/* Additional Content Area */}
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Featured Projects</h1>
                    <p className="text-lg text-gray-700">
                        This area can showcase your latest projects or featured content.
                    </p>
                    {/* Add more of your homepage content here */}
                </div>
            </main>
        </div>
    );
};

export default HomePage;