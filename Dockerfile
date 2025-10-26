# Multi-stage Dockerfile para ALY Gestion
# Despliegue completo: Frontend (Next.js) + Backend (Express + Prisma)

# ================================
# Stage 1: Build Backend
# ================================
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copiar archivos de dependencias del backend
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente del backend
COPY backend/ ./

# Generar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# ================================
# Stage 2: Build Frontend
# ================================
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copiar archivos de dependencias del frontend
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente del frontend
COPY . .
COPY --from=backend-builder /app/backend ./backend

# Build de Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# ================================
# Stage 3: Production Runtime
# ================================
FROM node:18-alpine AS runner

WORKDIR /app

# Instalar dumb-init para manejo correcto de señales
RUN apk add --no-cache dumb-init

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

# ================================
# Backend Setup
# ================================
WORKDIR /app/backend

# Copiar backend compilado
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/prisma ./prisma
COPY --from=backend-builder /app/backend/package*.json ./

# ================================
# Frontend Setup
# ================================
WORKDIR /app/frontend

# Copiar frontend compilado
COPY --from=frontend-builder /app/frontend/public ./public
COPY --from=frontend-builder /app/frontend/.next/standalone ./
COPY --from=frontend-builder /app/frontend/.next/static ./.next/static
COPY --from=frontend-builder /app/frontend/node_modules ./node_modules
COPY --from=frontend-builder /app/frontend/package*.json ./

# ================================
# Scripts y Configuración
# ================================
WORKDIR /app

# Copiar script de inicio
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

# Cambiar propiedad a usuario no-root
RUN chown -R appuser:nodejs /app

USER appuser

# Exponer puertos
# 3001: Backend API
# 9002: Frontend Next.js
EXPOSE 3001 9002

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3001
ENV FRONTEND_PORT=9002
ENV DATABASE_URL="file:/app/backend/data/prod.db"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:9002', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Punto de entrada
ENTRYPOINT ["dumb-init", "--"]
CMD ["./docker-entrypoint.sh"]
