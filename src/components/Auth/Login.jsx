import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { useNavigate, Link, useLocation } from "react-router-dom";

function Login() {
    const location = useLocation();
    const from = location.state?.from?.pathname || "/chat";
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.username || !formData.password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            const response = await authService.login(formData.username, formData.password);
            navigate(from, { replace: true });
        } catch (err) {
            if (err.response?.status === 401)
                setError('Invalid username or password');
            else if (err.response?.data?.detail)
                setError(err.response.data.detail);
            else
                setError('Login failed. Please try again.');
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
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Sign in</h2>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
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
                                placeholder="Enter your username"
                                disabled={loading}
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
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                placeholder="Enter your password"
                                disabled={loading}
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
                                    Signing in...
                                </>
                            ) : "Sign in"}
                        </button>
                    </form>

                    {/* Register link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-teal-600 hover:text-teal-700 font-medium transition">
                                Register here
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

export default Login;