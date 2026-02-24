// src/services/api.js
import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://203.241.246.181:8000";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// Add token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 (token expired) — but NOT for login/register
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthLogin = error.config?.url?.includes("/auth/login");

        if (error.response?.status === 401 && !isAuthLogin) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);


export default apiClient;
