import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateGame = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        urlimagen: '',
        precio: '',
        categorias: '',
        plataformas: '',
    });

    const navigate = useNavigate();

    const { title, description, urlimagen, precio, categorias, plataformas } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // Process categories and platforms into arrays
        const gameData = {
            ...formData,
            categorias: categorias.split(',').map(cat => cat.trim()),
            plataformas: plataformas.split(',').map(plat => plat.trim()),
            precio: Number(precio)
        };

        try {
            await api.post('/games', gameData);
            navigate('/mygames');
        } catch (error) {
            alert('Error creating game');
            console.error(error);
        }
    };

    return (
        <div className="auth-form-container">
            <h1>Create New Game</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={title}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={description}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="urlimagen">Image URL</label>
                    <input
                        type="text"
                        className="form-control"
                        id="urlimagen"
                        name="urlimagen"
                        value={urlimagen}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="precio">Price</label>
                    <input
                        type="number"
                        className="form-control"
                        id="precio"
                        name="precio"
                        value={precio}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="categorias">Categories (comma separated)</label>
                    <input
                        type="text"
                        className="form-control"
                        id="categorias"
                        name="categorias"
                        value={categorias}
                        onChange={onChange}
                        placeholder="Action, RPG, Adventure"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="plataformas">Platforms (comma separated)</label>
                    <input
                        type="text"
                        className="form-control"
                        id="plataformas"
                        name="plataformas"
                        value={plataformas}
                        onChange={onChange}
                        placeholder="PC, PS5, Xbox"
                    />
                </div>
                <button type="submit" className="btn btn-block">
                    Create Game
                </button>
            </form>
        </div>
    );
};

export default CreateGame;
