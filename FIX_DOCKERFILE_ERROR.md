# 🔧 Fix: Error de Build en Coolify

**Error Original:**
```
#30 ERROR: failed to calculate checksum of ref: "/app/frontend/public": not found
```

---

## ✅ Problema Solucionado

El error ocurría porque el Dockerfile tenía rutas incorrectas para el build de Next.js con output `standalone`.

### ❌ Antes (Incorrecto):

```dockerfile
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend    # ❌ Ruta incorrecta
COPY . .
# ... build ...

# Luego en runner stage:
COPY --from=frontend-builder /app/frontend/public ./public  # ❌ No existía
```

### ✅ Ahora (Correcto):

```dockerfile
FROM node:18-alpine AS frontend-builder
WORKDIR /app    # ✅ Ruta correcta (raíz del proyecto)
COPY . .
# ... build ...

# Luego en runner stage:
COPY --from=frontend-builder /app/.next/standalone ./  # ✅ Build standalone
COPY --from=frontend-builder /app/.next/static ./.next/static
RUN mkdir -p ./public  # ✅ Crear public si no existe
```

---

## 📝 Cambios Realizados

### 1. **Dockerfile** (Corregido)
- ✅ Cambié `WORKDIR /app/frontend` a `WORKDIR /app` en frontend-builder
- ✅ Actualicé todas las rutas de COPY para usar `/app` en lugar de `/app/frontend`
- ✅ Eliminé la copia de `node_modules` (no necesario con standalone)
- ✅ Agregué `mkdir -p ./public` en el runner stage

### 2. **docker-entrypoint.sh** (Corregido)
- ✅ Cambié `cd /app/frontend/.next/standalone` a `cd /app/frontend`
- ✅ Next.js standalone copia `server.js` directamente a la raíz del output

### 3. **public/robots.txt** (Creado)
- ✅ Creé la carpeta `public/` con un `robots.txt` básico
- ✅ Esto asegura que la carpeta existe para assets estáticos futuros

---

## 🚀 Cómo Desplegar Ahora

### 1. El código ya está en GitHub

```bash
# Verificar que tienes los últimos cambios
git pull origin main

# Deberías ver el commit:
# 4b0a2ba - fix: Correct Dockerfile paths for Next.js standalone build
```

### 2. En Coolify: Force Rebuild

1. Ve a tu aplicación en Coolify
2. Click en **"Force Rebuild Container"**
3. Click en **"Deploy"** o **"Redeploy"**

### 3. Monitorear el Build

En los logs de Coolify, deberías ver:

```
✅ Stage 1: Build Backend - OK
✅ Stage 2: Build Frontend - OK (sin error de /public)
✅ Stage 3: Production Runtime - OK
```

### 4. Verificar que Funciona

Una vez desplegado:

```bash
# Frontend
curl https://tu-dominio.com
# Debería mostrar la página HTML

# Backend API
curl https://tu-dominio.com/api/
# Debería mostrar: {"message": "API de ALY Gestion funcionando correctamente"}
```

---

## 🔍 Qué Esperar Durante el Build

### Logs exitosos deberían mostrar:

```
#29 Building Next.js...
#29 Route (Pages)                        Size     First Load JS
#29 ├ ○ /                               142 kB         244 kB
#29 ├ ○ /login                         XX kB          XXX kB
#29 └ ... (todas las rutas)

#30 [runner 12/20] COPY --from=frontend-builder /app/.next/standalone ./
#30 DONE

#31 [runner 13/20] COPY --from=frontend-builder /app/.next/static ./.next/static
#31 DONE

#32 [runner 14/20] RUN mkdir -p ./public
#32 DONE
```

**NO deberías ver:** `not found` errors

---

## 📊 Estructura del Contenedor Final

```
/app/
├── backend/
│   ├── dist/           # Backend compilado (JS)
│   ├── node_modules/
│   ├── prisma/
│   └── data/           # Base de datos SQLite (volumen persistente)
│
├── frontend/
│   ├── server.js       # Next.js standalone server
│   ├── .next/
│   │   └── static/     # Assets estáticos
│   ├── public/         # Assets públicos (favicon, robots.txt, etc)
│   └── package.json
│
└── docker-entrypoint.sh  # Script de inicio
```

---

## ⚙️ Variables de Entorno (Recordatorio)

Asegúrate de tener estas configuradas en Coolify:

```bash
NODE_ENV=production
PORT=3001
FRONTEND_PORT=9002
DATABASE_URL=file:/app/backend/data/prod.db
JWT_SECRET=tu-secreto-seguro-aqui
NEXT_PUBLIC_API_URL=/api
BACKEND_URL=http://localhost:3001
```

---

## 💾 Volumen Persistente (Recordatorio)

No olvides configurar el volumen en Coolify:

```
Name: aly-db
Destination: /app/backend/data
```

Esto evita que la base de datos se pierda al reiniciar.

---

## ✅ Checklist Pre-Despliegue

Antes de hacer deploy en Coolify:

- [x] Código pushed a GitHub (commit `4b0a2ba`)
- [ ] Variables de entorno configuradas en Coolify
- [ ] Volumen persistente configurado
- [ ] Puerto 9002 expuesto
- [ ] Build Pack = `Dockerfile`
- [ ] Force Rebuild Container ejecutado

---

## 🎉 Próximo Build Debería Funcionar

Con estos cambios, el build en Coolify debería:

1. ✅ Compilar el backend correctamente
2. ✅ Compilar Next.js correctamente
3. ✅ Copiar todos los archivos sin errores
4. ✅ Iniciar ambos servicios (backend + frontend)
5. ✅ Responder en tu dominio

---

## 🐛 Si Aún Hay Errores

Si ves otros errores después de este fix:

1. **Copia el error completo** de los logs de Coolify
2. **Busca en los logs** qué stage está fallando (backend-builder, frontend-builder, o runner)
3. **Verifica** que el error no sea de variables de entorno faltantes

Errores comunes después de este fix:
- ❌ `JWT_SECRET is not defined` → Agregar variable de entorno
- ❌ `Cannot connect to database` → Configurar volumen persistente
- ❌ `Port 9002 is already in use` → Reiniciar contenedor en Coolify

---

**Documentado por:** Claude Code
**Fecha:** 2025-10-28
**Commit Fix:** `4b0a2ba`
