# 📄 Sistema de Impresión Profesional - ALY Gestion

**Fecha:** 2025-10-26
**Estado:** ✅ Implementado para Facturas y Préfactures

---

## 🎯 Problema Resuelto

**ANTES:**
- ❌ Al imprimir aparecían elementos de la interfaz:
  - Sidebar y menú de navegación
  - Breadcrumbs ("Accueil > Facture > ID")
  - Filtros de búsqueda
  - Botones (Imprimir, Éditer, etc.)
  - Toasts de notificación ("Factura actualizada correctamente")
  - Header con logo de usuario
  - Cards con sombras y bordes

**AHORA:**
- ✅ Solo se imprime el documento profesional
- ✅ Formato A4 limpio y corporativo
- ✅ Sin elementos de la interfaz
- ✅ Listo para enviar a clientes

---

## 🔧 Solución Implementada

### 1. Estilos Globales de Impresión

**Archivo:** `src/app/globals.css`

**Funcionalidad:**
```css
@media print {
  /* Oculta TODO por defecto */
  body * {
    visibility: hidden !important;
  }

  /* Muestra SOLO el documento */
  .facture-print,
  .facture-print * {
    visibility: visible !important;
  }
}
```

**Elementos Ocultos al Imprimir:**
- ✅ Sidebar completo
- ✅ Header y navegación
- ✅ Breadcrumbs
- ✅ Botones (todos)
- ✅ Inputs de búsqueda y filtros
- ✅ Toasts y notificaciones
- ✅ Avatares y menú de usuario
- ✅ Scrollbars
- ✅ Cualquier elemento con clase `no-print`

---

### 2. Componentes de Impresión Profesional

#### A. FacturePrint

**Archivo:** `src/components/factures/facture-print.tsx`

**Características:**
```
┌─────────────────────────────────────────────────┐
│  A.L.Y TRAVAUX PUBLIQUE          FACTURE       │
│  ICE: XXX                        FAC-2024-001  │
│  N° TVA: XXX                                   │
├─────────────────────────────────────────────────┤
│  FOURNISSEUR          │  CLIENT                │
│  A.L.Y Travaux...     │  Entreprise Cliente    │
│  Adresse...           │  Adresse cliente...    │
├─────────────────────────────────────────────────┤
│  Date: 26 octobre 2025    Réf: PROJ-001       │
├─────────────────────────────────────────────────┤
│  N°  │ DÉSIGNATION  │ UNITÉ │ QTÉ │ P.U │ MT  │
│  001 │ Travaux...   │  m3   │ 100 │ 500 │5000 │
│  002 │ Travaux...   │  m2   │  50 │ 200 │1000 │
├─────────────────────────────────────────────────┤
│                    Montant HT:      6000.00 MAD │
│                    TVA (20%):       1200.00 MAD │
│                    Montant TTC:     7200.00 MAD │
├─────────────────────────────────────────────────┤
│  Arrêté à la somme de:                         │
│  SEPT MILLE DEUX CENTS DIRHAMS                 │
├─────────────────────────────────────────────────┤
│  Le Fournisseur          Le Client             │
│                                                 │
│  ________________        ________________       │
│  Cachet et Signature    Cachet et Signature    │
└─────────────────────────────────────────────────┘
```

**Detalles de Diseño:**
- Color corporativo: Azul #2563eb
- Fuente: Arial (profesional)
- Tamaño de página: A4 (210mm × 297mm)
- Márgenes: 15mm en todos los lados
- Header con logo de empresa
- Tabla limpia sin bordes excesivos
- Totales destacados visualmente
- Conversión de números a letras en francés
- Footer con información legal

#### B. PrefacturePrint

**Archivo:** `src/components/prefactures/prefacture-print.tsx`

**Diferencias con FacturePrint:**
- Título: "PRÉFACTURE" en lugar de "FACTURE"
- Footer: "Préfacture non définitive - Document généré électroniquement"
- Mismo diseño profesional

---

### 3. Páginas Actualizadas

#### Factures Detail Page

**Archivo:** `src/app/factures/[id]/page.tsx`

