# 🔍 Diagnóstico: Prefacturas vs Facturas

**Fecha:** 2025-10-28
**Reporte:** Investigación del problema reportado - "Las prefacturas se guardan como facturas"

---

## 📋 Resumen del Problema Reportado

El usuario reporta que al crear una **prefactura** en la sección de ventas, esta se guarda como una **factura** en lugar de prefactura.

---

## 🔎 Investigación Realizada

He revisado todo el flujo de creación de prefacturas, desde el frontend hasta la base de datos:

### ✅ 1. **Frontend - Formulario de Prefacturas**
- **Archivo:** `src/app/prefactures/new/page.tsx`
- **Servicio llamado:** `prefacturasService.create(data)` ✅ CORRECTO
- **Endpoint:** `/api/prefacturas` ✅ CORRECTO

### ✅ 2. **API Service**
- **Archivo:** `src/lib/api.ts`
- **Definición:**
  ```typescript
  export const prefacturasService = {
    create: (data: any) => api.post('/prefacturas', data)
  }
  ```
- **Estado:** ✅ CORRECTO - Llama al endpoint correcto

### ✅ 3. **Backend - Rutas**
- **Archivo:** `backend/src/index.ts` (línea 38)
  ```typescript
  app.use('/api/prefacturas', prefacturasRoutes);
  ```
- **Estado:** ✅ CORRECTO - Ruta configurada correctamente

### ✅ 4. **Backend - Router**
- **Archivo:** `backend/src/routes/prefacturas.routes.ts`
- **POST Route:** `router.post('/', createPrefactura)` ✅ CORRECTO

### ✅ 5. **Backend - Controller**
- **Archivo:** `backend/src/controllers/prefacturas.controller.ts`
- **Modelo utilizado:**
  ```typescript
  const prefactura = await prisma.prefactura.create({ ... })
  ```
- **Estado:** ✅ CORRECTO - Usa el modelo `Prefactura`, NO `Factura`

### ✅ 6. **Base de Datos - Prisma Schema**
- **Archivo:** `backend/prisma/schema.prisma`
- **Modelos separados:**
  - `model Factura { ... }` (línea 58)
  - `model Prefactura { ... }` (línea 74)
- **Estado:** ✅ CORRECTO - Son modelos completamente separados

---

## ✅ Conclusión de la Investigación

**Toda la infraestructura está CORRECTAMENTE configurada:**

1. ✅ El formulario llama al servicio de prefacturas
2. ✅ El servicio llama a `/api/prefacturas`
3. ✅ El backend tiene rutas separadas para facturas y prefacturas
4. ✅ El controller usa `prisma.prefactura.create()` (NO `factura`)
5. ✅ La base de datos tiene tablas separadas

**NO existe código que mezcle facturas con prefacturas.**

---

## 🔧 Solución Implementada: Logging Diagnóstico

Para ayudar a identificar qué está sucediendo realmente, he agregado **logging detallado** en ambos lados:

### 📱 Frontend (`src/app/prefactures/new/page.tsx`)

Ahora muestra en la consola del navegador:

```
🔵 ===== CREACIÓN DE PREFACTURA =====
📤 Endpoint a llamar: /api/prefacturas
📤 Datos de PREFACTURA a enviar: {...}

✅ ===== PREFACTURA CREADA EXITOSAMENTE =====
✅ Tipo de documento creado: PREFACTURA
✅ Respuesta del servidor: {...}
✅ ID creado: xxx-xxx-xxx
✅ Número creado: PRE-XXX
✅ Redirigiendo a: /prefactures
```

### 🖥️ Backend (`backend/src/controllers/prefacturas.controller.ts`)

Ahora muestra en la terminal del servidor:

```
🔵 ===== BACKEND: CREANDO PREFACTURA =====
📥 Endpoint llamado: POST /api/prefacturas
📥 Datos recibidos para crear PREFACTURA: {...}
✅ Cliente encontrado: ...
🔵 Llamando a prisma.prefactura.create() - MODELO: Prefactura

✅ ===== PREFACTURA CREADA EN BASE DE DATOS =====
✅ Tabla utilizada: Prefactura (NO Factura)
✅ ID generado: xxx-xxx-xxx
✅ Número: PRE-XXX
✅ Líneas de detalle: X
✅ Enviando respuesta al cliente...
```

