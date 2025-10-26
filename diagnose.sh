#!/bin/sh
# Script de diagnóstico para Coolify
# Ejecutar en el terminal de Coolify: sh /app/diagnose.sh

echo "==================================="
echo "🔍 DIAGNÓSTICO ALY GESTION"
echo "==================================="
echo ""

echo "📁 1. Estructura de archivos:"
echo "-----------------------------------"
echo "Backend:"
ls -la /app/backend/ 2>&1 | head -20
echo ""
echo "Backend dist:"
ls -la /app/backend/dist/ 2>&1 | head -10
echo ""
echo "Frontend:"
ls -la /app/frontend/ 2>&1 | head -20
echo ""
echo "Frontend standalone:"
ls -la /app/frontend/.next/standalone/ 2>&1 | head -10
echo ""

echo "📦 2. Variables de entorno:"
echo "-----------------------------------"
echo "NODE_ENV=$NODE_ENV"
echo "PORT=$PORT"
echo "FRONTEND_PORT=$FRONTEND_PORT"
echo "DATABASE_URL=$DATABASE_URL"
echo "JWT_SECRET=${JWT_SECRET:0:10}... (truncado)"
echo "FRONTEND_URL=$FRONTEND_URL"
echo ""

echo "🗄️ 3. Base de datos:"
echo "-----------------------------------"
ls -la /app/backend/data/ 2>&1
echo ""
cd /app/backend && npx prisma db execute --stdin <<< "SELECT COUNT(*) as usuarios FROM Usuario;" 2>&1
echo ""

echo "🔌 4. Procesos corriendo:"
echo "-----------------------------------"
ps aux | grep -E "(node|npm)" | grep -v grep
echo ""

echo "🌐 5. Puertos en uso:"
echo "-----------------------------------"
netstat -tlnp 2>&1 | grep -E "(3001|9002)" || echo "netstat no disponible, intentando con ss..."
ss -tlnp 2>&1 | grep -E "(3001|9002)" || echo "No se pueden verificar puertos"
echo ""

echo "📝 6. Intentar iniciar backend manualmente:"
echo "-----------------------------------"
echo "Ejecutando: cd /app/backend && node dist/index.js"
cd /app/backend
timeout 5 node dist/index.js 2>&1 &
sleep 6
echo ""

echo "🧪 7. Test de conexión al backend:"
echo "-----------------------------------"
curl -s http://localhost:3001/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test","password":"test"}' 2>&1 || echo "Backend no responde"
echo ""

echo "==================================="
echo "✅ Diagnóstico completo"
echo "==================================="
