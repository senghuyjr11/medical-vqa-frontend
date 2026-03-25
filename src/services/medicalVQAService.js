import apiClient from './api';

export const medicalVQAService = {
    healthCheck: async () => {
        const response = await apiClient.get('/health');
        return response.data;
    },

    // Start new chat
    startNewChat: async (question, image = null) => {
        const formData = new FormData();
        if (question) formData.append('question', question);
        if (image) formData.append('image', image);

        const response = await apiClient.post('/chat/new', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Send message to existing chat
    sendMessage: async (sessionId, question, image = null) => {
        const formData = new FormData();
        if (question) formData.append('question', question);
        if (image) formData.append('image', image);

        const response = await apiClient.post(`/chat/${sessionId}/message`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Get chat history
    getChatHistory: async () => {
        const response = await apiClient.get('/chat/history');
        return response.data;
    },

    // Get specific session
    getSession: async (sessionId) => {
        const response = await apiClient.get(`/chat/${sessionId}`);
        return response.data;
    },

    getMemoryStatus: async (sessionId) => {
        const response = await apiClient.get(`/chat/${sessionId}/memory-status`);
        return response.data;
    },

    getSessionSummary: async (sessionId) => {
        const response = await apiClient.get(`/chat/${sessionId}/summary`);
        return response.data;
    },

    summarizeSession: async (sessionId) => {
        const response = await apiClient.post(`/chat/${sessionId}/summarize`);
        return response.data;
    },

    // Delete session
    deleteSession: async (sessionId) => {
        const response = await apiClient.delete(`/chat/${sessionId}`);
        return response.data;
    }
};
