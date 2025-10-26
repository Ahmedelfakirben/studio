"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PrefactureTable } from "@/components/prefactures/prefacture-table";
import { prefacturasService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const PrefacturesListPage: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [prefacturas, setPrefacturas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrefacturas = async () => {
    try {
      setIsLoading(true);
      const response = await prefacturasService.getAll();
      setPrefacturas(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al cargar las prefacturas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrefacturas();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await prefacturasService.delete(id);
      toast({
        title: "Éxito",
        description: "Prefactura eliminada correctamente",
      });
      fetchPrefacturas();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al eliminar la prefactura",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Préfactures de Vente</h1>
          <p className="text-muted-foreground">
            Gestiona todas las prefacturas de venta a clientes
          </p>
        </div>
        <Button onClick={() => router.push("/prefactures/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Préfacture
        </Button>
      </div>

      {/* Tabla */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <PrefactureTable prefacturas={prefacturas} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default PrefacturesListPage;
