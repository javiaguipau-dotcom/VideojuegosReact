import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const ReportedGames = () => {
    const [reportedGames, setReportedGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        // Redirect if not admin
        if (user && user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchReportedGames = async () => {
            try {
                const { data } = await api.get('/games/reported');
                setReportedGames(data);
            } catch (error) {
                console.error('Error fetching reported games:', error);
                if (error.response?.status === 401) {
                    navigate('/');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchReportedGames();
    }, [user, navigate]);

    const handleDeleteGame = async (gameId) => {
        if (!window.confirm('Are you sure you want to delete this reported game?')) {
            return;
        }

        try {
            await api.delete(`/games/${gameId}`);
            setReportedGames(reportedGames.filter(game => game._id !== gameId));
        } catch (error) {
            console.error('Error deleting game:', error);
            alert('Error deleting game');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
            <h1 style={{ marginBottom: '30px' }}>Reported Games ({reportedGames.length})</h1>

            {reportedGames.length === 0 ? (
                <p style={{ color: '#94a3b8' }}>No reported games.</p>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {reportedGames.map((game) => (
                        <div
                            key={game._id}
                            style={{
                                backgroundColor: 'var(--bg-card)',
                                border: '1px solid #ef4444',
                                borderRadius: '8px',
                                padding: '20px',
                                display: 'grid',
                                gridTemplateColumns: '150px 1fr auto',
                                gap: '20px',
                                alignItems: 'start'
                            }}
                        >
                            {/* Game Image */}
                            <img
                                src={game.urlimagen || 'https://via.placeholder.com/150'}
                                alt={game.title}
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '8px'
                                }}
                            />

                            {/* Game Info & Reports */}
                            <div>
                                <h2 style={{ marginTop: 0, marginBottom: '10px', fontSize: '22px' }}>
                                    {game.title}
                                </h2>
                                <p style={{ color: '#94a3b8', marginBottom: '15px' }}>
                                    By: {game.owner?.username || 'Unknown'} | Price: ${game.precio}
                                </p>

                                <div style={{ marginTop: '15px' }}>
                                    <strong style={{ color: '#ef4444' }}>
                                        Reports ({game.reports?.length || 0}):
                                    </strong>
                                    <div style={{ marginTop: '10px' }}>
                                        {game.reports?.map((report, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    backgroundColor: '#1e293b',
                                                    padding: '10px',
                                                    borderRadius: '4px',
                                                    marginBottom: '8px'
                                                }}
                                            >
                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '5px' }}>
                                                    <strong style={{ color: '#06b6d4' }}>
                                                        {report.user?.username || 'Unknown'}
                                                    </strong>
                                                    <span style={{ color: '#64748b', fontSize: '12px' }}>
                                                        {new Date(report.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p style={{ margin: 0, color: '#e5e7eb' }}>{report.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Delete Button */}
                            <button
                                onClick={() => handleDeleteGame(game._id)}
                                style={{
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    height: 'fit-content'
                                }}
                            >
                                Delete Game
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReportedGames;
