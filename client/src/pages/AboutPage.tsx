import React from "react";
import { motion } from "framer-motion";

const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            {/* Hero Section */}
            <section className="relative h-[60vh] bg-fixed bg-center bg-cover"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=2070')" }}
            >
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-white text-5xl md:text-6xl font-extrabold tracking-wider text-center px-4"
                    >
                        ABOUT US
                    </motion.h1>
                </div>
            </section>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">

                {/* Who We Are */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 gap-12 items-center"
                >
                    <img
                        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070"
                        alt="Interior project"
                        className="rounded-xl shadow-lg"
                    />
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
                        <p className="leading-relaxed text-gray-600">
                            WELLWALLED HABITAT is a professional spatial design firm committed
                            to crafting inspiring, sustainable, and highly functional spaces.
                            We combine smart architectural design with modern aesthetics to
                            transform environments into experiences.
                        </p>
                    </div>
                </motion.div>

                {/* Our Mission */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 gap-12 items-center"
                >
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                        <p className="leading-relaxed text-gray-600">
                            We believe in crafting personalized spaces that reflect identity
                            and elevate everyday living. Our mission is to deliver innovative,
                            high-quality solutions while ensuring comfort, sustainability, and
                            client satisfaction.
                        </p>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070"
                        alt="Design work"
                        className="rounded-xl shadow-lg"
                    />
                </motion.div>

                {/* Values Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold mb-8">What We Stand For</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Innovation", desc: "We bring creativity and technology together." },
                            { title: "Quality", desc: "We maintain high standards in every detail." },
                            { title: "Sustainability", desc: "We design with the future in mind." }
                        ].map((item) => (
                            <motion.div
                                key={item.title}
                                whileHover={{ scale: 1.05 }}
                                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                            >
                                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                                <p className="text-gray-600 text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default AboutPage;
