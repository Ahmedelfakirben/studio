-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'usuario',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "razonSocial" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "numeroTVA" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "razonSocial" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "numeroTVA" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Factura" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL,
    "referenciaProyecto" TEXT,
    "clienteId" TEXT NOT NULL,
    "montoHT" REAL NOT NULL,
    "montTVA" REAL NOT NULL,
    "montoTTC" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Factura_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Prefactura" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL,
    "referenciaProyecto" TEXT,
    "clienteId" TEXT NOT NULL,
    "montoHT" REAL NOT NULL,
    "montTVA" REAL NOT NULL,
    "montoTTC" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Prefactura_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BonLivraison" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL,
    "referenciaProyecto" TEXT,
    "clienteId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BonLivraison_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LineaDetalle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numeroPrix" TEXT NOT NULL,
    "designacion" TEXT NOT NULL,
    "unidad" TEXT NOT NULL,
    "cantidad" REAL NOT NULL,
    "precioUnitario" REAL NOT NULL,
    "montoHT" REAL NOT NULL,
    "facturaId" TEXT,
    "prefacturaId" TEXT,
    "facturaCompraId" TEXT,
    CONSTRAINT "LineaDetalle_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LineaDetalle_prefacturaId_fkey" FOREIGN KEY ("prefacturaId") REFERENCES "Prefactura" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LineaDetalle_facturaCompraId_fkey" FOREIGN KEY ("facturaCompraId") REFERENCES "FacturaCompra" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LineaMaterial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numeroPrix" TEXT NOT NULL,
    "designacion" TEXT NOT NULL,
    "unidad" TEXT NOT NULL,
    "cantidad" REAL NOT NULL,
    "bonLivraisonId" TEXT NOT NULL,
    "bonRecepcionId" TEXT,
    CONSTRAINT "LineaMaterial_bonLivraisonId_fkey" FOREIGN KEY ("bonLivraisonId") REFERENCES "BonLivraison" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LineaMaterial_bonRecepcionId_fkey" FOREIGN KEY ("bonRecepcionId") REFERENCES "BonRecepcion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FacturaCompra" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL,
    "referenciaProyecto" TEXT,
    "proveedorId" TEXT NOT NULL,
    "montoHT" REAL NOT NULL,
    "montTVA" REAL NOT NULL,
    "montoTTC" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FacturaCompra_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BonRecepcion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL,
    "referenciaProyecto" TEXT,
    "proveedorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BonRecepcion_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FraisEssence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fecha" DATETIME NOT NULL,
    "numeroBL" TEXT NOT NULL,
    "designacionServicio" TEXT NOT NULL,
    "monto" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LocationMateriel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "proveedorId" TEXT,
    "totalGeneral" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LocationMateriel_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RegistroLocation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fecha" DATETIME NOT NULL,
    "numeroBL" TEXT NOT NULL,
    "tipoMaterial" TEXT NOT NULL,
    "unidad" TEXT NOT NULL,
    "cantidad" REAL NOT NULL,
    "precioUnitario" REAL NOT NULL,
    "precioTotal" REAL NOT NULL,
    "locationMaterielId" TEXT NOT NULL,
    CONSTRAINT "RegistroLocation_locationMaterielId_fkey" FOREIGN KEY ("locationMaterielId") REFERENCES "LocationMateriel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_numero_key" ON "Factura"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Prefactura_numero_key" ON "Prefactura"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "BonLivraison_numero_key" ON "BonLivraison"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "FacturaCompra_numero_key" ON "FacturaCompra"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "BonRecepcion_numero_key" ON "BonRecepcion"("numero");
