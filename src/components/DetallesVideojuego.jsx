import './DetallesVideojuego.css';

function DetallesVideojuego({ videojuego, onCerrar }) {
    if (!videojuego) return null;

    return (
        <div className="detalles-overlay">
            <div className="detalles-modal">
                <button className="detalles-cerrar" onClick={onCerrar}>
                    ✕
                </button>
                
                <div className="detalles-contenido">
                    <div className="detalles-header">
                        <img 
                            className="detalles-imagen" 
                            src={videojuego.urlimagen}
                            alt={videojuego.nombre}
                        />
                        <div className="detalles-titulo-area">
                            <h1 className="detalles-titulo">{videojuego.nombre}</h1>
                            <p className="detalles-compania">{videojuego.compania}</p>
                        </div>
                    </div>

                    <div className="detalles-info">
                        <div className="detalles-campo">
                            <label className="detalles-label">Descripción</label>
                            <p className="detalles-valor">{videojuego.descripcion}</p>
                        </div>

                        <div className="detalles-campo">
                            <label className="detalles-label">Fecha de Lanzamiento</label>
                            <p className="detalles-valor">
                                {new Date(videojuego['fecha de lanzamiento']).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>

                        <div className="detalles-campo">
                            <label className="detalles-label">Categorías</label>
                            <div className="detalles-tags">
                                {videojuego.categorias?.map((cat, idx) => (
                                    <span key={idx} className="detalles-tag categoria-tag">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="detalles-campo">
                            <label className="detalles-label">Plataformas</label>
                            <div className="detalles-tags">
                                {videojuego.plataformas?.map((plat, idx) => (
                                    <span key={idx} className="detalles-tag plataforma-tag">
                                        {plat}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="detalles-campo">
                            <label className="detalles-label">Precio</label>
                            <p className="detalles-precio">${videojuego.precio}</p>
                        </div>

                        <div className="detalles-campo">
                            <label className="detalles-label">Video</label>
                            <a 
                                href={videojuego.urlvideo} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="detalles-link"
                            >
                                Ver video del juego
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetallesVideojuego;
