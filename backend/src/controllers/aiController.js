const Game = require('../models/Game');
const { sendPromptToOllama, buildSystemPrompt, extractGameReferences } = require('../services/ollamaService');

// @desc    Chat with AI assistant
// @route   POST /api/ai/chat
// @access  Private
const chatWithAI = async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ message: 'Message is required' });
        }

        // Fetch all games from database
        const games = await Game.find().select('title description precio categorias plataformas urlimagen');

        // Build system prompt with game data
        const systemPrompt = buildSystemPrompt(games);

        // Prepare conversation history for Ollama
        const history = [
            { role: 'system', content: systemPrompt }
        ];

        // Add previous conversation if exists (limit to last 4 messages for context)
        if (conversationHistory && Array.isArray(conversationHistory)) {
            const recentHistory = conversationHistory.slice(-4);
            history.push(...recentHistory);
        }

        // Get AI response from Ollama
        const aiResponse = await sendPromptToOllama(message, history);

        // Extract games mentioned in the response
        const mentionedGames = extractGameReferences(aiResponse, games);

        res.status(200).json({
            reply: aiResponse,
            games: mentionedGames.slice(0, 3) // Max 3 game cards
        });
    } catch (error) {
        console.error('AI Chat Error:', error.message);

        // Return user-friendly error messages
        if (error.message.includes('Ollama service is not running')) {
            return res.status(503).json({
                message: 'AI assistant is temporarily unavailable. Please try again later.',
                error: error.message
            });
        }

        res.status(500).json({
            message: 'Failed to process your request',
            error: error.message
        });
    }
};

module.exports = {
    chatWithAI
};
