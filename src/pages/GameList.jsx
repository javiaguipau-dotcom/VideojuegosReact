import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../components/listador.css'; // Reusing existing styles

const GameList = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState({
        totalGames: 0,
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
    });
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/games?page=${page}&limit=${limit}`);
                setGames(data.games);
                setPagination(data.pagination);
            } catch (error) {
                console.error("Error fetching games:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [page, limit]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this game?')) return;
        try {
            await api.delete(`/games/${id}`);
            // Refetch current page after deletion
            const { data } = await api.get(`/games?page=${page}&limit=${limit}`);
            setGames(data.games);
            setPagination(data.pagination);
        } catch (error) {
            alert('Error deleting game');
        }
    };

    const handleLimitChange = (e) => {
        setLimit(parseInt(e.target.value));
        setPage(1); // Reset to first page when changing limit
    };

    const handlePrevPage = () => {
        if (pagination.hasPrevPage) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (pagination.hasNextPage) {
            setPage(page + 1);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="listador-container">
            <h1>All Games</h1>

            {/* Pagination Controls - Top */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <label htmlFor="limit-select" style={{ marginRight: '10px' }}>Games per page:</label>
                    <select
                        id="limit-select"
                        value={limit}
                        onChange={handleLimitChange}
                        style={{ padding: '5px 10px', borderRadius: '4px', backgroundColor: 'var(--bg-card)', color: 'white', border: '1px solid #334155' }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                <div>
                    Showing {games.length > 0 ? ((page - 1) * limit + 1) : 0} - {Math.min(page * limit, pagination.totalGames)} of {pagination.totalGames} games
                </div>
            </div>

            <div className="listador-grid">
                {games.length === 0 ? (
                    <p>No games found.</p>
                ) : (
                    games.map((game) => (
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
                    ))
                )}
            </div>

            {/* Pagination Controls - Bottom */}
            {pagination.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '30px' }}>
                    <button
                        onClick={handlePrevPage}
                        disabled={!pagination.hasPrevPage}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: pagination.hasPrevPage ? 'var(--primary)' : '#475569',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: pagination.hasPrevPage ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Previous
                    </button>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={!pagination.hasNextPage}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: pagination.hasNextPage ? 'var(--primary)' : '#475569',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default GameList;
