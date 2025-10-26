# 🚀 Instrucciones de Deploy para Coolify

**Última actualización:** 2025-10-26

---

## 📋 Cambios Realizados

### 1. **Dockerfile** ✅
- Corregido: Ahora instala TODAS las dependencias (incluyendo TypeScript) antes de compilar
- Compila el backend correctamente con `tsc`
- Limpia devDependencies después del build para reducir tamaño

### 2. **docker-entrypoint.sh** ✅
- Corregido: Frontend ahora usa `node .next/standalone/server.js` en lugar de `node server.js`
- Instala `ts-node` temporalmente para ejecutar el seed
- Ejecuta automáticamente el seed si la base de datos está vacía

### 3. **Dashboard Conectado** ✅
- El dashboard ahora muestra datos reales de la base de datos
- Todas las estadísticas se calculan desde las APIs

### 4. **Modo Oscuro/Claro** ✅
- Agregado botón de cambio de tema en Configuración (Settings)
- Soporta: Claro, Oscuro y Sistema

---

## 🔧 Pasos para Redeploy en Coolify

### 1. Hacer Push de los Cambios

```bash
git add .
git commit -m "Fix: Corregir Docker entrypoint y standalone build"
git push origin main
```

### 2. En Coolify

1. Ve a tu aplicación **aly-gestion**
2. Click en **Deploy** (o espera el auto-deploy si está configurado)
3. Espera a que termine el build (puede tomar 5-10 minutos)

### 3. Verificar Logs

Durante el deploy, deberías ver en los logs:

```
🚀 Starting ALY Gestion Application...
📦 Initializing Backend...
🔄 Running Prisma migrations...
🔧 Generating Prisma Client...
🌱 Checking if database needs seeding...
```

**Si la base de datos está vacía:**
```
🌱 Seeding database with initial data...
Iniciando la carga de datos iniciales...
Usuario administrador creado: admin@alygestion.com
2 clientes de ejemplo creados
2 proveedores de ejemplo creados
Carga de datos iniciales completada con éxito
```

**Si la base de datos ya tiene datos:**
```
✅ Database already contains data, skipping seed
```

Luego:
```
🌐 Starting Backend on port 3001...
🎨 Starting Frontend...
⏳ Waiting for backend to be ready...
🌐 Starting Frontend on port 9002...
✅ Application started successfully!
   - Backend running at http://localhost:3001
   - Frontend running at http://localhost:9002
```

---

## 🔑 Acceso al Sistema

### Credenciales de Administrador

```
URL: https://aly-sas.elfakir.com
Email: admin@alygestion.com
Password: admin123
```

### ⚠️ IMPORTANTE

**Después del primer login, cambia la contraseña:**

1. Inicia sesión con las credenciales por defecto
2. Ve a **Paramètres** (Configuración)
3. Usa el botón de reset password para cambiar tu contraseña

---

## 🐛 Solución de Problemas

### Error: "ECONNREFUSED ::1:3001"

**Causa:** El backend no se está iniciando correctamente

**Solución:**
1. Revisa los logs de Coolify
2. Verifica que el backend se compiló correctamente (busca `npm run build` en logs)
3. Asegúrate de que el puerto 3001 esté expuesto en Coolify

### Error: "next start does not work with output: standalone"

**Causa:** El entrypoint está intentando usar `next start` en lugar del standalone server

**Solución:**
- ✅ Ya corregido en el nuevo `docker-entrypoint.sh`
- Asegúrate de hacer push del archivo actualizado

### Error 500 en Login

**Causa:** Base de datos vacía o usuario admin no creado

**Solución:**

**Opción A - Automática (preferida):**
1. El seed debería ejecutarse automáticamente
2. Verifica los logs para confirmar

**Opción B - Manual:**
```bash
# Accede al terminal del contenedor en Coolify
cd /app/backend
npm install --no-save ts-node
npm run seed
```

