#!/bin/sh
set -e

echo "🚀 Starting ALY Gestion Application..."

# ================================
# Backend Initialization
# ================================
echo "📦 Initializing Backend..."
cd /app/backend

# Crear directorio de datos si no existe
mkdir -p /app/backend/data

# Ejecutar migraciones de Prisma
echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy

# Generar cliente de Prisma
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Iniciar Backend en segundo plano
echo "🌐 Starting Backend on port ${PORT:-3001}..."
node dist/index.js &
BACKEND_PID=$!

# ================================
# Frontend Initialization
# ================================
echo "🎨 Starting Frontend..."
cd /app/frontend

# Esperar a que el backend esté listo
echo "⏳ Waiting for backend to be ready..."
sleep 5

# Iniciar Frontend
echo "🌐 Starting Frontend on port ${FRONTEND_PORT:-9002}..."
node server.js &
FRONTEND_PID=$!

# ================================
# Monitoreo de procesos
# ================================
echo "✅ Application started successfully!"
echo "   - Backend running at http://localhost:${PORT:-3001}"
echo "   - Frontend running at http://localhost:${FRONTEND_PORT:-9002}"

# Función para manejar señales de terminación
cleanup() {
    echo "🛑 Shutting down gracefully..."
    kill -TERM $BACKEND_PID 2>/dev/null || true
    kill -TERM $FRONTEND_PID 2>/dev/null || true
    wait $BACKEND_PID 2>/dev/null || true
    wait $FRONTEND_PID 2>/dev/null || true
    echo "👋 Shutdown complete"
    exit 0
}

trap cleanup SIGTERM SIGINT

# Esperar a que los procesos terminen
wait $BACKEND_PID $FRONTEND_PID
