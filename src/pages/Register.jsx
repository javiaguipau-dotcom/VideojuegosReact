import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'user', // Default role
    });

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const { username, password } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, password, formData.role);
            navigate('/');
        } catch (error) {
            const message = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : 'Registration failed. Username might be taken.';
            alert(message);
        }
    };

    return (
        <div className="auth-form-container">
            <h1>Register</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        value={username}
                        placeholder="Enter username"
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={password}
                        placeholder="Enter password"
                        onChange={onChange}
                        required
                    />
                </div>
                {/* Optional: Role selection if needed, keeping simple for now */}
                <button type="submit" className="btn btn-block">
                    Submit
                </button>
            </form>
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default Register;
