import { useEffect, useState } from "react";
import './listador.css';

function Listador() {
    const [videojuegos, setVideojuegos] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/videojuegos')
            .then(response => (response.json()))
            .then(data => setVideojuegos(data))
    }, []);

    return (
        <div className="listador-grid">
            {videojuegos && videojuegos.length > 0 ? (
                videojuegos.map((juego, index) => (
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