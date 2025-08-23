# 🎮 PokeApp - Aplicación de Pokémon

Una aplicación web moderna y responsive para explorar y gestionar información de Pokémon, construida con React, TypeScript y Vite.

## 🚀 Características Principales

- **🔍 Catálogo Completo**: Navega por todos los Pokémon disponibles
- **📱 Diseño Responsive**: Funciona perfectamente en dispositivos móviles y desktop
- **🔐 Sistema de Autenticación**: Login seguro con validación
- **📊 Información Detallada**: Modal con stats, tipos, habilidades, movimientos y formas
- **🎨 Interfaz Moderna**: Diseño atractivo con Ant Design y CSS personalizado
- **⚡ Rendimiento Optimizado**: Carga rápida con Vite y React 18

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Ant Design
- **Routing**: React Router DOM
- **Testing**: Vitest + React Testing Library
- **Styling**: CSS Modules + CSS personalizado
- **State Management**: React Hooks personalizados

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn

## 🚀 Instalación y Configuración

### ⚡ **Configuración Rápida (Recomendado)**

1. **Clonar la aplicación frontend:**
   ```bash
   git clone <tu-repositorio>
   cd poke-app
   ```

2. **Clonar el servidor backend:**
   ```bash
   git clone https://github.com/pajmunoz/server-pokemon.git
   cd server-pokemon
   npm install
   npm run dev
   ```

3. **Instalar dependencias del frontend:**
   ```bash
   cd ../poke-app
   npm install
   ```

4. **Ejecutar la aplicación:**
   ```bash
   npm run dev
   ```

### 🔧 **Configuración Manual**

#### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd poke-app
```

#### 2. Instalar dependencias
```bash
npm install
```

#### 3. Configurar servidor
La aplicación requiere un servidor backend para funcionar correctamente. Tienes dos opciones:

**Opción A: Servidor Preconfigurado (Recomendado)**
- Clona [pajmunoz/server-pokemon](https://github.com/pajmunoz/server-pokemon)
- Usa las credenciales: `admin/password`

**Opción B: Servidor Personalizado**
- **API Endpoint**: `http://localhost:3000` (o el puerto que uses)
- **Servicios disponibles**: 
  - Autenticación (`/auth/login`)
  - Lista de Pokémon (`/pokemon`)
  - Detalles de Pokémon (`/pokemon/:id`)

#### 4. Ejecutar la aplicación
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🔐 Credenciales de Acceso

### 🎯 **Aplicación Frontend:**
**Usuario**: `admin`  
**Contraseña**: `admin`

### 🖥️ **Servidor Backend (GitHub):**
**Usuario**: `admin`  
**Contraseña**: `admin`

> ⚠️ **Importante**: Estas credenciales son para desarrollo local. En producción, asegúrate de cambiar las credenciales por defecto.

## 📱 Uso de la Aplicación

### 1. **Login**
- **Para servidor local**: Usa las credenciales `admin/admin`
- **Para servidor de GitHub**: Usa las credenciales `admin/password`
- El sistema validará tus credenciales contra el servidor configurado

### 2. **Explorar Pokémon**
- Navega por la lista paginada de Pokémon
- Utiliza la barra de búsqueda para encontrar Pokémon específicos
- Haz clic en cualquier tarjeta para ver detalles completos

### 3. **Ver Detalles**
- Modal detallado con información completa del Pokémon
- Estadísticas visuales con barras de progreso
- Lista de tipos, habilidades, movimientos y formas
- Diseño adaptativo según el tipo del Pokémon

### 4. **Navegación**
- Header con botón de cerrar sesión
- Paginación para navegar por grandes listas
- Búsqueda en tiempo real

## 🧪 Testing

Ejecuta los tests con:
```bash
npm test
```

