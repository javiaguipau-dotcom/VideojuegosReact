import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../components/listador.css';

const MyGames = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchMyGames = async () => {
            // If user is null (shouldn't happen in protected route), don't fetch
            if (!user) return;

            try {
                const { data } = await api.get('/games/mygames');
                setGames(data);
            } catch (error) {
                console.error("Error fetching my games:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyGames();
    }, [user]);

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
            <h1>My Games</h1>
            {games.length === 0 ? <p>You haven't added any games yet.</p> : (
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
                                    <div className="price-info">
                                        <span className="price-label">Price</span>
                                        <span className="price-value">${game.precio}</span>
                                    </div>
                                </div>
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(game._id);
                                }}
                                style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', marginTop: '10px', cursor: 'pointer', borderRadius: '4px' }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyGames;
