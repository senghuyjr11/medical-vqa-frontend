import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        if (error) setError("");
        if (success) setSuccess("");
    };

    const validate = () => {
        if (!formData.username || !formData.password || !formData.confirmPassword)
            return "Please fill in all fields";
        if (formData.password.length < 6)
            return "Password must be at least 6 characters";
        if (formData.password !== formData.confirmPassword)
            return "Passwords do not match";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const msg = validate();
        if (msg) { setError(msg); setLoading(false); return; }

        try {
            const res = await authService.register(formData.username, formData.password);
            setSuccess("Account created! Redirecting to login...");
            setTimeout(() => navigate("/login"), 800);
        } catch (err) {
            const detail = err?.response?.data?.detail;
            if (err?.response?.status === 409)
                setError("Username already exists. Please choose another.");
            else if (detail) setError(detail);
            else setError("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-600 rounded-xl mb-4 shadow-sm">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 8h-3V5a1 1 0 00-1-1h-6a1 1 0 00-1 1v3H5a1 1 0 00-1 1v6a1 1 0 001 1h3v3a1 1 0 001 1h6a1 1 0 001-1v-3h3a1 1 0 001-1V9a1 1 0 00-1-1z"/>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900">Medical VQA Assistant</h1>
                    <p className="text-gray-400 text-sm mt-1">AI-Powered Clinical Q&A</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Create an account</h2>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
                            <p className="text-teal-600 text-sm">{success}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                placeholder="Choose a username"
                                disabled={loading}
                                autoComplete="username"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                placeholder="Create a password"
                                disabled={loading}
                                autoComplete="new-password"
                            />
                            <p className="text-xs text-gray-400 mt-1.5">At least 6 characters</p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                placeholder="Re-enter your password"
                                disabled={loading}
                                autoComplete="new-password"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white disabled:text-slate-400 font-medium rounded-lg transition duration-200 flex items-center justify-center shadow-sm"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    Creating account...
                                </>
                            ) : "Create Account"}
                        </button>
                    </form>

                    {/* Login link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium transition">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-400 text-xs mt-6">
                    For clinical decision support only — not a substitute for professional medical judgment
                </p>
            </div>
        </div>
    );
}

export default Register;