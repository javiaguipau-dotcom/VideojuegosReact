# Asistente de IA con Ollama - Guía de Implementación

## 🎯 Descripción

Sistema de asistente de IA integrado en la aplicación de videojuegos que utiliza Ollama con el modelo `qwen2.5:0.5b` para ayudar a los usuarios a buscar y recomendar juegos de la base de datos.

---

## 🏗️ Arquitectura

```
┌─────────────────┐
│   Frontend      │  Puerto 5173
│   React + Vite  │  - Botón flotante 🤖
└────────┬────────┘  - Panel de chat
         │           - Game cards
         │ HTTP
         ▼
┌─────────────────┐
│   Backend       │  Puerto 5001
│   Express       │  - /api/ai/chat
└─────┬────┬──────┘  - Sistema prompts
      │    │
      │    └─────────────┐
      ▼                  ▼
┌──────────┐    ┌────────────────┐
│ MongoDB  │    │    Ollama      │  Puerto 11434
│ (Juegos) │    │ qwen2.5:0.5b   │  - LLM local
└──────────┘    └────────────────┘
```

---

## 📦 Archivos Creados

### Backend (5 archivos)

1. **`backend/src/services/ollamaService.js`**
   - `sendPromptToOllama()` - Comunica con Ollama API
   - `buildSystemPrompt()` - Crea prompt con juegos de BD
   - `extractGameReferences()` - Extrae juegos mencionados

2. **`backend/src/controllers/aiController.js`**
   - `chatWithAI()` - Endpoint principal de chat

3. **`backend/src/routes/aiRoutes.js`**
   - `POST /api/ai/chat` - Ruta protegida

4. **`backend/.env`**
   ```
   OLLAMA_URL=http://localhost:11434
   OLLAMA_MODEL=qwen2.5:0.5b
   ```

5. **`backend/src/server.js`** (modificado)
   - Registra rutas AI

### Frontend (3 archivos)

1. **`src/components/AIAssistant.jsx`**
   - Componente completo del chat
   - 400+ líneas con toda la funcionalidad

2. **`src/services/aiService.js`**
   - Cliente API para chat

3. **`src/App.jsx`** (modificado)
   - Integra `<AIAssistant />` globalmente

### Docker (3 archivos)

1. **`Dockerfile`**
   - Frontend dockerizado

2. **`.dockerignore`**
   - Optimización de build

3. **`docker-compose.yml`** (modificado)
   - Servicio frontend
   - Servicio Ollama
   - Volúmenes persistentes

---

## 🚀 Inicio Rápido

### 1. Prerequisitos

- Docker Desktop instalado y corriendo
- Node.js 18+ (para desarrollo local)

### 2. Iniciar Ollama y Descargar Modelo

```bash
# Iniciar solo Ollama
docker compose up -d ollama

# Acceder al contenedor
docker exec -it ollama bash

# Descargar modelo (dentro del contenedor)
ollama pull qwen2.5:0.5b

# Probar modelo
ollama run qwen2.5:0.5b
>>> Hola, recomiéndame un juego de RPG
>>> /bye

# Salir del contenedor
exit
```

### 3. Iniciar Todos los Servicios

```bash
# Opción 1: Todos los servicios en Docker
docker compose up

# Opción 2: Solo Ollama en Docker, resto local
docker compose up -d ollama mongo
cd backend && npm run dev
cd .. && npm run dev
```

### 4. Probar el Asistente

1. Navega a http://localhost:5173
2. Inicia sesión con tu usuario
3. Haz clic en el botón 🤖 (esquina inferior derecha)
4. Prueba con:
   - "Recomiéndame un RPG"
   - "¿Qué juegos tienes bajo $30?"
   - "Muéstrame juegos de estrategia"

---

## 💡 Características

### 🤖 Asistente Inteligente

- **Conocimiento específico**: Solo responde sobre juegos en la BD
- **Contexto**: Mantiene últimas 4 conversaciones
- **Limitado**: Rechaza educadamente preguntas fuera de scope

### 🎨 UI/UX

- **Botón flotante**: Siempre visible, esquina inferior derecha
- **Chat modal**: 400x600px, tema oscuro
- **Chips rápidos**: 3 acciones predefinidas
- **Game cards**: Clickeables, navegan a detalle
- **Animaciones**: Loading dots con pulse effect
- **Auto-scroll**: Siempre al último mensaje

### 🔒 Seguridad

- **Endpoint protegido**: Requiere autenticación JWT
- **Validación**: Input sanitizado
- **Timeouts**: 30s máximo por request
- **Error handling**: Mensajes user-friendly

---

## 🎮 Ejemplos de Uso

### Búsqueda por Categoría
```
Usuario: "Recomiéndame un juego de RPG"
AI: "Te recomiendo 'Elden Ring' ($59.99, PS5/PC). Es un RPG 
     con combate desafiante en un mundo de fantasía oscura."
[Muestra: Card de Elden Ring]
```

### Filtro por Precio
```
Usuario: "Juegos baratos"
AI: "Tenemos: 'Hollow Knight' ($14.99), 'Stardew Valley' 
     ($14.99), y 'Celeste' ($19.99)."
[Muestra: 3 cards de juegos]
```

