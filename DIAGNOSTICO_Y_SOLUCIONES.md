# 🔧 DIAGNÓSTICO Y SOLUCIONES - Proyecto ALY Gestion

## ❌ PROBLEMAS ENCONTRADOS

### 1. **RUTAS DEL BACKEND MAL CONFIGURADAS** ⚠️ CRÍTICO

**Ubicación**: `backend/src/index.ts`

**Problema**: Las rutas de ACHAT no coinciden con las que usa el frontend

**Actual (INCORRECTO)**:
```typescript
app.use('/api/facturas-achat', facturasAchatRoutes);
app.use('/api/bons-reception', bonsReceptionRoutes);
app.use('/api/prefacturas-achat', prefacturasAchatRoutes);
```

**Debe ser (CORRECTO)**:
```typescript
app.use('/api/achats/facturas', facturasAchatRoutes);
app.use('/api/achats/bons-reception', bonsReceptionRoutes);
app.use('/api/achats/prefacturas', prefacturasAchatRoutes);
```

**Frontend espera**: `/api/achats/facturas`, `/api/achats/prefacturas`, `/api/achats/bons-reception`

---

### 2. **FALTA SERVICIO API PARA ACHATS EN EL FRONTEND**

**Ubicación**: `src/lib/api.ts`

**Problema**: No existen servicios para las rutas de ACHAT

**Faltan**:
```typescript
// Servicios de facturas de compra
export const facturasAchatService = {
  getAll: () => api.get('/achats/facturas'),
  getById: (id: string) => api.get(`/achats/facturas/${id}`),
  create: (data: any) => api.post('/achats/facturas', data),
  update: (id: string, data: any) => api.put(`/achats/facturas/${id}`, data),
  delete: (id: string) => api.delete(`/achats/facturas/${id}`),
};

// Servicios de prefacturas de compra
export const prefacturasAchatService = {
  getAll: () => api.get('/achats/prefacturas'),
  getById: (id: string) => api.get(`/achats/prefacturas/${id}`),
  create: (data: any) => api.post('/achats/prefacturas', data),
  update: (id: string, data: any) => api.put(`/achats/prefacturas/${id}`, data),
  delete: (id: string) => api.delete(`/achats/prefacturas/${id}`),
};

// Servicios de bons de réception
export const bonsReceptionService = {
  getAll: () => api.get('/achats/bons-reception'),
  getById: (id: string) => api.get(`/achats/bons-reception/${id}`),
  create: (data: any) => api.post('/achats/bons-reception', data),
  update: (id: string, data: any) => api.put(`/achats/bons-reception/${id}`, data),
  delete: (id: string) => api.delete(`/achats/bons-reception/${id}`),
};
```

---

### 3. **POSIBLE PROBLEMA CON CLIENTES**

**Causas posibles**:

#### A) Backend no está corriendo
```bash
cd backend
npm run dev
```
Debe mostrar: `Servidor corriendo en http://localhost:3001`

#### B) Base de datos no inicializada
```bash
cd backend
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

#### C) Error de autenticación
- Token expirado o inválido
- No estás logueado
- Verifica en DevTools → Application → Local Storage → `token`

#### D) CORS o rewrite mal configurado
Verifica `next.config.ts`:
```typescript
async rewrites() {
  return [
    { source: '/api/:path*', destination: 'http://localhost:3001/api/:path*' },
  ];
}
```

---

## ✅ SOLUCIONES PASO A PASO

### PASO 1: Arreglar rutas del backend

Edita `backend/src/index.ts` y cambia:

```typescript
// ❌ ANTES (INCORRECTO)
app.use('/api/facturas-achat', facturasAchatRoutes);
app.use('/api/bons-reception', bonsReceptionRoutes);
app.use('/api/prefacturas-achat', prefacturasAchatRoutes);

// ✅ DESPUÉS (CORRECTO)
app.use('/api/achats/facturas', facturasAchatRoutes);
app.use('/api/achats/bons-reception', bonsReceptionRoutes);
app.use('/api/achats/prefacturas', prefacturasAchatRoutes);
```

### PASO 2: Agregar servicios de ACHAT al frontend

Edita `src/lib/api.ts` y agrega al final:

```typescript
// Servicios de facturas de compra (ACHAT)
export const facturasAchatService = {
  getAll: () => api.get('/achats/facturas'),
  getById: (id: string) => api.get(`/achats/facturas/${id}`),
  create: (data: any) => api.post('/achats/facturas', data),
  update: (id: string, data: any) => api.put(`/achats/facturas/${id}`, data),
  delete: (id: string) => api.delete(`/achats/facturas/${id}`),
};

