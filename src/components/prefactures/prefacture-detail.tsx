"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, FileText, Hash } from "lucide-react";

interface Prefactura {
  id: string;
  numero: string;
  fecha: string;
  referenciaProyecto?: string;
  cliente: {
    razonSocial: string;
    direccion: string;
    numeroTVA?: string;
  };
  lineasDetalle: Array<{
    numeroPrix: string;
    designacion: string;
    unidad: string;
    cantidad: number;
    precioUnitario: number;
    montoHT: number;
  }>;
  montoHT: number;
  montTVA: number;
  montoTTC: number;
}

interface PrefactureDetailProps {
  prefactura: Prefactura;
}

export function PrefactureDetail({ prefactura }: PrefactureDetailProps) {
  const numeroALetras = (num: number): string => {
    return `${num.toFixed(2)} dirhams`;
  };

  return (
    <div className="space-y-6">
      {/* Header de la Prefactura */}
      <Card>
        <CardHeader className="bg-secondary/5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Préfacture de Vente</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                A.L.Y Travaux Publique
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {prefactura.numero}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información del Proveedor (Nosotros) */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Fournisseur
              </h3>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p className="font-medium text-foreground">A.L.Y Travaux Publique</p>
                <p>Adresse de l'entreprise</p>
                <p>N° TVA: XXXXXXXXXX</p>
              </div>
            </div>

            {/* Información del Cliente */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Client
              </h3>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p className="font-medium text-foreground">
                  {prefactura.cliente.razonSocial}
                </p>
                <p>{prefactura.cliente.direccion}</p>
                {prefactura.cliente.numeroTVA && (
                  <p>N° TVA: {prefactura.cliente.numeroTVA}</p>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Información de la Prefactura */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium">
                  {new Date(prefactura.fecha).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {prefactura.referenciaProyecto && (
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Référence Projet</p>
                  <p className="font-medium">{prefactura.referenciaProyecto}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">N° Préfacture</p>
                <p className="font-medium">{prefactura.numero}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Líneas de Detalle */}
      <Card>
        <CardHeader>
          <CardTitle>Détails des Ouvrages</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">N° PRIX</TableHead>
                <TableHead>DÉSIGNATION DES OUVRAGES</TableHead>
                <TableHead className="w-[100px]">UNITÉ</TableHead>
                <TableHead className="w-[100px] text-right">QUANTITÉ</TableHead>
                <TableHead className="w-[120px] text-right">PRIX U. HT</TableHead>
                <TableHead className="w-[120px] text-right">MONTANT HT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prefactura.lineasDetalle.map((linea, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{linea.numeroPrix}</TableCell>
                  <TableCell>{linea.designacion}</TableCell>
                  <TableCell>{linea.unidad}</TableCell>
                  <TableCell className="text-right">
                    {linea.cantidad.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {linea.precioUnitario.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {linea.montoHT.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="text-right font-semibold">
                  Montant HT:
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {prefactura.montoHT.toFixed(2)} MAD
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} className="text-right font-semibold">
                  TVA (20%):
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {prefactura.montTVA.toFixed(2)} MAD
                </TableCell>
              </TableRow>
              <TableRow className="bg-secondary/5">
                <TableCell colSpan={5} className="text-right font-bold text-lg">
                  Montant TTC:
                </TableCell>
                <TableCell className="text-right font-bold text-lg">
                  {prefactura.montoTTC.toFixed(2)} MAD
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      {/* Total en Letras */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Arrêté la présente préfacture à la somme de:
            </p>
            <p className="text-lg font-semibold uppercase">
              {numeroALetras(prefactura.montoTTC)}
            </p>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-8 mt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-8">Le Fournisseur</p>
              <div className="border-t border-muted-foreground pt-2">
                <p className="text-xs text-muted-foreground">Cachet et Signature</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-8">Le Client</p>
              <div className="border-t border-muted-foreground pt-2">
                <p className="text-xs text-muted-foreground">Cachet et Signature</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
