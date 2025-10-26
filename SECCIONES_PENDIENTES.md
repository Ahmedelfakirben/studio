# 🔴 Secciones Pendientes de Conexión a Base de Datos

## Resumen Ejecutivo

De las **44 páginas** del proyecto ALY Gestion:
- ✅ **16 páginas (36%)** están completamente integradas con la base de datos
- 🟡 **25 páginas (57%)** usan datos mock/estáticos
- ⚪ **3 páginas (7%)** son estáticas (login, dashboard, settings)

---

## 🔴 PRIORIDAD ALTA: Secciones sin Conexión

### 1. **Frais d'Essence** (Gastos de Carburante)

**Estado Actual:** ❌ Usa localStorage en lugar de la base de datos

**Archivos afectados:**
- `src/app/frais-essence/page.tsx` - Lista de gastos

**Problema:**
```typescript
// Línea 37: Usa datos mock de data.ts
const [expenses, setExpenses] = useState(() => getGasExpenses(searchTerm));

// Líneas 67-69: Guarda en localStorage en vez de API
const storedEvents = JSON.parse(localStorage.getItem('app_events') || '[]');
localStorage.setItem('app_events', JSON.stringify([...storedEvents, event]));
```

**Solución requerida:**
```typescript
// Reemplazar con:
import { fraisEssenceService } from '@/lib/api';

// En useEffect:
const fetchData = async () => {
  const response = await fraisEssenceService.getAll();
  setExpenses(response.data);
};

// Al eliminar:
await fraisEssenceService.delete(id);

// Al crear:
await fraisEssenceService.create(newExpense);
```

**Backend disponible:**
- ✅ Modelo Prisma: `FraisEssence` (líneas 161-169 de schema.prisma)
- ✅ API Service: `fraisEssenceService` en `src/lib/api.ts`
- ✅ Rutas backend: `/api/frais-essence` (backend/src/routes)

**Estimación de trabajo:** 2-3 horas

---

### 2. **Location Matériel** (Alquiler de Material)

**Estado Actual:** ❌ Usa datos mock de data.ts

**Archivos afectados:**
- `src/app/location-materiel/page.tsx` - Lista de hojas de location
- `src/app/location-materiel/new/page.tsx` - Crear nueva hoja (sin funcionalidad de guardar)
- `src/app/location-materiel/[id]/page.tsx` - Ver detalle (datos mock)
- `src/app/location-materiel/[id]/edit/page.tsx` - Editar (sin funcionalidad)

**Problema en page.tsx:**
```typescript
// Líneas 28, 33: Usa datos mock
const rentalSheets = getAllRentalSheets(searchTerm);
```

**Problema en new/page.tsx:**
```typescript
// Líneas 140-141: Botones sin funcionalidad
<Button variant="outline">Sauvegarder en Brouillon</Button>
<Button>Enregistrer</Button>
// No tienen onClick handlers implementados
```

**Solución requerida:**

#### Para `page.tsx` (Lista):
```typescript
import { locationMaterielService } from '@/lib/api';

const fetchData = async () => {
  const response = await locationMaterielService.getAll();
  setRentalSheets(response.data);
};
```

#### Para `new/page.tsx` (Crear):
```typescript
const handleSaveDraft = async () => {
  const newSheet = {
    titulo: `Location Matériel - ${month}`,
    periodo: month,
    proveedorId: selectedProveedor,
    registros: [...niveleuseData, ...citerneData],
    totalGeneral: calculateTotal()
  };
  await locationMaterielService.create({ ...newSheet, draft: true });
};

const handleSave = async () => {
  const newSheet = {
    titulo: `Location Matériel - ${month}`,
    periodo: month,
    proveedorId: selectedProveedor,
    registros: [...niveleuseData, ...citerneData],
    totalGeneral: calculateTotal()
  };
  await locationMaterielService.create(newSheet);
  router.push('/location-materiel');
};
```

#### Para `[id]/edit/page.tsx` (Editar):
```typescript
const handleUpdate = async () => {
  const updatedSheet = {
    titulo: `Location Matériel - ${month}`,
    periodo: month,
    proveedorId: selectedProveedor,
    registros: [...niveleuseData, ...citerneData],
    totalGeneral: calculateTotal()
  };
  await locationMaterielService.update(sheetId, updatedSheet);
  router.push(`/location-materiel/${sheetId}`);
};
```

**Backend disponible:**
- ✅ Modelo Prisma: `LocationMateriel` y `RegistroLocation` (líneas 172-196 de schema.prisma)
- ✅ API Service: `locationMaterielService` en `src/lib/api.ts`
- ✅ Rutas backend: `/api/location-materiel` (backend/src/routes)

**Estimación de trabajo:** 4-6 horas

---

## 🟡 PRIORIDAD MEDIA: Módulo Achat

Estas secciones tienen los servicios API comentados pero no están siendo usados.

### 3. **Achats - Factures** (Facturas de Compra)

**Archivos afectados:**
- `src/app/achats/factures/page.tsx` - Lista (API comentado)
- `src/app/achats/factures/new/page.tsx` - Crear (puede necesitar implementación)
- `src/app/achats/factures/[id]/page.tsx` - Ver detalle
- `src/app/achats/factures/[id]/edit/page.tsx` - Editar

**Problema:**
```typescript
// Líneas 22-59: API comentado, usa mock data
// const response = await facturasAchatService.getAll(); // COMENTADO
setTimeout(() => {
  setFacturas([
    { _id: '1', numero: 'FAC-ACHAT-2024-001', ... },
    { _id: '2', numero: 'FAC-ACHAT-2024-002', ... }
  ]);
}, 500);
```

