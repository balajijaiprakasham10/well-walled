import { useState } from "react";
import axios from "axios";

const API_BASE = (import.meta as any).env.VITE_API;
const API_URL = `${API_BASE}/api/auth/login`;

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(API_URL, { username, password });
            localStorage.setItem("adminToken", res.data.token);
            window.location.href = "/admin";
        } catch {
            setError("Invalid Credentials");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-lg shadow-lg w-96"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

                {error && <p className="text-red-600 mb-3">{error}</p>}

                <input
                    type="text"
                    placeholder="Username"
                    className="border p-3 w-full rounded mb-4"
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="border p-3 w-full rounded mb-6"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    className="bg-indigo-600 text-white w-full py-2 rounded-lg"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
