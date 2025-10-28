#!/bin/bash
# Script para crear componentes de Achat

cd src/components

# Crear directorio achats si no existe
mkdir -p achats

# Copiar y modificar factura-achat-print.tsx
cp factures/facture-print.tsx achats/facture-achat-print.tsx
sed -i 's/interface Factura/interface FacturaAchat/g' achats/facture-achat-print.tsx
sed -i 's/factura: Factura/facturaAchat: FacturaAchat/g' achats/facture-achat-print.tsx
sed -i 's/FacturePrint/FacturaAchatPrint/g' achats/facture-achat-print.tsx
sed -i 's/factura\./facturaAchat\./g' achats/facture-achat-print.tsx
sed -i 's/FACTURE/FACTURE D'\''ACHAT/g' achats/facture-achat-print.tsx
sed -i 's/cliente:/proveedor:/g' achats/facture-achat-print.tsx

# Copiar prefacture-achat-print.tsx
cp prefactures/prefacture-print.tsx achats/prefacture-achat-print.tsx
sed -i 's/interface Prefactura/interface PrefacturaAchat/g' achats/prefacture-achat-print.tsx
sed -i 's/prefactura: Prefactura/prefacturaAchat: PrefacturaAchat/g' achats/prefacture-achat-print.tsx
sed -i 's/PrefacturePrint/PrefacturaAchatPrint/g' achats/prefacture-achat-print.tsx
sed -i 's/prefactura\./prefacturaAchat\./g' achats/prefacture-achat-print.tsx
sed -i 's/PRÉFACTURE/PRÉFACTURE D'\''ACHAT/g' achats/prefacture-achat-print.tsx
sed -i 's/cliente:/proveedor:/g' achats/prefacture-achat-print.tsx

# Copiar bon-reception-print.tsx desde bon-livraison
cp bons-livraison/bon-livraison-print.tsx achats/bon-reception-print.tsx
sed -i 's/BonLivraison/BonRecepcion/g' achats/bon-reception-print.tsx
sed -i 's/bonLivraison/bonRecepcion/g' achats/bon-reception-print.tsx
sed -i 's/BON DE LIVRAISON/BON DE RÉCEPTION/g' achats/bon-reception-print.tsx
sed -i 's/N° Bon Livraison/N° Bon Réception/g' achats/bon-reception-print.tsx
sed -i 's/cliente:/proveedor:/g' achats/bon-reception-print.tsx

echo "✅ Componentes de Achat creados"