**Opción C - Crear usuario manualmente:**
```bash
cd /app/backend
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

### El Dashboard Muestra Datos Vacíos

**Esto es normal si:**
- Es la primera vez que accedes
- No hay facturas, clientes o gastos creados aún

**Para probar con datos:**
1. Ve a **Clients** y crea algunos clientes
2. Ve a **Factures** y crea algunas facturas
3. Ve a **Frais d'Essence** y registra algunos gastos
4. Regresa al Dashboard para ver las estadísticas

---

## 📦 Variables de Entorno en Coolify

Asegúrate de tener configuradas estas variables:

```env
NODE_ENV=production
PORT=3001
FRONTEND_PORT=9002
DATABASE_URL=file:/app/backend/data/prod.db
JWT_SECRET=tu-secreto-super-seguro-aqui-cambiar-por-uno-real
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://aly-sas.elfakir.com
```

**⚠️ CRÍTICO:** Cambia `JWT_SECRET` por un valor aleatorio seguro de al menos 32 caracteres.

Ejemplo de generación de JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## ✅ Checklist Post-Deploy

Después del deploy, verifica:

- [ ] Logs muestran "✅ Application started successfully!"
- [ ] Backend corriendo en puerto 3001 (interno)
- [ ] Frontend corriendo en puerto 9002 (interno)
- [ ] Puedes acceder a `https://aly-sas.elfakir.com`
- [ ] Login funciona con `admin@alygestion.com` / `admin123`
- [ ] Dashboard muestra correctamente (puede estar vacío si no hay datos)
- [ ] Modo oscuro/claro funciona en Settings
- [ ] Puedes crear clientes, facturas, etc.

---

## 🔄 Comandos Útiles en Coolify Terminal

```bash
# Ver logs del backend
cd /app/backend
ls -la dist/  # Verificar que se compiló

# Ver base de datos
cd /app/backend
npx prisma studio --browser none

# Ver usuarios en la base de datos
cd /app/backend
npx prisma db execute --stdin <<< "SELECT * FROM Usuario;"

# Reiniciar base de datos (⚠️ BORRA TODO)
cd /app/backend
rm -f data/prod.db data/prod.db-journal
npx prisma migrate deploy
npm install --no-save ts-node
npm run seed

# Ver estructura de archivos frontend
cd /app/frontend
ls -la .next/standalone/

# Verificar que el backend responde
curl http://localhost:3001/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@alygestion.com","password":"admin123"}'
```

---

## 📊 Estructura del Proyecto Después del Build

```
/app/
├── backend/
│   ├── dist/               # Backend compilado (TypeScript → JavaScript)
│   │   └── index.js
│   ├── prisma/            # Schema y migrations
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   ├── data/              # Base de datos SQLite (volumen persistente)
│   │   └── prod.db
│   ├── node_modules/      # Solo production dependencies
│   └── package.json
│
├── frontend/
│   ├── .next/
│   │   ├── standalone/    # Build standalone de Next.js
│   │   │   └── server.js  # ← Servidor de Next.js
│   │   └── static/        # Assets estáticos
│   ├── public/            # Archivos públicos
│   └── package.json
│
└── docker-entrypoint.sh   # Script de inicio
```

---

## 🎯 Resultado Esperado Final

Después de seguir estos pasos:

1. ✅ La aplicación se despliega sin errores
2. ✅ El backend se compila correctamente con TypeScript
3. ✅ Las migraciones de Prisma se aplican automáticamente
4. ✅ El usuario admin se crea automáticamente (si es primera vez)
5. ✅ Puedes hacer login en `https://aly-sas.elfakir.com`
6. ✅ El dashboard muestra datos reales de la base de datos
7. ✅ Puedes cambiar entre modo claro/oscuro en Settings
8. ✅ Todas las funcionalidades (Clientes, Facturas, Gastos, etc.) funcionan correctamente

---

## 📞 Si Algo Falla

1. **Exporta los logs completos** de Coolify (botón "Download Logs")
2. **Captura pantalla** del error que ves en el navegador
3. **Verifica** la configuración de variables de entorno
4. **Revisa** que los puertos 3001 y 9002 estén correctamente mapeados

---

**Documentado por:** Claude Code
**Fecha:** 2025-10-26
**Versión:** 2.0
