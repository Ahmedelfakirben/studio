# Multi-stage Dockerfile para ALY Gestion
# Despliegue completo: Frontend (Next.js) + Backend (Express + Prisma)

# ================================
# Stage 1: Build Backend
# ================================
FROM node:18-alpine AS backend-builder

# Force cache bust - change this value to force rebuild
ARG CACHEBUST=20251028_1720

WORKDIR /app/backend

# Copiar código fuente completo del backend primero
COPY backend/ ./

# Instalar TODAS las dependencias (incluyendo devDependencies para build)
RUN npm ci

# Generar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# NO hacer prune aquí - necesitamos Prisma CLI en runtime para migrations
# El tamaño extra es aceptable para tener Prisma funcionando

# ================================
# Stage 2: Build Frontend
# ================================
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copiar archivos de dependencias del frontend
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente del frontend (todo el proyecto)
COPY . .

# Copiar backend compilado para que esté disponible durante el build
COPY --from=backend-builder /app/backend ./backend

# Build de Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# ================================
# Stage 3: Production Runtime
# ================================
FROM node:18-alpine AS runner

WORKDIR /app

# Instalar dependencias del sistema (OpenSSL para Prisma, dumb-init para señales, curl para healthcheck)
RUN apk add --no-cache \
    dumb-init \
    openssl \
    openssl-dev \
    curl

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

# ================================
# Backend Setup
# ================================
WORKDIR /app/backend

# Copiar backend compilado (como root para luego cambiar ownership)
COPY --from=backend-builder --chown=appuser:nodejs /app/backend/dist ./dist
COPY --from=backend-builder --chown=appuser:nodejs /app/backend/node_modules ./node_modules
COPY --from=backend-builder --chown=appuser:nodejs /app/backend/prisma ./prisma
COPY --from=backend-builder --chown=appuser:nodejs /app/backend/package*.json ./

# ================================
# Frontend Setup
# ================================
WORKDIR /app/frontend

# Copiar frontend compilado (con ownership correcto)
COPY --from=frontend-builder --chown=appuser:nodejs /app/.next/standalone ./
COPY --from=frontend-builder --chown=appuser:nodejs /app/.next/static ./.next/static
COPY --from=frontend-builder --chown=appuser:nodejs /app/package*.json ./

# Copiar public si existe (opcional para assets estáticos)
RUN mkdir -p ./public && chown appuser:nodejs ./public

# ================================
# Scripts y Configuración
# ================================
WORKDIR /app

# Copiar script de inicio (con ownership y permisos)
COPY --chown=appuser:nodejs docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

# Crear directorio de datos con permisos correctos
RUN mkdir -p /app/backend/data && chown -R appuser:nodejs /app/backend/data

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

# Health check usando curl (más confiable que node -e)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:9002 || exit 1

# Punto de entrada
ENTRYPOINT ["dumb-init", "--"]
CMD ["./docker-entrypoint.sh"]
