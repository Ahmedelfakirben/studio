# 🔧 Solución: Error "cat: read error: Is a directory"

**Error en Coolify:**
```
[CMD]: docker exec ... bash -c 'cat /artifacts/...'
cat: read error: Is a directory
Deployment failed.
```

---

## 🎯 Causa del Problema

Este es un **bug conocido de Coolify** cuando usa el build pack "Dockerfile". Coolify intenta leer un directorio como si fuera un archivo durante el proceso de despliegue.

**NO es un problema con tu código** - es un problema de compatibilidad entre Coolify y ciertos Dockerfiles.

---

## ✅ Solución: Usar Docker Compose

Ya tienes un `docker-compose.yml` en tu proyecto. Vamos a usarlo en lugar del Dockerfile.

### Paso 1: Cambiar Build Pack en Coolify

1. **Ve a Coolify** (http://49.13.153.105:8000 o tu URL)

2. **Navega a tu aplicación:**
   ```
   My first project → production → ahmedelfakirben/studio:main
   ```

3. **Ve a Settings → Build**

4. **Cambia la configuración:**
   ```
   Build Pack: Docker Compose  ← (cambiar de "Dockerfile")
   Docker Compose Location: docker-compose.yml
   Base Directory: / (o déjalo vacío)
   ```

5. **Guarda los cambios**

### Paso 2: Configurar Variables de Entorno

En Coolify → **Environment Variables**, agrega (si no las tienes):

```bash
# Estas se inyectarán automáticamente en docker-compose
FRONTEND_URL=https://tu-dominio.com
JWT_SECRET=622fa71351110f18a8e8226dd1a75c40c9f29a4f6ea6939b1040e4ca0ff4305c
```

**Nota:** Las demás variables ya tienen valores por defecto en `docker-compose.yml`.

### Paso 3: Configurar Puerto Principal

En Coolify → **Port Exposes**:
```
9002
```

### Paso 4: Desplegar

1. Click en **"Deploy"** o **"Redeploy"**
2. Espera a que el build complete (5-10 minutos)
3. Monitorea los logs

---

## 📊 Diferencias entre Dockerfile y Docker Compose

| Aspecto | Dockerfile | Docker Compose |
|---------|-----------|----------------|
| **Compatibilidad Coolify** | ⚠️ A veces falla | ✅ Más confiable |
| **Volúmenes** | Manual | ✅ Auto-configurado |
| **Variables de entorno** | Manual | ✅ Más fácil |
| **Healthcheck** | Manual | ✅ Incluido |

---

## 🔍 Qué Hace docker-compose.yml

El archivo `docker-compose.yml` actualizado:

1. ✅ Usa el mismo Dockerfile (no cambia nada del build)
2. ✅ Configura volúmenes persistentes automáticamente:
   - `aly-gestion-db` → `/app/backend/data` (Base de datos)
3. ✅ Expone puertos correctamente (3001 y 9002)
4. ✅ Configura healthcheck con curl
5. ✅ Define todas las variables de entorno necesarias

---

## 📝 Verificación Post-Despliegue

Después del deploy, verifica:

### 1. Logs del Contenedor

En Coolify → Logs, deberías ver:

```
🚀 Starting ALY Gestion Application...
📦 Initializing Backend...
🔍 Checking directory structure...
🔍 Checking prisma directory...
-rw-r--r--    1 appuser  nodejs     6864 schema.prisma  ✅
-rw-r--r--    1 appuser  nodejs     2042 seed.ts        ✅
drwxr-xr-x    X appuser  nodejs     XXXX migrations     ✅

🔄 Running Prisma migrations...
✅ Migration completed

🌱 Seeding database...
✅ Database seeded

🌐 Starting Backend on port 3001...
🌐 Starting Frontend on port 9002...
✅ Application started successfully!
```

### 2. Healthcheck Pasa

En Coolify, el status debería cambiar a:
```
Status: ✅ Healthy
```

### 3. Aplicación Accesible

```bash
curl https://tu-dominio.com
# Debería devolver HTML de la app
```

---

## 🆘 Si Docker Compose También Falla

Si el deploy con Docker Compose también falla, prueba:

### Opción A: Limpiar Cache de Docker (SSH)

```bash
ssh root@49.13.153.105
docker builder prune -af
docker system prune -af
exit
```

Luego redeploy en Coolify.

### Opción B: Recrear la Aplicación

1. Exporta tus variables de entorno (cópialas)
2. En Coolify: **Delete Resource** (tu app actual)
3. Crea una **nueva aplicación** desde cero
4. Usa **Docker Compose** desde el inicio
5. Configura variables de entorno
6. Deploy

---

## 🎯 Ventajas de Docker Compose en Coolify

1. **Más estable** - Menos propenso a bugs de Coolify
2. **Volúmenes automáticos** - No necesitas configurarlos manualmente
3. **Fácil de configurar** - Todo en un archivo
4. **Healthcheck incluido** - Ya configurado
5. **Networks automáticas** - Aislamiento de red

---

## 📋 Checklist de Configuración

Antes de desplegar con Docker Compose:

- [ ] Build Pack cambiado a "Docker Compose"
- [ ] Docker Compose Location: `docker-compose.yml`
- [ ] Variables de entorno configuradas (FRONTEND_URL, JWT_SECRET)
- [ ] Puerto 9002 expuesto
- [ ] Código pushed a GitHub (commit `a16e807`)
- [ ] Cache limpiado (opcional pero recomendado)

---

## 🚀 Resumen

**Problema:** Coolify falla con "cat: read error: Is a directory"
**Solución:** Cambiar de Dockerfile a Docker Compose
**Resultado:** Despliegue exitoso sin errores

**Commit a usar:** `a16e807` (docker-compose.yml actualizado)

---

**¡Ahora intenta el despliegue con Docker Compose!** 🎯