Para tests en modo watch:
```bash
npm run test:watch
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── auth/           # Componentes de autenticación
│   ├── common/         # Componentes comunes (Button, Input, Modal, etc.)
│   ├── layout/         # Componentes de layout (Header)
│   └── pokemon/        # Componentes específicos de Pokémon
├── hooks/              # Custom hooks
├── pages/              # Páginas principales
├── routes/             # Configuración de rutas
├── api/                # Servicios de API
├── utils/              # Utilidades y helpers
└── assets/             # Imágenes y recursos estáticos
```

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm test` - Ejecuta los tests
- `npm run test:watch` - Ejecuta tests en modo watch
- `npm run lint` - Ejecuta el linter

## 🌐 Configuración del Servidor

### 🚀 **Hosting en Vercel (Recomendado)**

Esta aplicación está optimizada para ser desplegada en **Vercel**, una plataforma de hosting moderna y escalable:

#### **Ventajas de Vercel:**
- **⚡ Deploy Automático**: Integración directa con GitHub/GitLab
- **🌍 Edge Network**: Distribución global con latencia mínima
- **🔒 HTTPS Automático**: Certificados SSL gratuitos
- **📊 Analytics Integrados**: Métricas de rendimiento en tiempo real
- **🔄 Serverless Functions**: API routes sin configuración adicional
- **💾 Base de Datos**: Integración con Vercel Postgres, MongoDB, etc.

#### **Configuración para Vercel:**

1. **Crear cuenta en Vercel:**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Configurar variables de entorno:**
   ```env
   # .env.local
   VITE_API_URL=https://tu-app.vercel.app/api
   VITE_DATABASE_URL=tu_url_de_base_de_datos
   ```

3. **Deploy automático:**
   ```bash
   vercel --prod
   ```

#### **Estructura de API en Vercel:**
```
api/
├── auth/
│   └── login.ts          # POST /api/auth/login
├── pokemon/
│   ├── index.ts          # GET /api/pokemon
│   └── [id].ts           # GET /api/pokemon/[id]
└── _middleware.ts         # Middleware global
```

#### **Deploy en Vercel:**

1. **Conectar repositorio:**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio de GitHub/GitLab
   - Vercel detectará automáticamente que es un proyecto React

2. **Configuración automática:**
   ```json
   // vercel.json (opcional)
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "rewrites": [
       { "source": "/api/(.*)", "destination": "/api/$1" }
     ]
   }
   ```

3. **Variables de entorno en Vercel:**
   - Ve a tu proyecto en Vercel Dashboard
   - Settings → Environment Variables
   - Agrega las variables necesarias

4. **Deploy automático:**
   - Cada push a `main` activará un deploy automático
   - Vercel creará previews para cada Pull Request
   - URLs de producción: `https://tu-app.vercel.app`

#### **Monitoreo y Analytics:**
- **Speed Insights**: Métricas de rendimiento automáticas
- **Web Analytics**: Análisis de usuarios y comportamiento
- **Function Logs**: Logs de las API routes en tiempo real
- **Edge Network**: Distribución global automática

#### **Mejores Prácticas para Vercel:**
- **🔄 Cache Strategy**: Usa `revalidate` para datos dinámicos
- **📦 Bundle Optimization**: Vite ya está optimizado para Vercel
- **🌐 Edge Functions**: Para APIs que requieren baja latencia
- **💾 Database Connections**: Usa connection pooling para bases de datos
- **🔒 Security**: Middleware para autenticación y CORS
- **📱 PWA**: Configuración automática de service workers

#### **Optimizaciones Específicas:**
```typescript
// api/pokemon/index.ts
export const config = {
  runtime: 'edge', // Para máxima velocidad
  regions: ['iad1'], // Región específica si es necesario
}

// Cache de 5 minutos para datos de Pokémon
export async function GET(request: Request) {
  const pokemon = await fetchPokemonData()
  
  return new Response(JSON.stringify(pokemon), {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
```

### 🏠 **Servidor Local (Desarrollo)**

Para desarrollo local, también puedes configurar un servidor backend que proporcione:

### 📥 **Servidor Preconfigurado (Recomendado para Desarrollo)**

