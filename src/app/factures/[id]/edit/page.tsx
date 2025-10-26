"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FactureForm } from "@/components/factures/facture-form";
import { facturasService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const EditFacturePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [factura, setFactura] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await facturasService.update(facturaId, data);
      toast({
        title: "Éxito",
        description: "Factura actualizada correctamente",
      });
      router.push(`/factures/${facturaId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al actualizar la factura",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!factura) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Éditer Facture</h1>
          <p className="text-muted-foreground">
            Modifie les informations de la facture {factura.numero}
          </p>
        </div>
      </div>

      {/* Formulario */}
      <FactureForm
        initialData={{
          numero: factura.numero,
          fecha: factura.fecha.split("T")[0],
          referenciaProyecto: factura.referenciaProyecto || "",
          clienteId: factura.clienteId,
          lineasDetalle: factura.lineasDetalle,
        }}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        submitLabel="Mettre à jour la Facture"
      />
    </div>
  );
};

export default EditFacturePage;