**Solución:**
```typescript
// Descomentar y usar:
const response = await facturasAchatService.getAll();
setFacturas(response.data);
```

**Backend disponible:**
- ✅ Modelo Prisma: `FacturaCompra` (líneas 132-145 de schema.prisma)
- ✅ API Service: `facturasAchatService` en `src/lib/api.ts`
- ✅ Rutas backend: `/api/achats/facturas` (backend/src/routes)

**Estimación de trabajo:** 3-4 horas

---

### 4. **Achats - Préfactures** (Prefacturas de Compra)

**Archivos afectados:**
- `src/app/achats/prefactures/page.tsx` - Lista (API comentado)
- `src/app/achats/prefactures/new/page.tsx` - Crear
- `src/app/achats/prefactures/[id]/page.tsx` - Ver detalle
- `src/app/achats/prefactures/[id]/edit/page.tsx` - Editar

**Problema similar:** API comentado, usa mock data

**Backend disponible:**
- ⚠️ **NOTA**: No hay modelo `PrefacturaCompra` en Prisma
- **Acción requerida**: Crear modelo en schema.prisma o usar el modelo `FacturaCompra` con un campo `tipo`

**Estimación de trabajo:** 4-5 horas (incluye crear modelo si es necesario)

---

### 5. **Achats - Bons de Réception** (Notas de Recepción)

**Archivos afectados:**
- `src/app/achats/bons-de-reception/page.tsx` - Lista (API comentado)
- `src/app/achats/bons-de-reception/new/page.tsx` - Crear
- `src/app/achats/bons-de-reception/[id]/page.tsx` - Ver detalle
- `src/app/achats/bons-de-reception/[id]/edit/page.tsx` - Editar

**Problema:**
```typescript
// Líneas 22-50: API comentado
// const response = await bonsReceptionService.getAll(); // COMENTADO
setBons([
  { _id: '1', numero: 'BR-2024-001', ... },
  { _id: '2', numero: 'BR-2024-002', ... }
]);
```

**Backend disponible:**
- ✅ Modelo Prisma: `BonRecepcion` (líneas 148-158 de schema.prisma)
- ✅ API Service: `bonsReceptionService` en `src/lib/api.ts`
- ✅ Rutas backend: `/api/achats/bons-reception` (backend/src/routes)

**Estimación de trabajo:** 3-4 horas

---

## 📊 Resumen de Backend Disponible

| Módulo | Modelo Prisma | API Service | Rutas Backend | Estado |
|--------|---------------|-------------|---------------|--------|
| Frais Essence | ✅ FraisEssence | ✅ fraisEssenceService | ✅ /api/frais-essence | Listo |
| Location Matériel | ✅ LocationMateriel + RegistroLocation | ✅ locationMaterielService | ✅ /api/location-materiel | Listo |
| Achats Factures | ✅ FacturaCompra | ✅ facturasAchatService | ✅ /api/achats/facturas | Listo |
| Achats Préfactures | ❌ Falta modelo | ✅ prefacturasAchatService | ⚠️ Verificar | Necesita modelo |
| Achats Bons Réception | ✅ BonRecepcion | ✅ bonsReceptionService | ✅ /api/achats/bons-reception | Listo |

---

## 🎯 Plan de Acción Recomendado

### Fase 1: Módulos Independientes (Prioridad Alta)
**Tiempo estimado: 1 semana**

1. **Día 1-2: Frais d'Essence**
   - Conectar lista a API
   - Implementar crear/eliminar
   - Remover localStorage
   - Testing

2. **Día 3-5: Location Matériel**
   - Conectar lista a API
   - Implementar guardar en formulario nuevo
   - Implementar edición
   - Testing

### Fase 2: Módulo Achat (Prioridad Media)
**Tiempo estimado: 2 semanas**

1. **Semana 1:**
   - Descomentar y probar Achats/Factures
   - Implementar formularios de crear/editar
   - Descomentar y probar Achats/Bons Réception

2. **Semana 2:**
   - Crear modelo PrefacturaCompra (si se necesita)
   - Implementar Achats/Préfactures
   - Testing completo del módulo

---

## 🔧 Checklist Técnico

Para cada sección a conectar:

- [ ] Verificar que el modelo Prisma existe y está migrado
- [ ] Verificar que el servicio API está en `src/lib/api.ts`
- [ ] Verificar que las rutas backend existen en `backend/src/routes/`
- [ ] Probar endpoint con Postman/Insomnia
- [ ] Actualizar componente frontend para usar el servicio
- [ ] Remover datos mock
- [ ] Implementar manejo de errores
- [ ] Testing con datos reales
- [ ] Actualizar documentación

---

## 📝 Notas Importantes

1. **Todos los servicios API ya están creados** en `src/lib/api.ts`
2. **El backend está completo** con todas las rutas necesarias
3. **Solo falta conectar el frontend** a estos servicios existentes
4. **La mayoría del trabajo es descomentar código** y remover mock data
5. **Location Matériel necesita más trabajo** porque los formularios no tienen lógica de guardar

---

## 🚀 Próximos Pasos

1. **Antes de desplegar:** Completa al menos Frais d'Essence y Location Matériel
2. **Para MVP completo:** Completa también el módulo Achat
3. **Después del despliegue:** Puedes agregar funcionalidades incrementalmente

¿Por dónde quieres empezar? 😊
