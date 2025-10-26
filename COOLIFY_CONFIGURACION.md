# 🎯 Configuración Completa en Coolify - ALY Gestion

**Última actualización:** 2025-10-26

---

## 📌 Índice

1. [Variables de Entorno](#1-variables-de-entorno)
2. [Configuración de Puertos](#2-configuración-de-puertos)
3. [Volúmenes Persistentes](#3-volúmenes-persistentes)
4. [Redeploy Final](#4-redeploy-final)
5. [Verificación Post-Deploy](#5-verificación-post-deploy)

---

## 1. Variables de Entorno

### 📍 Ubicación en Coolify

```
Dashboard → Tu Aplicación (aly-gestion) → Pestaña "Environment Variables"
```

### ➕ Agregar Variables

Haz click en **"+ Add"** o **"Add New Variable"** para cada una de estas variables:

---

### 🔑 Variables OBLIGATORIAS

Copia y pega estas variables una por una en Coolify:

#### Variable 1: NODE_ENV
```
Key (Nombre):  NODE_ENV
Value (Valor): production
```

#### Variable 2: PORT (Backend)
```
Key:   PORT
Value: 3001
```

#### Variable 3: FRONTEND_PORT
```
Key:   FRONTEND_PORT
Value: 9002
```

#### Variable 4: DATABASE_URL
```
Key:   DATABASE_URL
Value: file:/app/backend/data/prod.db
```

⚠️ **IMPORTANTE:** NO uses comillas en el valor. Debe ser exactamente:
```
file:/app/backend/data/prod.db
```

#### Variable 5: JWT_SECRET (¡MUY IMPORTANTE!)
```
Key:   JWT_SECRET
Value: 622fa71351110f18a8e8226dd1a75c40c9f29a4f6ea6939b1040e4ca0ff4305c
```

⚠️ **CRÍTICO:** Este es tu secreto único generado. Guárdalo en un lugar seguro.

#### Variable 6: JWT_EXPIRES_IN
```
Key:   JWT_EXPIRES_IN
Value: 7d
```

#### Variable 7: FRONTEND_URL
```
Key:   FRONTEND_URL
Value: https://aly-sas.elfakir.com
```

⚠️ **Cambia** `aly-sas.elfakir.com` por tu dominio real en Coolify.

---

### 📸 Ejemplo Visual

Tu lista de variables debería verse así:

```
┌────────────────────┬──────────────────────────────────────────────────────┐
│ Key                │ Value                                                │
├────────────────────┼──────────────────────────────────────────────────────┤
│ NODE_ENV           │ production                                           │
│ PORT               │ 3001                                                 │
│ FRONTEND_PORT      │ 9002                                                 │
│ DATABASE_URL       │ file:/app/backend/data/prod.db                      │
│ JWT_SECRET         │ 622fa71351110f18a8e8226dd1a75c40...                 │
│ JWT_EXPIRES_IN     │ 7d                                                   │
│ FRONTEND_URL       │ https://aly-sas.elfakir.com                         │
└────────────────────┴──────────────────────────────────────────────────────┘
```

---

### 💾 Guardar Variables

1. Después de agregar todas las variables, haz click en **"Save"** o **"Update"**
2. NO hagas redeploy todavía (falta configurar los puertos)

---

## 2. Configuración de Puertos

### 📍 Ubicación en Coolify

```
Dashboard → Tu Aplicación (aly-gestion) → Pestaña "Ports" o "Network"
```

### 🔌 Configuración Correcta

Tu aplicación tiene DOS puertos internos pero solo uno debe estar expuesto:

#### Puerto Principal (EXPUESTO)

```
┌─────────────────────┬──────────────────────────────────┐
│ Campo               │ Valor                            │
├─────────────────────┼──────────────────────────────────┤
│ Container Port      │ 9002                             │
│ Protocol            │ HTTP                             │
│ Public              │ ✅ Sí / Enabled                  │
│ Domain              │ aly-sas.elfakir.com              │
└─────────────────────┴──────────────────────────────────┘
```

**Explicación:**
- Puerto **9002** es el frontend (Next.js)
- Debe estar **público** porque es el que los usuarios acceden
- Este es el puerto que se mapea a tu dominio

#### Puerto Interno (NO EXPUESTO)

```
┌─────────────────────┬──────────────────────────────────┐
│ Campo               │ Valor                            │
├─────────────────────┼──────────────────────────────────┤
│ Container Port      │ 3001                             │
│ Protocol            │ HTTP                             │
│ Public              │ ❌ No / Disabled                 │
└─────────────────────┴──────────────────────────────────┘
```

**Explicación:**
- Puerto **3001** es el backend (Express API)
- NO debe estar público (solo comunicación interna)
- El frontend se comunica con él internamente

---

### 📸 Ejemplo Visual de Configuración de Puertos

```
Application Ports:
┌─────────────────────────────────────────────────────────────┐
│ Port: 9002 (Frontend)                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Container Port: 9002                                    │ │
│ │ Public: ✅ Yes                                          │ │
│ │ Domain: aly-sas.elfakir.com                            │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Port: 3001 (Backend) - OPCIONAL (solo si Coolify lo pide)  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Container Port: 3001                                    │ │
│ │ Public: ❌ No                                           │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

### ⚙️ Configuración Alternativa (Si Coolify usa formato diferente)

Algunos dashboards de Coolify muestran:

```
Exposed Port: 9002
Target Port:  9002
```

En este caso, usa:
- **Exposed Port (Externo):** 9002
- **Target Port (Interno):** 9002

---

## 3. Volúmenes Persistentes

### 📍 Ubicación en Coolify

```
Dashboard → Tu Aplicación (aly-gestion) → Pestaña "Volumes" o "Storage"
```

### 💾 Agregar Volumen para Base de Datos

**IMPORTANTE:** Si no tienes un volumen configurado, la base de datos se borrará en cada redeploy.

#### Configuración del Volumen

```
┌─────────────────────┬──────────────────────────────────┐
│ Campo               │ Valor                            │
├─────────────────────┼──────────────────────────────────┤
│ Name                │ database-data                    │
│ Mount Path          │ /app/backend/data                │
│ Type                │ Persistent Volume                │
└─────────────────────┴──────────────────────────────────┘
```

**Explicación:**
- Esto hace que la base de datos SQLite persista entre deploys
- Los datos NO se perderán al hacer redeploy

---

## 4. Redeploy Final

Ahora que TODO está configurado:

### 📋 Checklist Pre-Deploy

Verifica que tengas:

- [x] 7 variables de entorno configuradas
- [x] Puerto 9002 expuesto públicamente
- [x] Volumen para `/app/backend/data` (opcional pero recomendado)
- [x] Código pushed a GitHub (ya lo hicimos)

### 🚀 Hacer Redeploy

1. En Coolify, ve a tu aplicación
2. Click en **"Redeploy"** o **"Deploy"**
3. Espera 5-10 minutos (puede tardar en compilar)

---

## 5. Verificación Post-Deploy

### ✅ Paso 1: Ver Logs

Durante el deploy, deberías ver:

```
🚀 Starting ALY Gestion Application...
📦 Initializing Backend...
🔄 Running Prisma migrations...
Migration applied successfully
🔧 Generating Prisma Client...
✔ Generated Prisma Client

🌱 Checking if database needs seeding...
🌱 Seeding database with initial data...
Iniciando la carga de datos iniciales...
Usuario administrador creado: admin@alygestion.com
2 clientes de ejemplo creados
2 proveedores de ejemplo creados
Carga de datos iniciales completada con éxito

🌐 Starting Backend on port 3001...
🎨 Starting Frontend...
⏳ Waiting for backend to be ready...
🌐 Starting Frontend on port 9002...
✅ Application started successfully!
   - Backend running at http://localhost:3001
   - Frontend running at http://localhost:9002
```

### ✅ Paso 2: Probar la Aplicación

1. Abre tu navegador
2. Ve a: `https://aly-sas.elfakir.com` (o tu dominio)
3. Deberías ver la página de login

### ✅ Paso 3: Iniciar Sesión

```
Email:    admin@alygestion.com
Password: admin123
```

Si funciona, ¡éxito! 🎉

---

## 🐛 Solución de Problemas

### Error: "ECONNREFUSED ::1:3001"

**Causa:** Variables de entorno no configuradas o puerto incorrecto

**Solución:**
1. Verifica que TODAS las 7 variables estén configuradas
2. Verifica que `PORT=3001` y `FRONTEND_PORT=9002`
3. Redeploy

### Error: "Connection refused" en logs del backend

**Causa:** Base de datos no se puede crear

**Solución:**
1. Verifica que `DATABASE_URL=file:/app/backend/data/prod.db` (sin comillas)
2. Verifica que el volumen esté montado en `/app/backend/data`
3. Redeploy

### Error: "JWT must be provided"

**Causa:** JWT_SECRET no configurado

**Solución:**
1. Agrega la variable `JWT_SECRET` con el valor generado arriba
2. Redeploy

### El login no funciona después del deploy

**Causa 1:** Seed no se ejecutó

**Solución:** Accede al terminal de Coolify y ejecuta:
```bash
cd /app/backend
npm install --no-save ts-node
npm run seed
```

**Causa 2:** Variables de entorno incorrectas

**Solución:** Revisa que todas las variables estén correctamente escritas (sin espacios extra)

---

## 📞 Comandos Útiles en Terminal de Coolify

Si necesitas diagnosticar:

```bash
# Ver variables de entorno
env | grep -E "(NODE|PORT|DATABASE|JWT)"

# Ver estructura de archivos
ls -la /app/backend/dist/
ls -la /app/frontend/.next/standalone/

# Ver base de datos
cd /app/backend
npx prisma studio --browser none

# Crear usuario admin manualmente
cd /app/backend
npm install --no-save ts-node
npm run seed

# Ver logs del backend
cd /app/backend
tail -f logs/*.log

# Test de conexión interna
curl http://localhost:3001/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@alygestion.com","password":"admin123"}'
```

---

## 📝 Resumen de Valores Importantes

### Tu JWT_SECRET único:
```
622fa71351110f18a8e8226dd1a75c40c9f29a4f6ea6939b1040e4ca0ff4305c
```

### Credenciales de Admin:
```
Email:    admin@alygestion.com
Password: admin123
```

### Puerto Principal:
```
9002 (Frontend Next.js)
```

### URL de Acceso:
```
https://aly-sas.elfakir.com
```

---

## ✅ Checklist Final

Una vez configurado todo:

- [ ] 7 variables de entorno agregadas en Coolify
- [ ] JWT_SECRET copiado y guardado de forma segura
- [ ] Puerto 9002 expuesto públicamente con tu dominio
- [ ] Volumen persistente configurado (opcional)
- [ ] Redeploy ejecutado
- [ ] Logs muestran "✅ Application started successfully!"
- [ ] Puedes acceder a tu dominio
- [ ] Login funciona con admin@alygestion.com
- [ ] Dashboard muestra correctamente
- [ ] Modo oscuro/claro funciona en Settings

---

**¡Listo para producción!** 🚀

Si sigues teniendo problemas después de estos pasos, copia los logs completos del deploy y te ayudo a diagnosticar.

---

**Documentado por:** Claude Code
**Fecha:** 2025-10-26
**Versión:** 1.0
