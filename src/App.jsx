import { useState } from 'react'
import Listador from './components/listador'
import MenuCategorias from './components/MenuCategorias'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-wrapper">
      <div className="menu-container">
        <MenuCategorias />
      </div>
      <div className="content-container">
        <Listador />
      </div>
    </div>
  )
}

export default App
