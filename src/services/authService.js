import apiClient from './api';

export const authService = {
    register: async (username, password) => {
        const response = await apiClient.post('/auth/register', {
            username,
            password
        });
        return response.data;
    },

    login: async (username, password) => {
        const response = await apiClient.post('/auth/login', {
            username,
            password
        });

        // Save token to localStorage
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('username', username);
        }

        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    getUsername: () => {
        return localStorage.getItem('username');
    }
};