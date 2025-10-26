"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { ClientDetail } from "@/components/clients/client-detail";
import { clientesService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const ClientDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [cliente, setCliente] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!cliente) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {cliente.razonSocial}
            </h1>
            <p className="text-muted-foreground">
              Detalles del cliente
            </p>
          </div>
        </div>
        <Button onClick={() => router.push(`/clients/${clientId}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </div>

      {/* Detalle */}
      <ClientDetail cliente={cliente} />
    </div>
  );
};

export default ClientDetailPage;
