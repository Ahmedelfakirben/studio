# 🔄 Despliegue Separado: Backend + Frontend

El problema de compatibilidad con Coolify puede resolverse desplegando Backend y Frontend como **dos aplicaciones separadas**.

## Ventajas de esta Estrategia

✅ **Más simple** - Coolify maneja mejor apps de un solo propósito
✅ **Menos problemas** - Sin healthcheck complejo, sin multi-puerto
✅ **Más flexible** - Puedes escalar backend y frontend independientemente
✅ **Debugging más fácil** - Logs separados para cada servicio
✅ **Recomendado por Coolify** - Es el patrón estándar

---

## Opción 1: Frontend con Nixpacks (Más Simple)

### Paso 1: Crear Aplicación para Frontend

1. **En Coolify**, crea una **nueva aplicación**:
   - Name: `aly-gestion-frontend`
   - Repository: `ahmedelfakirben/studio`
   - Branch: `main`

2. **Configuración:**
   - **Build Pack**: `Nixpacks` (deja que Coolify detecte Next.js)
   - **Port**: `3000` (Next.js default)
   - **Base Directory**: `/` (root)

3. **Variables de Entorno:**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=/api
   BACKEND_URL=http://aly-gestion-backend:3001
   ```

4. **Deploy**

---

### Paso 2: Crear Aplicación para Backend

1. **En Coolify**, crea otra **nueva aplicación**:
   - Name: `aly-gestion-backend`
   - Repository: `ahmedelfakirben/studio`
   - Branch: `main`

2. **Crear Dockerfile.backend** (necesitamos crear este archivo):
   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app

   # Instalar dependencias del sistema
   RUN apk add --no-cache openssl

   # Copiar solo backend
   COPY backend/ ./

   # Instalar dependencias
   RUN npm ci --include=dev

   # Generar Prisma Client
   RUN npx prisma generate

   # Compilar TypeScript
   RUN npm run build

   # Crear directorio para BD
   RUN mkdir -p /app/data

   EXPOSE 3001

   ENV NODE_ENV=production
   ENV PORT=3001
   ENV DATABASE_URL="file:/app/data/prod.db"

   CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
   ```

3. **Configuración en Coolify:**
   - **Build Pack**: `Dockerfile`
   - **Dockerfile Location**: `Dockerfile.backend`
   - **Port**: `3001`
   - **Base Directory**: `/`

4. **Variables de Entorno:**
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=622fa71351110f18a8e8226dd1a75c40c9f29a4f6ea6939b1040e4ca0ff4305c
   DATABASE_URL=file:/app/data/prod.db
   FRONTEND_URL=https://tu-dominio-frontend.com
   ```

5. **Volumen Persistente (IMPORTANTE):**
   - Path: `/app/data`
   - Para persistir la base de datos SQLite

6. **Deploy**

---

## Opción 2: Ambos con Dockerfiles Simples

Si Nixpacks no funciona para el frontend, podemos crear también `Dockerfile.frontend`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar archivos
COPY package*.json ./
COPY . .

# Instalar dependencias
RUN npm ci

# Build
RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
```

---

## Configuración de Networking

Como están en el mismo servidor Coolify:

1. **Backend interno**: `http://aly-gestion-backend:3001`
2. **Frontend expuesto**: Tu dominio público

El frontend se conecta al backend usando la red interna de Docker.

---

## ¿Quieres que implemente esta solución?

Puedo crear:
1. `Dockerfile.backend` - Dockerfile simple solo para backend
2. `Dockerfile.frontend` - Dockerfile simple solo para frontend
3. Instrucciones paso a paso para configurar ambas apps en Coolify

Esto debería **eliminar completamente** los problemas de compatibilidad porque cada app es simple y directa.

¿Procedo con crear estos archivos?
