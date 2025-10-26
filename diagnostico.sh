#!/bin/bash

echo "🔍 DIAGNÓSTICO COMPLETO - ALY GESTION"
echo "======================================"
echo ""

# 1. Verificar que estamos en el directorio correcto
echo "📁 Directorio actual:"
pwd
echo ""

# 2. Verificar estructura de archivos
echo "📂 Verificando estructura de archivos..."
echo ""

echo "✓ Checking src/app/clients:"
ls -la src/app/clients/ 2>/dev/null || echo "❌ NO EXISTE"
echo ""

echo "✓ Checking src/components/clients:"
ls -la src/components/clients/ 2>/dev/null || echo "❌ NO EXISTE"
echo ""

echo "✓ Checking backend/src/routes:"
ls -la backend/src/routes/ 2>/dev/null || echo "❌ NO EXISTE"
echo ""

# 3. Verificar backend
echo "🖥️  Verificando Backend..."
echo ""

echo "✓ Backend está corriendo?"
curl -s http://localhost:3001 2>/dev/null && echo "✅ SÍ" || echo "❌ NO - Inicia con: cd backend && npm run dev"
echo ""

echo "✓ Endpoint /api/clientes responde?"
curl -s http://localhost:3001/api/clientes 2>/dev/null | head -c 100 && echo "..." || echo "❌ NO RESPONDE"
echo ""

# 4. Verificar frontend
echo "🌐 Verificando Frontend..."
echo ""

echo "✓ Frontend está corriendo?"
curl -s http://localhost:9002 2>/dev/null | head -c 50 && echo "... ✅ SÍ" || echo "❌ NO - Inicia con: npm run dev"
echo ""

# 5. Verificar archivos críticos
echo "📄 Verificando archivos críticos..."
echo ""

echo "✓ next.config.ts existe?"
test -f next.config.ts && echo "✅ SÍ" || echo "❌ NO"

echo "✓ src/lib/api.ts existe?"
test -f src/lib/api.ts && echo "✅ SÍ" || echo "❌ NO"

echo "✓ backend/src/index.ts existe?"
test -f backend/src/index.ts && echo "✅ SÍ" || echo "❌ NO"

echo "✓ backend/.env existe?"
test -f backend/.env && echo "✅ SÍ" || echo "❌ NO"

echo ""
echo "======================================"
echo "✅ Diagnóstico completado"
echo ""
echo "📋 SIGUIENTE PASO:"
echo "1. Si el backend NO está corriendo: cd backend && npm run dev"
echo "2. Si el frontend NO está corriendo: npm run dev"
echo "3. Abre tu navegador en http://localhost:9002"
echo "4. Abre DevTools (F12) y ve a la pestaña Console"
echo "5. Comparte cualquier error que veas en rojo"
