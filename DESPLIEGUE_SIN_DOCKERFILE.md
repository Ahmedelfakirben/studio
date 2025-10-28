# 🚀 Despliegue Simple sin Dockerfile (Nixpacks)

El Dockerfile multi-stage está causando problemas de cache persistentes. La solución más simple es dejar que Coolify detecte automáticamente la estructura del proyecto.

## Paso 1: Configurar en Coolify

1. **Ve a tu aplicación en Coolify**
   - http://49.13.153.105:8000
   - My first project → production → ahmedelfakirben/studio:main

2. **Cambiar Build Pack:**
   - Ve a **Settings → Build**
   - **Build Pack:** Selecciona **"Nixpacks"** (o "Static" si no hay Nixpacks)
   - **Base Directory:** `/` (o déjalo vacío)
   - Guarda cambios

3. **Configurar Variables de Entorno:**
   - Ve a **Environment Variables**
   - Asegúrate de tener:
   ```
   NODE_ENV=production
   FRONTEND_URL=https://tu-dominio.com
   JWT_SECRET=622fa71351110f18a8e8226dd1a75c40c9f29a4f6ea6939b1040e4ca0ff4305c
   DATABASE_URL=file:/app/backend/data/prod.db
   NEXT_PUBLIC_API_URL=/api
   PORT=3001
   FRONTEND_PORT=9002
   ```

4. **Configurar Puertos:**
   - **Port Exposes:** `9002` (frontend)
   - **Port Mappings:**
     - `9002:9002` (frontend)
     - `3001:3001` (backend)

5. **Deploy**

---

## Paso 2: Si Nixpacks no funciona - Usar Node.js Buildpack

Si Coolify no tiene Nixpacks o falla, prueba:

1. **Build Pack:** "Node.js" o "Dockerfile"
2. Pero en lugar de usar nuestro Dockerfile complejo, vamos a crear uno SIMPLE

---

## Opción Alternativa: Dockerfile Ultra-Simplificado

Si prefieres seguir usando Docker, vamos a crear un Dockerfile MUCHO más simple que solo construye Next.js en modo standalone.

Ventajas:
- ✅ Sin multi-stage complejo
- ✅ Sin problemas de cache
- ✅ Next.js maneja todo automáticamente

---

## ¿Qué pasa con el Backend?

Para el backend tenemos dos opciones:

### Opción A: Backend separado
Desplegar backend y frontend como dos aplicaciones separadas en Coolify:
- **App 1:** Frontend (Next.js) en puerto 9002
- **App 2:** Backend (Express) en puerto 3001

### Opción B: Backend dentro de Next.js API Routes
Mover la lógica del backend a Next.js API routes (más trabajo pero más simple de desplegar)

---

## Mi Recomendación 🎯

**Paso 1:** Intenta Nixpacks primero (cambiar Build Pack en Coolify)

**Si falla:**

**Paso 2:** Usa un Dockerfile simplificado que solo maneje Next.js y corra el backend por separado

**¿Cuál prefieres que implemente?**
1. Configuración para Nixpacks (sin Dockerfile)
2. Dockerfile ultra-simple para Next.js + Backend separado
3. Dockerfile ultra-simple que incluya ambos pero sin multi-stage

Dime cuál prefieres y lo implemento ahora mismo.
