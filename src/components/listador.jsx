import { useEffect, useState } from "react";
import './listador.css';
import DetallesVideojuego from './DetallesVideojuego';

function Listador({ categoriasFiltradas, plataformasFiltradas, terminoBusqueda, setTerminoBusqueda }) {
    const [videojuegos, setVideojuegos] = useState([]);
    const [videojuegosFiltrados, setVideojuegosFiltrados] = useState([]);
    const [videojuegoSeleccionado, setVideojuegoSeleccionado] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/videojuegos')
            .then(response => (response.json()))
            .then(data => setVideojuegos(data))
    }, []);

    // Filtrar videojuegos según las categorías y plataformas seleccionadas
    useEffect(() => {
        if (categoriasFiltradas.length === 0 || plataformasFiltradas.length === 0) {
            setVideojuegosFiltrados([]);
        } else {
            const filtrados = videojuegos.filter(juego => {
                const tieneCategoria = juego.categorias?.some(cat => categoriasFiltradas.includes(cat));
                const tienePlataforma = juego.plataformas?.some(plat => plataformasFiltradas.includes(plat));
                
                // Buscar en nombre o descripción
                const coincideBusqueda = terminoBusqueda === '' || 
                    juego.nombre?.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                    juego.descripcion?.toLowerCase().includes(terminoBusqueda.toLowerCase());
                
                return tieneCategoria && tienePlataforma && coincideBusqueda;
            });
            setVideojuegosFiltrados(filtrados);
        }
    }, [videojuegos, categoriasFiltradas, plataformasFiltradas, terminoBusqueda]);

    return (
        <div className="listador-container">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar por nombre o descripción..."
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                    className="search-input-box"
                />
            </div>
        <div className="listador-grid">
            {videojuegosFiltrados && videojuegosFiltrados.length > 0 ? (
                videojuegosFiltrados.map((juego, index) => (
                    <div 
                        key={index} 
                        className="game-card"
                        onClick={() => setVideojuegoSeleccionado(juego)}
                    >
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
            {videojuegoSeleccionado && (
                <DetallesVideojuego 
                    videojuego={videojuegoSeleccionado}
                    onCerrar={() => setVideojuegoSeleccionado(null)}
                />
            )}
        </div>
    )
}

export default Listador;