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
        <header className="w-full shrink-0 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
                {/* Simple medical cross icon */}
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 8h-3V5a1 1 0 00-1-1h-6a1 1 0 00-1 1v3H5a1 1 0 00-1 1v6a1 1 0 001 1h3v3a1 1 0 001 1h6a1 1 0 001-1v-3h3a1 1 0 001-1V9a1 1 0 00-1-1z"/>
                    </svg>
                </div>
                <div>
                    <div className="text-gray-900 font-semibold text-base leading-tight">Medical VQA Assistant</div>
                    <div className="text-gray-400 text-xs">AI-Powered Clinical Q&A</div>
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium transition-colors"
            >
                Sign out
            </button>
        </header>
    );
}