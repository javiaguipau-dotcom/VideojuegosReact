# 🎮 Tienda de Videojuegos

Una aplicación web moderna para explorar y gestionar un catálogo de videojuegos. Construida con React, Vite y un diseño responsivo.

## 🚀 Características

- ✅ **Catálogo dinámico** de videojuegos
- 📱 **Diseño completamente responsivo** (desktop, tablet, móvil)
- 🎨 **Interfaz moderna** con animaciones suaves
- 🔍 **Categorías filtradas** en sidebar
- 💳 **Información detallada** de cada juego (nombre, plataforma, precio, imagen)
- ⚡ **Rendimiento optimizado** con Vite
- 🎯 **Estructura limpia** y mantenible

## 📋 Requisitos previos

- Node.js (versión 14 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd proyecto
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🔧 Desarrollo

### Estructura del proyecto
```
src/
├── components/
│   ├── listador.jsx          # Grid de videojuegos
│   ├── listador.css          # Estilos de tarjetas
│   ├── MenuCategorias.jsx    # Sidebar de categorías
│   └── MenuCategorias.css    # Estilos del menú
├── backend/
│   └── data.json             # Datos de videojuegos
├── App.jsx                   # Componente principal
├── App.css                   # Estilos del layout
├── index.css                 # Estilos globales
└── main.jsx                  # Punto de entrada
```

### Scripts disponibles

```bash
# Desarrollo con HMR
npm run dev

# Compilar para producción
npm run build

# Vista previa del build
npm run preview

# Lint del código
npm run lint
```

## 📡 API

La aplicación consume una API backend en `http://localhost:3000/videojuegos`

### Estructura de datos esperada:
```json
{
  "nombre": "nombre del juego",
  "plataformas": "PlayStation, Xbox, PC",
  "precio": "59.99",
  "urlimagen": "https://url-imagen.jpg"
}
```

## 🎨 Diseño y Estilos

### Colores principales
- **Púrpura**: `#667eea` - Elementos principales
- **Púrpura oscuro**: `#764ba2` - Acentos
- **Verde**: `#2ecc71` - Precio
- **Blanco**: `#ffffff` - Fondos

### Tipografía
- **Font**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Pesos**: 600 (normal), 700 (bold)

## 📦 Dependencias principales

- **React** 18.x - Librería UI
- **Vite** 5.x - Build tool
- **CSS3** - Estilos avanzados

## 🌐 Navegadores soportados

- Chrome (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Edge (últimas 2 versiones)

## 📱 Responsive Design

- **Desktop**: 1400px+
- **Tablet**: 768px - 1024px
- **Mobile**: Hasta 480px

## 🚀 Deployment

### Vite proporciona comandos listos para producción:

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`.

## 🐛 Reporte de problemas

Si encuentras algún bug, por favor abre un issue con:
- Descripción del problema
- Pasos para reproducir
- Navegador y versión utilizada

## 📝 Licencia

Este proyecto está bajo licencia MIT.

## 👤 Autor

Desarrollado como proyecto de aprendizaje.

---

**Última actualización**: 30 de enero de 2026
