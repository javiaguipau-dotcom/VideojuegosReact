import { useState } from "react";
import './MenuCategorias.css';

function MenuCategorias() {
    const [categorias, setCategorias] = useState([
        'Acción',
        'Aventura',
        'RPG',
        'Deportes',
        'Estrategia',
        'Puzzle'
    ]);
    const [activeCategory, setActiveCategory] = useState('Acción');

    return ( 
        <div className="menu-wrapper">
            <div className="menu-header">
                <h2>Categorías</h2>
            </div>
            <div className="categorias-list">
                {categorias.map((categoria, index) => (
                    <button 
                        key={index}
                        className={`categoria-btn ${activeCategory === categoria ? 'active' : ''}`}
                        onClick={() => setActiveCategory(categoria)}
                    >
                        {categoria}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default MenuCategorias;