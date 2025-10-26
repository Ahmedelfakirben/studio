# ✅ CHECKLIST RÁPIDO - VENTE no funciona

## 🚨 EJECUTA ESTOS COMANDOS EN ORDEN

### 1. Verificar Backend
```cmd
cd backend
npm run dev
```
**Espera a ver**: "Servidor corriendo en http://localhost:3001"

### 2. En OTRA terminal, verificar Frontend
```cmd
npm run dev
```
**Espera a ver**: "Local: http://localhost:9002"

### 3. Probar el backend directamente
Abre tu navegador y ve a:
```
http://localhost:3001
```
**Deberías ver**: `{"message":"API de ALY Gestion funcionando correctamente"}`

### 4. Probar endpoint de clientes
```
http://localhost:3001/api/clientes
```
**Deberías ver**: `{"mensaje":"No hay token, autorización denegada"}`
**Esto es CORRECTO** - significa que el endpoint existe

### 5. Ir al frontend
```
http://localhost:9002/login
```
Login con:
- Email: `admin@alygestion.com`
- Password: `admin123`

### 6. Después del login, ir a:
```
http://localhost:9002/clients
```

### 7. Abrir DevTools (F12)
- Click en pestaña "Console"
- ¿Hay errores en ROJO?
  - **SÍ**: Cópiame TODO el error
  - **NO**: Pasa al siguiente paso

### 8. En DevTools, ir a pestaña "Network"
- Recargar la página (F5)
- Buscar petición a "clientes"
- Click en ella
- ¿Qué Status Code muestra?
  - **200**: Backend funciona, ve al paso 9
  - **401**: No estás autenticado, repite paso 5
  - **404**: Ruta no encontrada, hay problema de configuración
  - **500**: Error del servidor, mira logs del backend

### 9. Si Status es 200, ver la respuesta
- En Network, con "clientes" seleccionado
- Click en pestaña "Response"
- ¿Qué muestra?
  - **[]** (array vacío): No hay clientes en BD → Ve al paso 10
  - **Array con datos**: ¡FUNCIONA! El problema es visual
  - **Error**: Cópiame el mensaje

### 10. Si no hay datos en BD
```cmd
cd backend
npx prisma db seed
```
Espera a ver: "Carga de datos iniciales completada"
Luego recarga `/clients` en el navegador

---

## 📊 RESULTADO

Después de seguir estos pasos, dime:

**A) ¿En qué paso te quedaste?**
- Paso número: ___

**B) ¿Qué viste/pasó?**
- Descripción: _______

**C) ¿Hay algún error?**
- Error completo: _______

---

## 🎯 RESPUESTAS RÁPIDAS

**Q: Veo pantalla en blanco**
A: Problema de autenticación. Repite paso 5.

**Q: Veo loading infinito**
A: Backend no responde. Verifica paso 1.

**Q: Veo tabla vacía pero sin error**
A: No hay datos. Ejecuta paso 10.

**Q: Sale error 401**
A: Token inválido. Borra cookies y repite paso 5.

**Q: Sale error "Cannot GET /clients"**
A: Ruta frontend mal configurada. Verifica que page.tsx existe en `src/app/clients/`

---

Con esta info puedo ayudarte específicamente. 🎯
