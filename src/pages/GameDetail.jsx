import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import '../components/DetallesVideojuego.css';

const GameDetail = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
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

        fetchGame();
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
            </div>
        </div>
    );
};

export default GameDetail;
