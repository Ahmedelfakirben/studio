FROM node:18-alpine

WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache openssl curl

# Copiar TODO el proyecto
COPY . .

# Instalar dependencias del frontend
RUN npm ci

# Instalar dependencias del backend
WORKDIR /app/backend
RUN npm ci --include=dev

# Generar Prisma Client
RUN npx prisma generate

# Compilar backend TypeScript
RUN npm run build

# Volver al root y construir frontend
WORKDIR /app

# Debug: Verificar estructura antes del build
RUN echo "=== Verificando estructura antes de build ===" && \
    ls -la && \
    echo "=== Contenido de src/ ===" && \
    ls -la src/ && \
    echo "=== Contenido de tsconfig.json ===" && \
    cat tsconfig.json && \
    echo "=== Verificando node_modules ===" && \
    ls node_modules/@radix-ui/ | head -5

# Build frontend con output verbose
RUN npm run build --verbose

# Crear directorio para base de datos
RUN mkdir -p /app/backend/data

# Exponer puertos
EXPOSE 3001 9002

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3001
ENV FRONTEND_PORT=9002
ENV DATABASE_URL="file:/app/backend/data/prod.db"

# Script de inicio
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

CMD ["/app/docker-entrypoint.sh"]
