import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

export default function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate("/login", { replace: true });
    };

    return (
        <header className="w-full shrink-0 flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
        <div className="text-white font-semibold">
                Medical VQA Assistant
            </div>

            <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
            >
                Logout
            </button>
        </header>
    );
}
