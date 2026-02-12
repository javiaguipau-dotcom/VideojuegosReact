import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../components/listador.css'; // Reusing existing styles

const GameList = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const { data } = await api.get('/games');
                setGames(data);
            } catch (error) {
                console.error("Error fetching games:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this game?')) return;
        try {
            await api.delete(`/games/${id}`);
            setGames(games.filter((game) => game._id !== id));
        } catch (error) {
            alert('Error deleting game');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="listador-container">
            <h1>All Games</h1>
            <div className="listador-grid">
                {games.map((game) => (
                    <div key={game._id} className="game-card">
                        <Link to={`/game/${game._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <img
                                className="portada"
                                src={game.urlimagen || 'https://via.placeholder.com/150'}
                                alt={game.title}
                            />
                            <div className="game-info">
                                <h3 className="game-title">{game.title}</h3>
                                <p className="game-label">Added by: {game.owner?.username || 'Unknown'}</p>
                                <div className="price-info">
                                    <span className="price-label">Price</span>
                                    <span className="price-value">${game.precio}</span>
                                </div>
                            </div>
                        </Link>
                        {/* Delete button logic: Admin or Owner */}
                        {user && (user.role === 'admin' || user._id === game.owner?._id) && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent link navigation
                                    handleDelete(game._id);
                                }}
                                style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', marginTop: '10px', cursor: 'pointer', borderRadius: '4px' }}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameList;
