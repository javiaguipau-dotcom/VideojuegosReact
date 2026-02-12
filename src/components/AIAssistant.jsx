import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/aiService';
import { useNavigate } from 'react-router-dom';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initial greeting message
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: '¡Hola! 👋 Soy tu asistente de videojuegos. ¿Te puedo ayudar a encontrar el juego perfecto para ti?',
                games: []
            }]);
        }
    }, []);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');

        // Add user message to chat
        const newMessages = [
            ...messages,
            { role: 'user', content: userMessage }
        ];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            // Prepare conversation history (exclude games property)
            const history = newMessages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // Send to AI
            const response = await sendMessage(userMessage, history);

            // Add AI response
            setMessages([
                ...newMessages,
                {
                    role: 'assistant',
                    content: response.reply,
                    games: response.games || []
                }
            ]);
        } catch (error) {
            console.error('AI Error:', error);
            setMessages([
                ...newMessages,
                {
                    role: 'assistant',
                    content: 'Lo siento, estoy teniendo problemas técnicos. Por favor intenta de nuevo más tarde.',
                    games: []
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleQuickAction = (message) => {
        setInputMessage(message);
    };

    const handleGameClick = (gameId) => {
        navigate(`/game/${gameId}`);
        setIsOpen(false);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    fontSize: '28px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {isOpen ? '✕' : '🤖'}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '20px',
                    width: '400px',
                    height: '600px',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 999,
                    overflow: 'hidden',
                    border: '2px solid var(--primary)'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '20px',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '18px'
                    }}>
                        🤖 Asistente de Videojuegos
                    </div>

                    {/* Quick Actions */}
                    <div style={{
                        padding: '10px',
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                        backgroundColor: '#1e293b',
                        borderBottom: '1px solid #334155'
                    }}>
                        {['Recomiéndame un RPG', 'Juegos baratos', 'Juegos populares'].map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleQuickAction(action)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '16px',
                                    backgroundColor: '#334155',
                                    color: 'white',
                                    border: 'none',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                }}
                            >
                                {action}
                            </button>
                        ))}
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        {messages.map((msg, idx) => (
                            <div key={idx}>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                        marginBottom: '8px'
                                    }}
                                >
                                    <div style={{
                                        maxWidth: '80%',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        backgroundColor: msg.role === 'user' ? 'var(--primary)' : '#334155',
                                        color: 'white'
                                    }}>
                                        {msg.content}
                                    </div>
                                </div>

                                {/* Game Cards */}
                                {msg.games && msg.games.length > 0 && (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px',
                                        marginLeft: '0'
                                    }}>
                                        {msg.games.map((game) => (
                                            <div
                                                key={game._id}
                                                onClick={() => handleGameClick(game._id)}
                                                style={{
                                                    display: 'flex',
                                                    gap: '12px',
                                                    padding: '12px',
                                                    backgroundColor: '#1e293b',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    border: '1px solid #334155'
                                                }}
                                            >
                                                <img
                                                    src={game.urlimagen || 'https://via.placeholder.com/60'}
                                                    alt={game.title}
                                                    style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        objectFit: 'cover',
                                                        borderRadius: '4px'
                                                    }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 'bold', color: 'var(--primary)', marginBottom: '4px' }}>
                                                        {game.title}
                                                    </div>
                                                    <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                                                        ${game.precio}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <div style={{
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    backgroundColor: '#334155',
                                    color: '#94a3b8'
                                }}>
                                    <span style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>●</span>
                                    <span style={{ animation: 'pulse 1.5s ease-in-out 0.2s infinite' }}>●</span>
                                    <span style={{ animation: 'pulse 1.5s ease-in-out 0.4s infinite' }}>●</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{
                        padding: '16px',
                        backgroundColor: '#1e293b',
                        borderTop: '1px solid #334155',
                        display: 'flex',
                        gap: '8px'
                    }}>
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Pregúntame sobre videojuegos..."
                            disabled={isLoading}
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '8px',
                                backgroundColor: '#0f172a',
                                color: 'white',
                                border: '1px solid #334155',
                                outline: 'none'
                            }}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isLoading || !inputMessage.trim()}
                            style={{
                                padding: '12px 20px',
                                borderRadius: '8px',
                                backgroundColor: inputMessage.trim() ? 'var(--primary)' : '#334155',
                                color: 'white',
                                border: 'none',
                                cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
                                fontWeight: 'bold'
                            }}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}

            {/* Pulse Animation */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 1; }
                }
            `}</style>
        </>
    );
};

export default AIAssistant;