Si prefieres no configurar tu propio servidor, puedes usar el **servidor oficial** que ya está configurado y listo para usar:

#### **🌐 Servidor en GitHub:**
- **Repositorio**: [pajmunoz/server-pokemon](https://github.com/pajmunoz/server-pokemon)
- **Características**: Servidor completo con autenticación JWT
- **Endpoints**: Todos los endpoints necesarios para la aplicación
- **Usuario de prueba**: `admin` / `password`

#### **🚀 Instalación del Servidor:**

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/pajmunoz/server-pokemon.git
   cd server-pokemon
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```env
   # .env
   JWT_SECRET=tu_secreto_jwt
   PORT=3000
   ```

4. **Ejecutar el servidor:**
   ```bash
   npm run dev
   ```

5. **Configurar la aplicación frontend:**
   ```env
   # .env.local en tu app React
   VITE_API_URL=http://localhost:3000/api
   ```

#### **🔑 Credenciales del Servidor:**
- **Usuario**: `admin`
- **Contraseña**: `admin`
- **Nota**: Cambia estas credenciales en producción

#### **📡 Endpoints Disponibles:**
- `POST /api/auth/login` - Autenticación
- `GET /api/pokemon` - Lista de Pokémon
- `GET /api/pokemon/:id` - Detalles de Pokémon
- `GET /api/pokemon/search/:name` - Búsqueda por nombre
- `GET /api/pokemon/search` - Búsqueda avanzada con filtros

#### **🛡️ Características de Seguridad:**
- **JWT Tokens** con expiración de 24 horas
- **Contraseñas encriptadas** con bcrypt
- **Middleware de autenticación** para rutas protegidas
- **Validación de entrada** en todos los endpoints
- **Manejo de errores** robusto con códigos específicos

### 🏗️ **Servidor Personalizado (Opcional)**

#### Autenticación
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin"
}
```

#### Lista de Pokémon
```http
GET /pokemon?limit=20&offset=0
```

#### Detalles de Pokémon
```http
GET /pokemon/:id
```

## 🎨 Personalización

### Colores por Tipo de Pokémon
La aplicación incluye un sistema de colores automático basado en el tipo del Pokémon:
- **Electric**: Amarillo
- **Fire**: Rojo
- **Water**: Azul
- **Grass**: Verde
- Y muchos más...

### Estilos CSS
Los estilos están organizados en módulos CSS para facilitar la personalización:
- `PokemonDetailModal.css` - Estilos del modal de detalles
- `PokemonCard.css` - Estilos de las tarjetas
- `MainPage.css` - Estilos de la página principal

## 🚨 Solución de Problemas

### Error de Conexión
Si ves errores de conexión:
1. Verifica que tu servidor local esté ejecutándose
2. Confirma que el puerto sea el correcto
3. Revisa la configuración de CORS en tu servidor

### Problemas de Autenticación
Si no puedes iniciar sesión:
1. Verifica que las credenciales sean `admin/admin`
2. Confirma que el endpoint de login esté funcionando
3. Revisa la consola del navegador para errores

### 🚨 **Problemas Específicos de Vercel**

#### **Error de Build:**
```bash
# Si hay problemas con el build
vercel --debug
npm run build --debug
```

#### **API Routes no funcionan:**
1. Verifica que estén en la carpeta `api/`
2. Confirma que el archivo exporte la función HTTP correcta
3. Revisa los logs en Vercel Dashboard

#### **Variables de Entorno:**
- Las variables deben empezar con `VITE_` para ser accesibles en el frontend
- Las variables sin `VITE_` solo están disponibles en las API routes
- Reinicia el deploy después de cambiar variables de entorno

#### **Problemas de CORS:**
```typescript
// api/_middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  return response
}
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Si tienes preguntas o problemas:
- Abre un issue en GitHub
- Revisa la documentación de las tecnologías utilizadas
- Consulta los logs de la consola del navegador

---

**¡Disfruta explorando el mundo Pokémon! 🎮✨**
