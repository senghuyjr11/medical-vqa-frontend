import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

export default function Header({ leftSlot }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate("/login", { replace: true });
    };

    return (
        <header className="w-full shrink-0 relative flex items-center px-6 py-4 bg-white border-b border-slate-200">

            {/* Left: sidebar controls passed from parent */}
            <div className="w-72 flex-shrink-0">
                {leftSlot}
            </div>

            {/* Center: title */}
            <div className="flex-1 flex flex-col items-center">
                <div className="text-gray-900 font-semibold text-lg leading-tight">Medical VQA Assistant</div>
                <div className="text-gray-400 text-sm">AI-Powered Clinical Q&A</div>
            </div>

            {/* Right: sign out */}
            <div className="w-72 flex-shrink-0 flex justify-end">
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium transition-colors"
                >
                    Sign out
                </button>
            </div>
        </header>
    );
}