---

## 🧪 Cómo Verificar el Problema

### Paso 1: Iniciar el Backend

```bash
cd backend
npm run dev
```

### Paso 2: Iniciar el Frontend

```bash
cd ..
npm run dev
```

### Paso 3: Crear una Nueva Prefactura

1. Ir a: http://localhost:9002/prefactures/new
2. Llenar el formulario:
   - Número: `PRE-TEST-001`
   - Fecha: Hoy
   - Cliente: Seleccionar cualquiera
   - Agregar al menos una línea de detalle
3. Hacer clic en "Créer la Préfacture"

### Paso 4: Revisar los Logs

**En la consola del navegador (F12):**
- Deberías ver todos los logs con 🔵 y ✅
- Confirmar que dice "Endpoint a llamar: /api/prefacturas"
- Confirmar que la respuesta tiene el ID y número correcto

**En la terminal del backend:**
- Deberías ver "CREANDO PREFACTURA"
- Deberías ver "Llamando a prisma.prefactura.create()"
- Deberías ver "Tabla utilizada: Prefactura (NO Factura)"

### Paso 5: Verificar Dónde Aparece el Registro

Después de crear, verificar:

1. **Lista de Prefacturas:** http://localhost:9002/prefactures
   - ¿Aparece el registro `PRE-TEST-001`?

2. **Lista de Facturas:** http://localhost:9002/factures
   - ¿Aparece el registro aquí? (NO debería aparecer)

---

## 🔍 Posibles Causas del Problema

Si después de los logs confirmamos que el backend está guardando correctamente en `Prefactura`, pero el usuario dice que aparece en facturas, puede ser:

### 1. **Confusión de UI**
- El usuario está viendo la lista equivocada después de crear
- Solución: Verificar que después de crear, redirige a `/prefactures` y no a `/factures`

### 2. **Caché del navegador**
- Datos antiguos en caché
- Solución: Hacer hard refresh (Ctrl+Shift+R) en ambas páginas

### 3. **Datos antiguos en la base de datos**
- Registros creados antes de la corrección
- Solución: Verificar solo los nuevos registros creados con los logs

### 4. **Problema de sincronización**
- El frontend no se está recargando después de cambios
- Solución: Reiniciar el servidor de desarrollo

---

## 📊 Verificación en Base de Datos (Opcional)

Si quieres verificar directamente en la base de datos:

```bash
cd backend
npx prisma studio
```

Esto abrirá una interfaz web donde puedes ver:
- Tabla `Factura` - Facturas de venta
- Tabla `Prefactura` - Prefacturas de venta
- Tabla `LineaDetalle` - Líneas de detalle (con FK a ambas)

Verifica que cada registro esté en su tabla correcta.

---

## ✅ Próximos Pasos

1. **Ejecutar prueba de creación** con los logs activados
2. **Capturar la salida** de los logs (frontend y backend)
3. **Verificar dónde aparece** el registro (prefacturas o facturas)
4. **Reportar resultados:**
   - Si aparece en prefacturas ✅ = Problema resuelto (era confusión)
   - Si aparece en facturas ❌ = Enviar los logs para análisis más profundo

---

## 📝 Notas Adicionales

### Diferencias entre Prefactura y Factura

Ambas comparten la misma estructura pero son documentos diferentes:

- **Prefactura:** Documento provisional, puede convertirse en factura
- **Factura:** Documento definitivo, tiene valor legal

En la base de datos son **tablas completamente separadas**, sin ninguna relación entre ellas excepto que ambas pueden tener líneas de detalle.

### Estructura de las Líneas de Detalle

La tabla `LineaDetalle` puede pertenecer a:
- Una `Factura` (campo `facturaId`)
- Una `Prefactura` (campo `prefacturaId`)
- Una `FacturaCompra` (campo `facturaCompraId`)
- Una `PrefacturaCompra` (campo `prefacturaCompraId`)

Todos estos campos son opcionales (nullable), y solo UNO debe tener valor para cada línea.

---

**Documentado por:** Claude Code
**Fecha:** 2025-10-28
**Estado:** Logging diagnóstico implementado ✅
