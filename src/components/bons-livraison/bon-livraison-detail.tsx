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
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, FileText, Hash } from "lucide-react";

interface BonLivraison {
  id: string;
  numero: string;
  fecha: string;
  referenciaProyecto?: string;
  cliente: {
    razonSocial: string;
    direccion: string;
    numeroTVA?: string;
  };
  lineasMaterial: Array<{
    numeroPrix: string;
    designacion: string;
    unidad: string;
    cantidad: number;
  }>;
}

interface BonLivraisonDetailProps {
  bonLivraison: BonLivraison;
}

export function BonLivraisonDetail({ bonLivraison }: BonLivraisonDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header del Bon */}
      <Card>
        <CardHeader className="bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Bon de Livraison</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                A.L.Y Travaux Publique
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2 bg-green-100 text-green-700 border-green-300">
              {bonLivraison.numero}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información del Fournisseur (Nosotros) */}
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
                  {bonLivraison.cliente.razonSocial}
                </p>
                <p>{bonLivraison.cliente.direccion}</p>
                {bonLivraison.cliente.numeroTVA && (
                  <p>N° TVA: {bonLivraison.cliente.numeroTVA}</p>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Información del BL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium">
                  {new Date(bonLivraison.fecha).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {bonLivraison.referenciaProyecto && (
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Référence Projet</p>
                  <p className="font-medium">{bonLivraison.referenciaProyecto}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">N° BL</p>
                <p className="font-medium">{bonLivraison.numero}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Materiales */}
      <Card>
        <CardHeader>
          <CardTitle>Matériaux Livrés</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">N° PRIX</TableHead>
                <TableHead>DÉSIGNATION DES MATÉRIAUX</TableHead>
                <TableHead className="w-[120px]">UNITÉ</TableHead>
                <TableHead className="w-[120px] text-right">QUANTITÉ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bonLivraison.lineasMaterial.map((material, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{material.numeroPrix}</TableCell>
                  <TableCell>{material.designacion}</TableCell>
                  <TableCell>{material.unidad}</TableCell>
                  <TableCell className="text-right font-medium">
                    {material.cantidad.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Firmas */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-8">Le Livreur</p>
              <div className="border-t border-muted-foreground pt-2">
                <p className="text-xs text-muted-foreground">Signature</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-8">Le Client</p>
              <div className="border-t border-muted-foreground pt-2">
                <p className="text-xs text-muted-foreground">Signature</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
