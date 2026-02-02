import './MenuCategorias.css';

function MenuCategorias({ categorias, categoriasFiltradas, setCategoriasFiltradas }) {
    const handleCheckboxChange = (categoria) => {
        if (categoriasFiltradas.includes(categoria)) {
            // Si está seleccionada, desseleccionar
            setCategoriasFiltradas(categoriasFiltradas.filter(cat => cat !== categoria));
        } else {
            // Si no está seleccionada, seleccionar
            setCategoriasFiltradas([...categoriasFiltradas, categoria]);
        }
    };

    return ( 
        <div className="menu-wrapper">
            <div className="menu-header">
                <h2>Filtrar por Categorías</h2>
            </div>
            <div className="categorias-list">
                {categorias.map((categoria, index) => (
                    <label key={index} className="categoria-checkbox">
                        <input
                            type="checkbox"
                            checked={categoriasFiltradas.includes(categoria)}
                            onChange={() => handleCheckboxChange(categoria)}
                        />
                        <span>{categoria}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}

export default MenuCategorias;