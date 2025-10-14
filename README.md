# Quiz-AI

Una aplicación de prueba de concepto que demuestra el uso de IA generativa para crear cuestionarios interactivos, con soporte para múltiples proveedores de IA.

## 🎯 Propósito

Quiz-AI es una prueba de concepto diseñada para:

- Explorar el uso de IA generativa en aplicaciones web
- Crear una capa de compatibilidad entre diferentes APIs de IA
- Consumir APIs compatibles con OpenAI (Groq) y soluciones locales (Ollama)
- Demostrar la integración de tecnologías modernas de frontend con servicios de IA

## 🚀 Tecnologías Utilizadas

- **Frontend**: SvelteKit 2.0 con Svelte 5
- **Styling**: TailwindCSS con componentes personalizados
- **UI Components**: shadcn-svelte
- **Lenguaje**: TypeScript
- **Testing**: Playwright (E2E), Vitest (Unit)
- **Linting**: ESLint + Prettier
- **Package Manager**: pnpm (recomendado)
- **Gestor de node y pnpm**: volta

## 📋 Requisitos Previos

- Node.js >= 22.18.0 < 23
- pnpm >= 9.15.1 (recomendado)

## 🛠️ Instalación

### Usando pnpm (recomendado)

```bash
# Clonar el repositorio
git clone <repository-url>
cd quiz-ai

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

## ⚙️ Configuración

### Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura las siguientes variables:

```bash
# Proveedor de IA (obligatorio)
AI_PROVIDER=groq  # Opciones: groq, ollama

# Para Groq
AI_URL=https://api.groq.com/openai/v1/chat/completions
AI_KEY=gsk_tu_clave_api_aqui  # Obtener en: https://console.groq.com/keys
AI_MODEL=openai/gpt-oss-20b

# Para Ollama (local)
# AI_PROVIDER=ollama
# AI_URL=http://localhost:11434/api/chat
# AI_MODEL=llama3.2:3b
# AI_KEY=  # Dejar vacío para Ollama
```

### Configuración de Groq

1. Visita [Groq Console](https://console.groq.com/keys)
2. Crea una cuenta y genera una API key
3. Configura `AI_PROVIDER=groq` y `AI_KEY=tu_clave_api`

### Configuración de Ollama (Local)

1. Instala [Ollama](https://ollama.ai/)
2. Ejecuta un modelo: `ollama run llama3.2:3b`
3. Configura `AI_PROVIDER=ollama`

## 🏃‍♂️ Comandos de Desarrollo

### Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev
```

### Build y Preview

```bash
# Construir para producción
pnpm build

# Previsualizar build de producción
pnpm preview
```

### Testing

```bash
# Ejecutar todos los tests
pnpm test

# Tests de integración (Playwright)
pnpm test:integration

# Tests unitarios (Vitest)
pnpm test:unit
```

### Linting y Formateo

```bash
# Verificar código
pnpm lint

# Formatear código
pnpm format

# Verificar y arreglar automáticamente
pnpm fix

# Verificación completa (formato + lint + type check)
pnpm check:all

# Type checking
pnpm check

# Type checking en modo watch
pnpm check:watch
```

## 🤖 APIs de IA Soportadas

### Groq

- **Descripción**: API en la nube compatible con OpenAI
- **Modelos soportados**:
  - `openai/gpt-oss-20b` (producción)
  - `meta-llama/llama-4-scout-17b-16e-instruct`
  - `moonshotai/kimi-k2-instruct-0905`
- **Características**: Rápido, escalable, soporte para JSON Schema
- **Documentación**: [Groq Docs](https://console.groq.com/docs/models)

### Ollama

- **Descripción**: Solución local para ejecutar modelos de IA
- **Modelos soportados**: Cualquier modelo compatible con Ollama
- **Modelos recomendados**:
  - `llama3.2:3b` (ligero, rápido)
  - `llama3.2:1b` (más ligero, resultado erráticos)
- **Características**: Privacidad total, sin costos de API, funciona offline
- **Documentación**: [Ollama Docs](https://ollama.ai/)

> Nota: utilizar `llama3.2:3b` que es el que ha dado resultados consistentes

## 📁 Estructura del Proyecto

```
quiz-ai/
├── src/
│   ├── lib/           # Componentes y utilidades reutilizables
│   ├── routes/        # Rutas de SvelteKit
│   ├── app.html       # Template HTML principal
│   └── app.css        # Estilos globales
├── static/            # Archivos estáticos
├── tests/             # Tests E2E
├── docs/              # Documentación y ejemplos de API
├── .env.example       # Plantilla de variables de entorno
└── package.json       # Configuración del proyecto
```

## 🔧 Desarrollo

- Se recomienda usar **pnpm** como gestor de paquetes para mejor rendimiento
- El proyecto usa Volta para gestión de versiones de Node.js
- Los modelos de Groq que soportan JSON Schema están documentados [aquí](https://console.groq.com/docs/structured-outputs#supported-models)
- Para desarrollo local con Ollama, asegúrate de que el servicio esté ejecutándose en el puerto 11434