**Implementación:**
```tsx
return (
  <>
    {/* Vista de pantalla - con todos los elementos UI */}
    <div className="space-y-6 print:hidden">
      <Header />
      <Buttons />
      <FactureDetail factura={factura} />
    </div>

    {/* Vista de impresión - solo documento */}
    <div className="hidden print:block">
      <FacturePrint factura={factura} />
    </div>
  </>
);
```

**Clases Tailwind Utilizadas:**
- `print:hidden` - Oculta en impresión, muestra en pantalla
- `hidden print:block` - Oculta en pantalla, muestra en impresión

---

## 📐 Especificaciones Técnicas

### Formato de Página

```css
@page {
  size: A4;           /* 210mm × 297mm */
  margin: 15mm;       /* Márgenes uniformes */
}
```

### Conversión de Números a Letras

**Función:** `numeroALetras(num: number): string`

**Ejemplo:**
```javascript
numeroALetras(7245.50)
// Resultado: "sept mille deux cent quarante-cinq dirhams et cinquante centimes"
```

**Características:**
- Soporta hasta millones
- Formato en francés
- Incluye decimales (centimes)
- Maneja casos especiales (dix-sept, quatre-vingt-dix, etc.)

### Colores Corporativos

```css
--primary-color: #2563eb;     /* Azul corporativo */
--text-color: #000000;        /* Negro para texto */
--gray-color: #666666;        /* Gris para información secundaria */
--light-bg: #f8fafc;          /* Fondo claro para secciones */
```

---

## 🎨 Elementos de Diseño

### Header Corporativo

```
┌─────────────────────────────────────────────────┐
│  A.L.Y TRAVAUX PUBLIQUE (en azul, grande)      │
│  ICE: [XXX]  N° TVA: [XXX]                     │
│  Adresse: [XXX]  Tél: [XXX]                    │
├─────────────────────────────────────────────────┤
```

### Información de Partes

```
┌──────────────────────┬──────────────────────────┐
│  FOURNISSEUR         │  CLIENT                  │
│  (Fondo gris claro   │  (Fondo gris claro       │
│   con borde azul)    │   con borde azul)        │
└──────────────────────┴──────────────────────────┘
```

### Tabla de Líneas

```
┌────────────────────────────────────────────────┐
│  N° │ DÉSIGNATION │ UNITÉ │ QTÉ │ P.U │ MONT │
│  (Header en azul con texto blanco)            │
├────────────────────────────────────────────────┤
│  01 │ Travaux...  │  m3   │ 100 │ 500 │ 5000 │
│  (Filas con hover gris claro)                 │
└────────────────────────────────────────────────┘
```

### Totales

```
┌────────────────────────────────────┐
│  Montant HT:     6000.00 MAD      │
│  TVA (20%):      1200.00 MAD      │
├────────────────────────────────────┤
│  Montant TTC:    7200.00 MAD      │
│  (Fondo azul con texto blanco)    │
└────────────────────────────────────┘
```

---

## 🚀 Cómo Usar

### Para el Usuario Final

1. **Ver la factura en pantalla:**
   - Navega a Factures → Click en una factura
   - Ves la factura con todos los elementos de la UI (botones, sidebar, etc.)

2. **Imprimir o Guardar como PDF:**
   - Click en botón "Imprimer / PDF"
   - Se abre el diálogo de impresión del navegador
   - **Solo aparece el documento profesional**
   - Opciones:
     - Imprimir directamente
     - Guardar como PDF
     - Enviar por email

3. **Ajustes en el Diálogo de Impresión:**
   - Orientación: Vertical (recomendado)
   - Márgenes: Predeterminados (15mm ya configurados)
   - Escala: 100%
   - Fondo gráfico: Activado (para ver colores)

---

## ✅ Checklist de Elementos Ocultos

Al imprimir, estos elementos NO aparecen:

- [x] Sidebar izquierdo completo
- [x] Header superior con logo de usuario
- [x] Breadcrumbs (Accueil > Facture > ID)
- [x] Botones (Imprimir, Éditer, Retour, etc.)
- [x] Input de búsqueda
- [x] Filtros
- [x] Toasts de notificación
- [x] Tooltips
- [x] Menús desplegables
- [x] Avatar de usuario
- [x] Scrollbars
- [x] Footer de la aplicación

