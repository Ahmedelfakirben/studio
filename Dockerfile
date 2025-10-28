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
RUN npm run build

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
