"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ClientForm } from "@/components/clients/client-form";
import { clientesService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const EditClientPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [cliente, setCliente] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clientId = params.id as string;

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        setIsLoading(true);
        const response = await clientesService.getById(clientId);
        setCliente(response.data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.mensaje || "Error al cargar el cliente",
          variant: "destructive",
        });
        router.push("/clients");
      } finally {
        setIsLoading(false);
      }
    };

    if (clientId) {
      fetchCliente();
    }
  }, [clientId]);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await clientesService.update(clientId, data);
      toast({
        title: "Éxito",
        description: "Cliente actualizado correctamente",
      });
      router.push(`/clients/${clientId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al actualizar el cliente",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!cliente) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Cliente</h1>
          <p className="text-muted-foreground">
            Modifica la información del cliente
          </p>
        </div>
      </div>

      {/* Formulario */}
      <ClientForm
        initialData={{
          razonSocial: cliente.razonSocial,
          direccion: cliente.direccion,
          numeroTVA: cliente.numeroTVA || "",
          telefono: cliente.telefono || "",
          email: cliente.email || "",
        }}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        submitLabel="Actualizar Cliente"
      />
    </div>
  );
};

export default EditClientPage;
