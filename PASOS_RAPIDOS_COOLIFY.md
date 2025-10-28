# ⚡ Solución Rápida: Error de Coolify

**Error actual:** `mkdir: can't create directory '/artifacts/.../Dockerfile': File exists`

---

## 🚀 Pasos Rápidos para Solucionarlo

### 1️⃣ En Coolify - Configuración de Build

1. Ve a tu aplicación en Coolify
2. Settings → **Build**
3. Configura:
   - **Build Pack**: `Dockerfile`
   - **Dockerfile Location**: `Dockerfile`
   - **Base Directory**: `/` (o déjalo vacío)

### 2️⃣ En Coolify - Variables de Entorno

Agrega estas variables (Settings → Environment):

```bash
NODE_ENV=production
PORT=3001
FRONTEND_PORT=9002
DATABASE_URL=file:/app/backend/data/prod.db
JWT_SECRET=622fa71351110f18a8e8226dd1a75c40c9f29a4f6ea6939b1040e4ca0ff4305c
NEXT_PUBLIC_API_URL=/api
BACKEND_URL=http://localhost:3001
```

### 3️⃣ En Coolify - Puerto Principal

- **Port Exposes**: `9002`

### 4️⃣ En Coolify - Volumen Persistente

1. Settings → **Storages**
2. Add Volume:
   - **Source (name)**: `aly-db`
   - **Destination (path)**: `/app/backend/data`

### 5️⃣ Limpiar y Redesplegar

1. Click en **"Force Rebuild Container"** o **"Clean Deployment"**
2. Espera a que se limpie
3. Click en **"Deploy"** o **"Redeploy"**

---

## ✅ Lo que se solucionó en el código

Ya actualicé `src/lib/api.ts` para usar variables de entorno:

```typescript
// Ahora funciona en local y producción
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
```

**Asegúrate de hacer commit y push:**

```bash
git add src/lib/api.ts
git commit -m "Fix: API configuration for production deployment"
git push origin main
```

---

## 🔍 Verificar que Funciona

Después del despliegue:

1. **Frontend carga**: `https://tu-dominio.com` → Muestra página de login
2. **Backend responde**: Abre DevTools (F12), intenta login, verifica que llame a `/api/auth/login`
3. **No hay errores CORS**: No debe haber errores de "blocked by CORS policy"

---

## ❌ Si el Error Persiste

El error específico de `Dockerfile: File exists` puede ser un bug de Coolify. Intenta:

### Opción A: Forzar limpieza completa

```bash
# En Coolify, ve a:
Settings → Danger Zone → Delete Resource
# Luego crea la aplicación de nuevo
```

### Opción B: Usar docker-compose.yml

Si Coolify sigue teniendo problemas con el Dockerfile:

1. **Build Pack**: Cambia a `Docker Compose`
2. **Docker Compose Location**: `docker-compose.yml`
3. Las variables de entorno son las mismas
4. Redeploy

### Opción C: Renombrar temporalmente

```bash
# En tu computadora:
git mv docker-compose.yml docker-compose.yml.backup
git commit -m "Temporarily disable docker-compose for Coolify"
git push

# Intenta desplegar de nuevo en Coolify
# Una vez funcione, puedes restaurar:
git mv docker-compose.yml.backup docker-compose.yml
git commit -m "Restore docker-compose"
git push
```

---

## 📋 Checklist Rápido

Antes de desplegar, confirma:

- [ ] `src/lib/api.ts` tiene `const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';`
- [ ] Hiciste `git push` de todos los cambios
- [ ] Build Pack en Coolify = `Dockerfile`
- [ ] Variables de entorno agregadas (especialmente `NEXT_PUBLIC_API_URL=/api`)
- [ ] Puerto 9002 configurado
- [ ] Volumen para `/app/backend/data` creado

---

**¿Sigue sin funcionar?** Mira `SOLUCION_ERROR_COOLIFY.md` para debugging más detallado.
