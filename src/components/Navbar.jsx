import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="navbar-links">
                <Link to="/">All Games</Link>
                <Link to="/mygames">My Games</Link>
                <Link to="/create">Create Game</Link>
                <button onClick={logout}>Logout</button>
            </div>
            <div className="navbar-user">
                <span>Welcome, {user.username}</span>
            </div>
        </nav>
    );
};

export default Navbar;
