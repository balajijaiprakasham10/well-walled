// client/src/pages/ContactPage.tsx
import React, { useState } from "react";
import axios from "axios";
import { Mail, Phone, Home } from "lucide-react"; // Assuming you have lucide-react for icons

const API_BASE = import.meta.env.VITE_API; // e.g. https://wellwalled.onrender.com

const ContactUsPage: React.FC = () => {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.fullName || !form.email || !form.message) {
            alert("Please fill all fields before submitting.");
            return;
        }

        try {
            setLoading(true);

            await axios.post(`${API_BASE}/api/contact`, {
                fullName: form.fullName,
                email: form.email,
                phone: "", // no phone field in UI
                subject: "Contact Form Message", // fixed subject (no field in UI)
                message: form.message,
            });

            alert("Message sent successfully! We’ll get back to you soon.");
            setForm({ fullName: "", email: "", message: "" });
        } catch (error: any) {
            console.error(error);
            alert(
                error?.response?.data?.message ||
                "Failed to send message. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
            {/* Background Image/Overlay - replace with your actual image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/contact.jpg')" }}
            >
                <div className="absolute inset-0 bg-black opacity-60"></div>{" "}
                {/* Dark overlay */}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
                {/* Title and Description */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
                </div>

                {/* Main Content Area: Contact Info & Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
                    {/* Left Section: Contact Information */}
                    <div className="space-y-10">
                        {/* Address */}
                        <div className="flex items-start space-x-6">
                            <div className="flex-shrink-0 p-4 bg-gray-700 rounded-full">
                                <Home className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold mb-1">Address</h3>
                                <p className="text-gray-300 text-lg">
                                    4671 Sugar Camp Road,
                                    <br />
                                    Owatonna, Minnesota,
                                    <br />
                                    55060
                                </p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start space-x-6">
                            <div className="flex-shrink-0 p-4 bg-gray-700 rounded-full">
                                <Phone className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold mb-1">Phone</h3>
                                <p className="text-gray-300 text-lg">9489173631</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start space-x-6">
                            <div className="flex-shrink-0 p-4 bg-gray-700 rounded-full">
                                <Mail className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold mb-1">Email</h3>
                                <p className="text-gray-300 text-lg">
                                    wellwalledhabitat@gmail.com
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Send Message Form */}
                    <div className="bg-white p-8 md:p-10 rounded-lg shadow-xl text-gray-900">
                        <h3 className="text-3xl font-semibold mb-8">Send Message</h3>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="fullName" className="sr-only">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    placeholder="Full Name"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-blue-500 outline-none transition-colors duration-200 text-lg"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="sr-only">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-blue-500 outline-none transition-colors duration-200 text-lg"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="sr-only">
                                    Your Message
                                </label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    placeholder="Type your Message..."
                                    value={form.message}
                                    onChange={handleChange}
                                    className="w-full px-4  border-b-2 border-gray-300 focus:border-blue-500 outline-none transition-colors duration-200 resize-y text-lg"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#5d8d8d] hover:bg-cyan-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-300 text-xl disabled:opacity-60"
                            >
                                {loading ? "Sending..." : "Send"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;
