# 🚀 Guía de Despliegue en Coolify - ALY Gestion

**Fecha:** 2025-10-28
**Proyecto:** ALY Gestion (Frontend + Backend en un solo contenedor)

---

## 📦 Arquitectura de Despliegue

Tu proyecto está configurado para desplegarse como **UNA SOLA IMAGEN DOCKER** que incluye:

- ✅ **Frontend**: Next.js (Puerto 9002)
- ✅ **Backend**: Express + Prisma (Puerto 3001)
- ✅ **Base de datos**: SQLite integrada
- ✅ **Auto-inicialización**: Migraciones y seed automáticos

---

## 🎯 Paso 1: Preparar el Código

### 1.1 Verificar que tienes los últimos cambios

```bash
cd C:\Users\Admin\Desktop\studio

# Verificar estado
git status

# Hacer commit de cambios pendientes
git add .
git commit -m "Fix Location Matériel and Frais d'Essence - Ready for deploy"

# Subir a tu repositorio
git push origin main
```

### 1.2 Actualizar la configuración de API para producción

✅ **YA ESTÁ ACTUALIZADO** - `src/lib/api.ts` ahora usa variables de entorno:

```typescript
// Configuración actual (ya aplicada):
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
```

**Explicación:**
- En **local**: Usa `/api` (Next.js reescribe automáticamente a `http://localhost:3001/api`)
- En **producción**: Usa `NEXT_PUBLIC_API_URL` de las variables de entorno de Coolify

---

## 🔧 Paso 2: Configurar en Coolify

### 2.1 Crear Nueva Aplicación

1. Ve a tu panel de Coolify: `https://tu-coolify.com`
2. Click en **"+ New"** → **"Resource"**
3. Selecciona **"Git Repository"**
4. Conecta tu repositorio (GitHub/GitLab/Gitea)

### 2.2 Configuración General

```yaml
Name: aly-gestion
Branch: main
Build Pack: Dockerfile
Base Directory: /
Dockerfile Location: ./Dockerfile
```

### 2.3 Puertos

**Puerto Principal (Public Port):**
```
9002
```

Esto expone el frontend de Next.js al mundo.

El backend (puerto 3001) es **interno** y solo accesible desde el frontend.

---

## 🌍 Paso 3: Variables de Entorno

En Coolify, ve a **"Environment Variables"** y configura:

### Variables Obligatorias

```bash
# NODE
NODE_ENV=production

# PUERTOS
PORT=3001
FRONTEND_PORT=9002

# BASE DE DATOS (usar ruta persistente)
DATABASE_URL=file:/app/backend/prisma/dev.db

# JWT (IMPORTANTE: Genera uno nuevo para producción)
JWT_SECRET=622fa71351110f18a8e8226dd1a75c40c9f29a4f6ea6939b1040e4ca0ff4305c

# Frontend URL (tu dominio completo)
FRONTEND_URL=https://aly-gestion.tu-dominio.com

# API URL para el frontend (IMPORTANTE: Usar /api para rewrite interno)
NEXT_PUBLIC_API_URL=/api

# Backend URL interno (solo para rewrites de Next.js)
BACKEND_URL=http://localhost:3001
```

**🔐 IMPORTANTE sobre NEXT_PUBLIC_API_URL**:

### ⚠️ USAR `/api` NO tu dominio completo

```bash
# ✅ CORRECTO:
NEXT_PUBLIC_API_URL=/api

# ❌ INCORRECTO (esto causará problemas):
NEXT_PUBLIC_API_URL=https://aly-gestion.coolify.io/api
```

**¿Por qué usar `/api`?**

Porque Next.js tiene configurado un `rewrite` en `next.config.ts` que automáticamente redirige `/api/*` al backend interno (`http://localhost:3001/api/*`). Esto:
- ✅ Evita problemas de CORS
- ✅ Funciona tanto en local como en producción
- ✅ No necesitas cambiar código entre entornos

### Ejemplo con dominio de Coolify

Si Coolify te asigna: `https://aly-gestion-abc123.coolify.io`

Configura:
```bash
FRONTEND_URL=https://aly-gestion-abc123.coolify.io
NEXT_PUBLIC_API_URL=/api
BACKEND_URL=http://localhost:3001
```

---

## 💾 Paso 4: Configurar Volumen (Persistencia de DB)

Para que tu base de datos SQLite **NO se pierda** al reiniciar:

### En Coolify:

1. Ve a tu aplicación → **"Volumes"** o **"Storage"**
2. Click en **"Add Volume"**
3. Configura:

```
Name: aly-db
Source (Host Path): /var/lib/coolify/storage/aly-gestion/db
Destination (Container Path): /app/backend/prisma
```

**Explicación:**
- El **container path** `/app/backend/prisma` es donde vive tu archivo `dev.db`
- El **host path** es donde Coolify almacena los datos persistentes

---

## 🔄 Paso 5: Desplegar

### 5.1 Iniciar el Despliegue

1. En Coolify, haz click en **"Deploy"** o **"Redeploy"**
2. Coolify comenzará a:
   - Clonar tu repositorio
   - Construir la imagen Docker (esto toma 5-10 minutos la primera vez)
   - Iniciar el contenedor

### 5.2 Monitorear el Despliegue

En Coolify puedes ver:
- **Logs**: Ver el proceso de build en tiempo real
- **Status**: Ver si está "Running", "Building", o "Failed"

Busca estos mensajes en los logs:
```
🚀 Starting ALY Gestion Application...
📦 Initializing Backend...
🔄 Running Prisma migrations...
🌱 Seeding database with initial data...
🌐 Starting Backend on port 3001...
🌐 Starting Frontend on port 9002...
✅ Application started successfully!
```

---

## 🎉 Paso 6: Verificar el Despliegue

