# 📘 Guía Completa: Despliegue Separado en Coolify

Esta es la forma **MÁS CONFIABLE** de desplegar en Coolify cuando hay problemas con Docker Compose.

---

## 🎯 Estrategia

Desplegar Backend y Frontend como **dos aplicaciones independientes**:

1. **App 1**: `aly-gestion-backend` (Express + Prisma)
2. **App 2**: `aly-gestion-frontend` (Next.js)

Ambas apps se comunicarán a través de la red interna de Docker de Coolify.

---

## Parte 1: Desplegar Backend

### Paso 1.1: Crear Aplicación Backend

1. **En Coolify** → **+ Add Resource** → **Application**

2. **Configuración básica:**
   - **Name**: `aly-gestion-backend`
   - **Source**: GitHub
   - **Repository**: `ahmedelfakirben/studio`
   - **Branch**: `main`

3. **Build Configuration:**
   - **Build Pack**: `Dockerfile`
   - **Dockerfile Location**: `Dockerfile.backend`
   - **Base Directory**: `/` (o dejar vacío)

4. **Port Configuration:**
   - **Port Exposes**: `3001`

### Paso 1.2: Configurar Variables de Entorno (Backend)

En **Environment Variables**, agregar:

```bash
NODE_ENV=production
PORT=3001
JWT_SECRET=622fa71351110f18a8e8226dd1a75c40c9f29a4f6ea6939b1040e4ca0ff4305c
JWT_EXPIRES_IN=7d
DATABASE_URL=file:/app/data/prod.db
FRONTEND_URL=https://tu-dominio-frontend.com
```

⚠️ **IMPORTANTE**: Reemplaza `tu-dominio-frontend.com` con el dominio real que asignarás al frontend.

### Paso 1.3: Configurar Volumen Persistente (Backend)

**MUY IMPORTANTE** para no perder la base de datos:

1. En Coolify → **Storages** → **Add Volume**
2. **Name**: `backend-database`
3. **Mount Path**: `/app/data`
4. **Save**

### Paso 1.4: Deploy Backend

1. Click en **Deploy**
2. Espera a que el build complete (~3-5 minutos)
3. Verifica logs: Deberías ver:
   ```
   ✅ Prisma migrations deployed
   ✅ Database seeded
   🌐 Server listening on port 3001
   ```

### Paso 1.5: Probar Backend

Una vez desplegado, Coolify te dará una URL. Prueba:

```bash
curl https://tu-backend-url.com/api/health
# Debería responder con status 200
```

---

## Parte 2: Desplegar Frontend

### Paso 2.1: Crear Aplicación Frontend

1. **En Coolify** → **+ Add Resource** → **Application**

2. **Configuración básica:**
   - **Name**: `aly-gestion-frontend`
   - **Source**: GitHub
   - **Repository**: `ahmedelfakirben/studio`
   - **Branch**: `main`

3. **Build Configuration:**
   - **Build Pack**: `Dockerfile`
   - **Dockerfile Location**: `Dockerfile.frontend`
   - **Base Directory**: `/` (o dejar vacío)

4. **Port Configuration:**
   - **Port Exposes**: `3000`

### Paso 2.2: Configurar Variables de Entorno (Frontend)

En **Environment Variables**, agregar:

```bash
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=/api
BACKEND_URL=http://aly-gestion-backend:3001
```

⚠️ **IMPORTANTE**:
- `BACKEND_URL` usa el nombre interno del contenedor backend
- Coolify automáticamente resuelve `aly-gestion-backend` en la red Docker

### Paso 2.3: Deploy Frontend

1. Click en **Deploy**
2. Espera a que el build complete (~5-7 minutos primera vez)
3. Verifica logs: Deberías ver:
   ```
   ✓ Compiled successfully
   ✓ Ready on http://localhost:3000
   ```

### Paso 2.4: Configurar Dominio (Frontend)

1. En Coolify → **Domains**
2. Agrega tu dominio o usa el subdominio de Coolify
3. Configura SSL (Let's Encrypt automático en Coolify)

### Paso 2.5: Actualizar FRONTEND_URL en Backend

**IMPORTANTE**: Vuelve a la aplicación backend:

1. **Environment Variables** → Edita `FRONTEND_URL`
2. Cambia a la URL real del frontend: `https://tu-dominio-real.com`
3. **Restart** la aplicación backend

---

## Parte 3: Verificación Post-Despliegue

### 3.1: Verificar Comunicación Backend-Frontend

Abre el frontend en el navegador:
1. Ve a `https://tu-dominio-frontend.com/login`
2. Intenta hacer login
3. Verifica que las llamadas API funcionan

### 3.2: Verificar Logs

**Backend:**
- Deberías ver logs de peticiones API
- No deberían haber errores de CORS

**Frontend:**
- Debería cargar sin errores
- Las peticiones a `/api/*` se reescriben al backend

### 3.3: Verificar Base de Datos

SSH al servidor y verifica:

```bash
ssh root@49.13.153.105

# Ver volumen de la BD
docker volume ls | grep backend-database

# Inspeccionar contenedor backend
docker ps | grep backend

# Ver logs del backend
docker logs <backend-container-id>
```

---

## 🔧 Troubleshooting

### Problema: Frontend no se conecta al Backend

**Solución:**
- Verifica que `BACKEND_URL=http://aly-gestion-backend:3001`
- Asegúrate de que ambas apps están en el mismo **Project** en Coolify
- Verifica en logs del frontend si hay errores de conexión

### Problema: CORS Errors

**Solución:**
- Verifica que `FRONTEND_URL` en el backend sea correcto
- Debe incluir `https://` y el dominio exacto
- Reinicia el backend después de cambiar

### Problema: Base de Datos se pierde al redeploy

**Solución:**
- Asegúrate de que el volumen `/app/data` esté configurado
- En Coolify → Storages → Verifica que el mount path sea exacto

### Problema: Healthcheck falla

**Backend:**
- Verifica que `/api/health` endpoint exista
- Aumenta `start-period` si tarda en arrancar

**Frontend:**
- Aumenta `start-period` a 60s si el build de Next.js es lento

---

## 📊 Comparación con Despliegue Monolítico

| Aspecto | Monolítico (Docker Compose) | Separado (2 Apps) |
|---------|----------------------------|-------------------|
| **Complejidad setup** | Simple (1 app) | Moderado (2 apps) |
| **Compatibilidad Coolify** | ⚠️ Problemas | ✅ Excelente |
| **Debugging** | Difícil (logs mezclados) | ✅ Fácil (logs separados) |
| **Escalabilidad** | Limitado | ✅ Independiente |
| **Recomendado para** | Desarrollo local | ✅ **Producción** |

---

## ✅ Checklist Final

Antes de marcar como completo:

- [ ] Backend desplegado y respondiendo en `/api/health`
- [ ] Frontend desplegado y cargando
- [ ] Volumen persistente configurado para BD
- [ ] FRONTEND_URL actualizado en backend
- [ ] BACKEND_URL correcto en frontend
- [ ] SSL configurado (HTTPS)
- [ ] Login funciona correctamente
- [ ] No hay errores de CORS
- [ ] Base de datos persiste después de restart

---

## 🎉 Resultado Final

- **Backend**: https://backend.tu-dominio.com/api/
- **Frontend**: https://tu-dominio.com
- **Base de Datos**: Persistente en volumen Docker
- **Logs**: Separados y fáciles de debuggear
- **Healthchecks**: Funcionando correctamente

**Esta es la configuración recomendada para producción en Coolify.**
