import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import '../components/DetallesVideojuego.css';

const GameDetail = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const { data } = await api.get(`/games/${id}`);
                setGame(data);
            } catch (error) {
                console.error("Error fetching game details:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchComments = async () => {
            try {
                const { data } = await api.get(`/games/${id}/comments`);
                setComments(data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        fetchGame();
        fetchComments();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete "${game.title}"?`)) {
            return;
        }

        try {
            await api.delete(`/games/${id}`);
            navigate('/');
        } catch (error) {
            alert('Error deleting game');
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();

        if (!commentText.trim()) {
            alert('Please enter a comment');
            return;
        }

        try {
            const { data } = await api.post(`/games/${id}/comments`, { text: commentText });
            setComments([...comments, data]);
            setCommentText('');
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Error adding comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        try {
            await api.delete(`/games/comments/${commentId}`);
            setComments(comments.filter(c => c._id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert(error.response?.data?.message || 'Error deleting comment');
        }
    };

    const canDeleteComment = (comment) => {
        if (!user) return false;
        if (user.role === 'admin') return true;

        // Check if user owns the comment
        if (comment.user._id !== user._id) return false;

        // Check if comment has replies
        const hasReplies = comments.some(c => c.parentComment === comment._id);
        return !hasReplies;
    };

    if (loading) return <div>Loading...</div>;
    if (!game) return <div>Game not found</div>;

    return (
        <div className="detalles-modal" style={{ position: 'static', transform: 'none', margin: '20px auto', maxWidth: '800px' }}>
            {/* Reusing CSS classes from DetallesVideojuego, but adjusting inline for page layout */}
            <div className="detalles-contenido">
                <div className="detalles-header">
                    <img
                        className="detalles-imagen"
                        src={game.urlimagen || 'https://via.placeholder.com/150'}
                        alt={game.title}
                    />
                    <div className="detalles-titulo-area">
                        <h1 className="detalles-titulo">{game.title}</h1>
                        <p className="detalles-compania">Added by: {game.owner?.username}</p>
                    </div>
                </div>

                <div className="detalles-info">
                    <div className="detalles-campo">
                        <label className="detalles-label">Description</label>
                        <p className="detalles-valor">{game.description}</p>
                    </div>

                    <div className="detalles-campo">
                        <label className="detalles-label">Categories</label>
                        <div className="detalles-tags">
                            {game.categorias?.map((cat, idx) => (
                                <span key={idx} className="detalles-tag categoria-tag">
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="detalles-campo">
                        <label className="detalles-label">Platforms</label>
                        <div className="detalles-tags">
                            {game.plataformas?.map((plat, idx) => (
                                <span key={idx} className="detalles-tag plataforma-tag">
                                    {plat}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="detalles-campo">
                        <label className="detalles-label">Price</label>
                        <p className="detalles-precio">${game.precio}</p>
                    </div>

                    <div className="detalles-acciones">
                        {/* Delete button logic: Admin or Owner */}
                        {user && (user.role === 'admin' || user._id === game.owner?._id) && (
                            <button
                                className="detalles-boton-eliminar"
                                onClick={handleDelete}
                            >
                                Delete Game
                            </button>
                        )}
                        <button onClick={() => navigate(-1)} style={{ marginLeft: '10px', padding: '10px' }}>Back</button>
                    </div>
                </div>

                {/* Comments Section */}
                <div style={{ marginTop: '30px', borderTop: '2px solid #334155', paddingTop: '20px' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>Comments ({comments.length})</h2>

                    {/* Add Comment Form */}
                    {user && (
                        <form onSubmit={handleAddComment} style={{ marginBottom: '30px' }}>
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    backgroundColor: 'var(--bg-card)',
                                    color: 'white',
                                    border: '1px solid #334155',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    marginTop: '10px',
                                    padding: '10px 20px',
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Post Comment
                            </button>
                        </form>
                    )}

                    {/* Comments List */}
                    <div>
                        {comments.length === 0 ? (
                            <p style={{ color: '#94a3b8' }}>No comments yet. Be the first to comment!</p>
                        ) : (
                            comments.map((comment) => (
                                <div
                                    key={comment._id}
                                    style={{
                                        backgroundColor: 'var(--bg-card)',
                                        padding: '15px',
                                        borderRadius: '8px',
                                        marginBottom: '15px',
                                        border: '1px solid #334155'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                        <div>
                                            <strong style={{ color: 'var(--primary)' }}>{comment.user.username}</strong>
                                            <span style={{ color: '#64748b', marginLeft: '10px', fontSize: '14px' }}>
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        {canDeleteComment(comment) && (
                                            <button
                                                onClick={() => handleDeleteComment(comment._id)}
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    color: '#ef4444',
                                                    border: '1px solid #ef4444',
                                                    padding: '5px 10px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                    <p style={{ margin: 0, lineHeight: '1.6' }}>{comment.text}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameDetail;
