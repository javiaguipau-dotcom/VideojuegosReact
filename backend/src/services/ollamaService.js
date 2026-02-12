const axios = require('axios');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:0.5b';

/**
 * Send a prompt to Ollama and get AI response
 * @param {string} prompt - The prompt to send
 * @param {Array} history - Optional conversation history
 * @returns {Promise<string>} AI response
 */
const sendPromptToOllama = async (prompt, history = []) => {
    try {
        // Build messages array with history
        const messages = [
            ...history,
            { role: 'user', content: prompt }
        ];

        const response = await axios.post(`${OLLAMA_URL}/api/chat`, {
            model: OLLAMA_MODEL,
            messages: messages,
            stream: false
        }, {
            timeout: 30000 // 30 second timeout
        });

        return response.data.message.content;
    } catch (error) {
        console.error('Ollama API Error:', error.message);

        if (error.code === 'ECONNREFUSED') {
            throw new Error('Ollama service is not running. Please start the Ollama container.');
        }

        throw new Error(`Failed to get AI response: ${error.message}`);
    }
};

/**
 * Build system prompt with game database information
 * @param {Array} games - List of games from database
 * @returns {string} System prompt
 */
const buildSystemPrompt = (games) => {
    const gamesList = games.map(game => {
        return `- "${game.title}": ${game.description}. Price: $${game.precio || 0}. Categories: ${game.categorias?.join(', ') || 'N/A'}. Platforms: ${game.plataformas?.join(', ') || 'N/A'}.`;
    }).join('\n');

    return `You are a helpful video game assistant for a gaming platform. Your role is to help users find and recommend video games from our database.

AVAILABLE GAMES IN OUR DATABASE:
${gamesList}

IMPORTANT RULES:
1. ONLY recommend or discuss games from the above list
2. Be concise, friendly, and helpful
3. If asked about games NOT in our database, politely say: "I can only help with games available in our current catalog"
4. When recommending games, mention: title, price, platforms, and why it fits the user's request
5. Answer in the same language the user uses (Spanish or English)
6. You can help users filter by: category, platform, price range, or game type
7. Keep responses short and to the point (2-3 sentences maximum)

Examples of good responses:
- "I recommend 'Elden Ring' ($59.99, PS5/PC). It's an RPG with challenging combat in a dark fantasy world."
- "For games under $30, check out 'Hollow Knight' ($14.99) or 'Celeste' ($19.99)"
- "We have 3 strategy games: [list them briefly]"`;
};

/**
 * Extract game titles mentioned in AI response
 * @param {string} aiResponse - AI response text
 * @param {Array} games - List of all games
 * @returns {Array} Array of game objects mentioned in response
 */
const extractGameReferences = (aiResponse, games) => {
    const mentionedGames = [];

    games.forEach(game => {
        // Check if game title is mentioned in response (case insensitive)
        if (aiResponse.toLowerCase().includes(game.title.toLowerCase())) {
            mentionedGames.push(game);
        }
    });

    return mentionedGames;
};

module.exports = {
    sendPromptToOllama,
    buildSystemPrompt,
    extractGameReferences
};
