# 🔧 Solución: Error de Despliegue en Coolify

**Error:** `mkdir: can't create directory '/artifacts/sgwogwc8gwoso0wwgsscc8wk/Dockerfile': File exists`

**Fecha:** 2025-10-28

---

## 🔍 Causa del Problema

Coolify está detectando tanto el `Dockerfile` como el `docker-compose.yml` en tu proyecto y se está confundiendo durante el despliegue. Este error específico ocurre cuando Coolify intenta crear un directorio pero encuentra un archivo con el mismo nombre.

---

## ✅ Solución 1: Configurar Coolify para usar Dockerfile (Recomendado)

### Paso 1: Configuración en Coolify

1. Ve a tu aplicación en Coolify
2. En la sección **"Build Pack"**, selecciona **"Dockerfile"** explícitamente
3. En **"Dockerfile Location"**, asegúrate que esté configurado como: `Dockerfile` (en la raíz)

### Paso 2: Variables de Entorno en Coolify

Agrega estas variables de entorno en Coolify:

#### Variables Obligatorias:

```bash
# Node
NODE_ENV=production

# Backend
PORT=3001
FRONTEND_URL=https://tu-dominio.com

# JWT (IMPORTANTE: Cambia esto por un secreto seguro)
JWT_SECRET=un-secreto-muy-seguro-de-al-menos-32-caracteres
JWT_EXPIRES_IN=7d

# Base de datos
DATABASE_URL=file:/app/backend/data/prod.db

# Frontend
FRONTEND_PORT=9002
BACKEND_URL=http://localhost:3001

# API URL para el frontend (IMPORTANTE)
NEXT_PUBLIC_API_URL=/api
```

#### ⚠️ Importante:

- **JWT_SECRET**: DEBE ser único y seguro en producción. Genera uno con:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

- **FRONTEND_URL**: Debe ser tu dominio real (ej: `https://aly-gestion.tu-servidor.com`)

- **NEXT_PUBLIC_API_URL**: Usar `/api` para que funcione el rewrite de Next.js

### Paso 3: Configuración de Puertos

En Coolify:
- **Puerto Principal**: `9002` (Frontend)
- **Puerto Adicional**: `3001` (Backend API - solo si necesitas acceso directo)

### Paso 4: Persistencia de Datos

Configura un volumen persistente en Coolify:
- **Path en el contenedor**: `/app/backend/data`
- **Nombre**: `aly-gestion-db`

---

## ✅ Solución 2: Limpiar el Build Cache de Coolify

Si el error persiste, puede ser un problema de caché:

### Paso 1: Limpiar Deployment

1. Ve a tu aplicación en Coolify
2. Click en **"Force Rebuild Container"** o **"Clean Deployment"**
3. Espera a que se limpie completamente

### Paso 2: Re-desplegar

1. Click en **"Restart"** o **"Redeploy"**
2. Monitorea los logs para ver si el error desaparece

---

## ✅ Solución 3: Usar docker-compose.yml (Alternativa)

Si prefieres usar docker-compose en Coolify:

### Paso 1: En Coolify

1. Cambia **"Build Pack"** a **"Docker Compose"**
2. En **"Docker Compose Location"**, pon: `docker-compose.yml`

### Paso 2: Actualizar docker-compose.yml

El archivo actual ya está listo, pero asegúrate de que Coolify inyecte las variables de entorno correctamente.

### Paso 3: Variables de Entorno

Las mismas que en la Solución 1, pero Coolify las inyectará automáticamente en el contenedor.

---

## ✅ Solución 4: Renombrar Archivos Temporalmente

Si Coolify sigue teniendo conflictos:

### Opción A: Si usas solo Dockerfile

1. Renombra temporalmente el `docker-compose.yml`:
   ```bash
   git mv docker-compose.yml docker-compose.yml.backup
   git commit -m "Backup docker-compose for Coolify deployment"
   git push
   ```

2. Despliega en Coolify con Dockerfile
3. Una vez que funcione, puedes restaurar el archivo para desarrollo local

### Opción B: Si usas solo docker-compose

