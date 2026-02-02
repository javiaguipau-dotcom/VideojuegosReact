import { useState, useEffect } from 'react'
import Listador from './components/listador'
import MenuCategorias from './components/MenuCategorias'
import './App.css'

function App() {
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([])
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([])

  // Cargar categorías disponibles desde los datos
  useEffect(() => {
    fetch('http://localhost:3000/videojuegos')
      .then(response => response.json())
      .then(data => {
        // Extraer categorías únicas
        const categoriasSet = new Set()
        data.forEach(juego => {
          juego.categorias?.forEach(cat => categoriasSet.add(cat))
        })
        const categorias = Array.from(categoriasSet).sort()
        setCategoriasDisponibles(categorias)
        // Inicialmente todas seleccionadas
        setCategoriasFiltradas(categorias)
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
      </div>
      <div className="content-container">
        <Listador categoriasFiltradas={categoriasFiltradas} />
      </div>
    </div>
  )
}

export default App
