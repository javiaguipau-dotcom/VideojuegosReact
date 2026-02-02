import { useEffect, useState } from "react";
import './listador.css';

function Listador({ categoriasFiltradas }) {
    const [videojuegos, setVideojuegos] = useState([]);
    const [videojuegosFiltrados, setVideojuegosFiltrados] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/videojuegos')
            .then(response => (response.json()))
            .then(data => setVideojuegos(data))
    }, []);

    // Filtrar videojuegos según las categorías seleccionadas
    useEffect(() => {
        if (categoriasFiltradas.length === 0) {
            setVideojuegosFiltrados([]);
        } else {
            const filtrados = videojuegos.filter(juego => 
                juego.categorias?.some(cat => categoriasFiltradas.includes(cat))
            );
            setVideojuegosFiltrados(filtrados);
        }
    }, [videojuegos, categoriasFiltradas]);

    return (
        <div className="listador-grid">
            {videojuegosFiltrados && videojuegosFiltrados.length > 0 ? (
                videojuegosFiltrados.map((juego, index) => (
                    <div key={index} className="game-card">
                        <img 
                            className="portada" 
                            src={juego.urlimagen}
                            alt={juego.nombre}
                        />
                        <div className="game-info">
                            <h3 className="game-title">{juego.nombre}</h3>
                            
                            <div>
                                <span className="game-label">Plataforma</span>
                                <p>{juego.plataformas}</p>
                            </div>
                            
                            <div className="price-info">
                                <span className="price-label">Precio</span>
                                <span className="price-value">${juego.precio}</span>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="loading-container">
                    <p className="loading-text">Cargando videojuegos...</p>
                </div>
            )}
        </div>
    )
}

export default Listador;