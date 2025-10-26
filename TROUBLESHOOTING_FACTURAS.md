# 🔧 Troubleshooting - Módulo de Facturas

## Pasos para Diagnosticar el Problema

### 1. Verificar que el Backend está Corriendo
```bash
cd backend
npm run dev
```

Deberías ver:
```
Servidor corriendo en http://localhost:3001
```

### 2. Verificar la Base de Datos
```bash
cd backend
npx prisma studio
```

Esto abrirá una interfaz web para ver los datos. Verifica que:
- ✅ Existen clientes en la tabla `Cliente`
- ✅ La tabla `Factura` está vacía (o tiene datos de prueba)
- ✅ La tabla `LineaDetalle` está lista

### 3. Probar el Endpoint Directamente

Abre Postman o usa curl para probar:

```bash
# Obtener token (login)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@alygestion.com","password":"admin123"}'

# Usar el token recibido
TOKEN="tu_token_aqui"

# Listar clientes
curl -X GET http://localhost:3001/api/clientes \
  -H "Authorization: Bearer $TOKEN"

# Crear factura de prueba
curl -X POST http://localhost:3001/api/facturas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "numero": "FAC-TEST-001",
    "fecha": "2024-01-15",
    "referenciaProyecto": "PROJ-001",
    "clienteId": "ID_DE_UN_CLIENTE_EXISTENTE",
    "lineasDetalle": [
      {
        "numeroPrix": "001",
        "designacion": "Trabajo de prueba",
        "unidad": "U",
        "cantidad": 1,
        "precioUnitario": 100,
        "montoHT": 100
      }
    ],
    "montoHT": 100,
    "montTVA": 20,
    "montoTTC": 120
  }'
```

### 4. Verificar Logs del Backend

Cuando intentes crear una factura desde el frontend, mira la consola del backend. Deberías ver:

```
📥 Datos recibidos para crear factura: { ... }
✅ Cliente encontrado: Nombre del Cliente
✅ Factura creada exitosamente: FAC-TEST-001
```

Si ves errores, serán mostrados aquí con detalles.

### 5. Verificar Logs del Frontend

Abre las DevTools del navegador (F12) → Consola

Cuando intentes crear una factura, deberías ver:

```
📤 Enviando datos de factura: { ... }
✅ Respuesta del servidor: { ... }
```

Si hay error:
```
❌ Error completo: ...
❌ Error response: ...
```

## Errores Comunes y Soluciones

### Error: "Cliente no encontrado"
**Causa**: El `clienteId` no existe en la base de datos  
**Solución**: 
1. Verifica que existan clientes: `http://localhost:9002/clients`
2. Crea al menos un cliente antes de crear una factura

### Error: "Debe incluir al menos una línea de detalle"
**Causa**: El array `lineasDetalle` está vacío  
**Solución**: Agrega al menos un item usando el botón "Agregar Línea"

### Error: "Token no válido" o "401 Unauthorized"
**Causa**: No estás autenticado o el token expiró  
**Solución**: 
1. Cierra sesión y vuelve a iniciar sesión
2. Verifica que `localStorage` tiene el token: 
   - DevTools → Application → Local Storage → `token`

### Error: "Cannot read property of undefined"
**Causa**: Algún campo requerido no se está enviando  
**Solución**: Revisa los logs del backend para ver qué campo falta

### Error: Network Error o CORS
**Causa**: El backend no está corriendo o hay problema de CORS  
**Solución**:
1. Verifica que el backend esté en `http://localhost:3001`
2. Verifica `next.config.ts` tiene el rewrite correcto
3. Reinicia ambos servidores (frontend y backend)

## Checklist de Depuración

- [ ] Backend corriendo en puerto 3001
- [ ] Frontend corriendo en puerto 9002  
- [ ] Base de datos tiene al menos 1 cliente
- [ ] Puedes ver la lista de clientes en `/clients`
- [ ] Estás logueado (token en localStorage)
- [ ] Has agregado al menos 1 línea de detalle
- [ ] Los totales se calculan correctamente
- [ ] La consola del navegador no muestra errores
- [ ] La consola del backend no muestra errores

## Si Todo Falla

1. **Reinicia todo desde cero**:
```bash
# Terminal 1 - Backend
cd backend
rm -rf node_modules
rm dev.db
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev

# Terminal 2 - Frontend  
rm -rf node_modules .next
npm install
npm run dev
```

2. **Verifica las versiones**:
- Node.js: v18 o superior
- npm: v9 o superior

3. **Comparte el error exacto**:
- Copia el error completo de la consola del navegador
- Copia el error completo de la consola del backend
- Toma screenshot del formulario antes de enviar

---

## 💡 Pregunta para Diagnosticar

**¿Qué ves exactamente cuando intentas crear una factura?**

1. ¿Se muestra algún toast de error?
2. ¿Qué dice la consola del navegador (F12)?
3. ¿Qué dice la consola del backend?
4. ¿El botón "Créer la Facture" se queda en loading?
5. ¿Puedes completar y enviar el formulario de clientes sin problemas?

Comparte esta información y podré ayudarte mejor. 🎯