1. Renombra temporalmente el `Dockerfile`:
   ```bash
   git mv Dockerfile Dockerfile.backup
   git commit -m "Backup Dockerfile for Coolify deployment"
   git push
   ```

2. Despliega en Coolify con docker-compose.yml
3. Restaura después si lo necesitas

---

## 🔍 Verificación Post-Despliegue

Después de un despliegue exitoso, verifica:

### 1. Frontend Funciona

```bash
curl https://tu-dominio.com
```

Deberías ver la página de login o dashboard.

### 2. Backend API Funciona

```bash
curl https://tu-dominio.com/api/
```

Deberías ver:
```json
{
  "message": "API de ALY Gestion funcionando correctamente"
}
```

### 3. Base de Datos Existe

En los logs de Coolify, busca:
```
Prisma schema loaded from /app/backend/prisma/schema.prisma
✅ Base de datos inicializada
```

### 4. Usuario Admin Creado

Intenta hacer login con:
- **Email**: `admin@example.com`
- **Password**: `admin123`

---

## 📝 Checklist de Configuración en Coolify

- [ ] **Build Pack** configurado (Dockerfile o Docker Compose)
- [ ] **Variables de entorno** agregadas (especialmente `JWT_SECRET`)
- [ ] **Puerto 9002** expuesto como puerto principal
- [ ] **Volumen persistente** configurado para `/app/backend/data`
- [ ] **Dominio** configurado y apuntando al servidor
- [ ] **HTTPS** habilitado (Coolify lo hace automáticamente)

---

## 🐛 Debugging

Si el despliegue falla, revisa los logs en Coolify:

### Errores Comunes:

1. **"Cannot find module '@prisma/client'"**
   - Solución: El Dockerfile ya incluye `npx prisma generate`
   - Verifica que el build no esté fallando en el Stage 1

2. **"ECONNREFUSED localhost:3001"**
   - Solución: Verifica que `BACKEND_URL=http://localhost:3001` esté configurado
   - El backend y frontend corren en el mismo contenedor

3. **"JWT_SECRET is not defined"**
   - Solución: Agrega la variable de entorno `JWT_SECRET` en Coolify

4. **"Database is locked"**
   - Solución: Asegúrate de tener un volumen persistente configurado

---

## 📊 Arquitectura en Coolify

```
┌─────────────────────────────────────┐
│   Coolify Reverse Proxy (Traefik)  │
│   https://tu-dominio.com            │
└─────────────────┬───────────────────┘
                  │
         ┌────────▼────────┐
         │  Docker Container│
         │  (aly-gestion)   │
         ├──────────────────┤
         │                  │
         │  Frontend :9002  │ ◄─── Puerto Principal
         │  (Next.js)       │
         │        │         │
         │  Rewrite /api    │
         │        │         │
         │        ▼         │
         │  Backend :3001   │
         │  (Express)       │
         │        │         │
         │        ▼         │
         │  SQLite DB       │ ◄─── Volumen Persistente
         │  (Prisma)        │       /app/backend/data
         └──────────────────┘
```

---

## 🆘 Si Nada Funciona

1. **Revisa los logs completos** en Coolify
2. **Copia el error exacto** que aparece
3. **Verifica que el repositorio** tenga los últimos cambios
4. **Intenta con un proyecto nuevo** en Coolify para descartar problemas de caché

### Comandos útiles para debugging:

```bash
# Ver logs del contenedor
docker logs <container-id> --tail 100

# Entrar al contenedor
docker exec -it <container-id> sh

# Verificar archivos
ls -la /app/frontend
ls -la /app/backend

# Verificar base de datos
ls -la /app/backend/data
```

---

## ✅ Resumen Rápido

**Para solucionar el error actual:**

1. Ve a Coolify → Tu App → Settings
2. Cambia **"Build Pack"** a **"Dockerfile"**
3. Agrega las variables de entorno (especialmente `JWT_SECRET`)
4. Configura volumen persistente para `/app/backend/data`
5. Haz **"Force Rebuild Container"**
6. Redeploy

---

**Documentado por:** Claude Code
**Fecha:** 2025-10-28
**Versión:** 1.0
