"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, Mail, Phone, MapPin, FileText, Receipt, Package } from "lucide-react";

interface Cliente {
  id: string;
  razonSocial: string;
  direccion: string;
  numeroTVA?: string;
  telefono?: string;
  email?: string;
  facturas?: any[];
  prefacturas?: any[];
  bonsLivraison?: any[];
}

interface ClientDetailProps {
  cliente: Cliente;
}

export function ClientDetail({ cliente }: ClientDetailProps) {
  const totalFacturas = cliente.facturas?.length || 0;
  const totalPrefacturas = cliente.prefacturas?.length || 0;
  const totalBons = cliente.bonsLivraison?.length || 0;

  return (
    <div className="space-y-6">
      {/* Información del Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Información del Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Razón Social
              </p>
              <p className="text-lg font-semibold">{cliente.razonSocial}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Número de TVA
              </p>
              <p className="text-lg">{cliente.numeroTVA || "—"}</p>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Dirección
                </p>
                <p className="text-base">{cliente.direccion}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">
                  Teléfono
                </p>
              </div>
              <p className="text-base">{cliente.telefono || "—"}</p>

              <div className="flex items-center gap-2 mb-1 mt-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
              </div>
              <p className="text-base">{cliente.email || "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Facturas
                </p>
                <p className="text-2xl font-bold">{totalFacturas}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Prefacturas
                </p>
                <p className="text-2xl font-bold">{totalPrefacturas}</p>
              </div>
              <Receipt className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Bons de Livraison
                </p>
                <p className="text-2xl font-bold">{totalBons}</p>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documentos Recientes */}
      {totalFacturas > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Facturas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Proyecto</TableHead>
                  <TableHead className="text-right">Monto TTC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cliente.facturas?.slice(0, 5).map((factura: any) => (
                  <TableRow key={factura.id}>
                    <TableCell className="font-medium">
                      {factura.numero}
                    </TableCell>
                    <TableCell>
                      {new Date(factura.fecha).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>{factura.referenciaProyecto || "—"}</TableCell>
                    <TableCell className="text-right">
                      {factura.montoTTC.toFixed(2)} MAD
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
