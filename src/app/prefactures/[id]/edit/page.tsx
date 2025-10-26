"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PrefactureForm } from "@/components/prefactures/prefacture-form";
import { prefacturasService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const EditPrefacturePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [prefactura, setPrefactura] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const prefacturaId = params.id as string;

  useEffect(() => {
    const fetchPrefactura = async () => {
      try {
        setIsLoading(true);
        const response = await prefacturasService.getById(prefacturaId);
        setPrefactura(response.data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.mensaje || "Error al cargar la prefactura",
          variant: "destructive",
        });
        router.push("/prefactures");
      } finally {
        setIsLoading(false);
      }
    };

    if (prefacturaId) {
      fetchPrefactura();
    }
  }, [prefacturaId]);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await prefacturasService.update(prefacturaId, data);
      toast({
        title: "Éxito",
        description: "Prefactura actualizada correctamente",
      });
      router.push(`/prefactures/${prefacturaId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al actualizar la prefactura",
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

  if (!prefactura) {
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
          <h1 className="text-3xl font-bold tracking-tight">Éditer Préfacture</h1>
          <p className="text-muted-foreground">
            Modifie les informations de la préfacture {prefactura.numero}
          </p>
        </div>
      </div>

      {/* Formulario */}
      <PrefactureForm
        initialData={{
          numero: prefactura.numero,
          fecha: prefactura.fecha.split("T")[0],
          referenciaProyecto: prefactura.referenciaProyecto || "",
          clienteId: prefactura.clienteId,
          lineasDetalle: prefactura.lineasDetalle,
        }}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        submitLabel="Mettre à jour la Préfacture"
      />
    </div>
  );
};

export default EditPrefacturePage;