### Fuera de Scope
```
Usuario: "¿Qué tiempo hará mañana?"
AI: "Solo puedo ayudarte con los juegos disponibles en 
     nuestro catálogo actual."
```

---

## 🛠️ Configuración

### Variables de Entorno

**Backend (.env)**:
```bash
PORT=5001
MONGODB_URI=mongodb://localhost:27017/videojuegosdb
JWT_SECRET=supersecretkey_change_this_in_production
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:0.5b
```

**Frontend**:
```bash
VITE_API_URL=http://localhost:5001
```

### Cambiar Modelo

Si quieres usar otro modelo de Ollama:

1. Edita `backend/.env`:
   ```
   OLLAMA_MODEL=llama2:7b
   ```

2. Edita `docker-compose.yml`:
   ```yaml
   OLLAMA_MODEL=llama2:7b
   ```

3. Descarga el modelo:
   ```bash
   docker exec -it ollama ollama pull llama2:7b
   ```

4. Reinicia backend:
   ```bash
   docker compose restart backend
   ```

---

## 🐛 Solución de Problemas

### Error: "Ollama service is not running"

**Causa**: Contenedor Ollama no está corriendo

**Solución**:
```bash
docker ps  # Verificar contenedores
docker compose up -d ollama  # Iniciar Ollama
docker compose logs ollama   # Ver logs
```

### Error: "Cannot find module 'axios'"

**Causa**: Dependencia no instalada

**Solución**:
```bash
cd backend
npm install
```

### El chat no aparece

**Causa**: No estás autenticado

**Solución**: Inicia sesión primero (el endpoint es protegido)

### Respuestas lentas

**Causa**: Modelo demasiado grande o CPU lento

**Solución**: Usa un modelo más pequeño como `qwen2.5:0.5b`

---

## 📊 Sistema Prompt

El asistente usa un prompt dinámico que incluye:

```
You are a helpful video game assistant...

AVAILABLE GAMES:
- "Elden Ring": Action RPG... Price: $59.99. 
  Categories: Rol, Lucha. Platforms: PS5, PC.
- "Cyberpunk 2077": Futuristic RPG... Price: $59.99.
  ...

RULES:
1. ONLY recommend games from the list above
2. Be concise, friendly, helpful
3. If asked about unavailable games, politely decline
4. Mention: title, price, platforms when recommending
5. Answer in user's language (Spanish/English)
6. Keep responses short (2-3 sentences max)
```

---

## 🔄 Flujo de Datos

```
1. Usuario escribe mensaje en AIAssistant.jsx
   ↓
2. Frontend llama aiService.sendMessage()
   ↓
3. Backend (aiController.chatWithAI):
   - Valida input
   - Obtiene todos los juegos de MongoDB
   - Construye system prompt con juegos
   - Envía a Ollama con historial
   ↓
4. Ollama procesa y responde
   ↓
5. Backend extrae juegos mencionados
   ↓
6. Frontend recibe { reply, games }
   ↓
7. Muestra mensaje + game cards
```

---

## 📝 API Endpoint

### POST /api/ai/chat

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request**:
```json
{
  "message": "Recomiéndame un juego de RPG",
  "conversationHistory": [
    { "role": "user", "content": "Hola" },
    { "role": "assistant", "content": "¡Hola! ¿Cómo puedo ayudarte?" }
  ]
}
```

**Response**:
```json
{
  "reply": "Te recomiendo 'Elden Ring' ($59.99, PS5/PC)...",
  "games": [
    {
      "_id": "...",
      "title": "Elden Ring",
      "precio": 59.99,
      "urlimagen": "...",
      "categorias": ["Rol", "Lucha"],
      "plataformas": ["PS5", "PC"]
    }
  ]
}
```

---

## 🎯 Pruebas con curl

```bash
# Obtener token (login primero)
TOKEN="tu_jwt_token_aqui"

# Enviar mensaje
curl -X POST http://localhost:5001/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "message": "Recomiéndame un RPG",
    "conversationHistory": []
  }'
```

---

## 📌 Notas Importantes

1. **Modelo recomendado**: `qwen2.5:0.5b` (rápido, pequeño)
2. **Requisito**: Docker Desktop debe estar corriendo
3. **Autenticación**: Solo usuarios logueados pueden usar chat
4. **Scope limitado**: AI solo conoce juegos en BD
5. **Historial**: Se mantiene en cliente (no se guarda en BD)
6. **Game cards**: Máximo 3 por respuesta
7. **Timeout**: 30 segundos máximo por request

---

## 🔗 Documentación Adicional

- [TESTING_INSTRUCTIONS.md](./TESTING_INSTRUCTIONS.md) - Guía paso a paso
- [walkthrough.md](./walkthrough.md) - Documentación técnica completa
- [implementation_plan.md](./implementation_plan.md) - Plan original

---

## 🎉 ¡Listo!

El asistente de IA está completamente implementado y listo para usar. Solo necesitas:

1. ✅ Iniciar Docker Desktop
2. ✅ Descargar el modelo qwen2.5:0.5b
3. ✅ Iniciar los servicios
4. ✅ ¡Disfrutar del asistente!

**¿Dudas?** Consulta `TESTING_INSTRUCTIONS.md`