### 6.1 Acceder a tu aplicación

Una vez desplegada, accede a:
```
https://aly-gestion.tu-dominio.com
```

### 6.2 Probar el Login

Credenciales por defecto (creadas por el seed):
```
Email: admin@alygestion.com
Password: admin123
```

**🔒 IMPORTANTE**: Cambia esta contraseña inmediatamente después del primer login.

### 6.3 Verificar Funcionalidades

✅ Login funciona
✅ Dashboard muestra datos reales
✅ Puedes crear Factures, Préfactures
✅ Location Matériel funciona (sin error 500)
✅ Frais d'Essence se puede agregar (botón funcional)
✅ Impresión de documentos es profesional

---

## 🐛 Solución de Problemas Comunes

### Error: "Database not found"

**Causa**: El volumen no está configurado correctamente.

**Solución**:
1. Verifica que el volumen esté creado
2. Reinicia el contenedor
3. Revisa los logs: debe decir "🌱 Seeding database..."

### Error: "Cannot connect to API"

**Causa**: `NEXT_PUBLIC_API_URL` no está configurado correctamente.

**Solución**:
1. Verifica la variable de entorno en Coolify
2. Debe apuntar a tu dominio completo + `/api`
3. Ejemplo: `https://aly-gestion.coolify.io/api`
4. Haz redeploy después de cambiarla

### Error: "Backend starting but frontend fails"

**Causa**: Puerto incorrecto o entrypoint no está esperando al backend.

**Solución**:
1. Verifica que `FRONTEND_PORT=9002` esté configurado
2. Revisa logs: debe decir "⏳ Waiting for backend to be ready..."
3. El entrypoint espera 5 segundos, si falla, aumenta el `sleep 5` a `sleep 10`

### Error: "500 Internal Server Error en Location Matériel"

**Causa**: Ya está ARREGLADO en el último commit.

**Solución**:
- Asegúrate de hacer `git push` antes de desplegar
- En Coolify, haz "Force Redeploy"

### Error: "No puedo agregar Frais d'Essence"

**Causa**: Ya está ARREGLADO (botón ahora abre un dialog).

**Solución**:
- Asegúrate de tener el código más reciente
- Limpia la caché del navegador (Ctrl+Shift+R)

---

## 🔄 Actualizar la Aplicación

Cada vez que hagas cambios en el código:

```bash
# 1. Hacer commit
git add .
git commit -m "Descripción del cambio"
git push origin main

# 2. En Coolify, click en "Redeploy"
# O configura Auto Deploy para que se despliegue automáticamente
```

### Habilitar Auto Deploy

En Coolify:
1. Ve a tu aplicación → **"General"**
2. Activa **"Auto Deploy"**
3. Ahora cada `git push` desplegará automáticamente

---

## 📊 Monitoreo Post-Despliegue

### Logs en Tiempo Real

En Coolify:
```
Application → Logs → Toggle "Live"
```

### Health Check

Coolify ejecuta automáticamente un health check cada 30 segundos:
```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3
```

Si falla 3 veces seguidas, Coolify reinicia el contenedor.

### Métricas

En Coolify puedes ver:
- **CPU Usage**: Debe estar <50% en uso normal
- **Memory**: ~500MB-1GB es normal
- **Storage**: Crece con la base de datos

---

## 🔐 Seguridad Post-Despliegue

### 1. Cambiar Credenciales de Admin

```sql
-- Conectarte a la app y cambiar en Settings
```

### 2. Rotar JWT_SECRET

```bash
# Generar nuevo secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Actualizar en Coolify → Environment Variables
# Redeploy
```

### 3. Backups de Base de Datos

Configura backups automáticos del volumen:

```bash
# Backup manual desde Coolify terminal
docker exec -it <container-id> sh
cd /app/backend/prisma
cp dev.db dev.db.backup.$(date +%Y%m%d)
```

O configura backups automáticos en Coolify.

---

## 📈 Escalabilidad

### Límites Actuales

Con SQLite y un solo contenedor:
- ✅ Hasta ~100 usuarios concurrentes
- ✅ Perfecto para pequeñas empresas
- ✅ Bajo costo de hosting

### Si necesitas escalar más

Considera migrar a:
1. **PostgreSQL** en lugar de SQLite
2. **Múltiples instancias** del frontend
3. **Redis** para caché
4. **CDN** para assets estáticos

---

## 🎯 Resumen de Configuración

| Parámetro | Valor |
|-----------|-------|
| **Dockerfile** | `./Dockerfile` |
| **Puerto Público** | `9002` |
| **Puerto Backend (interno)** | `3001` |
| **Base de datos** | SQLite en volumen persistente |
| **NODE_ENV** | `production` |
| **JWT_SECRET** | `622fa71351110f18a8e8226dd1a75c40c9f29a4f6ea6939b1040e4ca0ff4305c` |
| **Volumen** | `/app/backend/prisma` → Host persistente |

---

## ✅ Checklist Final

Antes de desplegar, verifica:

- [ ] Código subido a Git (`git push`)
- [ ] Variables de entorno configuradas en Coolify
- [ ] `NEXT_PUBLIC_API_URL` apunta a tu dominio real
- [ ] Volumen configurado para persistencia de DB
- [ ] Puerto 9002 mapeado correctamente
- [ ] Dockerfile y docker-entrypoint.sh están en la raíz

**¡Listo para desplegar!** 🚀

---

## 📞 Soporte

Si encuentras problemas:

1. **Revisa los logs** en Coolify
2. **Verifica las variables de entorno**
3. **Comprueba que el volumen esté montado**
4. **Revisa el health check** (debe estar "healthy")

---

**Documentado por:** Claude Code
**Última actualización:** 2025-10-28
**Versión:** 1.0