---

## 📊 Documentos Soportados

| Documento | Estado | Archivo Component | Archivo Página |
|-----------|--------|-------------------|----------------|
| **Factures** | ✅ Completo | `factures/facture-print.tsx` | `factures/[id]/page.tsx` |
| **Préfactures** | ✅ Completo | `prefactures/prefacture-print.tsx` | `prefactures/[id]/page.tsx` |
| **Bons Livraison** | ⚠️ Pendiente | - | - |
| **Achat Factures** | ⚠️ Pendiente | - | - |
| **Achat Préfactures** | ⚠️ Pendiente | - | - |
| **Bons Réception** | ⚠️ Pendiente | - | - |

---

## 🔄 Para Aplicar a Otros Documentos

### Pasos para Bons de Livraison:

1. **Crear componente de impresión:**
   ```bash
   cp factures/facture-print.tsx bons-livraison/bon-livraison-print.tsx
   ```

2. **Adaptar el componente:**
   - Cambiar título: "BON DE LIVRAISON"
   - Remover totales monetarios (solo cantidades)
   - Adaptar tabla para materiales sin precios
   - Cambiar footer

3. **Actualizar página de detalle:**
   ```tsx
   // En bons-livraison/[id]/page.tsx
   import { BonLivraisonPrint } from '@/components/bons-livraison/bon-livraison-print';

   <div className="hidden print:block">
     <BonLivraisonPrint bonLivraison={data} />
   </div>
   ```

### Pasos para Achat Factures/Préfactures:

1. Copiar componentes de Vente
2. Cambiar:
   - "Cliente" → "Proveedor"
   - "Fournisseur" → "A.L.Y TRAVAUX PUBLIQUE"
   - Invertir posiciones en el documento
3. Actualizar páginas correspondientes

---

## 🐛 Solución de Problemas

### Problema: Aún aparecen elementos de la UI

**Solución:**
1. Verifica que `globals.css` esté importado
2. Asegúrate de que el componente tenga clase `facture-print`
3. Usa Chrome/Edge (mejor soporte de @media print)

### Problema: Colores no se ven

**Solución:**
En el diálogo de impresión:
- ✅ Activar "Gráficos de fondo" o "Background graphics"

### Problema: Márgenes incorrectos

**Solución:**
- Usa márgenes predeterminados del navegador
- No configures "Sin márgenes"
- Los 15mm están configurados en el @page

### Problema: Saltos de página incorrectos

**Solución:**
- Clases CSS `page-break-inside: avoid` ya aplicadas
- Si aún hay problemas, ajusta tamaño de fuente

---

## 📝 Notas Importantes

### Para Personalizar

**Información de la Empresa:**
Actualiza en los componentes de impresión:
```tsx
<div className="company-details">
  <div>ICE: [TU_ICE]</div>
  <div>N° TVA: [TU_TVA]</div>
  <div>Adresse: [TU_ADRESSE]</div>
  <div>Tél: [TU_TELEPHONE]</div>
</div>
```

**Logo de Empresa:**
Para agregar logo, modifica el header:
```tsx
<div className="facture-header">
  <img src="/logo.png" alt="Logo" style={{ width: '120px' }} />
  <div className="company-name">A.L.Y TRAVAUX PUBLIQUE</div>
</div>
```

---

## ✅ Resultado Final

### Vista en Pantalla
- Interfaz completa de la aplicación
- Sidebar, botones, breadcrumbs
- Elementos interactivos

### Vista de Impresión / PDF
- **Solo** el documento profesional
- Sin elementos de UI
- Formato A4 limpio
- Listo para entregar al cliente

---

## 📞 Soporte

Si necesitas ayuda o quieres aplicar estos cambios a otros documentos, consulta:

1. Este documento: `IMPRESION_PROFESIONAL.md`
2. Archivo de estilos: `src/app/globals.css`
3. Componentes de ejemplo:
   - `src/components/factures/facture-print.tsx`
   - `src/components/prefactures/prefacture-print.tsx`

---

**Documentado por:** Claude Code
**Fecha:** 2025-10-26
**Versión:** 1.0
