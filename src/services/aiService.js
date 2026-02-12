import api from './api';

/**
 * Send a message to the AI assistant
 * @param {string} message - User message
 * @param {Array} conversationHistory - Previous messages
 * @returns {Promise} Response with AI reply and mentioned games
 */
export const sendMessage = async (message, conversationHistory = []) => {
    const response = await api.post('/ai/chat', {
        message,
        conversationHistory
    });
    return response.data;
};
