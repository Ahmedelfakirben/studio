# 🔴 Solución: Error 500 en Login (Producción)

**Error:** `POST https://aly-sas.elfakir.com/api/auth/login 500 (Internal Server Error)`

**Causa:** Base de datos no inicializada o sin usuario administrador

---

## 🚀 Solución Rápida

### Paso 1: Acceder al Contenedor en Coolify

1. Ve a **Coolify Dashboard**
2. Click en tu aplicación **aly-gestion**
3. Ve a la pestaña **Terminal** o **Logs**

---

### Paso 2: Ejecutar Comandos en el Contenedor

**Opción A - Desde Terminal de Coolify:**

```bash
# Acceder al backend
cd /app/backend

# Aplicar migraciones
npx prisma migrate deploy

# Generar Prisma Client
npx prisma generate

# Ejecutar seed para crear usuario admin
npm run seed
```

**Opción B - Si npm run seed no funciona:**

```bash
cd /app/backend

# Ejecutar seed manualmente
npx ts-node prisma/seed.ts
```

**Opción C - Crear usuario manualmente:**

```bash
cd /app/backend

# Crear usuario admin
node <<EOF
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hashSync('admin123', 10);

  const user = await prisma.usuario.create({
    data: {
      email: 'admin@alygestion.com',
      password: hashedPassword,
      nombre: 'Administrador',
      rol: 'admin'
    }
  });

  console.log('✅ Usuario creado:', user.email);
}

createAdmin()
  .catch(e => {
    console.error('❌ Error:', e.message);
    if (e.code === 'P2002') {
      console.log('ℹ️  El usuario ya existe');
    }
  })
  .finally(() => prisma.\$disconnect());
EOF
```

---

### Paso 3: Reiniciar la Aplicación

En Coolify:
1. Click en **Restart**
2. Espera 30-60 segundos

---

### Paso 4: Probar Login

Navega a: `https://aly-sas.elfakir.com`

**Credenciales:**
- **Email:** `admin@alygestion.com`
- **Password:** `admin123`

---

## 🔍 Verificar que Funcionó

### Check 1: Ver logs del backend

En Coolify → Logs, deberías ver:

```
✅ Application started successfully!
   - Backend running at http://localhost:3001
   - Frontend running at http://localhost:9002
```

### Check 2: Ver estructura de base de datos

```bash
cd /app/backend
npx prisma studio --browser none
```

O verificar tablas:

```bash
cd /app/backend
npx prisma db execute --stdin <<< "SELECT name FROM sqlite_master WHERE type='table';"
```

Deberías ver:
- `Usuario`
- `Cliente`
- `Proveedor`
- `Factura`
- `Prefactura`
- Etc.

---

## 🛠️ Si el Problema Persiste

### Diagnóstico Avanzado

#### 1. Verificar Variables de Entorno

En Coolify → Environment Variables, asegúrate de tener:

```env
NODE_ENV=production
PORT=3001
FRONTEND_PORT=9002
DATABASE_URL=file:/app/backend/data/prod.db
JWT_SECRET=<un-secreto-seguro-aqui>
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://aly-sas.elfakir.com
```

**⚠️ CRÍTICO:** Si `JWT_SECRET` no está configurado, el login fallará.

#### 2. Verificar Logs Detallados del Backend

```bash
# En el contenedor
tail -f /app/backend/logs/*.log

# O ver logs de Node
cd /app/backend
NODE_ENV=production node dist/index.js
```

Busca errores como:
- `PrismaClientInitializationError`
- `JWT must be provided`
- `Table does not exist`

#### 3. Verificar que el Backend Responde

```bash
# Desde el contenedor
curl http://localhost:3001/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@alygestion.com","password":"admin123"}'
```

**Respuesta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@alygestion.com",
    "nombre": "Administrador",
    "rol": "admin"
  }
}
```

**Si falla**, el error estará en los logs del backend.

---

## 🔄 Solución Nuclear: Recrear Base de Datos

**⚠️ ADVERTENCIA:** Esto borrará todos los datos.

```bash
cd /app/backend

# Borrar base de datos existente
rm -f /app/backend/data/prod.db
rm -f /app/backend/data/prod.db-journal

# Recrear desde cero
npx prisma migrate reset --force
npx prisma migrate deploy
npx prisma generate
npm run seed
```

Luego reinicia la aplicación en Coolify.

---

## 📝 Para Despliegues Futuros

### Actualizar docker-entrypoint.sh

El archivo ya está actualizado para ejecutar automáticamente:
1. Crear directorio `/app/backend/data`
2. Ejecutar migraciones (`prisma migrate deploy`)
3. Generar Prisma Client
4. Ejecutar seed si la DB está vacía
5. Iniciar backend y frontend

### Verificar que package.json tenga el script seed

En `backend/package.json`:

```json
{
  "scripts": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

---

## 🎯 Checklist de Verificación Post-Deploy

Después de cada deploy, verifica:

- [ ] Logs muestran "✅ Application started successfully!"
- [ ] Base de datos existe en `/app/backend/data/prod.db`
- [ ] Tabla `Usuario` existe
- [ ] Al menos un usuario admin existe
- [ ] Variables de entorno configuradas (especialmente `JWT_SECRET`)
- [ ] Login funciona desde el navegador
- [ ] API responde en `https://aly-sas.elfakir.com/api/auth/login`

---

## 💡 Tips para Debugging

### 1. Ver todos los usuarios en la base de datos

```bash
cd /app/backend
npx prisma db execute --stdin <<< "SELECT * FROM Usuario;"
```

### 2. Cambiar password de un usuario existente

```bash
cd /app/backend
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function changePassword() {
  const newPassword = await bcrypt.hash('nuevapassword123', 10);
  await prisma.usuario.update({
    where: { email: 'admin@alygestion.com' },
    data: { password: newPassword }
  });
  console.log('✅ Password actualizado');
}

changePassword().finally(() => prisma.\$disconnect());
"
```

### 3. Verificar conexión a base de datos

```bash
cd /app/backend
npx prisma db pull
```

Si no hay errores, la conexión funciona.

---

## 🆘 Contacto de Emergencia

Si nada funciona:

1. **Exporta los logs completos** de Coolify
2. **Verifica la configuración de red** (puertos, DNS)
3. **Revisa firewall** del servidor
4. **Consulta documentación de Coolify**: https://coolify.io/docs

---

## ✅ Resultado Esperado

Después de aplicar la solución:

1. Navegas a `https://aly-sas.elfakir.com`
2. Ves el formulario de login
3. Ingresas:
   - Email: `admin@alygestion.com`
   - Password: `admin123`
4. El login funciona ✅
5. Accedes al dashboard

---

**Documentado:** 2025-10-26
**Versión:** 1.0
