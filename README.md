# ALY Gestion - Documentación del Proyecto

Esta es una aplicación de gestión empresarial creada para **A.L.Y Travaux Publique**, diseñada para centralizar y simplificar la administración de documentos comerciales clave. La aplicación está construida sobre una base tecnológica moderna que incluye Next.js, React, TypeScript y ShadCN para los componentes de interfaz.

## Estructura General del Proyecto
## Desarrollo local

### Backend

Variables de entorno en `backend/.env`:

```
PORT=3001
FRONTEND_URL=http://localhost:9002
JWT_SECRET=super-secret-change-me
JWT_EXPIRES_IN=7d
DATABASE_URL="file:./dev.db"
```

Comandos:

```
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

### Frontend

Variables de entorno en `./.env.local` (opcional en local porque usamos rewrite):

```
BACKEND_URL=http://localhost:3001
```

Comandos:

```
npm install
npm run dev
```

El frontend se sirve en `http://localhost:9002` y las llamadas a `/api/*` se reescriben al backend en `http://localhost:3001/api/*`.

La aplicación se organiza en torno a cuatro (4) bloques funcionales principales e independientes, cada uno gestionando un área específica del negocio:

1.  **Vente**: Gestión de todo el ciclo de ventas, desde los clientes hasta la facturación.
2.  **Achat**: Control de las compras a proveedores.
3.  **Frais d'Essence**: Seguimiento detallado de los gastos de carburante.
4.  **Location Matériel**: Administración de las hojas de alquiler de maquinaria y equipos.

---

## 1. Módulo de Vente

Este módulo cubre todas las interacciones con los clientes.

### Páginas y Sub-páginas

-   `/clients`: Lista de todos los clientes.
    -   `/clients/new`: Formulario para crear un nuevo cliente.
    -   `/clients/[id]`: Vista detallada de un cliente con sus documentos asociados (facturas, préfactures, bons de livraison).
    -   `/clients/[id]/edit`: Formulario para editar la información de un cliente.
-   `/prefactures`: Listado de todas las préfactures de venta.
    -   `/prefactures/[id]`: Vista detallada de una préfacture específica.
    -   `/prefactures/[id]/edit`: Formulario para editar una préfacture.
-   `/factures`: Listado de todas las facturas de venta.
    -   `/factures/new`: Formulario para crear una nueva factura.
    -   `/factures/[id]`: Vista detallada de una factura específica.
    -   `/factures/[id]/edit`: Formulario para editar una factura.
-   `/bons-de-livraison`: Listado de todos los bons de livraison.
    -   `/bons-de-livraison/[id]`: Vista detallada de un bon de livraison.
    -   `/bons-de-livraison/[id]/edit`: Formulario para editar un bon de livraison.

### Estructura de Documentos (Venta)

-   **Prefacture / Facture**:
    -   **Información General**: Nº de documento, Fecha, Referencia del Proyecto.
    -   **Proveedor**: Razón social, Dirección, N° de TVA.
    -   **Cliente**: Razón social, Dirección, N° de TVA.
    -   **Líneas de Detalle (Items)**:
        -   `Nº de PRIX`: Identificador de la línea.
        -   `DESIGNATION DES OUVRAGES`: Descripción del trabajo o producto.
        -   `UNITÉ`: Unidad de medida (m3, m2, mL, U, etc.).
        -   `QUANTITÉ`: Cantidad.
        -   `PRIX UNITAIRE HT`: Precio por unidad sin impuestos.
        -   `MONTANT HT`: Total de la línea (Cantidad * Precio Unitario).
    -   **Totales**: Monto HT, TVA (20%), Monto TTC.
    -   **Pie de página**: Suma total en letras, lugar, fecha y espacio para sello y firma.

-   **Bon de Livraison**:
    -   **Información General**: Nº de BL, Fecha, Referencia del Proyecto.
    -   **Fournisseur**: Datos de la empresa que entrega.
    -   **Client**: Datos del cliente que recibe.
    -   **Líneas de Detalle (Items)**:
        -   `Nº de PRIX`: Identificador del material.
        -   `DESIGNATION DES MATERIAUX`: Nombre del material.
        -   `UNITÉ`: Unidad de medida (Tonne, Sac, kg, mL, etc.).
        -   `QUANTITÉ`: Cantidad entregada.
    -   **Pie de página**: Espacios para las firmas del livreur y del cliente.

---

## 2. Módulo de Achat

Este módulo gestiona la relación y los documentos con los proveedores.

### Páginas y Sub-páginas

-   `/fournisseurs`: Lista de todos los proveedores.
    -   `/fournisseurs/new`: Formulario para añadir un nuevo proveedor.
    -   `/fournisseurs/[id]/edit`: Formulario para editar un proveedor.
-   `/achats/prefactures`: Listado de préfactures de compra.
-   `/achats/factures`: Listado de facturas de compra.
-   `/achats/bons-de-reception`: Listado de bons de réception.

### Estructura de Documentos (Achat)

La estructura es similar a la del módulo de venta, pero en este caso, "A.L.Y Travaux Publique" actúa como el cliente.

---

## 3. Módulo de Frais d'Essence

Este bloque está dedicado exclusivamente al registro de gastos de carburante. Es una sección independiente para un seguimiento claro y sencillo.

### Página

-   `/frais-essence`: Tabla de seguimiento de todos los gastos de gasolina.

### Estructura de la Tabla

-   **Título**: Identifica la estación de servicio o el período (ej. "STATION AFRIQUIA - Juillet 2024").
-   **Columnas**:
    -   `DATE`: Fecha del gasto.
    -   `N° BL`: Número del recibo o bon de livraison.
    -   `DESIGNATION DU SERVICE (DS)`: Descripción (ej. vehículo, tipo de combustible).
    -   `MONTANT (MT)`: Coste total del gasto.
-   **Total**: Fila final con la suma `TOTAL TTC` de todos los montos.
-   **Acciones**: Botón para eliminar un registro, con un diálogo de confirmación y registro en el historial.

---

## 4. Módulo de Location Matériel

Este bloque se utiliza para registrar y totalizar los costes de alquiler de maquinaria por período (generalmente mensual).

### Páginas

-   `/location-materiel`: Listado de todas las hojas de location.
-   `/location-materiel/new`: Formulario para crear una nueva hoja.
-   `/location-materiel/[id]`: Vista detallada de una hoja de location.
-   `/location-materiel/[id]/edit`: Formulario para editar una hoja de location.

### Estructura de la Hoja de Location

-   **Título**: Identifica el período (ej. "Location Matériel - Juillet 2024").
-   **Secciones por Tipo de Material** (ej. NIVELEUSE, CITERNE):
    -   Cada sección puede tener un proveedor asociado.
    -   **Tabla de Registros**:
        -   `DATE`: Fecha del alquiler.
        -   `N° BL`: Número de bon de livraison asociado.
        -   `JRS` (Jours) / `V` (Voyages): Unidad de alquiler (días, viajes, etc.).
        -   `PU` (Prix Unitaire): Coste por unidad.
        -   `PT` (Prix Total): Coste total de la línea.
    -   **Subtotal**: Suma total por tipo de material.
-   **Total General**: Suma de todos los subtotales para obtener el `TOTAL GÉNÉRAL HT`.
