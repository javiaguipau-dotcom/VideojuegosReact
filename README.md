# Tienda de Videojuegos - VideojuegosReact

Una aplicación web moderna y responsiva para explorar un catálogo completo de videojuegos. Construida con **React 19** y **Vite**, ofreciendo una experiencia de usuario fluida con carga rápida y rendimiento optimizado.

## Características

- **Catálogo dinámico** de videojuegos con información detallada
- **Diseño completamente responsivo** (desktop, tablet, móvil)
- **Interfaz moderna** con animaciones suaves y colores atractivos
- **Filtrado por categorías** con menú lateral intuitivo
- **Filtrado por plataformas** (PlayStation, Xbox, PC, etc.)
- **Información detallada** de cada juego (nombre, plataforma, precio, imagen)
- **Rendimiento optimizado** con Vite (Hot Module Replacement)
- **Estructura limpia** y fácil de mantener
- **Código actualizado** con ESLint configurado

## Requisitos previos

- **Node.js** versión 16 o superior
- **npm** versión 8 o superior (incluido con Node.js)

## Instalación rápida

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd VideojuegosReact
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` con recarga en caliente (HMR) habilitada.

## Desarrollo

### Estructura del proyecto
```
VideojuegosReact/
├── src/
│   ├── components/
│   │   ├── listador.jsx           # Grid de videojuegos con tarjetas
│   │   ├── listador.css           # Estilos de tarjetas responsivos
│   │   ├── MenuCategorias.jsx     # Sidebar de categorías dinámicas
│   │   ├── MenuCategorias.css     # Estilos del menú de categorías
│   │   ├── MenuPlataformas.jsx    # Filtro de plataformas
│   │   └── MenuPlataformas.css    # Estilos del menú de plataformas
│   ├── backend/
│   │   └── data.json              # Base de datos de videojuegos
│   ├── assets/                    # Recursos estáticos
│   ├── App.jsx                    # Componente principal (wrapper)
│   ├── App.css                    # Estilos del layout principal
│   ├── index.css                  # Estilos globales
│   └── main.jsx                   # Punto de entrada React
├── public/                        # Archivos estáticos
├── eslint.config.js               # Configuración de linting
├── vite.config.js                 # Configuración de Vite
├── index.html                     # HTML principal
├── package.json                   # Dependencias del proyecto
└── README.md                       # Este archivo
```

### Scripts disponibles

```bash
# Desarrollo con HMR (Hot Module Replacement)
npm run dev

# Compilar para producción (optimizado)
npm run build

# Vista previa del build de producción
npm run preview

# Validar código con ESLint
npm run lint
```

## API / Datos

La aplicación consume datos de una API backend en `http://localhost:3000/videojuegos`

### Estructura de datos esperada:
```json
{
  "id": 1,
  "nombre": "Cyberpunk 2077",
  "plataformas": "PlayStation 5, Xbox Series X, PC",
  "precio": "59.99",
  "urlimagen": "https://example.com/imagen-juego.jpg"
}
```

## Diseño y Estilos

### Paleta de colores principal
- **Púrpura**: `#667eea` - Elementos principales y botones
- **Púrpura oscuro**: `#764ba2` - Acentos y hover states
- **Verde**: `#2ecc71` - Precios y elementos positivos
- **Blanco**: `#ffffff` - Fondos principales
- **Gris oscuro**: `#2c2c2c` - Texto y fondos secundarios

### Tipografía
- **Font principal**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Pesos**: 600 (normal), 700 (bold), 400 (regular)
- **Tamaño base**: 16px (responsive en móvil)

### Breakpoints responsivos
- **Móvil**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Dependencias principales

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.1.1",
    "vite": "^7.2.4",
    "eslint": "^9.39.1"
  }
}
```

## Despliegue

### Compilar para producción
```bash
npm run build
```

Esto genera una carpeta `dist/` lista para desplegar en:
- **Vercel**
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**
- Cualquier servidor HTTP estático

## Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo LICENSE para más detalles.

## Autor

Desarrollado como una tienda de videojuegos moderna con React y Vite.

---

**Última actualización**: Febrero 2026

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
