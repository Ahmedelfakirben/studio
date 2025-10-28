# ⚡ Guía Rápida de Despliegue - ALY Gestion en Coolify

## 🎯 Resumen: 1 Contenedor con TODO incluido

Tu proyecto se despliega como **UNA SOLA IMAGEN** que incluye Frontend + Backend + SQLite.

---

## 📋 Pasos Rápidos (15 minutos)

### 1️⃣ Subir Código a Git

```bash
cd C:\Users\Admin\Desktop\studio
git add .
git commit -m "Ready for Coolify deployment"
git push origin main
```

---

### 2️⃣ Crear App en Coolify

1. Panel de Coolify → **"+ New"** → **"Resource"**
2. Selecciona **"Git Repository"**
3. Conecta tu repositorio

**Configuración:**
```
Name: aly-gestion
Branch: main
Build Pack: Dockerfile
Port: 9002
```

---

### 3️⃣ Configurar Variables de Entorno

Copia y pega en Coolify → **"Environment Variables"**:

```bash
NODE_ENV=production
PORT=3001
FRONTEND_PORT=9002
DATABASE_URL=file:/app/backend/prisma/dev.db
JWT_SECRET=622fa71351110f18a8e8226dd1a75c40c9f29a4f6ea6939b1040e4ca0ff4305c
NEXT_PUBLIC_API_URL=https://TU-DOMINIO-AQUI.com/api
```

⚠️ **IMPORTANTE**: Reemplaza `TU-DOMINIO-AQUI.com` con tu dominio real.

**Ejemplos:**
- `https://aly-sas.elfakir.com/api` (tu dominio actual)
- `https://aly-gestion.coolify.io/api` (dominio de Coolify)

---

### 4️⃣ Configurar Volumen (Persistencia de DB)

En Coolify → **"Volumes"** → **"Add Volume"**:

```
Source Path: /var/lib/coolify/storage/aly-gestion/db
Destination Path: /app/backend/prisma
```

---

### 5️⃣ Desplegar

Click en **"Deploy"**

Espera 5-10 minutos (primera vez)

---

### 6️⃣ Verificar

Accede a: `https://tu-dominio.com`

**Login:**
```
Email: admin@alygestion.com
Password: admin123
```

---

## ✅ Checklist Rápido

- [ ] Código en Git
- [ ] App creada en Coolify
- [ ] Variables de entorno configuradas
- [ ] `NEXT_PUBLIC_API_URL` con dominio real
- [ ] Volumen configurado
- [ ] Puerto 9002 expuesto
- [ ] Deploy iniciado

---

## 🐛 Si algo falla

### Error: "Cannot connect to API"
→ Verifica `NEXT_PUBLIC_API_URL` en variables de entorno

### Error: "Database not found"
→ Verifica que el volumen esté configurado

### Error: "500 en Location Matériel"
→ Ya está arreglado, haz `git push` y redeploy

### Error: "Botón Frais d'Essence no funciona"
→ Ya está arreglado, limpia caché del navegador (Ctrl+Shift+R)

---

## 📊 Qué Incluye el Contenedor

```
✅ Frontend (Next.js) - Puerto 9002 (público)
✅ Backend (Express) - Puerto 3001 (interno)
✅ Base de datos SQLite (persistente con volumen)
✅ Auto-inicialización (migraciones + seed)
```

---

## 🔄 Actualizar Después

```bash
# Hacer cambios en el código
git add .
git commit -m "Descripción"
git push

# En Coolify: Click "Redeploy"
```

---

## 📚 Documentación Completa

Para más detalles, consulta:
- `GUIA_DESPLIEGUE_COOLIFY.md` - Guía completa paso a paso
- `ARQUITECTURA_DESPLIEGUE.md` - Diagramas y explicaciones técnicas
- `COOLIFY_VARIABLES_ENV.txt` - Variables listas para copiar

---

**¡Listo para desplegar!** 🚀
