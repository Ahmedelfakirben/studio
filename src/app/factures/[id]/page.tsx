"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Download } from "lucide-react";
import { FactureDetail } from "@/components/factures/facture-detail";
import { FacturePrint } from "@/components/factures/facture-print";
import { facturasService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const FactureDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [factura, setFactura] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const facturaId = params.id as string;

  useEffect(() => {
    const fetchFactura = async () => {
      try {
        setIsLoading(true);
        const response = await facturasService.getById(facturaId);
        setFactura(response.data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.mensaje || "Error al cargar la factura",
          variant: "destructive",
        });
        router.push("/factures");
      } finally {
        setIsLoading(false);
      }
    };

    if (facturaId) {
      fetchFactura();
    }
  }, [facturaId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!factura) {
    return null;
  }

  return (
    <>
      {/* Vista de pantalla - con botones */}
      <div className="space-y-6 print:hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Facture {factura.numero}
              </h1>
              <p className="text-muted-foreground">
                {factura.cliente.razonSocial}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" />
              Imprimer / PDF
            </Button>
            <Button onClick={() => router.push(`/factures/${facturaId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Éditer
            </Button>
          </div>
        </div>

        {/* Detalle para ver en pantalla */}
        <FactureDetail factura={factura} />
      </div>

      {/* Vista de impresión - profesional */}
      <div className="hidden print:block">
        <FacturePrint factura={factura} />
      </div>
    </>
  );
};

export default FactureDetailPage;
