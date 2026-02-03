import './MenuPlataformas.css';

function MenuPlataformas({ plataformas, plataformasFiltradas, setPlataformasFiltradas }) {
    const handleCheckboxChange = (plataforma) => {
        if (plataformasFiltradas.includes(plataforma)) {
            // Si está seleccionada, desseleccionar
            setPlataformasFiltradas(plataformasFiltradas.filter(p => p !== plataforma));
        } else {
            // Si no está seleccionada, seleccionar
            setPlataformasFiltradas([...plataformasFiltradas, plataforma]);
        }
    };

    return ( 
        <div className="menu-wrapper-plataformas">
            <div className="menu-header-plataformas">
                <h2>Filtrar por Plataformas</h2>
            </div>
            <div className="plataformas-list">
                {plataformas.map((plataforma, index) => (
                    <label key={index} className="plataforma-checkbox">
                        <input
                            type="checkbox"
                            checked={plataformasFiltradas.includes(plataforma)}
                            onChange={() => handleCheckboxChange(plataforma)}
                        />
                        <span>{plataforma}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}

export default MenuPlataformas;
