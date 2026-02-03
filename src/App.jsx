import { useState, useEffect } from 'react'
import Listador from './components/listador'
import MenuCategorias from './components/MenuCategorias'
import MenuPlataformas from './components/MenuPlataformas'
import './App.css'

function App() {
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([])
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([])
  const [plataformasFiltradas, setPlataformasFiltradas] = useState([])
  const [plataformasDisponibles, setPlataformasDisponibles] = useState([])
  const [terminoBusqueda, setTerminoBusqueda] = useState('')

  // Cargar categorías y plataformas disponibles desde los datos
  useEffect(() => {
    fetch('http://localhost:3000/videojuegos')
      .then(response => response.json())
      .then(data => {
        // Extraer categorías únicas
        const categoriasSet = new Set()
        const plataformasSet = new Set()
        data.forEach(juego => {
          juego.categorias?.forEach(cat => categoriasSet.add(cat))
          juego.plataformas?.forEach(plat => plataformasSet.add(plat))
        })
        const categorias = Array.from(categoriasSet).sort()
        const plataformas = Array.from(plataformasSet).sort()
        
        setCategoriasDisponibles(categorias)
        setPlataformasDisponibles(plataformas)
        // Inicialmente todas seleccionadas
        setCategoriasFiltradas(categorias)
        setPlataformasFiltradas(plataformas)
      })
  }, [])

  return (
    <div className="app-wrapper">
      <div className="menu-container">
        <MenuCategorias 
          categorias={categoriasDisponibles}
          categoriasFiltradas={categoriasFiltradas}
          setCategoriasFiltradas={setCategoriasFiltradas}
        />
        <MenuPlataformas 
          plataformas={plataformasDisponibles}
          plataformasFiltradas={plataformasFiltradas}
          setPlataformasFiltradas={setPlataformasFiltradas}
        />
      </div>
      <div className="content-container">
        <Listador 
                    terminoBusqueda={terminoBusqueda}
                    setTerminoBusqueda={setTerminoBusqueda}
          categoriasFiltradas={categoriasFiltradas}
          plataformasFiltradas={plataformasFiltradas}
        />
      </div>
    </div>
  )
}

export default App