// Servicios de prefacturas de compra (ACHAT)
export const prefacturasAchatService = {
  getAll: () => api.get('/achats/prefacturas'),
  getById: (id: string) => api.get(`/achats/prefacturas/${id}`),
  create: (data: any) => api.post('/achats/prefacturas', data),
  update: (id: string, data: any) => api.put(`/achats/prefacturas/${id}`, data),
  delete: (id: string) => api.delete(`/achats/prefacturas/${id}`),
};

// Servicios de bons de réception (ACHAT)
export const bonsReceptionService = {
  getAll: () => api.get('/achats/bons-reception'),
  getById: (id: string) => api.get(`/achats/bons-reception/${id}`),
  create: (data: any) => api.post('/achats/bons-reception', data),
  update: (id: string, data: any) => api.put(`/achats/bons-reception/${id}`, data),
  delete: (id: string) => api.delete(`/achats/bons-reception/${id}`),
};
```

### PASO 3: Reiniciar ambos servidores

```bash
# Terminal 1 - Backend
cd backend
# Ctrl+C para detener
npm run dev

# Terminal 2 - Frontend
# Ctrl+C para detener  
npm run dev
```

### PASO 4: Verificar que Clientes funciona

1. Abre `http://localhost:9002/clients`
2. Abre DevTools (F12) → Console
3. ¿Ves algún error?
   - Si ves error 401: Problema de autenticación → Ve al PASO 5
   - Si ves error 404: Rutas mal configuradas → Verifica PASO 1
   - Si ves error de red: Backend no está corriendo → Verifica PASO 3

### PASO 5: Si el problema es autenticación

```bash
# En el navegador:
# 1. Ve a /login
# 2. Ingresa:
#    Email: admin@alygestion.com
#    Password: admin123
# 3. Intenta acceder a /clients nuevamente
```

---

## 🧪 PRUEBAS PARA IDENTIFICAR EL PROBLEMA

### Test 1: Backend está corriendo
```bash
curl http://localhost:3001
```
Debe responder: `{"message":"API de ALY Gestion funcionando correctamente"}`

### Test 2: Endpoint de clientes funciona
```bash
# Primero obtén el token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@alygestion.com","password":"admin123"}'

# Usa el token en el siguiente comando
curl -X GET http://localhost:3001/api/clientes \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### Test 3: Frontend puede hacer la petición
1. Abre `http://localhost:9002/clients`
2. Abre DevTools (F12) → Network tab
3. Recarga la página
4. Busca la petición a `/api/clientes`
5. ¿Qué status code devuelve?
   - 200: ✅ Funciona
   - 401: ❌ Problema de autenticación
   - 404: ❌ Ruta no encontrada
   - 500: ❌ Error en el servidor

---

## 📋 CHECKLIST COMPLETO

Marca cada item cuando lo completes:

**Backend**:
- [ ] Backend corriendo en puerto 3001
- [ ] Rutas de ACHAT corregidas en `index.ts`
- [ ] Base de datos migrada (`npx prisma migrate dev`)
- [ ] Datos seed cargados (`npx prisma db seed`)
- [ ] Al menos 1 cliente en la BD

**Frontend**:
- [ ] Frontend corriendo en puerto 9002
- [ ] Servicios de ACHAT agregados a `api.ts`
- [ ] Estás logueado (token en localStorage)
- [ ] No hay errores en la consola del navegador

**Pruebas**:
- [ ] `/clients` carga sin errores
- [ ] Puedes ver la lista de clientes
- [ ] Puedes crear un nuevo cliente
- [ ] `/factures` carga sin errores
- [ ] `/prefactures` carga sin errores
- [ ] `/bons-de-livraison` carga sin errores

---

## 🆘 SI NADA FUNCIONA

**Resetea completamente el proyecto**:

```bash
# Backend
cd backend
rm -rf node_modules
rm dev.db
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev

# Frontend (otra terminal)
rm -rf node_modules .next
npm install
npm run dev
```

---

## 📞 INFORMACIÓN PARA AYUDARTE MEJOR

Por favor comparte:

1. **¿Qué error exacto ves?** (screenshot o texto del error)
2. **¿En qué página ocurre?** (/clients, /factures, etc.)
3. **¿Qué dice la consola del navegador?** (F12 → Console)
4. **¿Qué dice la consola del backend?** (terminal donde corre npm run dev)
5. **¿El backend está corriendo?** (sí/no)
6. **¿Estás logueado?** (sí/no)

Con esta información puedo ayudarte específicamente. 🎯
